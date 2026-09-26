import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'

import { SpectreBaseElement } from '../../utils/base'

import { getRangeClasses } from '@phcdevworks/spectre-ui'

export interface SpectreRangeProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  focused?: boolean | undefined
  form?: string | undefined
  id?: string | null | undefined
  max?: number | undefined
  min?: number | undefined
  name?: string | undefined
  step?: number | undefined
  title?: string | null | undefined
  value?: number | undefined
}

export class SpectreRangeElement
  extends SpectreBaseElement
  implements SpectreRangeProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    form: { type: String },
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    name: { type: String, reflect: true },
    step: { type: Number, reflect: true },
    value: { type: Number, reflect: true }
  }

  disabled: boolean | undefined = false
  focused: boolean | undefined = false
  form: string | undefined = undefined
  max: number | undefined = 100
  min: number | undefined = 0
  name: string | undefined = undefined
  step: number | undefined = 1
  value: number | undefined = 50

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
    if (changedProperties.has('min') && typeof this.min !== 'number') {
      this.min = 0
    }
    if (
      changedProperties.has('max') &&
      (typeof this.max !== 'number' || this.max <= (this.min ?? 0))
    ) {
      this.max = (this.min ?? 0) + 100
    }
    if (
      changedProperties.has('value') ||
      changedProperties.has('min') ||
      changedProperties.has('max')
    ) {
      const value = typeof this.value === 'number' ? this.value : 0
      this.value = Math.min(Math.max(value, this.min ?? 0), this.max ?? 100)
    }
  }

  // WebKit/Blink paint the filled track from this recipe-defined variable;
  // Firefox fills natively.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const min = this.min ?? 0
    const span = (this.max ?? 100) - min
    const percent = span > 0 ? (((this.value ?? min) - min) / span) * 100 : 0
    this.nativeInput?.style.setProperty(
      '--sp-component-range-value',
      `${percent}%`
    )
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-range-native]')
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options)
  }

  override blur(): void {
    this.nativeInput?.blur()
  }

  private handleInput(event: Event): void {
    this.value = (event.currentTarget as HTMLInputElement).valueAsNumber
  }

  override render() {
    return html`<input
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getRangeClasses({
        disabled: this.disabled ?? false,
        focused: this.focused ?? false
      })}"
      data-sp-range-native
      ?disabled="${this.disabled ?? false}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      max="${this.max ?? 100}"
      min="${this.min ?? 0}"
      name="${ifDefined(this.name || undefined)}"
      step="${this.step ?? 1}"
      title="${ifDefined(this.title || undefined)}"
      type="range"
      .value="${live(String(this.value ?? 0))}"
      @change="${this.handleInput}"
      @input="${this.handleInput}"
    />`
  }
}

export function defineSpectreRange(
  tagName = 'sp-range'
): typeof SpectreRangeElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreRangeElement
  }

  customElements.define(tagName, SpectreRangeElement)
  return SpectreRangeElement
}
