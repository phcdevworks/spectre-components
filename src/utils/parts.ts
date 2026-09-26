// Adds a recipe's part classes to authored elements that opt in with
// `slot="<part>"`. The elements stay where they were authored, so free-form
// layouts (footer columns, menu groups) keep their order.
export function applyPartClasses(
  elements: Iterable<Element>,
  parts: Readonly<Record<string, string>>
): void {
  for (const element of elements) {
    const part = element.getAttribute('slot')
    const classes = part ? parts[part] : undefined
    if (classes) {
      element.classList.add(...classes.split(/\s+/).filter(Boolean))
    }
  }
}

export function childElements(nodes: readonly Node[]): Element[] {
  return nodes.filter(
    (node): node is Element => node.nodeType === Node.ELEMENT_NODE
  )
}
