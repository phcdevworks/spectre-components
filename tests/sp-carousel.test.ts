import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectreCarousel, SpectreCarouselElement } from '../src'

async function renderCarousel(markup: string): Promise<SpectreCarouselElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-carousel'
  ) as SpectreCarouselElement
  await element.updateComplete
  return element
}

const SLIDES = `<sp-carousel aria-label="Featured">
  <img alt="One" src="one.png" />
  <img alt="Two" src="two.png" />
  <img alt="Three" src="three.png" />
</sp-carousel>`

function slides(element: SpectreCarouselElement): HTMLElement[] {
  return Array.from(element.querySelectorAll('[data-sp-carousel-slide]'))
}

function indicators(element: SpectreCarouselElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('[data-sp-carousel-indicator]'))
}

describe('sp-carousel', () => {
  beforeAll(() => {
    defineSpectreCarousel()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a labelled carousel region with one slide per element', async () => {
    const element = await renderCarousel(SLIDES)
    const root = element.querySelector('[data-sp-carousel-native]')
    const [first] = slides(element)

    expect(root?.getAttribute('role')).toBe('region')
    expect(root?.getAttribute('aria-roledescription')).toBe('carousel')
    expect(root?.getAttribute('aria-label')).toBe('Featured')
    expect(slides(element)).toHaveLength(3)
    expect(first?.getAttribute('aria-roledescription')).toBe('slide')
    expect(first?.getAttribute('aria-label')).toBe('1 of 3')
    expect(first?.querySelector('img')?.alt).toBe('One')
  })

  it('marks the active slide and indicator', async () => {
    const element = await renderCarousel(SLIDES)

    expect(slides(element)[0]?.className).toContain(
      'sp-carousel__slide--active'
    )
    expect(indicators(element)[0]?.getAttribute('aria-current')).toBe('true')
    expect(indicators(element)[1]?.hasAttribute('aria-current')).toBe(false)
  })

  it('moves with next/previous controls and emits sp-change', async () => {
    const element = await renderCarousel(SLIDES)
    const handler = vi.fn()
    element.addEventListener('sp-change', handler)
    const next = element.querySelector<HTMLButtonElement>(
      '[data-sp-carousel-next]'
    )
    const prev = element.querySelector<HTMLButtonElement>(
      '[data-sp-carousel-prev]'
    )

    expect(prev?.disabled).toBe(true)
    next?.click()
    await element.updateComplete

    expect(element.index).toBe(1)
    expect(prev?.disabled).toBe(false)
    expect((handler.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      index: 1
    })
  })

  it('stops at the ends unless loop is set', async () => {
    const element = await renderCarousel(
      SLIDES.replace('<sp-carousel', '<sp-carousel index="2"')
    )
    const next = element.querySelector<HTMLButtonElement>(
      '[data-sp-carousel-next]'
    )
    expect(next?.disabled).toBe(true)

    element.loop = true
    await element.updateComplete
    next?.click()
    await element.updateComplete
    expect(element.index).toBe(0)
  })

  it('jumps to a slide from its indicator', async () => {
    const element = await renderCarousel(SLIDES)

    indicators(element)[2]?.click()
    await element.updateComplete

    expect(element.index).toBe(2)
    expect(indicators(element)[2]?.getAttribute('aria-current')).toBe('true')
  })

  it('navigates with arrow keys', async () => {
    const element = await renderCarousel(SLIDES)
    const root = element.querySelector(
      '[data-sp-carousel-native]'
    ) as HTMLElement

    root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    )
    await element.updateComplete
    expect(element.index).toBe(1)

    root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    )
    await element.updateComplete
    expect(element.index).toBe(0)
  })

  it('hides controls and indicators on request', async () => {
    const element = await renderCarousel(
      SLIDES.replace(
        '<sp-carousel',
        '<sp-carousel hide-controls hide-indicators'
      )
    )
    expect(element.querySelector('[data-sp-carousel-next]')).toBeNull()
    expect(indicators(element)).toHaveLength(0)
  })

  it('applies the fade modifier', async () => {
    const element = await renderCarousel(
      SLIDES.replace('<sp-carousel', '<sp-carousel fade')
    )
    expect(
      element.querySelector('[data-sp-carousel-native]')?.className
    ).toContain('sp-carousel--fade')
  })
})
