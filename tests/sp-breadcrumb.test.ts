import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreBreadcrumb, SpectreBreadcrumbElement } from '../src'

async function renderBreadcrumb(
  markup: string
): Promise<SpectreBreadcrumbElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-breadcrumb'
  ) as SpectreBreadcrumbElement
  await element.updateComplete
  return element
}

const TRAIL = `<sp-breadcrumb>
  <a href="/">Home</a>
  <a href="/library">Library</a>
  <span>Data</span>
</sp-breadcrumb>`

describe('sp-breadcrumb', () => {
  beforeAll(() => {
    defineSpectreBreadcrumb()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a labelled nav with an ordered list of items', async () => {
    const element = await renderBreadcrumb(TRAIL)
    const nav = element.querySelector('nav')
    const items = element.querySelectorAll('ol.sp-breadcrumb > li')

    expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb')
    expect(items).toHaveLength(3)
    expect(items[0]?.querySelector('a')?.getAttribute('href')).toBe('/')
  })

  it('marks the last item as the current page', async () => {
    const element = await renderBreadcrumb(TRAIL)
    const items = element.querySelectorAll('li')

    expect(items[2]?.getAttribute('aria-current')).toBe('page')
    expect(items[2]?.className).toContain('sp-breadcrumb__item--current')
    expect(items[0]?.hasAttribute('aria-current')).toBe(false)
  })

  it('adds the link class to projected anchors', async () => {
    const element = await renderBreadcrumb(TRAIL)
    element.querySelectorAll('a').forEach((link) => {
      expect(link.classList.contains('sp-breadcrumb__link')).toBe(true)
    })
  })

  it('renders a custom separator and suppresses the built-in one', async () => {
    const element = await renderBreadcrumb(
      TRAIL.replace('<sp-breadcrumb>', '<sp-breadcrumb separator="›">')
    )
    const separators = element.querySelectorAll('.sp-breadcrumb__separator')

    expect(element.querySelector('ol')?.className).toContain(
      'sp-breadcrumb--custom-separator'
    )
    expect(separators).toHaveLength(2)
    expect(separators[0]?.getAttribute('aria-hidden')).toBe('true')
    expect(separators[0]?.textContent).toBe('›')
  })

  it('uses a consumer aria-label over the default', async () => {
    const element = await renderBreadcrumb(
      TRAIL.replace(
        '<sp-breadcrumb>',
        '<sp-breadcrumb aria-label="You are here">'
      )
    )
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'You are here'
    )
  })

  it('updates the trail when crumbs are appended', async () => {
    const element = await renderBreadcrumb(TRAIL)
    const crumb = document.createElement('span')
    crumb.textContent = 'Details'
    element.append(crumb)
    await new Promise((resolve) => setTimeout(resolve, 0))
    await element.updateComplete

    const items = element.querySelectorAll('li')
    expect(items).toHaveLength(4)
    expect(items[3]?.getAttribute('aria-current')).toBe('page')
    expect(items[2]?.hasAttribute('aria-current')).toBe(false)
  })
})
