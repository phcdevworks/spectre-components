import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { applyPartClasses } from '../../utils/parts'
import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isAccentColor,
  isAccentEdge,
  sanitizeUtilityClasses,
  type SpectreAccentColor,
  type SpectreAccentEdge
} from '../../utils/form'

import {
  getFooterClasses,
  getFooterDividerClasses,
  getFooterHeadingClasses,
  getFooterLinksClasses,
  getFooterMutedClasses,
  getFooterTextClasses,
  type FooterAccentColor,
  type FooterAccentEdge
} from '@phcdevworks/spectre-ui'

export interface SpectreFooterProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  bordered?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  title?: string | null | undefined
}

export class SpectreFooterElement
  extends SpectreProjectableElement
  implements SpectreFooterProps
{
  static properties = {
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    bordered: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String }
  }

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
  bordered: boolean | undefined = false
  fullWidth: boolean | undefined = false
  innerClass: string | undefined = undefined

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
    return this.querySelector('[data-sp-footer-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-footer-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('accent') &&
      this.accent != null &&
      !isAccentEdge(this.accent)
    ) {
      this.accent = undefined
    }
    if (
      changedProperties.has('accentColor') &&
      this.accentColor != null &&
      !isAccentColor(this.accentColor)
    ) {
      this.accentColor = undefined
    }
    if (changedProperties.has('bordered') && this.bordered == null) {
      this.bordered = false
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
  }

  private get footerClasses(): string {
    const recipeClasses = getFooterClasses({
      ...(this.accent !== undefined && {
        accent: this.accent as FooterAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as FooterAccentColor
      }),
      bordered: this.bordered ?? false,
      fullWidth: this.fullWidth ?? false
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
  }

  // Footer parts usually sit inside authored columns, so markers are matched
  // at any depth.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const native = this.querySelector('[data-sp-footer-native]')
    if (!native) {
      return
    }
    applyPartClasses(native.querySelectorAll('[slot]'), {
      divider: getFooterDividerClasses(),
      heading: getFooterHeadingClasses(),
      links: getFooterLinksClasses(),
      muted: getFooterMutedClasses(),
      text: getFooterTextClasses()
    })
  }

  override render() {
    return html`<footer
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.footerClasses}"
      data-sp-footer-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </footer>`
  }
}

export function defineSpectreFooter(
  tagName = 'sp-footer'
): typeof SpectreFooterElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreFooterElement
  }

  customElements.define(tagName, SpectreFooterElement)
  return SpectreFooterElement
}
