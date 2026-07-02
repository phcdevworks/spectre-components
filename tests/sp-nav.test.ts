import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreNav, SpectreNavElement } from '../src'

describe('sp-nav', () => {
  beforeAll(() => {
    defineSpectreNav()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native nav with the Spectre nav class and projected content', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    const link = document.createElement('a')
    link.textContent = 'Home'
    element.append(link)

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')

    expect(nav).not.toBeNull()
    expect(nav?.className).toContain('sp-nav')
    expect(nav?.querySelector('a')?.textContent).toBe('Home')
  })

  it('defaults to bordered=false, sticky=false, and full-width=false', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    document.body.append(element)
    await element.updateComplete

    expect(element.bordered).toBe(false)
    expect(element.sticky).toBe(false)
    expect(element.fullWidth).toBe(false)
  })

  it('reflects bordered, sticky, and full-width onto the nav classes', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    element.bordered = true
    element.sticky = true
    element.fullWidth = true

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')

    expect(nav?.className).toContain('sp-nav--bordered')
    expect(nav?.className).toContain('sp-nav--sticky')
    expect(nav?.className).toContain('sp-nav--full')
  })

  it('falls back to false when null is assigned', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    document.body.append(element)
    await element.updateComplete

    // @ts-expect-error - testing fallback
    element.bordered = null
    await element.updateComplete
    expect(element.bordered).toBe(false)
  })

  it('forwards the consumer-facing id to the native nav only', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    element.id = 'nav-1'

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')

    expect(element.getAttribute('id')).toBe('nav-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(nav?.id).toBe('nav-1')
  })

  it('forwards aria-label to the native nav', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    element.setAttribute('aria-label', 'Primary')

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')

    expect(nav?.getAttribute('aria-label')).toBe('Primary')
  })
})
