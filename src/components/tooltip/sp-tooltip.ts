import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { hasMeaningfulContent } from '../../utils/dom'
import {
  isTooltipPlacement,
  type SpectreTooltipPlacement
} from '../../utils/form'

import { getTooltipClasses } from '@phcdevworks/spectre-ui'

export interface SpectreTooltipProps {
  ariaLabel?: string | null
  id?: string | null | undefined
  placement?: SpectreTooltipPlacement | undefined
  title?: string | null | undefined
  visible?: boolean | undefined
}

export class SpectreTooltipElement
  extends SpectreBaseElement
  implements SpectreTooltipProps
{
  static properties = {
    placement: { type: String, reflect: true },
    visible: { type: Boolean, reflect: true }
  }

  placement: SpectreTooltipPlacement | undefined = 'top'
  visible: boolean | undefined = false

  private triggerContent: Node[] = []
  private tooltipContent: Node[] = []
  private contentObserver?: MutationObserver | undefined

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

  private isInternalNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    const el = node as Element
    return (
      el.hasAttribute('data-sp-tooltip-native') ||
      el.hasAttribute('data-sp-tooltip-trigger')
    )
  }

  private syncProjectedContent(): boolean {
    const nextTooltipContent: Node[] = []
    const nextTriggerContent: Node[] = []

    this.childNodes.forEach((node) => {
      if (this.isInternalNode(node)) {
        return
      }
      const isTooltipSlot =
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).getAttribute('slot') === 'tooltip'
      if (isTooltipSlot) {
        nextTooltipContent.push(node)
      } else {
        nextTriggerContent.push(node)
      }
    })

    const changed =
      nextTooltipContent.length !== this.tooltipContent.length ||
      nextTooltipContent.some((n, i) => n !== this.tooltipContent[i]) ||
      nextTriggerContent.length !== this.triggerContent.length ||
      nextTriggerContent.some((n, i) => n !== this.triggerContent[i])

    if (changed) {
      this.tooltipContent = nextTooltipContent
      this.triggerContent = nextTriggerContent
    }

    return changed
  }

  private get hasTooltipContent(): boolean {
    return hasMeaningfulContent(this.tooltipContent)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.syncProjectedContent()
    this.startContentObserver()
    this.style.position ||= 'relative'
    this.style.display ||= 'inline-block'
  }

  override disconnectedCallback(): void {
    this.stopContentObserver()
    super.disconnectedCallback()
  }

  protected override update(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    this.stopContentObserver()
    super.update(changedProperties)
    this.startContentObserver()
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return
    }
    this.contentObserver = new MutationObserver(() => {
      if (this.syncProjectedContent()) {
        this.requestUpdate()
      }
    })
    this.contentObserver.observe(this, { childList: true })
  }

  private stopContentObserver(): void {
    this.contentObserver?.disconnect()
    this.contentObserver = undefined
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has('placement') &&
      (this.placement == null || !isTooltipPlacement(this.placement))
    ) {
      this.placement = 'top'
    }
    if (changedProperties.has('visible') && this.visible == null) {
      this.visible = false
    }
  }

  private show(): void {
    if (this.visible) {
      return
    }
    this.visible = true
    this.dispatchEvent(new CustomEvent('sp-show', { bubbles: true }))
  }

  private hide(): void {
    if (!this.visible) {
      return
    }
    this.visible = false
    this.dispatchEvent(new CustomEvent('sp-hide', { bubbles: true }))
  }

  private get tooltipClasses(): string {
    return getTooltipClasses({
      placement: this.placement as SpectreTooltipPlacement,
      visible: this.visible ?? false
    })
  }

  override render() {
    return html`<span
        data-sp-tooltip-trigger
        @focusin="${() => this.show()}"
        @focusout="${() => this.hide()}"
        @mouseenter="${() => this.show()}"
        @mouseleave="${() => this.hide()}"
      >
        ${this.triggerContent}
      </span>
      <span
        aria-label="${ifDefined(this.forwardedAriaLabel)}"
        class="${this.tooltipClasses}"
        data-sp-tooltip-native
        id="${ifDefined(this.id || undefined)}"
        role="tooltip"
        title="${ifDefined(this.title || undefined)}"
      >
        ${this.hasTooltipContent ? this.tooltipContent : nothing}
      </span>`
  }
}

export function defineSpectreTooltip(
  tagName = 'sp-tooltip'
): typeof SpectreTooltipElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreTooltipElement
  }

  customElements.define(tagName, SpectreTooltipElement)
  return SpectreTooltipElement
}
