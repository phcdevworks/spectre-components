import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import axe from 'axe-core'

import {
  defineSpectreComponents,
  defineSpectreAccordion,
  defineSpectreAccordionItem,
  defineSpectreAlert,
  defineSpectreBadge,
  defineSpectreBreadcrumb,
  defineSpectreButton,
  defineSpectreCarousel,
  defineSpectreCard,
  defineSpectreCheckbox,
  defineSpectreDropdown,
  defineSpectreFieldset,
  defineSpectreIconBox,
  defineSpectreInput,
  defineSpectreLabel,
  defineSpectreListGroup,
  defineSpectreListGroupItem,
  defineSpectreModal,
  defineSpectreNav,
  defineSpectreOffcanvas,
  defineSpectrePagination,
  defineSpectreRadio,
  defineSpectreRating,
  defineSpectreSelect,
  defineSpectreSidebar,
  defineSpectreSidebarToggle,
  defineSpectreStepper,
  defineSpectreTabPanel,
  defineSpectreTable,
  defineSpectreTabs,
  defineSpectreTestimonial,
  defineSpectreTextarea,
  defineSpectreToast,
  defineSpectreTooltip,
  SpectreAlertElement,
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
  SpectreOffcanvasElement,
  SpectreRadioElement,
  SpectreRatingElement,
  SpectreSelectElement,
  SpectreSidebarElement,
  SpectreSidebarToggleElement,
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

// Mounts markup containing several Spectre elements and waits for each one,
// including parent/child pairs that re-render after their children upgrade.
async function auditTree(root: HTMLElement): Promise<axe.Result[]> {
  document.body.append(root)
  const settle = async () => {
    const elements = Array.from(root.querySelectorAll('*')).filter(
      (el) => 'updateComplete' in el
    ) as unknown as { updateComplete: Promise<boolean> }[]
    await Promise.all(elements.map((el) => el.updateComplete))
  }
  await settle()
  await settle()
  const { violations } = await axe.run(root, AXE_OPTIONS)
  return violations
}

describe('accessibility audit', () => {
  beforeAll(() => {
    defineSpectreComponents()
    defineSpectreAccordion()
    defineSpectreAccordionItem()
    defineSpectreAlert()
    defineSpectreBadge()
    defineSpectreBreadcrumb()
    defineSpectreCarousel()
    defineSpectreListGroup()
    defineSpectreListGroupItem()
    defineSpectreOffcanvas()
    defineSpectrePagination()
    defineSpectreStepper()
    defineSpectreTabPanel()
    defineSpectreTable()
    defineSpectreTabs()
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
    defineSpectreSidebarToggle()
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

  it('sp-sidebar-toggle has no violations', async () => {
    const el = document.createElement(
      'sp-sidebar-toggle'
    ) as SpectreSidebarToggleElement
    el.for = 'audit-sidebar'
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

  it('sp-alert dismissible with an icon has no violations', async () => {
    const el = document.createElement('sp-alert') as SpectreAlertElement
    el.variant = 'brand'
    el.dismissible = true
    el.innerHTML = '<svg slot="icon" aria-hidden="true"></svg>Update available'
    const violations = await audit(el)
    expect(violations).toEqual([])
  })

  it('sp-tabs has no violations', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-tabs aria-label="Account">
      <sp-tab-panel label="Profile">Profile settings</sp-tab-panel>
      <sp-tab-panel label="Security" disabled>Security settings</sp-tab-panel>
    </sp-tabs>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-accordion has no violations with one item open', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-accordion>
      <sp-accordion-item label="Shipping" open>Ships in 2 days</sp-accordion-item>
      <sp-accordion-item label="Returns">30 day returns</sp-accordion-item>
    </sp-accordion>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-breadcrumb has no violations', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-breadcrumb separator="›">
      <a href="/">Home</a><a href="/docs">Docs</a><span>Tabs</span>
    </sp-breadcrumb>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-list-group has no violations for static and actionable rows', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-list-group aria-label="Folders">
      <sp-list-group-item>Static</sp-list-group-item>
    </sp-list-group>
    <sp-list-group aria-label="Mailboxes">
      <sp-list-group-item href="/inbox" active>Inbox</sp-list-group-item>
      <sp-list-group-item interactive>Archive</sp-list-group-item>
      <sp-list-group-item interactive disabled>Spam</sp-list-group-item>
    </sp-list-group>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-offcanvas has no violations open or closed', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-offcanvas label="Filters">
      <button type="button">Apply</button>
    </sp-offcanvas>`
    expect(await auditTree(el)).toEqual([])

    const offcanvas = el.querySelector(
      'sp-offcanvas'
    ) as SpectreOffcanvasElement
    offcanvas.open = true
    await offcanvas.updateComplete
    const { violations } = await axe.run(el, AXE_OPTIONS)
    expect(violations).toEqual([])
  })

  it('sp-carousel has no violations', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-carousel aria-label="Featured">
      <img alt="First slide" src="one.png" />
      <img alt="Second slide" src="two.png" />
    </sp-carousel>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-table has no violations with a labelled scroll region', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-table aria-label="Team" striped>
      <table>
        <thead><tr><th scope="col">Name</th></tr></thead>
        <tbody><tr><td>Ada</td></tr></tbody>
      </table>
    </sp-table>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-pagination has no violations as buttons or links', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-pagination total="12" page="6"></sp-pagination>
      <sp-pagination aria-label="Results pages" total="3" href-template="?page={page}"></sp-pagination>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it('sp-stepper has no violations', async () => {
    const el = document.createElement('div')
    el.innerHTML = `<sp-stepper aria-label="Checkout" current="1">
      <span>Cart</span><span>Shipping</span><span>Payment</span>
    </sp-stepper>`
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })

  it.each([
    [
      'sp-switch',
      '<form><sp-switch name="n">Email alerts</sp-switch><sp-switch aria-label="Dark mode" checked></sp-switch></form>'
    ],
    ['sp-range', '<sp-range aria-label="Volume" value="40"></sp-range>'],
    [
      'sp-file-input',
      '<sp-file-input aria-label="Attachment" invalid></sp-file-input>'
    ],
    [
      'sp-choice-card',
      '<fieldset><legend>Shipping</legend><sp-choice-card name="s" value="a" checked>Standard</sp-choice-card><sp-choice-card name="s" value="b" disabled>Express</sp-choice-card></fieldset>'
    ],
    [
      'sp-input-group',
      '<sp-input-group aria-label="Amount"><span slot="addon">$</span><input aria-label="Amount in dollars" /><button type="button">Apply</button></sp-input-group>'
    ],
    [
      'sp-progress',
      '<sp-progress label="Uploading" value="40"></sp-progress><sp-progress aria-label="Loading" indeterminate></sp-progress>'
    ],
    [
      'sp-popover (closed and open)',
      '<sp-popover label="Details"><span slot="trigger">Info</span><p>Body</p></sp-popover><sp-popover open trigger-label="Help"><a href="/help">Docs</a></sp-popover>'
    ],
    [
      'sp-prose',
      '<sp-prose><h2>Title</h2><p>Body <code>x</code></p></sp-prose>'
    ],
    [
      'sp-card-bleed',
      '<sp-card><sp-card-bleed edges="top" padded><img alt="Cover" src="c.png" /></sp-card-bleed><p>Body</p></sp-card>'
    ],
    [
      'sp-external-auth-button',
      '<sp-external-auth-button><svg slot="icon" aria-hidden="true"></svg>Continue with Example</sp-external-auth-button>'
    ],
    [
      'sp-datepicker',
      '<sp-datepicker value="2026-09-15" min="2026-09-05"></sp-datepicker>'
    ],
    [
      'sp-input with label and error',
      '<sp-input label="Email" error-message="Required"></sp-input>'
    ],
    [
      'sp-pricing-card and sp-testimonial slots',
      '<sp-pricing-card><span slot="badge">Popular</span><span slot="price">$29</span><p slot="description">Teams</p></sp-pricing-card><sp-testimonial><p slot="quote">Great.</p><span slot="author-name">Ada</span></sp-testimonial>'
    ],
    [
      'sp-text presets',
      '<sp-text level="h2" preset="heading">Title</sp-text><sp-text preset="lead">Intro</sp-text>'
    ]
  ])('%s has no violations', async (_name, markup) => {
    const el = document.createElement('div')
    el.innerHTML = markup
    const violations = await auditTree(el)
    expect(violations).toEqual([])
  })
})
