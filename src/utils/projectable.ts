import { SpectreBaseElement } from './base';
import { hasMeaningfulContent } from './dom';

export abstract class SpectreProjectableElement extends SpectreBaseElement {
  protected projectedContent: Node[] = [];
  private contentObserver?: MutationObserver | undefined;

  // Return the native container whose existing children are also treated as
  // projected content sources (e.g. the rendered <button>, <select>, <label>).
  protected abstract getContentContainer(): Element | null;

  // Return true if the node was rendered by this component and should not be
  // treated as external projected content.
  protected abstract isInternalNode(node: Node): boolean;

  protected get hasProjectedContent(): boolean {
    return hasMeaningfulContent(this.projectedContent);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncProjectedContent();
    this.startContentObserver();
  }

  override disconnectedCallback(): void {
    this.stopContentObserver();
    super.disconnectedCallback();
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>): void {
    this.stopContentObserver();
    super.update(changedProperties);
    this.startContentObserver();
  }

  protected syncProjectedContent(): boolean {
    const nextProjectedContent: Node[] = [];
    const sourceNodes = [
      ...this.childNodes,
      ...(this.getContentContainer()?.childNodes ?? []),
    ];

    sourceNodes.forEach((node) => {
      if (!this.isInternalNode(node) && !nextProjectedContent.includes(node)) {
        nextProjectedContent.push(node);
      }
    });

    const hasChanged =
      nextProjectedContent.length !== this.projectedContent.length ||
      nextProjectedContent.some((node, index) => node !== this.projectedContent[index]);

    if (hasChanged) {
      this.projectedContent = nextProjectedContent;
    }

    return hasChanged;
  }

  private startContentObserver(): void {
    if (this.contentObserver) {
      return;
    }

    this.contentObserver = new MutationObserver((mutations) => {
      const isInternalMovement = mutations.every((mutation) =>
        [...mutation.removedNodes].every(
          (node) => this.isInternalNode(node) || this.contains(node),
        ) &&
        [...mutation.addedNodes].every((node) => this.isInternalNode(node)),
      );

      if (isInternalMovement) {
        return;
      }

      if (this.syncProjectedContent()) {
        this.requestUpdate();
      }
    });

    this.contentObserver.observe(this, { childList: true });
  }

  private stopContentObserver(): void {
    this.contentObserver?.disconnect();
    this.contentObserver = undefined;
  }
}
