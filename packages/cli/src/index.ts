#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { EneideClient, EneideApiError } from '@eneide/sdk'

const CONFIG_DIR = join(homedir(), '.config', 'eneide')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

function loadConfig(): { baseUrl?: string; apiKey?: string } {
  try {
    if (existsSync(CONFIG_FILE)) return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {}
  return {}
}

function saveConfig(config: { baseUrl?: string; apiKey?: string }) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true })
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

function createClient(): EneideClient {
  const config = loadConfig()
  if (!config.baseUrl) {
    console.error('Error: No base URL configured. Run: eneide config set-base-url <url>')
    process.exit(1)
  }
  return new EneideClient({ baseUrl: config.baseUrl, apiKey: config.apiKey })
}

function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

const program = new Command()

program.name('eneide').description('CLI for Énéide CMS').version('0.2.0')

// ---- config ----
const configCmd = program.command('config').description('Manage CLI configuration')
configCmd.command('set-base-url').argument('<url>', 'API base URL').action((url: string) => {
  const config = loadConfig(); config.baseUrl = url.replace(/\/+$/, ''); saveConfig(config)
  console.log(`Base URL set to: ${config.baseUrl}`)
})
configCmd.command('set-api-key').argument('<key>', 'API key').action((key: string) => {
  const config = loadConfig(); config.apiKey = key; saveConfig(config)
  console.log('API key saved')
})
configCmd.command('show').description('Show current configuration').action(() => {
  const config = loadConfig()
  console.log(formatJson({ ...config, apiKey: config.apiKey ? '***' : undefined }))
})

// ---- auth ----
const authCmd = program.command('auth').description('Authentication')
authCmd.command('register').description('Create a new account')
  .requiredOption('-e, --email <email>', 'Email')
  .requiredOption('-p, --password <password>', 'Password')
  .requiredOption('-n, --name <name>', 'Display name')
  .action(async (opts) => {
    try { console.log(formatJson(await createClient().register({ email: opts.email, password: opts.password, name: opts.name }))) }
    catch (e) { handleError(e) }
  })
authCmd.command('login').description('Login').argument('<email>', 'Email').argument('<password>', 'Password')
  .action(async (email, password) => {
    try { console.log(formatJson(await createClient().login(email, password))) }
    catch (e) { handleError(e) }
  })
authCmd.command('logout').description('Logout').action(async () => {
  try { console.log(formatJson(await createClient().logout())) }
  catch (e) { handleError(e) }
})

// ---- user ----
const userCmd = program.command('user').description('User profile & avatar')
userCmd.command('profile').description('Get profile').action(async () => {
  try { console.log(formatJson(await createClient().getProfile())) }
  catch (e) { handleError(e) }
})
userCmd.command('update-profile').description('Update profile')
  .option('-n, --name <name>', 'Name')
  .option('-b, --biography <text>', 'Biography')
  .option('-j, --job <job>', 'Job')
  .option('-l, --location <location>', 'Location')
  .option('-L, --language <lang>', 'Language')
  .action(async (opts) => {
    try { console.log(formatJson(await createClient().updateProfile(opts))) }
    catch (e) { handleError(e) }
  })
userCmd.command('delete-avatar').description('Delete avatar').action(async () => {
  try { console.log(formatJson(await createClient().deleteAvatar())) }
  catch (e) { handleError(e) }
})

// ---- posts ----
const postsCmd = program.command('posts').description('Manage posts')
postsCmd.command('list').description('List published posts')
  .option('-p, --page <n>', 'Page', '1').option('-l, --limit <n>', 'Limit', '25')
  .option('-s, --search <q>', 'Search').option('-t, --tag <tag>', 'Filter by tag')
  .option('-a, --author <author>', 'Filter by author').option('-L, --language <lang>', 'Language')
  .action(async (opts) => {
    try { console.log(formatJson(await createClient().getPosts(opts))) }
    catch (e) { handleError(e) }
  })
