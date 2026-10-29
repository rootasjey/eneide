// GET /api/tags
import { db, schema } from 'hub:db'
import { and, eq, like, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const whereClauses = [] as any[]

  if (query.category) {
    whereClauses.push(eq(schema.tags.category, String(query.category)))
  } else if (query.search) {
    whereClauses.push(like(schema.tags.name, `%${query.search}%`))
  }

  const rows = await db
    .select({
      tag: schema.tags,
      count: sql<number>`COUNT(DISTINCT ${schema.posts.id})`,
    })
    .from(schema.tags)
    .leftJoin(schema.post_tags, eq(schema.post_tags.tag_id, schema.tags.id))
    .leftJoin(schema.posts, and(
      eq(schema.posts.id, schema.post_tags.post_id),
      eq(schema.posts.status, 'published'),
    ))
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .groupBy(schema.tags.id)
    .orderBy(schema.tags.name)

  return rows.map(({ tag, count }) => ({ ...tag, count: Number(count) }))
})
