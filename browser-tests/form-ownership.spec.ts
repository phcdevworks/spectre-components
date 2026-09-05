import { expect, test } from '@playwright/test'
import type { SpectreRadioElement } from '../src'

test('radio groups follow explicit form ownership and reassociation', async ({
  page
}) => {
  await page.goto('/')
  const result = await page.evaluate(async () => {
    const formA = document.createElement('form')
    const formB = document.createElement('form')
    formA.id = 'radio-owner-a'
    formB.id = 'radio-owner-b'
    const a = document.createElement('sp-radio') as SpectreRadioElement
    const b = document.createElement('sp-radio') as SpectreRadioElement
    a.name = b.name = 'ownership-choice'
    a.form = formA.id
    b.form = formB.id
    document.body.append(formA, formB, a, b)
    await Promise.all([a.updateComplete, b.updateComplete])
    a.querySelector('input')!.click()
    await a.updateComplete
    b.querySelector('input')!.click()
    await b.updateComplete
    await a.updateComplete
    const independent = [
      a.checked,
      b.checked,
      a.querySelector('input')!.checked,
      b.querySelector('input')!.checked
    ]
    b.form = formA.id
    await b.updateComplete
    await a.updateComplete
    const shared = [
      a.checked,
      b.checked,
      a.querySelector('input')!.checked,
      b.querySelector('input')!.checked
    ]
    formA.remove()
    formB.remove()
    a.remove()
    b.remove()
    return { independent, shared }
  })
  expect(result.independent).toEqual([true, true, true, true])
  expect(result.shared).toEqual([false, true, false, true])
})
