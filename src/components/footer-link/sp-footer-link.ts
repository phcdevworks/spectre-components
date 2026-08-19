import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'

import { getFooterLinkClasses } from '@phcdevworks/spectre-ui'

export interface SpectreFooterLinkProps {
  active?: boolean | undefined
  ariaLabel?: string | null
  disabled?: boolean | undefined
  href?: string | undefined
  id?: string | null | undefined
  title?: string | null | undefined
}

export class SpectreFooterLinkElement
  extends SpectreProjectableElement
  implements SpectreFooterLinkProps
{
  static properties = {
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { type: String }
  }

  active: boolean | undefined = false
  disabled: boolean | undefined = false
  href: string | undefined = undefined

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
    return this.querySelector('[data-sp-footer-link-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-footer-link-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('active') && this.active == null) {
      this.active = false
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
  }

  private get footerLinkClasses(): string {
    return getFooterLinkClasses({
      active: this.active ?? false,
      disabled: this.disabled ?? false
    })
  }

  override render() {
    return html`<a
      aria-current="${ifDefined(this.active ? 'page' : undefined)}"
      aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.footerLinkClasses}"
      data-sp-footer-link-native
      href="${ifDefined(this.disabled ? undefined : this.href)}"
      id="${ifDefined(this.id || undefined)}"
      tabindex="${ifDefined(this.disabled ? -1 : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </a>`
  }
}

export function defineSpectreFooterLink(
  tagName = 'sp-footer-link'
): typeof SpectreFooterLinkElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFooterLinkElement
  }

  customElements.define(tagName, SpectreFooterLinkElement)
  return SpectreFooterLinkElement
}
