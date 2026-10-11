import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isStatAlign,
  isStatSize,
  isStatSurface,
  type SpectreStatAlign,
  type SpectreStatSize,
  type SpectreStatSurface
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getStatClasses,
  getStatFigureClasses,
  getStatLabelClasses,
  getStatUnitClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreStatProps {
  align?: SpectreStatAlign | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  id?: string | null | undefined
  size?: SpectreStatSize | undefined
  surface?: SpectreStatSurface | undefined
  title?: string | null | undefined
}

export class SpectreStatElement
  extends SpectreBaseElement
  implements SpectreStatProps
{
  static properties = {
    align: { type: String, reflect: true },
    size: { type: String, reflect: true },
    surface: { type: String, reflect: true }
  }

  align: SpectreStatAlign | undefined = 'start'
  size: SpectreStatSize | undefined = 'md'
  surface: SpectreStatSurface | undefined = 'page'

  private readonly projection = new ProjectionController(this, [
    'data-sp-stat-native'
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
      (this.align == null || !isStatAlign(this.align))
    ) {
      this.align = 'start'
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isStatSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('surface') &&
      (this.surface == null || !isStatSurface(this.surface))
    ) {
      this.surface = 'page'
    }
  }

  override render() {
    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getStatClasses({
        align: this.align ?? 'start',
        size: this.size ?? 'md',
        surface: this.surface ?? 'page'
      })}"
      data-sp-stat-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <p class="${getStatFigureClasses()}">
        ${this.projection.nodes()}${
          this.projection.has('unit')
            ? html`<span class="${getStatUnitClasses()}"
                >${this.projection.nodes('unit')}</span
              >`
            : nothing
        }
      </p>
      ${
        this.projection.has('label')
          ? html`<p class="${getStatLabelClasses()}">
              ${this.projection.nodes('label')}
            </p>`
          : nothing
      }
    </div>`
  }
}

export function defineSpectreStat(
  tagName = 'sp-stat'
): typeof SpectreStatElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreStatElement
  }

  customElements.define(tagName, SpectreStatElement)
  return SpectreStatElement
}
