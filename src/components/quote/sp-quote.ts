import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isAccentColor,
  isQuoteAccent,
  isQuoteAlign,
  isQuoteSize,
  isQuoteSurface,
  type SpectreAccentColor,
  type SpectreQuoteAccent,
  type SpectreQuoteAlign,
  type SpectreQuoteSize,
  type SpectreQuoteSurface
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getQuoteAttributionClasses,
  getQuoteAttributionNameClasses,
  getQuoteAttributionRoleClasses,
  getQuoteClasses,
  getQuoteTextClasses,
  type QuoteAccentColor
} from '@phcdevworks/spectre-ui'

export interface SpectreQuoteProps {
  accent?: SpectreQuoteAccent | undefined
  accentColor?: SpectreAccentColor | undefined
  align?: SpectreQuoteAlign | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  cite?: string | undefined
  id?: string | null | undefined
  size?: SpectreQuoteSize | undefined
  surface?: SpectreQuoteSurface | undefined
  title?: string | null | undefined
}

export class SpectreQuoteElement
  extends SpectreBaseElement
  implements SpectreQuoteProps
{
  static properties = {
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    align: { type: String, reflect: true },
    cite: { type: String, reflect: true },
    size: { type: String, reflect: true },
    surface: { type: String, reflect: true }
  }

  accent: SpectreQuoteAccent | undefined = 'edge'
  accentColor: SpectreAccentColor | undefined = undefined
  align: SpectreQuoteAlign | undefined = 'start'
  cite: string | undefined
  size: SpectreQuoteSize | undefined = 'md'
  surface: SpectreQuoteSurface | undefined = 'plain'

  private readonly projection = new ProjectionController(this, [
    'data-sp-quote-native'
  ])

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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('accent') &&
      (this.accent == null || !isQuoteAccent(this.accent))
    ) {
      this.accent = 'edge'
    }
    if (
      changedProperties.has('accentColor') &&
      this.accentColor != null &&
      !isAccentColor(this.accentColor)
    ) {
      this.accentColor = undefined
    }
    if (
      changedProperties.has('align') &&
      (this.align == null || !isQuoteAlign(this.align))
    ) {
      this.align = 'start'
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isQuoteSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('surface') &&
      (this.surface == null || !isQuoteSurface(this.surface))
    ) {
      this.surface = 'plain'
    }
  }

  private get quoteClasses(): string {
    return getQuoteClasses({
      accent: this.accent ?? 'edge',
      ...(this.accentColor != null && {
        accentColor: this.accentColor as QuoteAccentColor
      }),
      align: this.align ?? 'start',
      size: this.size ?? 'md',
      surface: this.surface ?? 'plain'
    })
  }

  private renderRole() {
    const hasRole = this.projection.has('role')
    const hasOrganization = this.projection.has('organization')
    if (!hasRole && !hasOrganization) {
      return nothing
    }
    return html`<div class="${getQuoteAttributionRoleClasses()}">
      ${this.projection.nodes('role')}${
        hasRole && hasOrganization ? ', ' : nothing
      }${this.projection.nodes('organization')}
    </div>`
  }

  private renderAttribution() {
    const hasAvatar = this.projection.has('avatar')
    const hasName = this.projection.has('name')
    const role = this.renderRole()
    if (!hasAvatar && !hasName && role === nothing) {
      return nothing
    }
    // The recipe grid spans the avatar across the name and role rows, so all
    // three stay direct children of the figcaption.
    return html`<figcaption
      class="${getQuoteAttributionClasses({ avatar: hasAvatar })}"
    >
      ${hasAvatar ? this.projection.nodes('avatar') : nothing}
      ${
        hasName
          ? html`<div class="${getQuoteAttributionNameClasses()}">
              ${this.projection.nodes('name')}
            </div>`
          : nothing
      }
      ${role}
    </figcaption>`
  }

  override render() {
    return html`<figure
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.quoteClasses}"
      data-sp-quote-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <blockquote
        cite="${ifDefined(this.cite || undefined)}"
        class="${getQuoteTextClasses()}"
      >
        ${this.projection.nodes()}
      </blockquote>
      ${this.renderAttribution()}
    </figure>`
  }
}

export function defineSpectreQuote(
  tagName = 'sp-quote'
): typeof SpectreQuoteElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreQuoteElement
  }

  customElements.define(tagName, SpectreQuoteElement)
  return SpectreQuoteElement
}
