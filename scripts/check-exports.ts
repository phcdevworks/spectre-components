// Exercise the published tarball through package resolution in an isolated consumer.
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
interface PackageMetadata {
  name: string
  exports: Record<string, { types: string; import: string; require: string }>
  dependencies: Record<string, string>
}
interface Entry {
  entryPoint: string
  exports: { values: string[] }
}
const pkg: PackageMetadata = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8')
)
const contract: { rootEntry: Entry; components: Entry[] } = JSON.parse(
  readFileSync(join(root, 'components.contract.json'), 'utf8')
)
const expected = new Map([
  ['.', contract.rootEntry.exports.values],
  ...contract.components.map((entry): [string, string[]] => [
    entry.entryPoint,
    entry.exports.values
  ])
])
const temporary = mkdtempSync(join(tmpdir(), 'spectre-exports-'))

try {
  const packs: Record<string, { filename: string }> | { filename: string }[] =
    JSON.parse(
      execFileSync(
        'npm',
        ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
        { cwd: root, encoding: 'utf8' }
      )
    )
  const tarball = Object.values(packs)[0]?.filename
  if (!tarball) throw new Error('npm pack returned no tarball')
  const installed = join(temporary, 'node_modules', pkg.name)
  mkdirSync(installed, { recursive: true })
  execFileSync('tar', [
    '-xzf',
    join(temporary, tarball),
    '-C',
    installed,
    '--strip-components=1'
  ])

  // Use the validated dependency installation without another registry install.
  for (const name of Object.keys(pkg.dependencies)) {
    const target = join(temporary, 'node_modules', name)
    mkdirSync(dirname(target), { recursive: true })
    symlinkSync(join(root, 'node_modules', name), target, 'junction')
  }

  for (const entryPoint of expected.keys()) {
    if (!pkg.exports[entryPoint])
      throw new Error(`Missing package export: ${entryPoint}`)
  }
  const entries = Object.entries(pkg.exports).map(([entryPoint, paths]) => {
    const values = expected.get(entryPoint)
    if (!values) throw new Error(`Missing contract for ${entryPoint}`)
    for (const format of ['types', 'import', 'require'] as const) {
      if (!paths[format] || !existsSync(join(installed, paths[format]))) {
        throw new Error(
          `Missing packed ${format} target for ${entryPoint}: ${paths[format]}`
        )
      }
    }
    return {
      specifier: pkg.name + (entryPoint === '.' ? '' : entryPoint.slice(1)),
      values
    }
  })

  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import { createRequire } from 'node:module'
    const require = createRequire(process.cwd() + '/consumer.cjs')
    const entries = JSON.parse(process.argv[1])
    let passed = 0
    for (const { specifier, values } of entries) {
      const esm = await import(specifier)
      const cjs = require(specifier)
      for (const [format, mod] of [['ESM', esm], ['CommonJS', cjs]]) {
        for (const name of values) {
          if (mod[name] === undefined) throw new Error(specifier + ': missing ' + format + ' export ' + name)
        }
        console.log('  ok  ' + format + ' ' + specifier)
        passed++
      }
      if (JSON.stringify(Object.keys(esm).sort()) !== JSON.stringify(Object.keys(cjs).sort())) {
        throw new Error(specifier + ': ESM and CommonJS export names differ')
      }
    }
    console.log(passed + ' package imports passed; ' + entries.length + ' declaration targets verified')
  `,
      JSON.stringify(entries)
    ],
    { cwd: temporary, stdio: 'inherit' }
  )
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
