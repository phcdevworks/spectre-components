import { LitElement, type PropertyDeclarations } from 'lit';

export class SpectreBaseElement extends LitElement {
  static properties: PropertyDeclarations = {};

  private _ariaLabel: string | null = null;
  private _ariaLabelledBy: string | null = null;
  private _ariaDescribedBy: string | null = null;
  private _title = '';
  private _id = '';

  get ariaLabel(): string | null {
    return this._ariaLabel;
  }

  set ariaLabel(value: string | null) {
    if (this._ariaLabel === value) {
      return;
    }
    this._ariaLabel = value;
    this._removeHostAttribute('aria-label');
    this.requestUpdate();
  }

  get ariaLabelledBy(): string | null {
    return this._ariaLabelledBy;
  }

  set ariaLabelledBy(value: string | null) {
    if (this._ariaLabelledBy === value) {
      return;
    }
    this._ariaLabelledBy = value;
    this._removeHostAttribute('aria-labelledby');
    this.requestUpdate();
  }

  get ariaDescribedBy(): string | null {
    return this._ariaDescribedBy;
  }

  set ariaDescribedBy(value: string | null) {
    if (this._ariaDescribedBy === value) {
      return;
    }
    this._ariaDescribedBy = value;
    this._removeHostAttribute('aria-describedby');
    this.requestUpdate();
  }

  override get title(): string {
    return this._title;
  }

  override set title(value: string | undefined | null) {
    const normalizedValue = value ?? '';
    if (this._title === normalizedValue) {
      return;
    }
    this._title = normalizedValue;
    this._removeHostAttribute('title');
    this.requestUpdate();
  }

  override get id(): string {
    return this._id;
  }

  override set id(value: string | undefined | null) {
    const normalizedValue = value ?? '';
    if (this._id === normalizedValue) {
      return;
    }
    this._id = normalizedValue;
    this._removeHostAttribute('id');
    this.requestUpdate();
  }

  // Spectre components intentionally render in light DOM so the global
  // `@phcdevworks/spectre-ui` styling contract can apply directly.
  createRenderRoot(): this {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    const proxiedAttributes = [
      'id',
      'title',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
    ];

    proxiedAttributes.forEach((attr) => {
      const value = super.getAttribute(attr);
      if (value !== null) {
        this.setAttribute(attr, value);
      }
    });
  }

  override getAttribute(qualifiedName: string): string | null {
    switch (qualifiedName) {
      case 'id':
        return this.id || null;
      case 'title':
        return this.title || null;
      case 'aria-label':
        return this.ariaLabel;
      case 'aria-labelledby':
        return this.ariaLabelledBy;
      case 'aria-describedby':
        return this.ariaDescribedBy;
      default:
        return super.getAttribute(qualifiedName);
    }
  }

  override hasAttribute(qualifiedName: string): boolean {
    switch (qualifiedName) {
      case 'id':
        return this.id !== '';
      case 'title':
        return this.title !== '';
      case 'aria-label':
        return this.ariaLabel !== null;
      case 'aria-labelledby':
        return this.ariaLabelledBy !== null;
      case 'aria-describedby':
        return this.ariaDescribedBy !== null;
      default:
        return super.hasAttribute(qualifiedName);
    }
  }

  override setAttribute(qualifiedName: string, value: string): void {
    switch (qualifiedName) {
      case 'id':
        this.id = value;
        break;
      case 'title':
        this.title = value;
        break;
      case 'aria-label':
        this.ariaLabel = value;
        break;
      case 'aria-labelledby':
        this.ariaLabelledBy = value;
        break;
      case 'aria-describedby':
        this.ariaDescribedBy = value;
        break;
      default:
        super.setAttribute(qualifiedName, value);
    }
  }

  override removeAttribute(qualifiedName: string): void {
    switch (qualifiedName) {
      case 'id':
        this.id = '';
        break;
      case 'title':
        this.title = '';
        break;
      case 'aria-label':
        this.ariaLabel = null;
        break;
      case 'aria-labelledby':
        this.ariaLabelledBy = null;
        break;
      case 'aria-describedby':
        this.ariaDescribedBy = null;
        break;
      default:
        super.removeAttribute(qualifiedName);
    }
  }

  private _removeHostAttribute(name: string): void {
    const host = this as unknown as HTMLElement;
    if (HTMLElement.prototype.hasAttribute.call(host, name)) {
      HTMLElement.prototype.removeAttribute.call(host, name);
    }
  }

  protected get forwardedAriaLabel(): string | undefined {
    const value = this.ariaLabel?.trim();
    return value ? value : undefined;
  }

  protected get forwardedAriaLabelledBy(): string | undefined {
    const value = this.ariaLabelledBy?.trim();
    return value ? value : undefined;
  }

  protected get forwardedAriaDescribedBy(): string | undefined {
    const value = this.ariaDescribedBy?.trim();
    return value ? value : undefined;
  }
}
