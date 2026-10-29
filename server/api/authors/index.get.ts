import { db, schema } from 'hub:db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      slug: schema.users.slug,
      avatar: schema.users.avatar,
      biography: schema.users.biography,
      job: schema.users.job,
      location: schema.users.location,
      socials: schema.users.socials,
      postCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${schema.posts}
        WHERE ${schema.posts.user_id} = ${schema.users.id}
          AND ${schema.posts.status} = 'published'
      )`,
    })
    .from(schema.users)
    .orderBy(schema.users.name)

  return rows.map((row) => ({
    ...row,
    socials: safeParseJson(row.socials),
  }))
})

function safeParseJson(val: string | null | undefined) {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : parsed ?? []
  } catch {
    return []
  }
}
