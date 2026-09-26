import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { isInputSize, type SpectreInputSize } from '../../utils/form'

import {
  getFileInputClasses,
  type FileInputSize
} from '@phcdevworks/spectre-ui'

export interface SpectreFileInputProps {
  accept?: string | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  focused?: boolean | undefined
  form?: string | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  invalid?: boolean | undefined
  multiple?: boolean | undefined
  name?: string | undefined
  required?: boolean | undefined
  size?: SpectreInputSize | undefined
  success?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreFileInputElement
  extends SpectreBaseElement
  implements SpectreFileInputProps
{
  static properties = {
    accept: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true }
  }

  accept: string | undefined = undefined
  disabled: boolean | undefined = false
  focused: boolean | undefined = false
  form: string | undefined = undefined
  fullWidth: boolean | undefined = false
  invalid: boolean | undefined = false
  multiple: boolean | undefined = false
  name: string | undefined = undefined
  required: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  success: boolean | undefined = false

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
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-file-input-native]')
  }

  get files(): FileList | null {
    return this.nativeInput?.files ?? null
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options)
  }

  override blur(): void {
    this.nativeInput?.blur()
  }

  override render() {
    const state = this.invalid
      ? 'invalid'
      : this.success
        ? 'success'
        : 'default'

    return html`<input
      accept="${ifDefined(this.accept || undefined)}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getFileInputClasses({
        disabled: this.disabled ?? false,
        focused: this.focused ?? false,
        fullWidth: this.fullWidth ?? false,
        size: this.size as FileInputSize,
        state
      })}"
      data-sp-file-input-native
      ?disabled="${this.disabled ?? false}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      ?multiple="${this.multiple ?? false}"
      name="${ifDefined(this.name || undefined)}"
      ?required="${this.required ?? false}"
      title="${ifDefined(this.title || undefined)}"
      type="file"
    />`
  }
}

export function defineSpectreFileInput(
  tagName = 'sp-file-input'
): typeof SpectreFileInputElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFileInputElement
  }

  customElements.define(tagName, SpectreFileInputElement)
  return SpectreFileInputElement
}
