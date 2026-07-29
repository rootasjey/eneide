import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as Record<string, string | undefined>
    const providedKey = query.key || ''
    const type = query.type
    const slug = query.slug

    const config = useRuntimeConfig()
    const secret = config.ogCacheResetKey || ''
    if (!secret) return apiError(event, 403, 'FORBIDDEN', 'OG cache reset not enabled')
    if (!providedKey || providedKey !== secret) return apiError(event, 401, 'UNAUTHORIZED', 'Invalid key')

    let deletedCount = 0

    if (type && slug) {
      await blob.delete(`og/${type}/${slug}.png`)
      deletedCount = 1
    } else if (type) {
      const { blobs } = await blob.list({ prefix: `og/${type}/`, limit: 1000 })
      for (const b of blobs) { await blob.delete(b.pathname); deletedCount++ }
    } else {
      const { blobs } = await blob.list({ prefix: 'og/', limit: 1000 })
      for (const b of blobs) { await blob.delete(b.pathname); deletedCount++ }
    }

    return apiSuccess(event, { deletedCount, message: `Cleared ${deletedCount} OG image(s)` })
  } catch (err: any) {
    console.error('[API v1] GET /admin/clear-og-cache error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to clear OG cache')
  }
})
