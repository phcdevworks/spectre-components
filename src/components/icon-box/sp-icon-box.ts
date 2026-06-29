import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isIconBoxVariant,
  isInputSize,
  type SpectreIconBoxVariant,
  type SpectreInputSize
} from '../../utils/form'

import {
  getIconBoxClasses,
  type IconBoxVariant,
  type IconBoxSize
} from '@phcdevworks/spectre-ui'

export interface SpectreIconBoxProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  pill?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  variant?: SpectreIconBoxVariant | undefined
}

export class SpectreIconBoxElement
  extends SpectreProjectableElement
  implements SpectreIconBoxProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    pill: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  interactive: boolean | undefined = false
  loading: boolean | undefined = false
  pill: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  variant: SpectreIconBoxVariant | undefined = 'primary'

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
    return this.querySelector('[data-sp-icon-box-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-icon-box-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('interactive') && this.interactive == null) {
      this.interactive = false
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false
    }
    if (changedProperties.has('pill') && this.pill == null) {
      this.pill = false
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isIconBoxVariant(this.variant))
    ) {
      this.variant = 'primary'
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
  }

  private get iconBoxClasses(): string {
    return getIconBoxClasses({
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      pill: this.pill ?? false,
      size: this.size as IconBoxSize,
      variant: this.variant as IconBoxVariant
    })
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.iconBoxClasses}"
      data-sp-icon-box-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`
  }
}

export function defineSpectreIconBox(
  tagName = 'sp-icon-box'
): typeof SpectreIconBoxElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreIconBoxElement
  }

  customElements.define(tagName, SpectreIconBoxElement)
  return SpectreIconBoxElement
}
