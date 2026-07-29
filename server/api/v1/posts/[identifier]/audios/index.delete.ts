import { blob } from 'hub:blob'
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireWriteAccess(event)
    const identifier = decodeURIComponent(getRouterParam(event, 'identifier') ?? '')
    if (!identifier) return apiError(event, 400, 'BAD_REQUEST', 'Post identifier is required')

    const apiPost: any = await getPostByIdentifier(db, identifier)
    if (!apiPost) return apiError(event, 404, 'NOT_FOUND', 'Post not found')
    if (apiPost.user_id !== user.id && user.role !== 'admin') return apiError(event, 403, 'FORBIDDEN', 'Not authorized')

    const query = getQuery(event)
    const id = query.id ? Number(query.id) : null
    if (!id) return apiError(event, 400, 'VALIDATION_ERROR', 'Query parameter ?id= is required')

    const record = await db.query.post_audios.findFirst({ where: eq(schema.post_audios.id, id) })
    if (!record || record.post_id !== apiPost.id) return apiError(event, 404, 'NOT_FOUND', 'Audio not found')

    try { await blob.del(record.pathname.replace(/^\/+/, '')) } catch {}
    await db.delete(schema.post_audios).where(eq(schema.post_audios.id, record.id)).run()

    return apiSuccess(event, { id: record.id, deleted: true })
  } catch (err: any) {
    console.error('[API v1] DELETE /posts/:id/audios error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to delete audio')
  }
})
