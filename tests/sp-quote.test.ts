import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreQuote, SpectreQuoteElement } from '../src'

async function renderQuote(markup: string): Promise<SpectreQuoteElement> {
  document.body.innerHTML = markup
  const element = document.querySelector('sp-quote') as SpectreQuoteElement
  await element.updateComplete
  return element
}

describe('sp-quote', () => {
  beforeAll(() => {
    defineSpectreQuote()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a figure and blockquote with the recipe defaults', async () => {
    const element = await renderQuote(
      '<sp-quote cite="https://example.com"><p>Fast and calm.</p></sp-quote>'
    )
    const figure = element.querySelector('figure')
    const blockquote = figure?.querySelector('blockquote')

    expect(figure?.className).toBe(
      'sp-quote sp-quote--md sp-quote--accent-edge sp-quote--accent-accent'
    )
    expect(blockquote?.className).toBe('sp-quote__text')
    expect(blockquote?.getAttribute('cite')).toBe('https://example.com')
    expect(blockquote?.querySelector('p')?.textContent).toBe('Fast and calm.')
    expect(element.querySelector('figcaption')).toBeNull()
  })

  it('forwards size, surface, accent, accent color, and align', async () => {
    const element = await renderQuote(
      '<sp-quote size="xl" surface="inverse" accent="mark" accent-color="brand" align="center">Q</sp-quote>'
    )
    const classes = element.querySelector('figure')?.className

    expect(classes).toContain('sp-quote--xl')
    expect(classes).toContain('sp-quote--surface-inverse')
    expect(classes).toContain('sp-quote--accent-mark')
    expect(classes).toContain('sp-quote--accent-brand')
    expect(classes).toContain('sp-quote--center')
  })

  it('falls back to defaults for invalid values', async () => {
    const element = await renderQuote(
      '<sp-quote size="huge" surface="glass" accent="rail" accent-color="pink" align="end">Q</sp-quote>'
    )

    expect(element.size).toBe('md')
    expect(element.surface).toBe('plain')
    expect(element.accent).toBe('edge')
    expect(element.accentColor).toBeUndefined()
    expect(element.align).toBe('start')
  })

  it('builds the attribution from name, role, and organization', async () => {
    const element = await renderQuote(`<sp-quote>
      <p>Q</p>
      <span slot="name">Ada Lovelace</span>
      <span slot="role">CTO</span>
      <span slot="organization">Analytical Co</span>
    </sp-quote>`)
    const caption = element.querySelector('figcaption')

    expect(caption?.className).toBe('sp-quote__attribution')
    expect(caption?.querySelector('.sp-quote__name')?.textContent?.trim()).toBe(
      'Ada Lovelace'
    )
    expect(
      caption
        ?.querySelector('.sp-quote__role')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim()
    ).toBe('CTO, Analytical Co')
    expect(element.querySelector('blockquote')?.textContent?.trim()).toBe('Q')
  })

  it('puts the avatar first and switches to the avatar layout', async () => {
    const element = await renderQuote(`<sp-quote>
      Q
      <img slot="avatar" alt="" src="a.png" />
      <span slot="name">Ada</span>
    </sp-quote>`)
    const caption = element.querySelector('figcaption')

    expect(caption?.className).toContain('sp-quote__attribution--avatar')
    expect(caption?.firstElementChild?.tagName).toBe('IMG')
  })
})
