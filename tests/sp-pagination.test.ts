import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineSpectrePagination, SpectrePaginationElement } from '../src'

async function renderPagination(
  markup: string
): Promise<SpectrePaginationElement> {
  document.body.innerHTML = markup
  const element = document.querySelector(
    'sp-pagination'
  ) as SpectrePaginationElement
  await element.updateComplete
  return element
}

function labels(element: SpectrePaginationElement): string[] {
  return Array.from(element.querySelectorAll('li')).map(
    (item) => item.textContent?.trim() ?? ''
  )
}

describe('sp-pagination', () => {
  beforeAll(() => {
    defineSpectrePagination()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a labelled nav with previous, pages, and next', async () => {
    const element = await renderPagination(
      '<sp-pagination total="3"></sp-pagination>'
    )

    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Pagination'
    )
    expect(element.querySelector('ul')?.className).toContain(
      'sp-pagination--md'
    )
    expect(labels(element)).toEqual(['Previous', '1', '2', '3', 'Next'])
  })

  it('marks the current page and disables previous on the first page', async () => {
    const element = await renderPagination(
      '<sp-pagination total="3"></sp-pagination>'
    )
    const current = element.querySelector('[aria-current="page"]')
    const buttons = element.querySelectorAll('button')

    expect(current?.textContent?.trim()).toBe('1')
    expect(current?.className).toContain('sp-pagination__item--active')
    expect(buttons[0]?.disabled).toBe(true)
    expect(buttons[buttons.length - 1]?.disabled).toBe(false)
  })

  it('collapses long ranges with ellipses around the current page', async () => {
    const element = await renderPagination(
      '<sp-pagination total="20" page="10"></sp-pagination>'
    )
    expect(labels(element)).toEqual([
      'Previous',
      '1',
      '…',
      '9',
      '10',
      '11',
      '…',
      '20',
      'Next'
    ])
  })

  it('shows the leading pages without a left ellipsis near the start', async () => {
    const element = await renderPagination(
      '<sp-pagination total="20" page="2"></sp-pagination>'
    )
    expect(labels(element)).toEqual([
      'Previous',
      '1',
      '2',
      '3',
      '4',
      '5',
      '…',
      '20',
      'Next'
    ])
  })

  it('changes page on click and emits sp-change', async () => {
    const element = await renderPagination(
      '<sp-pagination total="5"></sp-pagination>'
    )
    const handler = vi.fn()
    element.addEventListener('sp-change', handler)

    element.querySelector<HTMLButtonElement>('[aria-label="Page 3"]')?.click()
    await element.updateComplete

    expect(element.page).toBe(3)
    expect((handler.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      page: 3
    })

    const buttons = Array.from(element.querySelectorAll('button'))
    const next = buttons[buttons.length - 1]
    next?.click()
    await element.updateComplete
    expect(element.page).toBe(4)
  })

  it('renders links from href-template', async () => {
    const element = await renderPagination(
      '<sp-pagination total="3" page="2" href-template="/posts?page={page}"></sp-pagination>'
    )
    const links = Array.from(element.querySelectorAll('a'))

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/posts?page=1',
      '/posts?page=1',
      '/posts?page=2',
      '/posts?page=3',
      '/posts?page=3'
    ])
  })

  it('renders a disabled link without an href at the bounds', async () => {
    const element = await renderPagination(
      '<sp-pagination total="2" href-template="?p={page}"></sp-pagination>'
    )
    const previous = element.querySelector('a')

    expect(previous?.hasAttribute('href')).toBe(false)
    expect(previous?.getAttribute('aria-disabled')).toBe('true')
  })

  it('clamps page into range and sanitizes invalid values', async () => {
    const element = await renderPagination(
      '<sp-pagination total="4" page="9" size="xl"></sp-pagination>'
    )
    expect(element.page).toBe(4)
    expect(element.size).toBe('md')

    element.total = 0
    await element.updateComplete
    expect(element.total).toBe(1)
    expect(element.page).toBe(1)
  })
})
