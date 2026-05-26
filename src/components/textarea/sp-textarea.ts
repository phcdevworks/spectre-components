import { html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreBaseElement } from '../../utils/base';
import {
  isInputSize,
  type SpectreInputSize,
  normalizeInt,
} from '../../utils/form';

import { getInputClasses } from '@phcdevworks/spectre-ui';

export interface SpectreTextareaProps {
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
  loading?: boolean | undefined;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string | undefined;
  pill?: boolean | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  rows?: number | undefined;
  size?: SpectreInputSize | undefined;
  spellcheck?: boolean | undefined;
  success?: boolean | undefined;
  title?: string | null | undefined;
  value?: string | undefined;
}

const DEFAULT_ROWS = 2;

export class SpectreTextareaElement
  extends SpectreBaseElement
  implements SpectreTextareaProps {
  static properties = {
    autocomplete: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    enterkeyhint: { type: String, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    maxlength: { type: Number, reflect: true },
    minlength: { type: Number, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    rows: { type: Number, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
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
  loading = false;
  maxlength: number | undefined;
  minlength: number | undefined;
  name: string | undefined;
  pill = false;
  placeholder: string | undefined;
  readonly = false;
  required = false;
  rows: number | undefined = DEFAULT_ROWS;
  size: SpectreInputSize | undefined = 'md';

  override get spellcheck(): boolean {
    return super.spellcheck;
  }

  override set spellcheck(value: boolean | null | undefined) {
    super.spellcheck = value;
  }

  success = false;

  override get title(): string {
    return super.title;
  }

  override set title(value: string | null | undefined) {
    super.title = value;
  }

  value: string | undefined = '';

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has('size') && (this.size == null || !isInputSize(this.size))) {
      this.size = 'md';
    }

    if (changedProperties.has('rows')) {
      this.rows = normalizeInt(this.rows, DEFAULT_ROWS, 1) as number;
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

  private get textareaClasses(): string {
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
    return html`<textarea
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      autocapitalize="${ifDefined(this.autocapitalize || undefined)}"
      autocomplete="${ifDefined(this.autocomplete || undefined)}"
      ?autofocus="${this.autofocus}"
      class="${this.textareaClasses}"
      data-sp-textarea-native
      ?disabled="${this.isDisabled}"
      enterkeyhint="${ifDefined(this.enterkeyhint || undefined)}"
      form="${ifDefined(this.form || undefined)}"
      inputmode="${ifDefined(this.inputmode || undefined)}"
      ?readonly="${this.readonly}"
      ?required="${this.required}"
      id="${ifDefined(this.id || undefined)}"
      maxlength="${ifDefined(this.maxlength)}"
      minlength="${ifDefined(this.minlength)}"
      name="${ifDefined(this.name || undefined)}"
      placeholder="${ifDefined(this.placeholder || undefined)}"
      rows="${this.rows}"
      spellcheck="${ifDefined(
        this.spellcheck === undefined ? undefined : String(this.spellcheck),
      )}"
      title="${ifDefined(this.title || undefined)}"
      .value="${live(this.value)}"
      @change="${this.handleChange}"
      @input="${this.handleInput}"
    ></textarea>`;
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
