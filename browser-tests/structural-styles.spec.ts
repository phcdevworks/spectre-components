import { expect, test } from '@playwright/test'

// Recipes whose CSS depends on sibling/child structure (`item + item`,
// `:not(:last-child)`) only style correctly if the components render that
// structure; happy-dom cannot evaluate it, so it is checked here.
test('structural recipe styles apply to rendered component markup', async ({
  page
}) => {
  await page.goto('/')
  await page.waitForFunction(() =>
    Boolean(
      document.querySelector(
        '[data-verify="list-group"] [data-sp-list-group-row]'
      )
    )
  )

  const result = await page.evaluate(() => {
    const style = (selector: string) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`missing ${selector}`)
      return getComputedStyle(element)
    }
    const accordionItems = document.querySelectorAll(
      '[data-verify="accordion"] sp-accordion-item'
    )
    const listRows = document.querySelectorAll(
      '[data-verify="list-group"] [data-sp-list-group-row]'
    )
    const steps = document.querySelectorAll('[data-verify="stepper"] li')
    const crumbs = document.querySelectorAll('[data-verify="breadcrumb"] li')

    return {
      accordionFirstBorder: getComputedStyle(accordionItems[0]!).borderTopWidth,
      accordionSecondBorder: getComputedStyle(accordionItems[1]!)
        .borderTopWidth,
      accordionClosedPanel: getComputedStyle(
        accordionItems[1]!.querySelector('[data-sp-accordion-item-panel]')!
      ).display,
      accordionOpenPanel: getComputedStyle(
        accordionItems[0]!.querySelector('[data-sp-accordion-item-panel]')!
      ).display,
      listSecondRowBorder: getComputedStyle(listRows[1]!).borderTopWidth,
      listLinkDecoration: getComputedStyle(listRows[0]!).textDecorationLine,
      stepConnector: getComputedStyle(steps[0]!, '::after').content,
      lastStepConnector: getComputedStyle(steps[2]!, '::after').content,
      crumbSeparator: getComputedStyle(crumbs[1]!, '::before').content,
      firstCrumbSeparator: getComputedStyle(crumbs[0]!, '::before').content,
      hiddenTabPanel: style(
        'sp-tabs sp-tab-panel:nth-of-type(2) [role="tabpanel"]'
      ).display,
      offcanvasVisibility: style(
        '[data-verify="offcanvas"] [data-sp-offcanvas-native]'
      ).visibility,
      tableCollapse: style('[data-verify="table"] table').borderCollapse,
      carouselSlideWidth: document
        .querySelector('[data-verify="carousel"] [data-sp-carousel-slide]')!
        .getBoundingClientRect().width,
      carouselViewportWidth: document
        .querySelector('[data-verify="carousel"] [data-sp-carousel-viewport]')!
        .getBoundingClientRect().width
    }
  })

  expect(result.accordionFirstBorder).toBe('0px')
  expect(result.accordionSecondBorder).not.toBe('0px')
  expect(result.accordionClosedPanel).toBe('none')
  expect(result.accordionOpenPanel).toBe('block')
  expect(result.listSecondRowBorder).not.toBe('0px')
  expect(result.listLinkDecoration).toBe('none')
  expect(result.stepConnector).toBe('""')
  expect(result.lastStepConnector).toBe('none')
  expect(result.crumbSeparator).toBe('"/"')
  expect(result.firstCrumbSeparator).toBe('none')
  expect(result.hiddenTabPanel).toBe('none')
  expect(result.offcanvasVisibility).toBe('hidden')
  expect(result.tableCollapse).toBe('collapse')
  expect(result.carouselSlideWidth).toBeCloseTo(result.carouselViewportWidth, 0)
})

test('carousel controls scroll the native viewport', async ({ page }) => {
  await page.goto('/')
  const next = page.locator('[data-verify="carousel"] [data-sp-carousel-next]')
  await next.click()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.querySelector<HTMLElement>(
            '[data-verify="carousel"] [data-sp-carousel-viewport]'
          )!.scrollLeft
      )
    )
    .toBeGreaterThan(0)
  await expect(
    page.locator('[data-verify="carousel"] [data-sp-carousel-indicator]').nth(1)
  ).toHaveAttribute('aria-current', 'true')
})

test('offcanvas opens, focuses its first control, and closes on Escape', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const offcanvas = document.querySelector(
      '[data-verify="offcanvas"]'
    ) as HTMLElement & {
      open: boolean
    }
    offcanvas.open = true
  })
  const panel = page.locator(
    '[data-verify="offcanvas"] [data-sp-offcanvas-native]'
  )
  await expect(panel).toHaveCSS('visibility', 'visible')
  await expect(
    page.locator('[data-verify="offcanvas"] [data-sp-offcanvas-close]')
  ).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(panel).toHaveCSS('visibility', 'hidden')
})
