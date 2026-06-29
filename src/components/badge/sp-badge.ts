import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isBadgeVariant,
  isInputSize,
  type SpectreBadgeVariant,
  type SpectreInputSize
} from '../../utils/form'

import {
  getBadgeClasses,
  type BadgeVariant,
  type BadgeSize
} from '@phcdevworks/spectre-ui'

export interface SpectreBadgeProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  loading?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  variant?: SpectreBadgeVariant | undefined
}

export class SpectreBadgeElement
  extends SpectreProjectableElement
  implements SpectreBadgeProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  loading: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  variant: SpectreBadgeVariant | undefined = 'primary'

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
    return this.querySelector('[data-sp-badge-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-badge-native')
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
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isBadgeVariant(this.variant))
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

  private get badgeClasses(): string {
    return getBadgeClasses({
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      loading: this.loading ?? false,
      size: this.size as BadgeSize,
      variant: this.variant as BadgeVariant
    })
  }

  override render() {
    return html`<span
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.badgeClasses}"
      data-sp-badge-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </span>`
  }
}

export function defineSpectreBadge(
  tagName = 'sp-badge'
): typeof SpectreBadgeElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreBadgeElement
  }

  customElements.define(tagName, SpectreBadgeElement)
  return SpectreBadgeElement
}
