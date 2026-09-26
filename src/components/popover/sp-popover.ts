import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId } from '../../utils/dom'
import {
  isPopoverPlacement,
  type SpectrePopoverPlacement
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getPopoverArrowClasses,
  getPopoverBodyClasses,
  getPopoverClasses,
  getPopoverHeaderClasses,
  type PopoverPlacement
} from '@phcdevworks/spectre-ui'

export interface SpectrePopoverProps {
  ariaLabel?: string | null
  id?: string | null | undefined
  label?: string | undefined
  open?: boolean | undefined
  placement?: SpectrePopoverPlacement | undefined
  title?: string | null | undefined
  triggerLabel?: string | undefined
}

// A click-toggled, non-modal dialog anchored to its trigger. Unlike
// `sp-tooltip` it stays open for interaction until dismissed.
export class SpectrePopoverElement
  extends SpectreBaseElement
  implements SpectrePopoverProps
{
  static properties = {
    label: { type: String },
    open: { type: Boolean, reflect: true },
    placement: { type: String, reflect: true },
    triggerLabel: { attribute: 'trigger-label', type: String }
  }

  label: string | undefined = undefined
  open: boolean | undefined = false
  placement: SpectrePopoverPlacement | undefined = 'bottom'
  triggerLabel: string | undefined = 'Show details'

  private readonly baseId = createUniqueId('sp-popover')
  private readonly projection = new ProjectionController(this, [
    'data-sp-popover-trigger',
    'data-sp-popover-native'
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
    this.style.position ||= 'relative'
    this.style.display ||= 'inline-block'
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  override disconnectedCallback(): void {
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('keydown', this.handleDocumentKeydown)
    super.disconnectedCallback()
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
    }
    if (
      changedProperties.has('placement') &&
      (this.placement == null || !isPopoverPlacement(this.placement))
    ) {
      this.placement = 'bottom'
    }
    if (changedProperties.has('triggerLabel') && !this.triggerLabel) {
      this.triggerLabel = 'Show details'
    }
  }

  private get triggerElement(): HTMLButtonElement | null {
    return this.querySelector('[data-sp-popover-trigger]')
  }

  private get panelId(): string {
    return this.id || `${this.baseId}-panel`
  }

  private get headerId(): string {
    return `${this.baseId}-header`
  }

  private get hasHeader(): boolean {
    return this.projection.has('header') || Boolean(this.label)
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    if (this.open && !event.composedPath().includes(this)) {
      this.setOpen(false)
    }
  }

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      this.setOpen(false)
      this.triggerElement?.focus()
    }
  }

  private setOpen(open: boolean): void {
    if (this.open === open) {
      return
    }
    this.open = open
    this.dispatchEvent(
      new CustomEvent(open ? 'sp-open' : 'sp-close', { bubbles: true })
    )
  }

  private get dialogLabelledBy(): string | undefined {
    if (this.forwardedAriaLabel) {
      return undefined
    }
    return this.hasHeader ? this.headerId : `${this.baseId}-trigger`
  }

  override render() {
    const open = this.open ?? false

    return html`<button
        aria-controls="${this.panelId}"
        aria-expanded="${open ? 'true' : 'false'}"
        aria-haspopup="dialog"
        data-sp-popover-trigger
        id="${this.baseId}-trigger"
        type="button"
        @click="${() => this.setOpen(!open)}"
      >
        ${
          this.projection.has('trigger')
            ? this.projection.nodes('trigger')
            : this.triggerLabel
        }
      </button>
      <div
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.dialogLabelledBy)}"
        class="${getPopoverClasses({
          open,
          placement: this.placement as PopoverPlacement
        })}"
        data-sp-popover-native
        id="${this.panelId}"
        role="dialog"
        title="${ifDefined(this.title || undefined)}"
      >
        <span aria-hidden="true" class="${getPopoverArrowClasses()}"></span>
        ${
          this.hasHeader
            ? html`<div
                class="${getPopoverHeaderClasses()}"
                id="${this.headerId}"
              >
                ${
                  this.projection.has('header')
                    ? this.projection.nodes('header')
                    : this.label
                }
              </div>`
            : nothing
        }
        <div class="${getPopoverBodyClasses()}">${this.projection.nodes()}</div>
      </div>`
  }
}

export function defineSpectrePopover(
  tagName = 'sp-popover'
): typeof SpectrePopoverElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectrePopoverElement
  }

  customElements.define(tagName, SpectrePopoverElement)
  return SpectrePopoverElement
}
