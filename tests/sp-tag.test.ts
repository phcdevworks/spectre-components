import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreTag, SpectreTagElement } from '../src'

describe('sp-tag', () => {
  beforeAll(() => {
    defineSpectreTag()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native span with the Spectre tag class and projected content', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    element.append('New')

    document.body.append(element)
    await element.updateComplete

    const span = element.querySelector('[data-sp-tag-native]')

    expect(span).not.toBeNull()
    expect(span?.className).toContain('sp-tag')
    expect(span?.textContent).toContain('New')
  })

  it('defaults to variant=default and size=md', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('default')
    expect(element.size).toBe('md')
  })

  it('reflects a valid variant and size onto the span classes', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    element.variant = 'success'
    element.size = 'lg'

    document.body.append(element)
    await element.updateComplete

    const span = element.querySelector('[data-sp-tag-native]')

    expect(span?.className).toContain('success')
    expect(span?.className).toContain('lg')
  })

  it('falls back to variant=default for an invalid variant', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('default')
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    // @ts-expect-error - testing invalid value
    element.size = 'huge'

    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
  })

  it('forwards the consumer-facing id to the native span only', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    element.id = 'tag-1'

    document.body.append(element)
    await element.updateComplete

    const span = element.querySelector('[data-sp-tag-native]')

    expect(element.getAttribute('id')).toBe('tag-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(span?.id).toBe('tag-1')
  })

  it('forwards ARIA attributes to the native span', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    element.setAttribute('aria-label', 'Featured')

    document.body.append(element)
    await element.updateComplete

    const span = element.querySelector('[data-sp-tag-native]')

    expect(span?.getAttribute('aria-label')).toBe('Featured')
  })

  it('falls back to disabled=false, loading=false, interactive=false, selected=false, dismissible=false, and full-width=false when null is assigned', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
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

    element.selected = true
    await element.updateComplete
    expect(element.selected).toBe(true)

    // @ts-expect-error - testing fallback
    element.selected = null
    await element.updateComplete
    expect(element.selected).toBe(false)

    element.dismissible = true
    await element.updateComplete
    expect(element.dismissible).toBe(true)

    // @ts-expect-error - testing fallback
    element.dismissible = null
    await element.updateComplete
    expect(element.dismissible).toBe(false)

    element.fullWidth = true
    await element.updateComplete
    expect(element.fullWidth).toBe(true)

    // @ts-expect-error - testing fallback
    element.fullWidth = null
    await element.updateComplete
    expect(element.fullWidth).toBe(false)
  })

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-tag') as SpectreTagElement
    element.loading = true

    document.body.append(element)
    await element.updateComplete

    const span = element.querySelector('[data-sp-tag-native]')
    expect(span?.getAttribute('aria-busy')).toBe('true')

    element.loading = false
    await element.updateComplete
    expect(span?.getAttribute('aria-busy')).toBe('false')
  })
})
