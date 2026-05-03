import { html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import { isInputSize, type SpectreInputSize } from '../../utils/form';

import { getInputClasses } from '@phcdevworks/spectre-ui';

export interface SpectreSelectProps {
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  fullWidth?: boolean | undefined;
  invalid?: boolean | undefined;
  loading?: boolean | undefined;
  name?: string | undefined;
  pill?: boolean | undefined;
  required?: boolean | undefined;
  size?: SpectreInputSize | undefined;
  success?: boolean | undefined;
  title?: string | undefined;
  value?: string | undefined;
}

export class SpectreSelectElement extends SpectreProjectableElement implements SpectreSelectProps {
  static properties = {
    autocomplete: { type: String, reflect: true },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    value: { type: String },
  };

  autocomplete?: string | undefined;
  autofocus = false;
  disabled = false;
  form?: string | undefined;
  fullWidth = false;
  invalid = false;
  loading = false;
  name?: string | undefined;
  pill = false;
  required = false;
  size: SpectreInputSize = 'md';
  success = false;
  value = '';

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-select-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return el.hasAttribute('data-sp-select-native');
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('size') && !isInputSize(this.size)) {
      this.size = 'md';
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    const nativeSelect = this.getContentContainer() as HTMLSelectElement | null;
    if (!nativeSelect) {
      return;
    }

    if (this.value !== '' && nativeSelect.value !== this.value) {
      nativeSelect.value = this.value;
    }

    if (this.value === '' && !this.hasAttribute('value')) {
      const nativeValue = nativeSelect.value ?? '';
      if (nativeValue !== '' && nativeValue !== this.value) {
        this.updateComplete.then(() => {
          if (this.value === '' && !this.hasAttribute('value')) {
            this.value = nativeValue;
          }
        });
      }
    }
  }

  private get selectClasses(): string {
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

  private handleInput(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;
    this.value = select.value;
  }

  private handleChange(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;
    this.value = select.value;
  }

  override focus(options?: FocusOptions): void {
    (this.getContentContainer() as HTMLSelectElement | null)?.focus(options);
  }

  override blur(): void {
    (this.getContentContainer() as HTMLSelectElement | null)?.blur();
  }

  override render() {
    return html`<select
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      autocomplete="${ifDefined(this.autocomplete || undefined)}"
      ?autofocus="${this.autofocus}"
      class="${this.selectClasses}"
      data-sp-select-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      name="${ifDefined(this.name || undefined)}"
      ?required="${this.required}"
      title="${ifDefined(this.title || undefined)}"
      .value="${live(this.value)}"
      @change="${this.handleChange}"
      @input="${this.handleInput}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </select>`;
  }
}

export function defineSpectreSelect(tagName = 'sp-select'): typeof SpectreSelectElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSelectElement;
  }

  customElements.define(tagName, SpectreSelectElement);
  return SpectreSelectElement;
}
