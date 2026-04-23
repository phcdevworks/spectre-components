import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { hasMeaningfulContent } from '../../utils/dom';

export interface SpectreLabelProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  htmlFor?: string;
  title?: string;
}

export class SpectreLabelElement extends LitElement implements SpectreLabelProps {
  static properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    htmlFor: { attribute: 'for', type: String },
    title: { type: String, reflect: true },
  };

  ariaLabel: string | null = null;
  ariaLabelledBy: string | null = null;
  ariaDescribedBy: string | null = null;
  htmlFor?: string;
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

  private get nativeLabel(): HTMLLabelElement | null {
    return this.querySelector('[data-sp-label-native]');
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
            (node) => this.isInternalLabelNode(node) || this.contains(node),
          ) &&
          Array.from(mutation.addedNodes).every((node) => this.isInternalLabelNode(node))
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
      ...(this.nativeLabel?.childNodes ?? []),
    ];

    sourceNodes.forEach((node) => {
      if (!this.isInternalLabelNode(node) && !nextProjectedContent.includes(node)) {
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

  private isInternalLabelNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return el.hasAttribute('data-sp-label-native');
  }

  override focus(options?: FocusOptions): void {
    this.nativeLabel?.focus(options);
  }

  override blur(): void {
    this.nativeLabel?.blur();
  }

  private get hasProjectedContent(): boolean {
    return hasMeaningfulContent(this.projectedContent);
  }

  override render() {
    return html`
      <label
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        class='sp-label'
        data-sp-label-native
        for=${ifDefined(this.htmlFor)}
        id=${ifDefined(this.id || undefined)}
        tabindex='-1'
        title=${ifDefined(this.title || undefined)}
      >
        ${this.hasProjectedContent ? this.projectedContent : nothing}
      </label>
    `;
  }
}

export function defineSpectreLabel(tagName = 'sp-label'): typeof SpectreLabelElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreLabelElement;
  }

  customElements.define(tagName, SpectreLabelElement);
  return SpectreLabelElement;
}
