import { html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreBaseElement } from '../../utils/base';
import {
  spectreInputSizes,
  isInputSize,
  type SpectreInputSize,
  spectreInputTypes,
  isInputType,
  type SpectreInputType,
  normalizeInt,
} from '../../utils/form';

import { getInputClasses } from '@phcdevworks/spectre-ui';

export {
  spectreInputSizes,
  isInputSize,
  type SpectreInputSize,
  spectreInputTypes,
  isInputType,
  type SpectreInputType,
};

export interface SpectreInputProps {
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  fullWidth?: boolean | undefined;
  inputmode?: string | undefined;
  invalid?: boolean | undefined;
  loading?: boolean | undefined;
  max?: string | undefined;
  maxlength?: number | undefined;
  min?: string | undefined;
  minlength?: number | undefined;
  name?: string | undefined;
  pill?: boolean | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: SpectreInputSize | undefined;
  step?: string | undefined;
  success?: boolean | undefined;
  title?: string | undefined;
  type?: SpectreInputType | undefined;
  value?: string | undefined;
}

export class SpectreInputElement extends SpectreBaseElement implements SpectreInputProps {
  static properties = {
    autocomplete: { type: String, reflect: true },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    max: { type: String, reflect: true },
    maxlength: { type: Number, reflect: true },
    min: { type: String, reflect: true },
    minlength: { type: Number, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    step: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    value: { type: String },
  };

  autocomplete?: string | undefined;
  autofocus = false;
  disabled = false;
  form?: string | undefined;
  fullWidth = false;
  inputmode?: string | undefined;
  invalid = false;
  loading = false;
  max?: string | undefined;
  maxlength?: number | undefined;
  min?: string | undefined;
  minlength?: number | undefined;
  name?: string | undefined;
  pill = false;
  placeholder?: string | undefined;
  readonly = false;
  required = false;
  size: SpectreInputSize = 'md';
  step?: string | undefined;
  success = false;
  type: SpectreInputType = 'text';
  value = '';

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('size') && !isInputSize(this.size)) {
      this.size = 'md';
    }

    if (changedProperties.has('type') && !isInputType(this.type)) {
      this.type = 'text';
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }

    if (changedProperties.has('maxlength')) {
      this.maxlength = normalizeInt(this.maxlength, undefined);
    }

    if (changedProperties.has('minlength')) {
      this.minlength = normalizeInt(this.minlength, undefined);
    }
  }

  private get inputClasses(): string {
    return getInputClasses({
      fullWidth: this.fullWidth,
      pill: this.pill,
      size: this.size,
      state: this.isDisabled
        ? this.disabled
          ? 'disabled'
          : 'loading'
        : this.invalid
          ? 'error'
          : this.success
            ? 'success'
            : 'default',
    });
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-input-native]');
  }

  private handleInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.value = input.value;
  }

  private handleChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.value = input.value;
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options);
  }

  override blur(): void {
    this.nativeInput?.blur();
  }

  override render() {
    return html`<input
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      autocomplete="${ifDefined(this.autocomplete)}"
      ?autofocus="${this.autofocus}"
      class="${this.inputClasses}"
      data-sp-input-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form)}"
      ?readonly="${this.readonly}"
      ?required="${this.required}"
      id="${ifDefined(this.id || undefined)}"
      inputmode="${ifDefined(this.inputmode)}"
      max="${ifDefined(this.max)}"
      maxlength="${ifDefined(this.maxlength)}"
      min="${ifDefined(this.min)}"
      minlength="${ifDefined(this.minlength)}"
      name="${ifDefined(this.name)}"
      placeholder="${ifDefined(this.placeholder)}"
      step="${ifDefined(this.step)}"
      title="${ifDefined(this.title || undefined)}"
      type="${this.type}"
      .value="${live(this.value)}"
      @change="${this.handleChange}"
      @input="${this.handleInput}"
    />`;
  }
}

export function defineSpectreInput(tagName = 'sp-input'): typeof SpectreInputElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreInputElement;
  }

  customElements.define(tagName, SpectreInputElement);
  return SpectreInputElement;
}
