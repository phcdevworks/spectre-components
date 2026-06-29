import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const sections = [
  'sp-button',
  'sp-input',
  'sp-select',
  'sp-textarea',
  'sp-label',
  'sp-checkbox',
  'sp-radio',
  'sp-fieldset',
  'sp-badge',
  'sp-tag',
  'sp-card / sp-pricing-card',
  'sp-alert',
  'sp-testimonial',
  'sp-avatar / sp-icon-box / sp-rating / sp-spinner',
  'Layout: sp-container / sp-grid / sp-section / sp-stack',
]

for (const heading of sections) {
  test(`${heading} renders without unintended visual drift`, async ({ page }) => {
    const section = page.locator('section', { has: page.getByRole('heading', { name: heading, exact: true }) })
    await expect(section).toHaveScreenshot(`${heading.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`)
  })
}
