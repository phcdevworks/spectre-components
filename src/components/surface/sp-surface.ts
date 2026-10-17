import { nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { literal, html as staticHtml } from 'lit/static-html.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isSurface,
  isSurfaceTag,
  sanitizeUtilityClasses,
  type SpectreSurface,
  type SpectreSurfaceTag
} from '../../utils/form'

import { getSurfaceClasses } from '@phcdevworks/spectre-ui'

const SURFACE_TAGS: Record<SpectreSurfaceTag, ReturnType<typeof literal>> = {
  div: literal`div`,
  section: literal`section`,
  article: literal`article`,
  aside: literal`aside`,
  header: literal`header`,
  footer: literal`footer`,
  li: literal`li`
}

export interface SpectreSurfaceProps {
  active?: boolean | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  as?: SpectreSurfaceTag | undefined
  hover?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  selected?: boolean | undefined
  surface?: SpectreSurface | undefined
  title?: string | null | undefined
}

export class SpectreSurfaceElement
  extends SpectreProjectableElement
  implements SpectreSurfaceProps
{
  static properties = {
    active: { type: Boolean, reflect: true },
    as: { type: String, reflect: true },
    hover: { type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    selected: { type: Boolean, reflect: true },
    surface: { type: String, reflect: true }
  }

  active: boolean | undefined = false
  as: SpectreSurfaceTag | undefined = 'div'
  hover: boolean | undefined = false
  innerClass: string | undefined = undefined
  selected: boolean | undefined = false
  surface: SpectreSurface | undefined = undefined

  private ownsHostDisplay = false

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
    return this.querySelector('[data-sp-surface-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-surface-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('as') &&
      (this.as == null || !isSurfaceTag(this.as))
    ) {
      this.as = 'div'
    }
    if (
      changedProperties.has('surface') &&
      this.surface != null &&
      !isSurface(this.surface)
    ) {
      this.surface = undefined
    }
    if (changedProperties.has('hover') && this.hover == null) {
      this.hover = false
    }
    if (changedProperties.has('selected') && this.selected == null) {
      this.selected = false
    }
    if (changedProperties.has('active') && this.active == null) {
      this.active = false
    }
  }

  // A list item must stay a direct box of its list, so the host steps out of
  // layout; every other element is a block like the host it replaces.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const display = this.as === 'li' ? 'contents' : 'block'
    if (!this.style.display || this.ownsHostDisplay) {
      this.style.display = display
      this.ownsHostDisplay = true
    }
  }

  private get surfaceClasses(): string {
    const recipeClasses = getSurfaceClasses({
      ...(this.surface != null && { surface: this.surface }),
      ...(this.hover && { hover: true }),
      ...(this.selected && { selected: true }),
      ...(this.active && { active: true })
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return [recipeClasses, utilityClasses].filter(Boolean).join(' ')
  }

  override render() {
    const tag = SURFACE_TAGS[this.as ?? 'div']

    return staticHtml`<${tag}
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${ifDefined(this.surfaceClasses || undefined)}"
      data-sp-surface-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >${this.hasProjectedContent ? this.projectedContent : nothing}</${tag}>`
  }
}

export function defineSpectreSurface(
  tagName = 'sp-surface'
): typeof SpectreSurfaceElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSurfaceElement
  }

  customElements.define(tagName, SpectreSurfaceElement)
  return SpectreSurfaceElement
}
