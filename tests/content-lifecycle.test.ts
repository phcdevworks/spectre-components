import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import {
  defineSpectreDropdown,
  defineSpectreTooltip,
  type SpectreDropdownElement,
  type SpectreTooltipElement
} from '../src'

beforeAll(() => {
  defineSpectreDropdown()
  defineSpectreTooltip()
})

afterEach(() => {
  document.body.innerHTML = ''
})

it.each(['dropdown', 'tooltip'] as const)(
  'preserves sp-%s content and node identity when appending and reconnecting',
  async (name) => {
    const element = document.createElement(`sp-${name}`) as
      SpectreDropdownElement | SpectreTooltipElement
    const trigger = document.createElement('span')
    trigger.textContent = 'Actions'
    const content = document.createElement('span')
    content.textContent = 'First item'
    if (name === 'dropdown') trigger.slot = 'trigger'
    else content.slot = 'tooltip'
    element.append(trigger, content)
    document.body.append(element)
    await element.updateComplete

    const triggerContainer = element.querySelector(`[data-sp-${name}-trigger]`)!
    const contentContainer = element.querySelector(
      name === 'dropdown'
        ? '[data-sp-dropdown-menu]'
        : '[data-sp-tooltip-native]'
    )!
    const added = document.createElement('span')
    added.textContent = 'Second item'
    if (name === 'tooltip') added.slot = 'tooltip'
    element.append(added)
    await vi.waitFor(() => expect(contentContainer.contains(added)).toBe(true))
    await element.updateComplete

    expect(triggerContainer.contains(trigger)).toBe(true)
    expect(Array.from(contentContainer.children)).toEqual([content, added])

    for (let index = 0; index < 2; index++) {
      element.remove()
      document.body.append(element)
      if (name === 'dropdown')
        (element as SpectreDropdownElement).open = index === 0
      else (element as SpectreTooltipElement).visible = index === 0
      await element.updateComplete
      expect(triggerContainer.contains(trigger)).toBe(true)
      expect(Array.from(contentContainer.children)).toEqual([content, added])
    }
  }
)
