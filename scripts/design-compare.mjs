import { spawnSync } from 'node:child_process'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const configPath = path.join(root, 'scripts', 'design-comparison.config.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const [comparisonName, ...args] = process.argv.slice(2)

if (!comparisonName || comparisonName === '--help' || comparisonName === '-h' || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: bun run design:compare -- <comparison-name> [--local-url=<url>]')
  console.log(`Available comparisons: ${Object.keys(config).join(', ')}`)
  process.exit(comparisonName ? 0 : 1)
}

const comparison = config[comparisonName]
if (!comparison) {
  console.error(`Unknown comparison: ${comparisonName}`)
  console.error(`Available comparisons: ${Object.keys(config).join(', ')}`)
  process.exit(1)
}

const localUrl = args.find(arg => arg.startsWith('--local-url='))?.slice('--local-url='.length) || comparison.localUrl
const safeName = comparisonName.replace(/[^a-z0-9-]/gi, '-')
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outputDir = path.join(root, '.data', 'design-comparisons', `${safeName}-${timestamp}`)
await mkdir(outputDir, { recursive: true })

const runnerUrl = pathToFileURL(path.join(root, 'scripts', 'design-compare-ego.mjs'))
runnerUrl.searchParams.set('comparison', comparisonName)
runnerUrl.searchParams.set('config', configPath)
runnerUrl.searchParams.set('localUrl', localUrl)
runnerUrl.searchParams.set('outputDir', outputDir)

const result = spawnSync('ego-browser', [
  'nodejs',
  '-e',
  `await import(${JSON.stringify(runnerUrl.href)})`,
], { cwd: root, stdio: 'inherit' })

if (result.error) {
  console.error(`Could not launch Ego Browser: ${result.error.message}`)
  console.error('Run this command from the Codex environment with Ego Browser available.')
  process.exit(1)
}

process.exit(result.status ?? 1)
