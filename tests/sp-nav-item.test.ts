import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreNavItem, SpectreNavItemElement } from '../src'

describe('sp-nav-item', () => {
  beforeAll(() => {
    defineSpectreNavItem()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a plain link by default', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.href = '/about'
    element.textContent = 'About'

    document.body.append(element)
    await element.updateComplete

    const link = element.querySelector('a.sp-nav__link')

    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('/about')
    expect(link?.textContent).toBe('About')
    expect(element.querySelector('[data-sp-nav-item-trigger]')).toBeNull()
  })

  it('defaults to dropdown=false, open=false, placement=bottom-start', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    document.body.append(element)
    await element.updateComplete

    expect(element.dropdown).toBe(false)
    expect(element.open).toBe(false)
    expect(element.placement).toBe('bottom-start')
  })

  it('renders a trigger button and menu when dropdown=true', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    element.label = 'Products'
    const item = document.createElement('a')
    item.textContent = 'Widgets'
    element.append(item)

    document.body.append(element)
    await element.updateComplete

    const wrapper = element.querySelector('div.sp-dropdown')
    const trigger = element.querySelector('[data-sp-nav-item-trigger]')
    const menu = element.querySelector('[data-sp-nav-item-menu]')

    expect(wrapper).not.toBeNull()
    expect(trigger?.textContent?.trim()).toBe('Products')
    expect(menu?.querySelector('a')?.textContent).toBe('Widgets')
  })

  it('supports an sp-grid mega-menu inside the dropdown menu', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    element.label = 'Solutions'
    const grid = document.createElement('sp-grid')
    grid.setAttribute('columns', '3')
    const column = document.createElement('div')
    column.textContent = 'Column 1'
    grid.append(column)
    element.append(grid)

    document.body.append(element)
    await element.updateComplete

    const menu = element.querySelector('[data-sp-nav-item-menu]')

    expect(menu?.querySelector('sp-grid')).not.toBeNull()
  })

  it('opens on trigger click and closes on a second click', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-sp-nav-item-trigger]'
    )

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(false)
  })

  it('closes when clicking outside the nav item', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    element.open = true
    document.body.append(element)
    await element.updateComplete

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete

    expect(element.open).toBe(false)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
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
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    document.body.append(element)
    await element.updateComplete

    const openSpy = vi.fn()
    const closeSpy = vi.fn()
    element.addEventListener('sp-open', openSpy)
    element.addEventListener('sp-close', closeSpy)

    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-sp-nav-item-trigger]'
    )
    trigger?.click()
    await element.updateComplete
    expect(openSpy).toHaveBeenCalledTimes(1)

    trigger?.click()
    await element.updateComplete
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('falls back to placement=bottom-start for an invalid placement', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    // @ts-expect-error - testing invalid value
    element.placement = 'not-a-placement'

    document.body.append(element)
    await element.updateComplete

    expect(element.placement).toBe('bottom-start')
  })

  it('projects slot="trigger" content into the trigger button', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    const triggerContent = document.createElement('span')
    triggerContent.setAttribute('slot', 'trigger')
    triggerContent.textContent = 'Account'
    element.append(triggerContent)

    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector('[data-sp-nav-item-trigger]')

    expect(trigger?.querySelector('span')?.textContent).toBe('Account')
  })

  it('defaults mega to false and omits the mega classes', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    document.body.append(element)
    await element.updateComplete

    const wrapper = element.querySelector('div.sp-dropdown')
    const menu = element.querySelector('[data-sp-nav-item-menu]')

    expect(element.mega).toBe(false)
    expect(wrapper?.className).not.toContain('sp-dropdown--mega')
    expect(menu?.className).not.toContain('sp-dropdown__menu--mega')
  })

  it('reflects mega onto the wrapper and menu classes with a grid panel', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    element.mega = true
    element.label = 'Solutions'
    const grid = document.createElement('sp-grid')
    grid.setAttribute('columns', '3')
    element.append(grid)

    document.body.append(element)
    await element.updateComplete

    const wrapper = element.querySelector('div.sp-dropdown')
    const menu = element.querySelector('[data-sp-nav-item-menu]')

    expect(wrapper?.className).toContain('sp-dropdown--mega')
    expect(menu?.className).toContain('sp-dropdown__menu--mega')
    expect(menu?.querySelector('sp-grid')).not.toBeNull()
  })

  it('opens and closes normally when mega is enabled', async () => {
    const element = document.createElement(
      'sp-nav-item'
    ) as SpectreNavItemElement
    element.dropdown = true
    element.mega = true
    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-sp-nav-item-trigger]'
    )

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(false)
  })
})
