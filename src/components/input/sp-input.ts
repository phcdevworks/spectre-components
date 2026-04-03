import { LitElement, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  getInputClasses,
  type InputSize,
} from '@phcdevworks/spectre-ui';

export const spectreInputTypes = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week',
] as const;

export const spectreInputSizes = ['sm', 'md', 'lg'] as const;

export type SpectreInputType = (typeof spectreInputTypes)[number];
export type SpectreInputSize = (typeof spectreInputSizes)[number];

export interface SpectreInputProps {
  autocomplete?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  inputmode?: string;
  invalid?: boolean;
  max?: string;
  maxlength?: number;
  min?: string;
  minlength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: SpectreInputSize;
  step?: string;
  type?: SpectreInputType;
  value?: string;
}

function isInputType(value: string): value is SpectreInputType {
  return (spectreInputTypes as readonly string[]).includes(value);
}

function isInputSize(value: string): value is InputSize {
  return (spectreInputSizes as readonly string[]).includes(value);
}

export class SpectreInputElement extends LitElement implements SpectreInputProps {
  static properties = {
    autocomplete: { type: String },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String },
    invalid: { type: Boolean, reflect: true },
    max: { type: String },
    maxlength: { type: Number },
    min: { type: String },
    minlength: { type: Number },
    name: { type: String },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    step: { type: String },
    type: { type: String, reflect: true },
    value: { type: String },
  };

  autocomplete?: string;
  disabled = false;
  fullWidth = false;
  inputmode?: string;
  invalid = false;
  max?: string;
  maxlength?: number;
  min?: string;
  minlength?: number;
  name?: string;
  placeholder?: string;
  readonly = false;
  required = false;
  size: SpectreInputSize = 'md';
  step?: string;
  type: SpectreInputType = 'text';
  value = '';
  private inputId?: string;

  override get id(): string {
    return this.inputId ?? '';
  }

  override set id(value: string) {
    if ((this.inputId ?? '') === value) {
      return;
    }

    this.inputId = value;

    const host = this as unknown as HTMLElement;
    if (HTMLElement.prototype.hasAttribute.call(host, 'id')) {
      HTMLElement.prototype.removeAttribute.call(host, 'id');
    }

    this.requestUpdate();
  }

  createRenderRoot(): this {
    // Spectre components intentionally render in light DOM so the global
    // `@phcdevworks/spectre-ui` styling contract can apply directly.
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const hostId = super.getAttribute('id');

    if (hostId !== null) {
      this.id = hostId;
    }
  }

  override getAttribute(qualifiedName: string): string | null {
    if (qualifiedName === 'id') {
      return this.id || null;
    }

    return super.getAttribute(qualifiedName);
  }

  override hasAttribute(qualifiedName: string): boolean {
    if (qualifiedName === 'id') {
      return this.id !== '';
    }

    return super.hasAttribute(qualifiedName);
  }

  override setAttribute(qualifiedName: string, value: string): void {
    if (qualifiedName === 'id') {
      this.id = value;
      return;
    }

    super.setAttribute(qualifiedName, value);
  }

  override removeAttribute(qualifiedName: string): void {
    if (qualifiedName === 'id') {
      this.id = '';
      return;
    }

    super.removeAttribute(qualifiedName);
  }

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
  }

  private get inputClasses(): string {
    return getInputClasses({
      fullWidth: this.fullWidth,
      size: this.size,
      state: this.disabled ? 'disabled' : this.invalid ? 'error' : 'default',
    });
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-input-native]');
  }

  private get forwardedAriaLabel(): string | undefined {
    const ariaLabel = this.getAttribute('aria-label')?.trim();
    return ariaLabel ? ariaLabel : undefined;
  }

  private get forwardedAriaLabelledBy(): string | undefined {
    const ariaLabelledBy = this.getAttribute('aria-labelledby')?.trim();
    return ariaLabelledBy ? ariaLabelledBy : undefined;
  }

  private get forwardedAriaDescribedBy(): string | undefined {
    const ariaDescribedBy = this.getAttribute('aria-describedby')?.trim();
    return ariaDescribedBy ? ariaDescribedBy : undefined;
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
    return html`
      <input
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        autocomplete=${ifDefined(this.autocomplete)}
        class=${this.inputClasses}
        data-sp-input-native
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        id=${ifDefined(this.id || undefined)}
        inputmode=${ifDefined(this.inputmode)}
        max=${ifDefined(this.max)}
        maxlength=${ifDefined(this.maxlength)}
        min=${ifDefined(this.min)}
        minlength=${ifDefined(this.minlength)}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        step=${ifDefined(this.step)}
        type=${this.type}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      />
    `;
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
