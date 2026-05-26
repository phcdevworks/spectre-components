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
  type SpectreInputSize,
  spectreInputTypes,
  type SpectreInputType,
};

export interface SpectreInputProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  autocapitalize?: string | undefined;
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  enterkeyhint?: string | undefined;
  form?: string | undefined;
  fullWidth?: boolean | undefined;
  id?: string | null | undefined;
  inputmode?: string | undefined;
  invalid?: boolean | undefined;
  list?: string | undefined;
  loading?: boolean | undefined;
  max?: string | undefined;
  maxlength?: number | undefined;
  min?: string | undefined;
  minlength?: number | undefined;
  name?: string | undefined;
  pattern?: string | undefined;
  pill?: boolean | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: SpectreInputSize | undefined;
  spellcheck?: boolean | undefined;
  step?: string | undefined;
  success?: boolean | undefined;
  title?: string | null | undefined;
  type?: SpectreInputType | undefined;
  value?: string | undefined;
}

export class SpectreInputElement extends SpectreBaseElement implements SpectreInputProps {
  static properties = {
    autocomplete: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    enterkeyhint: { type: String, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String, reflect: true },
    invalid: { type: Boolean, reflect: true },
    list: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    max: { type: String, reflect: true },
    maxlength: { type: Number, reflect: true },
    min: { type: String, reflect: true },
    minlength: { type: Number, reflect: true },
    name: { type: String, reflect: true },
    pattern: { type: String, reflect: true },
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

  override get autocapitalize(): string {
    return super.autocapitalize;
  }

  override set autocapitalize(value: string | null | undefined) {
    super.autocapitalize = value;
  }

  override get autofocus(): boolean {
    return super.autofocus;
  }

  override set autofocus(value: boolean | undefined | null) {
    super.autofocus = value;
  }

  autocomplete: string | undefined;
  disabled = false;
  enterkeyhint: string | undefined;
  form: string | undefined;
  fullWidth = false;

  override get id(): string {
    return super.id;
  }

  override set id(value: string | null | undefined) {
    super.id = value;
  }

  inputmode: string | undefined;
  invalid = false;
  list: string | undefined;
  loading = false;
  max: string | undefined;
  maxlength: number | undefined;
  min: string | undefined;
  minlength: number | undefined;
  name: string | undefined;
  pattern: string | undefined;
  pill = false;
  placeholder: string | undefined;
  readonly = false;
  required = false;
  size: SpectreInputSize | undefined = 'md';

  override get spellcheck(): boolean {
    return super.spellcheck;
  }

  override set spellcheck(value: boolean | null | undefined) {
    super.spellcheck = value;
  }

  step: string | undefined;
  success = false;

  override get title(): string {
    return super.title;
  }

  override set title(value: string | null | undefined) {
    super.title = value;
  }

  type: SpectreInputType | undefined = 'text';
  value: string | undefined = '';

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('size') && (this.size == null || !isInputSize(this.size))) {
      this.size = 'md';
    }

    if (changedProperties.has('type') && (this.type == null || !isInputType(this.type))) {
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
      fullWidth: this.fullWidth ?? false,
      pill: this.pill ?? false,
      size: this.size as SpectreInputSize,
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
    return (this.disabled ?? false) || (this.loading ?? false);
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
      autocapitalize="${ifDefined(this.autocapitalize || undefined)}"
      autocomplete="${ifDefined(this.autocomplete || undefined)}"
      ?autofocus="${this.autofocus}"
      class="${this.inputClasses}"
      data-sp-input-native
      ?disabled="${this.isDisabled}"
      enterkeyhint="${ifDefined(this.enterkeyhint || undefined)}"
      form="${ifDefined(this.form || undefined)}"
      ?readonly="${this.readonly}"
      ?required="${this.required}"
      id="${ifDefined(this.id || undefined)}"
      inputmode="${ifDefined(this.inputmode || undefined)}"
      list="${ifDefined(this.list || undefined)}"
      max="${ifDefined(this.max || undefined)}"
      maxlength="${ifDefined(this.maxlength)}"
      min="${ifDefined(this.min || undefined)}"
      minlength="${ifDefined(this.minlength)}"
      name="${ifDefined(this.name || undefined)}"
      pattern="${ifDefined(this.pattern || undefined)}"
      placeholder="${ifDefined(this.placeholder || undefined)}"
      spellcheck="${ifDefined(
        this.spellcheck === undefined ? undefined : String(this.spellcheck),
      )}"
      step="${ifDefined(this.step || undefined)}"
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
