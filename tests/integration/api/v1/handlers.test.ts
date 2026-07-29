import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as h3 from 'h3'
import { createHandlerEvent, callHandler } from '../../helpers/handler'
import { createTestDbSeeded } from '../../helpers/db'
import type { TestDb } from '../../helpers/db'

const state = vi.hoisted(() => {
  let testDb: TestDb | null = null
  return {
    db: () => testDb?.db ?? null,
    init: (t: TestDb) => { testDb = t },
  }
})

vi.mock('hub:db', async () => {
  const realSchema = await import('../../../../server/db/schema')
  return {
    schema: realSchema,
    db: new Proxy({} as any, {
      get(_, prop) {
        const currentDb = state.db()
        if (!currentDb) return undefined
        const value = (currentDb as any)[prop]
        if (typeof value !== 'function') return value
        return value.bind(currentDb)
      },
    }),
  }
})

vi.mock('hub:blob', () => ({
  blob: { put: vi.fn(), get: vi.fn(), del: vi.fn(), list: vi.fn().mockResolvedValue({ blobs: [] }) },
}))

const mockWriteUser = { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' as const, slug: 'admin' }

Object.assign(globalThis, {
  defineEventHandler: h3.defineEventHandler,
  readBody: h3.readBody,
  getRouterParam: h3.getRouterParam,
  setResponseStatus: h3.setResponseStatus,
  setResponseHeader: h3.setResponseHeader,
  getRequestHeader: h3.getRequestHeader,
  createError: h3.createError,
  requireUserSession: vi.fn().mockResolvedValue({ user: mockWriteUser }),
  requireWriteAccess: vi.fn().mockResolvedValue(mockWriteUser),
  setUserSession: vi.fn().mockResolvedValue(undefined),
  replaceUserSession: vi.fn().mockResolvedValue(undefined),
  verifyPassword: vi.fn().mockResolvedValue(true),
  hashPassword: vi.fn().mockImplementation((pw: string) => Promise.resolve(`hashed_${pw}`)),
  apiSuccess: vi.fn((event: any, data: any, meta?: any) => {
    h3.setResponseStatus(event, 200)
    h3.setResponseHeader(event, 'content-type', 'application/json')
    return { data, meta }
  }),
  apiCreated: vi.fn((event: any, data: any) => {
    h3.setResponseStatus(event, 201)
    h3.setResponseHeader(event, 'content-type', 'application/json')
    return { data }
  }),
  apiError: vi.fn((event: any, statusCode: number, code: string, message: string) => {
    h3.setResponseStatus(event, statusCode)
    h3.setResponseHeader(event, 'content-type', 'application/json')
    return { error: { code, message } }
  }),
  createPostData: null as any,
  createArticle: null as any,
  generateUniqueSlug: null as any,
  getPostByIdentifier: null as any,
  convertApiToPost: null as any,
})

beforeEach(async () => {
  const seeded = createTestDbSeeded()
  const origPrepare = seeded.sqlite.prepare.bind(seeded.sqlite)
  seeded.sqlite.prepare = ((sql: string) => {
    const stmt = origPrepare(sql)
    const origRun = stmt.run.bind(stmt)
    stmt.run = (...params: any[]) => {
      const result = origRun(...params)
      if (result && typeof result.changes === 'number' && result.rowsAffected === undefined) {
        return { ...result, rowsAffected: result.changes }
      }
      return result
    }
    return stmt
  }) as any
  state.init(seeded)
  vi.clearAllMocks()
  const post = await import('../../../../server/utils/post')
  globalThis.createPostData = post.createPostData
  globalThis.createArticle = post.createArticle
  globalThis.generateUniqueSlug = post.generateUniqueSlug
  globalThis.getPostByIdentifier = post.getPostByIdentifier
  globalThis.convertApiToPost = post.convertApiToPost
})

describe('POST /api/v1/login', () => {
  it('returns 200 with user data on valid credentials', async () => {
    vi.mocked(globalThis.verifyPassword).mockResolvedValue(true)
    const { default: handler } = await import('../../../../server/api/v1/login.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { email: 'admin@test.com', password: 'password123' } })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.email).toBe('admin@test.com')
  })

  it('returns 401 on wrong password', async () => {
    vi.mocked(globalThis.verifyPassword).mockResolvedValueOnce(false)
    const { default: handler } = await import('../../../../server/api/v1/login.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { email: 'admin@test.com', password: 'wrong' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'UNAUTHORIZED', message: 'Bad credentials' } })
  })

  it('returns 400 when email is missing', async () => {
    const { default: handler } = await import('../../../../server/api/v1/login.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { password: 'password123' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } })
  })
})

describe('POST /api/v1/register', () => {
  it('creates a user and returns 201', async () => {
    const { default: handler } = await import('../../../../server/api/v1/register.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'New User', email: 'new@test.com', password: 'password123' } })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.email).toBe('new@test.com')
    expect(result.data.name).toBe('New User')
  })

  it('returns 409 when email already exists', async () => {
    const { default: handler } = await import('../../../../server/api/v1/register.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'Another User', email: 'admin@test.com', password: 'password123' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'CONFLICT', message: 'User with this email or name already exists' } })
  })

  it('returns 400 when password is too short', async () => {
    const { default: handler } = await import('../../../../server/api/v1/register.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'New User', email: 'new@test.com', password: 'short' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters' } })
  })
})

describe('POST /api/v1/tags', () => {
  it('creates a tag and returns 201', async () => {
    const { default: handler } = await import('../../../../server/api/v1/tags/index.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'svelte', category: 'framework' } })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.name).toBe('svelte')
  })

  it('returns 409 for duplicate tag', async () => {
    const { default: handler } = await import('../../../../server/api/v1/tags/index.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'vue', category: 'framework' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'CONFLICT', message: 'Tag already exists' } })
  })

  it('returns 400 when name is missing', async () => {
    const { default: handler } = await import('../../../../server/api/v1/tags/index.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: {} })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'VALIDATION_ERROR', message: 'Tag name is required' } })
  })
})

describe('DELETE /api/v1/tags/:id', () => {
  it('deletes a tag and returns 200', async () => {
    const { default: handler } = await import('../../../../server/api/v1/tags/[id].delete')
    const mockEvent = createHandlerEvent({ method: 'DELETE', path: '/api/v1/tags/1', params: { id: '1' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ data: { id: 1, deleted: true } })
  })

  it('returns 404 for non-existent tag', async () => {
    const { default: handler } = await import('../../../../server/api/v1/tags/[id].delete')
    const mockEvent = createHandlerEvent({ method: 'DELETE', path: '/api/v1/tags/999', params: { id: '999' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'NOT_FOUND', message: 'Tag not found' } })
  })
})

describe('POST /api/v1/posts', () => {
  it('creates a post and returns 201', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/index.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: { name: 'Test Post', language: 'en' } })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.name).toBe('Test Post')
    expect(result.data.status).toBe('draft')
  })

  it('returns 400 when name is missing', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/index.post')
    const mockEvent = createHandlerEvent({ method: 'POST', body: {} })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'VALIDATION_ERROR', message: 'Post name is required' } })
  })
})

