import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import {
  isGridAlign,
  isGridColumns,
  isGridExplicitTemplateOptions,
  isGridFixedTracksOptions,
  isGridGap,
  isGridLeadingTracksOptions,
  isGridOffset,
  isGridOffsetOptions,
  isGridOrder,
  isGridOrderOptions,
  isGridSpan,
  isGridSpanOptions,
  sanitizeUtilityClasses,
  type SpectreGridAlign,
  type SpectreGridColumns,
  type SpectreGridExplicitTemplateOptions,
  type SpectreGridFixedTracksOptions,
  type SpectreGridGap,
  type SpectreGridLeadingTracksOptions,
  type SpectreGridOffset,
  type SpectreGridOffsetOptions,
  type SpectreGridOrder,
  type SpectreGridOrderOptions,
  type SpectreGridSpan,
  type SpectreGridSpanOptions
} from '../../utils/form'

import {
  getGridClasses,
  type GridAlign,
  type GridColumns,
  type GridExplicitTemplateOptions,
  type GridFixedTracksOptions,
  type GridGap,
  type GridLeadingTracksOptions,
  type GridOffset,
  type GridOffsetOptions,
  type GridOrder,
  type GridOrderOptions,
  type GridSpan,
  type GridSpanOptions
} from '@phcdevworks/spectre-ui'
import { normalizeInt } from '../../utils/form'

export interface SpectreGridProps {
  align?: SpectreGridAlign | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  columns?: SpectreGridColumns | undefined
  columnGap?: SpectreGridGap | undefined
  explicitTemplate?: SpectreGridExplicitTemplateOptions | undefined
  fixedTracks?: SpectreGridFixedTracksOptions | undefined
  gap?: SpectreGridGap | undefined
  id?: string | null | undefined
  innerClass?: string | undefined
  leadingTracks?: SpectreGridLeadingTracksOptions | undefined
  offset?: SpectreGridOffset | SpectreGridOffsetOptions | undefined
  order?: SpectreGridOrder | SpectreGridOrderOptions | undefined
  rowGap?: SpectreGridGap | undefined
  rowOffset?: SpectreGridOffset | SpectreGridOffsetOptions | undefined
  rowSpan?: SpectreGridSpan | SpectreGridSpanOptions | undefined
  span?: SpectreGridSpan | SpectreGridSpanOptions | undefined
  title?: string | null | undefined
}

