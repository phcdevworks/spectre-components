import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectrePricingCard, SpectrePricingCardElement } from '../src'

describe('sp-pricing-card', () => {
  beforeAll(() => {
    defineSpectrePricingCard()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre pricing-card class and projected content', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    const heading = document.createElement('h3')
    heading.textContent = 'Pro plan'
    element.append(heading)

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-pricing-card-native]')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-pricing-card')
    expect(div?.textContent).toContain('Pro plan')
  })

  it('reflects the featured state onto the div classes', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    element.featured = true

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-pricing-card-native]')

    expect(div?.className).toContain('featured')
  })

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    element.id = 'pricing-card-1'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-pricing-card-native]')

    expect(element.getAttribute('id')).toBe('pricing-card-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(div?.id).toBe('pricing-card-1')
  })

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    element.setAttribute('aria-label', 'Pro plan pricing')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-pricing-card-native]')

    expect(div?.getAttribute('aria-label')).toBe('Pro plan pricing')
  })

  it('falls back to disabled=false, loading=false, interactive=false, featured=false, and full-height=false when null is assigned', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    document.body.append(element)
    await element.updateComplete

    element.disabled = true
    await element.updateComplete
    expect(element.disabled).toBe(true)

    // @ts-expect-error - testing fallback
    element.disabled = null
    await element.updateComplete
    expect(element.disabled).toBe(false)

    element.loading = true
    await element.updateComplete
    expect(element.loading).toBe(true)

    // @ts-expect-error - testing fallback
    element.loading = null
    await element.updateComplete
    expect(element.loading).toBe(false)

    element.interactive = true
    await element.updateComplete
    expect(element.interactive).toBe(true)

    // @ts-expect-error - testing fallback
    element.interactive = null
    await element.updateComplete
    expect(element.interactive).toBe(false)

    element.featured = true
    await element.updateComplete
    expect(element.featured).toBe(true)

    // @ts-expect-error - testing fallback
    element.featured = null
    await element.updateComplete
    expect(element.featured).toBe(false)

    element.fullHeight = true
    await element.updateComplete
    expect(element.fullHeight).toBe(true)

    // @ts-expect-error - testing fallback
    element.fullHeight = null
    await element.updateComplete
    expect(element.fullHeight).toBe(false)
  })

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement(
      'sp-pricing-card'
    ) as SpectrePricingCardElement
    element.loading = true

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-pricing-card-native]')
    expect(div?.getAttribute('aria-busy')).toBe('true')

    element.loading = false
    await element.updateComplete
    expect(div?.getAttribute('aria-busy')).toBe('false')
  })
})
