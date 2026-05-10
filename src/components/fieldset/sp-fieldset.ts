import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

export interface SpectreFieldsetProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  disabled?: boolean | undefined;
  form?: string | undefined;
  id?: string | null | undefined;
  invalid?: boolean | undefined;
  legend?: string | undefined;
  loading?: boolean | undefined;
  name?: string | undefined;
  success?: boolean | undefined;
  title?: string | null | undefined;
}

export class SpectreFieldsetElement extends SpectreProjectableElement implements SpectreFieldsetProps {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    invalid: { type: Boolean, reflect: true },
    legend: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
  };

  disabled = false;
  form: string | undefined;
  invalid = false;
  legend: string | undefined;
  loading = false;
  name: string | undefined;
  success = false;

  override get title(): string {
    return super.title;
  }

  override set title(value: string | null | undefined) {
    super.title = value;
  }

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-fieldset-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return (
      el.hasAttribute('data-sp-fieldset-native') ||
      el.hasAttribute('data-sp-fieldset-legend')
    );
  }

  override focus(options?: FocusOptions): void {
    (this.getContentContainer() as HTMLFieldSetElement | null)?.focus(options);
  }

  override blur(): void {
    (this.getContentContainer() as HTMLFieldSetElement | null)?.blur();
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  override render() {
    return html`<fieldset
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      data-sp-fieldset-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      name="${ifDefined(this.name || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.legend
        ? html`<legend class="sp-label" data-sp-fieldset-legend>${this.legend}</legend>`
        : nothing}
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </fieldset>`;
  }
}

export function defineSpectreFieldset(tagName = 'sp-fieldset'): typeof SpectreFieldsetElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFieldsetElement;
  }

  customElements.define(tagName, SpectreFieldsetElement);
  return SpectreFieldsetElement;
}
