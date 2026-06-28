import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';
import {
  isStackAlign,
  isStackBasis,
  isStackDirection,
  type SpectreStackAlign,
  type SpectreStackBasis,
  type SpectreStackDirection,
} from '../../utils/form';

import {
  getStackClasses,
  type StackAlign,
  type StackBasis,
  type StackDirection,
} from '@phcdevworks/spectre-ui';

export interface SpectreStackProps {
  align?: SpectreStackAlign | undefined;
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  basis?: SpectreStackBasis | undefined;
  direction?: SpectreStackDirection | undefined;
  id?: string | null | undefined;
  title?: string | null | undefined;
}

export class SpectreStackElement
  extends SpectreProjectableElement
  implements SpectreStackProps
{
  static properties = {
    align: { type: String, reflect: true },
    basis: { type: String, reflect: true },
    direction: { type: String, reflect: true },
  };

  align: SpectreStackAlign | undefined = 'center';
  basis: SpectreStackBasis | undefined = undefined;
  direction: SpectreStackDirection | undefined = 'vertical';

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
    return this.querySelector('[data-sp-stack-native]');
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const el = node as Element;
    return el.hasAttribute('data-sp-stack-native');
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      changedProperties.has('direction') &&
      (this.direction == null || !isStackDirection(this.direction))
    ) {
      this.direction = 'vertical';
    }
    if (
      changedProperties.has('basis') &&
      this.basis != null &&
      !isStackBasis(this.basis)
    ) {
      this.basis = undefined;
    }
    if (
      changedProperties.has('align') &&
      (this.align == null || !isStackAlign(this.align))
    ) {
      this.align = 'center';
    }
  }

  private get stackClasses(): string {
    return getStackClasses({
      align: this.align as StackAlign,
      direction: this.direction as StackDirection,
      ...(this.basis != null ? { basis: this.basis as StackBasis } : {}),
    });
  }

  override render() {
    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.stackClasses}"
      data-sp-stack-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`;
  }
}

export function defineSpectreStack(tagName = 'sp-stack'): typeof SpectreStackElement {
  const existingElement = customElements.get(tagName);

  if (existingElement) {
    return existingElement as unknown as typeof SpectreStackElement;
  }

  customElements.define(tagName, SpectreStackElement);
  return SpectreStackElement;
}
