import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreStack, SpectreStackElement } from '../src'

describe('sp-stack', () => {
  beforeAll(() => {
    defineSpectreStack()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a native div with the Spectre stack class and projected content', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    const item = document.createElement('span')
    item.textContent = 'Stack item'
    element.append(item)

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div).not.toBeNull()
    expect(div?.className).toContain('sp-stack')
    expect(div?.textContent).toContain('Stack item')
  })

  it('defaults to direction=vertical, align=center, and gap=md', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    document.body.append(element)
    await element.updateComplete

    expect(element.direction).toBe('vertical')
    expect(element.align).toBe('center')
    expect(element.gap).toBe('md')
    expect(element.basis).toBeUndefined()
  })

  it('reflects a non-default gap onto the div classes', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    element.gap = 'lg'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div?.className).toContain('sp-stack--gap-lg')
  })

  it('omits a gap class for the default gap=md', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div?.className).not.toContain('sp-stack--gap')
  })

  it('falls back to gap=md for an invalid value', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    // @ts-expect-error - testing invalid value
    element.gap = 'not-a-gap'

    document.body.append(element)
    await element.updateComplete

    expect(element.gap).toBe('md')
  })

  it('reflects direction=horizontal onto the sp-hstack class', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    element.direction = 'horizontal'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div?.className).toContain('sp-hstack')
  })

  it('reflects a valid basis onto the div classes', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    element.basis = 'sidebar'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div?.className).toContain('sp-stack--basis-sidebar')
  })

  it('falls back to direction=vertical for an invalid value', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    // @ts-expect-error - testing invalid value
    element.direction = 'diagonal'

    document.body.append(element)
    await element.updateComplete

    expect(element.direction).toBe('vertical')
  })

  it('falls back to no basis for an invalid value', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    // @ts-expect-error - testing invalid value
    element.basis = 'not-a-basis'

    document.body.append(element)
    await element.updateComplete

    expect(element.basis).toBeUndefined()
  })

  it('defaults the host to block display', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    document.body.append(element)
    await element.updateComplete

    expect(getComputedStyle(element).display).toBe('block')
  })

  it('applies innerClass to the native div without touching the host class', async () => {
    const element = document.createElement('sp-stack') as SpectreStackElement
    element.className = 'host-class'
    element.innerClass = 'sp-gap-8 not-allowed'

    document.body.append(element)
    await element.updateComplete

    const div = element.querySelector('div[data-sp-stack-native]')

    expect(div?.className).toContain('sp-gap-8')
    expect(div?.className).not.toContain('not-allowed')
    expect(div?.className).not.toContain('host-class')
    expect(element.className).toBe('host-class')
  })
})
