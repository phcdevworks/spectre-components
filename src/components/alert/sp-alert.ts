import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import {
  isAlertVariant,
  isInputSize,
  type SpectreAlertVariant,
  type SpectreInputSize,
} from '../../utils/form';

import { getAlertClasses, type AlertVariant, type AlertSize } from '@phcdevworks/spectre-ui';

export interface SpectreAlertProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  dismissed?: boolean | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  id?: string | null | undefined;
  loading?: boolean | undefined;
  size?: SpectreInputSize | undefined;
  title?: string | null | undefined;
  variant?: SpectreAlertVariant | undefined;
}

export class SpectreAlertElement extends SpectreProjectableElement implements SpectreAlertProps {
  static properties = {
    dismissed: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  dismissed: boolean | undefined = false;
  disabled: boolean | undefined = false;
  fullWidth: boolean | undefined = false;
  loading: boolean | undefined = false;
  size: SpectreInputSize | undefined = 'md';
  variant: SpectreAlertVariant | undefined = 'info';

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
    return this.querySelector('[data-sp-alert-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const el = node as Element;
    return el.hasAttribute('data-sp-alert-native');
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('dismissed') && this.dismissed == null) {
      this.dismissed = false;
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false;
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false;
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false;
    }
    if (changedProperties.has('variant') && (this.variant == null || !isAlertVariant(this.variant))) {
      this.variant = 'info';
    }
    if (changedProperties.has('size') && (this.size == null || !isInputSize(this.size))) {
      this.size = 'md';
    }
  }

  private get alertClasses(): string {
    return getAlertClasses({
      disabled: this.isDisabled,
      dismissed: this.dismissed ?? false,
      fullWidth: this.fullWidth ?? false,
      loading: this.loading ?? false,
      size: this.size as AlertSize,
      variant: this.variant as AlertVariant,
    });
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false);
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.alertClasses}"
      data-sp-alert-native
      id="${ifDefined(this.id || undefined)}"
      role="alert"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`;
  }
}

export function defineSpectreAlert(tagName = 'sp-alert'): typeof SpectreAlertElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreAlertElement;
  }

  customElements.define(tagName, SpectreAlertElement);
  return SpectreAlertElement;
}
