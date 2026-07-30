import { describe, it, expect, vi, beforeEach } from 'vitest'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}))

const mockClient = vi.hoisted(() => {
  const m: Record<string, ReturnType<typeof vi.fn>> = {}
  const methods = [
    'register', 'login', 'logout',
    'getProfile', 'updateProfile', 'deleteAvatar',
    'getPosts', 'getPost', 'getDrafts', 'createPost', 'updatePost', 'deletePost', 'updateArticle', 'importPosts',
    'getTags', 'createTag', 'updateTag', 'deleteTag',
    'getAuthors', 'getAuthor',
    'getStats', 'search',
    'listApiKeys', 'createApiKey', 'revokeApiKey',
    'subscribeNewsletter', 'getLinkPreview', 'getSiteSettings',
    'clearOgCache', 'updateSiteSettings',
  ]
  for (const name of methods) m[name] = vi.fn().mockResolvedValue({ data: null })
  return m
})

vi.mock('@eneide/sdk', () => ({
  EneideClient: vi.fn(() => mockClient),
  EneideApiError: class extends Error {
    code: string
    status: number
    constructor(message: string, code: string, status: number) {
      super(message)
      this.name = 'EneideApiError'
      this.code = code
      this.status = status
    }
  },
}))

import { program, formatJson } from './index'

function parse(argv: string[]) {
  return program.parseAsync(['node', 'eneide', ...argv], { from: 'node' })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(existsSync).mockReturnValue(true)
  vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ baseUrl: 'https://example.com', apiKey: 'sk-test' }))
})

describe('config', () => {
  it('set-base-url writes config', async () => {
    await parse(['config', 'set-base-url', 'https://blog.example.com'])
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/config\.json$/),
      expect.stringContaining('https://blog.example.com'),
    )
  })

  it('set-api-key writes config', async () => {
    await parse(['config', 'set-api-key', 'sk-new-key'])
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/config\.json$/),
      expect.stringContaining('sk-new-key'),
    )
  })

  it('show prints config with masked key', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await parse(['config', 'show'])
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('"***"'))
    spy.mockRestore()
  })
})

describe('auth', () => {
  it('register calls client.register', async () => {
    await parse(['auth', 'register', '-e', 'a@b.com', '-p', 'secret', '-n', 'Alice'])
    expect(mockClient.register).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret', name: 'Alice' })
  })

  it('login calls client.login', async () => {
    await parse(['auth', 'login', 'a@b.com', 'secret'])
    expect(mockClient.login).toHaveBeenCalledWith('a@b.com', 'secret')
  })

  it('logout calls client.logout', async () => {
    await parse(['auth', 'logout'])
    expect(mockClient.logout).toHaveBeenCalled()
  })
})

describe('user', () => {
  it('profile calls client.getProfile', async () => {
    await parse(['user', 'profile'])
    expect(mockClient.getProfile).toHaveBeenCalled()
  })

  it('update-profile calls client.updateProfile with options', async () => {
    await parse(['user', 'update-profile', '-n', 'Alice', '-b', 'Bio'])
    expect(mockClient.updateProfile).toHaveBeenCalledWith({ name: 'Alice', biography: 'Bio' })
  })

  it('delete-avatar calls client.deleteAvatar', async () => {
    await parse(['user', 'delete-avatar'])
    expect(mockClient.deleteAvatar).toHaveBeenCalled()
  })
})

