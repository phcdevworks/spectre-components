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
  getDropdownMenuClasses,
  getNavLinkClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreNavItemProps {
  ariaLabel?: string | null
  dropdown?: boolean | undefined
  href?: string | undefined
  id?: string | null | undefined
  label?: string | undefined
  open?: boolean | undefined
  placement?: SpectreDropdownPlacement | undefined
  title?: string | null | undefined
}

export class SpectreNavItemElement
  extends SpectreBaseElement
  implements SpectreNavItemProps
{
  static properties = {
    dropdown: { type: Boolean, reflect: true },
    href: { type: String },
    label: { type: String },
    open: { type: Boolean, reflect: true },
    placement: { type: String, reflect: true }
  }

  dropdown: boolean | undefined = false
  href: string | undefined = undefined
  label: string | undefined = undefined
  open: boolean | undefined = false
  placement: SpectreDropdownPlacement | undefined = 'bottom-start'

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
      el.hasAttribute('data-sp-nav-item-menu') ||
      el.hasAttribute('data-sp-nav-item-trigger')
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
    if (changedProperties.has('dropdown') && this.dropdown == null) {
      this.dropdown = false
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
    return this.querySelector('[data-sp-nav-item-trigger]')
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

  private get wrapperClasses(): string {
    return getDropdownClasses()
  }

  private get menuClasses(): string {
    return getDropdownMenuClasses({
      open: this.open ?? false,
      placement: this.placement as SpectreDropdownPlacement
    })
  }

  private get navLinkClasses(): string {
    return getNavLinkClasses()
  }

  private renderLink() {
    return html`<a
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.navLinkClasses}"
      href="${ifDefined(this.href)}"
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
      >${this.hasMenuContent ? this.menuContent : this.label}</a
    >`
  }

  private renderDropdown() {
    return html`<div
      class="${this.wrapperClasses}"
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <button
        aria-expanded="${this.open ? 'true' : 'false'}"
        aria-haspopup="true"
        aria-label="${ifDefined(this.forwardedAriaLabel ?? this.label)}"
        class="${this.navLinkClasses}"
        data-sp-nav-item-trigger
        type="button"
        @click="${() => this.toggle()}"
      >
        ${this.hasTriggerContent ? this.triggerContent : this.label}
      </button>
      <div class="${this.menuClasses}" data-sp-nav-item-menu>
        ${this.hasMenuContent ? this.menuContent : nothing}
      </div>
    </div>`
  }

  override render() {
    return this.dropdown ? this.renderDropdown() : this.renderLink()
  }
}

export function defineSpectreNavItem(
  tagName = 'sp-nav-item'
): typeof SpectreNavItemElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreNavItemElement
  }

  customElements.define(tagName, SpectreNavItemElement)
  return SpectreNavItemElement
}
