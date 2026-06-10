import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isInputSize,
  isSpinnerVariant,
  type SpectreInputSize,
  type SpectreSpinnerVariant
} from '../../utils/form'

import {
  getSpinnerClasses,
  type SpinnerSize,
  type SpinnerVariant
} from '@phcdevworks/spectre-ui'

export interface SpectreSpinnerProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  id?: string | null | undefined
  loading?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  variant?: SpectreSpinnerVariant | undefined
}

export class SpectreSpinnerElement
  extends SpectreBaseElement
  implements SpectreSpinnerProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  disabled: boolean | undefined = false
  loading: boolean | undefined = true
  size: SpectreInputSize | undefined = 'md'
  variant: SpectreSpinnerVariant | undefined

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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = true
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('variant') &&
      this.variant != null &&
      !isSpinnerVariant(this.variant)
    ) {
      this.variant = undefined
    }
  }

  private get spinnerClasses(): string {
    return getSpinnerClasses({
      disabled: this.disabled ?? false,
      loading: this.loading ?? true,
      size: this.size as SpinnerSize,
      ...(this.variant != null
        ? { variant: this.variant as SpinnerVariant }
        : {})
    })
  }

  private get computedAriaLabel(): string {
    return this.forwardedAriaLabel ?? 'Loading'
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${this.computedAriaLabel}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.spinnerClasses}"
      data-sp-spinner-native
      id="${ifDefined(this.id || undefined)}"
      role="status"
      title="${ifDefined(this.title || undefined)}"
    ></div>`
  }
}

export function defineSpectreSpinner(
  tagName = 'sp-spinner'
): typeof SpectreSpinnerElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSpinnerElement
  }

  customElements.define(tagName, SpectreSpinnerElement)
  return SpectreSpinnerElement
}