postsCmd.command('get').description('Get post by slug').argument('<slug>', 'Post slug')
  .action(async (slug) => {
    try { console.log(formatJson(await createClient().getPost(slug))) }
    catch (e) { handleError(e) }
  })
postsCmd.command('drafts').description('List drafts')
  .action(async () => {
    try { console.log(formatJson(await createClient().getDrafts())) }
    catch (e) { handleError(e) }
  })
postsCmd.command('create').description('Create post')
  .requiredOption('-n, --name <name>', 'Name')
  .option('-d, --description <desc>', 'Description').option('-s, --status <status>', 'Status')
  .option('-t, --tags <tags>', 'Comma-separated tag names')
  .action(async (opts) => {
    try {
      const tags = opts.tags ? opts.tags.split(',').map((t: string) => ({ name: t.trim() })) : undefined
      console.log(formatJson(await createClient().createPost({ name: opts.name, description: opts.description, status: opts.status, tags })))
    } catch (e) { handleError(e) }
  })
postsCmd.command('update').description('Update post').argument('<id>', 'Post ID or slug')
  .option('-n, --name <name>').option('-d, --description <desc>').option('-s, --slug <slug>')
  .option('--status <status>').option('-l, --language <lang>').option('-t, --tags <tags>', 'Comma-separated')
  .action(async (id, opts) => {
    try {
      const p: any = {}; if (opts.name) p.name = opts.name; if (opts.description) p.description = opts.description
      if (opts.slug) p.slug = opts.slug; if (opts.status) p.status = opts.status; if (opts.language) p.language = opts.language
      if (opts.tags) p.tags = opts.tags.split(',').map((t: string) => ({ name: t.trim() }))
      console.log(formatJson(await createClient().updatePost(id, p)))
    } catch (e) { handleError(e) }
  })
postsCmd.command('delete').description('Delete post').argument('<id>', 'Post ID or slug')
  .action(async (id) => {
    try { console.log(formatJson(await createClient().deletePost(id))) }
    catch (e) { handleError(e) }
  })
postsCmd.command('article').description('Update article JSON').argument('<id>', 'Post ID or slug').argument('<file>', 'JSON file path')
  .action(async (id, file) => {
    try {
      const article = JSON.parse(readFileSync(file, 'utf-8'))
      console.log(formatJson(await createClient().updateArticle(id, article)))
    } catch (e) { handleError(e) }
  })
postsCmd.command('export').description('Export post as ZIP').argument('<id>', 'Post ID or slug').argument('[output]', 'Output file')
  .action(async (id, output) => {
    try {
      const cfg = loadConfig()
      const url = `${cfg.baseUrl}/api/v1/posts/${id}/export`
      const res = await fetch(url)
      if (!res.ok) { const b = await res.json(); throw new EneideApiError(b?.error?.message || 'Export failed', 'EXPORT_ERROR', res.status) }
      const buffer = Buffer.from(await res.arrayBuffer())
      const out = output || `post-${id}.zip`
      writeFileSync(out, buffer)
      console.log(`Exported to: ${out}`)
    } catch (e) { handleError(e) }
  })
postsCmd.command('import').description('Import posts from JSON file').argument('<file>', 'JSON file path')
  .action(async (file) => {
    try {
      const data = JSON.parse(readFileSync(file, 'utf-8'))
      console.log(formatJson(await createClient().importPosts(data)))
    } catch (e) { handleError(e) }
  })

// ---- tags ----
const tagsCmd = program.command('tags').description('Manage tags')
tagsCmd.command('list').description('List tags').option('-c, --category <cat>', 'Category').option('-s, --search <q>', 'Search')
  .action(async (opts) => { try { console.log(formatJson(await createClient().getTags(opts))) } catch (e) { handleError(e) } })
tagsCmd.command('create').description('Create tag').requiredOption('-n, --name <name>', 'Name')
  .option('-c, --category <cat>', 'Category').option('-d, --description <desc>', 'Description')
  .action(async (opts) => { try { console.log(formatJson(await createClient().createTag(opts))) } catch (e) { handleError(e) } })
