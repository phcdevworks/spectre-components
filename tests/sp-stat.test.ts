import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreStat, SpectreStatElement } from '../src'

async function renderStat(markup: string): Promise<SpectreStatElement> {
  document.body.innerHTML = markup
  const element = document.querySelector('sp-stat') as SpectreStatElement
  await element.updateComplete
  return element
}

describe('sp-stat', () => {
  beforeAll(() => {
    defineSpectreStat()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the figure, accent unit, and label parts', async () => {
    const element = await renderStat(
      '<sp-stat>98<span slot="unit">%</span><span slot="label">Uptime</span></sp-stat>'
    )
    const native = element.querySelector('[data-sp-stat-native]')
    const figure = native?.querySelector('.sp-stat__figure')

    expect(native?.className).toBe('sp-stat sp-stat--md')
    expect(figure?.textContent?.trim()).toBe('98%')
    expect(figure?.querySelector('.sp-stat__unit')?.textContent).toBe('%')
    expect(native?.querySelector('.sp-stat__label')?.textContent?.trim()).toBe(
      'Uptime'
    )
  })

  it('omits the unit and label when they are not provided', async () => {
    const element = await renderStat('<sp-stat>12</sp-stat>')

    expect(element.querySelector('.sp-stat__unit')).toBeNull()
    expect(element.querySelector('.sp-stat__label')).toBeNull()
  })

  it('forwards size, align, and surface', async () => {
    const element = await renderStat(
      '<sp-stat size="xl" align="center" surface="inverse">3</sp-stat>'
    )
    const classes = element.querySelector('[data-sp-stat-native]')?.className

    expect(classes).toContain('sp-stat--xl')
    expect(classes).toContain('sp-stat--align-center')
    expect(classes).toContain('sp-stat--on-inverse')
  })

  it('falls back to defaults for invalid values', async () => {
    const element = await renderStat(
      '<sp-stat size="huge" align="middle" surface="glass">3</sp-stat>'
    )

    expect(element.size).toBe('md')
    expect(element.align).toBe('start')
    expect(element.surface).toBe('page')
  })

  it('exposes a labelled group when given an accessible name', async () => {
    const element = await renderStat(
      '<sp-stat aria-label="Uptime">98</sp-stat>'
    )
    const native = element.querySelector('[data-sp-stat-native]')

    expect(native?.getAttribute('role')).toBe('group')
    expect(native?.getAttribute('aria-label')).toBe('Uptime')
  })
})
