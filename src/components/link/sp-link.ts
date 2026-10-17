import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isLinkTone,
  isTextDecoration,
  isTextUnderlineOffset,
  type SpectreLinkTone,
  type SpectreTextDecoration,
  type SpectreTextUnderlineOffset
} from '../../utils/form'

import { getLinkClasses } from '@phcdevworks/spectre-ui'

export interface SpectreLinkProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  current?: boolean | undefined
  decoration?: SpectreTextDecoration | undefined
  href?: string | undefined
  id?: string | null | undefined
  rel?: string | undefined
  target?: string | undefined
  title?: string | null | undefined
  tone?: SpectreLinkTone | undefined
  underlineOffset?: SpectreTextUnderlineOffset | undefined
}

export class SpectreLinkElement
  extends SpectreProjectableElement
  implements SpectreLinkProps
{
  static properties = {
    current: { type: Boolean, reflect: true },
    decoration: { type: String, reflect: true },
    href: { type: String, reflect: true },
    rel: { type: String },
    target: { type: String },
    tone: { type: String, reflect: true },
    underlineOffset: {
      attribute: 'underline-offset',
      type: String,
      reflect: true
    }
  }

  current: boolean | undefined = false
  decoration: SpectreTextDecoration | undefined = undefined
  href: string | undefined = undefined
  rel: string | undefined = undefined
  target: string | undefined = undefined
  tone: SpectreLinkTone | undefined = 'default'
  underlineOffset: SpectreTextUnderlineOffset | undefined = undefined

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
    return this.querySelector('[data-sp-link-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-link-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('current') && this.current == null) {
      this.current = false
    }
    if (
      changedProperties.has('tone') &&
      (this.tone == null || !isLinkTone(this.tone))
    ) {
      this.tone = 'default'
    }
    if (
      changedProperties.has('decoration') &&
      this.decoration != null &&
      !isTextDecoration(this.decoration)
    ) {
      this.decoration = undefined
    }
    if (
      changedProperties.has('underlineOffset') &&
      this.underlineOffset != null &&
      !isTextUnderlineOffset(this.underlineOffset)
    ) {
      this.underlineOffset = undefined
    }
  }

  private get linkClasses(): string {
    return getLinkClasses({
      tone: this.tone ?? 'default',
      ...(this.decoration != null && { decoration: this.decoration }),
      ...(this.underlineOffset != null && {
        underlineOffset: this.underlineOffset
      })
    })
  }

  override render() {
    return html`<a
      aria-current="${ifDefined(this.current ? 'page' : undefined)}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.linkClasses}"
      data-sp-link-native
      href="${ifDefined(this.href || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      rel="${ifDefined(this.rel || undefined)}"
      target="${ifDefined(this.target || undefined)}"
      title="${ifDefined(this.title || undefined)}"
      >${this.hasProjectedContent ? this.projectedContent : nothing}</a
    >`
  }
}

export function defineSpectreLink(
  tagName = 'sp-link'
): typeof SpectreLinkElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreLinkElement
  }

  customElements.define(tagName, SpectreLinkElement)
  return SpectreLinkElement
}
