import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import axe from 'axe-core'

import {
  defineSpectreBadge,
  defineSpectreButton,
  defineSpectreCard,
  defineSpectreCheckbox,
  defineSpectreDropdown,
  defineSpectreFieldset,
  defineSpectreIconBox,
  defineSpectreInput,
  defineSpectreLabel,
  defineSpectreModal,
  defineSpectreNav,
  defineSpectreRadio,
  defineSpectreRating,
  defineSpectreSelect,
  defineSpectreSidebar,
  defineSpectreTestimonial,
  defineSpectreTextarea,
  defineSpectreToast,
  defineSpectreTooltip,
  SpectreBadgeElement,
  SpectreButtonElement,
  SpectreCardElement,
  SpectreCheckboxElement,
  SpectreDropdownElement,
  SpectreFieldsetElement,
  SpectreIconBoxElement,
  SpectreInputElement,
  SpectreLabelElement,
  SpectreModalElement,
  SpectreNavElement,
  SpectreRadioElement,
  SpectreRatingElement,
  SpectreSelectElement,
  SpectreSidebarElement,
  SpectreTestimonialElement,
  SpectreTextareaElement,
  SpectreToastElement,
  SpectreTooltipElement
} from '../src'

const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false }
  }
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
    defineSpectreBadge()
    defineSpectreButton()
    defineSpectreCard()
    defineSpectreCheckbox()
    defineSpectreDropdown()
    defineSpectreFieldset()
    defineSpectreIconBox()
    defineSpectreInput()
    defineSpectreLabel()
    defineSpectreModal()
    defineSpectreNav()
    defineSpectreRadio()
    defineSpectreRating()
    defineSpectreSelect()
    defineSpectreSidebar()
    defineSpectreTestimonial()
    defineSpectreTextarea()
    defineSpectreToast()
    defineSpectreTooltip()
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

  it('sp-badge has no violations with populated text content', async () => {
    const el = document.createElement('sp-badge') as SpectreBadgeElement
    el.textContent = 'New'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-badge has no violations when empty with an aria-label', async () => {
    const el = document.createElement('sp-badge') as SpectreBadgeElement
    el.setAttribute('aria-label', 'Unread notifications')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-badge has no violations with slotted markup', async () => {
    const el = document.createElement('sp-badge') as SpectreBadgeElement
    el.innerHTML = '<svg aria-hidden="true"></svg><span>3 new</span>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-card has no violations with populated heading content', async () => {
    const el = document.createElement('sp-card') as SpectreCardElement
    el.innerHTML = '<h2>Card title</h2><p>Card body</p>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-card has no violations when empty with an aria-label', async () => {
    const el = document.createElement('sp-card') as SpectreCardElement
    el.setAttribute('aria-label', 'Empty placeholder card')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-card interactive state has no violations with slotted content', async () => {
    const el = document.createElement('sp-card') as SpectreCardElement
    el.interactive = true
    el.innerHTML = '<h2>Plan</h2><a href="/plan">View details</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-icon-box has no violations with a projected icon and aria-label', async () => {
    const el = document.createElement('sp-icon-box') as SpectreIconBoxElement
    el.setAttribute('aria-label', 'Security feature')
    el.innerHTML = '<svg aria-hidden="true"></svg>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-icon-box has no violations when empty with an aria-label', async () => {
    const el = document.createElement('sp-icon-box') as SpectreIconBoxElement
    el.setAttribute('aria-label', 'Placeholder icon')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-rating has no violations with the default self-generated label', async () => {
    const el = document.createElement('sp-rating') as SpectreRatingElement
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-rating has no violations with an explicit aria-label override', async () => {
    const el = document.createElement('sp-rating') as SpectreRatingElement
    el.setAttribute('aria-label', 'Average customer rating')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-rating has no violations with a visible text label', async () => {
    const el = document.createElement('sp-rating') as SpectreRatingElement
    el.label = '4.5 out of 5 stars'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-testimonial has no violations with populated quote content', async () => {
    const el = document.createElement(
      'sp-testimonial'
    ) as SpectreTestimonialElement
    el.innerHTML =
      '<blockquote>Great product.</blockquote><cite>Jane Doe</cite>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-testimonial has no violations when empty with an aria-label', async () => {
    const el = document.createElement(
      'sp-testimonial'
    ) as SpectreTestimonialElement
    el.setAttribute('aria-label', 'Empty testimonial placeholder')
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-testimonial has no violations with slotted nested interactive content', async () => {
    const el = document.createElement(
      'sp-testimonial'
    ) as SpectreTestimonialElement
    el.innerHTML =
      '<blockquote>Great product.</blockquote><a href="/reviews/1">Read full review</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-nav has no violations with an aria-label and links', async () => {
    const el = document.createElement('sp-nav') as SpectreNavElement
    el.setAttribute('aria-label', 'Primary')
    el.innerHTML = '<a href="/">Home</a><a href="/about">About</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-sidebar has no violations with an aria-label and links', async () => {
    const el = document.createElement('sp-sidebar') as SpectreSidebarElement
    el.setAttribute('aria-label', 'Dashboard navigation')
    el.innerHTML = '<a href="/dashboard">Dashboard</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-dropdown has no violations closed', async () => {
    const el = document.createElement('sp-dropdown') as SpectreDropdownElement
    el.innerHTML = '<a href="/profile">Profile</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-dropdown has no violations open', async () => {
    const el = document.createElement('sp-dropdown') as SpectreDropdownElement
    el.open = true
    el.innerHTML = '<a href="/profile">Profile</a>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-modal has no violations with an aria-label', async () => {
    const el = document.createElement('sp-modal') as SpectreModalElement
    el.open = true
    el.setAttribute('aria-label', 'Confirm deletion')
    el.innerHTML = '<button type="button">Confirm</button>'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-toast has no violations with populated content', async () => {
    const el = document.createElement('sp-toast') as SpectreToastElement
    el.textContent = 'Saved successfully'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-tooltip has no violations with trigger and tooltip content', async () => {
    const el = document.createElement('sp-tooltip') as SpectreTooltipElement
    const trigger = document.createElement('button')
    trigger.textContent = 'Info'
    const body = document.createElement('span')
    body.setAttribute('slot', 'tooltip')
    body.textContent = 'More details'
    el.append(trigger, body)
    const violations = await audit(el)
    expect(violations).toEqual([])
  })
})