describe('PUT /api/v1/posts/:identifier', () => {
  it('updates a post and returns 200', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/[identifier]/index.put')
    const mockEvent = createHandlerEvent({ method: 'PUT', path: '/api/v1/posts/1', params: { identifier: '1' }, body: { name: 'Updated Post', description: 'Updated description' } })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.name).toBe('Updated Post')
    expect(result.data.description).toBe('Updated description')
  })

  it('returns 404 for non-existent post', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/[identifier]/index.put')
    const mockEvent = createHandlerEvent({ method: 'PUT', path: '/api/v1/posts/999', params: { identifier: '999' }, body: { name: 'Updated' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'NOT_FOUND', message: 'Post not found' } })
  })
})

describe('DELETE /api/v1/posts/:identifier', () => {
  it('deletes a post and returns 200', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/[identifier]/index.delete')
    const mockEvent = createHandlerEvent({ method: 'DELETE', path: '/api/v1/posts/1', params: { identifier: '1' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ data: { id: 1, deleted: true } })
  })

  it('returns 404 for non-existent post', async () => {
    const { default: handler } = await import('../../../../server/api/v1/posts/[identifier]/index.delete')
    const mockEvent = createHandlerEvent({ method: 'DELETE', path: '/api/v1/posts/999', params: { identifier: '999' } })
    const result = await handler(mockEvent)
    expect(result).toEqual({ error: { code: 'NOT_FOUND', message: 'Post not found' } })
  })
})

describe('GET /api/v1/user/profile', () => {
  it('returns the user profile', async () => {
    const { default: handler } = await import('../../../../server/api/v1/user/profile.get')
    const mockEvent = createHandlerEvent({ method: 'GET' })
    const result = await handler(mockEvent)
    expect(result).toHaveProperty('data')
    expect(result.data.email).toBe('admin@test.com')
  })
})
