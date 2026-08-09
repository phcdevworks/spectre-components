import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreProjectableElement } from '../../utils/projectable'

import { getSidebarToggleClasses } from '@phcdevworks/spectre-ui'

interface SpectreSidebarTarget extends HTMLElement {
  open?: boolean
}

export interface SpectreSidebarToggleProps {
  ariaLabel?: string | null
  for?: string | undefined
  id?: string | null | undefined
  label?: string | undefined
  title?: string | null | undefined
}

export class SpectreSidebarToggleElement
  extends SpectreProjectableElement
  implements SpectreSidebarToggleProps
{
  static properties = {
    for: { type: String },
    label: { type: String }
  }

  for: string | undefined = undefined
  label: string | undefined = 'Toggle sidebar'

  private expanded = false

  override get id(): string {
    return super.id
  }

  override set id(value: string | null | undefined) {
    super.id = value
  }

  override get title(): string {
    return super.title
  }

  override set title(value: string | null | undefined) {
    super.title = value
  }

  protected override getContentContainer(): Element | null {
    return this.querySelector('[data-sp-sidebar-toggle-native]')
  }

  protected override isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return el.hasAttribute('data-sp-sidebar-toggle-native')
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('label') && !this.label) {
      this.label = 'Toggle sidebar'
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('sp-open', this.handleTargetToggle)
    document.addEventListener('sp-close', this.handleTargetToggle)
    this.syncExpanded()
  }

  override disconnectedCallback(): void {
    document.removeEventListener('sp-open', this.handleTargetToggle)
    document.removeEventListener('sp-close', this.handleTargetToggle)
    super.disconnectedCallback()
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    if (changedProperties.has('for')) {
      this.syncExpanded()
    }
  }

  private get targetElement(): SpectreSidebarTarget | null {
    if (!this.for) {
      return null
    }
    const native = document.getElementById(this.for)
    return (
      (native?.closest('sp-sidebar') as SpectreSidebarTarget | null) ?? null
    )
  }

  private handleTargetToggle = (event: Event): void => {
    if (event.target !== this.targetElement) {
      return
    }
    this.syncExpanded()
  }

  private syncExpanded(): void {
    const next = Boolean(this.targetElement?.open)
    if (next !== this.expanded) {
      this.expanded = next
      this.requestUpdate()
    }
  }

  private handleClick(): void {
    const target = this.targetElement
    if (!target) {
      return
    }
    const nextOpen = !target.open
    target.open = nextOpen
    target.dispatchEvent(
      new CustomEvent(nextOpen ? 'sp-open' : 'sp-close', { bubbles: true })
    )
  }

  private get toggleClasses(): string {
    return getSidebarToggleClasses()
  }

  override render() {
    return html`<button
      aria-controls="${ifDefined(this.for)}"
      aria-expanded="${this.expanded ? 'true' : 'false'}"
      aria-label="${ifDefined(this.forwardedAriaLabel ?? this.label)}"
      class="${this.toggleClasses}"
      data-sp-sidebar-toggle-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
      type="button"
      @click="${() => this.handleClick()}"
    >
      ${this.hasProjectedContent ? this.projectedContent : html`&#9776;`}
    </button>`
  }
}

export function defineSpectreSidebarToggle(
  tagName = 'sp-sidebar-toggle'
): typeof SpectreSidebarToggleElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreSidebarToggleElement
  }

  customElements.define(tagName, SpectreSidebarToggleElement)
  return SpectreSidebarToggleElement
}
