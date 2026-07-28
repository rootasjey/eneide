import { blob } from 'hub:blob'
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireWriteAccess(event)
    const identifier = decodeURIComponent(getRouterParam(event, 'identifier') ?? '')
    if (!identifier) return apiError(event, 400, 'BAD_REQUEST', 'Post identifier is required')

    const body = await readBody(event)
    if (!body?.article) return apiError(event, 400, 'VALIDATION_ERROR', 'Article content is required')

    const apiPost: any = await getPostByIdentifier(db, identifier)
    if (!apiPost) return apiError(event, 404, 'NOT_FOUND', 'Post not found')
    if (apiPost.user_id !== user.id && user.role !== 'admin') return apiError(event, 403, 'FORBIDDEN', 'Not authorized')

    const articleBlob = new Blob([JSON.stringify(body.article)], { type: 'application/json' })
    await blob.put(apiPost.blob_path as string, articleBlob)

    await db.update(schema.posts).set({ updated_at: new Date().toISOString() }).where(eq(schema.posts.id, apiPost.id)).run()

    return apiSuccess(event, { message: 'Article updated successfully' })
  } catch (err: any) {
    console.error('[API v1] PUT /posts/:id/article error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to update article')
  }
})
