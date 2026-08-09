import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import { sanitizeUtilityClasses } from '../../utils/form'

import { getFooterClasses } from '@phcdevworks/spectre-ui'

export interface SpectreFooterProps {
  ariaLabel?: string | null
  bordered?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  title?: string | null | undefined
}

export class SpectreFooterElement
  extends SpectreProjectableElement
  implements SpectreFooterProps
{
  static properties = {
    bordered: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String }
  }

  bordered: boolean | undefined = false
  fullWidth: boolean | undefined = false
  innerClass: string | undefined = undefined

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
    return this.querySelector('[data-sp-footer-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-footer-native')
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
  }

  private get footerClasses(): string {
    const recipeClasses = getFooterClasses({
      bordered: this.bordered ?? false,
      fullWidth: this.fullWidth ?? false
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses
      ? `${recipeClasses} ${utilityClasses}`
      : recipeClasses
  }

  override render() {
    return html`<footer
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.footerClasses}"
      data-sp-footer-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </footer>`
  }
}

export function defineSpectreFooter(
  tagName = 'sp-footer'
): typeof SpectreFooterElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFooterElement
  }

  customElements.define(tagName, SpectreFooterElement)
  return SpectreFooterElement
}
