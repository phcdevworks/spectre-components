import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

export interface SpectreCheckboxProps {
  ariaLabel?: string | null | undefined;
  ariaLabelledBy?: string | null | undefined;
  ariaDescribedBy?: string | null | undefined;
  autofocus?: boolean | undefined;
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  invalid?: boolean | undefined;
  loading?: boolean | undefined;
  label?: string | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  success?: boolean | undefined;
  title?: string | undefined;
  value?: string | undefined;
}

export class SpectreCheckboxElement extends SpectreProjectableElement implements SpectreCheckboxProps {
  static properties = {
    autofocus: { type: Boolean, reflect: true },
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

  autofocus = false;
  checked = false;
  disabled = false;
  form?: string | undefined;
  invalid = false;
  loading = false;
  label?: string | undefined;
  name?: string | undefined;
  required = false;
  success = false;
  value = 'on';

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-checkbox-label]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return (
      el.hasAttribute('data-sp-checkbox-label') ||
      el.hasAttribute('data-sp-checkbox-native') ||
      el.hasAttribute('data-sp-checkbox-label-fallback') ||
      el.hasAttribute('data-sp-checkbox-indicator')
    );
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('value') && this.value == null) {
      this.value = 'on';
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-checkbox-native]');
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
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
        ? html`<span class="sp-label" data-sp-checkbox-label-fallback>${this.visibleLabelFallback}</span>`
        : nothing;

    return html`<label data-sp-checkbox-label>
      <input
        aria-busy="${this.loading ? 'true' : 'false'}"
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        ?autofocus="${this.autofocus}"
        data-sp-checkbox-native
        .checked="${live(this.checked)}"
        ?disabled="${this.isDisabled}"
        form="${ifDefined(this.form)}"
        id="${ifDefined(this.id || undefined)}"
        name="${ifDefined(this.name)}"
        ?required="${this.required}"
        title="${ifDefined(this.title || undefined)}"
        type="checkbox"
        value="${ifDefined(this.value || undefined)}"
        @change="${this.handleChange}"
        @input="${this.handleInput}"
      />
      <span class="sp-checkbox-indicator" data-sp-checkbox-indicator></span>
      ${labelContent}
    </label>`;
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
