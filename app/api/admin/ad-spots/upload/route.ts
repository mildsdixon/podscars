import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/podscars-admin"
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const AD_BUCKET = "podscars-ads"
const MAX_FILE_SIZE = 8 * 1024 * 1024
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
])

function getImageExtension(file: File) {
  const mimeExtension = allowedImageTypes.get(file.type.toLowerCase())

  if (mimeExtension) {
    return mimeExtension
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase()

  if (fileExtension === "jpg" || fileExtension === "jpeg") {
    return "jpg"
  }

  if (fileExtension === "png") {
    return "png"
  }

  return null
}

async function ensureAdBucket() {
  const supabase = getSupabaseAdminClient()
  const { error: getError } = await supabase.storage.getBucket(AD_BUCKET)

  if (!getError) {
    return
  }

  const { error: createError } = await supabase.storage.createBucket(AD_BUCKET, {
    public: true,
    allowedMimeTypes: Array.from(allowedImageTypes.keys()),
    fileSizeLimit: "8MB",
  })

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw createError
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get("file")
  const slot = Number(formData?.get("slot") || 0)

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a JPG or PNG file to upload." }, { status: 400 })
  }

  if (!Number.isInteger(slot) || slot < 1 || slot > 5) {
    return NextResponse.json({ error: "Choose a valid ad spot." }, { status: 400 })
  }

  const extension = getImageExtension(file)

  if (!extension) {
    return NextResponse.json({ error: "Only JPG and PNG ad images are supported." }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Ad images must be 8MB or smaller." }, { status: 400 })
  }

  await ensureAdBucket()

  const supabase = getSupabaseAdminClient()
  const contentType = extension === "png" ? "image/png" : "image/jpeg"
  const safeName = file.name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  const path = `homepage/spot-${slot}-${Date.now()}-${safeName || "ad"}.${extension}`

  const { error: uploadError } = await supabase.storage.from(AD_BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from(AD_BUCKET).getPublicUrl(path)
  const publicUrl = data.publicUrl
  const altText = file.name.replace(/\.[^.]+$/, "") || `Podscars advertising spot ${slot}`
  const { data: updatedSpot, error: updateError } = await supabase
    .from("ad_spots")
    .upsert(
      {
        id: slot,
        slot,
        image_url: publicUrl,
        alt_text: altText,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id, slot, image_url, alt_text, active")
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    url: publicUrl,
    altText,
    spot: {
      id: updatedSpot.id,
      slot: updatedSpot.slot,
      imageUrl: updatedSpot.image_url,
      altText: updatedSpot.alt_text || altText,
      active: updatedSpot.active !== false,
    },
  })
}
