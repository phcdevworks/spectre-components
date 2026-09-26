import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  defineSpectreListGroup,
  defineSpectreListGroupItem,
  SpectreListGroupElement,
  SpectreListGroupItemElement
} from '../src'

async function renderList(markup: string): Promise<SpectreListGroupElement> {
  document.body.innerHTML = markup
  const list = document.querySelector(
    'sp-list-group'
  ) as SpectreListGroupElement
  const items = Array.from(
    document.querySelectorAll<SpectreListGroupItemElement>('sp-list-group-item')
  )
  await Promise.all(items.map((item) => item.updateComplete))
  await list.updateComplete
  return list
}

function rows(list: SpectreListGroupElement): HTMLElement[] {
  return Array.from(list.querySelectorAll('[data-sp-list-group-row]'))
}

describe('sp-list-group', () => {
  beforeAll(() => {
    defineSpectreListGroup()
    defineSpectreListGroupItem()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders static items as sibling list items in a ul', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item>First</sp-list-group-item>
      <sp-list-group-item active>Second</sp-list-group-item>
    </sp-list-group>`)
    const native = list.querySelector('[data-sp-list-group-native]')
    const [first, second] = rows(list)

    expect(native?.tagName).toBe('UL')
    expect(native?.className).toContain('sp-list-group')
    expect(first?.tagName).toBe('LI')
    expect(first?.parentElement).toBe(native)
    expect(second?.parentElement).toBe(native)
    expect(first?.textContent?.trim()).toBe('First')
    expect(second?.className).toContain('sp-list-group__item--active')
    expect(second?.getAttribute('aria-current')).toBe('true')
  })

  it('renders links and buttons for actionable items', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item href="/inbox">Inbox</sp-list-group-item>
      <sp-list-group-item interactive>Archive</sp-list-group-item>
      <sp-list-group-item>Static</sp-list-group-item>
    </sp-list-group>`)
    const [link, button, plain] = rows(list)

    expect(list.querySelector('[data-sp-list-group-native]')?.tagName).toBe(
      'DIV'
    )
    expect(link?.tagName).toBe('A')
    expect(link?.getAttribute('href')).toBe('/inbox')
    expect(link?.className).toContain('sp-list-group__item--interactive')
    expect(button?.tagName).toBe('BUTTON')
    expect(button?.getAttribute('type')).toBe('button')
    expect(plain?.tagName).toBe('DIV')
    expect(plain?.className).not.toContain('--interactive')
  })

  it('disables actionable rows', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item href="/x" disabled>Link</sp-list-group-item>
      <sp-list-group-item interactive disabled>Button</sp-list-group-item>
    </sp-list-group>`)
    const [link, button] = rows(list)

    expect(link?.hasAttribute('href')).toBe(false)
    expect(link?.getAttribute('aria-disabled')).toBe('true')
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button?.className).toContain('sp-list-group__item--disabled')
  })

  it('emits sp-select from the item when an actionable row is clicked', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item interactive>Archive</sp-list-group-item>
    </sp-list-group>`)
    const item = list.querySelector('sp-list-group-item')!
    const handler = vi.fn()
    item.addEventListener('sp-select', handler)

    rows(list)[0]?.click()

    expect(handler).toHaveBeenCalledOnce()
  })

  it('re-renders a row when item state changes', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item>One</sp-list-group-item>
    </sp-list-group>`)
    const item =
      list.querySelector<SpectreListGroupItemElement>('sp-list-group-item')!

    item.selected = true
    await item.updateComplete
    await list.updateComplete

    expect(rows(list)[0]?.className).toContain('sp-list-group__item--selected')
  })

  it('keeps item content live inside the rendered row', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item>Old</sp-list-group-item>
    </sp-list-group>`)
    const item = list.querySelector('sp-list-group-item')!

    item.textContent = 'New'

    expect(rows(list)[0]?.textContent?.trim()).toBe('New')
  })

  it('applies flush, horizontal, and accent modifiers', async () => {
    const list =
      await renderList(`<sp-list-group flush horizontal accent="left" accent-color="success">
      <sp-list-group-item>One</sp-list-group-item>
    </sp-list-group>`)
    const className =
      list.querySelector('[data-sp-list-group-native]')?.className ?? ''

    expect(className).toContain('sp-list-group--flush')
    expect(className).toContain('sp-list-group--horizontal')
    expect(className).toContain('sp-list-group--accent-left')
    expect(className).toContain('sp-list-group--accent-success')
  })

  it('drops an invalid accent edge', async () => {
    const list = await renderList(`<sp-list-group accent="diagonal">
      <sp-list-group-item>One</sp-list-group-item>
    </sp-list-group>`)
    expect(list.accent).toBeUndefined()
  })

  it('moves the item id to the rendered row', async () => {
    const list = await renderList(`<sp-list-group>
      <sp-list-group-item id="row-1">One</sp-list-group-item>
    </sp-list-group>`)

    expect(rows(list)[0]?.id).toBe('row-1')
    const item = list.querySelector('sp-list-group-item')!
    expect(HTMLElement.prototype.hasAttribute.call(item, 'id')).toBe(false)
  })
})
