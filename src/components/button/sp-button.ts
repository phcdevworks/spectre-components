import { LitElement, html, nothing, type TemplateResult } from 'lit';
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

function hasMeaningfulContent(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0;
    }

    return false;
  });
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
  // Native slot projection is a Shadow DOM feature, so in light DOM we keep
  // host-provided content reactive by tracking and reusing the host nodes.
  private projectedContent: Node[] = [];
  private contentObserver?: MutationObserver;

  createRenderRoot(): this {
    // Spectre components intentionally render in light DOM so the global
    // `@phcdevworks/spectre-ui` styling contract can apply directly.
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncProjectedContent();
    this.startContentObserver();
  }

  override disconnectedCallback(): void {
    this.stopContentObserver();
    super.disconnectedCallback();
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

  protected override update(changedProperties: Map<PropertyKey, unknown>): void {
    this.stopContentObserver();
    super.update(changedProperties);
    this.startContentObserver();
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

  private get hasProjectedContent(): boolean {
    return hasMeaningfulContent(this.projectedContent);
  }

  private get visibleLabelFallback(): string | undefined {
    const trimmedLabel = this.label?.trim();
    return trimmedLabel ? trimmedLabel : undefined;
  }

  private get ariaLabel(): string | undefined {
    if (this.loading || this.hasProjectedContent || this.visibleLabelFallback) {
      return undefined;
    }

    const nonVisualLabel = this.getAttribute('aria-label')?.trim();
    return nonVisualLabel ? nonVisualLabel : undefined;
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return;
    }

    this.contentObserver = new MutationObserver(() => {
      if (this.syncProjectedContent()) {
        this.requestUpdate();
      }
    });

    this.contentObserver.observe(this, {
      childList: true,
    });
  }

  private stopContentObserver(): void {
    this.contentObserver?.disconnect();
    this.contentObserver = undefined;
  }

  private syncProjectedContent(): boolean {
    const nextProjectedContent = Array.from(this.childNodes).filter(
      (node) => !this.isInternalButtonNode(node),
    );

    const hasChanged =
      nextProjectedContent.length !== this.projectedContent.length ||
      nextProjectedContent.some((node, index) => node !== this.projectedContent[index]);

    if (hasChanged) {
      this.projectedContent = nextProjectedContent;
    }

    return hasChanged;
  }

  private isInternalButtonNode(node: Node): boolean {
    return node.nodeType === Node.ELEMENT_NODE
      && (node as Element).matches('[data-sp-button-native]');
  }

  private renderButtonContent(): TemplateResult | Node[] | string {
    if (this.loading) {
      return this.loadingLabel;
    }

    if (this.hasProjectedContent) {
      return this.projectedContent;
    }

    return this.visibleLabelFallback ?? '';
  }

  override render() {
    return html`
      <button
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-label=${ifDefined(this.ariaLabel)}
        class=${this.buttonClasses}
        data-sp-button-native
        ?disabled=${this.isDisabled}
        type=${this.type}
      >
        ${this.renderButtonContent() || nothing}
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
