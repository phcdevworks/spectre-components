import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { ProjectionController } from '../../utils/projection'
import {
  isAccentColor,
  isAccentEdge,
  isTestimonialVariant,
  type SpectreAccentColor,
  type SpectreAccentEdge,
  type SpectreTestimonialVariant
} from '../../utils/form'

import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getTestimonialAuthorClasses,
  getTestimonialAuthorInfoClasses,
  getTestimonialAuthorNameClasses,
  getTestimonialAuthorTitleClasses,
  getTestimonialQuoteClasses,
  getTestimonialClasses,
  type TestimonialAccentColor,
  type TestimonialAccentEdge,
  type TestimonialRecipeOptions
} from '@phcdevworks/spectre-ui'

export interface SpectreTestimonialProps extends SpectreInteractionStateProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullHeight?: boolean | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  title?: string | null | undefined
  variant?: SpectreTestimonialVariant | undefined
}

export class SpectreTestimonialElement
  extends SpectreBaseElement
  implements SpectreTestimonialProps
{
  static properties = {
    ...interactionStateProperties,
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullHeight: { attribute: 'full-height', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true }
  }

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
  disabled: boolean | undefined = false
  fullHeight: boolean | undefined = false
  interactive: boolean | undefined = false
  loading: boolean | undefined = false
  variant: SpectreTestimonialVariant | undefined = 'elevated'

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
    'data-sp-testimonial-native'
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
      changedProperties.has('variant') &&
      (this.variant == null || !isTestimonialVariant(this.variant))
    ) {
      this.variant = 'elevated'
    }
  }

  private get testimonialClasses(): string {
    return getTestimonialClasses({
      ...interactionStates(this),
      ...(this.accent !== undefined && {
        accent: this.accent as TestimonialAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as TestimonialAccentColor
      }),
      disabled: this.isDisabled,
      fullHeight: this.fullHeight ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      variant: this.variant as NonNullable<TestimonialRecipeOptions['variant']>
    })
  }

  private renderAuthor() {
    const hasName = this.projection.has('author-name')
    const hasTitle = this.projection.has('author-title')
    if (!this.projection.has('author-image') && !hasName && !hasTitle) {
      return nothing
    }
    return html`<div class="${getTestimonialAuthorClasses()}">
      ${this.projection.nodes('author-image')}
      ${
        hasName || hasTitle
          ? html`<div class="${getTestimonialAuthorInfoClasses()}">
              ${
                hasName
                  ? html`<div class="${getTestimonialAuthorNameClasses()}">
                      ${this.projection.nodes('author-name')}
                    </div>`
                  : nothing
              }
              ${
                hasTitle
                  ? html`<div class="${getTestimonialAuthorTitleClasses()}">
                      ${this.projection.nodes('author-title')}
                    </div>`
                  : nothing
              }
            </div>`
          : nothing
      }
    </div>`
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.testimonialClasses}"
      data-sp-testimonial-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${
        this.projection.has('quote')
          ? html`<div class="${getTestimonialQuoteClasses()}">
              ${this.projection.nodes('quote')}
            </div>`
          : nothing
      }
      ${this.projection.nodes()} ${this.renderAuthor()}
    </div>`
  }
}

export function defineSpectreTestimonial(
  tagName = 'sp-testimonial'
): typeof SpectreTestimonialElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTestimonialElement
  }

  customElements.define(tagName, SpectreTestimonialElement)
  return SpectreTestimonialElement
}
