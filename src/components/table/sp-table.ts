import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { replaceClasses } from '../../utils/dom'
import {
  isTableRowVariant,
  isTableSize,
  type SpectreTableSize
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getTableClasses,
  getTableRowClasses,
  getTableWrapperClasses,
  type TableRowVariant,
  type TableSize
} from '@phcdevworks/spectre-ui'

export interface SpectreTableProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  bordered?: boolean | undefined
  hoverable?: boolean | undefined
  id?: string | null | undefined
  size?: SpectreTableSize | undefined
  striped?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreTableElement
  extends SpectreBaseElement
  implements SpectreTableProps
{
  static properties = {
    bordered: { type: Boolean, reflect: true },
    hoverable: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    striped: { type: Boolean, reflect: true }
  }

  bordered: boolean | undefined = false
  hoverable: boolean | undefined = false
  size: SpectreTableSize | undefined = 'md'
  striped: boolean | undefined = false

  private readonly appliedTableClasses = new WeakMap<Element, string>()
  private readonly projection = new ProjectionController(this, [
    'data-sp-table-native'
  ])

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
    if (changedProperties.has('bordered') && this.bordered == null) {
      this.bordered = false
    }
    if (changedProperties.has('hoverable') && this.hoverable == null) {
      this.hoverable = false
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isTableSize(this.size))
    ) {
      this.size = 'md'
    }
    if (changedProperties.has('striped') && this.striped == null) {
      this.striped = false
    }
  }

  // The authored <table> is styled in place: the HTML parser drops table
  // parts that are not inside a <table>, so the component cannot render one.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const classes = getTableClasses({
      bordered: this.bordered ?? false,
      hoverable: this.hoverable ?? false,
      size: this.size as TableSize,
      striped: this.striped ?? false
    })
    this.projection
      .elements()
      .filter((element) => element instanceof HTMLTableElement)
      .forEach((table) => {
        replaceClasses(
          table,
          this.appliedTableClasses.get(table) ?? '',
          classes
        )
        this.appliedTableClasses.set(table, classes)
        table.querySelectorAll('tr').forEach((row) => this.styleRow(row))
      })
  }

  // Contextual rows opt in with `data-variant`; `aria-selected` is styled by
  // the recipe CSS directly.
  private styleRow(row: HTMLTableRowElement): void {
    const variant = row.dataset.variant
    const classes = isTableRowVariant(variant)
      ? getTableRowClasses({ variant: variant as TableRowVariant })
      : ''
    replaceClasses(row, this.appliedTableClasses.get(row) ?? '', classes)
    this.appliedTableClasses.set(row, classes)
  }

  override render() {
    const labelled = Boolean(
      this.forwardedAriaLabel || this.forwardedAriaLabelledBy
    )

    return html`<div
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getTableWrapperClasses()}"
      data-sp-table-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(labelled ? 'region' : undefined)}"
      tabindex="${ifDefined(labelled ? '0' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreTable(
  tagName = 'sp-table'
): typeof SpectreTableElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTableElement
  }

  customElements.define(tagName, SpectreTableElement)
  return SpectreTableElement
}
