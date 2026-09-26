import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreDatepicker, SpectreDatepickerElement } from '../src'

async function mount(markup: string): Promise<SpectreDatepickerElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-datepicker'
  ) as SpectreDatepickerElement
  await element.updateComplete
  return element
}

function day(
  element: SpectreDatepickerElement,
  iso: string
): HTMLButtonElement | null {
  return element.querySelector(`[data-sp-day="${iso}"]`)
}

async function press(element: SpectreDatepickerElement, key: string) {
  element
    .querySelector('[data-sp-datepicker-grid]')!
    .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await element.updateComplete
  await element.updateComplete
}

describe('sp-datepicker', () => {
  beforeAll(() => {
    defineSpectreDatepicker()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the month of its value in whole weeks', async () => {
    const element = await mount(
      '<sp-datepicker locale="en-US" value="2026-09-15"></sp-datepicker>'
    )
    const days = element.querySelectorAll('[data-sp-day]')
    const title = element.querySelector('.sp-datepicker__header span')

    expect(title?.textContent?.trim()).toBe('September 2026')
    expect(days.length % 7).toBe(0)
    expect(element.querySelectorAll('.sp-datepicker__weekday')).toHaveLength(7)
    expect(day(element, '2026-08-30')?.className).toContain(
      'sp-day--outside-month'
    )
  })

  it('marks the selected day and makes it the tab stop', async () => {
    const element = await mount(
      '<sp-datepicker locale="en-US" value="2026-09-15"></sp-datepicker>'
    )
    const selected = day(element, '2026-09-15')!

    expect(selected.getAttribute('aria-pressed')).toBe('true')
    expect(selected.className).toContain('sp-day--selected')
    expect(selected.getAttribute('tabindex')).toBe('0')
    expect(selected.getAttribute('aria-label')).toBe(
      'Tuesday, September 15, 2026'
    )
    expect(day(element, '2026-09-16')?.getAttribute('tabindex')).toBe('-1')
  })

  it('selects a day on click and emits sp-change', async () => {
    const element = await mount(
      '<sp-datepicker value="2026-09-15"></sp-datepicker>'
    )
    const handler = vi.fn()
    element.addEventListener('sp-change', handler)

    day(element, '2026-09-20')!.click()
    await element.updateComplete

    expect(element.value).toBe('2026-09-20')
    expect((handler.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      value: '2026-09-20'
    })
  })

  it('moves focus with arrow, Home/End, and PageUp/PageDown keys', async () => {
    const element = await mount(
      '<sp-datepicker locale="en-US" value="2026-09-15"></sp-datepicker>'
    )

    await press(element, 'ArrowRight')
    expect(document.activeElement).toBe(day(element, '2026-09-16'))

    await press(element, 'ArrowDown')
    expect(document.activeElement).toBe(day(element, '2026-09-23'))

    await press(element, 'Home')
    expect(document.activeElement).toBe(day(element, '2026-09-20'))

    await press(element, 'End')
    expect(document.activeElement).toBe(day(element, '2026-09-26'))

    await press(element, 'PageDown')
    expect(document.activeElement).toBe(day(element, '2026-10-26'))
    expect(
      element.querySelector('.sp-datepicker__header span')?.textContent?.trim()
    ).toBe('October 2026')
  })

  it('changes month with the header buttons, clamping the day', async () => {
    const element = await mount(
      '<sp-datepicker locale="en-US" value="2026-01-31"></sp-datepicker>'
    )
    element
      .querySelector<HTMLButtonElement>('[data-sp-datepicker-next]')!
      .click()
    await element.updateComplete

    expect(
      element.querySelector('.sp-datepicker__header span')?.textContent?.trim()
    ).toBe('February 2026')
    expect(day(element, '2026-02-28')?.getAttribute('tabindex')).toBe('0')
    expect(element.value).toBe('2026-01-31')
  })

  it('disables days outside min/max', async () => {
    const element = await mount(
      '<sp-datepicker value="2026-09-15" min="2026-09-10" max="2026-09-20"></sp-datepicker>'
    )
    expect(day(element, '2026-09-09')?.disabled).toBe(true)
    expect(day(element, '2026-09-21')?.className).toContain('sp-day--disabled')
    expect(day(element, '2026-09-10')?.disabled).toBe(false)
  })

  it('honors week-start', async () => {
    const element = await mount(
      '<sp-datepicker locale="en-US" value="2026-09-15" week-start="1"></sp-datepicker>'
    )
    expect(
      element.querySelector('.sp-datepicker__weekday')?.textContent?.trim()
    ).toBe('Mon')
  })

  it('rejects malformed values and submits through a hidden input', async () => {
    const element = await mount(
      '<form><sp-datepicker name="due" value="2026-02-30"></sp-datepicker></form>'
    )
    expect(element.value).toBeUndefined()

    element.value = '2026-03-01'
    await element.updateComplete
    expect(new FormData(document.querySelector('form')!).get('due')).toBe(
      '2026-03-01'
    )
  })
})
