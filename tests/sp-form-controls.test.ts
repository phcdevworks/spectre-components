import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  defineSpectreChoiceCard,
  defineSpectreFileInput,
  defineSpectreInputGroup,
  defineSpectreRange,
  defineSpectreSwitch,
  SpectreChoiceCardElement,
  SpectreFileInputElement,
  SpectreRangeElement,
  SpectreSwitchElement
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

describe('new form controls', () => {
  beforeAll(() => {
    defineSpectreSwitch()
    defineSpectreRange()
    defineSpectreFileInput()
    defineSpectreChoiceCard()
    defineSpectreInputGroup()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('sp-switch', () => {
    it('renders a native role="switch" checkbox with a label', async () => {
      const element = await mount<SpectreSwitchElement>(
        '<sp-switch name="alerts" size="lg">Email alerts</sp-switch>',
        'sp-switch'
      )
      const input = element.querySelector('input')!

      expect(input.type).toBe('checkbox')
      expect(input.getAttribute('role')).toBe('switch')
      expect(input.name).toBe('alerts')
      expect(input.className).toContain('sp-switch--lg')
      expect(input.closest('label')?.textContent).toContain('Email alerts')
    })

    it('tracks the checked state and submits with its form', async () => {
      const form = document.createElement('form')
      document.body.append(form)
      const element = document.createElement(
        'sp-switch'
      ) as SpectreSwitchElement
      element.name = 'alerts'
      element.label = 'Alerts'
      form.append(element)
      await element.updateComplete

      element.querySelector('input')!.click()
      await element.updateComplete

      expect(element.checked).toBe(true)
      expect(new FormData(form).get('alerts')).toBe('on')
    })

    it('falls back to size=md', async () => {
      const element = await mount<SpectreSwitchElement>(
        '<sp-switch size="xl" label="X"></sp-switch>',
        'sp-switch'
      )
      expect(element.size).toBe('md')
    })
  })

  describe('sp-range', () => {
    it('renders a native range input and mirrors the fill percentage', async () => {
      const element = await mount<SpectreRangeElement>(
        '<sp-range aria-label="Volume" min="0" max="200" value="50"></sp-range>',
        'sp-range'
      )
      const input = element.querySelector('input')!

      expect(input.type).toBe('range')
      expect(input.className).toContain('sp-range')
      expect(input.style.getPropertyValue('--sp-component-range-value')).toBe(
        '25%'
      )
    })

    it('clamps the value into range and follows user input', async () => {
      const element = await mount<SpectreRangeElement>(
        '<sp-range aria-label="Level" value="500"></sp-range>',
        'sp-range'
      )
      expect(element.value).toBe(100)

      const input = element.querySelector('input')!
      input.value = '30'
      input.dispatchEvent(new Event('input'))
      await element.updateComplete
      expect(element.value).toBe(30)
    })
  })

  describe('sp-file-input', () => {
    it('renders a styled native file input', async () => {
      const element = await mount<SpectreFileInputElement>(
        '<sp-file-input aria-label="Avatar" accept="image/*" multiple invalid size="sm"></sp-file-input>',
        'sp-file-input'
      )
      const input = element.querySelector('input')!

      expect(input.type).toBe('file')
      expect(input.accept).toBe('image/*')
      expect(input.multiple).toBe(true)
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.className).toContain('sp-file-input--invalid')
      expect(input.className).toContain('sp-file-input--sm')
    })
  })

  describe('sp-choice-card', () => {
    const CARDS = `<form>
      <sp-choice-card name="ship" value="std" checked>Standard</sp-choice-card>
      <sp-choice-card name="ship" value="exp">Express</sp-choice-card>
    </form>`

    it('wraps a native radio in a label card', async () => {
      const card = await mount<SpectreChoiceCardElement>(
        CARDS,
        'sp-choice-card'
      )
      const label = card.querySelector('label')!
      const input = label.querySelector('input')!

      expect(label.className).toContain('sp-choice-card')
      expect(input.type).toBe('radio')
      expect(input.checked).toBe(true)
      expect(label.textContent).toContain('Standard')
    })

    it('keeps sibling cards in sync when a radio is chosen', async () => {
      await mount(CARDS, 'sp-choice-card')
      const [standard, express] = Array.from(
        document.querySelectorAll<SpectreChoiceCardElement>('sp-choice-card')
      )

      express!.querySelector('input')!.click()
      await express!.updateComplete

      expect(express!.checked).toBe(true)
      expect(standard!.checked).toBe(false)
      expect(new FormData(document.querySelector('form')!).get('ship')).toBe(
        'exp'
      )
    })

    it('supports checkbox cards', async () => {
      const card = await mount<SpectreChoiceCardElement>(
        '<sp-choice-card type="checkbox" name="extras">Gift wrap</sp-choice-card>',
        'sp-choice-card'
      )
      expect(card.querySelector('input')?.type).toBe('checkbox')
    })
  })

  describe('sp-input-group', () => {
    it('styles native controls and addons in authored order', async () => {
      const group = await mount(
        `<sp-input-group aria-label="Handle">
          <span slot="addon">@</span>
          <input aria-label="Username" />
          <button type="button">Check</button>
        </sp-input-group>`,
        'sp-input-group'
      )
      const native = group.querySelector('[data-sp-input-group-native]')!
      const [addon, input, button] = Array.from(native.children)

      expect(native.className).toContain('sp-input-group')
      expect(native.getAttribute('role')).toBe('group')
      expect(addon?.className).toContain('sp-input-group__addon')
      expect(input?.className).toContain('sp-input')
      expect(button?.className).toContain('sp-btn')
    })

    it('leaves controls that already carry an sp-* class alone', async () => {
      const group = await mount(
        `<sp-input-group><select class="sp-select sp-select--sm"><option>A</option></select></sp-input-group>`,
        'sp-input-group'
      )
      expect(group.querySelector('select')?.className).toBe(
        'sp-select sp-select--sm'
      )
    })

    it('emits native events through untouched controls', async () => {
      const group = await mount(
        '<sp-input-group><input aria-label="Q" /></sp-input-group>',
        'sp-input-group'
      )
      const handler = vi.fn()
      group.addEventListener('input', handler)
      group
        .querySelector('input')!
        .dispatchEvent(new Event('input', { bubbles: true }))
      expect(handler).toHaveBeenCalledOnce()
    })
  })
})
