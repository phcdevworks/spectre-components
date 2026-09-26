import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  defineSpectreCardBleed,
  defineSpectreExternalAuthButton,
  defineSpectrePopover,
  defineSpectreProgress,
  defineSpectreProse,
  SpectreCardBleedElement,
  SpectreExternalAuthButtonElement,
  SpectrePopoverElement,
  SpectreProgressElement
} from '../src'

type Updatable = HTMLElement & { updateComplete: Promise<boolean> }

async function mount<T extends HTMLElement>(
  markup: string,
  selector: string
): Promise<T> {
  document.body.innerHTML = markup
  const elements = Array.from(document.body.querySelectorAll('*')).filter(
    (element): element is Updatable => 'updateComplete' in element
  )
  await Promise.all(elements.map((element) => element.updateComplete))
  return document.querySelector(selector) as T
}

describe('new display components', () => {
  beforeAll(() => {
    defineSpectreProgress()
    defineSpectrePopover()
    defineSpectreProse()
    defineSpectreCardBleed()
    defineSpectreExternalAuthButton()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('sp-progress', () => {
    it('renders a labelled progressbar with a proportional fill', async () => {
      const element = await mount<SpectreProgressElement>(
        '<sp-progress label="Uploading" value="30" max="120" variant="success"></sp-progress>',
        'sp-progress'
      )
      const track = element.querySelector('[role="progressbar"]')!
      const bar = element.querySelector<HTMLElement>('[data-sp-progress-bar]')!
      const label = element.querySelector('.sp-progress__label')!

      expect(track.getAttribute('aria-valuenow')).toBe('30')
      expect(track.getAttribute('aria-valuemax')).toBe('120')
      expect(track.getAttribute('aria-labelledby')).toBe(label.id)
      expect(bar.style.width).toBe('25%')
      expect(bar.className).toContain('sp-progress__bar--success')
    })

    it('omits the value and width when indeterminate', async () => {
      const element = await mount<SpectreProgressElement>(
        '<sp-progress aria-label="Loading" indeterminate></sp-progress>',
        'sp-progress'
      )
      const bar = element.querySelector<HTMLElement>('[data-sp-progress-bar]')!

      expect(
        element
          .querySelector('[role="progressbar"]')
          ?.hasAttribute('aria-valuenow')
      ).toBe(false)
      expect(bar.style.width).toBe('')
      expect(bar.className).toContain('indeterminate')
    })

    it('clamps values and falls back for invalid options', async () => {
      const element = await mount<SpectreProgressElement>(
        '<sp-progress aria-label="P" value="150" variant="rainbow" size="xl"></sp-progress>',
        'sp-progress'
      )
      expect(element.value).toBe(100)
      expect(element.variant).toBe('brand')
      expect(element.size).toBe('md')
    })
  })

  describe('sp-popover', () => {
    const POPOVER = `<sp-popover label="Details">
      <span slot="trigger">Info</span>
      <p>More detail</p>
    </sp-popover>`

    it('renders a trigger wired to a labelled dialog', async () => {
      const element = await mount<SpectrePopoverElement>(POPOVER, 'sp-popover')
      const trigger = element.querySelector('[data-sp-popover-trigger]')!
      const dialog = element.querySelector('[data-sp-popover-native]')!
      const header = element.querySelector('.sp-popover__header')!

      expect(trigger.textContent?.trim()).toBe('Info')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.getAttribute('aria-controls')).toBe(dialog.id)
      expect(dialog.getAttribute('role')).toBe('dialog')
      expect(dialog.getAttribute('aria-labelledby')).toBe(header.id)
      expect(dialog.className).toContain('sp-popover--bottom')
      expect(dialog.querySelector('.sp-popover__arrow')).not.toBeNull()
      expect(dialog.querySelector('.sp-popover__body')?.textContent).toContain(
        'More detail'
      )
    })

    it('toggles on click and closes on Escape and outside clicks', async () => {
      const element = await mount<SpectrePopoverElement>(POPOVER, 'sp-popover')
      const trigger = element.querySelector<HTMLButtonElement>(
        '[data-sp-popover-trigger]'
      )!
      const opened = vi.fn()
      const closed = vi.fn()
      element.addEventListener('sp-open', opened)
      element.addEventListener('sp-close', closed)

      trigger.click()
      await element.updateComplete
      expect(element.open).toBe(true)
      expect(
        element.querySelector('[data-sp-popover-native]')?.className
      ).toContain('sp-popover--open')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await element.updateComplete
      expect(element.open).toBe(false)

      trigger.click()
      await element.updateComplete
      document.body.click()
      await element.updateComplete
      expect(element.open).toBe(false)

      expect(opened).toHaveBeenCalledTimes(2)
      expect(closed).toHaveBeenCalledTimes(2)
    })

    it('labels itself by the trigger when it has no header', async () => {
      const element = await mount<SpectrePopoverElement>(
        '<sp-popover trigger-label="Help"><p>Body</p></sp-popover>',
        'sp-popover'
      )
      const trigger = element.querySelector('[data-sp-popover-trigger]')!
      expect(
        element
          .querySelector('[data-sp-popover-native]')
          ?.getAttribute('aria-labelledby')
      ).toBe(trigger.id)
      expect(trigger.textContent?.trim()).toBe('Help')
    })

    it('falls back to bottom placement', async () => {
      const element = await mount<SpectrePopoverElement>(
        '<sp-popover placement="middle"></sp-popover>',
        'sp-popover'
      )
      expect(element.placement).toBe('bottom')
    })
  })

  it('sp-prose wraps authored content in the prose surface', async () => {
    const element = await mount(
      '<sp-prose><h2>Title</h2><p>Body</p></sp-prose>',
      'sp-prose'
    )
    const native = element.querySelector('[data-sp-prose-native]')!
    expect(native.className).toBe('sp-prose')
    expect(native.querySelector('h2')?.textContent).toBe('Title')
  })

  describe('sp-card-bleed', () => {
    it('bleeds through the requested edges and padding step', async () => {
      const element = await mount<SpectreCardBleedElement>(
        '<sp-card-bleed edges="top left" padded="lg"><img alt="" src="x.png" /></sp-card-bleed>',
        'sp-card-bleed'
      )
      const classes =
        element.querySelector('[data-sp-card-bleed-native]')?.className ?? ''
      expect(classes).toContain('sp-card__bleed--top')
      expect(classes).toContain('sp-card__bleed--left')
      expect(classes).toContain('sp-card__bleed--padded-lg')
      expect(classes).not.toContain('--right')
    })

    it('treats a bare padded attribute as the md step and supports all edges', async () => {
      const element = await mount<SpectreCardBleedElement>(
        '<sp-card-bleed edges="all" padded></sp-card-bleed>',
        'sp-card-bleed'
      )
      const classes =
        element.querySelector('[data-sp-card-bleed-native]')?.className ?? ''
      expect(element.padded).toBe('md')
      expect(classes).toContain('sp-card__bleed--top')
      expect(classes).toContain('sp-card__bleed--bottom')
    })
  })

  describe('sp-external-auth-button', () => {
    it('renders the provider icon slot and label in a button', async () => {
      const element = await mount<SpectreExternalAuthButtonElement>(
        '<sp-external-auth-button full-width><svg slot="icon" aria-hidden="true"></svg>Continue with Example</sp-external-auth-button>',
        'sp-external-auth-button'
      )
      const button = element.querySelector('button')!

      expect(button.type).toBe('button')
      expect(button.className).toContain('sp-external-auth-btn--full')
      expect(
        button.querySelector('.sp-external-auth-btn__icon svg')
      ).not.toBeNull()
      expect(button.textContent).toContain('Continue with Example')
    })

    it('renders a link with href and disables it without an href', async () => {
      const element = await mount<SpectreExternalAuthButtonElement>(
        '<sp-external-auth-button href="/oauth" disabled>Sign in</sp-external-auth-button>',
        'sp-external-auth-button'
      )
      const link = element.querySelector('a')!
      expect(link.hasAttribute('href')).toBe(false)
      expect(link.getAttribute('aria-disabled')).toBe('true')
    })
  })
})
