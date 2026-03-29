import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  loading?: boolean;
  loadingLabel?: string;
  pill?: boolean;
  size?: SpectreButtonSize;
  type?: SpectreButtonType;
  variant?: SpectreButtonVariant;
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

export class SpectreButtonElement extends LitElement implements SpectreButtonProps {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    loadingLabel: { attribute: 'loading-label', type: String },
    pill: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  disabled = false;
  fullWidth = false;
  label?: string;
  loading = false;
  loadingLabel = 'Loading';
  pill = false;
  size: SpectreButtonSize = 'md';
  type: SpectreButtonType = 'button';
  variant: SpectreButtonVariant = 'primary';
  private initialTextContent = '';

  createRenderRoot(): this {
    return this;
  }

  override connectedCallback(): void {
    this.initialTextContent = this.textContent?.trim() ?? '';
    super.connectedCallback();
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

  override render() {
    const content = this.loading ? this.loadingLabel : this.initialTextContent || this.label;

    return html`
      <button
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-label=${ifDefined(this.label)}
        class=${this.buttonClasses}
        ?disabled=${this.isDisabled}
        type=${this.type}
      >
        ${content ?? nothing}
      </button>
    `;
  }
}

export function defineSpectreButton(tagName = 'sp-button'): typeof SpectreButtonElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as typeof SpectreButtonElement;
  }

  customElements.define(tagName, SpectreButtonElement);
  return SpectreButtonElement;
}
