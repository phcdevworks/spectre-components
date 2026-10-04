import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreLogoCloud, SpectreLogoCloudElement } from '../src'

async function mount(markup: string): Promise<SpectreLogoCloudElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const element = host.querySelector('sp-logo-cloud') as SpectreLogoCloudElement
  await element.updateComplete
  await element.updateComplete
  return element
}

describe('sp-logo-cloud', () => {
  beforeAll(() => {
    defineSpectreLogoCloud()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the recipe defaults on a native div', async () => {
    const element = await mount('<sp-logo-cloud></sp-logo-cloud>')
    const native = element.querySelector('[data-sp-logo-cloud-native]')
    expect(native?.tagName).toBe('DIV')
    expect(native?.className).toBe(
      'sp-logo-cloud sp-logo-cloud--md sp-logo-cloud--fill-subtle'
    )
    expect(element.style.display).toBe('block')
  })

  it('forwards size, fill, and muted', async () => {
    const element = await mount(
      '<sp-logo-cloud size="lg" fill="none" muted></sp-logo-cloud>'
    )
    const native = element.querySelector('[data-sp-logo-cloud-native]')
    expect(native?.className).toContain('sp-logo-cloud--lg')
    expect(native?.className).toContain('sp-logo-cloud--fill-none')
    expect(native?.className).toContain('sp-logo-cloud--muted')
  })

  it('falls back to the defaults for unknown values', async () => {
    const element = await mount(
      '<sp-logo-cloud size="xl" fill="glass"></sp-logo-cloud>'
    )
    expect(element.size).toBe('md')
    expect(element.fill).toBe('subtle')
  })

  it('turns each direct child into a tile and keeps it in order', async () => {
    const element = await mount(`<sp-logo-cloud>
      <a href="/a"><img alt="A" src="a.svg" /></a>
      <span><img alt="B" src="b.svg" /></span>
    </sp-logo-cloud>`)
    const native = element.querySelector('[data-sp-logo-cloud-native]')
    const tiles = Array.from(native?.children ?? [])
    expect(tiles.map((tile) => tile.tagName)).toEqual(['A', 'SPAN'])
    tiles.forEach((tile) =>
      expect(tile.classList).toContain('sp-logo-cloud__item')
    )
    expect(native?.querySelector('img')?.className).toBe('')
  })

  it('tiles children added after the first render', async () => {
    const element = await mount('<sp-logo-cloud></sp-logo-cloud>')
    const tile = document.createElement('div')
    tile.innerHTML = '<img alt="C" src="c.svg" />'
    element.append(tile)
    await new Promise((resolve) => setTimeout(resolve))
    await element.updateComplete
    expect(tile.classList).toContain('sp-logo-cloud__item')
    expect(tile.parentElement?.hasAttribute('data-sp-logo-cloud-native')).toBe(
      true
    )
  })

  it('forwards id, title, and aria labelling to the native element', async () => {
    const element = await mount(
      '<sp-logo-cloud id="partners" title="Partners" aria-label="Our partners"></sp-logo-cloud>'
    )
    const native = element.querySelector('[data-sp-logo-cloud-native]')
    expect(native?.id).toBe('partners')
    expect(native?.getAttribute('title')).toBe('Partners')
    expect(native?.getAttribute('aria-label')).toBe('Our partners')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'aria-label')).toBe(
      false
    )
  })

  it('appends sanitized inner-class utilities', async () => {
    const element = await mount(
      '<sp-logo-cloud inner-class="sp-mt-8"></sp-logo-cloud>'
    )
    expect(
      element.querySelector('[data-sp-logo-cloud-native]')?.className
    ).toContain('sp-mt-8')
  })

  it('registers idempotently', () => {
    expect(defineSpectreLogoCloud()).toBe(SpectreLogoCloudElement)
  })
})
