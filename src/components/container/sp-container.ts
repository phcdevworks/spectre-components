import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import {
  isContainerMaxWidth,
  type SpectreContainerMaxWidth,
} from '../../utils/form';

import { getContainerClasses, type ContainerMaxWidth } from '@phcdevworks/spectre-ui';

export interface SpectreContainerProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  id?: string | null | undefined;
  maxWidth?: SpectreContainerMaxWidth | undefined;
  title?: string | null | undefined;
}

export class SpectreContainerElement
  extends SpectreProjectableElement
  implements SpectreContainerProps
{
  static properties = {
    maxWidth: { attribute: 'max-width', type: String, reflect: true },
  };

  maxWidth: SpectreContainerMaxWidth | undefined = undefined;

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
    return this.querySelector('[data-sp-container-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const el = node as Element;
    return el.hasAttribute('data-sp-container-native');
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      changedProperties.has('maxWidth') &&
      this.maxWidth != null &&
      !isContainerMaxWidth(this.maxWidth)
    ) {
      this.maxWidth = undefined;
    }
  }

  private get containerClasses(): string {
    return getContainerClasses(
      this.maxWidth != null
        ? { maxWidth: this.maxWidth as ContainerMaxWidth }
        : {}
    );
  }

  override render() {
    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.containerClasses}"
      data-sp-container-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`;
  }
}

export function defineSpectreContainer(
  tagName = 'sp-container'
): typeof SpectreContainerElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreContainerElement;
  }

  customElements.define(tagName, SpectreContainerElement);
  return SpectreContainerElement;
}
