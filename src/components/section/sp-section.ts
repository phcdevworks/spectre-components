import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isSectionHero,
  isSpacingStep,
  sanitizeUtilityClasses,
  type SpectreSectionHero,
  type SpectreSpacingStep
} from '../../utils/form'

import {
  getSectionClasses,
  type SectionGap,
  type SectionRecipeOptions,
  type SectionSpacing
} from '@phcdevworks/spectre-ui'

export interface SpectreSectionProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  attached?: boolean | undefined
  gap?: SpectreSpacingStep | undefined
  hero?: SpectreSectionHero | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  spacing?: SpectreSpacingStep | undefined
  title?: string | null | undefined
}

export class SpectreSectionElement
  extends SpectreProjectableElement
  implements SpectreSectionProps
{
  static properties = {
    attached: { type: Boolean, reflect: true },
    gap: { type: String, reflect: true },
    hero: { type: String, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    spacing: { type: String, reflect: true }
  }

  attached: boolean | undefined = false
  gap: SpectreSpacingStep | undefined = undefined
  hero: SpectreSectionHero | undefined = undefined
  innerClass: string | undefined = undefined
  spacing: SpectreSpacingStep | undefined = undefined

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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('gap') &&
      this.gap != null &&
      !isSpacingStep(this.gap)
    ) {
      this.gap = undefined
    }
    if (
      changedProperties.has('hero') &&
      this.hero != null &&
      !isSectionHero(this.hero)
    ) {
      this.hero = undefined
    }
    if (changedProperties.has('attached') && this.attached == null) {
      this.attached = false
    }
    if (
      changedProperties.has('spacing') &&
      this.spacing != null &&
      !isSpacingStep(this.spacing)
    ) {
      this.spacing = undefined
    }
  }

  private get sectionClasses(): string {
    const recipeClasses = getSectionClasses({
      ...(this.attached === true && { attached: true }),
      ...(this.gap != null && { gap: this.gap as SectionGap }),
      ...(this.hero != null && {
        hero: this.hero as NonNullable<SectionRecipeOptions['hero']>
      }),
      ...(this.spacing != null && {
        spacing: this.spacing as SectionSpacing
      })
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
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
