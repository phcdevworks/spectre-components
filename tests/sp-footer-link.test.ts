import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreFooterLink, SpectreFooterLinkElement } from '../src'

describe('sp-footer-link', () => {
  beforeAll(() => {
    defineSpectreFooterLink()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native anchor with the Spectre footer link class and projected content', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    element.href = '/privacy'
    element.append(document.createTextNode('Privacy'))

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')

    expect(link).not.toBeNull()
    expect(link?.className).toContain('sp-footer__link')
    expect(link?.getAttribute('href')).toBe('/privacy')
    expect(link?.textContent?.trim()).toBe('Privacy')
  })

  it('defaults to active=false and disabled=false', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    document.body.append(element)
    await element.updateComplete

    expect(element.active).toBe(false)
    expect(element.disabled).toBe(false)
  })

  it('reflects active onto the link class and aria-current', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    element.active = true

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.className).toContain('sp-footer__link--active')
    expect(link?.getAttribute('aria-current')).toBe('page')
  })

  it('reflects disabled by dropping href and setting aria-disabled', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    element.href = '/privacy'
    element.disabled = true

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.className).toContain('sp-footer__link--disabled')
    expect(link?.getAttribute('aria-disabled')).toBe('true')
    expect(link?.hasAttribute('href')).toBe(false)
    expect(link?.getAttribute('tabindex')).toBe('-1')
  })

  it('falls back to false when null is assigned', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    document.body.append(element)
    await element.updateComplete

    // @ts-expect-error - testing fallback
    element.active = null
    // @ts-expect-error - testing fallback
    element.disabled = null
    await element.updateComplete

    expect(element.active).toBe(false)
    expect(element.disabled).toBe(false)
  })

  it('forwards aria-label to the native anchor', async () => {
    const element = document.createElement(
      'sp-footer-link'
    ) as SpectreFooterLinkElement
    element.setAttribute('aria-label', 'Privacy policy')

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.getAttribute('aria-label')).toBe('Privacy policy')
  })
})
