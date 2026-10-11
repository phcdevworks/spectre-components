import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isSectionHeadAlign,
  isSectionHeadLayout,
  type SpectreSectionHeadAlign,
  type SpectreSectionHeadLayout
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getSectionHeadClasses,
  getSectionHeadLeadClasses,
  getSectionHeadTitleClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreSectionHeadProps {
  align?: SpectreSectionHeadAlign | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  id?: string | null | undefined
  layout?: SpectreSectionHeadLayout | undefined
  title?: string | null | undefined
}

// The eyebrow and title slots fill the title part; unslotted content (the
// lead) and the actions slot fill the lead part.
export class SpectreSectionHeadElement
  extends SpectreBaseElement
  implements SpectreSectionHeadProps
{
  static properties = {
    align: { type: String, reflect: true },
    layout: { type: String, reflect: true }
  }

  align: SpectreSectionHeadAlign | undefined = 'start'
  layout: SpectreSectionHeadLayout | undefined = 'stacked'

  private readonly projection = new ProjectionController(this, [
    'data-sp-section-head-native'
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
      changedProperties.has('align') &&
      (this.align == null || !isSectionHeadAlign(this.align))
    ) {
      this.align = 'start'
    }
    if (
      changedProperties.has('layout') &&
      (this.layout == null || !isSectionHeadLayout(this.layout))
    ) {
      this.layout = 'stacked'
    }
  }

  override render() {
    const hasTitle =
      this.projection.has('eyebrow') || this.projection.has('title')
    const hasLead = this.projection.has() || this.projection.has('actions')

    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getSectionHeadClasses({
        align: this.align ?? 'start',
        layout: this.layout ?? 'stacked'
      })}"
      data-sp-section-head-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${
        hasTitle
          ? html`<div class="${getSectionHeadTitleClasses()}">
              ${this.projection.nodes('eyebrow')}
              ${this.projection.nodes('title')}
            </div>`
          : nothing
      }
      ${
        hasLead
          ? html`<div class="${getSectionHeadLeadClasses()}">
              ${this.projection.nodes()} ${this.projection.nodes('actions')}
            </div>`
          : nothing
      }
    </div>`
  }
}

export function defineSpectreSectionHead(
  tagName = 'sp-section-head'
): typeof SpectreSectionHeadElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSectionHeadElement
  }

  customElements.define(tagName, SpectreSectionHeadElement)
  return SpectreSectionHeadElement
}
