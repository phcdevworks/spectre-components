// Validates that actual dist exports match the symbols declared in components.contract.json.
// Run via: npm run check:contract  (requires dist/ to exist)

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

interface ComponentEntry {
  tag: string
  elementClass: string
  distFile: string
  exports: {
    values: string[]
    types?: string[]
  }
  contracts: {
    renderMode: string
    shadowDomApproved: boolean
  }
}

interface RootEntry {
  distFile: string
  exports: {
    values: string[]
  }
}

interface Contract {
  components: ComponentEntry[]
  rootEntry: RootEntry
}

const contract: Contract = JSON.parse(
  readFileSync(join(root, 'components.contract.json'), 'utf8'),
)

let passed = 0
let failed = 0

function fail(msg: string): void {
  console.error(`FAIL  ${msg}`)
  failed++
}

function ok(msg: string): void {
  console.log(`  ok  ${msg}`)
  passed++
}

async function checkDistFile(
  distFile: string,
  values: string[],
  label: string,
): Promise<void> {
  const absPath = join(root, distFile)
  let mod: Record<string, unknown>

  try {
    mod = (await import(absPath)) as Record<string, unknown>
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    fail(`${label} (${distFile}): could not import - ${message}`)
    failed += values.length - 1
    return
  }

  for (const name of values) {
    if (mod[name] !== undefined) {
      ok(`${label}: ${name}`)
      passed++
    } else {
      fail(`${label}: missing export "${name}"`)
    }
  }
}

// Check root entry
await checkDistFile(
  contract.rootEntry.distFile,
  contract.rootEntry.exports.values,
  'root',
)

// Check each component entry
for (const component of contract.components) {
  await checkDistFile(
    component.distFile,
    component.exports.values,
    component.tag,
  )
}

// Cross-check: every component tag in the contract has a distFile that exists
import { existsSync } from 'node:fs'

for (const component of contract.components) {
  const absPath = join(root, component.distFile)
  if (existsSync(absPath)) {
    ok(`${component.tag}: dist file exists (${component.distFile})`)
    passed++
  } else {
    fail(`${component.tag}: dist file missing (${component.distFile})`)
  }
}

console.log(`\n${passed} passed, ${failed} failed`)

if (failed > 0) {
  process.exit(1)
}
