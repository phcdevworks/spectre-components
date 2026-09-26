import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'

import { SpectreBaseElement } from '../../utils/base'
import { isSpectreKind, spectreKindKey } from '../../utils/dom'
import { ProjectionController } from '../../utils/projection'
import {
  hoverFocusStateProperties,
  hoverFocusStates,
  type SpectreHoverFocusStateProps
} from '../../utils/states'

import { getChoiceCardClasses } from '@phcdevworks/spectre-ui'

export interface SpectreChoiceCardProps extends SpectreHoverFocusStateProps {
  ariaDescribedBy?: string | null
  checked?: boolean | undefined
  disabled?: boolean | undefined
  form?: string | undefined
  id?: string | null | undefined
  name?: string | undefined
  required?: boolean | undefined
  title?: string | null | undefined
  type?: 'radio' | 'checkbox' | undefined
  value?: string | undefined
}

function owningCard(input: Element): SpectreChoiceCardElement | null {
  let node: Element | null = input.parentElement
  while (
    node &&
    !isSpectreKind<SpectreChoiceCardElement>(node, 'choice-card')
  ) {
    node = node.parentElement
  }
  return node
}

// A whole-card hit target: a `<label>` wrapping a native radio or checkbox,
// so selection, focus, and form submission stay native.
export class SpectreChoiceCardElement
  extends SpectreBaseElement
  implements SpectreChoiceCardProps
{
  static properties = {
    ...hoverFocusStateProperties,
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    name: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    value: { type: String }
  }

  readonly [spectreKindKey] = 'choice-card'

  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  checked: boolean | undefined = false
  disabled: boolean | undefined = false
  form: string | undefined = undefined
  name: string | undefined = undefined
  required: boolean | undefined = false
  type: 'radio' | 'checkbox' | undefined = 'radio'
  value: string | undefined = undefined

  private readonly projection = new ProjectionController(this, [
    'data-sp-choice-card-native'
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
    if (changedProperties.has('checked') && this.checked == null) {
      this.checked = false
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (
      changedProperties.has('type') &&
      this.type !== 'radio' &&
      this.type !== 'checkbox'
    ) {
      this.type = 'radio'
    }
  }

  private get nativeInput(): HTMLInputElement | null {
    return this.querySelector('[data-sp-choice-card-input]')
  }

  override focus(options?: FocusOptions): void {
    this.nativeInput?.focus(options)
  }

  override blur(): void {
    this.nativeInput?.blur()
  }

  // Checking a radio unchecks its group natively; mirror that onto the other
  // cards' `checked` properties.
  private handleChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    this.checked = input.checked
    if (this.type !== 'radio' || !this.name) {
      return
    }
    const root = this.getRootNode() as Document | ShadowRoot
    root
      .querySelectorAll<HTMLInputElement>('input[data-sp-choice-card-input]')
      .forEach((other) => {
        if (other === input || other.name !== this.name) {
          return
        }
        const card = owningCard(other)
        if (card) {
          card.checked = other.checked
        }
      })
  }

  override render() {
    return html`<label
      class="${getChoiceCardClasses({
        ...hoverFocusStates(this),
        disabled: this.disabled ?? false
      })}"
      data-sp-choice-card-native
      title="${ifDefined(this.title || undefined)}"
    >
      <input
        aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
        .checked="${live(this.checked ?? false)}"
        data-sp-choice-card-input
        ?disabled="${this.disabled ?? false}"
        form="${ifDefined(this.form || undefined)}"
        id="${ifDefined(this.id || undefined)}"
        name="${ifDefined(this.name || undefined)}"
        ?required="${this.required ?? false}"
        type="${this.type ?? 'radio'}"
        value="${ifDefined(this.value)}"
        @change="${this.handleChange}"
      />
      <span data-sp-choice-card-content>${this.projection.nodes()}</span>
    </label>`
  }
}

export function defineSpectreChoiceCard(
  tagName = 'sp-choice-card'
): typeof SpectreChoiceCardElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreChoiceCardElement
  }

  customElements.define(tagName, SpectreChoiceCardElement)
  return SpectreChoiceCardElement
}
