import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineSpectreComponents } from '../src'

type Updatable = HTMLElement & { updateComplete: Promise<boolean> }

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

describe('spectre-ui 5.3.0 parity', () => {
  beforeAll(() => {
    defineSpectreComponents()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it.each([
    ['sp-button', 'variant="warning"', 'button', 'sp-btn--warning'],
    ['sp-button', 'variant="link"', 'button', 'sp-btn--link'],
    ['sp-button', 'variant="light"', 'button', 'sp-btn--light'],
    ['sp-button', 'variant="dark"', 'button', 'sp-btn--dark'],
    ['sp-badge', 'variant="brand"', 'span', 'sp-badge--brand'],
    ['sp-spinner', 'variant="inverse"', '[class*="sp-spinner"]', 'inverse'],
    ['sp-toast', 'variant="neutral"', '[data-sp-toast-native]', 'neutral'],
    ['sp-text', 'variant="onSurfaceMuted"', 'p', 'on-surface-muted']
  ])(
    '%s accepts the new %s value',
    async (tag, attribute, selector, expected) => {
      const root = await mount(`<${tag} ${attribute}>Label</${tag}>`)
      expect(classesOf(root, selector)).toContain(expected)
    }
  )

  it('sp-badge renders the dot and interactive modes', async () => {
    const root = await mount('<sp-badge dot interactive></sp-badge>')
    const classes = classesOf(root, 'span')
    expect(classes).toContain('sp-badge--dot')
    expect(classes).toContain('sp-badge--interactive')
  })

  it('sp-rating forwards interactive, pill, and full-width', async () => {
    const root = await mount(
      '<sp-rating interactive pill full-width></sp-rating>'
    )
    const classes = classesOf(root, '[data-sp-rating-native]')
    expect(classes).toContain('interactive')
    expect(classes).toContain('pill')
    expect(classes).toContain('full')
  })

  it('sp-alert forwards interactive', async () => {
    const root = await mount('<sp-alert interactive>Note</sp-alert>')
    expect(classesOf(root, '[data-sp-alert-native]')).toContain(
      'sp-alert--interactive'
    )
  })

  it.each([
    ['sp-button', 'button'],
    ['sp-card', '[data-sp-card-native]'],
    ['sp-badge', 'span'],
    ['sp-tag', '[data-sp-tag-native]'],
    ['sp-avatar', '[data-sp-avatar-native]'],
    ['sp-icon-box', '[data-sp-icon-box-native]'],
    ['sp-input', 'input'],
    ['sp-alert', '[data-sp-alert-native]'],
    ['sp-pricing-card', '[data-sp-pricing-card-native]'],
    ['sp-testimonial', '[data-sp-testimonial-native]'],
    ['sp-rating', '[data-sp-rating-native]']
  ])('%s forces hovered, focused, and active states', async (tag, selector) => {
    const root = await mount(`<${tag} hovered focused active></${tag}>`)
    const classes = classesOf(root, selector)
    expect(classes).toMatch(/--hover|is-hover/)
    expect(classes).toMatch(/--focus|is-focus/)
    expect(classes).toMatch(/--active|is-active/)
  })

  it.each([
    ['sp-footer-chip', '[data-sp-footer-chip-native]'],
    ['sp-footer-link', 'a'],
    ['sp-sidebar-link', 'a']
  ])('%s forces hovered and focused states', async (tag, selector) => {
    const root = await mount(`<${tag} href="#x" hovered focused>X</${tag}>`)
    const classes = classesOf(root, selector)
    expect(classes).toMatch(/--hover|is-hover/)
    expect(classes).toMatch(/--focus|is-focus/)
  })

  it.each([
    ['sp-select', 'select'],
    ['sp-textarea', 'textarea']
  ])('%s forces the focused state', async (tag, selector) => {
    const root = await mount(`<${tag} focused></${tag}>`)
    expect(classesOf(root, selector)).toMatch(/--focus|is-focus/)
  })

  it('sp-container forwards padding and the none/wide max widths', async () => {
    const root = await mount(
      '<sp-container padding="lg" max-width="wide"></sp-container>'
    )
    const classes = classesOf(root, '[data-sp-container-native]')
    expect(classes).toContain('lg')
    expect(classes).toContain('wide')
  })

  it('sp-section forwards spacing and gap', async () => {
    const root = await mount('<sp-section spacing="sm" gap="lg"></sp-section>')
    const classes = classesOf(root, 'section')
    expect(classes).toMatch(/sp-section--[a-z-]*sm/)
    expect(classes).toMatch(/sp-section--[a-z-]*lg/)
  })

  it('sp-section drops invalid spacing values', async () => {
    const root = await mount('<sp-section spacing="5xl"></sp-section>')
    const section = root.querySelector('sp-section') as HTMLElement & {
      spacing?: string
    }
    expect(section.spacing).toBeUndefined()
  })

  it('sp-stack accepts basis="none"', async () => {
    const root = await mount('<sp-stack basis="none"></sp-stack>')
    const stack = root.querySelector('sp-stack') as HTMLElement & {
      basis?: string
    }
    expect(stack.basis).toBe('none')
  })

  it('sp-grid forwards col-start', async () => {
    const root = await mount('<sp-grid col-start="3"></sp-grid>')
    expect(classesOf(root, '[data-sp-grid-native]')).toMatch(/start-3/)
  })

  describe('sp-text typography presets', () => {
    it('applies the heading preset from the element level', async () => {
      const root = await mount(
        '<sp-text level="h3" preset="heading">T</sp-text>'
      )
      const heading = root.querySelector('h3')
      expect(heading?.className).toBe('sp-heading sp-heading--h3')
    })

    it('lets heading-level decouple the look from the element', async () => {
      const root = await mount(
        '<sp-text level="h2" preset="heading" heading-level="h5">T</sp-text>'
      )
      expect(classesOf(root, 'h2')).toContain('sp-heading--h5')
    })

    it('applies the display and lead presets', async () => {
      const root = await mount(`
        <sp-text level="h1" preset="display" display-level="2">D</sp-text>
        <sp-text preset="lead">L</sp-text>`)
      expect(classesOf(root, 'h1')).toContain('sp-display--2')
      expect(classesOf(root, 'p')).toBe('sp-lead')
    })

    it('ignores an unknown preset', async () => {
      const root = await mount('<sp-text preset="poster">T</sp-text>')
      expect(classesOf(root, 'p')).toContain('sp-text')
    })
  })

  describe('sp-nav-item', () => {
    it('marks the current page and disables links', async () => {
      const root = await mount(`
        <sp-nav-item href="/a" active>A</sp-nav-item>
        <sp-nav-item href="/b" disabled>B</sp-nav-item>`)
      const [current, disabled] = Array.from(root.querySelectorAll('a'))
      expect(current?.getAttribute('aria-current')).toBe('page')
      expect(current?.className).toMatch(/active/)
      expect(disabled?.hasAttribute('href')).toBe(false)
      expect(disabled?.getAttribute('aria-disabled')).toBe('true')
    })

    it('forwards viewport, full-width, and accent to its dropdown', async () => {
      const root = await mount(
        '<sp-nav-item dropdown label="More" viewport full-width accent="top"></sp-nav-item>'
      )
      expect(classesOf(root, '[data-sp-nav-item-menu]')).toContain('viewport')
      expect(classesOf(root, '[data-sp-nav-item-menu]')).toContain('accent-top')
    })
  })

  describe('sp-input field chrome', () => {
    it('renders a label, helper text, and describes the input', async () => {
      const root = await mount(
        '<sp-input label="Email" helper-text="We never share it."></sp-input>'
      )
      const input = root.querySelector('input')!
      const label = root.querySelector('label')!
      const helper = root.querySelector('p')!

      expect(root.querySelector('[data-sp-input-wrapper]')).not.toBeNull()
      expect(label.htmlFor).toBe(input.id)
      expect(label.textContent?.trim()).toBe('Email')
      expect(input.getAttribute('aria-describedby')).toBe(helper.id)
    })

    it('replaces helper text with an error message and flags the input', async () => {
      const root = await mount(
        '<sp-input label="Email" helper-text="Hint" error-message="Required"></sp-input>'
      )
      const input = root.querySelector('input')!
      const message = root.querySelector('p')!

      expect(root.querySelectorAll('p')).toHaveLength(1)
      expect(message.textContent?.trim()).toBe('Required')
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.className).toContain('error')
    })

    it('keeps the bare input when no chrome is requested', async () => {
      const root = await mount('<sp-input></sp-input>')
      expect(root.querySelector('sp-input')?.firstElementChild?.tagName).toBe(
        'INPUT'
      )
    })
  })

  it('sp-pricing-card wraps the badge, price, and description slots', async () => {
    const root = await mount(`<sp-pricing-card>
      <span slot="badge">Popular</span>
      <span slot="price">$29</span>
      <p slot="description">For small teams</p>
      <p>Body</p>
    </sp-pricing-card>`)
    expect(root.querySelector('.sp-pricing-card-badge')?.textContent).toContain(
      'Popular'
    )
    expect(
      root.querySelector(
        '.sp-pricing-card-price-container .sp-pricing-card-price'
      )?.textContent
    ).toContain('$29')
    expect(
      root.querySelector('.sp-pricing-card-description')?.textContent
    ).toContain('For small teams')
  })

  it('sp-testimonial wraps the quote and author slots', async () => {
    const root = await mount(`<sp-testimonial>
      <p slot="quote">Great.</p>
      <img slot="author-image" alt="" src="a.png" />
      <span slot="author-name">Ada</span>
      <span slot="author-title">Engineer</span>
    </sp-testimonial>`)
    expect(root.querySelector('.sp-testimonial-quote')?.textContent).toContain(
      'Great.'
    )
    const author = root.querySelector('.sp-testimonial-author')
    expect(author?.querySelector('img')).not.toBeNull()
    expect(
      author?.querySelector('.sp-testimonial-author-name')?.textContent
    ).toContain('Ada')
    expect(
      author?.querySelector('.sp-testimonial-author-title')?.textContent
    ).toContain('Engineer')
  })

  describe('part markers', () => {
    it('sp-footer styles marked parts at any depth', async () => {
      const root = await mount(`<sp-footer>
        <div><h3 slot="heading">Company</h3><ul slot="links"></ul></div>
        <hr slot="divider" />
        <p slot="muted">© 2026</p>
        <p slot="text">Built with Spectre</p>
      </sp-footer>`)
      expect(root.querySelector('h3')?.className).toContain(
        'sp-footer__heading'
      )
      expect(root.querySelector('ul')?.className).toContain('sp-footer__links')
      expect(root.querySelector('hr')?.className).toContain(
        'sp-footer__divider'
      )
      expect(root.querySelector('[slot="muted"]')?.className).toContain(
        'sp-footer__muted'
      )
      expect(root.querySelector('[slot="text"]')?.className).toContain(
        'sp-footer__text'
      )
    })

    it('sp-nav styles a links group', async () => {
      const root = await mount(
        '<sp-nav><div slot="links"><a href="/">Home</a></div></sp-nav>'
      )
      expect(root.querySelector('[slot="links"]')?.className).toContain(
        'sp-nav__links'
      )
    })

    it('sp-sidebar styles its header and collapsible groups', async () => {
      const root = await mount(`<sp-sidebar>
        <div slot="header">Workspace</div>
        <details slot="group"><summary>Reports</summary><a href="#">Q1</a></details>
      </sp-sidebar>`)
      expect(root.querySelector('[slot="header"]')?.className).toContain(
        'sp-sidebar__header'
      )
      expect(root.querySelector('details')?.className).toContain(
        'sp-sidebar__group'
      )
      expect(root.querySelector('summary')?.className).toContain(
        'sp-sidebar__group-summary'
      )
    })

    it('sp-dropdown styles marked items, headers, and dividers only', async () => {
      const root = await mount(`<sp-dropdown>
        <span slot="header">Account</span>
        <a slot="item" href="/profile">Profile</a>
        <hr slot="divider" />
        <a href="/raw">Unmarked</a>
      </sp-dropdown>`)
      expect(root.querySelector('[slot="header"]')?.className).toContain(
        'sp-dropdown__header'
      )
      expect(root.querySelector('[slot="item"]')?.className).toContain(
        'sp-dropdown__item'
      )
      expect(root.querySelector('hr')?.className).toContain(
        'sp-dropdown__divider'
      )
      expect(root.querySelector('a[href="/raw"]')?.className).toBe('')
    })

    it('sp-nav-item styles marked dropdown items', async () => {
      const root = await mount(
        '<sp-nav-item dropdown label="More"><a slot="item" href="/x">X</a></sp-nav-item>'
      )
      expect(root.querySelector('[slot="item"]')?.className).toContain(
        'sp-dropdown__item'
      )
    })

    it('sp-list-group-item styles heading and text parts', async () => {
      const root = await mount(`<sp-list-group>
        <sp-list-group-item><span slot="heading">Title</span><span slot="text">Body</span></sp-list-group-item>
      </sp-list-group>`)
      expect(root.querySelector('[slot="heading"]')?.className).toContain(
        'sp-list-group__heading'
      )
      expect(root.querySelector('[slot="text"]')?.className).toContain(
        'sp-list-group__text'
      )
    })

    it('sp-carousel styles slide captions', async () => {
      const root = await mount(`<sp-carousel>
        <figure><img alt="One" src="1.png" /><figcaption slot="caption">One</figcaption></figure>
      </sp-carousel>`)
      expect(root.querySelector('figcaption')?.className).toContain(
        'sp-carousel__caption'
      )
    })

    it('sp-table styles rows that declare a data-variant', async () => {
      const root = await mount(`<sp-table><table><tbody>
        <tr data-variant="success"><td>Ok</td></tr>
        <tr data-variant="bogus"><td>No</td></tr>
      </tbody></table></sp-table>`)
      const [good, bad] = Array.from(root.querySelectorAll('tr'))
      expect(good?.className).toContain('sp-table__row--success')
      expect(bad?.className).toBe('')
    })
  })

  it('forwards hovered/focused on accordion headers and list-group rows', async () => {
    const root = await mount(`
      <sp-accordion><sp-accordion-item label="A" hovered focused>A</sp-accordion-item></sp-accordion>
      <sp-list-group><sp-list-group-item hovered focused>Row</sp-list-group-item></sp-list-group>`)
    expect(classesOf(root, '[data-sp-accordion-item-header]')).toMatch(
      /--hover|is-hover/
    )
    expect(classesOf(root, '[data-sp-list-group-row]')).toMatch(
      /--focus|is-focus/
    )
  })
})

describe('spectre-ui 5.4.0 parity', () => {
  beforeAll(() => {
    defineSpectreComponents()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('sp-footer defaults to the dark appearance and forwards light/system', async () => {
    const root = await mount(`
      <sp-footer></sp-footer>
      <sp-footer appearance="light"></sp-footer>
      <sp-footer appearance="system"></sp-footer>
      <sp-footer appearance="neon"></sp-footer>`)
    const [dark, light, system, neon] = Array.from(
      root.querySelectorAll('[data-sp-footer-native]')
    )
    expect(dark?.className).toBe('sp-footer')
    expect(light?.className).toContain('sp-footer--light')
    expect(system?.className).toContain('sp-footer--system')
    expect(neon?.className).toBe('sp-footer')
    const bogus = root.querySelector(
      'sp-footer:last-of-type'
    ) as HTMLElement & {
      appearance?: string
    }
    expect(bogus.appearance).toBe('dark')
  })

  it('sp-footer forwards a surface role and drops unknown ones', async () => {
    const root = await mount(`
      <sp-footer surface="card" appearance="light"></sp-footer>
      <sp-footer surface="neon"></sp-footer>`)
    const [card, bogus] = Array.from(
      root.querySelectorAll('[data-sp-footer-native]')
    )
    expect(card?.className).toContain('sp-footer--surface-card')
    expect(card?.className).toContain('sp-footer--light')
    expect(bogus?.className).not.toContain('surface')
  })

  it('sp-stack does not put a legacy align="center" hint on the host', async () => {
    const root = await mount('<sp-stack><p>Text</p></sp-stack>')
    const stack = root.querySelector('sp-stack') as HTMLElement & {
      align?: string
    }
    expect(stack.align).toBe('center')
    expect(stack.hasAttribute('align')).toBe(false)
    expect(classesOf(root, '[data-sp-stack-native]')).toBe('sp-stack')
  })

  it.each([
    ['sp-grid', '[data-sp-grid-native]'],
    ['sp-nav', '[data-sp-nav-native]']
  ])('%s does not reflect align onto the host', async (tag, selector) => {
    const root = await mount(`<${tag}></${tag}>`)
    const element = root.querySelector(tag) as HTMLElement & {
      align?: string
      updateComplete: Promise<boolean>
    }
    element.align = 'center'
    await element.updateComplete
    expect(element.hasAttribute('align')).toBe(false)
    expect(classesOf(root, selector)).toContain('center')
  })

  it('sp-stack still reads an authored align attribute', async () => {
    const root = await mount('<sp-stack align="stretch"></sp-stack>')
    expect(classesOf(root, '[data-sp-stack-native]')).toContain('stretch')
  })

  it('a nested sp-grid puts item placement on its host', async () => {
    const root = await mount(`
      <sp-grid columns="3">
        <sp-grid id="inner" columns="2" span='{"base":12,"lg":2}' order="2"></sp-grid>
      </sp-grid>`)
    const inner = root.querySelector('sp-grid sp-grid') as HTMLElement
    const innerNative = inner.querySelector('[data-sp-grid-native]')
    expect(inner.classList).toContain('sp-col-span-12')
    expect(inner.classList).toContain('sp-lg-col-span-2')
    expect(inner.classList).toContain('sp-order-2')
    expect(innerNative?.className).toContain('sp-grid-cols-2')
    expect(innerNative?.className).not.toContain('col-span')
    expect(innerNative?.className).not.toContain('order')
  })

  it('a nested sp-grid keeps authored host classes and tracks placement changes', async () => {
    const root = await mount(`
      <sp-grid columns="3">
        <sp-grid class="custom sp-lg-col-span-2" span='{"lg":2}'></sp-grid>
      </sp-grid>`)
    const inner = root.querySelector('sp-grid sp-grid') as HTMLElement & {
      span?: unknown
      updateComplete: Promise<boolean>
    }
    inner.span = 3
    await inner.updateComplete
    expect(inner.classList).toContain('custom')
    expect(inner.classList).toContain('sp-lg-col-span-2')
    expect(inner.classList).toContain('sp-col-span-3')
    inner.span = undefined
    await inner.updateComplete
    expect(inner.classList).not.toContain('sp-col-span-3')
    expect(inner.classList).toContain('sp-lg-col-span-2')
  })

  it('a top-level sp-grid keeps item placement on its native element', async () => {
    const root = await mount('<sp-grid span="2"></sp-grid>')
    const grid = root.querySelector('sp-grid') as HTMLElement
    expect(grid.classList).not.toContain('sp-col-span-2')
    expect(classesOf(root, '[data-sp-grid-native]')).toContain('sp-col-span-2')
  })

  it.each([
    ['sp-section', 'spacing="2xl"', 'section', /sp-section--[a-z-]*2xl/],
    ['sp-section', 'gap="4xl"', 'section', /sp-section--[a-z-]*4xl/],
    ['sp-stack', 'gap="xl"', '[data-sp-stack-native]', /gap-xl/],
    ['sp-grid', 'gap="3xl"', '[data-sp-grid-native]', /gap-3xl/],
    ['sp-grid', 'row-gap="2xl"', '[data-sp-grid-native]', /2xl/],
    ['sp-grid', 'column-gap="4xl"', '[data-sp-grid-native]', /4xl/],
    ['sp-container', 'padding="xl"', '[data-sp-container-native]', /xl/]
  ])('%s accepts the larger step %s', async (tag, attribute, selector, re) => {
    const root = await mount(`<${tag} ${attribute}></${tag}>`)
    expect(classesOf(root, selector)).toMatch(re)
  })

  it('sp-section forwards hero sizes and drops unknown ones', async () => {
    const root = await mount(`
      <sp-section hero="lg" spacing="sm"></sp-section>
      <sp-section hero="xl"></sp-section>`)
    const [hero, bogus] = Array.from(root.querySelectorAll('section'))
    expect(hero?.className).toContain('sp-section--hero-lg')
    expect(bogus?.className).not.toContain('hero')
  })

  it('sp-section forwards attached', async () => {
    const root = await mount('<sp-section attached></sp-section>')
    expect(classesOf(root, 'section')).toContain('sp-section--attached')
  })

  it('sp-text forwards a token weight and drops unknown ones', async () => {
    const root = await mount(`
      <sp-text weight="700">Bold</sp-text>
      <sp-text weight="650">Odd</sp-text>`)
    const [bold, odd] = Array.from(root.querySelectorAll('p'))
    expect(bold?.className).toContain('sp-font-700')
    expect(odd?.className).not.toContain('sp-font-')
  })

  it('an inline-level sp-text takes its line box from the native span', async () => {
    const root = await mount(`
      <sp-text level="span" size="sm">Small</sp-text>
      <sp-text>Block</sp-text>`)
    const [span, block] = Array.from(
      root.querySelectorAll('sp-text')
    ) as (HTMLElement & {
      level?: string
      updateComplete: Promise<boolean>
    })[]
    expect(span?.style.display).toBe('contents')
    expect(block?.style.display).toBe('')
    span!.level = 'p'
    await span!.updateComplete
    expect(span?.style.display).toBe('')
  })

  it('an inline-level sp-text keeps an authored host display', async () => {
    const root = await mount(
      '<sp-text level="span" style="display: inline-block">Chip</sp-text>'
    )
    expect((root.querySelector('sp-text') as HTMLElement).style.display).toBe(
      'inline-block'
    )
  })
})
