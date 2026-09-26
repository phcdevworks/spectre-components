import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { createUniqueId } from '../../utils/dom'
import { normalizeInt } from '../../utils/form'
import { renderIcon } from '../../utils/icons'

import {
  getButtonClasses,
  getDatepickerClasses,
  getDatepickerGridClasses,
  getDatepickerHeaderClasses,
  getDatepickerWeekdayClasses,
  getDayClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreDatepickerProps {
  ariaLabel?: string | null
  id?: string | null | undefined
  locale?: string | undefined
  max?: string | undefined
  min?: string | undefined
  name?: string | undefined
  nextLabel?: string | undefined
  previousLabel?: string | undefined
  title?: string | null | undefined
  value?: string | undefined
  weekStart?: number | undefined
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Local calendar dates only: `YYYY-MM-DD` with no time zone shift.
function parseIsoDate(value: string | null | undefined): Date | undefined {
  const match = value ? ISO_DATE.exec(value) : null
  if (!match) {
    return undefined
  }
  const [year, month, day] = [
    Number(match[1]),
    Number(match[2]),
    Number(match[3])
  ]
  const date = new Date(year, month - 1, day)
  return date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

// Keeps the day of month where possible, clamping to the target month's end.
function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return target
}

function today(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// An inline calendar grid. Values are local ISO dates (`YYYY-MM-DD`).
export class SpectreDatepickerElement
  extends SpectreBaseElement
  implements SpectreDatepickerProps
{
  static properties = {
    activeDate: { state: true },
    locale: { type: String },
    max: { type: String },
    min: { type: String },
    name: { type: String },
    nextLabel: { attribute: 'next-label', type: String },
    previousLabel: { attribute: 'previous-label', type: String },
    value: { type: String, reflect: true },
    weekStart: { attribute: 'week-start', type: Number }
  }

  locale: string | undefined = undefined
  max: string | undefined = undefined
  min: string | undefined = undefined
  name: string | undefined = undefined
  nextLabel: string | undefined = 'Next month'
  previousLabel: string | undefined = 'Previous month'
  value: string | undefined = undefined
  weekStart: number | undefined = 0

  // The roving-focus day; its month is the one on display.
  private activeDate: Date = today()
  private readonly titleId = `${createUniqueId('sp-datepicker')}-title`

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
    this.style.display ||= 'inline-block'
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('value')) {
      const parsed = parseIsoDate(this.value)
      if (this.value && !parsed) {
        this.value = undefined
      } else if (parsed) {
        this.activeDate = parsed
      }
    }
    if (changedProperties.has('min') && !parseIsoDate(this.min)) {
      this.min = undefined
    }
    if (changedProperties.has('max') && !parseIsoDate(this.max)) {
      this.max = undefined
    }
    if (changedProperties.has('weekStart')) {
      const weekStart = normalizeInt(this.weekStart, 0) ?? 0
      this.weekStart = weekStart > 6 ? 0 : weekStart
    }
    if (changedProperties.has('nextLabel') && !this.nextLabel) {
      this.nextLabel = 'Next month'
    }
    if (changedProperties.has('previousLabel') && !this.previousLabel) {
      this.previousLabel = 'Previous month'
    }
  }

  private isOutOfRange(date: Date): boolean {
    const iso = toIsoDate(date)
    return (
      (this.min !== undefined && iso < this.min) ||
      (this.max !== undefined && iso > this.max)
    )
  }

  private get visibleDays(): Date[] {
    const first = new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth(),
      1
    )
    const daysInMonth = new Date(
      first.getFullYear(),
      first.getMonth() + 1,
      0
    ).getDate()
    const leading = (first.getDay() - (this.weekStart ?? 0) + 7) % 7
    const count = Math.ceil((leading + daysInMonth) / 7) * 7
    const start = addDays(first, -leading)
    return Array.from({ length: count }, (_, index) => addDays(start, index))
  }

  private select(date: Date): void {
    if (this.isOutOfRange(date)) {
      return
    }
    this.activeDate = date
    const value = toIsoDate(date)
    if (value === this.value) {
      return
    }
    this.value = value
    this.dispatchEvent(
      new CustomEvent('sp-change', { bubbles: true, detail: { value } })
    )
  }

  private showMonth(offset: number): void {
    this.activeDate = addMonths(this.activeDate, offset)
  }

  private handleKeydown = async (event: KeyboardEvent): Promise<void> => {
    const active = this.activeDate
    const weekday = (active.getDay() - (this.weekStart ?? 0) + 7) % 7
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(active, -1),
      ArrowRight: () => addDays(active, 1),
      ArrowUp: () => addDays(active, -7),
      ArrowDown: () => addDays(active, 7),
      Home: () => addDays(active, -weekday),
      End: () => addDays(active, 6 - weekday),
      PageUp: () => addMonths(active, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(active, event.shiftKey ? 12 : 1)
    }
    const move = moves[event.key]
    if (!move) {
      return
    }
    event.preventDefault()
    this.activeDate = move()
    await this.updateComplete
    this.querySelector<HTMLButtonElement>(
      `[data-sp-day="${toIsoDate(this.activeDate)}"]`
    )?.focus()
  }

  private renderDay(date: Date) {
    const iso = toIsoDate(date)
    const selected = iso === this.value
    const isToday = iso === toIsoDate(today())
    const disabled = this.isOutOfRange(date)
    const label = new Intl.DateTimeFormat(this.locale, {
      dateStyle: 'full'
    }).format(date)

    return html`<button
      aria-current="${ifDefined(isToday ? 'date' : undefined)}"
      aria-label="${label}"
      aria-pressed="${selected ? 'true' : 'false'}"
      class="${getDayClasses({
        disabled,
        outsideMonth: date.getMonth() !== this.activeDate.getMonth(),
        selected,
        today: isToday
      })}"
      data-sp-day="${iso}"
      ?disabled="${disabled}"
      tabindex="${iso === toIsoDate(this.activeDate) ? '0' : '-1'}"
      type="button"
      @click="${() => this.select(date)}"
    >
      ${date.getDate()}
    </button>`
  }

  override render() {
    const days = this.visibleDays
    const weekdayFormat = new Intl.DateTimeFormat(this.locale, {
      weekday: 'short'
    })
    const navClasses = getButtonClasses({
      iconOnly: true,
      size: 'sm',
      variant: 'ghost'
    })

    return html`<div
      aria-label="${ifDefined(this.forwardedAriaLabel)}"
      aria-labelledby="${ifDefined(
        this.forwardedAriaLabel ? undefined : this.titleId
      )}"
      class="${getDatepickerClasses()}"
      data-sp-datepicker-native
      id="${ifDefined(this.id || undefined)}"
      role="group"
      title="${ifDefined(this.title || undefined)}"
    >
      <div class="${getDatepickerHeaderClasses()}">
        <button
          aria-label="${this.previousLabel ?? 'Previous month'}"
          class="${navClasses}"
          data-sp-datepicker-prev
          type="button"
          @click="${() => this.showMonth(-1)}"
        >
          ${renderIcon('chevronLeft')}
        </button>
        <span aria-live="polite" id="${this.titleId}"
          >${new Intl.DateTimeFormat(this.locale, {
            month: 'long',
            year: 'numeric'
          }).format(this.activeDate)}</span
        >
        <button
          aria-label="${this.nextLabel ?? 'Next month'}"
          class="${navClasses}"
          data-sp-datepicker-next
          type="button"
          @click="${() => this.showMonth(1)}"
        >
          ${renderIcon('chevronRight')}
        </button>
      </div>
      <div
        class="${getDatepickerGridClasses()}"
        data-sp-datepicker-grid
        @keydown="${this.handleKeydown}"
      >
        ${days
          .slice(0, 7)
          .map(
            (date) =>
              html`<span
                aria-hidden="true"
                class="${getDatepickerWeekdayClasses()}"
                >${weekdayFormat.format(date)}</span
              >`
          )}
        ${days.map((date) => this.renderDay(date))}
      </div>
      ${
        this.name
          ? html`<input
              name="${this.name}"
              type="hidden"
              .value="${this.value ?? ''}"
            />`
          : nothing
      }
    </div>`
  }
}

export function defineSpectreDatepicker(
  tagName = 'sp-datepicker'
): typeof SpectreDatepickerElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreDatepickerElement
  }

  customElements.define(tagName, SpectreDatepickerElement)
  return SpectreDatepickerElement
}
