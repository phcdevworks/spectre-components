import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreSkeleton, SpectreSkeletonElement } from '../src'

async function mount(markup: string): Promise<SpectreSkeletonElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const element = host.querySelector('sp-skeleton') as SpectreSkeletonElement
  await element.updateComplete
  return element
}

function nativeOf(element: SpectreSkeletonElement): HTMLElement | null {
  return element.querySelector('[data-sp-skeleton-native]')
}

describe('sp-skeleton', () => {
  beforeAll(() => {
    defineSpectreSkeleton()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a hidden text placeholder by default', async () => {
    const element = await mount('<sp-skeleton></sp-skeleton>')
    const native = nativeOf(element)
    expect(native?.tagName).toBe('DIV')
    expect(native?.className).toBe('sp-skeleton sp-skeleton--text')
    expect(native?.getAttribute('aria-hidden')).toBe('true')
    expect(element.style.display).toBe('block')
  })

  it('forwards shape and animated', async () => {
    const element = await mount(
      '<sp-skeleton shape="circle" animated></sp-skeleton>'
    )
    expect(nativeOf(element)?.className).toBe(
      'sp-skeleton sp-skeleton--circle sp-skeleton--animated'
    )
  })

  it('fills the host box as a rect', async () => {
    const element = await mount('<sp-skeleton shape="rect"></sp-skeleton>')
    expect(nativeOf(element)?.className).toBe(
      'sp-skeleton sp-skeleton--rect sp-h-full'
    )
  })

  it('falls back to text for an unknown shape', async () => {
    const element = await mount('<sp-skeleton shape="hexagon"></sp-skeleton>')
    expect(element.shape).toBe('text')
    expect(nativeOf(element)?.className).toContain('sp-skeleton--text')
  })

  it('keeps an authored host display', async () => {
    const element = await mount(
      '<sp-skeleton style="display: inline-block"></sp-skeleton>'
    )
    expect(element.style.display).toBe('inline-block')
  })

  it('appends sanitized inner-class utilities', async () => {
    const element = await mount(
      '<sp-skeleton inner-class="sp-w-full bogus"></sp-skeleton>'
    )
    const classes = nativeOf(element)?.className ?? ''
    expect(classes).toContain('sp-w-full')
    expect(classes).not.toContain('bogus')
  })

  it('forwards id and title to the native element', async () => {
    const element = await mount(
      '<sp-skeleton id="avatar-placeholder" title="Loading"></sp-skeleton>'
    )
    expect(nativeOf(element)?.id).toBe('avatar-placeholder')
    expect(nativeOf(element)?.getAttribute('title')).toBe('Loading')
  })

  it('registers idempotently', () => {
    expect(defineSpectreSkeleton()).toBe(SpectreSkeletonElement)
  })
})
