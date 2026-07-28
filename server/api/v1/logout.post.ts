export default defineEventHandler(async (event) => {
  try {
    await replaceUserSession(event, {})
    return apiSuccess(event, { success: true })
  } catch (err: any) {
    console.error('[API v1] POST /logout error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to logout')
  }
})
