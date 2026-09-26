import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId, spectreKindKey } from '../../utils/dom'
import { ProjectionController } from '../../utils/projection'

import { getTabsPanelClasses } from '@phcdevworks/spectre-ui'

export interface SpectreTabPanelProps {
  disabled?: boolean | undefined
  id?: string | null | undefined
  label?: string | undefined
  title?: string | null | undefined
}

export class SpectreTabPanelElement
  extends SpectreBaseElement
  implements SpectreTabPanelProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
    selected: { type: Boolean, reflect: true },
    tabId: { attribute: false }
  }

  readonly [spectreKindKey] = 'tab-panel'

  disabled: boolean | undefined = false
  label: string | undefined = undefined
  // Owned by the parent `sp-tabs`, which sets it from its `selectedIndex`.
  selected = false
  tabId: string | undefined = undefined

  private readonly generatedId = createUniqueId('sp-tab-panel')
  private readonly projection = new ProjectionController(this, [
    'data-sp-tab-panel-native'
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

  get panelId(): string {
    return this.id || this.generatedId
  }

  override connectedCallback(): void {
    super.connectedCallback()
    // The rendered panel must be a direct flex child of the tabs container.
    this.style.display ||= 'contents'
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    if (changedProperties.has('label') || changedProperties.has('disabled')) {
      this.dispatchEvent(
        new CustomEvent('sp-tab-panel-change', { bubbles: true })
      )
    }
  }

  override render() {
    return html`<div
      aria-labelledby="${ifDefined(this.tabId)}"
      class="${getTabsPanelClasses()}"
      data-sp-tab-panel-native
      ?hidden="${!this.selected}"
      id="${this.panelId}"
      role="tabpanel"
      tabindex="0"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreTabPanel(
  tagName = 'sp-tab-panel'
): typeof SpectreTabPanelElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTabPanelElement
  }

  customElements.define(tagName, SpectreTabPanelElement)
  return SpectreTabPanelElement
}
