import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreSpinner, SpectreSpinnerElement } from '../src'

describe('sp-spinner', () => {
  beforeAll(() => {
    defineSpectreSpinner()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre spinner class and role=status', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-spinner-native]')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-spinner')
    expect(div?.getAttribute('role')).toBe('status')
  })

  it('defaults to size=md, loading=true, and no variant', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
    expect(element.loading).toBe(true)
    expect(element.variant).toBeUndefined()
  })

  it('reflects a valid size and variant onto the div classes', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    element.size = 'lg'
    element.variant = 'success'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-spinner-native]')

    expect(div?.className).toContain('lg')
    expect(div?.className).toContain('success')
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    // @ts-expect-error - testing invalid value
    element.size = 'huge'

    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
  })

  it('clears an invalid variant', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBeUndefined()
  })

  it('defaults the accessible label to "Loading" unless aria-label is provided', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-spinner-native]')
    expect(div?.getAttribute('aria-label')).toBe('Loading')

    element.setAttribute('aria-label', 'Saving changes')
    await element.updateComplete

    expect(div?.getAttribute('aria-label')).toBe('Saving changes')
  })

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    element.id = 'spinner-1'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-spinner-native]')

    expect(element.getAttribute('id')).toBe('spinner-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(div?.id).toBe('spinner-1')
  })

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement(
      'sp-spinner'
    ) as SpectreSpinnerElement
    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-spinner-native]')
    expect(div?.getAttribute('aria-busy')).toBe('true')

    element.loading = false
    await element.updateComplete
    expect(div?.getAttribute('aria-busy')).toBe('false')

    // @ts-expect-error - testing fallback
    element.loading = null
    await element.updateComplete
    expect(element.loading).toBe(true)
  })
})
