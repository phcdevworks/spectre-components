import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isSkeletonShape,
  sanitizeUtilityClasses,
  type SpectreSkeletonShape
} from '../../utils/form'

import { getSkeletonClasses, type SkeletonShape } from '@phcdevworks/spectre-ui'

export interface SpectreSkeletonProps {
  animated?: boolean | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  shape?: SpectreSkeletonShape | undefined
  title?: string | null | undefined
}

export class SpectreSkeletonElement
  extends SpectreBaseElement
  implements SpectreSkeletonProps
{
  static properties = {
    animated: { type: Boolean, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    shape: { type: String, reflect: true }
  }

  animated: boolean | undefined = false
  innerClass: string | undefined = undefined
  shape: SpectreSkeletonShape | undefined = 'text'

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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('shape') &&
      (this.shape == null || !isSkeletonShape(this.shape))
    ) {
      this.shape = 'text'
    }
    if (changedProperties.has('animated') && this.animated == null) {
      this.animated = false
    }
  }

  // A rect has no intrinsic height, so it fills the box the consumer gives
  // the host.
  private get skeletonClasses(): string {
    const recipeClasses = getSkeletonClasses({
      animated: this.animated ?? false,
      shape: this.shape as SkeletonShape
    })
    const fill = this.shape === 'rect' ? 'sp-h-full' : ''
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return [recipeClasses, fill, utilityClasses].filter(Boolean).join(' ')
  }

  // A placeholder carries no content, so it stays out of the accessibility
  // tree; the loading region around it announces the busy state.
  override render() {
    return html`<div
      aria-hidden="true"
      class="${this.skeletonClasses}"
      data-sp-skeleton-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    ></div>`
  }
}

export function defineSpectreSkeleton(
  tagName = 'sp-skeleton'
): typeof SpectreSkeletonElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSkeletonElement
  }

  customElements.define(tagName, SpectreSkeletonElement)
  return SpectreSkeletonElement
}
