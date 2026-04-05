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
  autofocus?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  loading?: boolean;
  loadingLabel?: string;
  name?: string;
  pill?: boolean;
  size?: SpectreButtonSize;
  title?: string;
  type?: SpectreButtonType;
  variant?: SpectreButtonVariant;
  value?: string;
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
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    loadingLabel: { attribute: 'loading-label', type: String },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    title: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    value: { type: String, reflect: true },
  };

  autofocus = false;
  disabled = false;
  fullWidth = false;
  label?: string;
  loading = false;
  loadingLabel = 'Loading';
  name?: string;
  pill = false;
  size: SpectreButtonSize = 'md';
  override title = '';
  type: SpectreButtonType = 'button';
  variant: SpectreButtonVariant = 'primary';
  value?: string;
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

  // Native slot projection is a Shadow DOM feature, so in light DOM we keep
  // host-provided content reactive by tracking and reusing the host nodes.
  private projectedContent: Node[] = [];
  private contentObserver?: MutationObserver | undefined;

  createRenderRoot(): this {
    // Spectre components intentionally render in light DOM so the global
    // `@phcdevworks/spectre-ui` styling contract can apply directly.
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const hostId = super.getAttribute('id');

    if (hostId !== null) {
      this.id = hostId;
    }

    this.syncProjectedContent();
    this.startContentObserver();
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

  private get forwardedAriaLabel(): string | undefined {
    const ariaLabel = this.getAttribute('aria-label')?.trim();
    return ariaLabel ? ariaLabel : undefined;
  }

  private get forwardedAriaLabelledBy(): string | undefined {
    const ariaLabelledBy = this.getAttribute('aria-labelledby')?.trim();
    return ariaLabelledBy ? ariaLabelledBy : undefined;
  }

  private get forwardedAriaDescribedBy(): string | undefined {
    const ariaDescribedBy = this.getAttribute('aria-describedby')?.trim();
    return ariaDescribedBy ? ariaDescribedBy : undefined;
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return;
    }

    this.contentObserver = new MutationObserver((mutations) => {
      const isInternalMovement = mutations.every((mutation) => {
        return (
          Array.from(mutation.removedNodes).every(
            (node) => this.isInternalButtonNode(node) || this.contains(node),
          ) &&
          Array.from(mutation.addedNodes).every((node) => this.isInternalButtonNode(node))
        );
      });

      if (isInternalMovement) {
        return;
      }

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
    const nextProjectedContent: Node[] = [];

    Array.from(this.childNodes).forEach((node) => {
      if (this.isInternalButtonNode(node)) {
        this.projectedContent.forEach((pNode) => {
          if (pNode.parentNode !== this && this.contains(pNode)) {
            nextProjectedContent.push(pNode);
          }
        });
      } else {
        nextProjectedContent.push(node);
      }
    });

    const hasChanged =
      nextProjectedContent.length !== this.projectedContent.length ||
      nextProjectedContent.some((node, index) => node !== this.projectedContent[index]);

    if (hasChanged) {
      this.projectedContent = nextProjectedContent;
    }

    return hasChanged;
  }

  private isInternalButtonNode(node: Node): boolean {
    return (
      node.nodeType === Node.ELEMENT_NODE && (node as Element).hasAttribute('data-sp-button-native')
    );
  }

  private get nativeButton(): HTMLButtonElement | null {
    return this.querySelector('[data-sp-button-native]');
  }

  override focus(options?: FocusOptions): void {
    this.nativeButton?.focus(options);
  }

  override blur(): void {
    this.nativeButton?.blur();
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
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        ?autofocus=${this.autofocus}
        class=${this.buttonClasses}
        data-sp-button-native
        ?disabled=${this.isDisabled}
        id=${ifDefined(this.id || undefined)}
        name=${ifDefined(this.name)}
        title=${ifDefined(this.title || undefined)}
        type=${this.type}
        value=${ifDefined(this.value)}
      >
        ${this.renderButtonContent() || nothing}
      </button>
    `;
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
