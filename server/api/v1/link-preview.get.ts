function extractMeta(html: string) {
  const result: any = {}
  const ogTitle = /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i.exec(html)
  const ogImage = /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i.exec(html)
  const ogDesc = /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i.exec(html)
  const metaDesc = /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i.exec(html)
  const titleTag = /<title>([^<]+)<\/title>/i.exec(html)
  if (ogTitle) result.title = ogTitle[1]
  else if (titleTag) result.title = titleTag[1]
  if (ogImage) result.image = ogImage[1]
  if (ogDesc) result.description = ogDesc[1]
  else if (metaDesc) result.description = metaDesc[1]
  return result
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const url = (query.url as string) || ''
    if (!url) return apiError(event, 400, 'VALIDATION_ERROR', 'Missing url parameter')

    try { new URL(url) } catch {
      return apiError(event, 400, 'VALIDATION_ERROR', 'Invalid url')
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Eneide/LinkPreview' },
    })

    if (!res.ok) return apiSuccess(event, { title: null, description: null, image: null })

    const text = await res.text()
    const meta = extractMeta(text)
    return apiSuccess(event, { title: meta.title ?? null, description: meta.description ?? null, image: meta.image ?? null })
  } catch {
    return apiSuccess(event, { title: null, description: null, image: null })
  }
})
