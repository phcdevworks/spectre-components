import { html, nothing, svg } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

import { SpectreBaseElement } from '../../utils/base'
import { isIconSize, type SpectreIconSize } from '../../utils/form'
import {
  getIcon,
  iconTextSize,
  onIconsRegistered
} from '../../utils/icon-registry'

import { getIconSizeClasses } from '@phcdevworks/spectre-ui'

export interface SpectreIconProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  ariaDescribedBy?: string | null
  id?: string | null | undefined
  label?: string | undefined
  name?: string | undefined
  set?: string | undefined
  size?: SpectreIconSize | undefined
  title?: string | null | undefined
}

export class SpectreIconElement
  extends SpectreBaseElement
  implements SpectreIconProps
{
  static properties = {
    label: { type: String, reflect: true },
    name: { type: String, reflect: true },
    set: { type: String, reflect: true },
    size: { type: String, reflect: true }
  }

  label: string | undefined
  name: string | undefined
  set: string | undefined = 'lucide'
  size: SpectreIconSize | undefined

  private unsubscribe: (() => void) | undefined

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
    this.unsubscribe = onIconsRegistered(() => this.requestUpdate())
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.unsubscribe?.()
    this.unsubscribe = undefined
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('set') && !this.set?.trim()) {
      this.set = 'lucide'
    }
    if (
      changedProperties.has('size') &&
      this.size != null &&
      !isIconSize(this.size)
    ) {
      this.size = undefined
    }
  }

  private get accessibleLabel(): string | undefined {
    return this.label?.trim() || this.forwardedAriaLabel
  }

  override render() {
    const glyph = this.name ? getIcon(this.set ?? 'lucide', this.name) : null
    if (!glyph) return nothing

    const label = this.accessibleLabel
    const labelled = Boolean(label || this.forwardedAriaLabelledBy)
    const dimension = this.size ? undefined : iconTextSize

    return html`<svg
      aria-describedby="${ifDefined(this.forwardedAriaDescribedBy)}"
      aria-hidden="${ifDefined(labelled ? undefined : 'true')}"
      aria-label="${ifDefined(label)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      class="${ifDefined(
        this.size ? getIconSizeClasses({ size: this.size }) : undefined
      )}"
      data-sp-icon-native
      fill="${glyph.outline ? 'none' : 'currentColor'}"
      focusable="false"
      height="${ifDefined(dimension)}"
      id="${ifDefined(this.id || undefined)}"
      role="${ifDefined(labelled ? 'img' : undefined)}"
      stroke="${ifDefined(glyph.outline ? 'currentColor' : undefined)}"
      stroke-linecap="${ifDefined(glyph.outline ? 'round' : undefined)}"
      stroke-linejoin="${ifDefined(glyph.outline ? 'round' : undefined)}"
      stroke-width="${ifDefined(glyph.outline ? '2' : undefined)}"
      viewBox="${glyph.viewBox}"
      width="${ifDefined(dimension)}"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${this.title ? svg`<title>${this.title}</title>` : nothing}${unsafeSVG(
        glyph.body
      )}
    </svg>`
  }
}

export function defineSpectreIcon(
  tagName = 'sp-icon'
): typeof SpectreIconElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreIconElement
  }

  customElements.define(tagName, SpectreIconElement)
  return SpectreIconElement
}
