import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreToast, SpectreToastElement } from '../src'

describe('sp-toast', () => {
  beforeAll(() => {
    defineSpectreToast()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('renders a native div with role=status and projected content', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    element.append('Saved successfully')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-toast-native]')

    expect(div?.className).toContain('sp-toast')
    expect(div?.getAttribute('role')).toBe('status')
    expect(div?.getAttribute('aria-live')).toBe('polite')
    expect(div?.textContent).toContain('Saved successfully')
  })

  it('defaults to variant=info and dismissed=false', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('info')
    expect(element.dismissed).toBe(false)
  })

  it('falls back to variant=info for an invalid variant', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant'

    document.body.append(element)
    await element.updateComplete

    expect(element.variant).toBe('info')
  })

  it('omits the icon container when there is no slot="icon" content', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    document.body.append(element)
    await element.updateComplete

    expect(element.querySelector('[data-sp-toast-icon]')).toBeNull()
  })

  it('renders an icon container when slot="icon" content is present', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    const icon = document.createElement('span')
    icon.setAttribute('slot', 'icon')
    icon.textContent = '!'
    element.append(icon)

    document.body.append(element)
    await element.updateComplete

    const iconContainer = element.querySelector('[data-sp-toast-icon]')
    expect(iconContainer?.className).toContain('sp-toast__icon')
    expect(iconContainer?.textContent?.trim()).toBe('!')
  })

  it('dismisses imperatively via dismiss() and reflects the dismissed class', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    document.body.append(element)
    await element.updateComplete

    element.dismiss()
    await element.updateComplete

    expect(element.dismissed).toBe(true)
    const div = element.querySelector('[data-sp-toast-native]')
    expect(div?.className).toContain('sp-toast--dismissed')
  })

  it('shows again via show() after being dismissed', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    element.dismissed = true
    document.body.append(element)
    await element.updateComplete

    element.show()
    await element.updateComplete

    expect(element.dismissed).toBe(false)
  })

  it('dispatches sp-dismiss and sp-show events', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    document.body.append(element)
    await element.updateComplete

    const dismissSpy = vi.fn()
    element.addEventListener('sp-dismiss', dismissSpy)
    element.dismiss()
    await element.updateComplete
    expect(dismissSpy).toHaveBeenCalledTimes(1)

    const showSpy = vi.fn()
    element.addEventListener('sp-show', showSpy)
    element.show()
    await element.updateComplete
    expect(showSpy).toHaveBeenCalledTimes(1)
  })

  it('auto-dismisses after the auto-dismiss duration elapses', async () => {
    vi.useFakeTimers()

    const element = document.createElement('sp-toast') as SpectreToastElement
    element.autoDismiss = 3000
    document.body.append(element)
    await element.updateComplete

    expect(element.dismissed).toBe(false)

    vi.advanceTimersByTime(3000)
    await element.updateComplete

    expect(element.dismissed).toBe(true)
  })

  it('reflects full-width onto the div classes', async () => {
    const element = document.createElement('sp-toast') as SpectreToastElement
    element.fullWidth = true

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-toast-native]')

    expect(div?.className).toContain('sp-toast--full')
  })
})