tagsCmd.command('update').description('Update tag').argument('<id>', 'Tag ID')
  .requiredOption('-n, --name <name>', 'Name').option('-c, --category <cat>').option('-d, --description <desc>')
  .action(async (id, opts) => { try { console.log(formatJson(await createClient().updateTag(Number(id), opts))) } catch (e) { handleError(e) } })
tagsCmd.command('delete').description('Delete tag').argument('<id>', 'Tag ID')
  .action(async (id) => { try { console.log(formatJson(await createClient().deleteTag(Number(id)))) } catch (e) { handleError(e) } })

// ---- authors ----
const authorsCmd = program.command('authors').description('Manage authors')
authorsCmd.command('list').description('List authors').action(async () => { try { console.log(formatJson(await createClient().getAuthors())) } catch (e) { handleError(e) } })
authorsCmd.command('get').description('Get author').argument('<id>', 'Author ID').action(async (id) => { try { console.log(formatJson(await createClient().getAuthor(Number(id)))) } catch (e) { handleError(e) } })

// ---- stats ----
program.command('stats').description('Blog statistics').action(async () => { try { console.log(formatJson(await createClient().getStats())) } catch (e) { handleError(e) } })

// ---- search ----
program.command('search').description('Search posts').argument('<q>', 'Query')
  .option('-p, --page <n>', 'Page', '1').option('-l, --limit <n>', 'Limit', '25').option('-L, --language <lang>', 'Language')
  .action(async (q, opts) => { try { console.log(formatJson(await createClient().search(q, opts))) } catch (e) { handleError(e) } })

// ---- api-keys ----
const apiKeysCmd = program.command('api-keys').description('Manage API keys (admin)')
apiKeysCmd.command('list').description('List keys').action(async () => { try { console.log(formatJson(await createClient().listApiKeys())) } catch (e) { handleError(e) } })
apiKeysCmd.command('create').description('Create key').argument('<name>', 'Key name').action(async (n) => { try { console.log(formatJson(await createClient().createApiKey(n))) } catch (e) { handleError(e) } })
apiKeysCmd.command('revoke').description('Revoke key').argument('<id>', 'Key ID').action(async (id) => { try { console.log(formatJson(await createClient().revokeApiKey(Number(id)))) } catch (e) { handleError(e) } })

// ---- newsletter ----
program.command('subscribe').description('Subscribe to newsletter').argument('<email>', 'Email').action(async (email) => {
  try { console.log(formatJson(await createClient().subscribeNewsletter(email))) } catch (e) { handleError(e) }
})

// ---- link-preview ----
program.command('link-preview').description('Get link preview').argument('<url>', 'URL').action(async (url) => {
  try { console.log(formatJson(await createClient().getLinkPreview(url))) } catch (e) { handleError(e) }
})

// ---- site-settings ----
program.command('site-settings').description('Get public site settings').action(async () => {
  try { console.log(formatJson(await createClient().getSiteSettings())) } catch (e) { handleError(e) }
})

// ---- admin ----
const adminCmd = program.command('admin').description('Admin commands')
adminCmd.command('clear-og-cache').description('Clear OG image cache').argument('<key>', 'Secret key')
  .option('-t, --type <type>', 'Filter by type (home|post|author|tag)').option('-s, --slug <slug>', 'Filter by slug')
  .action(async (key, opts) => { try { console.log(formatJson(await createClient().clearOgCache(key, opts.type, opts.slug))) } catch (e) { handleError(e) } })
adminCmd.command('update-site-settings').description('Update site social links').argument('<json>', 'Social links JSON array')
  .action(async (json) => { try { console.log(formatJson(await createClient().updateSiteSettings(JSON.parse(json)))) } catch (e) { handleError(e) } })

function handleError(err: unknown) {
  if (err instanceof EneideApiError) console.error(`Error [${err.code}] (${err.status}): ${err.message}`)
  else if (err instanceof Error) console.error(`Error: ${err.message}`)
  else console.error('Unknown error')
  process.exit(1)
}

program.parse()
