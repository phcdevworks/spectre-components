import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  getInputClasses,
  type InputSize,
} from '@phcdevworks/spectre-ui';

export const spectreSelectSizes = ['sm', 'md', 'lg'] as const;

export type SpectreSelectSize = (typeof spectreSelectSizes)[number];

export interface SpectreSelectProps {
  autofocus?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  invalid?: boolean;
  loading?: boolean;
  name?: string;
  required?: boolean;
  size?: SpectreSelectSize;
  success?: boolean;
  title?: string;
  value?: string;
}

function isSelectSize(value: string): value is InputSize {
  return (spectreSelectSizes as readonly string[]).includes(value);
}

function isSelectableContent(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = (node as Element).tagName;
    return tagName === 'OPTION' || tagName === 'OPTGROUP';
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent?.trim().length ?? 0) > 0;
  }

  return false;
}

export class SpectreSelectElement extends LitElement implements SpectreSelectProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    name: { type: String },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  autofocus = false;
  disabled = false;
  fullWidth = false;
  invalid = false;
  loading = false;
  name?: string;
  required = false;
  size: SpectreSelectSize = 'md';
  success = false;
  override title = '';
  value = '';
  private _id?: string;
  private projectedOptions: Node[] = [];
  private contentObserver?: MutationObserver | undefined;

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

  createRenderRoot(): this {
    // Spectre components intentionally render in light DOM so the global
    // Spectre UI styling contract can apply directly.
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const hostId = super.getAttribute('id');

    if (hostId !== null) {
      this.id = hostId;
    }

    this.syncProjectedOptions();
    this.startContentObserver();
  }

  override disconnectedCallback(): void {
    this.stopContentObserver();
    super.disconnectedCallback();
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

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('size') && !isSelectSize(this.size)) {
      this.size = 'md';
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = '';
    }
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>): void {
    this.stopContentObserver();
    super.update(changedProperties);
    this.startContentObserver();
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {    super.updated(changedProperties);    const nativeSelect = this.nativeSelect;    if (!nativeSelect) {      return;    }    if (this.value !== "" && nativeSelect.value !== this.value) {      nativeSelect.value = this.value;      return;    }    if (      this.value === "" &&      !this.hasAttribute("value")    ) {      const nativeValue = nativeSelect.value ?? "";      if (nativeValue !== "") {        this.value = nativeValue;      }    }  }

  private get selectClasses(): string {
    return getInputClasses({
      fullWidth: this.fullWidth,
      size: this.size,
      state: this.isDisabled
        ? this.disabled
          ? 'disabled'
          : 'loading'
        : this.invalid
          ? 'error'
          : this.success
            ? 'success'
            : 'default',
    });
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private get nativeSelect(): HTMLSelectElement | null {
    return this.querySelector('[data-sp-select-native]');
  }

  private get forwardedAriaLabel(): string | undefined {
    const ariaLabel = this.ariaLabel?.trim();
    return ariaLabel ? ariaLabel : undefined;
  }

  private get forwardedAriaLabelledBy(): string | undefined {
    const ariaLabelledBy = this.ariaLabelledBy?.trim();
    return ariaLabelledBy ? ariaLabelledBy : undefined;
  }

  private get forwardedAriaDescribedBy(): string | undefined {
    const ariaDescribedBy = this.ariaDescribedBy?.trim();
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
            (node) => this.isInternalSelectNode(node) || this.contains(node),
          ) &&
          Array.from(mutation.addedNodes).every((node) => this.isInternalSelectNode(node))
        );
      });

      if (isInternalMovement) {
        return;
      }

      if (this.syncProjectedOptions()) {
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

  private syncProjectedOptions(): boolean {
    const nextProjectedOptions: Node[] = [];

    Array.from(this.childNodes).forEach((node) => {
      if (this.isInternalSelectNode(node)) {
        this.projectedOptions.forEach((projectedNode) => {
          if (projectedNode.parentNode !== this && this.contains(projectedNode)) {
            nextProjectedOptions.push(projectedNode);
          }
        });
        return;
      }

      if (isSelectableContent(node)) {
        nextProjectedOptions.push(node);
      }
    });

    const hasChanged =
      nextProjectedOptions.length !== this.projectedOptions.length ||
      nextProjectedOptions.some((node, index) => node !== this.projectedOptions[index]);

    if (hasChanged) {
      this.projectedOptions = nextProjectedOptions;
    }

    return hasChanged;
  }

  private isInternalSelectNode(node: Node): boolean {
    return (
      node.nodeType === Node.ELEMENT_NODE && (node as Element).hasAttribute('data-sp-select-native')
    );
  }

  private handleInput(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;
    this.value = select.value;
  }

  private handleChange(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;
    this.value = select.value;
  }

  override focus(options?: FocusOptions): void {
    this.nativeSelect?.focus(options);
  }

  override blur(): void {
    this.nativeSelect?.blur();
  }


  override render() {
    return html`
      <select
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        ?autofocus=${this.autofocus}
        class=${this.selectClasses}
        data-sp-select-native
        ?disabled=${this.isDisabled}
        id=${ifDefined(this.id || undefined)}
        name=${ifDefined(this.name)}
        ?required=${this.required}
        title=${ifDefined(this.title || undefined)}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      >
        ${this.projectedOptions.length > 0 ? this.projectedOptions : nothing}
      </select>
    `;
  }
}

export function defineSpectreSelect(tagName = 'sp-select'): typeof SpectreSelectElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSelectElement;
  }

  customElements.define(tagName, SpectreSelectElement);
  return SpectreSelectElement;
}
