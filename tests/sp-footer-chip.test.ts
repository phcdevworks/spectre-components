import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreFooterChip, SpectreFooterChipElement } from '../src'

describe('sp-footer-chip', () => {
  beforeAll(() => {
    defineSpectreFooterChip()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native span with the Spectre footer chip class and projected content', async () => {
    const element = document.createElement(
      'sp-footer-chip'
    ) as SpectreFooterChipElement
    element.append(document.createTextNode('New'))

    document.body.append(element)
    await element.updateComplete

    const chip = element.querySelector('span')

    expect(chip).not.toBeNull()
    expect(chip?.className).toContain('sp-footer__chip')
    expect(chip?.textContent?.trim()).toBe('New')
  })

  it('defaults to disabled=false', async () => {
    const element = document.createElement(
      'sp-footer-chip'
    ) as SpectreFooterChipElement
    document.body.append(element)
    await element.updateComplete

    expect(element.disabled).toBe(false)
  })

  it('reflects disabled onto the chip class and aria-disabled', async () => {
    const element = document.createElement(
      'sp-footer-chip'
    ) as SpectreFooterChipElement
    element.disabled = true

    document.body.append(element)
    await element.updateComplete

    const chip = element.querySelector('span')
    expect(chip?.className).toContain('sp-footer__chip--disabled')
    expect(chip?.getAttribute('aria-disabled')).toBe('true')
  })

  it('falls back to false when null is assigned', async () => {
    const element = document.createElement(
      'sp-footer-chip'
    ) as SpectreFooterChipElement
    document.body.append(element)
    await element.updateComplete

    // @ts-expect-error - testing fallback
    element.disabled = null
    await element.updateComplete

    expect(element.disabled).toBe(false)
  })

  it('forwards aria-label to the native span', async () => {
    const element = document.createElement(
      'sp-footer-chip'
    ) as SpectreFooterChipElement
    element.setAttribute('aria-label', 'New feature')

    document.body.append(element)
    await element.updateComplete

    const chip = element.querySelector('span')
    expect(chip?.getAttribute('aria-label')).toBe('New feature')
  })
})
