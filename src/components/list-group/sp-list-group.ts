import { html, type TemplateResult } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { isSpectreKind } from '../../utils/dom'
import {
  isAccentColor,
  isAccentEdge,
  type SpectreAccentColor,
  type SpectreAccentEdge
} from '../../utils/form'
import { applyPartClasses } from '../../utils/parts'
import { ProjectionController } from '../../utils/projection'
import { hoverFocusStates } from '../../utils/states'
import type { SpectreListGroupItemElement } from '../list-group-item/sp-list-group-item'

import {
  getListGroupClasses,
  getListGroupItemClasses,
  getListGroupItemHeadingClasses,
  getListGroupItemTextClasses,
  type ListGroupAccentColor,
  type ListGroupAccentEdge
} from '@phcdevworks/spectre-ui'

export interface SpectreListGroupProps {
  accent?: SpectreAccentEdge | undefined
  accentColor?: SpectreAccentColor | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  flush?: boolean | undefined
  horizontal?: boolean | undefined
  id?: string | null | undefined
  title?: string | null | undefined
}

function isInteractiveItem(item: SpectreListGroupItemElement): boolean {
  return Boolean(item.href) || (item.interactive ?? false)
}

export class SpectreListGroupElement
  extends SpectreBaseElement
  implements SpectreListGroupProps
{
  static properties = {
    accent: { type: String, reflect: true },
    accentColor: { attribute: 'accent-color', type: String, reflect: true },
    flush: { type: Boolean, reflect: true },
    horizontal: { type: Boolean, reflect: true }
  }

  accent: SpectreAccentEdge | undefined = undefined
  accentColor: SpectreAccentColor | undefined = undefined
  flush: boolean | undefined = false
  horizontal: boolean | undefined = false

  private readonly projection = new ProjectionController(this, [
    'data-sp-list-group-native'
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
    this.addEventListener('sp-list-group-item-change', this.handleItemChange)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sp-list-group-item-change', this.handleItemChange)
    super.disconnectedCallback()
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
    if (changedProperties.has('flush') && this.flush == null) {
      this.flush = false
    }
    if (changedProperties.has('horizontal') && this.horizontal == null) {
      this.horizontal = false
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    this.items.forEach((item) => {
      applyPartClasses(item.children, {
        heading: getListGroupItemHeadingClasses(),
        text: getListGroupItemTextClasses()
      })
    })
  }

  private handleItemChange = (event: Event): void => {
    event.stopPropagation()
    this.requestUpdate()
  }

  private get items(): SpectreListGroupItemElement[] {
    return this.projection
      .elements()
      .filter((element): element is SpectreListGroupItemElement =>
        isSpectreKind(element, 'list-group-item')
      )
  }

  private get listClasses(): string {
    return getListGroupClasses({
      ...(this.accent !== undefined && {
        accent: this.accent as ListGroupAccentEdge
      }),
      ...(this.accentColor !== undefined && {
        accentColor: this.accentColor as ListGroupAccentColor
      }),
      flush: this.flush ?? false,
      horizontal: this.horizontal ?? false
    })
  }

  private itemClasses(item: SpectreListGroupItemElement): string {
    return getListGroupItemClasses({
      ...hoverFocusStates(item),
      active: item.active ?? false,
      disabled: item.disabled ?? false,
      interactive: isInteractiveItem(item),
      selected: item.selected ?? false
    })
  }

  private select(item: SpectreListGroupItemElement): void {
    item.dispatchEvent(new CustomEvent('sp-select', { bubbles: true }))
  }

  private renderRow(item: SpectreListGroupItemElement): TemplateResult {
    const classes = this.itemClasses(item)
    const current = item.active ? 'true' : undefined
    const disabled = item.disabled ?? false
    const id = item.id || undefined
    const label = item.ariaLabel?.trim() || undefined
    const title = item.title || undefined

    if (item.href) {
      return html`<a
        aria-current="${ifDefined(current)}"
        aria-disabled="${ifDefined(disabled ? 'true' : undefined)}"
        aria-label="${ifDefined(label)}"
        class="${classes}"
        data-sp-list-group-row
        href="${ifDefined(disabled ? undefined : item.href)}"
        id="${ifDefined(id)}"
        target="${ifDefined(item.target)}"
        title="${ifDefined(title)}"
        @click="${() => this.select(item)}"
        >${item}</a
      >`
    }

    if (item.interactive) {
      return html`<button
        aria-current="${ifDefined(current)}"
        aria-label="${ifDefined(label)}"
        class="${classes}"
        data-sp-list-group-row
        ?disabled="${disabled}"
        id="${ifDefined(id)}"
        title="${ifDefined(title)}"
        type="button"
        @click="${() => this.select(item)}"
      >
        ${item}
      </button>`
    }

    return html`<div
      aria-current="${ifDefined(current)}"
      aria-label="${ifDefined(label)}"
      class="${classes}"
      data-sp-list-group-row
      id="${ifDefined(id)}"
      title="${ifDefined(title)}"
    >
      ${item}
    </div>`
  }

  override render() {
    const items = this.items

    // Static rows keep list semantics; actionable rows follow the native
    // link/button model instead.
    if (!items.some(isInteractiveItem)) {
      return html`<ul
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
        class="${this.listClasses}"
        data-sp-list-group-native
        id="${ifDefined(this.id || undefined)}"
        title="${ifDefined(this.title || undefined)}"
      >
        ${items.map(
          (item) =>
            html`<li
              aria-current="${ifDefined(item.active ? 'true' : undefined)}"
              aria-label="${ifDefined(item.ariaLabel?.trim() || undefined)}"
              class="${this.itemClasses(item)}"
              data-sp-list-group-row
              id="${ifDefined(item.id || undefined)}"
              title="${ifDefined(item.title || undefined)}"
            >
              ${item}
            </li>`
        )}
      </ul>`
    }

    return html`<div
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.listClasses}"
      data-sp-list-group-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${items.map((item) => this.renderRow(item))}
    </div>`
  }
}

export function defineSpectreListGroup(
  tagName = 'sp-list-group'
): typeof SpectreListGroupElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreListGroupElement
  }

  customElements.define(tagName, SpectreListGroupElement)
  return SpectreListGroupElement
}
