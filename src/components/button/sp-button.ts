import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import {
  isButtonType,
  isButtonVariant,
  isInputSize,
  type SpectreButtonType,
  type SpectreButtonVariant,
  type SpectreInputSize,
} from '../../utils/form';

import {
  getButtonClasses,
  type ButtonSize,
  type ButtonVariant,
} from '@phcdevworks/spectre-ui';

export interface SpectreButtonProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  fullWidth?: boolean | undefined;
  iconOnly?: boolean | undefined;
  id?: string | null | undefined;
  label?: string | undefined;
  loading?: boolean | undefined;
  loadingLabel?: string | undefined;
  name?: string | undefined;
  pill?: boolean | undefined;
  size?: SpectreInputSize | undefined;
  title?: string | null | undefined;
  type?: SpectreButtonType | undefined;
  variant?: SpectreButtonVariant | undefined;
  value?: string | undefined;
}

export class SpectreButtonElement extends SpectreProjectableElement implements SpectreButtonProps {
  static properties = {
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    iconOnly: { attribute: 'icon-only', type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    loadingLabel: { attribute: 'loading-label', type: String, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    value: { type: String },
  };

  autofocus = false;
  disabled = false;
  form: string | undefined;
  fullWidth = false;
  iconOnly = false;
  label: string | undefined;
  loading = false;
  loadingLabel: string | undefined = 'Loading';
  name: string | undefined;
  pill = false;
  size: SpectreInputSize | undefined = 'md';
  type: SpectreButtonType | undefined = 'button';
  variant: SpectreButtonVariant | undefined = 'primary';
  value: string | undefined = '';

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

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-button-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return (
      el.hasAttribute('data-sp-button-native') ||
      el.hasAttribute('data-sp-button-loading-label') ||
      el.hasAttribute('data-sp-button-label-fallback')
    );
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('variant') && (this.variant == null || !isButtonVariant(this.variant))) {
      this.variant = 'primary';
    }

    if (changedProperties.has('size') && (this.size == null || !isInputSize(this.size))) {
      this.size = 'md';
    }

    if (changedProperties.has('type') && (this.type == null || !isButtonType(this.type))) {
      this.type = 'button';
    }

    if (changedProperties.has('loadingLabel')) {
      if (this.loadingLabel == null || this.loadingLabel.trim() === '') {
        this.loadingLabel = 'Loading';
      }
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }
  }

  private get buttonClasses(): string {
    return getButtonClasses({
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      iconOnly: this.iconOnly ?? false,
      loading: this.loading ?? false,
      pill: this.pill ?? false,
      size: this.size as ButtonSize,
      variant: this.variant as ButtonVariant,
    });
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false);
  }

  private get visibleLabelFallback(): string | undefined {
    const trimmedLabel = this.label?.trim();
    return trimmedLabel ? trimmedLabel : undefined;
  }

  override focus(options?: FocusOptions): void {
    (this.getContentContainer() as HTMLButtonElement | null)?.focus(options);
  }

  override blur(): void {
    (this.getContentContainer() as HTMLButtonElement | null)?.blur();
  }

  private renderButtonContent(): TemplateResult | Node[] | typeof nothing {
    if (this.loading) {
      return html`<span class="sp-label" data-sp-button-loading-label>${this.loadingLabel}</span>`;
    }

    if (this.hasProjectedContent) {
      return this.projectedContent;
    }

    return this.visibleLabelFallback
      ? html`<span class="sp-label" data-sp-button-label-fallback>${this.visibleLabelFallback}</span>`
      : nothing;
  }

  override render() {
    return html`<button
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      ?autofocus="${this.autofocus}"
      class="${this.buttonClasses}"
      data-sp-button-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      name="${ifDefined(this.name || undefined)}"
      title="${ifDefined(this.title || undefined)}"
      type="${this.type}"
      value="${ifDefined(this.value)}"
    >
      ${this.renderButtonContent()}
    </button>`;
  }
}

export function defineSpectreButton(tagName = 'sp-button'): typeof SpectreButtonElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreButtonElement;
  }

  customElements.define(tagName, SpectreButtonElement);
  return SpectreButtonElement;
}
