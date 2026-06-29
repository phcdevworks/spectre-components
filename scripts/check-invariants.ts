// Thin-adapter invariant checker for @phcdevworks/spectre-components.
// Ensures component source stays within its Layer 3 contract:
//   - no hardcoded hex colors or spacing values
//   - no local CSS custom property redefinitions matching Spectre naming
//   - no Shadow DOM without explicit approval in components.contract.json
//   - no class-mapping getter duplicated across 3+ components (centralize in
//     src/utils/ instead)
// Run via: npm run check:invariants

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const srcDir = join(root, 'src', 'components')

interface ComponentEntry {
  tag: string
  contracts: { shadowDomApproved: boolean }
}

interface Contract {
  components: ComponentEntry[]
  globalContracts: {
    noHardcodedColors: boolean
    noHardcodedSpacing: boolean
    noLocalTokenRedefinitions: boolean
  }
}

const contract: Contract = JSON.parse(
  readFileSync(join(root, 'components.contract.json'), 'utf8'),
)

// Tags with Shadow DOM explicitly approved in the manifest
const shadowDomApproved = new Set(
  contract.components
    .filter((c) => c.contracts.shadowDomApproved)
    .map((c) => c.tag),
)

// Patterns that violate the thin-adapter contract
const HARDCODED_HEX_BARE = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/
const HARDCODED_SPACING = /\b\d+(?:\.\d+)?(?:px|rem|em)\b/
const LOCAL_TOKEN_REDEF =
  /--(?:spectre|sp)-[a-z][a-z0-9-]*\s*:/
const SHADOW_DOM_ATTACH = /\battachShadow\s*\(/
const SHADOW_DOM_RENDER_ROOT =
  /createRenderRoot\s*\(\s*\)[^{]*\{[^}]*(?:attachShadow|shadowRoot)/

let passed = 0
let failed = 0

function fail(file: string, line: number, msg: string): void {
  console.error(`FAIL  ${file}:${line}  ${msg}`)
  failed++
}

function ok(msg: string): void {
  console.log(`  ok  ${msg}`)
  passed++
}

function collectTsFiles(dir: string): string[] {
  const result: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      result.push(...collectTsFiles(full))
    } else if (extname(full) === '.ts') {
      result.push(full)
    }
  }
  return result
}

function relPath(abs: string): string {
  return abs.replace(root + '/', '')
}

// Determine which component tag a file belongs to (by directory name)
function tagForFile(abs: string): string | null {
  const match = abs.match(/src\/components\/([^/]+)\//)
  if (!match) return null
  return `sp-${match[1]}`
}

const files = collectTsFiles(srcDir)

// Cross-file duplication check: a private getter with the exact same body,
// repeated across 3+ component files, signals logic that belongs in
// src/utils/ instead of being copy-pasted per component.
const DUPLICATION_THRESHOLD = 3
const GETTER_PATTERN =
  /private get (\w+)\(\): \w+ \{\n((?:.+\n)+?) {2}\}/g

function normalizeBody(body: string): string {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

const gettersByBody = new Map<string, { name: string; files: Set<string> }>()

for (const file of files) {
  const rel = relPath(file)
  const source = readFileSync(file, 'utf8')

  for (const match of source.matchAll(GETTER_PATTERN)) {
    const [, name, body] = match
    if (!name || !body) continue
    const normalized = normalizeBody(body)
    const key = `${name}::${normalized}`
    const entry = gettersByBody.get(key) ?? { name, files: new Set<string>() }
    entry.files.add(rel)
    gettersByBody.set(key, entry)
  }
}

for (const { name, files: matchingFiles } of gettersByBody.values()) {
  if (matchingFiles.size >= DUPLICATION_THRESHOLD) {
    fail(
      [...matchingFiles][0] ?? 'unknown',
      0,
      `getter "${name}" is duplicated identically across ${matchingFiles.size} files (${[...matchingFiles].join(', ')}) — centralize in src/utils/ instead`,
    )
  }
}

for (const file of files) {
  const rel = relPath(file)
  const tag = tagForFile(file)
  const source = readFileSync(file, 'utf8')
  const lines = source.split('\n')

  let fileClean = true

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line === undefined) continue
    const lineNum = i + 1

    // Skip pure comment lines
    if (/^\s*\/\//.test(line)) continue

    // Hardcoded hex color check — only inside template literals and strings, not imports
    if (
      contract.globalContracts.noHardcodedColors &&
      HARDCODED_HEX_BARE.test(line) &&
      !line.includes('import ')
    ) {
      fail(rel, lineNum, `hardcoded color value: ${line.trim()}`)
      fileClean = false
    }

    // Hardcoded spacing check — only inside html template literals
    if (
      contract.globalContracts.noHardcodedSpacing &&
      HARDCODED_SPACING.test(line) &&
      /html`|css`|style=/.test(line)
    ) {
      fail(rel, lineNum, `hardcoded spacing value: ${line.trim()}`)
      fileClean = false
    }

    // Local CSS custom property redefinition matching Spectre naming
    if (
      contract.globalContracts.noLocalTokenRedefinitions &&
      LOCAL_TOKEN_REDEF.test(line)
    ) {
      fail(rel, lineNum, `local Spectre token redefinition: ${line.trim()}`)
      fileClean = false
    }

    // Shadow DOM usage without approval
    if (tag && !shadowDomApproved.has(tag)) {
      if (SHADOW_DOM_ATTACH.test(line)) {
        fail(rel, lineNum, `Shadow DOM usage without approval in manifest: attachShadow()`)
        fileClean = false
      }
    }
  }

  // Full-file check for createRenderRoot override returning shadow root
  if (tag && !shadowDomApproved.has(tag) && SHADOW_DOM_RENDER_ROOT.test(source)) {
    fail(rel, 0, `createRenderRoot override returning shadow root without approval in manifest`)
    fileClean = false
  }

  if (fileClean) {
    ok(rel)
    passed++
  }
}

console.log(`\n${passed} passed, ${failed} failed`)

if (failed > 0) {
  process.exit(1)
}
