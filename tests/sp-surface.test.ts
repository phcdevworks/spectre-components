import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreSurface, SpectreSurfaceElement } from '../src'

async function mount(markup: string): Promise<SpectreSurfaceElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const element = host.querySelector('sp-surface') as SpectreSurfaceElement
  await element.updateComplete
  return element
}

function nativeOf(element: SpectreSurfaceElement): HTMLElement | null {
  return element.querySelector('[data-sp-surface-native]')
}

describe('sp-surface', () => {
  beforeAll(() => {
    defineSpectreSurface()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a div with projected content and no surface by default', async () => {
    const element = await mount('<sp-surface><p>Body</p></sp-surface>')
    const native = nativeOf(element)

    expect(native?.tagName).toBe('DIV')
    expect(native?.hasAttribute('class')).toBe(false)
    expect(native?.querySelector('p')?.textContent).toBe('Body')
    expect(element.style.display).toBe('block')
  })

  it.each([
    ['page', 'sp-bg-surface-page'],
    ['card', 'sp-bg-surface-card'],
    ['subtle', 'sp-bg-surface-subtle'],
    ['overlay', 'sp-bg-surface-overlay'],
    ['input', 'sp-surface--input'],
    ['hero', 'sp-surface--hero'],
    ['inverse', 'sp-surface--inverse']
  ])('forwards surface="%s" to the recipe', async (surface, expected) => {
    const element = await mount(
      `<sp-surface surface="${surface}"></sp-surface>`
    )
    expect(nativeOf(element)?.className).toContain(expected)
  })

  it('forwards the hover, selected, and active states', async () => {
    const element = await mount(
      '<sp-surface surface="card" hover selected active></sp-surface>'
    )
    const classes = nativeOf(element)?.className ?? ''

    expect(classes).toContain('sp-surface--hover')
    expect(classes).toContain('sp-surface--selected')
    expect(classes).toContain('sp-surface--active')
  })

  it('drops an invalid surface and element', async () => {
    const element = await mount(
      '<sp-surface surface="glass" as="main"></sp-surface>'
    )

    expect(element.surface).toBeUndefined()
    expect(element.as).toBe('div')
    expect(nativeOf(element)?.tagName).toBe('DIV')
  })

  it.each(['section', 'article', 'aside', 'header', 'footer'])(
    'renders as="%s"',
    async (tag) => {
      const element = await mount(`<sp-surface as="${tag}"></sp-surface>`)
      expect(nativeOf(element)?.tagName).toBe(tag.toUpperCase())
    }
  )

  it('steps the host out of layout when rendering a list item', async () => {
    document.body.innerHTML =
      '<ul><sp-surface as="li" surface="subtle">One</sp-surface></ul>'
    const element = document.querySelector(
      'sp-surface'
    ) as SpectreSurfaceElement
    await element.updateComplete

    expect(nativeOf(element)?.tagName).toBe('LI')
    expect(element.style.display).toBe('contents')

    element.as = 'div'
    await element.updateComplete
    expect(element.style.display).toBe('block')
  })

  it('keeps a consumer-set host display', async () => {
    const element = await mount(
      '<sp-surface style="display: inline-block" as="li"></sp-surface>'
    )
    expect(element.style.display).toBe('inline-block')
  })

  it('appends sanitized inner-class utilities', async () => {
    const element = await mount(
      '<sp-surface surface="subtle" inner-class="sp-p-4 not-spectre"></sp-surface>'
    )
    expect(nativeOf(element)?.className).toBe('sp-bg-surface-subtle sp-p-4')
  })

  it('moves id and aria attributes to the native element', async () => {
    const element = await mount(
      '<sp-surface id="panel" aria-label="Summary" as="section"></sp-surface>'
    )
    const native = nativeOf(element)

    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(native?.id).toBe('panel')
    expect(native?.getAttribute('aria-label')).toBe('Summary')
  })
})
