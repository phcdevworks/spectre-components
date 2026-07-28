import { nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { literal, html as staticHtml } from 'lit/static-html.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isTextFamily,
  isTextLevel,
  isTextSize,
  isTextVariant,
  type SpectreTextFamily,
  type SpectreTextLevel,
  type SpectreTextSize,
  type SpectreTextVariant
} from '../../utils/form'

import { getTextClasses } from '@phcdevworks/spectre-ui'

const LEVEL_TAGS: Record<SpectreTextLevel, ReturnType<typeof literal>> = {
  h1: literal`h1`,
  h2: literal`h2`,
  h3: literal`h3`,
  h4: literal`h4`,
  h5: literal`h5`,
  h6: literal`h6`,
  p: literal`p`,
  span: literal`span`
}

export interface SpectreTextProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  family?: SpectreTextFamily | undefined
  id?: string | null | undefined
  level?: SpectreTextLevel | undefined
  size?: SpectreTextSize | undefined
  title?: string | null | undefined
  variant?: SpectreTextVariant | undefined
}

export class SpectreTextElement
  extends SpectreProjectableElement
  implements SpectreTextProps
{
  static properties = {
    family: { type: String, reflect: true },
    level: { type: String, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  family: SpectreTextFamily | undefined
  level: SpectreTextLevel | undefined = 'p'
  size: SpectreTextSize | undefined = 'md'
  variant: SpectreTextVariant | undefined = 'default'

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('family') && !isTextFamily(this.family)) {
      this.family = undefined
    }

    if (changedProperties.has('level') && !isTextLevel(this.level)) {
      this.level = 'p'
    }

    if (changedProperties.has('size') && !isTextSize(this.size)) {
      this.size = 'md'
    }

    if (changedProperties.has('variant') && !isTextVariant(this.variant)) {
      this.variant = 'default'
    }
  }

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
    return this.querySelector('[data-sp-text-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }

    const el = node as Element
    return el.hasAttribute('data-sp-text-native')
  }

  override render() {
    const tag = LEVEL_TAGS[this.level ?? 'p']
    const textClasses = getTextClasses({
      ...(this.family !== undefined && { family: this.family }),
      size: this.size ?? 'md',
      variant: this.variant ?? 'default'
    })

    return staticHtml`<${tag}
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${textClasses}"
      data-sp-text-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >${this.hasProjectedContent ? this.projectedContent : nothing}</${tag}>`
  }
}

export function defineSpectreText(
  tagName = 'sp-text'
): typeof SpectreTextElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTextElement
  }

  customElements.define(tagName, SpectreTextElement)
  return SpectreTextElement
}
