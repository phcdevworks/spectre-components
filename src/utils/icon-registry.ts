type IconAttributeValue = string | number | undefined

export type SpectreLucideIconData = readonly (readonly [
  string,
  Readonly<Record<string, IconAttributeValue>>
])[]

export interface SpectreFontAwesomeIconData {
  readonly iconName: string
  readonly icon: readonly [
    number,
    number,
    readonly unknown[],
    string,
    string | readonly string[]
  ]
}

export interface SpectreSimpleIconData {
  readonly slug: string
  readonly path: string
}

/**
 * Icon data in any shape `@phcdevworks/spectre-ui/icons` re-exports: a Lucide
 * `IconNode`, a Material Design Icons path string (`mdi*` exports), a Font
 * Awesome icon definition, or a Simple Icons brand object.
 */
export type SpectreIconData =
  | SpectreLucideIconData
  | string
  | SpectreFontAwesomeIconData
  | SpectreSimpleIconData

export interface SpectreIconSetModule {
  readonly iconSet: { readonly id: string }
  readonly [exportName: string]: unknown
}

export interface SpectreIconGlyph {
  readonly viewBox: string
  readonly outline: boolean
  readonly body: string
}

interface IconStore {
  sets: Map<string, Map<string, SpectreIconGlyph>>
  events: EventTarget
}

// Every package entry bundles its own copy of this module, so the store lives
// on globalThis to keep one registry per page.
const storeKey = Symbol.for('@phcdevworks/spectre-components/icons')
const changeEvent = 'spectre-icons-change'

function getStore(): IconStore {
  const scope = globalThis as unknown as Record<symbol, IconStore | undefined>
  const existing = scope[storeKey]
  if (existing) return existing
  const created: IconStore = { sets: new Map(), events: new EventTarget() }
  scope[storeKey] = created
  return created
}

// Glyphs without a Spectre size class follow the surrounding font size, the
// same fallback `sp-icon-box` uses; any Spectre size rule overrides it.
export const iconTextSize = '1em'

export function normalizeIconName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function pathElements(paths: readonly string[]): string {
  return paths.map((d) => `<path d="${escapeAttribute(d)}"></path>`).join('')
}

function isLucideIconData(value: unknown): value is SpectreLucideIconData {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (node) =>
        Array.isArray(node) &&
        typeof node[0] === 'string' &&
        typeof node[1] === 'object' &&
        node[1] !== null
    )
  )
}

function isFontAwesomeIconData(
  value: unknown
): value is SpectreFontAwesomeIconData {
  const candidate = value as Partial<SpectreFontAwesomeIconData> | null
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    typeof candidate.iconName === 'string' &&
    Array.isArray(candidate.icon) &&
    typeof candidate.icon[0] === 'number' &&
    typeof candidate.icon[1] === 'number'
  )
}

function isSimpleIconData(value: unknown): value is SpectreSimpleIconData {
  const candidate = value as Partial<SpectreSimpleIconData> | null
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    typeof candidate.slug === 'string' &&
    typeof candidate.path === 'string'
  )
}

function lucideBody(nodes: SpectreLucideIconData): string {
  return nodes
    .filter(([tag]) => /^[a-zA-Z]+$/.test(tag))
    .map(([tag, attributes]) => {
      const rendered = Object.entries(attributes)
        .filter(([name, value]) => value !== undefined && name !== 'key')
        .map(([name, value]) => `${name}="${escapeAttribute(String(value))}"`)
        .join(' ')
      return `<${tag} ${rendered}></${tag}>`
    })
    .join('')
}

function toGlyph(
  exportName: string,
  value: unknown
): [string, SpectreIconGlyph] | null {
  if (isLucideIconData(value)) {
    return [
      exportName,
      { viewBox: '0 0 24 24', outline: true, body: lucideBody(value) }
    ]
  }
  if (typeof value === 'string') {
    // Only `mdi*` exports carry path data; other strings are set metadata.
    if (!/^mdi[A-Z0-9]/.test(exportName)) return null
    return [
      exportName.slice(3),
      { viewBox: '0 0 24 24', outline: false, body: pathElements([value]) }
    ]
  }
  if (isFontAwesomeIconData(value)) {
    const [width, height, , , pathData] = value.icon
    const paths = typeof pathData === 'string' ? [pathData] : [...pathData]
    return [
      value.iconName,
      {
        viewBox: `0 0 ${width} ${height}`,
        outline: false,
        body: pathElements(paths)
      }
    ]
  }
  if (isSimpleIconData(value)) {
    return [
      value.slug,
      { viewBox: '0 0 24 24', outline: false, body: pathElements([value.path]) }
    ]
  }
  return null
}

/**
 * Registers icons under a set name for `sp-icon` to render by name. Names
 * match case- and punctuation-insensitively, so `ShieldCheck` registers
 * `shield-check`. Returns how many icons were registered.
 */
export function registerIcons(
  set: string,
  icons: Readonly<Record<string, unknown>>
): number {
  const store = getStore()
  const setKey = normalizeIconName(set)
  const glyphs = store.sets.get(setKey) ?? new Map<string, SpectreIconGlyph>()
  let count = 0

  for (const [exportName, value] of Object.entries(icons)) {
    const entry = toGlyph(exportName, value)
    if (!entry) continue
    glyphs.set(normalizeIconName(entry[0]), entry[1])
    count++
  }

  store.sets.set(setKey, glyphs)
  if (count > 0) store.events.dispatchEvent(new Event(changeEvent))
  return count
}

/**
 * Registers every icon in a `@phcdevworks/spectre-ui/icons` entry under its
 * own `iconSet.id` (`lucide`, `mdi`, `brands`, `fa-solid`, `fa-regular`, or
 * `fa-brands`).
 */
export function registerIconSet(module: SpectreIconSetModule): number {
  return registerIcons(module.iconSet.id, module)
}

export function getIcon(
  set: string,
  name: string
): SpectreIconGlyph | undefined {
  return getStore()
    .sets.get(normalizeIconName(set))
    ?.get(normalizeIconName(name))
}

export function onIconsRegistered(listener: () => void): () => void {
  const { events } = getStore()
  events.addEventListener(changeEvent, listener)
  return () => events.removeEventListener(changeEvent, listener)
}
