import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

export interface SpectreLabelProps {
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  htmlFor?: string | undefined;
  title?: string | undefined;
}

export class SpectreLabelElement extends SpectreProjectableElement implements SpectreLabelProps {
  static properties = {
    htmlFor: { attribute: 'for', type: String, reflect: true },
  };

  htmlFor?: string | undefined;

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-label-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const el = node as Element;
    return el.hasAttribute('data-sp-label-native');
  }

  override focus(options?: FocusOptions): void {
    (this.getContentContainer() as HTMLLabelElement | null)?.focus(options);
  }

  override blur(): void {
    (this.getContentContainer() as HTMLLabelElement | null)?.blur();
  }

  override render() {
    return html`<label
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="sp-label"
      data-sp-label-native
      for="${ifDefined(this.htmlFor)}"
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </label>`;
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
