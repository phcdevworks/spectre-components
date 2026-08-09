import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  defineSpectreSidebar,
  defineSpectreSidebarToggle,
  SpectreSidebarElement,
  SpectreSidebarToggleElement
} from '../src'

describe('sp-sidebar-toggle', () => {
  beforeAll(() => {
    defineSpectreSidebar()
    defineSpectreSidebarToggle()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function createSidebar(id: string): SpectreSidebarElement {
    const sidebar = document.createElement(
      'sp-sidebar'
    ) as SpectreSidebarElement
    sidebar.hideToggle = true
    sidebar.id = id
    return sidebar
  }

  it('renders a button with the Spectre sidebar-toggle class and default icon', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector('button')

    expect(button).not.toBeNull()
    expect(button?.className).toContain('sp-sidebar-toggle')
    expect(button?.textContent).toContain('☰')
  })

  it('defaults to aria-expanded=false and label="Toggle sidebar"', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector('button')

    expect(element.label).toBe('Toggle sidebar')
    expect(button?.getAttribute('aria-expanded')).toBe('false')
    expect(button?.getAttribute('aria-label')).toBe('Toggle sidebar')
  })

  it('opens the target sp-sidebar on click and reflects aria-expanded', async () => {
    const sidebar = createSidebar('remote-sidebar-1')
    const toggle = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    toggle.for = 'remote-sidebar-1'

    document.body.append(sidebar)
    document.body.append(toggle)
    await sidebar.updateComplete
    await toggle.updateComplete

    const button = toggle.querySelector<HTMLButtonElement>('button')
    button?.click()
    await sidebar.updateComplete
    await toggle.updateComplete

    expect(sidebar.open).toBe(true)
    expect(sidebar.getAttribute('data-sidebar-open')).toBe('true')
    expect(button?.getAttribute('aria-expanded')).toBe('true')

    button?.click()
    await sidebar.updateComplete
    await toggle.updateComplete

    expect(sidebar.open).toBe(false)
    expect(button?.getAttribute('aria-expanded')).toBe('false')
  })

  it('sets aria-controls to the for id', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    element.for = 'remote-sidebar-2'

    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector('button')

    expect(button?.getAttribute('aria-controls')).toBe('remote-sidebar-2')
  })

  it('stays in sync when a second toggle controls the same sidebar', async () => {
    const sidebar = createSidebar('remote-sidebar-3')
    const toggleA = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    toggleA.for = 'remote-sidebar-3'
    const toggleB = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    toggleB.for = 'remote-sidebar-3'

    document.body.append(sidebar, toggleA, toggleB)
    await sidebar.updateComplete
    await toggleA.updateComplete
    await toggleB.updateComplete

    toggleA.querySelector<HTMLButtonElement>('button')?.click()
    await sidebar.updateComplete
    await toggleA.updateComplete
    await toggleB.updateComplete

    expect(sidebar.open).toBe(true)
    expect(toggleB.querySelector('button')?.getAttribute('aria-expanded')).toBe(
      'true'
    )
  })

  it('does nothing on click when the for target does not resolve', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    element.for = 'missing-sidebar'

    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector<HTMLButtonElement>('button')
    expect(() => button?.click()).not.toThrow()
    expect(button?.getAttribute('aria-expanded')).toBe('false')
  })

  it('projects custom icon content instead of the default glyph', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    const icon = document.createElement('svg')
    icon.setAttribute('data-icon', 'menu')
    element.append(icon)

    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector('button')

    expect(button?.querySelector('svg[data-icon="menu"]')).not.toBeNull()
  })

  it('forwards the consumer-facing id to the native button only', async () => {
    const element = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    element.id = 'toggle-1'

    document.body.append(element)
    await element.updateComplete

    const button = element.querySelector('button')

    expect(element.getAttribute('id')).toBe('toggle-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(button?.id).toBe('toggle-1')
  })
})
