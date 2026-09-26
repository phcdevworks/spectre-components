import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId } from '../../utils/dom'
import { getFocusableElements, trapFocus } from '../../utils/focus'
import {
  isOffcanvasPlacement,
  type SpectreOffcanvasPlacement
} from '../../utils/form'
import { renderIcon } from '../../utils/icons'
import { ProjectionController } from '../../utils/projection'

import {
  getButtonClasses,
  getOffcanvasBackdropClasses,
  getOffcanvasBodyClasses,
  getOffcanvasClasses,
  getOffcanvasFooterClasses,
  getOffcanvasHeaderClasses,
  type OffcanvasPlacement
} from '@phcdevworks/spectre-ui'

export interface SpectreOffcanvasProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  closeLabel?: string | undefined
  id?: string | null | undefined
  label?: string | undefined
  open?: boolean | undefined
  placement?: SpectreOffcanvasPlacement | undefined
  title?: string | null | undefined
}

export class SpectreOffcanvasElement
  extends SpectreBaseElement
  implements SpectreOffcanvasProps
{
  static properties = {
    closeLabel: { attribute: 'close-label', type: String },
    label: { type: String },
    open: { type: Boolean, reflect: true },
    placement: { type: String, reflect: true }
  }

  closeLabel: string | undefined = 'Close'
  label: string | undefined = undefined
  open: boolean | undefined = false
  placement: SpectreOffcanvasPlacement | undefined = 'start'

  private previouslyFocusedElement: HTMLElement | null = null
  private readonly titleId = `${createUniqueId('sp-offcanvas')}-title`
  private readonly projection = new ProjectionController(this, [
    'data-sp-offcanvas-backdrop',
    'data-sp-offcanvas-native'
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
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleDocumentKeydown)
    super.disconnectedCallback()
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('closeLabel') && !this.closeLabel) {
      this.closeLabel = 'Close'
    }
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
    }
    if (
      changedProperties.has('placement') &&
      (this.placement == null || !isOffcanvasPlacement(this.placement))
    ) {
      this.placement = 'start'
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)

    if (!changedProperties.has('open')) {
      return
    }

    if (this.open) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement
      this.focusPanel()
    } else if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  private get panelElement(): HTMLElement | null {
    return this.querySelector('[data-sp-offcanvas-native]')
  }

  // The panel's `visibility` transitions in from `hidden`, so it cannot take
  // focus until the slide-in finishes unless motion is disabled.
  private focusPanel(): void {
    const panel = this.panelElement
    const focusFirst = () => {
      const [first] = getFocusableElements(panel)
      ;(first ?? panel)?.focus()
    }
    focusFirst()
    if (panel && !panel.contains(document.activeElement)) {
      panel.addEventListener(
        'transitionend',
        () => {
          if (this.open) {
            focusFirst()
          }
        },
        { once: true }
      )
    }
  }

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.open) {
      return
    }
    if (event.key === 'Escape') {
      this.close()
    } else if (event.key === 'Tab') {
      trapFocus(event, this.panelElement)
    }
  }

  private close(): void {
    if (!this.open) {
      return
    }
    this.open = false
    this.dispatchEvent(new CustomEvent('sp-close', { bubbles: true }))
  }

  private get hasHeading(): boolean {
    return this.projection.has('header') || Boolean(this.label)
  }

  private get labelledBy(): string | undefined {
    if (this.forwardedAriaLabelledBy) {
      return this.forwardedAriaLabelledBy
    }
    return this.hasHeading && !this.forwardedAriaLabel
      ? this.titleId
      : undefined
  }

  override render() {
    const open = this.open ?? false

    return html`<div
        aria-hidden="true"
        class="${getOffcanvasBackdropClasses({ open })}"
        data-sp-offcanvas-backdrop
        @click="${() => this.close()}"
      ></div>
      <div
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.labelledBy)}"
        aria-modal="true"
        class="${getOffcanvasClasses({
          open,
          placement: this.placement as OffcanvasPlacement
        })}"
        data-sp-offcanvas-native
        id="${ifDefined(this.id || undefined)}"
        ?inert="${!open}"
        role="dialog"
        tabindex="-1"
        title="${ifDefined(this.title || undefined)}"
      >
        <div class="${getOffcanvasHeaderClasses()}">
          <div id="${ifDefined(this.hasHeading ? this.titleId : undefined)}">
            ${
              this.projection.has('header')
                ? this.projection.nodes('header')
                : (this.label ?? nothing)
            }
          </div>
          <button
            aria-label="${this.closeLabel ?? 'Close'}"
            class="${getButtonClasses({ size: 'sm', variant: 'ghost' })}"
            data-sp-offcanvas-close
            type="button"
            @click="${() => this.close()}"
          >
            ${renderIcon('close')}
          </button>
        </div>
        <div class="${getOffcanvasBodyClasses()}">
          ${this.projection.nodes()}
        </div>
        ${
          this.projection.has('footer')
            ? html`<div class="${getOffcanvasFooterClasses()}">
                ${this.projection.nodes('footer')}
              </div>`
            : nothing
        }
      </div>`
  }
}

export function defineSpectreOffcanvas(
  tagName = 'sp-offcanvas'
): typeof SpectreOffcanvasElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreOffcanvasElement
  }

  customElements.define(tagName, SpectreOffcanvasElement)
  return SpectreOffcanvasElement
}
