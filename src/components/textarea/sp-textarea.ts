import { html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreBaseElement } from '../../utils/base';
import { isInputSize, type SpectreInputSize } from '../../utils/form';

import { getInputClasses } from '@phcdevworks/spectre-ui';

export interface SpectreTextareaProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  autocomplete?: string;
  autofocus?: boolean;
  disabled?: boolean;
  form?: string;
  fullWidth?: boolean;
  inputmode?: string;
  invalid?: boolean;
  loading?: boolean;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string;
  pill?: boolean;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  size?: SpectreInputSize;
  success?: boolean;
  title?: string;
  value?: string;
}

const DEFAULT_ROWS = 2;

export class SpectreTextareaElement
  extends SpectreBaseElement
  implements SpectreTextareaProps {
  static properties = {
    autocomplete: { type: String },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    maxlength: { type: Number },
    minlength: { type: Number },
    name: { type: String },
    pill: { type: Boolean, reflect: true },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    rows: { type: Number },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
  };

  autocomplete?: string;
  autofocus = false;
  disabled = false;
  form?: string;
  fullWidth = false;
  inputmode?: string;
  invalid = false;
  loading = false;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string;
  pill = false;
  placeholder?: string;
  readonly = false;
  required = false;
  rows = DEFAULT_ROWS;
  size: SpectreInputSize = 'md';
  success = false;
  override title = '';
  value = '';

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has('size') && !isInputSize(this.size)) {
      this.size = 'md';
    }

    if (changedProperties.has('rows')) {
      if (
        this.rows == null ||
        !Number.isInteger(this.rows) ||
        this.rows < 1
      ) {
        this.rows = DEFAULT_ROWS;
      }
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }

    if (changedProperties.has('maxlength')) {
      if (
        this.maxlength == null ||
        !Number.isInteger(this.maxlength) ||
        this.maxlength < 0
      ) {
        this.maxlength = undefined;
      }
    }

    if (changedProperties.has('minlength')) {
      if (
        this.minlength == null ||
        !Number.isInteger(this.minlength) ||
        this.minlength < 0
      ) {
        this.minlength = undefined;
      }
    }
  }

  private get textareaClasses(): string {
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

  private get nativeTextarea(): HTMLTextAreaElement | null {
    return this.querySelector('[data-sp-textarea-native]');
  }

  private handleInput(event: Event): void {
    const textarea = event.currentTarget as HTMLTextAreaElement;
    this.value = textarea.value;
  }

  private handleChange(event: Event): void {
    const textarea = event.currentTarget as HTMLTextAreaElement;
    this.value = textarea.value;
  }

  override focus(options?: FocusOptions): void {
    this.nativeTextarea?.focus(options);
  }

  override blur(): void {
    this.nativeTextarea?.blur();
  }

  override render() {
    return html`
      <textarea
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        autocomplete=${ifDefined(this.autocomplete)}
        ?autofocus=${this.autofocus}
        class=${this.textareaClasses}
        data-sp-textarea-native
        ?disabled=${this.isDisabled}
        form=${ifDefined(this.form)}
        inputmode=${ifDefined(this.inputmode)}
        ?readonly=${this.readonly}
        ?required=${this.required}
        id=${ifDefined(this.id || undefined)}
        maxlength=${ifDefined(this.maxlength)}
        minlength=${ifDefined(this.minlength)}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        rows=${this.rows}
        title=${ifDefined(this.title || undefined)}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      ></textarea>
    `;
  }
}

export function defineSpectreTextarea(
  tagName = 'sp-textarea',
): typeof SpectreTextareaElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTextareaElement;
  }

  customElements.define(tagName, SpectreTextareaElement);
  return SpectreTextareaElement;
}
