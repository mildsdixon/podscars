import { NextResponse } from "next/server"
import { z } from "zod"
import { getPodscarsContent } from "@/lib/podscars-content"
import { requireAdmin } from "@/lib/podscars-admin"
import { getSupabaseAdminClient, isSupabaseConfigured, type SupabaseCategoryRow } from "@/lib/supabase"
import { mapSupabaseCategories } from "@/lib/podscars-live"

export const dynamic = "force-dynamic"

const categorySchema = z.object({
  title: z.string().trim().min(2),
  type: z.enum(["person", "podcast", "movie"]),
  description: z.string().trim().min(2),
  nominationPrompt: z.string().trim().min(2),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const content = await getPodscarsContent()

  return NextResponse.json({
    categories: content.categories,
    source: content.source,
  })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = categorySchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a title, type, description, and nomination prompt." }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Live data is not configured, so this preview cannot permanently save categories." }, { status: 503 })
  }

  const supabase = getSupabaseAdminClient()
  const baseId = slugify(parsed.data.title)

  if (!baseId) {
    return NextResponse.json({ error: "Use a category title with letters or numbers." }, { status: 400 })
  }

  const { data: existingRows, error: existingError } = await supabase.from("categories").select("id, sort_order")

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 })
  }

  const existingIds = new Set((existingRows || []).map((row) => row.id as string))
  let id = baseId
  let suffix = 2

  while (existingIds.has(id)) {
    id = `${baseId}-${suffix}`
    suffix += 1
  }

  const nextSortOrder =
    Math.max(
      -1,
      ...(existingRows || []).map((row) => {
        const sortOrder = row.sort_order
        return typeof sortOrder === "number" ? sortOrder : 0
      }),
    ) + 1

  const { data, error } = await supabase
    .from("categories")
    .insert({
      id,
      title: parsed.data.title,
      type: parsed.data.type,
      description: parsed.data.description,
      nomination_prompt: parsed.data.nominationPrompt,
      active: true,
      sort_order: nextSortOrder,
    })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const [category] = mapSupabaseCategories([data as SupabaseCategoryRow])

  return NextResponse.json({ success: true, category })
}
