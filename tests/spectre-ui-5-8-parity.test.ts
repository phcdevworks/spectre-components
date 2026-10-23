import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreComponents } from '../src'

type Updatable = HTMLElement & {
  updateComplete: Promise<boolean>
  requestUpdate: () => void
}

async function mount(markup: string): Promise<HTMLElement> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  for (let pass = 0; pass < 3; pass++) {
    const elements = Array.from(host.querySelectorAll('*')).filter(
      (element): element is Updatable => 'updateComplete' in element
    )
    await Promise.all(elements.map((element) => element.updateComplete))
  }
  return host
}

function classesOf(root: ParentNode, selector: string): string {
  return root.querySelector(selector)?.className ?? ''
}

describe('spectre-ui 5.8.0 parity', () => {
  beforeAll(() => {
    defineSpectreComponents()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('sp-button accepts the action variant', async () => {
    const root = await mount('<sp-button variant="action">Go</sp-button>')
    expect(classesOf(root, 'button')).toContain('sp-btn--action')
  })

  it('sp-stat colours the unit with unit-tone and drops unknown tones', async () => {
    const root = await mount(
      '<sp-stat unit-tone="action">42<span slot="unit">%</span></sp-stat>'
    )
    expect(classesOf(root, '[data-sp-stat-native]')).toContain(
      'sp-stat--unit-action'
    )

    const stat = root.querySelector('sp-stat') as Updatable & {
      unitTone?: string
    }
    stat.setAttribute('unit-tone', 'loud')
    await stat.updateComplete
    expect(stat.unitTone).toBe('accent')
    expect(classesOf(root, '[data-sp-stat-native]')).not.toContain(
      'sp-stat--unit-action'
    )
  })

  it('sp-quote accepts the action accent colour', async () => {
    const root = await mount(
      '<sp-quote accent-color="action">Quoted</sp-quote>'
    )
    expect(classesOf(root, '[data-sp-quote-native]')).toContain(
      'sp-quote--accent-action'
    )
  })

  it('sp-footer accepts the action surface', async () => {
    const root = await mount('<sp-footer surface="action"></sp-footer>')
    expect(classesOf(root, '[data-sp-footer-native]')).toContain(
      'sp-footer--surface-action'
    )
  })

  it('sp-prose sets its size and drops unknown sizes', async () => {
    const root = await mount('<sp-prose size="lg"><p>Body</p></sp-prose>')
    expect(classesOf(root, '[data-sp-prose-native]')).toContain('sp-prose--lg')

    const prose = root.querySelector('sp-prose') as Updatable & {
      size?: string
    }
    prose.setAttribute('size', 'huge')
    await prose.updateComplete
    expect(prose.size).toBeUndefined()
    expect(classesOf(root, '[data-sp-prose-native]')).not.toContain(
      'sp-prose--'
    )
  })

  it('sp-sidebar adds one group chevron and the group content class', async () => {
    const root = await mount(`<sp-sidebar>
      <details slot="group">
        <summary>Docs</summary>
        <div slot="content"><a href="/a">A</a></div>
      </details>
    </sp-sidebar>`)
    const sidebar = root.querySelector('sp-sidebar') as Updatable
    sidebar.requestUpdate()
    await sidebar.updateComplete

    const summary = root.querySelector('summary')
    const icons = summary?.querySelectorAll('.sp-sidebar__group-icon')
    expect(icons?.length).toBe(1)
    expect(icons?.[0]?.getAttribute('aria-hidden')).toBe('true')
    expect(summary?.textContent).toContain('Docs')
    expect(classesOf(root, '[slot="content"]')).toContain(
      'sp-sidebar__group-content'
    )
  })

  it('sp-sidebar-toggle forwards forced hover and focus states', async () => {
    const root = await mount(
      '<sp-sidebar-toggle hovered focused></sp-sidebar-toggle>'
    )
    const classes = classesOf(root, '[data-sp-sidebar-toggle-native]')
    expect(classes).toContain('is-hover')
    expect(classes).toContain('is-focus')
  })
})
