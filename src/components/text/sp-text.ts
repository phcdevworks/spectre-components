import { nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { literal, html as staticHtml } from 'lit/static-html.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isDisplayLevel,
  isHeadingLevel,
  isTextDecoration,
  isTextFamily,
  isTextFontSize,
  isTextLeading,
  isTextPreset,
  isTextLevel,
  isTextSize,
  isTextTracking,
  isTextTransform,
  isTextUnderlineOffset,
  isTextVariant,
  isTextWeight,
  type SpectreDisplayLevel,
  type SpectreHeadingLevel,
  type SpectreTextDecoration,
  type SpectreTextFamily,
  type SpectreTextFontSize,
  type SpectreTextLeading,
  type SpectreTextPreset,
  type SpectreTextLevel,
  type SpectreTextSize,
  type SpectreTextTracking,
  type SpectreTextTransform,
  type SpectreTextUnderlineOffset,
  type SpectreTextVariant,
  type SpectreTextWeight
} from '../../utils/form'

import {
  getDisplayClasses,
  getHeadingClasses,
  getLeadClasses,
  getTextClasses
} from '@phcdevworks/spectre-ui'

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
  balance?: boolean | undefined
  decoration?: SpectreTextDecoration | undefined
  displayLevel?: SpectreDisplayLevel | undefined
  family?: SpectreTextFamily | undefined
  fontSize?: SpectreTextFontSize | undefined
  headingLevel?: SpectreHeadingLevel | undefined
  id?: string | null | undefined
  leading?: SpectreTextLeading | undefined
  level?: SpectreTextLevel | undefined
  preset?: SpectreTextPreset | undefined
  size?: SpectreTextSize | undefined
  tabularNums?: boolean | undefined
  title?: string | null | undefined
  tracking?: SpectreTextTracking | undefined
  transform?: SpectreTextTransform | undefined
  underlineOffset?: SpectreTextUnderlineOffset | undefined
  variant?: SpectreTextVariant | undefined
  weight?: SpectreTextWeight | undefined
}

export class SpectreTextElement
  extends SpectreProjectableElement
  implements SpectreTextProps
{
  static properties = {
    balance: { type: Boolean, reflect: true },
    decoration: { type: String, reflect: true },
    displayLevel: { attribute: 'display-level', type: Number, reflect: true },
    family: { type: String, reflect: true },
    fontSize: { attribute: 'font-size', type: Number, reflect: true },
    headingLevel: { attribute: 'heading-level', type: String, reflect: true },
    leading: { type: String, reflect: true },
    level: { type: String, reflect: true },
    preset: { type: String, reflect: true },
    size: { type: String, reflect: true },
    tabularNums: { attribute: 'tabular-nums', type: Boolean, reflect: true },
    tracking: { type: String, reflect: true },
    transform: { type: String, reflect: true },
    underlineOffset: {
      attribute: 'underline-offset',
      type: String,
      reflect: true
    },
    variant: { type: String, reflect: true },
    weight: { type: Number, reflect: true }
  }

  balance: boolean | undefined = false
  decoration: SpectreTextDecoration | undefined = undefined
  displayLevel: SpectreDisplayLevel | undefined = undefined
  family: SpectreTextFamily | undefined
  fontSize: SpectreTextFontSize | undefined = undefined
  headingLevel: SpectreHeadingLevel | undefined = undefined
  leading: SpectreTextLeading | undefined = undefined
  level: SpectreTextLevel | undefined = 'p'
  preset: SpectreTextPreset | undefined = undefined
  size: SpectreTextSize | undefined = 'md'
  tabularNums: boolean | undefined = false
  tracking: SpectreTextTracking | undefined = undefined
  transform: SpectreTextTransform | undefined
  underlineOffset: SpectreTextUnderlineOffset | undefined = undefined
  variant: SpectreTextVariant | undefined = 'default'
  weight: SpectreTextWeight | undefined = undefined

  private ownsHostDisplay = false

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('displayLevel') &&
      this.displayLevel != null &&
      !isDisplayLevel(this.displayLevel)
    ) {
      this.displayLevel = undefined
    }

    if (
      changedProperties.has('headingLevel') &&
      this.headingLevel != null &&
      !isHeadingLevel(this.headingLevel)
    ) {
      this.headingLevel = undefined
    }

    if (
      changedProperties.has('preset') &&
      this.preset != null &&
      !isTextPreset(this.preset)
    ) {
      this.preset = undefined
    }

    if (changedProperties.has('family') && !isTextFamily(this.family)) {
      this.family = undefined
    }

    if (
      changedProperties.has('leading') &&
      this.leading != null &&
      !isTextLeading(this.leading)
    ) {
      this.leading = undefined
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

    if (
      changedProperties.has('transform') &&
      this.transform !== undefined &&
      !isTextTransform(this.transform)
    ) {
      this.transform = undefined
    }

    if (
      changedProperties.has('weight') &&
      this.weight != null &&
      !isTextWeight(this.weight)
    ) {
      this.weight = undefined
    }

    if (
      changedProperties.has('fontSize') &&
      this.fontSize != null &&
      !isTextFontSize(this.fontSize)
    ) {
      this.fontSize = undefined
    }

    if (
      changedProperties.has('tracking') &&
      this.tracking != null &&
      !isTextTracking(this.tracking)
    ) {
      this.tracking = undefined
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

    if (changedProperties.has('balance') && this.balance == null) {
      this.balance = false
    }

    if (changedProperties.has('tabularNums') && this.tabularNums == null) {
      this.tabularNums = false
    }
  }

  // An inline-level host would otherwise be a box (blockified in flex and
  // grid layouts) whose inherited line-height strut sets a floor on the line
  // box. `display: contents` lets the native element's size recipe set it.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const inline = this.level === 'span'
    if (inline && !this.style.display) {
      this.style.display = 'contents'
      this.ownsHostDisplay = true
    } else if (!inline && this.ownsHostDisplay) {
      this.style.removeProperty('display')
      this.ownsHostDisplay = false
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

  // A typography preset replaces the text recipe: each sets its own size,
  // weight, and color.
  private get textClasses(): string {
    const level = this.level ?? 'p'
    switch (this.preset) {
      case 'heading':
        return getHeadingClasses({
          level: this.headingLevel ?? (isHeadingLevel(level) ? level : 'h2')
        })
      case 'display':
        return getDisplayClasses({ level: this.displayLevel ?? 1 })
      case 'lead':
        return getLeadClasses()
    }
    return getTextClasses({
      ...(this.balance && { balance: true }),
      ...(this.decoration != null && { decoration: this.decoration }),
      ...(this.family !== undefined && { family: this.family }),
      ...(this.fontSize != null && { fontSize: this.fontSize }),
      ...(this.leading != null && { leading: this.leading }),
      size: this.size ?? 'md',
      ...(this.tabularNums && { tabularNums: true }),
      ...(this.tracking != null && { tracking: this.tracking }),
      ...(this.transform !== undefined && { transform: this.transform }),
      ...(this.underlineOffset != null && {
        underlineOffset: this.underlineOffset
      }),
      variant: this.variant ?? 'default',
      ...(this.weight != null && { weight: this.weight })
    })
  }

  override render() {
    const tag = LEVEL_TAGS[this.level ?? 'p']

    return staticHtml`<${tag}
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.textClasses}"
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
