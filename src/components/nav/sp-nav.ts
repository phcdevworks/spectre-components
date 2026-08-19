import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isNavAlign,
  sanitizeUtilityClasses,
  type SpectreNavAlign
} from '../../utils/form'

import { getNavClasses, type NavAlign } from '@phcdevworks/spectre-ui'

export interface SpectreNavProps {
  align?: SpectreNavAlign | undefined
  ariaLabel?: string | null
  bordered?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  sticky?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreNavElement
  extends SpectreProjectableElement
  implements SpectreNavProps
{
  static properties = {
    align: { type: String, reflect: true },
    bordered: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    sticky: { type: Boolean, reflect: true }
  }

  align: SpectreNavAlign | undefined = undefined
  bordered: boolean | undefined = false
  fullWidth: boolean | undefined = false
  innerClass: string | undefined = undefined
  sticky: boolean | undefined = false

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
    this.style.display ||= 'block'
  }

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-nav-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-nav-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('bordered') && this.bordered == null) {
      this.bordered = false
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('sticky') && this.sticky == null) {
      this.sticky = false
    }
    if (
      changedProperties.has('align') &&
      this.align != null &&
      !isNavAlign(this.align)
    ) {
      this.align = undefined
    }
  }

  private get navClasses(): string {
    const recipeClasses = getNavClasses({
      bordered: this.bordered ?? false,
      fullWidth: this.fullWidth ?? false,
      sticky: this.sticky ?? false,
      ...(this.align !== undefined && { align: this.align as NavAlign })
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
  }

  override render() {
    return html`<nav
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.navClasses}"
      data-sp-nav-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </nav>`
  }
}

export function defineSpectreNav(tagName = 'sp-nav'): typeof SpectreNavElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreNavElement
  }

  customElements.define(tagName, SpectreNavElement)
  return SpectreNavElement
}
