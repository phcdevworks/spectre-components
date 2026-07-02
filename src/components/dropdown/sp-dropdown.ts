import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { hasMeaningfulContent } from '../../utils/dom'
import {
  isDropdownPlacement,
  type SpectreDropdownPlacement
} from '../../utils/form'

import {
  getDropdownClasses,
  getDropdownMenuClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreDropdownProps {
  ariaLabel?: string | null
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  open?: boolean | undefined
  placement?: SpectreDropdownPlacement | undefined
  title?: string | null | undefined
  triggerLabel?: string | undefined
}

export class SpectreDropdownElement
  extends SpectreBaseElement
  implements SpectreDropdownProps
{
  static properties = {
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    placement: { type: String, reflect: true },
    triggerLabel: { attribute: 'trigger-label', type: String }
  }

  fullWidth: boolean | undefined = false
  open: boolean | undefined = false
  placement: SpectreDropdownPlacement | undefined = 'bottom-start'
  triggerLabel: string | undefined = 'Toggle menu'

  private triggerContent: Node[] = []
  private menuContent: Node[] = []
  private contentObserver?: MutationObserver | undefined

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
      el.hasAttribute('data-sp-dropdown-menu') ||
      el.hasAttribute('data-sp-dropdown-trigger')
    )
  }

  private syncProjectedContent(): boolean {
    const nextTriggerContent: Node[] = []
    const nextMenuContent: Node[] = []

    this.childNodes.forEach((node) => {
      if (this.isInternalNode(node)) {
        return
      }
      const isTriggerSlot =
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).getAttribute('slot') === 'trigger'
      if (isTriggerSlot) {
        nextTriggerContent.push(node)
      } else {
        nextMenuContent.push(node)
      }
    })

    const changed =
      nextTriggerContent.length !== this.triggerContent.length ||
      nextTriggerContent.some((n, i) => n !== this.triggerContent[i]) ||
      nextMenuContent.length !== this.menuContent.length ||
      nextMenuContent.some((n, i) => n !== this.menuContent[i])

    if (changed) {
      this.triggerContent = nextTriggerContent
      this.menuContent = nextMenuContent
    }

    return changed
  }

  private get hasTriggerContent(): boolean {
    return hasMeaningfulContent(this.triggerContent)
  }

  private get hasMenuContent(): boolean {
    return hasMeaningfulContent(this.menuContent)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.syncProjectedContent()
    this.startContentObserver()
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  override disconnectedCallback(): void {
    this.stopContentObserver()
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('keydown', this.handleDocumentKeydown)
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
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
    }
    if (
      changedProperties.has('placement') &&
      (this.placement == null || !isDropdownPlacement(this.placement))
    ) {
      this.placement = 'bottom-start'
    }
    if (changedProperties.has('triggerLabel') && !this.triggerLabel) {
      this.triggerLabel = 'Toggle menu'
    }
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.open) {
      return
    }
    if (!event.composedPath().includes(this)) {
      this.close()
    }
  }

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      this.close()
      this.triggerElement?.focus()
    }
  }

  private get triggerElement(): HTMLButtonElement | null {
    return this.querySelector('[data-sp-dropdown-trigger]')
  }

  private toggle(): void {
    if (this.open) {
      this.close()
    } else {
      this.openMenu()
    }
  }

  private openMenu(): void {
    if (this.open) {
      return
    }
    this.open = true
    this.dispatchEvent(new CustomEvent('sp-open', { bubbles: true }))
  }

  private close(): void {
    if (!this.open) {
      return
    }
    this.open = false
    this.dispatchEvent(new CustomEvent('sp-close', { bubbles: true }))
  }

  private get dropdownClasses(): string {
    return getDropdownClasses({ fullWidth: this.fullWidth ?? false })
  }

  private get menuClasses(): string {
    return getDropdownMenuClasses({
      open: this.open ?? false,
      placement: this.placement as SpectreDropdownPlacement
    })
  }

  override render() {
    return html`<div
      class="${this.dropdownClasses}"
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <button
        aria-expanded="${this.open ? 'true' : 'false'}"
        aria-haspopup="true"
        aria-label="${ifDefined(this.forwardedAriaLabel ?? this.triggerLabel)}"
        class="sp-dropdown__trigger"
        data-sp-dropdown-trigger
        type="button"
        @click="${() => this.toggle()}"
      >
        ${this.hasTriggerContent ? this.triggerContent : this.triggerLabel}
      </button>
      <div class="${this.menuClasses}" data-sp-dropdown-menu>
        ${this.hasMenuContent ? this.menuContent : nothing}
      </div>
    </div>`
  }
}

export function defineSpectreDropdown(
  tagName = 'sp-dropdown'
): typeof SpectreDropdownElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreDropdownElement
  }

  customElements.define(tagName, SpectreDropdownElement)
  return SpectreDropdownElement
}
