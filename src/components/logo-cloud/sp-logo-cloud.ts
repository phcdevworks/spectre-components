import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { childElements } from '../../utils/parts'
import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isLogoCloudFill,
  isLogoCloudSize,
  sanitizeUtilityClasses,
  type SpectreLogoCloudFill,
  type SpectreLogoCloudSize
} from '../../utils/form'

import {
  getLogoCloudClasses,
  getLogoCloudItemClasses,
  type LogoCloudFill,
  type LogoCloudSize
} from '@phcdevworks/spectre-ui'

export interface SpectreLogoCloudProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  fill?: SpectreLogoCloudFill | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  muted?: boolean | undefined
  size?: SpectreLogoCloudSize | undefined
  title?: string | null | undefined
}

export class SpectreLogoCloudElement
  extends SpectreProjectableElement
  implements SpectreLogoCloudProps
{
  static properties = {
    fill: { type: String, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    muted: { type: Boolean, reflect: true },
    size: { type: String, reflect: true }
  }

  fill: SpectreLogoCloudFill | undefined = 'subtle'
  innerClass: string | undefined = undefined
  muted: boolean | undefined = false
  size: SpectreLogoCloudSize | undefined = 'md'

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

  override connectedCallback(): void {
    super.connectedCallback()
    this.style.display ||= 'block'
  }

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-logo-cloud-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-logo-cloud-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('size') &&
      (this.size == null || !isLogoCloudSize(this.size))
    ) {
      this.size = 'md'
    }
    if (
      changedProperties.has('fill') &&
      (this.fill == null || !isLogoCloudFill(this.fill))
    ) {
      this.fill = 'subtle'
    }
    if (changedProperties.has('muted') && this.muted == null) {
      this.muted = false
    }
  }

  private get logoCloudClasses(): string {
    const recipeClasses = getLogoCloudClasses({
      fill: this.fill as LogoCloudFill,
      muted: this.muted ?? false,
      size: this.size as LogoCloudSize
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
  }

  // Each direct child is one tile; the recipe sizes the mark inside it.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const itemClasses = getLogoCloudItemClasses().split(/\s+/).filter(Boolean)
    for (const item of childElements(this.projectedContent)) {
      item.classList.add(...itemClasses)
    }
  }

  override render() {
    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.logoCloudClasses}"
      data-sp-logo-cloud-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`
  }
}

export function defineSpectreLogoCloud(
  tagName = 'sp-logo-cloud'
): typeof SpectreLogoCloudElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreLogoCloudElement
  }

  customElements.define(tagName, SpectreLogoCloudElement)
  return SpectreLogoCloudElement
}
