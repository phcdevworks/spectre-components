import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreTable, SpectreTableElement } from '../src'

async function renderTable(markup: string): Promise<SpectreTableElement> {
  document.body.innerHTML = markup
  const element = document.querySelector('sp-table') as SpectreTableElement
  await element.updateComplete
  return element
}

const TABLE = `<sp-table>
  <table class="custom">
    <thead><tr><th>Name</th></tr></thead>
    <tbody><tr><td>Ada</td></tr></tbody>
  </table>
</sp-table>`

describe('sp-table', () => {
  beforeAll(() => {
    defineSpectreTable()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('wraps the authored table in the scroll wrapper and styles it', async () => {
    const element = await renderTable(TABLE)
    const wrapper = element.querySelector('[data-sp-table-native]')
    const table = element.querySelector('table')

    expect(wrapper?.className).toContain('sp-table-wrapper')
    expect(table?.parentElement).toBe(wrapper)
    expect(table?.classList.contains('sp-table')).toBe(true)
    expect(table?.classList.contains('sp-table--md')).toBe(true)
    expect(table?.classList.contains('custom')).toBe(true)
  })

  it('swaps modifier classes when properties change', async () => {
    const element = await renderTable(TABLE)
    const table = element.querySelector('table')!

    element.size = 'sm'
    element.striped = true
    element.hoverable = true
    element.bordered = true
    await element.updateComplete

    expect(table.classList.contains('sp-table--sm')).toBe(true)
    expect(table.classList.contains('sp-table--md')).toBe(false)
    expect(table.classList.contains('sp-table--striped')).toBe(true)
    expect(table.classList.contains('sp-table--hover')).toBe(true)
    expect(table.classList.contains('sp-table--bordered')).toBe(true)

    element.striped = false
    await element.updateComplete
    expect(table.classList.contains('sp-table--striped')).toBe(false)
    expect(table.classList.contains('custom')).toBe(true)
  })

  it('falls back to size=md for an invalid size', async () => {
    const element = await renderTable(
      TABLE.replace('<sp-table>', '<sp-table size="xl">')
    )
    expect(element.size).toBe('md')
  })

  it('makes a labelled wrapper a focusable scroll region', async () => {
    const element = await renderTable(
      TABLE.replace('<sp-table>', '<sp-table aria-label="Team members">')
    )
    const wrapper = element.querySelector('[data-sp-table-native]')

    expect(wrapper?.getAttribute('role')).toBe('region')
    expect(wrapper?.getAttribute('aria-label')).toBe('Team members')
    expect(wrapper?.getAttribute('tabindex')).toBe('0')
  })

  it('leaves an unlabelled wrapper without a region role', async () => {
    const element = await renderTable(TABLE)
    const wrapper = element.querySelector('[data-sp-table-native]')

    expect(wrapper?.hasAttribute('role')).toBe(false)
    expect(wrapper?.hasAttribute('tabindex')).toBe(false)
  })
})
