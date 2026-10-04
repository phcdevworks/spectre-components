import { expect, test } from '@playwright/test'

// spectre-ui 5.4.0 layout fixes that depend on real CSS layout: legacy
// `align` presentational hints, grid item placement on a nested grid host,
// and the line box of inline-level text.
test('layout fixes hold against the real recipe CSS', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() =>
    Boolean(
      document.querySelector('[data-verify="logo-cloud"] .sp-logo-cloud__item')
    )
  )

  const result = await page.evaluate(() => {
    const stackText = document.querySelector('[data-verify="stack-text"] p')!
    const outer = document.querySelector(
      '[data-verify="nested-grid"] > [data-sp-grid-native]'
    )!
    const [nested, sibling] = Array.from(outer.children)
    const outerWidth = outer.getBoundingClientRect().width
    const [first, second] = Array.from(
      document.querySelectorAll('[data-verify="text-spans"] span')
    ).map((span) => span.getBoundingClientRect())
    const firstSpan = document.querySelector('[data-verify="text-spans"] span')!
    const tile = document.querySelector(
      '[data-verify="logo-cloud"] .sp-logo-cloud__item'
    )!
    const mark = tile.querySelector('svg')!

    return {
      stackTextAlign: getComputedStyle(stackText).textAlign,
      nestedShare: nested!.getBoundingClientRect().width / outerWidth,
      siblingTop: sibling!.getBoundingClientRect().top,
      nestedBottom: nested!.getBoundingClientRect().bottom,
      spanGap: second!.top - first!.bottom,
      spanHeight: first!.height,
      spanLineHeight: parseFloat(getComputedStyle(firstSpan).lineHeight),
      tileWidth: tile.getBoundingClientRect().width,
      tileHeight: tile.getBoundingClientRect().height,
      markFilter: getComputedStyle(mark).filter
    }
  })

  expect(result.stackTextAlign).not.toBe('center')
  expect(result.nestedShare).toBeGreaterThan(0.6)
  expect(result.siblingTop).toBeLessThan(result.nestedBottom)
  expect(result.spanHeight).toBeCloseTo(result.spanLineHeight, 0)
  expect(result.spanGap).toBeLessThanOrEqual(8)
  expect(result.tileWidth).toBe(result.tileHeight)
  expect(result.markFilter).toContain('grayscale')
})
