import type {
  Post, Tag, Author, SiteSettings, BlogStats, PostStatus, PostLink,
  ApiKey, ApiKeyCreated, UserProfile,
  PaginatedResponse, SingleResponse, QueryParams,
  CreatePostPayload, UpdatePostPayload,
  CreateTagPayload, UpdateTagPayload,
} from './types'

export type { PostStatus, PostLink, Post, Tag, Author, SiteSettings, BlogStats, ApiKey, ApiKeyCreated, UserProfile, QueryParams, CreatePostPayload, UpdatePostPayload, CreateTagPayload, UpdateTagPayload }

export class EneideClient {
  private baseUrl: string
  private apiKey?: string

  constructor(config: { baseUrl: string; apiKey?: string }) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.apiKey = config.apiKey
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...(options?.headers as Record<string, string>),
    }

    if (this.apiKey) {
      headers['authorization'] = `Bearer ${this.apiKey}`
    }

    const res = await fetch(url, { ...options, headers })

    const body = await res.json()

    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(
        err?.error?.message ?? `HTTP ${res.status}`,
        err?.error?.code ?? 'UNKNOWN_ERROR',
        res.status,
      )
    }

    return body as T
  }

  private buildQuery(params?: QueryParams): string {
    if (!params) return ''
    const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    if (!entries.length) return ''
    return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
  }

  async getPosts(params?: QueryParams): Promise<PaginatedResponse<Post>> {
    return this.request<PaginatedResponse<Post>>(`/posts${this.buildQuery(params)}`)
  }

  async getPost(slug: string): Promise<SingleResponse<Post>> {
    return this.request<SingleResponse<Post>>(`/posts/${encodeURIComponent(slug)}`)
  }

  async exportPost(identifier: string | number): Promise<Blob> {
    const url = `${this.baseUrl}/api/v1/posts/${identifier}/export`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const err = body as { error?: { code?: string; message?: string } } | null
      throw new EneideApiError(
        err?.error?.message ?? `HTTP ${res.status}`,
        err?.error?.code ?? 'UNKNOWN_ERROR',
        res.status,
      )
    }
    return res.blob()
  }

  async getTags(params?: { category?: string; search?: string }): Promise<SingleResponse<Tag[]>> {
    return this.request<SingleResponse<Tag[]>>(`/tags${this.buildQuery(params as QueryParams)}`)
  }

  async getAuthors(): Promise<SingleResponse<Author[]>> {
    return this.request<SingleResponse<Author[]>>('/authors')
  }

  async getAuthor(id: number): Promise<SingleResponse<Author>> {
    return this.request<SingleResponse<Author>>(`/authors/${id}`)
  }

  async getStats(): Promise<SingleResponse<BlogStats>> {
    return this.request<SingleResponse<BlogStats>>('/stats')
  }

  async search(q: string, params?: { page?: number; limit?: number; language?: string }): Promise<PaginatedResponse<Post>> {
    return this.request<PaginatedResponse<Post>>(`/search${this.buildQuery({ q, ...params } as QueryParams)}`)
  }

  async getSiteSettings(): Promise<SingleResponse<SiteSettings>> {
    return this.request<SingleResponse<SiteSettings>>('/site-settings')
  }

  async listApiKeys(): Promise<SingleResponse<ApiKey[]>> {
    return this.request<SingleResponse<ApiKey[]>>('/api-keys')
  }

  async createApiKey(name: string): Promise<SingleResponse<ApiKeyCreated>> {
    return this.request<SingleResponse<ApiKeyCreated>>('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  async revokeApiKey(id: number): Promise<SingleResponse<{ id: number; revoked: boolean }>> {
    return this.request<SingleResponse<{ id: number; revoked: boolean }>>(`/api-keys/${id}`, {
      method: 'DELETE',
    })
  }

  async createPost(payload: CreatePostPayload): Promise<SingleResponse<Post>> {
    return this.request<SingleResponse<Post>>('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updatePost(identifier: string | number, payload: UpdatePostPayload): Promise<SingleResponse<Post>> {
    return this.request<SingleResponse<Post>>(`/posts/${identifier}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deletePost(identifier: string | number): Promise<SingleResponse<{ id: number; deleted: boolean }>> {
    return this.request<SingleResponse<{ id: number; deleted: boolean }>>(`/posts/${identifier}`, {
      method: 'DELETE',
    })
  }

  async createTag(payload: CreateTagPayload): Promise<SingleResponse<Tag>> {
    return this.request<SingleResponse<Tag>>('/tags', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updateTag(id: number, payload: UpdateTagPayload): Promise<SingleResponse<Tag>> {
    return this.request<SingleResponse<Tag>>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deleteTag(id: number): Promise<SingleResponse<{ id: number; deleted: boolean }>> {
    return this.request<SingleResponse<{ id: number; deleted: boolean }>>(`/tags/${id}`, {
      method: 'DELETE',
    })
  }

  async getDrafts(): Promise<SingleResponse<Post[]>> {
    return this.request<SingleResponse<Post[]>>('/posts/drafts')
  }

  async getProfile(): Promise<SingleResponse<UserProfile>> {
    return this.request<SingleResponse<UserProfile>>('/user/profile')
  }

  async updateProfile(payload: Partial<UserProfile>): Promise<SingleResponse<UserProfile>> {
    return this.request<SingleResponse<UserProfile>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async updateArticle(identifier: string | number, article: object): Promise<SingleResponse<{ message: string }>> {
    return this.request<SingleResponse<{ message: string }>>(`/posts/${identifier}/article`, {
      method: 'PUT',
      body: JSON.stringify({ article }),
    })
  }

  async register(payload: { name: string; email: string; password: string; biography?: string; job?: string; language?: string; location?: string }): Promise<SingleResponse<UserProfile>> {
    return this.request<SingleResponse<UserProfile>>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async logout(): Promise<SingleResponse<{ success: boolean }>> {
    return this.request<SingleResponse<{ success: boolean }>>('/logout', { method: 'POST' })
  }

  async uploadAvatar(file: Blob | File, fileName: string, type: string): Promise<SingleResponse<{ src: string; alt: string }>> {
    const form = new FormData()
    form.append('file', file, fileName)
    form.append('fileName', fileName)
    form.append('type', type)
    const url = `${this.baseUrl}/api/v1/user/avatar`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { method: 'POST', headers, body: form })
    const body = await res.json()
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(err?.error?.message ?? `HTTP ${res.status}`, err?.error?.code ?? 'UNKNOWN_ERROR', res.status)
    }
    return body
  }

  async deleteAvatar(): Promise<SingleResponse<{ deleted: boolean }>> {
    return this.request<SingleResponse<{ deleted: boolean }>>('/user/avatar', { method: 'DELETE' })
  }

  async login(email: string, password: string): Promise<SingleResponse<UserProfile>> {
    return this.request<SingleResponse<UserProfile>>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async getPostImages(identifier: string | number): Promise<SingleResponse<any[]>> {
    return this.request<SingleResponse<any[]>>(`/posts/${identifier}/images`)
  }

  async uploadPostImage(identifier: string | number, file: Blob | File, filename: string): Promise<SingleResponse<{ alt: string; src: string; storedPath: string }>> {
    const form = new FormData()
    form.append('file', file, filename)
    const url = `${this.baseUrl}/api/v1/posts/${identifier}/images`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { method: 'POST', headers, body: form })
    const body = await res.json()
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(err?.error?.message ?? `HTTP ${res.status}`, err?.error?.code ?? 'UNKNOWN_ERROR', res.status)
    }
    return body
  }

  async getPostVideos(identifier: string | number): Promise<SingleResponse<any[]>> {
    return this.request<SingleResponse<any[]>>(`/posts/${identifier}/videos`)
  }

  async uploadPostVideo(identifier: string | number, file: Blob | File, filename: string, type: string, poster?: Blob | File, posterFilename?: string, posterType?: string): Promise<SingleResponse<{ src: string; storedPath: string; posterSrc: string | null }>> {
    const form = new FormData()
    form.append('file', file, filename)
    if (poster && posterFilename && posterType) {
      form.append('poster', poster, posterFilename)
    }
    const url = `${this.baseUrl}/api/v1/posts/${identifier}/videos`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { method: 'POST', headers, body: form })
    const body = await res.json()
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(err?.error?.message ?? `HTTP ${res.status}`, err?.error?.code ?? 'UNKNOWN_ERROR', res.status)
    }
    return body
  }

  async deletePostVideo(identifier: string | number, videoId: number): Promise<SingleResponse<{ id: number; deleted: boolean }>> {
    return this.request<SingleResponse<{ id: number; deleted: boolean }>>(`/posts/${identifier}/videos?id=${videoId}`, { method: 'DELETE' })
  }

  async uploadPostCover(identifier: string | number, file: Blob | File, fileName: string, type: string): Promise<SingleResponse<{ alt: string; src: string; ext: string }>> {
    const form = new FormData()
    form.append('file', file, fileName)
    form.append('fileName', fileName)
    form.append('type', type)
    const url = `${this.baseUrl}/api/v1/posts/${identifier}/cover`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { method: 'POST', headers, body: form })
    const body = await res.json()
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(err?.error?.message ?? `HTTP ${res.status}`, err?.error?.code ?? 'UNKNOWN_ERROR', res.status)
    }
    return body
  }

  async deletePostImage(identifier: string | number, imageId: number): Promise<SingleResponse<{ id: number; deleted: boolean }>> {
    return this.request<SingleResponse<{ id: number; deleted: boolean }>>(`/posts/${identifier}/images?id=${imageId}`, {
      method: 'DELETE',
    })
  }

  async getPostAudios(identifier: string | number): Promise<SingleResponse<any[]>> {
    return this.request<SingleResponse<any[]>>(`/posts/${identifier}/audios`)
  }

  async uploadPostAudio(identifier: string | number, file: Blob | File, filename: string): Promise<SingleResponse<{ src: string; storedPath: string }>> {
    const form = new FormData()
    form.append('file', file, filename)
    const url = `${this.baseUrl}/api/v1/posts/${identifier}/audios`
    const headers: Record<string, string> = {}
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`
    const res = await fetch(url, { method: 'POST', headers, body: form })
    const body = await res.json()
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string } }
      throw new EneideApiError(err?.error?.message ?? `HTTP ${res.status}`, err?.error?.code ?? 'UNKNOWN_ERROR', res.status)
    }
    return body
  }

  async deletePostAudio(identifier: string | number, audioId: number): Promise<SingleResponse<{ id: number; deleted: boolean }>> {
    return this.request<SingleResponse<{ id: number; deleted: boolean }>>(`/posts/${identifier}/audios?id=${audioId}`, { method: 'DELETE' })
  }

  async importPosts(payload: { posts: CreatePostPayload[] } | CreatePostPayload[]): Promise<SingleResponse<{ count: number; posts: Post[] }>> {
    return this.request<SingleResponse<{ count: number; posts: Post[] }>>('/posts/import', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async subscribeNewsletter(email: string): Promise<SingleResponse<{ ok: boolean; status: string; alreadySubscribed: boolean; message: string }>> {
    return this.request<SingleResponse<{ ok: boolean; status: string; alreadySubscribed: boolean; message: string }>>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async getLinkPreview(url: string): Promise<SingleResponse<{ title: string | null; description: string | null; image: string | null }>> {
    return this.request<SingleResponse<{ title: string | null; description: string | null; image: string | null }>>(`/link-preview?url=${encodeURIComponent(url)}`)
  }

  async clearOgCache(key: string, type?: string, slug?: string): Promise<SingleResponse<{ deletedCount: number; message: string }>> {
    const params = new URLSearchParams({ key })
    if (type) params.set('type', type)
    if (slug) params.set('slug', slug)
    return this.request<SingleResponse<{ deletedCount: number; message: string }>>(`/admin/clear-og-cache?${params}`)
  }

  async updateSiteSettings(socials: any[]): Promise<SingleResponse<{ message: string; socials: any[] }>> {
    return this.request<SingleResponse<{ message: string; socials: any[] }>>('/admin/site-settings', {
      method: 'PUT',
      body: JSON.stringify({ socials }),
    })
  }
}

export class EneideApiError extends Error {
  code: string
  status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'EneideApiError'
    this.code = code
    this.status = status
  }
}
