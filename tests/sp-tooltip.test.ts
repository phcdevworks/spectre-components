import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreTooltip, SpectreTooltipElement } from '../src'

describe('sp-tooltip', () => {
  beforeAll(() => {
    defineSpectreTooltip()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a trigger wrapper and a tooltip body with role=tooltip', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    const trigger = document.createElement('button')
    trigger.textContent = 'Info'
    const body = document.createElement('span')
    body.setAttribute('slot', 'tooltip')
    body.textContent = 'More details'
    element.append(trigger, body)

    document.body.append(element)
    await element.updateComplete

    const tooltip = element.querySelector('[data-sp-tooltip-native]')

    expect(tooltip?.className).toContain('sp-tooltip')
    expect(tooltip?.getAttribute('role')).toBe('tooltip')
    expect(tooltip?.textContent).toContain('More details')
    expect(
      element.querySelector('[data-sp-tooltip-trigger]')?.textContent
    ).toContain('Info')
  })

  it('defaults to placement=top and visible=false', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    document.body.append(element)
    await element.updateComplete

    expect(element.placement).toBe('top')
    expect(element.visible).toBe(false)
  })

  it('falls back to placement=top for an invalid placement', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    // @ts-expect-error - testing invalid value
    element.placement = 'not-a-placement'

    document.body.append(element)
    await element.updateComplete

    expect(element.placement).toBe('top')
  })

  it('becomes visible on mouseenter and hides on mouseleave', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector<HTMLElement>(
      '[data-sp-tooltip-trigger]'
    )
    trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await element.updateComplete
    expect(element.visible).toBe(true)

    trigger?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    await element.updateComplete
    expect(element.visible).toBe(false)
  })

  it('becomes visible on focusin and hides on focusout', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    document.body.append(element)
    await element.updateComplete

    const trigger = element.querySelector<HTMLElement>(
      '[data-sp-tooltip-trigger]'
    )
    trigger?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await element.updateComplete
    expect(element.visible).toBe(true)

    trigger?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    await element.updateComplete
    expect(element.visible).toBe(false)
  })

  it('reflects placement and visible onto the tooltip classes', async () => {
    const element = document.createElement(
      'sp-tooltip'
    ) as SpectreTooltipElement
    element.placement = 'right'
    element.visible = true

    document.body.append(element)
    await element.updateComplete

    const tooltip = element.querySelector('[data-sp-tooltip-native]')

    expect(tooltip?.className).toContain('sp-tooltip--right')
    expect(tooltip?.className).toContain('sp-tooltip--visible')
  })
})
