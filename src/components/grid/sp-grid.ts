import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isGridColumns,
  isGridGap,
  type SpectreGridColumns,
  type SpectreGridGap
} from '../../utils/form'

import {
  getGridClasses,
  type GridColumns,
  type GridGap
} from '@phcdevworks/spectre-ui'
import { normalizeInt } from '../../utils/form'

export interface SpectreGridProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  columns?: SpectreGridColumns | undefined
  gap?: SpectreGridGap | undefined
  id?: string | null | undefined
  title?: string | null | undefined
}

export class SpectreGridElement
  extends SpectreProjectableElement
  implements SpectreGridProps
{
  static properties = {
    columns: { type: Number, reflect: true },
    gap: { type: String, reflect: true }
  }

  columns: SpectreGridColumns | undefined = 1
  gap: SpectreGridGap | undefined = 'md'

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
    return this.querySelector('[data-sp-grid-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-grid-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('columns')) {
      const normalized = normalizeInt(this.columns, undefined, 1)
      this.columns =
        normalized != null && isGridColumns(normalized)
          ? (normalized as SpectreGridColumns)
          : 1
    }
    if (
      changedProperties.has('gap') &&
      (this.gap == null || !isGridGap(this.gap))
    ) {
      this.gap = 'md'
    }
  }

  private get gridClasses(): string {
    return getGridClasses({
      columns: this.columns as GridColumns,
      gap: this.gap as GridGap
    })
  }

  override render() {
    return html`<div
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.gridClasses}"
      data-sp-grid-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </div>`
  }
}

export function defineSpectreGrid(
  tagName = 'sp-grid'
): typeof SpectreGridElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreGridElement
  }

  customElements.define(tagName, SpectreGridElement)
  return SpectreGridElement
}
