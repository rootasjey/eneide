import { socialsSchema, setSocials } from '~~/server/utils/siteSettings'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    if (session.user.role !== 'admin') return apiError(event, 403, 'FORBIDDEN', 'Admin access required')

    const body = await readBody(event)
    const parsed = socialsSchema.safeParse(body?.socials ?? body)
    if (!parsed.success) return apiError(event, 400, 'VALIDATION_ERROR', 'Invalid socials format')

    await setSocials(parsed.data)
    return apiSuccess(event, { message: 'Site socials updated', socials: parsed.data })
  } catch (err: any) {
    console.error('[API v1] PUT /admin/site-settings error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to update site settings')
  }
})
