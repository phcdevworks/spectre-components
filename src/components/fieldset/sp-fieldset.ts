import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface SpectreFieldsetProps {
  disabled?: boolean;
  legend?: string;
}

export class SpectreFieldsetElement extends LitElement implements SpectreFieldsetProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    disabled: { type: Boolean, reflect: true },
    legend: { type: String, reflect: true },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  disabled = false;
  legend = '';
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

  protected override update(changedProperties: Map<PropertyKey, unknown>): void {
    this.stopContentObserver();
    super.update(changedProperties);
    this.startContentObserver();
  }

  private get nativeFieldset(): HTMLFieldSetElement | null {
    return this.querySelector('[data-sp-fieldset-native]');
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
            (node) => this.isInternalFieldsetNode(node) || this.contains(node),
          ) &&
          Array.from(mutation.addedNodes).every((node) => this.isInternalFieldsetNode(node))
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
      if (this.isInternalFieldsetNode(node)) {
        this.projectedContent.forEach((projectedNode) => {
          if (projectedNode.parentNode !== this && this.contains(projectedNode)) {
            nextProjectedContent.push(projectedNode);
          }
        });
        return;
      }

      nextProjectedContent.push(node);
    });

    if (
      nextProjectedContent.length === this.projectedContent.length &&
      nextProjectedContent.every((node, index) => node === this.projectedContent[index])
    ) {
      return false;
    }

    this.projectedContent = nextProjectedContent;
    return true;
  }

  private isInternalFieldsetNode(node: Node): boolean {
    return node === this.nativeFieldset;
  }

  override focus(options?: FocusOptions): void {
    this.nativeFieldset?.focus(options);
  }

  override blur(): void {
    this.nativeFieldset?.blur();
  }

  override render() {
    return html`
      <fieldset
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        data-sp-fieldset-native
        ?disabled=${this.disabled}
        id=${ifDefined(this.id || undefined)}
      >
        ${this.legend ? html`<legend class='sp-label'>${this.legend}</legend>` : nothing}
        ${this.projectedContent.length > 0 ? this.projectedContent : nothing}
      </fieldset>
    `;
  }
}

export function defineSpectreFieldset(tagName = 'sp-fieldset'): typeof SpectreFieldsetElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFieldsetElement;
  }

  customElements.define(tagName, SpectreFieldsetElement);
  return SpectreFieldsetElement;
}
