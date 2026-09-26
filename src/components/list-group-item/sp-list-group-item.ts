import { nothing } from 'lit'

import { SpectreBaseElement } from '../../utils/base'
import { spectreKindKey } from '../../utils/dom'
import {
  hoverFocusStateProperties,
  type SpectreHoverFocusStateProps
} from '../../utils/states'

export interface SpectreListGroupItemProps extends SpectreHoverFocusStateProps {
  active?: boolean | undefined
  ariaLabel?: string | null
  disabled?: boolean | undefined
  href?: string | undefined
  id?: string | null | undefined
  interactive?: boolean | undefined
  selected?: boolean | undefined
  target?: string | undefined
  title?: string | null | undefined
}

// Carries row state and content only. The parent `sp-list-group` renders the
// native row and moves this host inside it, so rows stay direct siblings for
// the recipe's `item + item` dividers.
export class SpectreListGroupItemElement
  extends SpectreBaseElement
  implements SpectreListGroupItemProps
{
  static properties = {
    ...hoverFocusStateProperties,
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { type: String },
    interactive: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    target: { type: String }
  }

  readonly [spectreKindKey] = 'list-group-item'

  focused: boolean | undefined = false
  hovered: boolean | undefined = false
  active: boolean | undefined = false
  disabled: boolean | undefined = false
  href: string | undefined = undefined
  interactive: boolean | undefined = false
  selected: boolean | undefined = false
  target: string | undefined = undefined

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

  private contentObserver: MutationObserver | undefined

  override connectedCallback(): void {
    super.connectedCallback()
    this.style.display ||= 'contents'
    // Content edits restyle marked heading/text parts through the parent.
    this.contentObserver = new MutationObserver(() => this.notifyParent())
    this.contentObserver.observe(this, { childList: true })
  }

  override disconnectedCallback(): void {
    this.contentObserver?.disconnect()
    this.contentObserver = undefined
    super.disconnectedCallback()
  }

  private notifyParent(): void {
    this.dispatchEvent(
      new CustomEvent('sp-list-group-item-change', { bubbles: true })
    )
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('active') && this.active == null) {
      this.active = false
    }
    if (changedProperties.has('disabled') && this.disabled == null) {
      this.disabled = false
    }
    if (changedProperties.has('interactive') && this.interactive == null) {
      this.interactive = false
    }
    if (changedProperties.has('selected') && this.selected == null) {
      this.selected = false
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    this.notifyParent()
  }

  override render() {
    return nothing
  }
}

export function defineSpectreListGroupItem(
  tagName = 'sp-list-group-item'
): typeof SpectreListGroupItemElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreListGroupItemElement
  }

  customElements.define(tagName, SpectreListGroupItemElement)
  return SpectreListGroupItemElement
}
