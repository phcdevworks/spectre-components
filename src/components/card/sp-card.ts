import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isAccentColor,
  isAccentEdge,
  isCardPaddingSize,
  isCardVariant,
  sanitizeUtilityClasses,
  type SpectreAccentColor,
  type SpectreAccentEdge,
  type SpectreCardPaddingSize,
  type SpectreCardVariant
} from '../../utils/form'

import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getCardClasses,
  type CardAccentColor,
  type CardAccentEdge,
  type CardVariant
} from '@phcdevworks/spectre-ui'

type SpectreCardPadded = boolean | SpectreCardPaddingSize

const paddedConverter = {
  fromAttribute(value: string | null): SpectreCardPadded {
    if (value === 'false') {
      return false
    }
    if (value != null && isCardPaddingSize(value)) {
      return value
    }
    return true
  },
  toAttribute(value: SpectreCardPadded): string | null {
    if (value === false) {
      return 'false'
    }
    if (value === true) {
      return null
    }
    return value
  }
}

export interface SpectreCardProps extends SpectreInteractionStateProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullHeight?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  padded?: SpectreCardPadded | undefined
  title?: string | null | undefined
  variant?: SpectreCardVariant | undefined
}

export class SpectreCardElement
  extends SpectreProjectableElement
  implements SpectreCardProps
{
  static properties = {
    ...interactionStateProperties,
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullHeight: { attribute: 'full-height', type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    padded: { converter: paddedConverter, reflect: true },
    variant: { type: String, reflect: true }
  }

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
  disabled: boolean | undefined = false
  fullHeight: boolean | undefined = false
  innerClass: string | undefined = undefined
  interactive: boolean | undefined = false
  loading: boolean | undefined = false
  padded: SpectreCardPadded | undefined = true
  variant: SpectreCardVariant | undefined = 'elevated'

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
    return this.querySelector('[data-sp-card-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-card-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('accent') &&
      this.accent != null &&
      !isAccentEdge(this.accent)
    ) {
      this.accent = undefined
    }
    if (
      changedProperties.has('accentColor') &&
      this.accentColor != null &&
      !isAccentColor(this.accentColor)
    ) {
      this.accentColor = undefined
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('fullHeight') && this.fullHeight == null) {
      this.fullHeight = false
    }
    if (changedProperties.has('interactive') && this.interactive == null) {
      this.interactive = false
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false
    }
    if (
      changedProperties.has('padded') &&
      (this.padded == null ||
        (typeof this.padded !== 'boolean' && !isCardPaddingSize(this.padded)))
    ) {
      this.padded = true
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isCardVariant(this.variant))
    ) {
      this.variant = 'elevated'
    }
  }

  private get cardClasses(): string {
    const recipeClasses = getCardClasses({
      ...interactionStates(this),
      ...(this.accent !== undefined && {
        accent: this.accent as CardAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as CardAccentColor
      }),
      disabled: this.isDisabled,
      fullHeight: this.fullHeight ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      padded: this.padded ?? true,
      variant: this.variant as CardVariant
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.cardClasses}"
      data-sp-card-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`
  }
}

export function defineSpectreCard(
  tagName = 'sp-card'
): typeof SpectreCardElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreCardElement
  }

  customElements.define(tagName, SpectreCardElement)
  return SpectreCardElement
}
