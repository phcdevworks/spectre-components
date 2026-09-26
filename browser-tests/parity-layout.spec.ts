import { expect, test } from '@playwright/test'

// Layout contracts of the spectre-ui 5.3.0 components that happy-dom cannot
// evaluate: fused input-group seams, the seven-column calendar grid, the range
// fill variable, and popover visibility.
test('parity components lay out against the real recipe CSS', async ({
  page
}) => {
  await page.goto('/')
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-verify="datepicker"] [data-sp-day]'))
  )

  const result = await page.evaluate(() => {
    const group = document.querySelector(
      '[data-verify="input-group"] [data-sp-input-group-native]'
    )!
    const [addon, input, button] = Array.from(group.children).map((child) =>
      child.getBoundingClientRect()
    )
    const grid = document.querySelector(
      '[data-verify="datepicker"] [data-sp-datepicker-grid]'
    )!
    const bar = document.querySelector<HTMLElement>(
      '[data-verify="progress"] [data-sp-progress-bar]'
    )!
    const track = bar.parentElement!
    const range = document.querySelector<HTMLInputElement>(
      '[data-verify="range"] input'
    )!
    const switchInput = document.querySelector<HTMLInputElement>(
      '[data-verify="switch"] input'
    )!

    return {
      groupDisplay: getComputedStyle(group).display,
      seamAddonInput: input!.left - addon!.right,
      seamInputButton: button!.left - input!.right,
      sameRow: addon!.top === input!.top && input!.top === button!.top,
      gridColumns: getComputedStyle(grid)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length,
      progressRatio:
        bar.getBoundingClientRect().width / track.getBoundingClientRect().width,
      rangeValue: range.style.getPropertyValue('--sp-component-range-value'),
      switchAppearance: getComputedStyle(switchInput).appearance
    }
  })

  expect(result.groupDisplay).toBe('flex')
  expect(result.sameRow).toBe(true)
  expect(result.seamAddonInput).toBeLessThanOrEqual(0)
  expect(result.seamInputButton).toBeLessThanOrEqual(0)
  expect(result.gridColumns).toBe(7)
  expect(result.progressRatio).toBeCloseTo(0.4, 1)
  expect(result.rangeValue).toBe('25%')
  expect(result.switchAppearance).toBe('none')
})

test('popover opens visibly from its trigger', async ({ page }) => {
  await page.goto('/')
  const popover = page.locator('[data-verify="popover"]')
  const panel = popover.locator('[data-sp-popover-native]')

  await expect(panel).toHaveCSS('visibility', 'hidden')
  await popover.locator('[data-sp-popover-trigger]').click()
  await expect(panel).toHaveCSS('visibility', 'visible')
  await page.keyboard.press('Escape')
  await expect(panel).toHaveCSS('visibility', 'hidden')
})

test('datepicker keyboard focus moves across the rendered grid', async ({
  page
}) => {
  await page.goto('/')
  const picker = page.locator('[data-verify="datepicker"]')
  await picker.locator('[data-sp-day="2026-09-15"]').focus()
  await page.keyboard.press('ArrowDown')
  await expect(picker.locator('[data-sp-day="2026-09-22"]')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(picker).toHaveAttribute('value', '2026-09-22')
})
