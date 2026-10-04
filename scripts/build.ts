// tsup's bundled rollup-plugin-dts groups entries into one TypeScript program
// only while they share a directory once a tsconfig is set, which tsup always
// does. Every component entry has its own directory, so declarations built a
// full program per entry (~65 MB each) and overflowed the heap. Declarations
// are built from one-line re-export stubs that share a single directory, so
// the whole build uses at most two programs and keeps one shared set of
// chunks. tsup.config.ts remains the source of entry points.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, type Options } from 'tsup'

const root = fileURLToPath(new URL('..', import.meta.url))
const stubDir = join(root, '.dts-entries')
const watch = process.argv.includes('--watch')

const configUrl = new URL('../tsup.config.ts', import.meta.url).href
const { default: config } = (await import(configUrl)) as { default: Options }

if (!config.entry || Array.isArray(config.entry)) {
  throw new Error('tsup.config.ts must declare entry as a name-to-path map')
}

const removeStubs = () => rmSync(stubDir, { force: true, recursive: true })

removeStubs()
mkdirSync(stubDir)

const dtsEntry: Record<string, string> = {}
for (const [name, source] of Object.entries(config.entry)) {
  const stub = join(stubDir, `${name}.ts`)
  const target = relative(stubDir, join(root, source)).replace(/\.ts$/, '')
  writeFileSync(stub, `export * from '${target}'\n`)
  dtsEntry[name] = stub
}

// In watch mode tsup resolves after the first build and keeps rebuilding from
// the stubs, so they must outlive this call until the process exits.
if (watch) {
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      removeStubs()
      process.exit(0)
    })
  }
}

try {
  await build({ ...config, config: false, watch, dts: { entry: dtsEntry } })
} finally {
  if (!watch) removeStubs()
}
