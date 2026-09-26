import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  defineSpectreAccordion,
  defineSpectreAccordionItem,
  SpectreAccordionElement,
  SpectreAccordionItemElement
} from '../src'

async function renderAccordion(
  markup: string
): Promise<[SpectreAccordionElement, SpectreAccordionItemElement[]]> {
  document.body.innerHTML = markup
  const accordion = document.querySelector(
    'sp-accordion'
  ) as SpectreAccordionElement
  const items = Array.from(
    document.querySelectorAll<SpectreAccordionItemElement>('sp-accordion-item')
  )
  await accordion.updateComplete
  await Promise.all(items.map((item) => item.updateComplete))
  return [accordion, items]
}

function header(item: SpectreAccordionItemElement): HTMLButtonElement {
  return item.querySelector(
    '[data-sp-accordion-item-header]'
  ) as HTMLButtonElement
}

function panel(item: SpectreAccordionItemElement): HTMLElement {
  return item.querySelector('[data-sp-accordion-item-panel]') as HTMLElement
}

const TWO_ITEMS = `<sp-accordion>
  <sp-accordion-item label="Shipping">Ships in 2 days</sp-accordion-item>
  <sp-accordion-item label="Returns">30 day returns</sp-accordion-item>
</sp-accordion>`

describe('sp-accordion', () => {
  beforeAll(() => {
    defineSpectreAccordion()
    defineSpectreAccordionItem()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('projects items into the accordion container as direct siblings', async () => {
    const [accordion, items] = await renderAccordion(TWO_ITEMS)
    const native = accordion.querySelector('[data-sp-accordion-native]')

    expect(native?.className).toContain('sp-accordion')
    expect(items.every((item) => item.parentElement === native)).toBe(true)
    expect(items[0]?.classList.contains('sp-accordion__item')).toBe(true)
  })

  it('renders a header button wired to its panel region', async () => {
    const [, [item]] = await renderAccordion(TWO_ITEMS)
    const button = header(item!)
    const region = panel(item!)

    expect(button.textContent?.trim()).toBe('Shipping')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(region.id)
    expect(region.getAttribute('role')).toBe('region')
    expect(region.getAttribute('aria-labelledby')).toBe(button.id)
    expect(region.hidden).toBe(true)
    expect(region.textContent?.trim()).toBe('Ships in 2 days')
  })

  it('toggles open on header click and emits sp-open / sp-close', async () => {
    const [, [item]] = await renderAccordion(TWO_ITEMS)
    const opened = vi.fn()
    const closed = vi.fn()
    item!.addEventListener('sp-open', opened)
    item!.addEventListener('sp-close', closed)

    header(item!).click()
    await item!.updateComplete
    expect(item!.open).toBe(true)
    expect(header(item!).getAttribute('aria-expanded')).toBe('true')
    expect(panel(item!).hidden).toBe(false)
    expect(item!.classList.contains('sp-accordion__item--expanded')).toBe(true)
    expect(opened).toHaveBeenCalledOnce()

    header(item!).click()
    await item!.updateComplete
    expect(item!.open).toBe(false)
    expect(item!.classList.contains('sp-accordion__item--expanded')).toBe(false)
    expect(closed).toHaveBeenCalledOnce()
  })

  it('closes other items when one opens unless multiple is set', async () => {
    const [, [first, second]] = await renderAccordion(TWO_ITEMS)

    header(first!).click()
    await first!.updateComplete
    header(second!).click()
    await second!.updateComplete
    await first!.updateComplete

    expect(first!.open).toBe(false)
    expect(second!.open).toBe(true)
  })

  it('keeps several items open when multiple is set', async () => {
    const [, [first, second]] = await renderAccordion(
      TWO_ITEMS.replace('<sp-accordion>', '<sp-accordion multiple>')
    )

    header(first!).click()
    header(second!).click()
    await first!.updateComplete
    await second!.updateComplete

    expect(first!.open).toBe(true)
    expect(second!.open).toBe(true)
  })

  it('does not toggle a disabled item', async () => {
    const [, [item]] = await renderAccordion(`<sp-accordion>
      <sp-accordion-item label="Locked" disabled>Hidden</sp-accordion-item>
    </sp-accordion>`)

    expect(header(item!).disabled).toBe(true)
    item!.querySelector<HTMLButtonElement>('button')?.click()
    await item!.updateComplete
    expect(item!.open).toBe(false)
  })

  it('projects slot="header" content into the header button', async () => {
    const [, [item]] = await renderAccordion(`<sp-accordion>
      <sp-accordion-item><strong slot="header">Rich title</strong>Body</sp-accordion-item>
    </sp-accordion>`)

    expect(header(item!).querySelector('strong')?.textContent).toBe(
      'Rich title'
    )
    expect(panel(item!).textContent?.trim()).toBe('Body')
  })

  it('preserves author classes on the item host', async () => {
    const [, [item]] = await renderAccordion(`<sp-accordion>
      <sp-accordion-item class="custom" label="A">A</sp-accordion-item>
    </sp-accordion>`)

    item!.open = true
    await item!.updateComplete

    expect(item!.classList.contains('custom')).toBe(true)
    expect(item!.classList.contains('sp-accordion__item--expanded')).toBe(true)
  })

  it('applies the flush modifier', async () => {
    const [accordion] = await renderAccordion(
      TWO_ITEMS.replace('<sp-accordion>', '<sp-accordion flush>')
    )
    expect(
      accordion.querySelector('[data-sp-accordion-native]')?.className
    ).toContain('sp-accordion--flush')
  })
})
