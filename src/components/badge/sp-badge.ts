import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isAccentColor,
  isAccentEdge,
  isBadgeVariant,
  isInputSize,
  sanitizeUtilityClasses,
  type SpectreAccentColor,
  type SpectreAccentEdge,
  type SpectreBadgeVariant,
  type SpectreInputSize
} from '../../utils/form'

import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getBadgeClasses,
  type BadgeAccentRailColor,
  type BadgeAccentRailEdge,
  type BadgeVariant,
  type BadgeSize
} from '@phcdevworks/spectre-ui'

export interface SpectreBadgeProps extends SpectreInteractionStateProps {
  dot?: boolean | undefined
  interactive?: boolean | undefined
  accentRail?: SpectreAccentEdge | undefined
  accentRailColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
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
    dot: { type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    ...interactionStateProperties,
    accentRail: { attribute: 'accent-rail', type: String, reflect: true },
    accentRailColor: {
      attribute: 'accent-rail-color',
      type: String,
      reflect: true
    },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    loading: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  dot: boolean | undefined = false

  interactive: boolean | undefined = false

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  accentRail: SpectreAccentEdge | undefined = undefined
  accentRailColor: SpectreAccentColor | undefined = undefined
  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  innerClass: string | undefined = undefined
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
    if (
      changedProperties.has('accentRail') &&
      this.accentRail != null &&
      !isAccentEdge(this.accentRail)
    ) {
      this.accentRail = undefined
    }
    if (
      changedProperties.has('accentRailColor') &&
      this.accentRailColor != null &&
      !isAccentColor(this.accentRailColor)
    ) {
      this.accentRailColor = undefined
    }
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
    const recipeClasses = getBadgeClasses({
      dot: this.dot ?? false,
      interactive: this.interactive ?? false,
      ...interactionStates(this),
      ...(this.accentRail !== undefined && {
        accentRail: this.accentRail as BadgeAccentRailEdge
      }),
      ...(this.accentRailColor !== undefined && {
        accentRailColor: this.accentRailColor as BadgeAccentRailColor
      }),
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      loading: this.loading ?? false,
      size: this.size as BadgeSize,
      variant: this.variant as BadgeVariant
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
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
