import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

import {
  getButtonClasses,
  type ButtonSize,
  type ButtonVariant,
} from '@phcdevworks/spectre-ui';

export const spectreButtonVariants = [
  'primary',
  'secondary',
  'ghost',
  'danger',
  'success',
  'cta',
  'accent',
] as const;

export const spectreButtonSizes = ['sm', 'md', 'lg'] as const;
export const spectreButtonTypes = ['button', 'submit', 'reset'] as const;

export type SpectreButtonVariant = (typeof spectreButtonVariants)[number];
export type SpectreButtonSize = (typeof spectreButtonSizes)[number];
export type SpectreButtonType = (typeof spectreButtonTypes)[number];

export interface SpectreButtonProps {
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  fullWidth?: boolean | undefined;
  label?: string | undefined;
  loading?: boolean | undefined;
  loadingLabel?: string | undefined;
  name?: string | undefined;
  pill?: boolean | undefined;
  size?: SpectreButtonSize | undefined;
  title?: string | undefined;
  type?: SpectreButtonType | undefined;
  variant?: SpectreButtonVariant | undefined;
  value?: string | undefined;
}

function isButtonVariant(value: string): value is ButtonVariant {
  return (spectreButtonVariants as readonly string[]).includes(value);
}

function isButtonSize(value: string): value is ButtonSize {
  return (spectreButtonSizes as readonly string[]).includes(value);
}

function isButtonType(value: string): value is SpectreButtonType {
  return (spectreButtonTypes as readonly string[]).includes(value);
}

export class SpectreButtonElement extends SpectreProjectableElement implements SpectreButtonProps {
  static properties = {
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
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
  form?: string | undefined;
  fullWidth = false;
  label?: string | undefined;
  loading = false;
  loadingLabel = 'Loading';
  name?: string | undefined;
  pill = false;
  size: SpectreButtonSize = 'md';
  type: SpectreButtonType = 'button';
  variant: SpectreButtonVariant = 'primary';
  value = '';

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
    if (changedProperties.has('variant') && !isButtonVariant(this.variant)) {
      this.variant = 'primary';
    }

    if (changedProperties.has('size') && !isButtonSize(this.size)) {
      this.size = 'md';
    }

    if (changedProperties.has('type') && !isButtonType(this.type)) {
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
      fullWidth: this.fullWidth,
      loading: this.loading,
      pill: this.pill,
      size: this.size,
      variant: this.variant,
    });
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
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
      return html`<span data-sp-button-loading-label>${this.loadingLabel}</span>`;
    }

    if (this.hasProjectedContent) {
      return this.projectedContent as Node[];
    }

    return this.visibleLabelFallback
      ? html`<span data-sp-button-label-fallback>${this.visibleLabelFallback}</span>`
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
      form="${ifDefined(this.form)}"
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
