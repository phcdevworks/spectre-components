import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isAlertVariant,
  isInputSize,
  type SpectreAlertVariant,
  type SpectreInputSize
} from '../../utils/form'
import { renderIcon } from '../../utils/icons'
import { ProjectionController } from '../../utils/projection'

import {
  interactionStateProperties,
  interactionStates,
  type SpectreInteractionStateProps
} from '../../utils/states'

import {
  getAlertClasses,
  getAlertDismissClasses,
  getAlertIconClasses,
  type AlertVariant,
  type AlertSize
} from '@phcdevworks/spectre-ui'

export interface SpectreAlertProps extends SpectreInteractionStateProps {
  interactive?: boolean | undefined
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  dismissLabel?: string | undefined
  dismissed?: boolean | undefined
  dismissible?: boolean | undefined
  disabled?: boolean | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  loading?: boolean | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  variant?: SpectreAlertVariant | undefined
}

export class SpectreAlertElement
  extends SpectreBaseElement
  implements SpectreAlertProps
{
  static properties = {
    interactive: { type: Boolean, reflect: true },
    ...interactionStateProperties,
    dismissLabel: { attribute: 'dismiss-label', type: String },
    dismissed: { type: Boolean, reflect: true },
    dismissible: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  interactive: boolean | undefined = false

  active: boolean | undefined = false
  focused: boolean | undefined = false
  hovered: boolean | undefined = false

  dismissLabel: string | undefined = 'Dismiss'
  dismissed: boolean | undefined = false
  dismissible: boolean | undefined = false
  disabled: boolean | undefined = false
  fullWidth: boolean | undefined = false
  loading: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  variant: SpectreAlertVariant | undefined = 'info'

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

  private readonly projection = new ProjectionController(this, [
    'data-sp-alert-native'
  ])

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('dismissLabel') && !this.dismissLabel) {
      this.dismissLabel = 'Dismiss'
    }
    if (changedProperties.has('dismissed') && this.dismissed == null) {
      this.dismissed = false
    }
    if (changedProperties.has('dismissible') && this.dismissible == null) {
      this.dismissible = false
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }
    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false
    }
    if (
      changedProperties.has('variant') &&
      (this.variant == null || !isAlertVariant(this.variant))
    ) {
      this.variant = 'info'
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
  }

  private dismiss(): void {
    if (this.dismissed) {
      return
    }
    this.dismissed = true
    this.dispatchEvent(new CustomEvent('sp-dismiss', { bubbles: true }))
  }

  private get alertClasses(): string {
    return getAlertClasses({
      interactive: this.interactive ?? false,
      ...interactionStates(this),
      disabled: this.isDisabled,
      dismissed: this.dismissed ?? false,
      dismissible: this.dismissible ?? false,
      fullWidth: this.fullWidth ?? false,
      loading: this.loading ?? false,
      size: this.size as AlertSize,
      variant: this.variant as AlertVariant
    })
  }

  override render() {
    return html`<div
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${this.alertClasses}"
      data-sp-alert-native
      id="${ifDefined(this.id || undefined)}"
      role="alert"
      title="${ifDefined(this.title || undefined)}"
    >
      ${
        this.projection.has('icon')
          ? html`<span class="${getAlertIconClasses()}"
              >${this.projection.nodes('icon')}</span
            >`
          : nothing
      }
      ${this.projection.has() ? this.projection.nodes() : nothing}
      ${
        this.dismissible
          ? html`<button
              aria-label="${this.dismissLabel ?? 'Dismiss'}"
              class="${getAlertDismissClasses()}"
              data-sp-alert-dismiss
              type="button"
              @click="${() => this.dismiss()}"
            >
              ${renderIcon('close')}
            </button>`
          : nothing
      }
    </div>`
  }
}

export function defineSpectreAlert(
  tagName = 'sp-alert'
): typeof SpectreAlertElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreAlertElement
  }

  customElements.define(tagName, SpectreAlertElement)
  return SpectreAlertElement
}
