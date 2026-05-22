import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SpectreProjectableElement } from '../../utils/projectable';

import { getInputLabelClasses } from '@phcdevworks/spectre-ui';

export interface SpectreLabelProps {
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  ariaDescribedBy?: string | null;
  disabled?: boolean | undefined;
  id?: string | null | undefined;
  htmlFor?: string | undefined;
  title?: string | null | undefined;
}

export class SpectreLabelElement extends SpectreProjectableElement implements SpectreLabelProps {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    htmlFor: { attribute: 'for', type: String, reflect: true },
  };

  disabled = false;
  htmlFor: string | undefined;

  private get isDisabled(): boolean {
    return this.disabled ?? false;
  }

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
      class="${getInputLabelClasses({ disabled: this.isDisabled })}"
      data-sp-label-native
      for="${ifDefined(this.htmlFor || undefined)}"
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
