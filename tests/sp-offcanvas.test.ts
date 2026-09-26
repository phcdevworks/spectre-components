import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreOffcanvas, SpectreOffcanvasElement } from '../src'

async function renderOffcanvas(
  markup: string
): Promise<SpectreOffcanvasElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-offcanvas'
  ) as SpectreOffcanvasElement
  await element.updateComplete
  return element
}

function panel(element: SpectreOffcanvasElement): HTMLElement {
  return element.querySelector('[data-sp-offcanvas-native]') as HTMLElement
}

const FILTERS = `<sp-offcanvas label="Filters">
  <button type="button" id="apply">Apply</button>
  <div slot="footer"><button type="button">Reset</button></div>
</sp-offcanvas>`

describe('sp-offcanvas', () => {
  beforeAll(() => {
    defineSpectreOffcanvas()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a closed, inert dialog with backdrop, header, body, and footer', async () => {
    const element = await renderOffcanvas(FILTERS)
    const dialog = panel(element)
    const backdrop = element.querySelector('[data-sp-offcanvas-backdrop]')

    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.hasAttribute('inert')).toBe(true)
    expect(dialog.className).toContain('sp-offcanvas--start')
    expect(dialog.className).not.toContain('sp-offcanvas--open')
    expect(backdrop?.className).not.toContain('sp-offcanvas-backdrop--open')
    expect(dialog.querySelector('.sp-offcanvas__body #apply')).not.toBeNull()
    expect(
      dialog.querySelector('.sp-offcanvas__footer')?.textContent?.trim()
    ).toBe('Reset')
  })

  it('labels the dialog with the header title', async () => {
    const element = await renderOffcanvas(FILTERS)
    const dialog = panel(element)
    const titleId = dialog.getAttribute('aria-labelledby')

    expect(titleId).toBeTruthy()
    expect(element.querySelector(`#${titleId}`)?.textContent?.trim()).toBe(
      'Filters'
    )
  })

  it('opens, focuses the first focusable element, and restores focus on close', async () => {
    const trigger = document.createElement('button')
    const element = await renderOffcanvas(FILTERS)
    document.body.prepend(trigger)
    trigger.focus()

    element.open = true
    await element.updateComplete

    expect(panel(element).hasAttribute('inert')).toBe(false)
    expect(panel(element).className).toContain('sp-offcanvas--open')
    expect(document.activeElement).toBe(
      element.querySelector('[data-sp-offcanvas-close]')
    )

    element.open = false
    await element.updateComplete
    expect(document.activeElement).toBe(trigger)
  })

  it('closes on Escape, close button, and backdrop click with sp-close', async () => {
    const element = await renderOffcanvas(FILTERS)
    const handler = vi.fn()
    element.addEventListener('sp-close', handler)

    element.open = true
    await element.updateComplete
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await element.updateComplete
    expect(element.open).toBe(false)

    element.open = true
    await element.updateComplete
    element
      .querySelector<HTMLButtonElement>('[data-sp-offcanvas-close]')
      ?.click()
    await element.updateComplete
    expect(element.open).toBe(false)

    element.open = true
    await element.updateComplete
    element.querySelector<HTMLElement>('[data-sp-offcanvas-backdrop]')?.click()
    await element.updateComplete
    expect(element.open).toBe(false)

    expect(handler).toHaveBeenCalledTimes(3)
  })

  it('applies placement and falls back to start for an invalid one', async () => {
    const element = await renderOffcanvas(
      FILTERS.replace('<sp-offcanvas', '<sp-offcanvas placement="end"')
    )
    expect(panel(element).className).toContain('sp-offcanvas--end')

    element.setAttribute('placement', 'middle')
    await element.updateComplete
    expect(element.placement).toBe('start')
  })

  it('uses a custom close label', async () => {
    const element = await renderOffcanvas(
      FILTERS.replace(
        '<sp-offcanvas',
        '<sp-offcanvas close-label="Hide filters"'
      )
    )
    expect(
      element
        .querySelector('[data-sp-offcanvas-close]')
        ?.getAttribute('aria-label')
    ).toBe('Hide filters')
  })

  it('prefers a consumer aria-label over the header title', async () => {
    const element = await renderOffcanvas(
      FILTERS.replace(
        '<sp-offcanvas',
        '<sp-offcanvas aria-label="Search filters"'
      )
    )
    expect(panel(element).getAttribute('aria-label')).toBe('Search filters')
    expect(panel(element).hasAttribute('aria-labelledby')).toBe(false)
  })
})
