import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { hasMeaningfulContent } from '../../utils/dom';

export interface SpectreRadioProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  autofocus?: boolean;
  checked?: boolean;
  disabled?: boolean;
  form?: string;
  invalid?: boolean;
  loading?: boolean;
  label?: string;
  name?: string;
  required?: boolean;
  success?: boolean;
  title?: string;
  value?: string;
}

export class SpectreRadioElement extends LitElement implements SpectreRadioProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autofocus: { type: Boolean, reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    name: { type: String },
    required: { type: Boolean, reflect: true },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  autofocus = false;
  checked = false;
  disabled = false;
  form?: string;
  invalid = false;
  loading = false;
  label = '';
  name?: string;
  required = false;
  success = false;
  override title = '';
  value = 'on';
  private _id?: string;
  private projectedContent: Node[] = [];
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
    if (changedProperties.has('value') && this.value == null) {
      this.value = 'on';
    }
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>): void {
    this.stopContentObserver();
    super.update(changedProperties);
    this.startContentObserver();
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-radio-native]');
  }

  private get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private get hasProjectedContent(): boolean {
    return hasMeaningfulContent(this.projectedContent);
  }

  private get forwardedAriaLabel(): string | undefined {
    const value = this.ariaLabel?.trim();
    return value ? value : undefined;
  }

  private get forwardedAriaLabelledBy(): string | undefined {
    const value = this.ariaLabelledBy?.trim();
    return value ? value : undefined;
  }

  private get forwardedAriaDescribedBy(): string | undefined {
    const value = this.ariaDescribedBy?.trim();
    return value ? value : undefined;
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return;
    }

    this.contentObserver = new MutationObserver((mutations) => {
      const isInternalMovement = mutations.every((mutation) => {
        return (
          Array.from(mutation.removedNodes).every(
            (node) => this.isInternalRadioNode(node) || this.contains(node),
          ) &&
          Array.from(mutation.addedNodes).every((node) => this.isInternalRadioNode(node))
        );
      });

      if (isInternalMovement) {
        return;
      }

      if (this.syncProjectedContent()) {
        this.requestUpdate();
      }
    });

    this.contentObserver.observe(this, { childList: true });
  }

  private stopContentObserver(): void {
    this.contentObserver?.disconnect();
    this.contentObserver = undefined;
  }

  private syncProjectedContent(): boolean {
    const nextProjectedContent: Node[] = [];

    Array.from(this.childNodes).forEach((node) => {
      if (!this.isInternalRadioNode(node)) {
        nextProjectedContent.push(node);
      }
    });

    const hasChanged =
      nextProjectedContent.length !== this.projectedContent.length ||
      nextProjectedContent.some(
        (node, index) => node !== this.projectedContent[index],
      );

    if (hasChanged) {
      this.projectedContent = nextProjectedContent;
    }

    return hasChanged;
  }

  private isInternalRadioNode(node: Node): boolean {
    return (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).hasAttribute('data-sp-radio-label')
    );
  }

  private handleInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  private handleChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    this.checked = input.checked;
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options);
  }

  override blur(): void {
    this.nativeInput?.blur();
  }

  override render() {
    const labelContent = this.hasProjectedContent
      ? this.projectedContent
      : this.label
        ? html`<span class='sp-label'>${this.label}</span>`
        : nothing;

    return html`
      <label data-sp-radio-label>
        <input
          aria-busy=${this.loading ? 'true' : 'false'}
          aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
          aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
          aria-label=${ifDefined(this.forwardedAriaLabel)}
          aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
          ?autofocus=${this.autofocus}
          data-sp-radio-native
          .checked=${live(this.checked)}
          ?disabled=${this.isDisabled}
          form=${ifDefined(this.form)}
          id=${ifDefined(this.id || undefined)}
          name=${ifDefined(this.name)}
          ?required=${this.required}
          title=${ifDefined(this.title || undefined)}
          type='radio'
          value=${ifDefined(this.value || undefined)}
          @change=${this.handleChange}
          @input=${this.handleInput}
        />
        ${labelContent}
      </label>
    `;
  }
}

export function defineSpectreRadio(tagName = 'sp-radio'): typeof SpectreRadioElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreRadioElement;
  }

  customElements.define(tagName, SpectreRadioElement);
  return SpectreRadioElement;
}
