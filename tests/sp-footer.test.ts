import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreFooter, SpectreFooterElement } from '../src'

describe('sp-footer', () => {
  beforeAll(() => {
    defineSpectreFooter()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native footer with the Spectre footer class and projected content', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    const link = document.createElement('a')
    link.textContent = 'Privacy'
    element.append(link)

    document.body.append(element)
    await element.updateComplete

    const footer = element.querySelector('footer')

    expect(footer).not.toBeNull()
    expect(footer?.className).toContain('sp-footer')
    expect(footer?.querySelector('a')?.textContent).toBe('Privacy')
  })

  it('defaults to bordered=false and full-width=false', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    document.body.append(element)
    await element.updateComplete

    expect(element.bordered).toBe(false)
    expect(element.fullWidth).toBe(false)
  })

  it('reflects bordered and full-width onto the footer classes', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    element.bordered = true
    element.fullWidth = true

    document.body.append(element)
    await element.updateComplete

    const footer = element.querySelector('footer')

    expect(footer?.className).toContain('sp-footer--bordered')
    expect(footer?.className).toContain('sp-footer--full')
  })

  it('falls back to false when null is assigned', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    document.body.append(element)
    await element.updateComplete

    // @ts-expect-error - testing fallback
    element.bordered = null
    await element.updateComplete
    expect(element.bordered).toBe(false)
  })

  it('forwards the consumer-facing id to the native footer only', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    element.id = 'footer-1'

    document.body.append(element)
    await element.updateComplete

    const footer = element.querySelector('footer')

    expect(element.getAttribute('id')).toBe('footer-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(footer?.id).toBe('footer-1')
  })

  it('forwards aria-label to the native footer', async () => {
    const element = document.createElement('sp-footer') as SpectreFooterElement
    element.setAttribute('aria-label', 'Site footer')

    document.body.append(element)
    await element.updateComplete

    const footer = element.querySelector('footer')

    expect(footer?.getAttribute('aria-label')).toBe('Site footer')
  })
})
