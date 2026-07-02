import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { hasMeaningfulContent } from '../../utils/dom'
import {
  isToastVariant,
  normalizeInt,
  type SpectreToastVariant
} from '../../utils/form'

import { getToastClasses, getToastIconClasses } from '@phcdevworks/spectre-ui'

export interface SpectreToastProps {
  ariaLabel?: string | null
  autoDismiss?: number | undefined
  dismissed?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  title?: string | null | undefined
  variant?: SpectreToastVariant | undefined
}

export class SpectreToastElement
  extends SpectreBaseElement
  implements SpectreToastProps
{
  static properties = {
    autoDismiss: { attribute: 'auto-dismiss', type: Number },
    dismissed: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    variant: { type: String, reflect: true }
  }

  autoDismiss: number | undefined
  dismissed: boolean | undefined = false
  fullWidth: boolean | undefined = false
  variant: SpectreToastVariant | undefined = 'info'

  private iconContent: Node[] = []
  private bodyContent: Node[] = []
  private contentObserver?: MutationObserver | undefined
  private autoDismissTimer?: ReturnType<typeof setTimeout> | undefined

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

  private isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return (
      el.hasAttribute('data-sp-toast-native') ||
      el.hasAttribute('data-sp-toast-icon')
    )
  }

  private syncProjectedContent(): boolean {
    const nextIconContent: Node[] = []
    const nextBodyContent: Node[] = []

    this.childNodes.forEach((node) => {
      if (this.isInternalNode(node)) {
        return
      }
      const isIconSlot =
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).getAttribute('slot') === 'icon'
      if (isIconSlot) {
        nextIconContent.push(node)
      } else {
        nextBodyContent.push(node)
      }
    })

    const changed =
      nextIconContent.length !== this.iconContent.length ||
      nextIconContent.some((n, i) => n !== this.iconContent[i]) ||
      nextBodyContent.length !== this.bodyContent.length ||
      nextBodyContent.some((n, i) => n !== this.bodyContent[i])

    if (changed) {
      this.iconContent = nextIconContent
      this.bodyContent = nextBodyContent
    }

    return changed
  }

  private get hasIconContent(): boolean {
    return hasMeaningfulContent(this.iconContent)
  }

  private get hasBodyContent(): boolean {
    return hasMeaningfulContent(this.bodyContent)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.syncProjectedContent()
    this.startContentObserver()
  }

  override disconnectedCallback(): void {
    this.stopContentObserver()
    this.clearAutoDismissTimer()
    super.disconnectedCallback()
  }

  protected override update(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    this.stopContentObserver()
    super.update(changedProperties)
    this.startContentObserver()
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return
    }
    this.contentObserver = new MutationObserver(() => {
      if (this.syncProjectedContent()) {
        this.requestUpdate()
      }
    })
    this.contentObserver.observe(this, { childList: true })
  }

  private stopContentObserver(): void {
    this.contentObserver?.disconnect()
    this.contentObserver = undefined
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('dismissed') && this.dismissed == null) {
      this.dismissed = false
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isToastVariant(this.variant))
    ) {
      this.variant = 'info'
    }
    if (changedProperties.has('autoDismiss')) {
      this.autoDismiss = normalizeInt(this.autoDismiss, undefined, 0)
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)

    if (
      changedProperties.has('dismissed') ||
      changedProperties.has('autoDismiss')
    ) {
      this.clearAutoDismissTimer()
      if (!this.dismissed && this.autoDismiss) {
        this.autoDismissTimer = setTimeout(() => {
          this.dismiss()
        }, this.autoDismiss)
      }
    }
  }

  private clearAutoDismissTimer(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer)
      this.autoDismissTimer = undefined
    }
  }

  show(): void {
    if (!this.dismissed) {
      return
    }
    this.dismissed = false
    this.dispatchEvent(new CustomEvent('sp-show', { bubbles: true }))
  }

  dismiss(): void {
    if (this.dismissed) {
      return
    }
    this.dismissed = true
    this.dispatchEvent(new CustomEvent('sp-dismiss', { bubbles: true }))
  }

  private get toastClasses(): string {
    return getToastClasses({
      variant: this.variant as SpectreToastVariant,
      dismissed: this.dismissed ?? false,
      fullWidth: this.fullWidth ?? false
    })
  }

  private get iconClasses(): string {
    return getToastIconClasses({ variant: this.variant as SpectreToastVariant })
  }

  override render() {
    return html`<div
      aria-atomic="true"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-live="polite"
      class="${this.toastClasses}"
      data-sp-toast-native
      id="${ifDefined(this.id || undefined)}"
      role="status"
      title="${ifDefined(this.title || undefined)}"
    >
      ${
        this.hasIconContent
          ? html`<div class="${this.iconClasses}" data-sp-toast-icon>
              ${this.iconContent}
            </div>`
          : nothing
      }
      ${this.hasBodyContent ? this.bodyContent : nothing}
    </div>`
  }
}

export function defineSpectreToast(
  tagName = 'sp-toast'
): typeof SpectreToastElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreToastElement
  }

  customElements.define(tagName, SpectreToastElement)
  return SpectreToastElement
}
