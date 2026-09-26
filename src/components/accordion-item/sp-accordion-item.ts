import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId, replaceClasses, spectreKindKey } from '../../utils/dom'
import { renderIcon } from '../../utils/icons'
import { ProjectionController } from '../../utils/projection'
import {
  hoverFocusStateProperties,
  hoverFocusStates,
  type SpectreHoverFocusStateProps
} from '../../utils/states'

import {
  getAccordionHeaderClasses,
  getAccordionIconClasses,
  getAccordionItemClasses,
  getAccordionPanelClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreAccordionItemProps extends SpectreHoverFocusStateProps {
  ariaLabel?: string | null
  disabled?: boolean | undefined
  id?: string | null | undefined
  label?: string | undefined
  open?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreAccordionItemElement
  extends SpectreBaseElement
  implements SpectreAccordionItemProps
{
  static properties = {
    ...hoverFocusStateProperties,
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
    open: { type: Boolean, reflect: true }
  }

  readonly [spectreKindKey] = 'accordion-item'

  focused: boolean | undefined = false
  hovered: boolean | undefined = false
  disabled: boolean | undefined = false
  label: string | undefined = undefined
  open: boolean | undefined = false

  private readonly generatedId = createUniqueId('sp-accordion-item')
  private appliedHostClasses = ''
  private readonly projection = new ProjectionController(this, [
    'data-sp-accordion-item-header',
    'data-sp-accordion-item-panel'
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
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
    }

    // The host is the item so the recipe's `item + item` divider applies
    // between sibling accordion items.
    const hostClasses = getAccordionItemClasses({
      disabled: this.disabled ?? false,
      expanded: this.open ?? false
    })
    replaceClasses(this, this.appliedHostClasses, hostClasses)
    this.appliedHostClasses = hostClasses
  }

  private get headerId(): string {
    return this.id || `${this.generatedId}-header`
  }

  private get panelId(): string {
    return `${this.generatedId}-panel`
  }

  private toggle(): void {
    if (this.disabled) {
      return
    }
    this.open = !this.open
    this.dispatchEvent(
      new CustomEvent(this.open ? 'sp-open' : 'sp-close', { bubbles: true })
    )
  }

  override render() {
    const expanded = this.open ?? false
    const disabled = this.disabled ?? false

    return html`<button
        aria-controls="${this.panelId}"
        aria-expanded="${expanded ? 'true' : 'false'}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        class="${getAccordionHeaderClasses({
          ...hoverFocusStates(this),
          disabled,
          expanded
        })}"
        data-sp-accordion-item-header
        ?disabled="${disabled}"
        id="${this.headerId}"
        title="${ifDefined(this.title || undefined)}"
        type="button"
        @click="${() => this.toggle()}"
      >
        ${
          this.projection.has('header')
            ? this.projection.nodes('header')
            : (this.label ?? '')
        }
        <span class="${getAccordionIconClasses({ expanded })}"
          >${renderIcon('chevronDown')}</span
        >
      </button>
      <div
        aria-labelledby="${this.headerId}"
        class="${getAccordionPanelClasses({ expanded })}"
        data-sp-accordion-item-panel
        ?hidden="${!expanded}"
        id="${this.panelId}"
        role="region"
      >
        ${this.projection.nodes()}
      </div>`
  }
}

export function defineSpectreAccordionItem(
  tagName = 'sp-accordion-item'
): typeof SpectreAccordionItemElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreAccordionItemElement
  }

  customElements.define(tagName, SpectreAccordionItemElement)
  return SpectreAccordionItemElement
}
