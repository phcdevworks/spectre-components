import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreStepper, SpectreStepperElement } from '../src'

async function renderStepper(markup: string): Promise<SpectreStepperElement> {
  document.body.innerHTML = markup
  const element = document.querySelector('sp-stepper') as SpectreStepperElement
  await element.updateComplete
  return element
}

const CHECKOUT = `<sp-stepper aria-label="Checkout progress" current="1">
  <span>Cart</span>
  <span>Shipping</span>
  <span>Payment</span>
</sp-stepper>`

describe('sp-stepper', () => {
  beforeAll(() => {
    defineSpectreStepper()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders an ordered list with one step per projected element', async () => {
    const element = await renderStepper(CHECKOUT)
    const list = element.querySelector('ol')

    expect(list?.className).toContain('sp-stepper--horizontal')
    expect(list?.getAttribute('aria-label')).toBe('Checkout progress')
    expect(element.querySelectorAll('li')).toHaveLength(3)
  })

  it('derives done, active, and pending states from current', async () => {
    const element = await renderStepper(CHECKOUT)
    const steps = Array.from(element.querySelectorAll('li'))

    expect(steps.map((step) => step.dataset.state)).toEqual([
      'done',
      'active',
      'pending'
    ])
    expect(steps[1]?.getAttribute('aria-current')).toBe('step')
    expect(steps[1]?.className).toContain('sp-stepper__step--active')
    expect(steps[0]?.querySelector('svg')).not.toBeNull()
    expect(steps[2]?.querySelector('.sp-stepper__indicator')?.textContent).toBe(
      '3'
    )
  })

  it('wraps each projected element in the label slot', async () => {
    const element = await renderStepper(CHECKOUT)
    const label = element.querySelector('li .sp-stepper__label')

    expect(label?.querySelector('span')?.textContent).toBe('Cart')
  })

  it('marks every step done when current is past the last step', async () => {
    const element = await renderStepper(
      CHECKOUT.replace('current="1"', 'current="3"')
    )
    const states = Array.from(element.querySelectorAll('li')).map(
      (step) => step.dataset.state
    )
    expect(states).toEqual(['done', 'done', 'done'])
  })

  it('applies vertical orientation and falls back for invalid values', async () => {
    const element = await renderStepper(
      CHECKOUT.replace('<sp-stepper', '<sp-stepper orientation="vertical"')
    )
    expect(element.querySelector('ol')?.className).toContain(
      'sp-stepper--vertical'
    )

    element.setAttribute('orientation', 'diagonal')
    await element.updateComplete
    expect(element.orientation).toBe('horizontal')
  })

  it('falls back to 0 for an invalid current value', async () => {
    const element = await renderStepper(
      CHECKOUT.replace('current="1"', 'current="-2"')
    )
    expect(element.current).toBe(0)
  })
})
