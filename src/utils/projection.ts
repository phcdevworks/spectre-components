import type { ReactiveController, ReactiveControllerHost } from 'lit'

import { hasMeaningfulContent } from './dom'

type ProjectionHost = ReactiveControllerHost & HTMLElement

function slotOf(node: Node): string | undefined {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return undefined
  }
  return (node as Element).getAttribute('slot') ?? undefined
}

// Tracks authored light-DOM nodes for components that project content into
// more than one rendered container, partitioned by their `slot` attribute.
export class ProjectionController implements ReactiveController {
  private projected: Node[] = []
  private observer: MutationObserver | undefined

  constructor(
    private readonly host: ProjectionHost,
    private readonly internalAttributes: readonly string[]
  ) {
    host.addController(this)
  }

  hostConnected(): void {
    this.sync()
    this.observe()
  }

  hostDisconnected(): void {
    this.disconnect()
  }

  hostUpdate(): void {
    this.sync()
    this.disconnect()
  }

  hostUpdated(): void {
    this.observe()
  }

  // Every projected node in authored order, regardless of slot.
  all(): Node[] {
    return [...this.projected]
  }

  // Omitting `slot` returns the nodes without a slot attribute.
  nodes(slot?: string): Node[] {
    return this.projected.filter((node) => slotOf(node) === slot)
  }

  elements(slot?: string): Element[] {
    return this.nodes(slot).filter(
      (node): node is Element => node.nodeType === Node.ELEMENT_NODE
    )
  }

  has(slot?: string): boolean {
    return hasMeaningfulContent(this.nodes(slot))
  }

  private isInternalNode(node: Node): boolean {
    return (
      node.nodeType === Node.ELEMENT_NODE &&
      this.internalAttributes.some((name) =>
        (node as Element).hasAttribute(name)
      )
    )
  }

  private isProjectable(node: Node): boolean {
    if (node.nodeType === Node.COMMENT_NODE || this.isInternalNode(node)) {
      return false
    }
    // After the first render, whitespace between rendered siblings belongs to
    // the template, not the author.
    if (node.nodeType === Node.TEXT_NODE && this.hostHasRendered) {
      return Boolean(node.textContent?.trim())
    }
    return true
  }

  private get hostHasRendered(): boolean {
    return (this.host as unknown as { hasUpdated: boolean }).hasUpdated
  }

  private sync(): boolean {
    // Authored nodes already moved into rendered containers are retained;
    // re-reading those containers would also capture Lit's own nodes.
    const next = [
      ...new Set([
        ...this.projected.filter((node) => this.host.contains(node)),
        ...Array.from(this.host.childNodes).filter((node) =>
          this.isProjectable(node)
        )
      ])
    ]

    const changed =
      next.length !== this.projected.length ||
      next.some((node, index) => node !== this.projected[index])

    if (changed) {
      this.projected = next
    }
    return changed
  }

  private observe(): void {
    if (this.observer || !this.host.isConnected) {
      return
    }
    this.observer = new MutationObserver(() => {
      if (this.sync()) {
        this.host.requestUpdate()
      }
    })
    this.observer.observe(this.host, { childList: true })
  }

  private disconnect(): void {
    this.observer?.disconnect()
    this.observer = undefined
  }
}
