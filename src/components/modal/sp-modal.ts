import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'

import {
  getModalClasses,
  getModalOverlayClasses
} from '@phcdevworks/spectre-ui'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

export interface SpectreModalProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  open?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreModalElement
  extends SpectreProjectableElement
  implements SpectreModalProps
{
  static properties = {
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true }
  }

  fullWidth: boolean | undefined = false
  open: boolean | undefined = false

  private previouslyFocusedElement: HTMLElement | null = null

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

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-modal-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return (
      el.hasAttribute('data-sp-modal-native') ||
      el.hasAttribute('data-sp-modal-overlay')
    )
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
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
      this.focusFirstElement()
    } else if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleDocumentKeydown)
    super.disconnectedCallback()
  }

  private get modalElement(): HTMLElement | null {
    return this.querySelector('[data-sp-modal-native]')
  }

  private get focusableElements(): HTMLElement[] {
    const modal = this.modalElement
    if (!modal) {
      return []
    }
    return Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  private focusFirstElement(): void {
    const [first] = this.focusableElements
    ;(first ?? this.modalElement)?.focus()
  }

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.open) {
      return
    }

    if (event.key === 'Escape') {
      this.close()
      return
    }

    if (event.key === 'Tab') {
      this.trapFocus(event)
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusable = this.focusableElements
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  private close(): void {
    if (!this.open) {
      return
    }
    this.open = false
    this.dispatchEvent(new CustomEvent('sp-close', { bubbles: true }))
  }

  private get overlayClasses(): string {
    return getModalOverlayClasses({ open: this.open ?? false })
  }

  private get modalClasses(): string {
    return getModalClasses({
      open: this.open ?? false,
      fullWidth: this.fullWidth ?? false
    })
  }

  override render() {
    const isHidden = !this.open

    return html`<div
      aria-hidden="${ifDefined(isHidden ? 'true' : undefined)}"
      class="${this.overlayClasses}"
      data-sp-modal-overlay
      @click="${(event: Event) => {
        if (event.target === event.currentTarget) {
          this.close()
        }
      }}"
    >
      <div
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        aria-hidden="${ifDefined(isHidden ? 'true' : undefined)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        aria-modal="true"
        class="${this.modalClasses}"
        data-sp-modal-native
        id="${ifDefined(this.id || undefined)}"
        role="dialog"
        tabindex="-1"
        title="${ifDefined(this.title || undefined)}"
      >
        ${this.hasProjectedContent ? this.projectedContent : nothing}
      </div>
    </div>`
  }
}

export function defineSpectreModal(
  tagName = 'sp-modal'
): typeof SpectreModalElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreModalElement
  }

  customElements.define(tagName, SpectreModalElement)
  return SpectreModalElement
}
