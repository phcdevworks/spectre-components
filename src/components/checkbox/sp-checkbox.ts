import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface SpectreCheckboxProps {
  autofocus?: boolean;
  checked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  name?: string;
  required?: boolean;
  title?: string;
  value?: string;
}

export class SpectreCheckboxElement extends LitElement implements SpectreCheckboxProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autofocus: { type: Boolean, reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    name: { type: String },
    required: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  autofocus = false;
  checked = false;
  disabled = false;
  invalid = false;
  label = '';
  name?: string;
  required = false;
  override title = '';
  value = 'on';
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
    if (changedProperties.has('value') && this.value == null) {
      this.value = 'on';
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-checkbox-native]');
  }

  private get forwardedAriaLabel(): string | undefined {
    const value = this.ariaLabel?.trim();
    return value ? value : undefined;
  }

  private get forwardedAriaLabelledBy(): string | undefined {
    const value = this.ariaLabelledBy?.trim();
    return value ? value : undefined;
  }

  private get forwardedAriaDescribedBy(): string | undefined {
    const value = this.ariaDescribedBy?.trim();
    return value ? value : undefined;
  }

  private handleInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  private handleChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options);
  }

  override blur(): void {
    this.nativeInput?.blur();
  }

  override render() {
    return html`
      <label>
        <input
          aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
          aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
          aria-label=${ifDefined(this.forwardedAriaLabel)}
          aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
          ?autofocus=${this.autofocus}
          data-sp-checkbox-native
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          id=${ifDefined(this.id || undefined)}
          name=${ifDefined(this.name)}
          ?required=${this.required}
          title=${ifDefined(this.title || undefined)}
          type='checkbox'
          value=${ifDefined(this.value || undefined)}
          @change=${this.handleChange}
          @input=${this.handleInput}
        />
        <span class='sp-label'>${this.label}</span>
      </label>
    `;
  }
}

export function defineSpectreCheckbox(tagName = 'sp-checkbox'): typeof SpectreCheckboxElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreCheckboxElement;
  }

  customElements.define(tagName, SpectreCheckboxElement);
  return SpectreCheckboxElement;
}
