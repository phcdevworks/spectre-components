import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreAvatar, SpectreAvatarElement } from '../src'

describe('sp-avatar', () => {
  beforeAll(() => {
    defineSpectreAvatar()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre avatar class and projected content', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    element.append('AB')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-avatar')
    expect(div?.textContent).toContain('AB')
  })

  it('defaults to size=md and shape=circle', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
    expect(element.shape).toBe('circle')
  })

  it('reflects a valid size and shape onto the div classes', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    element.size = 'xl'
    element.shape = 'square'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div?.className).toContain('xl')
    expect(div?.className).toContain('square')
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    // @ts-expect-error - testing invalid value
    element.size = 'huge'

    document.body.append(element)
    await element.updateComplete

    expect(element.size).toBe('md')
  })

  it('falls back to shape=circle for an invalid shape', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    // @ts-expect-error - testing invalid value
    element.shape = 'star'

    document.body.append(element)
    await element.updateComplete

    expect(element.shape).toBe('circle')
  })

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    element.id = 'avatar-1'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(element.getAttribute('id')).toBe('avatar-1')
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(div?.id).toBe('avatar-1')
  })

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    element.setAttribute('aria-label', 'Bradley Potts')

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div?.getAttribute('aria-label')).toBe('Bradley Potts')
    expect(div?.getAttribute('role')).toBe('group')
  })

  it('omits role when no aria-label or aria-labelledby is forwarded', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div')

    expect(div?.hasAttribute('role')).toBe(false)
  })

  it('falls back to disabled=false, loading=false, interactive=false, full-width=false, and placeholder=false when null is assigned', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    document.body.append(element)
    await element.updateComplete

    element.disabled = true
    await element.updateComplete
    expect(element.disabled).toBe(true)

    // @ts-expect-error - testing fallback
    element.disabled = null
    await element.updateComplete
    expect(element.disabled).toBe(false)

    element.loading = true
    await element.updateComplete
    expect(element.loading).toBe(true)

    // @ts-expect-error - testing fallback
    element.loading = null
    await element.updateComplete
    expect(element.loading).toBe(false)

    element.interactive = true
    await element.updateComplete
    expect(element.interactive).toBe(true)

    // @ts-expect-error - testing fallback
    element.interactive = null
    await element.updateComplete
    expect(element.interactive).toBe(false)

    element.fullWidth = true
    await element.updateComplete
    expect(element.fullWidth).toBe(true)

    // @ts-expect-error - testing fallback
    element.fullWidth = null
    await element.updateComplete
    expect(element.fullWidth).toBe(false)

    element.placeholder = true
    await element.updateComplete
    expect(element.placeholder).toBe(true)

    // @ts-expect-error - testing fallback
    element.placeholder = null
    await element.updateComplete
    expect(element.placeholder).toBe(false)
  })

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-avatar') as SpectreAvatarElement
    element.loading = true

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('[data-sp-avatar-native]')
    expect(div?.getAttribute('aria-busy')).toBe('true')

    element.loading = false
    await element.updateComplete
    expect(div?.getAttribute('aria-busy')).toBe('false')
  })
})
