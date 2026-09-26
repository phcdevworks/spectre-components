import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { ProjectionController } from '../../utils/projection'

import { getProseClasses } from '@phcdevworks/spectre-ui'

export interface SpectreProseProps {
  ariaLabel?: string | null
  id?: string | null | undefined
  title?: string | null | undefined
}

// Styles authored long-form HTML (headings, lists, code, quotes, rules).
export class SpectreProseElement
  extends SpectreBaseElement
  implements SpectreProseProps
{
  private readonly projection = new ProjectionController(this, [
    'data-sp-prose-native'
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

  override render() {
    return html`<div
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${getProseClasses()}"
      data-sp-prose-native
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(this.forwardedAriaLabel ? 'region' : undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreProse(
  tagName = 'sp-prose'
): typeof SpectreProseElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreProseElement
  }

  customElements.define(tagName, SpectreProseElement)
  return SpectreProseElement
}
