import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { styleMap } from 'lit/directives/style-map.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId } from '../../utils/dom'
import {
  isInputSize,
  isProgressVariant,
  type SpectreInputSize,
  type SpectreProgressVariant
} from '../../utils/form'

import {
  getProgressBarClasses,
  getProgressClasses,
  getProgressLabelClasses,
  type ProgressBarVariant,
  type ProgressSize
} from '@phcdevworks/spectre-ui'

export interface SpectreProgressProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  id?: string | null | undefined
  indeterminate?: boolean | undefined
  label?: string | undefined
  max?: number | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  value?: number | undefined
  valueText?: string | undefined
  variant?: SpectreProgressVariant | undefined
}

export class SpectreProgressElement
  extends SpectreBaseElement
  implements SpectreProgressProps
{
  static properties = {
    indeterminate: { type: Boolean, reflect: true },
    label: { type: String },
    max: { type: Number, reflect: true },
    size: { type: String, reflect: true },
    value: { type: Number, reflect: true },
    valueText: { attribute: 'value-text', type: String },
    variant: { type: String, reflect: true }
  }

  indeterminate: boolean | undefined = false
  label: string | undefined = undefined
  max: number | undefined = 100
  size: SpectreInputSize | undefined = 'md'
  value: number | undefined = 0
  valueText: string | undefined = undefined
  variant: SpectreProgressVariant | undefined = 'brand'

  private readonly labelId = `${createUniqueId('sp-progress')}-label`

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
    if (changedProperties.has('indeterminate') && this.indeterminate == null) {
      this.indeterminate = false
    }
    if (
      changedProperties.has('max') &&
      (typeof this.max !== 'number' || !(this.max > 0))
    ) {
      this.max = 100
    }
    if (changedProperties.has('value') || changedProperties.has('max')) {
      const value = typeof this.value === 'number' ? this.value : 0
      this.value = Math.min(Math.max(value, 0), this.max ?? 100)
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isProgressVariant(this.variant))
    ) {
      this.variant = 'brand'
    }
  }

  private get percent(): number {
    return ((this.value ?? 0) / (this.max ?? 100)) * 100
  }

  private get labelledBy(): string | undefined {
    if (this.forwardedAriaLabelledBy) {
      return this.forwardedAriaLabelledBy
    }
    return this.label && !this.forwardedAriaLabel ? this.labelId : undefined
  }

  override render() {
    const indeterminate = this.indeterminate ?? false

    return html`${
        this.label
          ? html`<span class="${getProgressLabelClasses()}" id="${this.labelId}"
              >${this.label}</span
            >`
          : nothing
      }
      <div
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.labelledBy)}"
        aria-valuemax="${this.max ?? 100}"
        aria-valuemin="0"
        aria-valuenow="${ifDefined(indeterminate ? undefined : this.value)}"
        aria-valuetext="${ifDefined(this.valueText || undefined)}"
        class="${getProgressClasses({ size: this.size as ProgressSize })}"
        data-sp-progress-native
        id="${ifDefined(this.id || undefined)}"
        role="progressbar"
        title="${ifDefined(this.title || undefined)}"
      >
        <div
          class="${getProgressBarClasses({
            indeterminate,
            variant: this.variant as ProgressBarVariant
          })}"
          data-sp-progress-bar
          style="${styleMap(indeterminate ? {} : { width: `${this.percent}%` })}"
        ></div>
      </div>`
  }
}

export function defineSpectreProgress(
  tagName = 'sp-progress'
): typeof SpectreProgressElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreProgressElement
  }

  customElements.define(tagName, SpectreProgressElement)
  return SpectreProgressElement
}
