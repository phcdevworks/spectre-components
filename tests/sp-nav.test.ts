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

  it('defaults to align=undefined and applies no align class', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    document.body.append(element)
    await element.updateComplete

    expect(element.align).toBeUndefined()
    const nav = element.querySelector('nav')
    expect(nav?.className).not.toContain('sp-nav--align-')
  })

  it('reflects align onto the nav classes', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    element.align = 'center'

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')
    expect(nav?.className).toContain('sp-nav--align-center')
  })

  it('falls back to align=undefined for an invalid value', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    // @ts-expect-error - testing invalid value
    element.align = 'not-an-align'

    document.body.append(element)
    await element.updateComplete

    expect(element.align).toBeUndefined()
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

  it('defaults the host to block display', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    document.body.append(element)
    await element.updateComplete

    expect(getComputedStyle(element).display).toBe('block')
  })

  it('applies innerClass to the native nav without touching the host class', async () => {
    const element = document.createElement('sp-nav') as SpectreNavElement
    element.className = 'host-class'
    element.innerClass = 'sp-px-4 not-allowed'

    document.body.append(element)
    await element.updateComplete

    const nav = element.querySelector('nav')

    expect(nav?.className).toContain('sp-px-4')
    expect(nav?.className).not.toContain('not-allowed')
    expect(nav?.className).not.toContain('host-class')
    expect(element.className).toBe('host-class')
  })
})
