import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdSpots, updateAdSpots } from "@/lib/podscars-ads"
import { requireAdmin } from "@/lib/podscars-admin"

export const dynamic = "force-dynamic"

const imageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Use a full image URL or a site path that starts with /.",
  })

const adSpotSchema = z.object({
  id: z.number().int().min(1).max(5),
  slot: z.number().int().min(1).max(5),
  imageUrl: imageUrlSchema,
  altText: z.string().trim().min(1),
  active: z.boolean(),
})

const adSpotsSchema = z.object({
  spots: z.array(adSpotSchema).length(5),
})

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  return NextResponse.json({ spots: await getAdSpots() })
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = adSpotsSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide 5 valid 1200 x 628 ad image URLs." }, { status: 400 })
  }

  const spots = await updateAdSpots(parsed.data.spots)

  return NextResponse.json({ success: true, spots })
}
