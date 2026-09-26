import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { isSpectreKind } from '../../utils/dom'
import { ProjectionController } from '../../utils/projection'
import type { SpectreAccordionItemElement } from '../accordion-item/sp-accordion-item'

import { getAccordionClasses } from '@phcdevworks/spectre-ui'

export interface SpectreAccordionProps {
  flush?: boolean | undefined
  id?: string | null | undefined
  multiple?: boolean | undefined
  title?: string | null | undefined
}

export class SpectreAccordionElement
  extends SpectreBaseElement
  implements SpectreAccordionProps
{
  static properties = {
    flush: { type: Boolean, reflect: true },
    multiple: { type: Boolean, reflect: true }
  }

  flush: boolean | undefined = false
  multiple: boolean | undefined = false

  private readonly projection = new ProjectionController(this, [
    'data-sp-accordion-native'
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
    this.addEventListener('sp-open', this.handleItemOpen)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sp-open', this.handleItemOpen)
    super.disconnectedCallback()
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('flush') && this.flush == null) {
      this.flush = false
    }
    if (changedProperties.has('multiple') && this.multiple == null) {
      this.multiple = false
    }
  }

  private get items(): SpectreAccordionItemElement[] {
    return this.projection
      .elements()
      .filter((element): element is SpectreAccordionItemElement =>
        isSpectreKind(element, 'accordion-item')
      )
  }

  private handleItemOpen = (event: Event): void => {
    if (this.multiple) {
      return
    }
    const items = this.items
    const opened = items.find((item) => item === event.target)
    if (!opened) {
      return
    }
    items.forEach((item) => {
      if (item !== opened) {
        item.open = false
      }
    })
  }

  override render() {
    return html`<div
      class="${getAccordionClasses({ flush: this.flush ?? false })}"
      data-sp-accordion-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreAccordion(
  tagName = 'sp-accordion'
): typeof SpectreAccordionElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreAccordionElement
  }

  customElements.define(tagName, SpectreAccordionElement)
  return SpectreAccordionElement
}
