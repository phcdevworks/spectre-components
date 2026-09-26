import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId, isSpectreKind } from '../../utils/dom'
import {
  isTabsVariant,
  normalizeInt,
  type SpectreTabsVariant
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'
import type { SpectreTabPanelElement } from '../tab-panel/sp-tab-panel'

import {
  getTabsClasses,
  getTabsItemClasses,
  getTabsListClasses,
  type TabsVariant
} from '@phcdevworks/spectre-ui'

export interface SpectreTabsProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  selectedIndex?: number | undefined
  title?: string | null | undefined
  variant?: SpectreTabsVariant | undefined
  vertical?: boolean | undefined
}

export class SpectreTabsElement
  extends SpectreBaseElement
  implements SpectreTabsProps
{
  static properties = {
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    selectedIndex: { attribute: 'selected-index', type: Number, reflect: true },
    variant: { type: String, reflect: true },
    vertical: { type: Boolean, reflect: true }
  }

  fullWidth: boolean | undefined = false
  selectedIndex: number | undefined = 0
  variant: SpectreTabsVariant | undefined = 'line'
  vertical: boolean | undefined = false

  private readonly baseId = createUniqueId('sp-tabs')
  private readonly projection = new ProjectionController(this, [
    'data-sp-tabs-native'
  ])

  override get id(): string {
    return super.id
  }

  override set id(value: string | null | undefined) {
    super.id = value
  }

  override get title(): string {
    return super.title
  }

  override set title(value: string | null | undefined) {
    super.title = value
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.style.display ||= 'block'
    this.addEventListener('sp-tab-panel-change', this.handlePanelChange)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sp-tab-panel-change', this.handlePanelChange)
    super.disconnectedCallback()
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('selectedIndex')) {
      this.selectedIndex = normalizeInt(this.selectedIndex, 0)
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isTabsVariant(this.variant))
    ) {
      this.variant = 'line'
    }
    if (changedProperties.has('vertical') && this.vertical == null) {
      this.vertical = false
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const activeIndex = this.activeIndex
    this.panels.forEach((panel, index) => {
      panel.selected = index === activeIndex
      panel.tabId = this.tabId(index)
    })
  }

  private handlePanelChange = (event: Event): void => {
    event.stopPropagation()
    this.requestUpdate()
  }

  private get panels(): SpectreTabPanelElement[] {
    return this.projection
      .elements()
      .filter((element): element is SpectreTabPanelElement =>
        isSpectreKind(element, 'tab-panel')
      )
  }

  // Falls back to the first enabled panel when the requested one is missing
  // or disabled; -1 when every panel is disabled.
  private get activeIndex(): number {
    const panels = this.panels
    const index = this.selectedIndex ?? 0
    if (panels[index] && !panels[index].disabled) {
      return index
    }
    return panels.findIndex((panel) => !panel.disabled)
  }

  private tabId(index: number): string {
    return `${this.baseId}-tab-${index}`
  }

  private get tabButtons(): HTMLButtonElement[] {
    return Array.from(
      this.querySelectorAll<HTMLButtonElement>('[data-sp-tabs-tab]')
    ).filter(
      (button) => button.closest('[data-sp-tabs-native]') === this.native
    )
  }

  private get native(): Element | null {
    return this.querySelector('[data-sp-tabs-native]')
  }

  private select(index: number): void {
    const panel = this.panels[index]
    if (!panel || panel.disabled || index === this.activeIndex) {
      return
    }
    this.selectedIndex = index
    this.dispatchEvent(
      new CustomEvent('sp-change', { bubbles: true, detail: { index } })
    )
  }

  private handleKeydown = async (event: KeyboardEvent): Promise<void> => {
    const enabled = this.panels
      .map((panel, index) => (panel.disabled ? -1 : index))
      .filter((index) => index >= 0)
    if (enabled.length === 0) {
      return
    }

    const position = enabled.indexOf(this.activeIndex)
    const previousKey = this.vertical ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = this.vertical ? 'ArrowDown' : 'ArrowRight'
    let target: number | undefined

    switch (event.key) {
      case previousKey:
        target = enabled[(position - 1 + enabled.length) % enabled.length]
        break
      case nextKey:
        target = enabled[(position + 1) % enabled.length]
        break
      case 'Home':
        target = enabled[0]
        break
      case 'End':
        target = enabled[enabled.length - 1]
        break
      default:
        return
    }

    if (target === undefined) {
      return
    }
    event.preventDefault()
    this.select(target)
    await this.updateComplete
    this.tabButtons[target]?.focus()
  }

  private get tabsClasses(): string {
    return getTabsClasses({
      fullWidth: this.fullWidth ?? false,
      variant: this.variant as TabsVariant,
      vertical: this.vertical ?? false
    })
  }

  override render() {
    const panels = this.panels
    const activeIndex = this.activeIndex

    return html`<div
      class="${this.tabsClasses}"
      data-sp-tabs-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <div
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        aria-orientation="${ifDefined(this.vertical ? 'vertical' : undefined)}"
        class="${getTabsListClasses()}"
        role="tablist"
        @keydown="${this.handleKeydown}"
      >
        ${panels.map((panel, index) => {
          const active = index === activeIndex
          return html`<button
            aria-controls="${panel.panelId}"
            aria-selected="${active ? 'true' : 'false'}"
            class="${getTabsItemClasses({
              active,
              disabled: panel.disabled ?? false
            })}"
            data-sp-tabs-tab
            ?disabled="${panel.disabled ?? false}"
            id="${this.tabId(index)}"
            role="tab"
            tabindex="${active ? '0' : '-1'}"
            type="button"
            @click="${() => this.select(index)}"
          >
            ${panel.label ?? ''}
          </button>`
        })}
      </div>
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreTabs(
  tagName = 'sp-tabs'
): typeof SpectreTabsElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTabsElement
  }

  customElements.define(tagName, SpectreTabsElement)
  return SpectreTabsElement
}
