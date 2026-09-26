import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isStepperOrientation,
  normalizeInt,
  type SpectreStepperOrientation
} from '../../utils/form'
import { renderIcon } from '../../utils/icons'
import { ProjectionController } from '../../utils/projection'

import {
  getStepperClasses,
  getStepperIndicatorClasses,
  getStepperLabelClasses,
  getStepperStepClasses,
  type StepperStepState
} from '@phcdevworks/spectre-ui'

export interface SpectreStepperProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  current?: number | undefined
  id?: string | null | undefined
  orientation?: SpectreStepperOrientation | undefined
  title?: string | null | undefined
}

export class SpectreStepperElement
  extends SpectreBaseElement
  implements SpectreStepperProps
{
  static properties = {
    current: { type: Number, reflect: true },
    orientation: { type: String, reflect: true }
  }

  current: number | undefined = 0
  orientation: SpectreStepperOrientation | undefined = 'horizontal'

  private readonly projection = new ProjectionController(this, [
    'data-sp-stepper-native'
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
    if (changedProperties.has('current')) {
      this.current = normalizeInt(this.current, 0)
    }
    if (
      changedProperties.has('orientation') &&
      (this.orientation == null || !isStepperOrientation(this.orientation))
    ) {
      this.orientation = 'horizontal'
    }
  }

  private stateFor(index: number): StepperStepState {
    const current = this.current ?? 0
    if (index < current) {
      return 'done'
    }
    return index === current ? 'active' : 'pending'
  }

  override render() {
    return html`<ol
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${getStepperClasses({
        orientation: this.orientation as SpectreStepperOrientation
      })}"
      data-sp-stepper-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.elements().map((step, index) => {
        const state = this.stateFor(index)
        return html`<li
          aria-current="${ifDefined(state === 'active' ? 'step' : undefined)}"
          class="${getStepperStepClasses({ state })}"
          data-state="${state}"
        >
          <span aria-hidden="true" class="${getStepperIndicatorClasses()}"
            >${state === 'done' ? renderIcon('check') : index + 1}</span
          >
          <span class="${getStepperLabelClasses()}">${step}</span>
        </li>`
      })}
    </ol>`
  }
}

export function defineSpectreStepper(
  tagName = 'sp-stepper'
): typeof SpectreStepperElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreStepperElement
  }

  customElements.define(tagName, SpectreStepperElement)
  return SpectreStepperElement
}
