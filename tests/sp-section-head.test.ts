import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreSectionHead, SpectreSectionHeadElement } from '../src'

async function renderHead(markup: string): Promise<SpectreSectionHeadElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-section-head'
  ) as SpectreSectionHeadElement
  await element.updateComplete
  return element
}

const HEAD = `<sp-section-head layout="split">
  <p slot="eyebrow">Work</p>
  <h2 slot="title">Selected projects</h2>
  <p>Case studies from the last year.</p>
  <a slot="actions" href="/work">All work</a>
</sp-section-head>`

describe('sp-section-head', () => {
  beforeAll(() => {
    defineSpectreSectionHead()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('defaults to the stacked layout', async () => {
    const element = await renderHead(
      '<sp-section-head><h2 slot="title">T</h2></sp-section-head>'
    )

    expect(
      element.querySelector('[data-sp-section-head-native]')?.className
    ).toBe('sp-section-head sp-section-head--stacked')
    expect(element.querySelector('.sp-section-head__lead')).toBeNull()
  })

  it('splits eyebrow and title from the lead and actions', async () => {
    const element = await renderHead(HEAD)
    const native = element.querySelector('[data-sp-section-head-native]')
    const title = native?.querySelector('.sp-section-head__title')
    const lead = native?.querySelector('.sp-section-head__lead')

    expect(native?.className).toContain('sp-section-head--split')
    expect(
      Array.from(title?.children ?? []).map((child) => child.tagName)
    ).toEqual(['P', 'H2'])
    expect(
      Array.from(lead?.children ?? []).map((child) => child.tagName)
    ).toEqual(['P', 'A'])
  })

  it('forwards the centered alignment', async () => {
    const element = await renderHead(
      '<sp-section-head align="center"><h2 slot="title">T</h2></sp-section-head>'
    )

    expect(
      element.querySelector('[data-sp-section-head-native]')?.className
    ).toContain('sp-section-head--center')
  })

  it('falls back to defaults for invalid values', async () => {
    const element = await renderHead(
      '<sp-section-head layout="grid" align="end"></sp-section-head>'
    )

    expect(element.layout).toBe('stacked')
    expect(element.align).toBe('start')
  })
})
