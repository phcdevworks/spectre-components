import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'

import { SpectreBaseElement } from '../../utils/base'
import { ProjectionController } from '../../utils/projection'
import { isInputSize, type SpectreInputSize } from '../../utils/form'

import {
  getInputLabelClasses,
  getSwitchClasses,
  type SwitchSize
} from '@phcdevworks/spectre-ui'

export interface SpectreSwitchProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  checked?: boolean | undefined
  disabled?: boolean | undefined
  focused?: boolean | undefined
  form?: string | undefined
  id?: string | null | undefined
  label?: string | undefined
  name?: string | undefined
  required?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  value?: string | undefined
}

// A native `<input type="checkbox" role="switch">`, so it submits with its
// form and announces on/off state.
export class SpectreSwitchElement
  extends SpectreBaseElement
  implements SpectreSwitchProps
{
  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    form: { type: String },
    label: { type: String },
    name: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    value: { type: String }
  }

  checked: boolean | undefined = false
  disabled: boolean | undefined = false
  focused: boolean | undefined = false
  form: string | undefined = undefined
  label: string | undefined = undefined
  name: string | undefined = undefined
  required: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  value: string | undefined = 'on'

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
    'data-sp-switch-label'
  ])

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('checked') && this.checked == null) {
      this.checked = false
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('required') && this.required == null) {
      this.required = false
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-switch-native]')
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options)
  }

  override blur(): void {
    this.nativeInput?.blur()
  }

  private handleChange(event: Event): void {
    this.checked = (event.currentTarget as HTMLInputElement).checked
  }

  override render() {
    const disabled = this.disabled ?? false
    const labelContent = this.projection.has()
      ? this.projection.nodes()
      : this.label
        ? html`<span
            class="${getInputLabelClasses({ disabled })}"
            data-sp-switch-label-fallback
            >${this.label}</span
          >`
        : nothing

    return html`<label data-sp-switch-label>
      <input
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        .checked="${live(this.checked ?? false)}"
        class="${getSwitchClasses({
          focused: this.focused ?? false,
          size: this.size as SwitchSize
        })}"
        data-sp-switch-native
        ?disabled="${disabled}"
        form="${ifDefined(this.form || undefined)}"
        id="${ifDefined(this.id || undefined)}"
        name="${ifDefined(this.name || undefined)}"
        ?required="${this.required ?? false}"
        role="switch"
        title="${ifDefined(this.title || undefined)}"
        type="checkbox"
        value="${ifDefined(this.value)}"
        @change="${this.handleChange}"
      />
      ${labelContent}
    </label>`
  }
}

export function defineSpectreSwitch(
  tagName = 'sp-switch'
): typeof SpectreSwitchElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSwitchElement
  }

  customElements.define(tagName, SpectreSwitchElement)
  return SpectreSwitchElement
}
