import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'

import { getFooterChipClasses } from '@phcdevworks/spectre-ui'

export interface SpectreFooterChipProps {
  ariaLabel?: string | null
  disabled?: boolean | undefined
  id?: string | null | undefined
  title?: string | null | undefined
}

export class SpectreFooterChipElement
  extends SpectreProjectableElement
  implements SpectreFooterChipProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true }
  }

  disabled: boolean | undefined = false

  override get id(): string {
    return super.id
  }

  override set id(value: string | null | undefined) {
    super.id = value
  }

  override get title(): string {
    return super.title
  }

  override set title(value: string | null | undefined) {
    super.title = value
  }

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-footer-chip-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-footer-chip-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
  }

  private get footerChipClasses(): string {
    return getFooterChipClasses({ disabled: this.disabled ?? false })
  }

  override render() {
    return html`<span
      aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.footerChipClasses}"
      data-sp-footer-chip-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </span>`
  }
}

export function defineSpectreFooterChip(
  tagName = 'sp-footer-chip'
): typeof SpectreFooterChipElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFooterChipElement
  }

  customElements.define(tagName, SpectreFooterChipElement)
  return SpectreFooterChipElement
}
