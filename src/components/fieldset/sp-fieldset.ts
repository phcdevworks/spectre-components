import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { hasMeaningfulContent } from '../../utils/dom';

export interface SpectreFieldsetProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  disabled?: boolean;
  form?: string;
  legend?: string;
  title?: string;
}

export class SpectreFieldsetElement extends LitElement implements SpectreFieldsetProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    legend: { type: String, reflect: true },
    title: { type: String, reflect: true },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  disabled = false;
  form?: string;
  legend = '';
  override title = '';
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
    const sourceNodes = [
      ...this.childNodes,
      ...(this.nativeFieldset?.childNodes ?? []),
    ];

    sourceNodes.forEach((node) => {
      if (!this.isInternalFieldsetNode(node) && !nextProjectedContent.includes(node)) {
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

  private isInternalFieldsetNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return (
      el.hasAttribute('data-sp-fieldset-native') ||
      el.hasAttribute('data-sp-fieldset-legend')
    );
  }

  override focus(options?: FocusOptions): void {
    this.nativeFieldset?.focus(options);
  }

  override blur(): void {
    this.nativeFieldset?.blur();
  }

  private get hasProjectedContent(): boolean {
    return hasMeaningfulContent(this.projectedContent);
  }

  override render() {
    return html`
      <fieldset
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        data-sp-fieldset-native
        ?disabled=${this.disabled}
        form=${ifDefined(this.form)}
        id=${ifDefined(this.id || undefined)}
        title=${ifDefined(this.title || undefined)}
      >
        ${this.legend
          ? html`<legend class='sp-label' data-sp-fieldset-legend>${this.legend}</legend>`
          : nothing}
        ${this.hasProjectedContent ? this.projectedContent : nothing}
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
