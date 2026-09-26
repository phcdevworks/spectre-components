import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { hasMeaningfulContent } from '../../utils/dom'
import { ProjectionController } from '../../utils/projection'

import {
  getBreadcrumbClasses,
  getBreadcrumbItemClasses,
  getBreadcrumbLinkClasses,
  getBreadcrumbSeparatorClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreBreadcrumbProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  id?: string | null | undefined
  separator?: string | undefined
  title?: string | null | undefined
}

export class SpectreBreadcrumbElement
  extends SpectreBaseElement
  implements SpectreBreadcrumbProps
{
  static properties = {
    separator: { type: String }
  }

  separator: string | undefined = undefined

  private readonly projection = new ProjectionController(this, [
    'data-sp-breadcrumb-native'
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

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    const linkClasses = getBreadcrumbLinkClasses()
    this.crumbs.forEach((crumb) => {
      if (crumb instanceof HTMLAnchorElement) {
        crumb.classList.add(linkClasses)
      }
    })
  }

  private get crumbs(): Node[] {
    return this.projection
      .nodes()
      .filter((node) => hasMeaningfulContent([node]))
  }

  private get navLabel(): string | undefined {
    if (this.forwardedAriaLabel) {
      return this.forwardedAriaLabel
    }
    return this.forwardedAriaLabelledBy ? undefined : 'Breadcrumb'
  }

  override render() {
    const crumbs = this.crumbs
    const separator = this.separator?.trim()

    return html`<nav
      aria-label="${ifDefined(this.navLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      data-sp-breadcrumb-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <ol
        class="${getBreadcrumbClasses({ customSeparator: Boolean(separator) })}"
      >
        ${crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1
          return html`<li
            aria-current="${ifDefined(current ? 'page' : undefined)}"
            class="${getBreadcrumbItemClasses({ current })}"
          >
            ${
              separator && index > 0
                ? html`<span
                    aria-hidden="true"
                    class="${getBreadcrumbSeparatorClasses()}"
                    >${separator}</span
                  >`
                : nothing
            }${crumb}
          </li>`
        })}
      </ol>
    </nav>`
  }
}

export function defineSpectreBreadcrumb(
  tagName = 'sp-breadcrumb'
): typeof SpectreBreadcrumbElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreBreadcrumbElement
  }

  customElements.define(tagName, SpectreBreadcrumbElement)
  return SpectreBreadcrumbElement
}
