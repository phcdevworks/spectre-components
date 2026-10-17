import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { sanitizeUtilityClasses } from '../../utils/form'

import { getDividerClasses } from '@phcdevworks/spectre-ui'

export interface SpectreDividerProps {
  ariaLabel?: string | null
  id?: string | null | undefined
  innerClass?: string | undefined
  title?: string | null | undefined
}

export class SpectreDividerElement
  extends SpectreBaseElement
  implements SpectreDividerProps
{
  static properties = {
    innerClass: { attribute: 'inner-class', type: String }
  }

  innerClass: string | undefined = undefined

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

  private get dividerClasses(): string {
    const utilityClasses = sanitizeUtilityClasses(this.innerClass)
    return [getDividerClasses(), utilityClasses].filter(Boolean).join(' ')
  }

  override render() {
    return html`<hr
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${this.dividerClasses}"
      data-sp-divider-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    />`
  }
}

export function defineSpectreDivider(
  tagName = 'sp-divider'
): typeof SpectreDividerElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreDividerElement
  }

  customElements.define(tagName, SpectreDividerElement)
  return SpectreDividerElement
}
