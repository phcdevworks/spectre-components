import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import { isCardVariant, type SpectreCardVariant } from '../../utils/form';

import { getCardClasses, type CardVariant } from '@phcdevworks/spectre-ui';

export interface SpectreCardProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  disabled?: boolean | undefined;
  fullHeight?: boolean | undefined;
  id?: string | null | undefined;
  interactive?: boolean | undefined;
  loading?: boolean | undefined;
  padded?: boolean | undefined;
  title?: string | null | undefined;
  variant?: SpectreCardVariant | undefined;
}

export class SpectreCardElement extends SpectreProjectableElement implements SpectreCardProps {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    fullHeight: { attribute: 'full-height', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    padded: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
  };

  disabled: boolean | undefined = false;
  fullHeight: boolean | undefined = false;
  interactive: boolean | undefined = false;
  loading: boolean | undefined = false;
  padded: boolean | undefined = true;
  variant: SpectreCardVariant | undefined = 'elevated';

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
    return this.querySelector('[data-sp-card-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const el = node as Element;
    return el.hasAttribute('data-sp-card-native');
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false;
    }
    if (changedProperties.has('fullHeight') && this.fullHeight == null) {
      this.fullHeight = false;
    }
    if (changedProperties.has('interactive') && this.interactive == null) {
      this.interactive = false;
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false;
    }
    if (changedProperties.has('padded') && this.padded == null) {
      this.padded = true;
    }
    if (changedProperties.has('variant') && (this.variant == null || !isCardVariant(this.variant))) {
      this.variant = 'elevated';
    }
  }

  private get cardClasses(): string {
    return getCardClasses({
      disabled: this.isDisabled,
      fullHeight: this.fullHeight ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      padded: this.padded ?? true,
      variant: this.variant as CardVariant,
    });
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false);
  }

  private get hasForwardedLabel(): boolean {
    return Boolean(this.forwardedAriaLabel || this.forwardedAriaLabelledBy);
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.cardClasses}"
      data-sp-card-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`;
  }
}

export function defineSpectreCard(tagName = 'sp-card'): typeof SpectreCardElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreCardElement;
  }

  customElements.define(tagName, SpectreCardElement);
  return SpectreCardElement;
}
