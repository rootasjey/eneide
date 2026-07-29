import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = String(body?.email || '').trim().toLowerCase()
    if (!email || !email.includes('@')) return apiError(event, 400, 'VALIDATION_ERROR', 'Valid email is required')

    const session = await getUserSession(event).catch(() => null)
    const userId = session?.user?.id ?? null
    const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ?? ''
    const metadata = JSON.stringify({ ip, userAgent: getRequestHeader(event, 'user-agent') ?? '' })

    const existing = await db.query.newsletter_subscribers.findFirst({
      where: eq(schema.newsletter_subscribers.email, email),
    })

    await db.insert(schema.newsletter_subscribers).values({
      email, user_id: userId, status: 'subscribed', metadata,
    }).onConflictDoUpdate({
      target: schema.newsletter_subscribers.email,
      set: { status: 'subscribed', metadata, user_id: userId ?? undefined },
    }).run()

    return apiSuccess(event, {
      ok: true, status: 'subscribed',
      alreadySubscribed: existing?.status === 'subscribed',
      message: 'Thanks for subscribing!',
    })
  } catch (err: any) {
    console.error('[API v1] POST /newsletter/subscribe error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to subscribe')
  }
})
