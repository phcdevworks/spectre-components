import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isSidebarLinkLevel,
  type SpectreSidebarLinkLevel
} from '../../utils/form'

import {
  getSidebarLinkClasses,
  type SidebarLinkLevel
} from '@phcdevworks/spectre-ui'

export interface SpectreSidebarLinkProps {
  active?: boolean | undefined
  ariaLabel?: string | null
  disabled?: boolean | undefined
  href?: string | undefined
  id?: string | null | undefined
  level?: SpectreSidebarLinkLevel | undefined
  title?: string | null | undefined
}

export class SpectreSidebarLinkElement
  extends SpectreProjectableElement
  implements SpectreSidebarLinkProps
{
  static properties = {
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { type: String },
    level: { type: String, reflect: true }
  }

  active: boolean | undefined = false
  disabled: boolean | undefined = false
  href: string | undefined = undefined
  level: SpectreSidebarLinkLevel | undefined = 'parent'

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
    return this.querySelector('[data-sp-sidebar-link-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-sidebar-link-native')
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
    if (
      changedProperties.has('level') &&
      (this.level == null || !isSidebarLinkLevel(this.level))
    ) {
      this.level = 'parent'
    }
  }

  private get sidebarLinkClasses(): string {
    return getSidebarLinkClasses({
      active: this.active ?? false,
      disabled: this.disabled ?? false,
      level: this.level as SidebarLinkLevel
    })
  }

  override render() {
    return html`<a
      aria-current="${ifDefined(this.active ? 'page' : undefined)}"
      aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.sidebarLinkClasses}"
      data-sp-sidebar-link-native
      href="${ifDefined(this.disabled ? undefined : this.href)}"
      id="${ifDefined(this.id || undefined)}"
      tabindex="${ifDefined(this.disabled ? -1 : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </a>`
  }
}

export function defineSpectreSidebarLink(
  tagName = 'sp-sidebar-link'
): typeof SpectreSidebarLinkElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSidebarLinkElement
  }

  customElements.define(tagName, SpectreSidebarLinkElement)
  return SpectreSidebarLinkElement
}
