import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreAlert, SpectreAlertElement } from '../src'

describe('sp-alert', () => {
  beforeAll(() => {
    defineSpectreAlert()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre alert class, role, and projected content', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.append('Saved successfully')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-alert')
    expect(div?.getAttribute('role')).toBe('alert')
    expect(div?.textContent).toContain('Saved successfully')
  })

  it('defaults to variant=info and size=md', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('info')
    expect(element.size).toBe('md')
  })

  it('reflects a valid variant and size onto the div classes', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.variant = 'danger'
    element.size = 'sm'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div?.className).toContain('danger')
    expect(div?.className).toContain('sm')
  })

  it('falls back to variant=info for an invalid variant', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('info')
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    // @ts-expect-error - testing invalid value
    element.size = 'xl'

    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
  })

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.id = 'alert-1'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(element.getAttribute('id')).toBe('alert-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(div?.id).toBe('alert-1')
  })

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.setAttribute('aria-label', 'Form error summary')
    element.setAttribute('aria-describedby', 'desc-1')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div?.getAttribute('aria-label')).toBe('Form error summary')
    expect(div?.getAttribute('aria-describedby')).toBe('desc-1')
  })

  it('falls back to dismissed=false, disabled=false, and loading=false when null is assigned', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    document.body.append(element)
    await element.updateComplete

    element.dismissed = true
    await element.updateComplete
    expect(element.dismissed).toBe(true)

    // @ts-expect-error - testing fallback
    element.dismissed = null
    await element.updateComplete
    expect(element.dismissed).toBe(false)

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
  })

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.loading = true

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-alert-native]')
    expect(div?.getAttribute('aria-busy')).toBe('true')

    element.loading = false
    await element.updateComplete
    expect(div?.getAttribute('aria-busy')).toBe('false')
  })

  it('accepts the brand variant', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.variant = 'brand'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('brand')
    expect(
      element.querySelector('[data-sp-alert-native]')?.className
    ).toContain('sp-alert--brand')
  })

  it('projects slot="icon" content into the icon wrapper ahead of the message', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.innerHTML =
      '<svg slot="icon" aria-hidden="true"></svg><span>Heads up</span>'

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-alert-native]')
    const icon = native?.querySelector('.sp-alert__icon')
    expect(icon?.querySelector('svg')).not.toBeNull()
    expect(native?.firstElementChild).toBe(icon)
    expect(
      native?.querySelector(':scope > span:not(.sp-alert__icon)')?.textContent
    ).toBe('Heads up')
  })

  it('renders a dismiss button when dismissible and dismisses on click', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    element.dismissible = true
    element.append('Saved')
    const handler = vi.fn()
    element.addEventListener('sp-dismiss', handler)

    document.body.append(element)
    await element.updateComplete

    const native = element.querySelector('[data-sp-alert-native]')
    const button = element.querySelector<HTMLButtonElement>(
      '[data-sp-alert-dismiss]'
    )
    expect(native?.className).toContain('sp-alert--dismissible')
    expect(button?.getAttribute('aria-label')).toBe('Dismiss')
    expect(button?.className).toContain('sp-alert__dismiss')

    button?.click()
    await element.updateComplete

    expect(element.dismissed).toBe(true)
    expect(native?.className).toContain('sp-alert--dismissed')
    expect(handler).toHaveBeenCalledOnce()
  })

  it('omits the dismiss button by default and honors dismiss-label', async () => {
    const element = document.createElement('sp-alert') as SpectreAlertElement
    document.body.append(element)
    await element.updateComplete
    expect(element.querySelector('[data-sp-alert-dismiss]')).toBeNull()

    element.dismissible = true
    element.dismissLabel = 'Close notice'
    await element.updateComplete
    expect(
      element
        .querySelector('[data-sp-alert-dismiss]')
        ?.getAttribute('aria-label')
    ).toBe('Close notice')
  })
})
