import { html, type TemplateResult } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isInputSize,
  normalizeInt,
  type SpectreInputSize
} from '../../utils/form'

import {
  getPaginationClasses,
  getPaginationEllipsisClasses,
  getPaginationItemClasses,
  type PaginationSize
} from '@phcdevworks/spectre-ui'

export interface SpectrePaginationProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  hrefTemplate?: string | undefined
  id?: string | null | undefined
  nextLabel?: string | undefined
  page?: number | undefined
  previousLabel?: string | undefined
  siblings?: number | undefined
  size?: SpectreInputSize | undefined
  title?: string | null | undefined
  total?: number | undefined
}

type PageEntry = number | 'ellipsis'

// Always shows the first and last page plus `siblings` pages either side of
// the current one; an ellipsis only replaces a gap of two or more pages.
function pageRange(page: number, total: number, siblings: number): PageEntry[] {
  const pages = (from: number, to: number): number[] =>
    Array.from({ length: to - from + 1 }, (_, index) => from + index)

  if (total <= siblings * 2 + 5) {
    return pages(1, total)
  }

  const left = Math.max(page - siblings, 1)
  const right = Math.min(page + siblings, total)
  const leftGap = left > 3
  const rightGap = right < total - 2
  const edgeCount = siblings * 2 + 3

  if (!leftGap) {
    return [...pages(1, edgeCount), 'ellipsis', total]
  }
  if (!rightGap) {
    return [1, 'ellipsis', ...pages(total - edgeCount + 1, total)]
  }
  return [1, 'ellipsis', ...pages(left, right), 'ellipsis', total]
}

interface ItemOptions {
  active?: boolean
  disabled?: boolean
  label?: string
}

export class SpectrePaginationElement
  extends SpectreBaseElement
  implements SpectrePaginationProps
{
  static properties = {
    hrefTemplate: { attribute: 'href-template', type: String },
    nextLabel: { attribute: 'next-label', type: String },
    page: { type: Number, reflect: true },
    previousLabel: { attribute: 'previous-label', type: String },
    siblings: { type: Number },
    size: { type: String, reflect: true },
    total: { type: Number, reflect: true }
  }

  hrefTemplate: string | undefined = undefined
  nextLabel: string | undefined = 'Next'
  page: number | undefined = 1
  previousLabel: string | undefined = 'Previous'
  siblings: number | undefined = 1
  size: SpectreInputSize | undefined = 'md'
  total: number | undefined = 1

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
    if (changedProperties.has('total')) {
      this.total = normalizeInt(this.total, 1, 1)
    }
    if (changedProperties.has('page') || changedProperties.has('total')) {
      const page = normalizeInt(this.page, 1, 1) ?? 1
      this.page = Math.min(page, this.total ?? 1)
    }
    if (changedProperties.has('siblings')) {
      this.siblings = normalizeInt(this.siblings, 1)
    }
    if (
      changedProperties.has('size') &&
      (this.size == null || !isInputSize(this.size))
    ) {
      this.size = 'md'
    }
    if (changedProperties.has('previousLabel') && !this.previousLabel) {
      this.previousLabel = 'Previous'
    }
    if (changedProperties.has('nextLabel') && !this.nextLabel) {
      this.nextLabel = 'Next'
    }
  }

  private get navLabel(): string | undefined {
    if (this.forwardedAriaLabel) {
      return this.forwardedAriaLabel
    }
    return this.forwardedAriaLabelledBy ? undefined : 'Pagination'
  }

  private goTo(target: number): void {
    if (target === this.page || target < 1 || target > (this.total ?? 1)) {
      return
    }
    this.page = target
    this.dispatchEvent(
      new CustomEvent('sp-change', { bubbles: true, detail: { page: target } })
    )
  }

  private renderItem(
    target: number,
    content: string | number,
    { active = false, disabled = false, label }: ItemOptions
  ): TemplateResult {
    const classes = getPaginationItemClasses({ active, disabled })
    const current = active ? 'page' : undefined

    if (this.hrefTemplate) {
      if (disabled) {
        return html`<a aria-disabled="true" class="${classes}">${content}</a>`
      }
      return html`<a
        aria-current="${ifDefined(current)}"
        aria-label="${ifDefined(label)}"
        class="${classes}"
        href="${this.hrefTemplate.split('{page}').join(String(target))}"
        @click="${() => this.goTo(target)}"
        >${content}</a
      >`
    }

    return html`<button
      aria-current="${ifDefined(current)}"
      aria-label="${ifDefined(label)}"
      class="${classes}"
      ?disabled="${disabled}"
      type="button"
      @click="${() => this.goTo(target)}"
    >
      ${content}
    </button>`
  }

  override render() {
    const page = this.page ?? 1
    const total = this.total ?? 1

    return html`<nav
      aria-label="${ifDefined(this.navLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      data-sp-pagination-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      <ul
        class="${getPaginationClasses({ size: this.size as PaginationSize })}"
      >
        <li>
          ${this.renderItem(page - 1, this.previousLabel ?? 'Previous', {
            disabled: page <= 1
          })}
        </li>
        ${pageRange(page, total, this.siblings ?? 1).map((entry) =>
          entry === 'ellipsis'
            ? html`<li>
                <span
                  aria-hidden="true"
                  class="${getPaginationEllipsisClasses()}"
                  >…</span
                >
              </li>`
            : html`<li>
                ${this.renderItem(entry, entry, {
                  active: entry === page,
                  label: `Page ${entry}`
                })}
              </li>`
        )}
        <li>
          ${this.renderItem(page + 1, this.nextLabel ?? 'Next', {
            disabled: page >= total
          })}
        </li>
      </ul>
    </nav>`
  }
}

export function defineSpectrePagination(
  tagName = 'sp-pagination'
): typeof SpectrePaginationElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectrePaginationElement
  }

  customElements.define(tagName, SpectrePaginationElement)
  return SpectrePaginationElement
}
