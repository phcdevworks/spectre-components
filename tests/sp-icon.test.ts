import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import * as lucide from '@phcdevworks/spectre-ui/icons'
import * as faSolid from '@phcdevworks/spectre-ui/icons/fa-solid'
import { mdiStar } from '@phcdevworks/spectre-ui/icons/mdi'
import * as brands from '@phcdevworks/spectre-ui/icons/brands'
import {
  defineSpectreIcon,
  defineSpectreIconBox,
  registerIcons,
  registerIconSet,
  SpectreIconElement
} from '../src'

async function mount(markup: string): Promise<SpectreIconElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const icon = host.querySelector('sp-icon') as SpectreIconElement
  await icon.updateComplete
  return icon
}

function svgOf(icon: SpectreIconElement): SVGSVGElement | null {
  return icon.querySelector('[data-sp-icon-native]')
}

describe('sp-icon', () => {
  beforeAll(() => {
    defineSpectreIcon()
    defineSpectreIconBox()
    registerIconSet(lucide)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers the whole Lucide entry under its iconSet id', () => {
    expect(registerIconSet(lucide)).toBe(lucide.iconSet.count)
  })

  it('renders a Lucide outline glyph by kebab-case name', async () => {
    const icon = await mount('<sp-icon name="shield-check"></sp-icon>')
    const svg = svgOf(icon)

    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg?.getAttribute('fill')).toBe('none')
    expect(svg?.getAttribute('stroke')).toBe('currentColor')
    expect(svg?.querySelectorAll('path').length).toBe(lucide.ShieldCheck.length)
    expect(svg?.querySelector('path')?.getAttribute('d')).toBe(
      lucide.ShieldCheck[0]?.[1].d
    )
  })

  it('matches names case- and punctuation-insensitively', async () => {
    const icon = await mount('<sp-icon name="ShieldCheck"></sp-icon>')
    expect(svgOf(icon)).not.toBeNull()
  })

  it('is decorative by default', async () => {
    const svg = svgOf(await mount('<sp-icon name="house"></sp-icon>'))

    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('focusable')).toBe('false')
    expect(svg?.hasAttribute('role')).toBe(false)
  })

  it('exposes an accessible name from label or aria-label', async () => {
    const labelled = svgOf(
      await mount('<sp-icon name="house" label="Home"></sp-icon>')
    )
    expect(labelled?.getAttribute('role')).toBe('img')
    expect(labelled?.getAttribute('aria-label')).toBe('Home')
    expect(labelled?.hasAttribute('aria-hidden')).toBe(false)

    document.body.innerHTML = ''
    const ariaLabelled = svgOf(
      await mount('<sp-icon name="house" aria-label="Start"></sp-icon>')
    )
    expect(ariaLabelled?.getAttribute('aria-label')).toBe('Start')
  })

  it('follows the font size until a size is set', async () => {
    const icon = await mount('<sp-icon name="house"></sp-icon>')
    expect(svgOf(icon)?.getAttribute('width')).toBe('1em')
    expect(svgOf(icon)?.getAttribute('class') ?? '').toBe('')

    icon.size = 'xl'
    await icon.updateComplete
    expect(svgOf(icon)?.getAttribute('class')).toContain('sp-icon-xl')
    expect(svgOf(icon)?.hasAttribute('width')).toBe(false)
  })

  it('drops an unknown size', async () => {
    const icon = await mount('<sp-icon name="house" size="huge"></sp-icon>')
    expect(icon.size).toBeUndefined()
  })

  it('renders nothing for an unknown name or set', async () => {
    const icon = await mount('<sp-icon name="not-an-icon"></sp-icon>')
    expect(svgOf(icon)).toBeNull()

    icon.name = 'house'
    icon.set = 'missing-set'
    await icon.updateComplete
    expect(svgOf(icon)).toBeNull()
  })

  it('renders once icons are registered after it connects', async () => {
    const icon = await mount('<sp-icon set="late" name="sparkle"></sp-icon>')
    expect(svgOf(icon)).toBeNull()

    registerIcons('late', { Sparkle: lucide.Sparkle })
    await icon.updateComplete
    expect(svgOf(icon)).not.toBeNull()
  })

  it('renders filled Font Awesome solid icons by their icon name', async () => {
    registerIconSet(faSolid)
    const svg = svgOf(
      await mount('<sp-icon set="fa-solid" name="star"></sp-icon>')
    )
    const [width, height] = faSolid.faStar.icon

    expect(svg?.getAttribute('viewBox')).toBe(`0 0 ${width} ${height}`)
    expect(svg?.getAttribute('fill')).toBe('currentColor')
    expect(svg?.hasAttribute('stroke')).toBe(false)
  })

  it('renders Material Design Icons path strings without the mdi prefix', async () => {
    registerIcons('mdi', { mdiStar, mdiVersion: '7.4.47' })
    const svg = svgOf(await mount('<sp-icon set="mdi" name="star"></sp-icon>'))

    expect(svg?.querySelector('path')?.getAttribute('d')).toBe(mdiStar)
  })

  it('renders Simple Icons brands by slug', async () => {
    registerIconSet(brands)
    const [, first] = Object.entries(brands).find(
      ([name]) => name !== 'iconSet'
    ) as [string, { slug: string; path: string }]
    const svg = svgOf(
      await mount(`<sp-icon set="brands" name="${first.slug}"></sp-icon>`)
    )

    expect(svg?.querySelector('path')?.getAttribute('d')).toBe(first.path)
  })

  it('escapes attribute values from registered data', async () => {
    registerIcons('unsafe', {
      mdiBad: 'M0 0"></path><script>alert(1)</script><path d="'
    })
    const svg = svgOf(
      await mount('<sp-icon set="unsafe" name="bad"></sp-icon>')
    )

    expect(svg?.querySelector('script')).toBeNull()
    expect(svg?.querySelectorAll('path').length).toBe(1)
  })

  it('renders inside sp-icon-box as projected content', async () => {
    const host = document.createElement('div')
    host.innerHTML =
      '<sp-icon-box icon-size="xl"><sp-icon name="shield-check"></sp-icon></sp-icon-box>'
    document.body.append(host)
    const box = host.querySelector('sp-icon-box') as HTMLElement & {
      updateComplete: Promise<boolean>
    }
    await box.updateComplete
    const icon = host.querySelector('sp-icon') as SpectreIconElement
    await icon.updateComplete

    const native = host.querySelector('[data-sp-icon-box-native]')
    expect(native?.className).toContain('sp-iconbox--icon-xl')
    expect(native?.querySelector('[data-sp-icon-native]')).not.toBeNull()
  })
})
