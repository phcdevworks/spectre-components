import { defineConfig } from '@playwright/test'
import visualConfig from './playwright.config'

export default defineConfig({
  ...visualConfig,
  testDir: './browser-tests'
})
