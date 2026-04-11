import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface SpectreLabelProps {
  htmlFor?: string;
}

export class SpectreLabelElement extends LitElement implements SpectreLabelProps {
  static properties = {
    htmlFor: { attribute: 'for', type: String },
  };

  htmlFor?: string;
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

    Array.from(this.childNodes).forEach((node) => {
      if (this.isInternalLabelNode(node)) {
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

  private isInternalLabelNode(node: Node): boolean {
    return node === this.nativeLabel;
  }

  override focus(options?: FocusOptions): void {
    this.nativeLabel?.focus(options);
  }

  override blur(): void {
    this.nativeLabel?.blur();
  }

  override render() {
    return html`
      <label
        class='sp-label'
        data-sp-label-native
        for=${ifDefined(this.htmlFor)}
        id=${ifDefined(this.id || undefined)}
        tabindex='-1'
      >
        ${this.projectedContent.length > 0 ? this.projectedContent : nothing}
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
