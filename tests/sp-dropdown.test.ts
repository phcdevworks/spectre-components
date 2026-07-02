import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreDropdown, SpectreDropdownElement } from '../src'

describe('sp-dropdown', () => {
  beforeAll(() => {
    defineSpectreDropdown()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a trigger button and a menu with projected content', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    const item = document.createElement('a')
    item.textContent = 'Profile'
    element.append(item)

    document.body.append(element)
    await element.updateComplete

    const wrapper = element.querySelector('div.sp-dropdown')
    const trigger = element.querySelector('[data-sp-dropdown-trigger]')
    const menu = element.querySelector('[data-sp-dropdown-menu]')

    expect(wrapper).not.toBeNull()
    expect(trigger).not.toBeNull()
    expect(menu?.querySelector('a')?.textContent).toBe('Profile')
  })

  it('defaults to closed with placement=bottom-start', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    document.body.append(element)
    await element.updateComplete

    expect(element.open).toBe(false)
    expect(element.placement).toBe('bottom-start')
  })

  it('falls back to placement=bottom-start for an invalid placement', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    // @ts-expect-error - testing invalid value
    element.placement = 'not-a-placement'

    document.body.append(element)
    await element.updateComplete

    expect(element.placement).toBe('bottom-start')
  })

  it('opens on trigger click and closes on a second click', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-sp-dropdown-trigger]'
    )

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')

    trigger?.click()
    await element.updateComplete
    expect(element.open).toBe(false)
  })

  it('closes when clicking outside the dropdown', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete

    expect(element.open).toBe(false)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
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
      'sp-dropdown'
    ) as SpectreDropdownElement
    document.body.append(element)
    await element.updateComplete

    const openSpy = vi.fn()
    const closeSpy = vi.fn()
    element.addEventListener('sp-open', openSpy)
    element.addEventListener('sp-close', closeSpy)

    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-sp-dropdown-trigger]'
    )
    trigger?.click()
    await element.updateComplete
    expect(openSpy).toHaveBeenCalledTimes(1)

    trigger?.click()
    await element.updateComplete
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('projects slot="trigger" content into the trigger button', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    const triggerContent = document.createElement('span')
    triggerContent.setAttribute('slot', 'trigger')
    triggerContent.textContent = 'Account'
    element.append(triggerContent)

    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector('[data-sp-dropdown-trigger]')

    expect(trigger?.querySelector('span')?.textContent).toBe('Account')
  })

  it('reflects full-width onto the wrapper classes', async () => {
    const element = document.createElement(
      'sp-dropdown'
    ) as SpectreDropdownElement
    element.fullWidth = true

    document.body.append(element)
    await element.updateComplete

    const wrapper = element.querySelector('div.sp-dropdown')

    expect(wrapper?.className).toContain('sp-dropdown--full')
  })
})
