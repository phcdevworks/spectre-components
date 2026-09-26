import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { applyPartClasses } from '../../utils/parts'
import { ProjectionController } from '../../utils/projection'

import {
  getButtonClasses,
  getFileInputClasses,
  getInputClasses,
  getInputGroupAddonClasses,
  getInputGroupClasses,
  getSelectClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreInputGroupProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  disabled?: boolean | undefined
  id?: string | null | undefined
  title?: string | null | undefined
}

function controlClasses(element: Element): string | undefined {
  if (element instanceof HTMLInputElement) {
    return element.type === 'file' ? getFileInputClasses() : getInputClasses()
  }
  if (element instanceof HTMLSelectElement) {
    return getSelectClasses()
  }
  if (element instanceof HTMLButtonElement) {
    return getButtonClasses({ variant: 'secondary' })
  }
  return undefined
}

// The recipe fuses its *direct* children (`> :first-child` radii, overlapping
// borders), so it takes native controls rather than `sp-*` wrapper hosts.
export class SpectreInputGroupElement
  extends SpectreBaseElement
  implements SpectreInputGroupProps
{
  static properties = {
    disabled: { type: Boolean, reflect: true }
  }

  disabled: boolean | undefined = false

  private readonly projection = new ProjectionController(this, [
    'data-sp-input-group-native'
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

  // Native controls without an author-chosen `sp-*` class get their recipe
  // class; `slot="addon"` children become addons.
  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    this.projection.elements().forEach((element) => {
      const styled = Array.from(element.classList).some((name) =>
        name.startsWith('sp-')
      )
      const classes = styled ? undefined : controlClasses(element)
      if (classes) {
        element.classList.add(...classes.split(/\s+/).filter(Boolean))
      }
    })
    applyPartClasses(this.projection.elements('addon'), {
      addon: getInputGroupAddonClasses()
    })
  }

  override render() {
    return html`<div
      aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getInputGroupClasses({ disabled: this.disabled ?? false })}"
      data-sp-input-group-native
      id="${ifDefined(this.id || undefined)}"
      role="group"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.all()}
    </div>`
  }
}

export function defineSpectreInputGroup(
  tagName = 'sp-input-group'
): typeof SpectreInputGroupElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreInputGroupElement
  }

  customElements.define(tagName, SpectreInputGroupElement)
  return SpectreInputGroupElement
}
