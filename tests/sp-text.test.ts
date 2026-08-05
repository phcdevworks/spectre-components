import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreText, SpectreTextElement } from '../src'

describe('sp-text', () => {
  beforeAll(() => {
    defineSpectreText()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native p with the Spectre text class and projected content by default', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.append('Default paragraph')

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')

    expect(native).not.toBeNull()
    expect(native?.tagName).toBe('P')
    expect(native?.className).toContain('sp-text')
    expect(native?.textContent).toContain('Default paragraph')
  })

  it('defaults to level=p, size=md, and variant=default', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    document.body.append(element)
    await element.updateComplete

    expect(element.level).toBe('p')
    expect(element.size).toBe('md')
    expect(element.variant).toBe('default')
    expect(element.family).toBeUndefined()
  })

  it('switches the rendered tag with level', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.level = 'h2'
    element.append('Heading')

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')
    expect(native?.tagName).toBe('H2')
  })

  it('reflects a valid size, variant, and family onto the rendered classes', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.size = 'lg'
    element.variant = 'brand'
    element.family = 'mono'

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')
    expect(native?.className).toContain('lg')
    expect(native?.className).toContain('brand')
    expect(native?.className).toContain('mono')
  })

  it('falls back to level=p for an invalid level', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    // @ts-expect-error - testing invalid value
    element.level = 'h7'

    document.body.append(element)
    await element.updateComplete

    expect(element.level).toBe('p')
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    // @ts-expect-error - testing invalid value
    element.size = 'huge'

    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
  })

  it('falls back to variant=default for an invalid variant', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('default')
  })

  it('falls back to family=undefined for an invalid family', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    // @ts-expect-error - testing invalid value
    element.family = 'comic-sans'

    document.body.append(element)
    await element.updateComplete

    expect(element.family).toBeUndefined()
  })

  it('forwards the consumer-facing id to the native element only', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.id = 'text-1'

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')

    expect(element.getAttribute('id')).toBe('text-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(native?.id).toBe('text-1')
  })

  it('forwards ARIA attributes to the rendered native element', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.setAttribute('aria-label', 'Status message')

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')
    expect(native?.getAttribute('aria-label')).toBe('Status message')
  })

  it('defaults to transform=undefined and applies no transform class', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    document.body.append(element)
    await element.updateComplete

    expect(element.transform).toBeUndefined()
    const native = element.querySelector('[data-sp-text-native]')
    expect(native?.className).not.toMatch(
      /sp-text--(uppercase|lowercase|capitalize)/
    )
  })

  it('reflects a valid transform onto the rendered classes', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    element.transform = 'uppercase'

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-text-native]')
    expect(native?.className).toContain('sp-text--uppercase')
  })

  it('falls back to transform=undefined for an invalid transform', async () => {
    const element = document.createElement('sp-text') as SpectreTextElement
    // @ts-expect-error - testing invalid value
    element.transform = 'not-a-transform'

    document.body.append(element)
    await element.updateComplete

    expect(element.transform).toBeUndefined()
  })
})
