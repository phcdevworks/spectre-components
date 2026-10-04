import { expect, test } from '@playwright/test'

// Skeleton shapes size against the real recipe CSS: a circle stays square, a
// rect fills the box its host is given, and the shimmer stops under reduced
// motion.
test('skeleton shapes size against the real recipe CSS', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() =>
    Boolean(
      document.querySelector(
        '[data-verify="skeleton"] [data-sp-skeleton-native]'
      )
    )
  )

  const result = await page.evaluate(() => {
    const native = (shape: string) =>
      document.querySelector(
        `[data-verify="skeleton"] sp-skeleton[shape="${shape}"] [data-sp-skeleton-native]`
      )!
    const circle = native('circle').getBoundingClientRect()
    const rect = native('rect')
    const rectHost = rect.parentElement!.getBoundingClientRect()
    const text = document
      .querySelector(
        '[data-verify="skeleton"] sp-stack [data-sp-skeleton-native]'
      )!
      .getBoundingClientRect()

    return {
      circleWidth: circle.width,
      circleHeight: circle.height,
      rectHeight: rect.getBoundingClientRect().height,
      rectHostHeight: rectHost.height,
      rectAnimation: getComputedStyle(rect).animationName,
      textHeight: text.height
    }
  })

  expect(result.circleWidth).toBeGreaterThan(0)
  expect(result.circleHeight).toBeCloseTo(result.circleWidth, 0)
  expect(result.rectHeight).toBeGreaterThan(0)
  expect(result.rectHeight).toBeCloseTo(result.rectHostHeight, 0)
  expect(result.rectAnimation).toBe('sp-skeleton-shimmer')
  expect(result.textHeight).toBeGreaterThan(0)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reducedAnimation = await page.evaluate(
    () =>
      getComputedStyle(
        document.querySelector(
          '[data-verify="skeleton"] sp-skeleton[shape="rect"] [data-sp-skeleton-native]'
        )!
      ).animationName
  )
  expect(reducedAnimation).toBe('none')
})