export class SpectreGridElement
  extends SpectreProjectableElement
  implements SpectreGridProps
{
  static properties = {
    align: { type: String, reflect: true },
    columns: { type: Number, reflect: true },
    columnGap: { attribute: 'column-gap', type: String, reflect: true },
    explicitTemplate: { attribute: 'explicit-template', type: Object },
    fixedTracks: { attribute: 'fixed-tracks', type: Object },
    gap: { type: String, reflect: true },
    innerClass: { attribute: 'inner-class', type: String },
    leadingTracks: { attribute: 'leading-tracks', type: Object },
    offset: { type: Object },
    order: { type: Object },
    rowGap: { attribute: 'row-gap', type: String, reflect: true },
    rowOffset: { attribute: 'row-offset', type: Object },
    rowSpan: { attribute: 'row-span', type: Object },
    span: { type: Object }
  }

  align: SpectreGridAlign | undefined = undefined
  columns: SpectreGridColumns | undefined = 1
  columnGap: SpectreGridGap | undefined = undefined
  explicitTemplate: SpectreGridExplicitTemplateOptions | undefined = undefined
  fixedTracks: SpectreGridFixedTracksOptions | undefined = undefined
  gap: SpectreGridGap | undefined = 'md'
  innerClass: string | undefined = undefined
  leadingTracks: SpectreGridLeadingTracksOptions | undefined = undefined
  offset: SpectreGridOffset | SpectreGridOffsetOptions | undefined
  order: SpectreGridOrder | SpectreGridOrderOptions | undefined
  rowGap: SpectreGridGap | undefined = undefined
  rowOffset: SpectreGridOffset | SpectreGridOffsetOptions | undefined
  rowSpan: SpectreGridSpan | SpectreGridSpanOptions | undefined
  span: SpectreGridSpan | SpectreGridSpanOptions | undefined

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
    if (
      changedProperties.has('align') &&
      this.align != null &&
      !isGridAlign(this.align)
    ) {
      this.align = undefined
    }
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
    if (
      changedProperties.has('columnGap') &&
      this.columnGap != null &&
      !isGridGap(this.columnGap)
    ) {
      this.columnGap = undefined
    }
    if (
      changedProperties.has('rowGap') &&
      this.rowGap != null &&
      !isGridGap(this.rowGap)
    ) {
      this.rowGap = undefined
    }
    if (
      changedProperties.has('span') &&
      this.span !== undefined &&
      !isGridSpan(this.span) &&
      !isGridSpanOptions(this.span)
    ) {
      this.span = undefined
    }
    if (
      changedProperties.has('offset') &&
      this.offset !== undefined &&
      !isGridOffset(this.offset) &&
      !isGridOffsetOptions(this.offset)
    ) {
      this.offset = undefined
    }
    if (
      changedProperties.has('rowSpan') &&
      this.rowSpan !== undefined &&
      !isGridSpan(this.rowSpan) &&
      !isGridSpanOptions(this.rowSpan)
    ) {
      this.rowSpan = undefined
    }
    if (
      changedProperties.has('rowOffset') &&
      this.rowOffset !== undefined &&
      !isGridOffset(this.rowOffset) &&
      !isGridOffsetOptions(this.rowOffset)
    ) {
      this.rowOffset = undefined
    }
    if (
      changedProperties.has('order') &&
      this.order !== undefined &&
      !isGridOrder(this.order) &&
      !isGridOrderOptions(this.order)
    ) {
      this.order = undefined
    }
    if (
      changedProperties.has('leadingTracks') &&
      this.leadingTracks !== undefined &&
      !isGridLeadingTracksOptions(this.leadingTracks)
    ) {
      this.leadingTracks = undefined
    }
    if (
      changedProperties.has('fixedTracks') &&
      this.fixedTracks !== undefined &&
      !isGridFixedTracksOptions(this.fixedTracks)
    ) {
      this.fixedTracks = undefined
    }
    if (
      changedProperties.has('explicitTemplate') &&
      this.explicitTemplate !== undefined &&
      !isGridExplicitTemplateOptions(this.explicitTemplate)
    ) {
      this.explicitTemplate = undefined
    }
  }

  private get gridClasses(): string {
    const recipeClasses = getGridClasses({
      columns: this.columns as GridColumns,
      gap: this.gap as GridGap,
      ...(this.align !== undefined && { align: this.align as GridAlign }),
      ...(this.columnGap !== undefined && {
        columnGap: this.columnGap as GridGap
      }),
      ...(this.rowGap !== undefined && { rowGap: this.rowGap as GridGap }),
      ...(this.span !== undefined && {
        span: this.span as GridSpan | GridSpanOptions
      }),
      ...(this.offset !== undefined && {
        offset: this.offset as GridOffset | GridOffsetOptions
      }),
      ...(this.rowSpan !== undefined && {
        rowSpan: this.rowSpan as GridSpan | GridSpanOptions
      }),
      ...(this.rowOffset !== undefined && {
        rowOffset: this.rowOffset as GridOffset | GridOffsetOptions
      }),
      ...(this.order !== undefined && {
        order: this.order as GridOrder | GridOrderOptions
      }),
      ...(this.leadingTracks !== undefined && {
        leadingTracks: this.leadingTracks as GridLeadingTracksOptions
      }),
      ...(this.fixedTracks !== undefined && {
        fixedTracks: this.fixedTracks as GridFixedTracksOptions
      }),
      ...(this.explicitTemplate !== undefined && {
        explicitTemplate: this.explicitTemplate as GridExplicitTemplateOptions
      })
    })
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return utilityClasses ? `${recipeClasses} ${utilityClasses}` : recipeClasses
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
