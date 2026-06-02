import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import axe from 'axe-core'

import {
  defineSpectreButton,
  defineSpectreCheckbox,
  defineSpectreFieldset,
  defineSpectreInput,
  defineSpectreLabel,
  defineSpectreRadio,
  defineSpectreSelect,
  defineSpectreTextarea,
  SpectreButtonElement,
  SpectreCheckboxElement,
  SpectreFieldsetElement,
  SpectreInputElement,
  SpectreLabelElement,
  SpectreRadioElement,
  SpectreSelectElement,
  SpectreTextareaElement,
} from '../src'

const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    'region': { enabled: false },
  },
}

async function audit(el: HTMLElement): Promise<axe.Result[]> {
  document.body.append(el)
  if ('updateComplete' in el) {
    await (el as { updateComplete: Promise<boolean> }).updateComplete
  }
  const { violations } = await axe.run(el, AXE_OPTIONS)
  return violations
}

describe('accessibility audit', () => {
  beforeAll(() => {
    defineSpectreButton()
    defineSpectreCheckbox()
    defineSpectreFieldset()
    defineSpectreInput()
    defineSpectreLabel()
    defineSpectreRadio()
    defineSpectreSelect()
    defineSpectreTextarea()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('sp-button has no violations with an accessible label', async () => {
    const el = document.createElement('sp-button') as SpectreButtonElement
    el.setAttribute('aria-label', 'Submit form')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-button has no violations with visible label text', async () => {
    const el = document.createElement('sp-button') as SpectreButtonElement
    el.label = 'Save changes'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-button loading state has no violations', async () => {
    const el = document.createElement('sp-button') as SpectreButtonElement
    el.setAttribute('aria-label', 'Saving')
    el.loading = true
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-input has no violations with aria-label', async () => {
    const el = document.createElement('sp-input') as SpectreInputElement
    el.setAttribute('aria-label', 'Email address')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-input invalid state has no violations', async () => {
    const el = document.createElement('sp-input') as SpectreInputElement
    el.setAttribute('aria-label', 'Email address')
    el.invalid = true
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-textarea has no violations with aria-label', async () => {
    const el = document.createElement('sp-textarea') as SpectreTextareaElement
    el.setAttribute('aria-label', 'Project description')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-textarea invalid state has no violations', async () => {
    const el = document.createElement('sp-textarea') as SpectreTextareaElement
    el.setAttribute('aria-label', 'Project description')
    el.invalid = true
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-select has no violations with aria-label', async () => {
    const el = document.createElement('sp-select') as SpectreSelectElement
    el.setAttribute('aria-label', 'Country')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-select invalid state has no violations', async () => {
    const el = document.createElement('sp-select') as SpectreSelectElement
    el.setAttribute('aria-label', 'Country')
    el.invalid = true
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-checkbox has no violations with aria-label', async () => {
    const el = document.createElement('sp-checkbox') as SpectreCheckboxElement
    el.setAttribute('aria-label', 'Accept terms and conditions')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-checkbox has no violations with label prop', async () => {
    const el = document.createElement('sp-checkbox') as SpectreCheckboxElement
    el.label = 'Subscribe to newsletter'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-radio has no violations with aria-label', async () => {
    const el = document.createElement('sp-radio') as SpectreRadioElement
    el.setAttribute('aria-label', 'Monthly billing')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-radio has no violations with label prop', async () => {
    const el = document.createElement('sp-radio') as SpectreRadioElement
    el.label = 'Annual billing'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-label has no violations with projected text', async () => {
    const el = document.createElement('sp-label') as SpectreLabelElement
    el.innerHTML = 'First name'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-fieldset has no violations with aria-label', async () => {
    const el = document.createElement('sp-fieldset') as SpectreFieldsetElement
    el.setAttribute('aria-label', 'Contact preferences')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-fieldset has no violations with legend prop', async () => {
    const el = document.createElement('sp-fieldset') as SpectreFieldsetElement
    el.legend = 'Billing address'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-fieldset invalid state has no violations', async () => {
    const el = document.createElement('sp-fieldset') as SpectreFieldsetElement
    el.setAttribute('aria-label', 'Payment details')
    el.invalid = true
    const violations = await audit(el)
    expect(violations).toEqual([])
  })
})
