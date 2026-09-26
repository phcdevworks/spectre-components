import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { ProjectionController } from '../../utils/projection'
import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getExternalAuthButtonClasses,
  getExternalAuthButtonIconClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreExternalAuthButtonProps extends SpectreInteractionStateProps {
  ariaLabel?: string | null
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  href?: string | undefined
  id?: string | null | undefined
  loading?: boolean | undefined
  title?: string | null | undefined
  type?: 'button' | 'submit' | undefined
}

// One neutral treatment for every third-party sign-in provider; the provider
// logo goes in `slot="icon"` and the label in the default slot.
export class SpectreExternalAuthButtonElement
  extends SpectreBaseElement
  implements SpectreExternalAuthButtonProps
{
  static properties = {
    ...interactionStateProperties,
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    href: { type: String },
    loading: { type: Boolean, reflect: true },
    type: { type: String }
  }

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  href: string | undefined = undefined
  loading: boolean | undefined = false
  type: 'button' | 'submit' | undefined = 'button'

  private readonly projection = new ProjectionController(this, [
    'data-sp-external-auth-button-native'
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

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('type') &&
      this.type !== 'button' &&
      this.type !== 'submit'
    ) {
      this.type = 'button'
    }
  }

  private get nativeElement(): HTMLElement | null {
    return this.querySelector('[data-sp-external-auth-button-native]')
  }

  override focus(options?: FocusOptions): void {
    this.nativeElement?.focus(options)
  }

  override blur(): void {
    this.nativeElement?.blur()
  }

  // A submit button inside a light-DOM form submits natively.
  override render() {
    const classes = getExternalAuthButtonClasses({
      ...interactionStates(this),
      disabled: this.isDisabled,
      fullWidth: this.fullWidth ?? false,
      loading: this.loading ?? false
    })
    const content = html`${
      this.projection.has('icon')
        ? html`<span class="${getExternalAuthButtonIconClasses()}"
            >${this.projection.nodes('icon')}</span
          >`
        : nothing
    }${this.projection.nodes()}`

    if (this.href) {
      return html`<a
        aria-busy="${ifDefined(this.loading ? 'true' : undefined)}"
        aria-disabled="${ifDefined(this.isDisabled ? 'true' : undefined)}"
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        class="${classes}"
        data-sp-external-auth-button-native
        href="${ifDefined(this.isDisabled ? undefined : this.href)}"
        id="${ifDefined(this.id || undefined)}"
        title="${ifDefined(this.title || undefined)}"
        >${content}</a
      >`
    }

    return html`<button
      aria-busy="${ifDefined(this.loading ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      class="${classes}"
      data-sp-external-auth-button-native
      ?disabled="${this.isDisabled}"
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
      type="${this.type ?? 'button'}"
    >
      ${content}
    </button>`
  }
}

export function defineSpectreExternalAuthButton(
  tagName = 'sp-external-auth-button'
): typeof SpectreExternalAuthButtonElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreExternalAuthButtonElement
  }

  customElements.define(tagName, SpectreExternalAuthButtonElement)
  return SpectreExternalAuthButtonElement
}
