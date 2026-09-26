import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  defineSpectreTabPanel,
  defineSpectreTabs,
  SpectreTabPanelElement,
  SpectreTabsElement
} from '../src'

async function renderTabs(markup: string): Promise<SpectreTabsElement> {
  document.body.innerHTML = markup
  const tabs = document.querySelector('sp-tabs') as SpectreTabsElement
  await tabs.updateComplete
  const panels = Array.from(
    tabs.querySelectorAll<SpectreTabPanelElement>('sp-tab-panel')
  )
  await Promise.all(panels.map((panel) => panel.updateComplete))
  await tabs.updateComplete
  return tabs
}

function tabButtons(tabs: SpectreTabsElement): HTMLButtonElement[] {
  return Array.from(tabs.querySelectorAll('[data-sp-tabs-tab]'))
}

function nativePanels(tabs: SpectreTabsElement): HTMLElement[] {
  return Array.from(tabs.querySelectorAll('[data-sp-tab-panel-native]'))
}

const THREE_PANELS = `<sp-tabs aria-label="Settings">
  <sp-tab-panel label="General">General content</sp-tab-panel>
  <sp-tab-panel label="Billing">Billing content</sp-tab-panel>
  <sp-tab-panel label="Team">Team content</sp-tab-panel>
</sp-tabs>`

describe('sp-tabs', () => {
  beforeAll(() => {
    defineSpectreTabs()
    defineSpectreTabPanel()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a tablist with one tab per panel', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const list = tabs.querySelector('[role="tablist"]')
    const buttons = tabButtons(tabs)

    expect(tabs.querySelector('[data-sp-tabs-native]')?.className).toContain(
      'sp-tabs--line'
    )
    expect(list?.getAttribute('aria-label')).toBe('Settings')
    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'General',
      'Billing',
      'Team'
    ])
  })

  it('selects the first panel by default and wires ARIA relationships', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const [first, second] = tabButtons(tabs)
    const [firstPanel, secondPanel] = nativePanels(tabs)

    expect(first?.getAttribute('aria-selected')).toBe('true')
    expect(first?.getAttribute('tabindex')).toBe('0')
    expect(second?.getAttribute('aria-selected')).toBe('false')
    expect(second?.getAttribute('tabindex')).toBe('-1')
    expect(first?.getAttribute('aria-controls')).toBe(firstPanel?.id)
    expect(firstPanel?.getAttribute('aria-labelledby')).toBe(first?.id)
    expect(firstPanel?.hidden).toBe(false)
    expect(secondPanel?.hidden).toBe(true)
    expect(firstPanel?.textContent?.trim()).toBe('General content')
  })

  it('selects a tab on click and emits sp-change', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const handler = vi.fn()
    tabs.addEventListener('sp-change', handler)

    tabButtons(tabs)[1]?.click()
    await tabs.updateComplete

    expect(tabs.selectedIndex).toBe(1)
    expect(handler).toHaveBeenCalledOnce()
    expect((handler.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      index: 1
    })
    const panels = tabs.querySelectorAll<SpectreTabPanelElement>('sp-tab-panel')
    await panels[1]?.updateComplete
    expect(nativePanels(tabs)[1]?.hidden).toBe(false)
    expect(nativePanels(tabs)[0]?.hidden).toBe(true)
  })

  it('moves selection and focus with arrow, Home, and End keys', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const list = tabs.querySelector('[role="tablist"]') as HTMLElement
    const press = async (key: string) => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await tabs.updateComplete
      await tabs.updateComplete
    }

    await press('ArrowRight')
    expect(tabs.selectedIndex).toBe(1)
    expect(document.activeElement).toBe(tabButtons(tabs)[1])

    await press('End')
    expect(tabs.selectedIndex).toBe(2)

    await press('ArrowRight')
    expect(tabs.selectedIndex).toBe(0)

    await press('ArrowLeft')
    expect(tabs.selectedIndex).toBe(2)

    await press('Home')
    expect(tabs.selectedIndex).toBe(0)
  })

  it('uses vertical arrow keys and aria-orientation when vertical', async () => {
    const tabs = await renderTabs(
      THREE_PANELS.replace('<sp-tabs', '<sp-tabs vertical')
    )
    const list = tabs.querySelector('[role="tablist"]') as HTMLElement

    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    )
    await tabs.updateComplete
    expect(tabs.selectedIndex).toBe(1)
  })

  it('skips disabled panels for selection and keyboard navigation', async () => {
    const tabs = await renderTabs(`<sp-tabs selected-index="0">
      <sp-tab-panel label="One" disabled>One</sp-tab-panel>
      <sp-tab-panel label="Two">Two</sp-tab-panel>
      <sp-tab-panel label="Three" disabled>Three</sp-tab-panel>
    </sp-tabs>`)
    const buttons = tabButtons(tabs)

    expect(buttons[0]?.disabled).toBe(true)
    expect(buttons[1]?.getAttribute('aria-selected')).toBe('true')

    const list = tabs.querySelector('[role="tablist"]') as HTMLElement
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    )
    await tabs.updateComplete
    expect(tabButtons(tabs)[1]?.getAttribute('aria-selected')).toBe('true')
  })

  it('applies pill, vertical, and full-width recipe modifiers', async () => {
    const tabs = await renderTabs(
      THREE_PANELS.replace('<sp-tabs', '<sp-tabs variant="pill" full-width')
    )
    const native = tabs.querySelector('[data-sp-tabs-native]')

    expect(native?.className).toContain('sp-tabs--pill')
    expect(native?.className).toContain('sp-tabs--full')
  })

  it('falls back to line for an invalid variant', async () => {
    const tabs = await renderTabs(
      THREE_PANELS.replace('<sp-tabs', '<sp-tabs variant="bogus"')
    )
    expect(tabs.variant).toBe('line')
  })

  it('re-renders tab labels when a panel label changes', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const panel = tabs.querySelector('sp-tab-panel') as SpectreTabPanelElement

    panel.label = 'Overview'
    await panel.updateComplete
    await tabs.updateComplete

    expect(tabButtons(tabs)[0]?.textContent?.trim()).toBe('Overview')
  })

  it('picks up panels appended after the first render', async () => {
    const tabs = await renderTabs(THREE_PANELS)
    const panel = document.createElement(
      'sp-tab-panel'
    ) as SpectreTabPanelElement
    panel.label = 'Audit'
    panel.textContent = 'Audit content'
    tabs.append(panel)
    await new Promise((resolve) => setTimeout(resolve, 0))
    await tabs.updateComplete
    await panel.updateComplete

    expect(tabButtons(tabs).map((b) => b.textContent?.trim())).toContain(
      'Audit'
    )
    expect(nativePanels(tabs)).toHaveLength(4)
  })

  it('keeps an authored panel id for aria-controls', async () => {
    const tabs = await renderTabs(`<sp-tabs>
      <sp-tab-panel id="custom-panel" label="One">One</sp-tab-panel>
    </sp-tabs>`)

    expect(tabButtons(tabs)[0]?.getAttribute('aria-controls')).toBe(
      'custom-panel'
    )
    expect(nativePanels(tabs)[0]?.id).toBe('custom-panel')
  })
})
