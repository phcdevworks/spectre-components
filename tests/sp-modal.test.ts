import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreModal, SpectreModalElement } from '../src'

describe('sp-modal', () => {
  beforeAll(() => {
    defineSpectreModal()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders an overlay and a dialog with projected content', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    const heading = document.createElement('h2')
    heading.textContent = 'Confirm'
    element.append(heading)

    document.body.append(element)
    await element.updateComplete

    const overlay = element.querySelector('[data-sp-modal-overlay]')
    const dialog = element.querySelector('[data-sp-modal-native]')

    expect(overlay?.className).toContain('sp-modal-overlay')
    expect(dialog?.className).toContain('sp-modal')
    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.querySelector('h2')?.textContent).toBe('Confirm')
  })

  it('defaults to closed and marks the dialog aria-hidden', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    document.body.append(element)
    await element.updateComplete

    expect(element.open).toBe(false)
    const dialog = element.querySelector('[data-sp-modal-native]')
    expect(dialog?.getAttribute('aria-hidden')).toBe('true')
  })

  it('reflects open onto the overlay and dialog classes', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    element.open = true

    document.body.append(element)
    await element.updateComplete

    const overlay = element.querySelector('[data-sp-modal-overlay]')
    const dialog = element.querySelector('[data-sp-modal-native]')

    expect(overlay?.className).toContain('sp-modal-overlay--open')
    expect(dialog?.className).toContain('sp-modal--open')
    expect(dialog?.hasAttribute('aria-hidden')).toBe(false)
  })

  it('closes on Escape when open', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    await element.updateComplete

    expect(element.open).toBe(false)
  })

  it('dispatches sp-close when Escape closes the modal', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    const closeSpy = vi.fn()
    element.addEventListener('sp-close', closeSpy)

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    await element.updateComplete

    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('closes when the overlay backdrop is clicked but not the dialog itself', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    element.open = true
    document.body.append(element)
    await element.updateComplete

    const dialog = element.querySelector<HTMLElement>('[data-sp-modal-native]')
    dialog?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete
    expect(element.open).toBe(true)

    const overlay = element.querySelector<HTMLElement>(
      '[data-sp-modal-overlay]'
    )
    overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete
    expect(element.open).toBe(false)
  })

  it('moves focus into the dialog when opened', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    const button = document.createElement('button')
    button.textContent = 'Confirm'
    element.append(button)
    document.body.append(element)
    await element.updateComplete

    element.open = true
    await element.updateComplete

    expect(document.activeElement).toBe(button)
  })

  it('restores focus to the previously focused element when closed', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.append(trigger)
    trigger.focus()

    const element = document.createElement('sp-modal') as SpectreModalElement
    document.body.append(element)
    await element.updateComplete

    element.open = true
    await element.updateComplete

    element.open = false
    await element.updateComplete

    expect(document.activeElement).toBe(trigger)
  })

  it('forwards ARIA attributes to the native dialog', async () => {
    const element = document.createElement('sp-modal') as SpectreModalElement
    element.setAttribute('aria-label', 'Delete item')

    document.body.append(element)
    await element.updateComplete

    const dialog = element.querySelector('[data-sp-modal-native]')

    expect(dialog?.getAttribute('aria-label')).toBe('Delete item')
  })
})
