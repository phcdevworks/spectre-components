import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreGrid, SpectreGridElement } from '../src'

describe('sp-grid', () => {
  beforeAll(() => {
    defineSpectreGrid()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre grid class and projected content', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    const card = document.createElement('div')
    card.textContent = 'Grid item'
    element.append(card)

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-grid')
    expect(div?.textContent).toContain('Grid item')
  })

  it('defaults to columns=1 and gap=md', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    document.body.append(element)
    await element.updateComplete

    expect(element.columns).toBe(1)
    expect(element.gap).toBe('md')
  })

  it('reflects valid columns and gap onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.columns = 3
    element.gap = 'lg'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')

    expect(div?.className).toContain('sp-grid-cols-3')
    expect(div?.className).toContain('sp-grid--gap-lg')
  })

  it('falls back to columns=1 for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    // @ts-expect-error - testing invalid value
    element.columns = 5

    document.body.append(element)
    await element.updateComplete

    expect(element.columns).toBe(1)
  })

  it('falls back to gap=md for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    // @ts-expect-error - testing invalid value
    element.gap = 'not-a-gap'

    document.body.append(element)
    await element.updateComplete

    expect(element.gap).toBe('md')
  })

  it('defaults to span=undefined and applies no span class', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    document.body.append(element)
    await element.updateComplete

    expect(element.span).toBeUndefined()
    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).not.toContain('sp-col-span-')
  })

  it('reflects a single span value onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.span = 6

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-col-span-6')
  })

  it('reflects per-breakpoint span options onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.span = { base: 12, md: 6, lg: 4 }

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-col-span-12')
    expect(div?.className).toContain('sp-md-col-span-6')
    expect(div?.className).toContain('sp-lg-col-span-4')
  })

  it('falls back to span=undefined for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    // @ts-expect-error - testing invalid value
    element.span = 'not-a-span'

    document.body.append(element)
    await element.updateComplete

    expect(element.span).toBeUndefined()
  })

  it('reflects columnGap and rowGap onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.columnGap = 'sm'
    element.rowGap = 'lg'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-grid--column-gap-sm')
    expect(div?.className).toContain('sp-grid--row-gap-lg')
  })

  it('defaults to align=undefined and applies no align class', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    document.body.append(element)
    await element.updateComplete

    expect(element.align).toBeUndefined()
    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).not.toContain('sp-grid--align-')
  })

  it('reflects a valid align onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.align = 'baseline'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-grid--align-baseline')
  })

  it('falls back to align=undefined for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    // @ts-expect-error - testing invalid value
    element.align = 'not-an-align'

    document.body.append(element)
    await element.updateComplete

    expect(element.align).toBeUndefined()
  })

  it('reflects offset, rowSpan, rowOffset, and order onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.offset = 2
    element.rowSpan = 3
    element.rowOffset = 1
    element.order = 'first'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-col-offset-2')
    expect(div?.className).toContain('sp-row-span-3')
    expect(div?.className).toContain('sp-row-offset-1')
    expect(div?.className).toContain('sp-order-first')
  })

  it('reflects leadingTracks and fixedTracks onto the div classes', async () => {
    const leading = document.createElement('sp-grid') as SpectreGridElement
    leading.columns = 3
    leading.leadingTracks = { weight: 2 }
    document.body.append(leading)
    await leading.updateComplete
    expect(
      leading.querySelector('div[data-sp-grid-native]')?.className
    ).toContain('sp-lg-grid-leading-2-of-3')

    const fixed = document.createElement('sp-grid') as SpectreGridElement
    fixed.fixedTracks = { count: 3 }
    document.body.append(fixed)
    await fixed.updateComplete
    expect(
      fixed.querySelector('div[data-sp-grid-native]')?.className
    ).toContain('sp-grid-fixed-tracks-3')
  })

  it('reflects explicitTemplate onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.explicitTemplate = { template: 'edge-fluid-edge' }

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')
    expect(div?.className).toContain('sp-grid-template--edge-fluid-edge')
  })

  it('falls back to undefined for invalid offset, order, leadingTracks, fixedTracks, and explicitTemplate', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    // @ts-expect-error - testing invalid value
    element.offset = 99
    // @ts-expect-error - testing invalid value
    element.order = 'sideways'
    // @ts-expect-error - testing invalid value
    element.leadingTracks = { weight: 'not-a-weight' }
    // @ts-expect-error - testing invalid value
    element.fixedTracks = { count: 9 }
    // @ts-expect-error - testing invalid value
    element.explicitTemplate = { template: 'not-a-template' }

    document.body.append(element)
    await element.updateComplete

    expect(element.offset).toBeUndefined()
    expect(element.order).toBeUndefined()
    expect(element.leadingTracks).toBeUndefined()
    expect(element.fixedTracks).toBeUndefined()
    expect(element.explicitTemplate).toBeUndefined()
  })

  it('defaults the host to block display', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    document.body.append(element)
    await element.updateComplete

    expect(getComputedStyle(element).display).toBe('block')
  })

  it('applies innerClass to the native div without touching the host class', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.className = 'host-class'
    element.innerClass = 'sp-lg-gap-8 not-allowed'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')

    expect(div?.className).toContain('sp-lg-gap-8')
    expect(div?.className).not.toContain('not-allowed')
    expect(div?.className).not.toContain('host-class')
    expect(element.className).toBe('host-class')
  })

  it('accepts BEM element and modifier segments in innerClass', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement
    element.innerClass =
      'sp-grid-template--edge-fluid-edge sp-dropdown__menu--mega'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-grid-native]')

    expect(div?.className).toContain('sp-grid-template--edge-fluid-edge')
    expect(div?.className).toContain('sp-dropdown__menu--mega')
  })
})
