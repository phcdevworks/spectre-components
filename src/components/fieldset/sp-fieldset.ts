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

  disabled: boolean | undefined = false;
  form: string | undefined;
  invalid: boolean | undefined = false;
  legend: string | undefined;
  loading: boolean | undefined = false;
  name: string | undefined;
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

  private get visibleLegend(): string | undefined {
    const trimmedLegend = this.legend?.trim();
    return trimmedLegend ? trimmedLegend : undefined;
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false);
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

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false;
    }

    if (changedProperties.has('invalid') && this.invalid == null) {
      this.invalid = false;
    }

    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false;
    }

    if (changedProperties.has('success') && this.success == null) {
      this.success = false;
    }
  }

  override focus(options?: FocusOptions): void {
    (this.getContentContainer() as HTMLFieldSetElement | null)?.focus(options);
  }

  override blur(): void {
    (this.getContentContainer() as HTMLFieldSetElement | null)?.blur();
  }

  override render() {
    return html`<fieldset
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      data-sp-fieldset-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      name="${ifDefined(this.name || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.visibleLegend
        ? html`<legend class="sp-label" data-sp-fieldset-legend>${this.visibleLegend}</legend>`
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
