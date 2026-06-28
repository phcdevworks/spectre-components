import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isInputSize,
  isTagVariant,
  type SpectreInputSize,
  type SpectreTagVariant
} from '../../utils/form'

import {
  getTagClasses,
  type TagVariant,
  type TagSize
} from '@phcdevworks/spectre-ui'

export interface SpectreTagProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  dismissible?: boolean | undefined
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  selected?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  variant?: SpectreTagVariant | undefined
}

export class SpectreTagElement
  extends SpectreProjectableElement
  implements SpectreTagProps
{
  static properties = {
    dismissible: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  dismissible: boolean | undefined = false
  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  interactive: boolean | undefined = false
  loading: boolean | undefined = false
  selected: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  variant: SpectreTagVariant | undefined = 'default'

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
    return this.querySelector('[data-sp-tag-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-tag-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('dismissible') && this.dismissible == null) {
      this.dismissible = false
    }
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
    if (changedProperties.has('selected') && this.selected == null) {
      this.selected = false
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isTagVariant(this.variant))
    ) {
      this.variant = 'default'
    }
  }

  private get tagClasses(): string {
    return getTagClasses({
      disabled: this.isDisabled,
      dismissible: this.dismissible ?? false,
      fullWidth: this.fullWidth ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      selected: this.selected ?? false,
      size: this.size as TagSize,
      variant: this.variant as TagVariant
    })
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false)
  }

  private get hasForwardedLabel(): boolean {
    return Boolean(this.forwardedAriaLabel || this.forwardedAriaLabelledBy)
  }

  override render() {
    return html`<span
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.tagClasses}"
      data-sp-tag-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.hasForwardedLabel ? 'group' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </span>`
  }
}

export function defineSpectreTag(tagName = 'sp-tag'): typeof SpectreTagElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTagElement
  }

  customElements.define(tagName, SpectreTagElement)
  return SpectreTagElement
}
