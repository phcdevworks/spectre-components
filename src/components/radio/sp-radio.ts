import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

import { getInputLabelClasses } from '@phcdevworks/spectre-ui';

export interface SpectreRadioProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  autofocus?: boolean | undefined;
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  id?: string | null | undefined;
  invalid?: boolean | undefined;
  loading?: boolean | undefined;
  label?: string | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  success?: boolean | undefined;
  title?: string | null | undefined;
  value?: string | undefined;
}

export class SpectreRadioElement extends SpectreProjectableElement implements SpectreRadioProps {
  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    name: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    success: { type: Boolean, reflect: true },
    value: { type: String },
  };

  checked: boolean | undefined = false;
  disabled: boolean | undefined = false;
  form: string | undefined;
  invalid: boolean | undefined = false;
  loading: boolean | undefined = false;
  label: string | undefined;
  name: string | undefined;
  required: boolean | undefined = false;
  success: boolean | undefined = false;

  override get id(): string {
    return super.id;
  }

  override set id(value: string | null | undefined) {
    super.id = value;
  }

  override get title(): string {
    return super.title;
  }

  override set title(value: string | null | undefined) {
    super.title = value;
  }

  override get autofocus(): boolean {
    return super.autofocus;
  }

  override set autofocus(value: boolean | undefined | null) {
    super.autofocus = value;
  }

  value: string | undefined = 'on';

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-radio-label]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return (
      el.hasAttribute('data-sp-radio-label') ||
      el.hasAttribute('data-sp-radio-native') ||
      el.hasAttribute('data-sp-radio-label-fallback') ||
      el.hasAttribute('data-sp-radio-indicator')
    );
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('checked') && this.checked == null) {
      this.checked = false;
    }

    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false;
    }

    if (changedProperties.has('invalid') && this.invalid == null) {
      this.invalid = false;
    }

    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false;
    }

    if (changedProperties.has('required') && this.required == null) {
      this.required = false;
    }

    if (changedProperties.has('success') && this.success == null) {
      this.success = false;
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = 'on';
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-radio-native]');
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false);
  }

  private get visibleLabelFallback(): string | undefined {
    const trimmedLabel = this.label?.trim();
    return trimmedLabel ? trimmedLabel : undefined;
  }

  private handleInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  private handleChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    if (
      (changedProperties.has('checked') || changedProperties.has('name')) &&
      this.checked &&
      this.name
    ) {
      this.syncGroup();
    }
  }

  private syncGroup(): void {
    if (!this.name || !this.checked) {
      return;
    }

    const root = this.getRootNode() as ShadowRoot | Document;
    const radios = root.querySelectorAll(
      'sp-radio',
    ) as NodeListOf<SpectreRadioElement>;

    radios.forEach((radio) => {
      if (radio !== this && radio.name === this.name && radio.checked) {
        radio.checked = false;
      }
    });
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options);
  }

  override blur(): void {
    this.nativeInput?.blur();
  }

  override render() {
    const labelContent = this.hasProjectedContent
      ? this.projectedContent
      : this.visibleLabelFallback
        ? html`<span
            class="${getInputLabelClasses({ disabled: this.isDisabled })}"
            data-sp-radio-label-fallback
          >${this.visibleLabelFallback}</span>`
        : nothing;

    return html`<label data-sp-radio-label>
      <input
        aria-busy="${this.loading ? 'true' : 'false'}"
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        ?autofocus="${this.autofocus}"
        data-sp-radio-native
        .checked="${live(this.checked)}"
        ?disabled="${this.isDisabled}"
        form="${ifDefined(this.form || undefined)}"
        id="${ifDefined(this.id || undefined)}"
        name="${ifDefined(this.name || undefined)}"
        ?required="${this.required}"
        title="${ifDefined(this.title || undefined)}"
        type="radio"
        value="${ifDefined(this.value)}"
        @change="${this.handleChange}"
        @input="${this.handleInput}"
      />
      <span class="sp-radio-indicator" data-sp-radio-indicator></span>
      ${labelContent}
    </label>`;
  }
}

export function defineSpectreRadio(tagName = 'sp-radio'): typeof SpectreRadioElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreRadioElement;
  }

  customElements.define(tagName, SpectreRadioElement);
  return SpectreRadioElement;
}
