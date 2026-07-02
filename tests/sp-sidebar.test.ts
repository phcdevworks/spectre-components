import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreSidebar, SpectreSidebarElement } from '../src'

describe('sp-sidebar', () => {
  beforeAll(() => {
    defineSpectreSidebar()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a toggle button, backdrop, and native aside with projected content', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    const link = document.createElement('a')
    link.textContent = 'Dashboard'
    element.append(link)

    document.body.append(element)
    await element.updateComplete

    const aside = element.querySelector('aside')
    const toggle = element.querySelector('[data-sp-sidebar-toggle]')
    const backdrop = element.querySelector('[data-sp-sidebar-backdrop]')

    expect(aside?.className).toContain('sp-sidebar')
    expect(toggle).not.toBeNull()
    expect(backdrop).not.toBeNull()
    expect(aside?.querySelector('a')?.textContent).toBe('Dashboard')
  })

  it('defaults to closed with data-sidebar-open=false on the host', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    document.body.append(element)
    await element.updateComplete

    expect(element.open).toBe(false)
    expect(element.getAttribute('data-sidebar-open')).toBe('false')
  })

  it('opens when the toggle button is clicked and sets data-sidebar-open=true', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    document.body.append(element)
    await element.updateComplete

    const toggle = element.querySelector<HTMLButtonElement>(
      '[data-sp-sidebar-toggle]'
    )
    toggle?.click()
    await element.updateComplete

    expect(element.open).toBe(true)
    expect(element.getAttribute('data-sidebar-open')).toBe('true')
    expect(toggle?.getAttribute('aria-expanded')).toBe('true')
  })

  it('closes when the backdrop is clicked', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    const backdrop = element.querySelector<HTMLElement>(
      '[data-sp-sidebar-backdrop]'
    )
    backdrop?.click()
    await element.updateComplete

    expect(element.open).toBe(false)
  })

  it('closes on Escape when open', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    await element.updateComplete

    expect(element.open).toBe(false)
  })

  it('dispatches sp-open and sp-close events', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    document.body.append(element)
    await element.updateComplete

    const openSpy = vi.fn()
    const closeSpy = vi.fn()
    element.addEventListener('sp-open', openSpy)
    element.addEventListener('sp-close', closeSpy)

    element
      .querySelector<HTMLButtonElement>('[data-sp-sidebar-toggle]')
      ?.click()
    await element.updateComplete
    expect(openSpy).toHaveBeenCalledTimes(1)

    element
      .querySelector<HTMLButtonElement>('[data-sp-sidebar-toggle]')
      ?.click()
    await element.updateComplete
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('reflects bordered onto the aside classes', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    element.bordered = true

    document.body.append(element)
    await element.updateComplete

    const aside = element.querySelector('aside')

    expect(aside?.className).toContain('sp-sidebar--bordered')
  })

  it('uses a custom toggle-label', async () => {
    const element = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    element.toggleLabel = 'Open navigation'

    document.body.append(element)
    await element.updateComplete

    const toggle = element.querySelector('[data-sp-sidebar-toggle]')

    expect(toggle?.getAttribute('aria-label')).toBe('Open navigation')
  })
})
