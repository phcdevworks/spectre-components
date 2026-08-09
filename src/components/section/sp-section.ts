import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import { sanitizeUtilityClasses } from '../../utils/form'

import { getSectionClasses } from '@phcdevworks/spectre-ui'

export interface SpectreSectionProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  id?: string | null | undefined
  innerClass?: string | undefined
  title?: string | null | undefined
}

export class SpectreSectionElement
  extends SpectreProjectableElement
  implements SpectreSectionProps
{
  static properties = {
    innerClass: { attribute: 'inner-class', type: String }
  }

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
    return this.querySelector('[data-sp-section-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-section-native')
  }

  private get sectionClasses(): string {
    const recipeClasses = getSectionClasses({})
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses
      ? `${recipeClasses} ${utilityClasses}`
      : recipeClasses
  }

  override render() {
    return html`<section
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.sectionClasses}"
      data-sp-section-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </section>`
  }
}

export function defineSpectreSection(
  tagName = 'sp-section'
): typeof SpectreSectionElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSectionElement
  }

  customElements.define(tagName, SpectreSectionElement)
  return SpectreSectionElement
}
