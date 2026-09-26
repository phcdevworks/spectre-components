import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { ProjectionController } from '../../utils/projection'
import {
  isAccentColor,
  isAccentEdge,
  type SpectreAccentColor,
  type SpectreAccentEdge
} from '../../utils/form'

import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getPricingCardBadgeClasses,
  getPricingCardDescriptionClasses,
  getPricingCardPriceClasses,
  getPricingCardPriceContainerClasses,
  getPricingCardClasses,
  type PricingCardAccentColor,
  type PricingCardAccentEdge
} from '@phcdevworks/spectre-ui'

export interface SpectrePricingCardProps extends SpectreInteractionStateProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  featured?: boolean | undefined
  fullHeight?: boolean | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  title?: string | null | undefined
}

export class SpectrePricingCardElement
  extends SpectreBaseElement
  implements SpectrePricingCardProps
{
  static properties = {
    ...interactionStateProperties,
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    featured: { type: Boolean, reflect: true },
    fullHeight: { attribute: 'full-height', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true }
  }

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
  disabled: boolean | undefined = false
  featured: boolean | undefined = false
  fullHeight: boolean | undefined = false
  interactive: boolean | undefined = false
  loading: boolean | undefined = false

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

  private readonly projection = new ProjectionController(this, [
    'data-sp-pricing-card-native'
  ])

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
    if (changedProperties.has('featured') && this.featured == null) {
      this.featured = false
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
  }

  private get pricingCardClasses(): string {
    return getPricingCardClasses({
      ...interactionStates(this),
      ...(this.accent !== undefined && {
        accent: this.accent as PricingCardAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as PricingCardAccentColor
      }),
      disabled: this.isDisabled,
      featured: this.featured ?? false,
      fullHeight: this.fullHeight ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false
    })
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.pricingCardClasses}"
      data-sp-pricing-card-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes('header')}
      ${
        this.projection.has('badge')
          ? html`<div class="${getPricingCardBadgeClasses()}">
              ${this.projection.nodes('badge')}
            </div>`
          : nothing
      }
      ${
        this.projection.has('price')
          ? html`<div class="${getPricingCardPriceContainerClasses()}">
              <div class="${getPricingCardPriceClasses()}">
                ${this.projection.nodes('price')}
              </div>
            </div>`
          : nothing
      }
      ${
        this.projection.has('description')
          ? html`<div class="${getPricingCardDescriptionClasses()}">
              ${this.projection.nodes('description')}
            </div>`
          : nothing
      }
      ${this.projection.nodes()} ${this.projection.nodes('footer')}
    </div>`
  }
}

export function defineSpectrePricingCard(
  tagName = 'sp-pricing-card'
): typeof SpectrePricingCardElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectrePricingCardElement
  }

  customElements.define(tagName, SpectrePricingCardElement)
  return SpectrePricingCardElement
}
