import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  slug: z.string().min(1).max(255),
  excludeId: z.coerce.number().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validated = querySchema.safeParse(query)

    if (!validated.success) {
      return apiError(event, 400, 'VALIDATION_ERROR', 'Invalid query parameters')
    }

    const { slug, excludeId } = validated.data

    const row = await db.query.posts.findFirst({
      where: eq(schema.posts.slug, slug),
      columns: { id: true },
    })

    const exists = !!row && (excludeId ? row.id !== excludeId : true)

    return apiSuccess(event, { exists, id: row?.id ?? null })
  } catch (err: any) {
    console.error('[API v1] GET /posts/slug/check error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to check slug')
  }
})
