import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreDivider, SpectreDividerElement } from '../src'

describe('sp-divider', () => {
  beforeAll(() => {
    defineSpectreDivider()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native hr with the divider recipe', async () => {
    document.body.innerHTML = '<sp-divider></sp-divider>'
    const element = document.querySelector(
      'sp-divider'
    ) as SpectreDividerElement
    await element.updateComplete
    const rule = element.querySelector('hr')

    expect(rule?.className).toBe('sp-divider')
    expect(rule?.hasAttribute('data-sp-divider-native')).toBe(true)
    expect(element.style.display).toBe('block')
  })

  it('appends sanitized inner-class utilities', async () => {
    document.body.innerHTML =
      '<sp-divider inner-class="sp-my-4 bogus"></sp-divider>'
    const element = document.querySelector(
      'sp-divider'
    ) as SpectreDividerElement
    await element.updateComplete

    expect(element.querySelector('hr')?.className).toBe('sp-divider sp-my-4')
  })

  it('moves id and aria-label to the native hr', async () => {
    document.body.innerHTML =
      '<sp-divider id="split" aria-label="Related reading"></sp-divider>'
    const element = document.querySelector(
      'sp-divider'
    ) as SpectreDividerElement
    await element.updateComplete
    const rule = element.querySelector('hr')

    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false)
    expect(rule?.id).toBe('split')
    expect(rule?.getAttribute('aria-label')).toBe('Related reading')
  })
})
