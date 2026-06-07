import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreBaseElement } from '../../utils/base';
import { isInputSize, normalizeInt, type SpectreInputSize } from '../../utils/form';

import {
  getRatingClasses,
  getRatingStarsClasses,
  getRatingStarClasses,
  getRatingTextClasses,
  type RatingSize,
} from '@phcdevworks/spectre-ui';

export interface SpectreRatingProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  disabled?: boolean | undefined;
  id?: string | null | undefined;
  label?: string | undefined;
  loading?: boolean | undefined;
  max?: number | undefined;
  size?: SpectreInputSize | undefined;
  title?: string | null | undefined;
  value?: number | undefined;
}

export class SpectreRatingElement extends SpectreBaseElement implements SpectreRatingProps {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    max: { type: Number, reflect: true },
    size: { type: String, reflect: true },
    value: { type: Number, reflect: true },
  };

  disabled: boolean | undefined = false;
  label: string | undefined;
  loading: boolean | undefined = false;
  max: number | undefined = 5;
  size: SpectreInputSize | undefined = 'md';
  value: number | undefined = 0;

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

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false;
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false;
    }
    if (changedProperties.has('size') && (this.size == null || !isInputSize(this.size))) {
      this.size = 'md';
    }
    if (changedProperties.has('max')) {
      this.max = normalizeInt(this.max, 5, 1) ?? 5;
    }
    if (changedProperties.has('value')) {
      const safeMax = this.max ?? 5;
      const normalized = normalizeInt(this.value, 0, 0);
      this.value = normalized == null ? 0 : Math.min(normalized, safeMax);
    }
  }

  private get ratingClasses(): string {
    return getRatingClasses({
      disabled: this.disabled ?? false,
      loading: this.loading ?? false,
      size: this.size as RatingSize,
    });
  }

  private get effectiveMax(): number {
    return this.max ?? 5;
  }

  private get effectiveValue(): number {
    return this.value ?? 0;
  }

  private get computedAriaLabel(): string {
    const base = this.forwardedAriaLabel;
    if (base) return base;
    return `Rating: ${this.effectiveValue} out of ${this.effectiveMax}`;
  }

  private renderStars() {
    const stars = [];
    for (let i = 1; i <= this.effectiveMax; i++) {
      stars.push(html`<span class="${getRatingStarClasses(i <= this.effectiveValue)}"></span>`);
    }
    return stars;
  }

  override render() {
    const trimmedLabel = this.label?.trim();

    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${this.computedAriaLabel}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.ratingClasses}"
      data-sp-rating-native
      id="${ifDefined(this.id || undefined)}"
      role="img"
      title="${ifDefined(this.title || undefined)}"
    >
      <div class="${getRatingStarsClasses()}">${this.renderStars()}</div>
      ${trimmedLabel
        ? html`<span class="${getRatingTextClasses({ disabled: this.disabled ?? false })}">${trimmedLabel}</span>`
        : nothing}
    </div>`;
  }
}

export function defineSpectreRating(tagName = 'sp-rating'): typeof SpectreRatingElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreRatingElement;
  }

  customElements.define(tagName, SpectreRatingElement);
  return SpectreRatingElement;
}
