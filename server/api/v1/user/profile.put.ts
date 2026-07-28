import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const body = await readBody(event)
    if (!body || !Object.keys(body).length) {
      return apiError(event, 400, 'VALIDATION_ERROR', 'No fields to update')
    }

    const allowed = ['name', 'slug', 'email', 'biography', 'job', 'location', 'language', 'socials']
    const updateData: Record<string, any> = {}

    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    if (updateData.socials) {
      try { JSON.parse(updateData.socials) } catch {
        return apiError(event, 400, 'VALIDATION_ERROR', 'Invalid socials JSON format')
      }
    }

    updateData.updated_at = new Date().toISOString()

    try {
      await db.update(schema.users).set(updateData).where(eq(schema.users.id, session.user.id)).run()
    } catch (err: any) {
      if (err.message?.includes('UNIQUE')) {
        if (err.message?.includes('email')) return apiError(event, 409, 'CONFLICT', 'Email already exists')
        if (err.message?.includes('name')) return apiError(event, 409, 'CONFLICT', 'Username already exists')
        if (err.message?.includes('slug')) return apiError(event, 409, 'CONFLICT', 'Slug already exists')
      }
      throw err
    }

    const updated = await db.query.users.findFirst({
      columns: {
        id: true, name: true, slug: true, email: true, avatar: true,
        biography: true, job: true, location: true, language: true,
        socials: true, created_at: true, updated_at: true,
      },
      where: eq(schema.users.id, session.user.id),
    })

    await replaceUserSession(event, { user: { ...session.user, ...updated } })

    return apiSuccess(event, updated)
  } catch (err: any) {
    console.error('[API v1] PUT /user/profile error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to update profile')
  }
})
