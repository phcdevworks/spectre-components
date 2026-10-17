import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreLink, SpectreLinkElement } from '../src'

async function mount(markup: string): Promise<SpectreLinkElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const element = host.querySelector('sp-link') as SpectreLinkElement
  await element.updateComplete
  return element
}

describe('sp-link', () => {
  beforeAll(() => {
    defineSpectreLink()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native anchor with the link recipe and projected content', async () => {
    const element = await mount('<sp-link href="/docs">Docs</sp-link>')
    const anchor = element.querySelector('a')

    expect(anchor?.className).toBe('sp-link')
    expect(anchor?.getAttribute('href')).toBe('/docs')
    expect(anchor?.hasAttribute('data-sp-link-native')).toBe(true)
    expect(anchor?.textContent).toBe('Docs')
  })

  it('forwards tone, decoration, and underline offset to the recipe', async () => {
    const element = await mount(
      '<sp-link href="/" tone="onInverse" decoration="thick" underline-offset="lg">Home</sp-link>'
    )
    const classes = element.querySelector('a')?.className ?? ''

    expect(classes).toContain('sp-link--on-inverse')
    expect(classes).toContain('sp-decoration-thick')
    expect(classes).toContain('sp-underline-offset-lg')
  })

  it('drops invalid tone, decoration, and underline offset values', async () => {
    const element = await mount(
      '<sp-link href="/" tone="loud" decoration="heavy" underline-offset="xl">Home</sp-link>'
    )

    expect(element.tone).toBe('default')
    expect(element.decoration).toBeUndefined()
    expect(element.underlineOffset).toBeUndefined()
    expect(element.querySelector('a')?.className).toBe('sp-link')
  })

  it('marks the current page with aria-current', async () => {
    const element = await mount('<sp-link href="/docs" current>Docs</sp-link>')
    const anchor = element.querySelector('a')

    expect(anchor?.getAttribute('aria-current')).toBe('page')

    element.current = false
    await element.updateComplete
    expect(anchor?.hasAttribute('aria-current')).toBe(false)
  })

  it('forwards target and rel', async () => {
    const element = await mount(
      '<sp-link href="https://example.com" target="_blank" rel="noopener">Out</sp-link>'
    )
    const anchor = element.querySelector('a')

    expect(anchor?.getAttribute('target')).toBe('_blank')
    expect(anchor?.getAttribute('rel')).toBe('noopener')
  })

  it('moves id, title, and aria-label to the native anchor', async () => {
    const element = await mount(
      '<sp-link id="docs" title="Read the docs" aria-label="Documentation" href="/docs">Docs</sp-link>'
    )
    const anchor = element.querySelector('a')

    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(anchor?.id).toBe('docs')
    expect(anchor?.getAttribute('title')).toBe('Read the docs')
    expect(anchor?.getAttribute('aria-label')).toBe('Documentation')
  })
})
