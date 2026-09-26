import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { getFocusableElements, trapFocus } from '../../utils/focus'
import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isAccentColor,
  isAccentEdge,
  type SpectreAccentColor,
  type SpectreAccentEdge
} from '../../utils/form'

import {
  getModalClasses,
  getModalOverlayClasses,
  type ModalAccentColor,
  type ModalAccentEdge
} from '@phcdevworks/spectre-ui'

export interface SpectreModalProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
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
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true }
  }

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
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
    if (
      changedProperties.has('accent') &&
      this.accent != null &&
      !isAccentEdge(this.accent)
    ) {
      this.accent = undefined
    }
    if (
      changedProperties.has('accentColor') &&
      this.accentColor != null &&
      !isAccentColor(this.accentColor)
    ) {
      this.accentColor = undefined
    }
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

  private focusFirstElement(): void {
    const [first] = getFocusableElements(this.modalElement)
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
      trapFocus(event, this.modalElement)
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
      ...(this.accent !== undefined && {
        accent: this.accent as ModalAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as ModalAccentColor
      }),
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
