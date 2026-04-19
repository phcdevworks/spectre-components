import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
export class SpectreFieldsetElement extends LitElement {
    constructor() {
        super(...arguments);
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.disabled = false;
        this.legend = '';
        this.projectedContent = [];
    }
    get id() {
        return this._id ?? '';
    }
    set id(value) {
        if ((this._id ?? '') === value) {
            return;
        }
        this._id = value;
        const host = this;
        if (HTMLElement.prototype.hasAttribute.call(host, 'id')) {
            HTMLElement.prototype.removeAttribute.call(host, 'id');
        }
        this.requestUpdate();
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        const hostId = super.getAttribute('id');
        if (hostId !== null) {
            this.id = hostId;
        }
        this.syncProjectedContent();
        this.startContentObserver();
    }
    disconnectedCallback() {
        this.stopContentObserver();
        super.disconnectedCallback();
    }
    getAttribute(qualifiedName) {
        if (qualifiedName === 'id') {
            return this.id || null;
        }
        return super.getAttribute(qualifiedName);
    }
    hasAttribute(qualifiedName) {
        if (qualifiedName === 'id') {
            return this.id !== '';
        }
        return super.hasAttribute(qualifiedName);
    }
    setAttribute(qualifiedName, value) {
        if (qualifiedName === 'id') {
            this.id = value;
            return;
        }
        super.setAttribute(qualifiedName, value);
    }
    removeAttribute(qualifiedName) {
        if (qualifiedName === 'id') {
            this.id = '';
            return;
        }
        super.removeAttribute(qualifiedName);
    }
    update(changedProperties) {
        this.stopContentObserver();
        super.update(changedProperties);
        this.startContentObserver();
    }
    get nativeFieldset() {
        return this.querySelector('[data-sp-fieldset-native]');
    }
    get forwardedAriaLabel() {
        const value = this.ariaLabel?.trim();
        return value ? value : undefined;
    }
    get forwardedAriaLabelledBy() {
        const value = this.ariaLabelledBy?.trim();
        return value ? value : undefined;
    }
    get forwardedAriaDescribedBy() {
        const value = this.ariaDescribedBy?.trim();
        return value ? value : undefined;
    }
    startContentObserver() {
        if (this.contentObserver) {
            return;
        }
        this.contentObserver = new MutationObserver((mutations) => {
            const isInternalMovement = mutations.every((mutation) => {
                return (Array.from(mutation.removedNodes).every((node) => this.isInternalFieldsetNode(node) || this.contains(node)) &&
                    Array.from(mutation.addedNodes).every((node) => this.isInternalFieldsetNode(node)));
            });
            if (isInternalMovement) {
                return;
            }
            if (this.syncProjectedContent()) {
                this.requestUpdate();
            }
        });
        this.contentObserver.observe(this, { childList: true });
    }
    stopContentObserver() {
        this.contentObserver?.disconnect();
        this.contentObserver = undefined;
    }
    syncProjectedContent() {
        const nextProjectedContent = [];
        Array.from(this.childNodes).forEach((node) => {
            if (!this.isInternalFieldsetNode(node)) {
                nextProjectedContent.push(node);
            }
        });
        if (nextProjectedContent.length === this.projectedContent.length &&
            nextProjectedContent.every((node, index) => node === this.projectedContent[index])) {
            return false;
        }
        this.projectedContent = nextProjectedContent;
        return true;
    }
    isInternalFieldsetNode(node) {
        return (node.nodeType === Node.ELEMENT_NODE &&
            node.hasAttribute('data-sp-fieldset-native'));
    }
    focus(options) {
        this.nativeFieldset?.focus(options);
    }
    blur() {
        this.nativeFieldset?.blur();
    }
    render() {
        return html `
      <fieldset
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        data-sp-fieldset-native
        ?disabled=${this.disabled}
        form=${ifDefined(this.form)}
        id=${ifDefined(this.id || undefined)}
      >
        ${this.legend ? html `<legend class='sp-label'>${this.legend}</legend>` : nothing}
        ${this.projectedContent.length > 0 ? this.projectedContent : nothing}
      </fieldset>
    `;
    }
}
SpectreFieldsetElement.properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    legend: { type: String, reflect: true },
};
export function defineSpectreFieldset(tagName = 'sp-fieldset') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreFieldsetElement);
    return SpectreFieldsetElement;
}
