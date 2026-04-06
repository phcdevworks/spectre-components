import { LitElement, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { getInputClasses } from '@phcdevworks/spectre-ui';

export interface SpectreTextareaProps {
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  value?: string;
}

const DEFAULT_ROWS = 2;

export class SpectreTextareaElement
  extends LitElement
  implements SpectreTextareaProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    maxlength: { type: Number },
    minlength: { type: Number },
    name: { type: String },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    rows: { type: Number },
    value: { type: String },
  };

  disabled = false;
  invalid = false;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string;
  placeholder?: string;
  readonly = false;
  required = false;
  rows = DEFAULT_ROWS;
  value = '';
  private _id?: string;

  override get id(): string {
    return this._id ?? '';
  }

  override set id(value: string) {
    if ((this._id ?? '') === value) {
      return;
    }

    this._id = value;

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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has('rows') && !Number.isInteger(this.rows)) {
      this.rows = DEFAULT_ROWS;
    }

    if (changedProperties.has('rows') && this.rows < 1) {
      this.rows = DEFAULT_ROWS;
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }

    if (
      changedProperties.has('maxlength') &&
      this.maxlength != null &&
      (!Number.isInteger(this.maxlength) || this.maxlength < 0)
    ) {
      this.maxlength = undefined;
    }

    if (
      changedProperties.has('minlength') &&
      this.minlength != null &&
      (!Number.isInteger(this.minlength) || this.minlength < 0)
    ) {
      this.minlength = undefined;
    }
  }

  private get textareaClasses(): string {
    return getInputClasses({
      size: 'md',
      state: this.disabled ? 'disabled' : this.invalid ? 'error' : 'default',
    });
  }

  private get nativeTextarea(): HTMLTextAreaElement | null {
    return this.querySelector('[data-sp-textarea-native]');
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
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        class=${this.textareaClasses}
        data-sp-textarea-native
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        id=${ifDefined(this.id || undefined)}
        maxlength=${ifDefined(this.maxlength)}
        minlength=${ifDefined(this.minlength)}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        rows=${this.rows}
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
