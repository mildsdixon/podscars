import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/podscars-admin"
import { getPodscarsContent } from "@/lib/podscars-content"
import { mapSupabaseFinalists } from "@/lib/podscars-live"
import { getSupabaseAdminClient, isSupabaseConfigured, type SupabaseFinalistRow } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const finalistSchema = z.object({
  categoryId: z.string().min(1),
  nominees: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        subtitle: z.string().trim().optional(),
      }),
    )
    .min(1),
})

const finalistsPayloadSchema = z.object({
  finalists: z.array(finalistSchema).min(1),
})

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const content = await getPodscarsContent()

  return NextResponse.json({
    finalists: content.finalists,
    source: content.source,
  })
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = finalistsPayloadSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide at least one category with nominee choices." }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Live data is not configured, so ballot choices cannot be permanently saved." }, { status: 503 })
  }

  const content = await getPodscarsContent()
  const categoryIds = new Set(content.categories.map((category) => category.id))
  const finalists = parsed.data.finalists.filter((group) => categoryIds.has(group.categoryId))

  if (!finalists.length) {
    return NextResponse.json({ error: "No matching category titles were found for those ballot choices." }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient()
  const finalistCategoryIds = finalists.map((group) => group.categoryId)

  const { error: deleteError } = await supabase.from("finalists").delete().in("category_id", finalistCategoryIds)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  const rows = finalists.flatMap((group) =>
    group.nominees.map((nominee, index) => ({
      category_id: group.categoryId,
      name: nominee.name,
      subtitle: nominee.subtitle || "",
      active: true,
      sort_order: index,
    })),
  )

  const { data, error } = await supabase.from("finalists").insert(rows).select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    finalists: mapSupabaseFinalists((data || []) as SupabaseFinalistRow[], content.categories),
  })
}
