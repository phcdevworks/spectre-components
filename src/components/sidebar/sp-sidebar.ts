import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'

import {
  getSidebarBackdropClasses,
  getSidebarClasses,
  getSidebarToggleClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreSidebarProps {
  ariaLabel?: string | null
  bordered?: boolean | undefined
  id?: string | null | undefined
  open?: boolean | undefined
  title?: string | null | undefined
  toggleLabel?: string | undefined
}

export class SpectreSidebarElement
  extends SpectreProjectableElement
  implements SpectreSidebarProps
{
  static properties = {
    bordered: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: false },
    toggleLabel: { attribute: 'toggle-label', type: String }
  }

  bordered: boolean | undefined = false
  open: boolean | undefined = false
  toggleLabel: string | undefined = 'Toggle sidebar'

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
    return this.querySelector('[data-sp-sidebar-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return (
      el.hasAttribute('data-sp-sidebar-native') ||
      el.hasAttribute('data-sp-sidebar-toggle') ||
      el.hasAttribute('data-sp-sidebar-backdrop')
    )
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('bordered') && this.bordered == null) {
      this.bordered = false
    }
    if (changedProperties.has('open') && this.open == null) {
      this.open = false
    }
    if (changedProperties.has('toggleLabel') && !this.toggleLabel) {
      this.toggleLabel = 'Toggle sidebar'
    }
    if (changedProperties.has('open')) {
      HTMLElement.prototype.setAttribute.call(
        this,
        'data-sidebar-open',
        this.open ? 'true' : 'false'
      )
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    HTMLElement.prototype.setAttribute.call(
      this,
      'data-sidebar-open',
      this.open ? 'true' : 'false'
    )
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleDocumentKeydown)
    super.disconnectedCallback()
  }

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      this.close()
    }
  }

  private toggle(): void {
    if (this.open) {
      this.close()
    } else {
      this.openSidebar()
    }
  }

  private openSidebar(): void {
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

  private get sidebarClasses(): string {
    return getSidebarClasses({ bordered: this.bordered ?? false })
  }

  override render() {
    return html`<button
        aria-expanded="${this.open ? 'true' : 'false'}"
        aria-label="${ifDefined(this.toggleLabel)}"
        class="${getSidebarToggleClasses()}"
        data-sp-sidebar-toggle
        type="button"
        @click="${() => this.toggle()}"
      >
        &#9776;
      </button>
      <div
        class="${getSidebarBackdropClasses()}"
        data-sp-sidebar-backdrop
        @click="${() => this.close()}"
      ></div>
      <aside
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        class="${this.sidebarClasses}"
        data-sp-sidebar-native
        id="${ifDefined(this.id || undefined)}"
        title="${ifDefined(this.title || undefined)}"
      >
        ${this.hasProjectedContent ? this.projectedContent : nothing}
      </aside>`
  }
}

export function defineSpectreSidebar(
  tagName = 'sp-sidebar'
): typeof SpectreSidebarElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSidebarElement
  }

  customElements.define(tagName, SpectreSidebarElement)
  return SpectreSidebarElement
}
