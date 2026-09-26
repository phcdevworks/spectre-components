export function hasMeaningfulContent(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0
    }

    return false
  })
}

let idCounter = 0

export function createUniqueId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

// Swaps the recipe classes this component previously applied to `element`
// without touching classes the author set.
export function replaceClasses(
  element: Element,
  previous: string,
  next: string
): void {
  const nextTokens = next.split(/\s+/).filter(Boolean)
  previous
    .split(/\s+/)
    .filter((token) => token && !nextTokens.includes(token))
    .forEach((token) => element.classList.remove(token))
  element.classList.add(...nextTokens)
}

// Parent/child component pairs identify each other through a global symbol
// rather than `instanceof`, because every subpath entry bundles its own copy
// of the child class.
export const spectreKindKey: unique symbol = Symbol.for(
  'phcdevworks.spectre-components.kind'
)

export function isSpectreKind<T extends Element>(
  node: Node,
  kind: string
): node is T {
  return (node as { [spectreKindKey]?: string })[spectreKindKey] === kind
}
