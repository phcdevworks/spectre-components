import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isAvatarShape,
  isAvatarSize,
  type SpectreAvatarShape,
  type SpectreAvatarSize
} from '../../utils/form'

import {
  getAvatarClasses,
  type AvatarShape,
  type AvatarSize
} from '@phcdevworks/spectre-ui'

export interface SpectreAvatarProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  loading?: boolean | undefined
  placeholder?: boolean | undefined
  shape?: SpectreAvatarShape | undefined
  size?: SpectreAvatarSize | undefined
  title?: string | null | undefined
}

export class SpectreAvatarElement
  extends SpectreProjectableElement
  implements SpectreAvatarProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    interactive: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    placeholder: { type: Boolean, reflect: true },
    shape: { type: String, reflect: true },
    size: { type: String, reflect: true }
  }

  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  interactive: boolean | undefined = false
  loading: boolean | undefined = false
  placeholder: boolean | undefined = false
  shape: SpectreAvatarShape | undefined = 'circle'
  size: SpectreAvatarSize | undefined = 'md'

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
    return this.querySelector('[data-sp-avatar-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-avatar-native')
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
    if (changedProperties.has('placeholder') && this.placeholder == null) {
      this.placeholder = false
    }
    if (
      changedProperties.has('shape') &&
      (this.shape == null || !isAvatarShape(this.shape))
    ) {
      this.shape = 'circle'
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isAvatarSize(this.size))
    ) {
      this.size = 'md'
    }
  }

  private get avatarClasses(): string {
    return getAvatarClasses({
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      interactive: this.interactive ?? false,
      loading: this.loading ?? false,
      placeholder: this.placeholder ?? false,
      shape: this.shape as AvatarShape,
      size: this.size as AvatarSize
    })
  }

  private get isDisabled(): boolean {
    return (this.disabled ?? false) || (this.loading ?? false)
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.avatarClasses}"
      data-sp-avatar-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`
  }
}

export function defineSpectreAvatar(
  tagName = 'sp-avatar'
): typeof SpectreAvatarElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreAvatarElement
  }

  customElements.define(tagName, SpectreAvatarElement)
  return SpectreAvatarElement
}
