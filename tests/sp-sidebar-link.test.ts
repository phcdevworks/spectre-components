import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreSidebarLink, SpectreSidebarLinkElement } from '../src'

describe('sp-sidebar-link', () => {
  beforeAll(() => {
    defineSpectreSidebarLink()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native anchor with the Spectre sidebar link class and projected content', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    element.href = '/settings'
    element.append(document.createTextNode('Settings'))

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')

    expect(link).not.toBeNull()
    expect(link?.className).toContain('sp-sidebar__link')
    expect(link?.getAttribute('href')).toBe('/settings')
    expect(link?.textContent?.trim()).toBe('Settings')
  })

  it('defaults to active=false, disabled=false, and level=parent', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    document.body.append(element)
    await element.updateComplete

    expect(element.active).toBe(false)
    expect(element.disabled).toBe(false)
    expect(element.level).toBe('parent')
  })

  it('reflects active onto the link class and aria-current', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    element.active = true

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.className).toContain('sp-sidebar__link--active')
    expect(link?.getAttribute('aria-current')).toBe('page')
  })

  it('reflects level=child onto the link class', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    element.level = 'child'

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.className).toContain('sp-sidebar__link--child')
  })

  it('reflects disabled by dropping href and setting aria-disabled', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    element.href = '/settings'
    element.disabled = true

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.className).toContain('sp-sidebar__link--disabled')
    expect(link?.getAttribute('aria-disabled')).toBe('true')
    expect(link?.hasAttribute('href')).toBe(false)
    expect(link?.getAttribute('tabindex')).toBe('-1')
  })

  it('falls back to level=parent for an invalid value', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    // @ts-expect-error - testing invalid value
    element.level = 'grandchild'

    document.body.append(element)
    await element.updateComplete

    expect(element.level).toBe('parent')
  })

  it('forwards aria-label to the native anchor', async () => {
    const element = document.createElement(
      'sp-sidebar-link'
    ) as SpectreSidebarLinkElement
    element.setAttribute('aria-label', 'Account settings')

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a')
    expect(link?.getAttribute('aria-label')).toBe('Account settings')
  })
})
