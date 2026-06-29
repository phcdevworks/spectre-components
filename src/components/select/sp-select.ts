import { html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'
import { isInputSize, type SpectreInputSize } from '../../utils/form'

import { getInputClasses } from '@phcdevworks/spectre-ui'

export interface SpectreSelectProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  autocapitalize?: string | null | undefined
  autocomplete?: string | undefined
  autofocus?: boolean | null | undefined
  disabled?: boolean | undefined
  form?: string | undefined
  fullWidth?: boolean | undefined
  id?: string | null | undefined
  invalid?: boolean | undefined
  loading?: boolean | undefined
  name?: string | undefined
  pill?: boolean | undefined
  required?: boolean | undefined
  size?: SpectreInputSize | undefined
  spellcheck?: boolean | null | undefined
  success?: boolean | undefined
  title?: string | null | undefined
  value?: string | undefined
}

export class SpectreSelectElement
  extends SpectreProjectableElement
  implements SpectreSelectProps
{
  static properties = {
    autocomplete: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    value: { type: String }
  }

  autocomplete: string | undefined
  disabled: boolean | undefined = false
  form: string | undefined
  fullWidth: boolean | undefined = false
  invalid: boolean | undefined = false
  loading: boolean | undefined = false
  name: string | undefined
  pill: boolean | undefined = false
  required: boolean | undefined = false
  size: SpectreInputSize | undefined = 'md'
  success: boolean | undefined = false

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

  override get autocapitalize(): string {
    return super.autocapitalize
  }

  override set autocapitalize(value: string | null | undefined) {
    super.autocapitalize = value
  }

  override get autofocus(): boolean {
    return super.autofocus
  }

  override set autofocus(value: boolean | undefined | null) {
    super.autofocus = value
  }

  override get spellcheck(): boolean {
    return super.spellcheck
  }

  override set spellcheck(value: boolean | null | undefined) {
    super.spellcheck = value
  }

  value: string | undefined = ''

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-select-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }

    const el = node as Element
    return el.hasAttribute('data-sp-select-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }

    if (changedProperties.has('fullWidth') && this.fullWidth == null) {
      this.fullWidth = false
    }

    if (changedProperties.has('invalid') && this.invalid == null) {
      this.invalid = false
    }

    if (changedProperties.has('loading') && this.loading == null) {
      this.loading = false
    }

    if (changedProperties.has('pill') && this.pill == null) {
      this.pill = false
    }

    if (changedProperties.has('required') && this.required == null) {
      this.required = false
    }

    if (changedProperties.has('success') && this.success == null) {
      this.success = false
    }

    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }

    if (changedProperties.has('value') && this.value == null) {
      this.value = ''
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)

    const nativeSelect = this.getContentContainer() as HTMLSelectElement | null
    if (!nativeSelect) {
      return
    }

    const valueChanged = changedProperties.has('value')
    const oldValue = changedProperties.get('value')

    if (
      valueChanged &&
      this.value !== undefined &&
      (this.value !== '' ||
        oldValue !== undefined ||
        this.hasAttribute('value'))
    ) {
      if (nativeSelect.value !== this.value) {
        nativeSelect.value = this.value
      }
    }

    if (this.value === '' && !this.hasAttribute('value')) {
      const nativeValue = nativeSelect.value ?? ''
      if (nativeValue !== '' && nativeValue !== this.value) {
        this.updateComplete.then(() => {
          if (this.value === '' && !this.hasAttribute('value')) {
            this.value = nativeValue
          }
        })
      }
    }
  }

  private get selectClasses(): string {
    return getInputClasses({
      fullWidth: this.fullWidth ?? false,
      pill: this.pill ?? false,
      size: this.size as SpectreInputSize,
      state: this.isDisabled
        ? this.disabled
          ? 'disabled'
          : 'loading'
        : this.invalid
          ? 'error'
          : this.success
            ? 'success'
            : 'default'
    })
  }

  private handleInput(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement
    this.value = select.value
  }

  private handleChange(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement
    this.value = select.value
  }

  override focus(options?: FocusOptions): void {
    ;(this.getContentContainer() as HTMLSelectElement | null)?.focus(options)
  }

  override blur(): void {
    ;(this.getContentContainer() as HTMLSelectElement | null)?.blur()
  }

  override render() {
    return html`<select
      aria-busy="${this.loading ? 'true' : 'false'}"
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-invalid="${ifDefined(this.invalid ? 'true' : undefined)}"
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      autocapitalize="${ifDefined(this.autocapitalize || undefined)}"
      autocomplete="${ifDefined(this.autocomplete || undefined)}"
      ?autofocus="${this.autofocus}"
      class="${this.selectClasses}"
      data-sp-select-native
      ?disabled="${this.isDisabled}"
      form="${ifDefined(this.form || undefined)}"
      id="${ifDefined(this.id || undefined)}"
      name="${ifDefined(this.name || undefined)}"
      ?required="${this.required}"
      spellcheck="${ifDefined(this.getAttribute('spellcheck') ?? undefined)}"
      title="${ifDefined(this.title || undefined)}"
      .value="${live(this.value)}"
      @change="${this.handleChange}"
      @input="${this.handleInput}"
    >
      ${this.hasProjectedContent ? this.projectedContent : nothing}
    </select>`
  }
}

export function defineSpectreSelect(
  tagName = 'sp-select'
): typeof SpectreSelectElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSelectElement
  }

  customElements.define(tagName, SpectreSelectElement)
  return SpectreSelectElement
}
