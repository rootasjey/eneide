import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { EneideClient, EneideApiError } from './index'
import type {
  Post,
  Tag,
  Author,
  BlogStats,
  SiteSettings,
  ApiKey,
  ApiKeyCreated,
  UserProfile,
  PaginatedResponse,
  SingleResponse,
} from './types'

const BASE_URL = 'https://example.com'
const API_KEY = 'sk-test-key'

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn())
})

function mockFetch<T>(data: T, status = 200) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

function mockFetchError(code: string, message: string, status: number) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve({ error: { code, message } }),
  } as Response)
}

// --- EneideApiError ---

describe('EneideApiError', () => {
  it('creates an error with message, code, and status', () => {
    const err = new EneideApiError('Not found', 'NOT_FOUND', 404)
    expect(err.message).toBe('Not found')
    expect(err.code).toBe('NOT_FOUND')
    expect(err.status).toBe(404)
    expect(err.name).toBe('EneideApiError')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(EneideApiError)
  })
})

// --- EneideClient ---

describe('EneideClient', () => {
  let client: EneideClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new EneideClient({ baseUrl: BASE_URL })
  })

  describe('constructor', () => {
    it('strips trailing slash from baseUrl', () => {
      const c = new EneideClient({ baseUrl: 'https://x.com/' })
      expect((c as any).baseUrl).toBe('https://x.com')
    })

    it('stores apiKey when provided', () => {
      const c = new EneideClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      expect((c as any).apiKey).toBe(API_KEY)
    })
  })

  // --- buildQuery ---

  describe('buildQuery', () => {
    it('returns empty string when params is undefined', () => {
      expect((client as any).buildQuery()).toBe('')
    })

    it('returns empty string when params is empty', () => {
      expect((client as any).buildQuery({})).toBe('')
    })

    it('filters out undefined and null values', () => {
      const qs = (client as any).buildQuery({ page: 1, search: undefined, tag: null })
      expect(qs).toBe('?page=1')
    })

    it('builds query string from params', () => {
      const qs = (client as any).buildQuery({ page: 2, limit: 10, tag: 'tech' })
      expect(qs).toBe('?page=2&limit=10&tag=tech')
    })
  })

  // --- request (private) ---

  describe('request', () => {
    it('sends a GET request to the correct URL', async () => {
      const mockResponse: SingleResponse<{ ok: boolean }> = { data: { ok: true } }
      mockFetch(mockResponse)

      const result = await (client as any).request('/test')
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/test`,
        expect.objectContaining({
          headers: expect.objectContaining({ 'content-type': 'application/json' }),
        }),
      )
    })

    it('includes authorization header when apiKey is set', async () => {
      const authedClient = new EneideClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      mockFetch({ data: null })

      await (authedClient as any).request('/test')
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: `Bearer ${API_KEY}` }),
        }),
      )
    })

    it('merges additional headers from options', async () => {
      mockFetch({ data: null })
      await (client as any).request('/test', { headers: { 'x-custom': 'val' } })
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'x-custom': 'val' }),
        }),
      )
    })

    it('throws EneideApiError on non-ok response', async () => {
      mockFetchError('FORBIDDEN', 'Access denied', 403)

      const err = await (client as any).request('/test').catch((e: unknown) => e)
      expect(err).toBeInstanceOf(EneideApiError)
      expect(err).toMatchObject({ message: 'Access denied', code: 'FORBIDDEN', status: 403 })
    })

    it('falls back to HTTP status message when error body is missing fields', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response)

      await expect((client as any).request('/test')).rejects.toMatchObject({
        message: 'HTTP 500',
        code: 'UNKNOWN_ERROR',
        status: 500,
      })
    })
  })

  // --- Resource methods ---

  describe('getPosts', () => {
    it('calls GET /posts with no params', async () => {
      const response: PaginatedResponse<Post> = {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }
      mockFetch(response)

      const result = await client.getPosts()
      expect(result).toEqual(response)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/posts`, expect.any(Object))
    })

    it('appends query params when provided', async () => {
      mockFetch({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } })
      await client.getPosts({ page: 2, limit: 5, tag: 'vue' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts?page=2&limit=5&tag=vue`,
        expect.any(Object),
      )
    })
  })

  describe('getPost', () => {
    it('calls GET /posts/:slug', async () => {
      mockFetch({ data: { id: 1, slug: 'hello', name: 'Hello' } })
      const result = await client.getPost('hello')
      expect(result).toEqual({ data: { id: 1, slug: 'hello', name: 'Hello' } })
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/posts/hello`, expect.any(Object))
    })

    it('encodes the slug', async () => {
      mockFetch({ data: { id: 1, slug: 'hello world', name: 'Hello' } })
      await client.getPost('hello world')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/hello%20world`,
        expect.any(Object),
      )
    })
  })

  describe('createPost', () => {
    it('calls POST /posts with payload', async () => {
      mockFetch({ data: { id: 1, slug: 'new', name: 'New Post' } })
      const payload = { name: 'New Post', status: 'draft' as const }
      const result = await client.createPost(payload)
      expect(result).toEqual({ data: { id: 1, slug: 'new', name: 'New Post' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      )
    })
  })

  describe('updatePost', () => {
    it('calls PUT /posts/:identifier with payload', async () => {
      mockFetch({ data: { id: 1, slug: 'hello', name: 'Updated' } })
      const result = await client.updatePost('hello', { name: 'Updated' })
      expect(result).toEqual({ data: { id: 1, slug: 'hello', name: 'Updated' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/hello`,
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Updated' }) }),
      )
    })

    it('accepts numeric identifier', async () => {
      mockFetch({ data: { id: 42 } })
      await client.updatePost(42, { name: 'Updated' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/42`,
        expect.any(Object),
      )
    })
  })

  describe('deletePost', () => {
    it('calls DELETE /posts/:identifier', async () => {
      mockFetch({ data: { id: 1, deleted: true } })
      const result = await client.deletePost('hello')
      expect(result).toEqual({ data: { id: 1, deleted: true } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/hello`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('getTags', () => {
    it('calls GET /tags', async () => {
      mockFetch({ data: [] })
      await client.getTags()
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/tags`, expect.any(Object))
    })

    it('appends params when provided', async () => {
      mockFetch({ data: [] })
      await client.getTags({ category: 'tech', search: 'vue' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/tags?category=tech&search=vue`,
        expect.any(Object),
      )
    })
  })

  describe('createTag', () => {
    it('calls POST /tags', async () => {
      mockFetch({ data: { id: 1 } })
      const payload = { name: 'Vue' }
      await client.createTag(payload)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/tags`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }),
      )
    })
  })

  describe('updateTag', () => {
    it('calls PUT /tags/:id', async () => {
      mockFetch({ data: { id: 1 } })
      await client.updateTag(1, { name: 'Nuxt' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/tags/1`,
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Nuxt' }) }),
      )
    })
  })

  describe('deleteTag', () => {
    it('calls DELETE /tags/:id', async () => {
      mockFetch({ data: { id: 1, deleted: true } })
      await client.deleteTag(1)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/tags/1`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('getAuthors', () => {
    it('calls GET /authors', async () => {
      mockFetch({ data: [] })
      const result = await client.getAuthors()
      expect(result).toEqual({ data: [] })
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/authors`, expect.any(Object))
    })
  })

  describe('getAuthor', () => {
    it('calls GET /authors/:id', async () => {
      mockFetch({ data: { id: 1, name: 'John' } })
      const result = await client.getAuthor(1)
      expect(result).toEqual({ data: { id: 1, name: 'John' } })
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/authors/1`, expect.any(Object))
    })
  })

  describe('getStats', () => {
    it('calls GET /stats', async () => {
      const stats: SingleResponse<BlogStats> = {
        data: { posts: 10, projects: 2, authorsTotal: 1, authorsWithPosts: 1 },
      }
      mockFetch(stats)
      const result = await client.getStats()
      expect(result).toEqual(stats)
    })
  })

  describe('search', () => {
    it('calls GET /search with q', async () => {
      mockFetch({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } })
      await client.search('vue')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/search?q=vue`,
        expect.any(Object),
      )
    })

    it('appends optional params', async () => {
      mockFetch({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } })
      await client.search('vue', { page: 2, limit: 5, language: 'en' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/search?q=vue&page=2&limit=5&language=en`,
        expect.any(Object),
      )
    })
  })

  describe('getSiteSettings', () => {
    it('calls GET /site-settings', async () => {
      mockFetch({ data: { title: 'My Blog' } })
      const result = await client.getSiteSettings()
      expect(result).toEqual({ data: { title: 'My Blog' } })
    })
  })

  describe('getDrafts', () => {
    it('calls GET /posts/drafts', async () => {
      mockFetch({ data: [] })
      const result = await client.getDrafts()
      expect(result).toEqual({ data: [] })
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/posts/drafts`, expect.any(Object))
    })
  })

  describe('getArchived', () => {
    it('calls GET /posts/archived', async () => {
      mockFetch({ data: [] })
      const result = await client.getArchived()
      expect(result).toEqual({ data: [] })
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/v1/posts/archived`, expect.any(Object))
    })

    it('passes search param', async () => {
      mockFetch({ data: [] })
      await client.getArchived({ search: 'vue' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/archived?search=vue`,
        expect.any(Object),
      )
    })
  })

  describe('duplicatePost', () => {
    it('calls POST /posts/:id/duplicate', async () => {
      mockFetch({ data: { id: 2, name: 'Copy' } })
      const result = await client.duplicatePost(1)
      expect(result).toEqual({ data: { id: 2, name: 'Copy' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/1/duplicate`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('works with string identifier', async () => {
      mockFetch({ data: { id: 3 } })
      await client.duplicatePost('my-post')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/my-post/duplicate`,
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('checkSlug', () => {
    it('calls GET /posts/slug/check with slug', async () => {
      mockFetch({ data: { exists: false, id: null } })
      const result = await client.checkSlug('my-slug')
      expect(result).toEqual({ data: { exists: false, id: null } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/slug/check?slug=my-slug`,
        expect.any(Object),
      )
    })

    it('includes excludeId when provided', async () => {
      mockFetch({ data: { exists: true, id: 1 } })
      const result = await client.checkSlug('my-slug', 1)
      expect(result).toEqual({ data: { exists: true, id: 1 } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/slug/check?slug=my-slug&excludeId=1`,
        expect.any(Object),
      )
    })
  })

  describe('login', () => {
    it('calls POST /login with email and password', async () => {
      mockFetch({ data: { id: 1, name: 'John' } })
      const result = await client.login('john@test.com', 'secret')
      expect(result).toEqual({ data: { id: 1, name: 'John' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'john@test.com', password: 'secret' }),
        }),
      )
    })
  })

  describe('logout', () => {
    it('calls POST /logout', async () => {
      mockFetch({ data: { success: true } })
      const result = await client.logout()
      expect(result).toEqual({ data: { success: true } })
    })
  })

  describe('register', () => {
    it('calls POST /register with payload', async () => {
      mockFetch({ data: { id: 1 } })
      const payload = { name: 'John', email: 'john@test.com', password: 'secret' }
      await client.register(payload)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/register`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }),
      )
    })
  })

  describe('getProfile', () => {
    it('calls GET /user/profile', async () => {
      mockFetch({ data: { id: 1, name: 'John' } })
      const result = await client.getProfile()
      expect(result).toEqual({ data: { id: 1, name: 'John' } })
    })
  })

  describe('updateProfile', () => {
    it('calls PUT /user/profile', async () => {
      mockFetch({ data: { id: 1, name: 'Updated' } })
      await client.updateProfile({ name: 'Updated' })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/user/profile`,
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Updated' }) }),
      )
    })
  })

  describe('listApiKeys', () => {
    it('calls GET /api-keys', async () => {
      mockFetch({ data: [] })
      const result = await client.listApiKeys()
      expect(result).toEqual({ data: [] })
    })
  })

  describe('createApiKey', () => {
    it('calls POST /api-keys', async () => {
      mockFetch({ data: { name: 'test', prefix: 'sk-', key: 'sk-xxx', message: 'ok' } })
      const result = await client.createApiKey('test')
      expect(result).toEqual({ data: { name: 'test', prefix: 'sk-', key: 'sk-xxx', message: 'ok' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/api-keys`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'test' }) }),
      )
    })
  })

  describe('revokeApiKey', () => {
    it('calls DELETE /api-keys/:id', async () => {
      mockFetch({ data: { id: 1, revoked: true } })
      const result = await client.revokeApiKey(1)
      expect(result).toEqual({ data: { id: 1, revoked: true } })
    })
  })

  describe('updateArticle', () => {
    it('calls PUT /posts/:id/article', async () => {
      mockFetch({ data: { message: 'ok' } })
      const article = { type: 'doc', content: [] }
      await client.updateArticle(1, article)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/1/article`,
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ article }) }),
      )
    })
  })

  describe('getPostImages', () => {
    it('calls GET /posts/:id/images', async () => {
      mockFetch({ data: [] })
      const result = await client.getPostImages(1)
      expect(result).toEqual({ data: [] })
    })
  })

  describe('getPostVideos', () => {
    it('calls GET /posts/:id/videos', async () => {
      mockFetch({ data: [] })
      const result = await client.getPostVideos(1)
      expect(result).toEqual({ data: [] })
    })
  })

  describe('getPostAudios', () => {
    it('calls GET /posts/:id/audios', async () => {
      mockFetch({ data: [] })
      const result = await client.getPostAudios(1)
      expect(result).toEqual({ data: [] })
    })
  })

  describe('deletePostImage', () => {
    it('calls DELETE /posts/:id/images?id=:imageId', async () => {
      mockFetch({ data: { id: 99, deleted: true } })
      await client.deletePostImage(1, 99)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/1/images?id=99`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('deletePostVideo', () => {
    it('calls DELETE /posts/:id/videos?id=:videoId', async () => {
      mockFetch({ data: { id: 5, deleted: true } })
      await client.deletePostVideo(1, 5)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/1/videos?id=5`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('deletePostAudio', () => {
    it('calls DELETE /posts/:id/audios?id=:audioId', async () => {
      mockFetch({ data: { id: 3, deleted: true } })
      await client.deletePostAudio(1, 3)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/1/audios?id=3`,
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('importPosts', () => {
    it('calls POST /posts/import with posts array', async () => {
      mockFetch({ data: { count: 1, posts: [] } })
      const posts = [{ name: 'Post 1' }]
      await client.importPosts(posts)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/posts/import`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(posts) }),
      )
    })
  })

  describe('subscribeNewsletter', () => {
    it('calls POST /newsletter/subscribe', async () => {
      mockFetch({ data: { ok: true, status: 'subscribed', alreadySubscribed: false, message: 'ok' } })
      const result = await client.subscribeNewsletter('test@test.com')
      expect(result).toEqual({ data: { ok: true, status: 'subscribed', alreadySubscribed: false, message: 'ok' } })
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/newsletter/subscribe`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'test@test.com' }) }),
      )
    })
  })

  describe('getLinkPreview', () => {
    it('calls GET /link-preview with url param', async () => {
      mockFetch({ data: { title: 'Example', description: null, image: null } })
      await client.getLinkPreview('https://example.com')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/link-preview?url=https%3A%2F%2Fexample.com`,
        expect.any(Object),
      )
    })
  })

  describe('clearOgCache', () => {
    it('calls GET /admin/clear-og-cache with key', async () => {
      mockFetch({ data: { deletedCount: 5, message: 'ok' } })
      await client.clearOgCache('some-key')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/admin/clear-og-cache?key=some-key`,
        expect.any(Object),
      )
    })

    it('includes optional type and slug', async () => {
      mockFetch({ data: { deletedCount: 0, message: 'ok' } })
      await client.clearOgCache('key', 'post', 'my-slug')
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/admin/clear-og-cache?key=key&type=post&slug=my-slug`,
        expect.any(Object),
      )
    })
  })

  describe('updateSiteSettings', () => {
    it('calls PUT /admin/site-settings with socials', async () => {
      mockFetch({ data: { message: 'ok', socials: [] } })
      const socials = [{ platform: 'twitter', url: 'https://x.com/test' }]
      await client.updateSiteSettings(socials)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/admin/site-settings`,
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ socials }) }),
      )
    })
  })

  // --- FormData upload methods ---

  describe('uploadAvatar', () => {
    it('sends POST /user/avatar with FormData', async () => {
      mockFetch({ data: { src: 'avatar.jpg', alt: 'Avatar' } })
      const file = new Blob(['data'], { type: 'image/jpeg' })
      const result = await client.uploadAvatar(file, 'avatar.jpg', 'image/jpeg')
      expect(result).toEqual({ data: { src: 'avatar.jpg', alt: 'Avatar' } })

      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[0]).toBe(`${BASE_URL}/api/v1/user/avatar`)
      expect(call[1]!.method).toBe('POST')
      expect(call[1]!.body).toBeInstanceOf(FormData)
    })

    it('includes auth header when apiKey is set', async () => {
      const authedClient = new EneideClient({ baseUrl: BASE_URL, apiKey: API_KEY })
      mockFetch({ data: { src: 'a.jpg', alt: 'A' } })
      await authedClient.uploadAvatar(new Blob(), 'a.jpg', 'image/jpeg')
      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[1]!.headers).toEqual({ authorization: `Bearer ${API_KEY}` })
    })

    it('throws on non-ok response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: () => Promise.resolve({ error: { code: 'FILE_TOO_LARGE', message: 'File too large' } }),
      } as Response)

      await expect(client.uploadAvatar(new Blob(), 'a.jpg', 'image/jpeg')).rejects.toThrow(EneideApiError)
    })
  })

  describe('deleteAvatar', () => {
    it('calls DELETE /user/avatar', async () => {
      mockFetch({ data: { deleted: true } })
      const result = await client.deleteAvatar()
      expect(result).toEqual({ data: { deleted: true } })
    })
  })

  describe('uploadPostImage', () => {
    it('sends POST /posts/:id/images with FormData', async () => {
      mockFetch({ data: { alt: 'img', src: 'img.jpg', storedPath: 'path' } })
      const file = new Blob(['data'])
      await client.uploadPostImage(1, file, 'img.jpg')
      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[0]).toBe(`${BASE_URL}/api/v1/posts/1/images`)
      expect(call[1]!.method).toBe('POST')
      expect(call[1]!.body).toBeInstanceOf(FormData)
    })
  })

  describe('uploadPostVideo', () => {
    it('sends POST /posts/:id/videos with FormData', async () => {
      mockFetch({ data: { src: 'v.mp4', storedPath: 'path', posterSrc: null } })
      const file = new Blob(['data'])
      await client.uploadPostVideo(1, file, 'v.mp4', 'video/mp4')
      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[0]).toBe(`${BASE_URL}/api/v1/posts/1/videos`)
      expect(call[1]!.method).toBe('POST')
      expect(call[1]!.body).toBeInstanceOf(FormData)
    })

    it('includes poster in FormData when provided', async () => {
      mockFetch({ data: { src: 'v.mp4', storedPath: 'path', posterSrc: 'poster.jpg' } })
      const file = new Blob(['data'])
      const poster = new Blob(['img'], { type: 'image/jpeg' })
      const formDataAppend = vi.spyOn(FormData.prototype, 'append')
      await client.uploadPostVideo(1, file, 'v.mp4', 'video/mp4', poster, 'poster.jpg', 'image/jpeg')
      expect(formDataAppend).toHaveBeenCalledWith('poster', poster, 'poster.jpg')
    })
  })

  describe('uploadPostCover', () => {
    it('sends POST /posts/:id/cover with FormData', async () => {
      mockFetch({ data: { alt: 'cover', src: 'cover.jpg', ext: 'jpg' } })
      const file = new Blob(['data'])
      await client.uploadPostCover(1, file, 'cover.jpg', 'image/jpeg')
      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[0]).toBe(`${BASE_URL}/api/v1/posts/1/cover`)
      expect(call[1]!.method).toBe('POST')
      expect(call[1]!.body).toBeInstanceOf(FormData)
    })
  })

  describe('uploadPostAudio', () => {
    it('sends POST /posts/:id/audios with FormData', async () => {
      mockFetch({ data: { src: 'a.mp3', storedPath: 'path' } })
      const file = new Blob(['data'])
      await client.uploadPostAudio(1, file, 'a.mp3')
      const call = vi.mocked(fetch).mock.calls[0]
      expect(call[0]).toBe(`${BASE_URL}/api/v1/posts/1/audios`)
      expect(call[1]!.method).toBe('POST')
      expect(call[1]!.body).toBeInstanceOf(FormData)
    })
  })
})