describe('posts', () => {
  it('list calls client.getPosts', async () => {
    await parse(['posts', 'list'])
    expect(mockClient.getPosts).toHaveBeenCalled()
  })

  it('list forwards options', async () => {
    await parse(['posts', 'list', '-p', '2', '-l', '10', '-s', 'vue', '-t', 'tech', '-a', 'alice', '-L', 'en'])
    expect(mockClient.getPosts).toHaveBeenCalledWith({ page: '2', limit: '10', search: 'vue', tag: 'tech', author: 'alice', language: 'en' })
  })

  it('get calls client.getPost with slug', async () => {
    await parse(['posts', 'get', 'hello-world'])
    expect(mockClient.getPost).toHaveBeenCalledWith('hello-world')
  })

  it('drafts calls client.getDrafts', async () => {
    await parse(['posts', 'drafts'])
    expect(mockClient.getDrafts).toHaveBeenCalled()
  })

  it('create calls client.createPost with name and tags', async () => {
    await parse(['posts', 'create', '-n', 'New', '-t', 'vue,nuxt'])
    expect(mockClient.createPost).toHaveBeenCalledWith({ name: 'New', tags: [{ name: 'vue' }, { name: 'nuxt' }] })
  })

  it('update calls client.updatePost with id and options', async () => {
    await parse(['posts', 'update', '42', '-n', 'Renamed', '--status', 'published'])
    expect(mockClient.updatePost).toHaveBeenCalledWith('42', { name: 'Renamed', status: 'published' })
  })

  it('delete calls client.deletePost', async () => {
    await parse(['posts', 'delete', 'my-slug'])
    expect(mockClient.deletePost).toHaveBeenCalledWith('my-slug')
  })
})

describe('tags', () => {
  it('list calls client.getTags', async () => {
    await parse(['tags', 'list'])
    expect(mockClient.getTags).toHaveBeenCalled()
  })

  it('create calls client.createTag', async () => {
    await parse(['tags', 'create', '-n', 'Vue', '-c', 'framework'])
    expect(mockClient.createTag).toHaveBeenCalledWith({ name: 'Vue', category: 'framework' })
  })

  it('update calls client.updateTag', async () => {
    await parse(['tags', 'update', '1', '-n', 'Nuxt'])
    expect(mockClient.updateTag).toHaveBeenCalledWith(1, { name: 'Nuxt' })
  })

  it('delete calls client.deleteTag', async () => {
    await parse(['tags', 'delete', '5'])
    expect(mockClient.deleteTag).toHaveBeenCalledWith(5)
  })
})

describe('others', () => {
  it('authors list calls client.getAuthors', async () => {
    await parse(['authors', 'list'])
    expect(mockClient.getAuthors).toHaveBeenCalled()
  })

  it('stats calls client.getStats', async () => {
    await parse(['stats'])
    expect(mockClient.getStats).toHaveBeenCalled()
  })

  it('search calls client.search with query', async () => {
    await parse(['search', 'vue', '-L', 'en'])
    expect(mockClient.search).toHaveBeenCalledWith('vue', { language: 'en', page: '1', limit: '25' })
  })
})

describe('error handling', () => {
  it('handles EneideApiError', async () => {
    mockClient.getPosts.mockRejectedValueOnce(
      new (await import('@eneide/sdk')).EneideApiError('Not found', 'NOT_FOUND', 404),
    )
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    await parse(['posts', 'list'])

    expect(spy).toHaveBeenCalledWith('Error [NOT_FOUND] (404): Not found')
    expect(exitSpy).toHaveBeenCalledWith(1)
    spy.mockRestore()
    exitSpy.mockRestore()
  })

  it('handles generic Error', async () => {
    mockClient.getPosts.mockRejectedValueOnce(new Error('Unexpected'))
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    await parse(['posts', 'list'])

    expect(spy).toHaveBeenCalledWith('Error: Unexpected')
    expect(exitSpy).toHaveBeenCalledWith(1)
    spy.mockRestore()
    exitSpy.mockRestore()
  })

  it('errors when no baseUrl configured', async () => {
    vi.mocked(existsSync).mockReturnValue(false)
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    await parse(['posts', 'list'])

    expect(spy).toHaveBeenCalledWith('Error: No base URL configured. Run: eneide config set-base-url <url>')
    expect(exitSpy).toHaveBeenCalledWith(1)
    spy.mockRestore()
    exitSpy.mockRestore()
  })
})

describe('formatJson', () => {
  it('formats data with 2-space indent', () => {
    expect(formatJson({ a: 1, b: [2] })).toBe('{\n  "a": 1,\n  "b": [\n    2\n  ]\n}')
  })
})