export function hasMeaningfulContent(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0;
    }

    return false;
  });
}
