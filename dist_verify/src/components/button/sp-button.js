import { LitElement, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getButtonClasses, } from '@phcdevworks/spectre-ui';
export const spectreButtonVariants = [
    'primary',
    'secondary',
    'ghost',
    'danger',
    'success',
    'cta',
    'accent',
];
export const spectreButtonSizes = ['sm', 'md', 'lg'];
export const spectreButtonTypes = ['button', 'submit', 'reset'];
function isButtonVariant(value) {
    return spectreButtonVariants.includes(value);
}
function isButtonSize(value) {
    return spectreButtonSizes.includes(value);
}
function isButtonType(value) {
    return spectreButtonTypes.includes(value);
}
function hasMeaningfulContent(nodes) {
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
export class SpectreButtonElement extends LitElement {
    constructor() {
        super(...arguments);
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.autofocus = false;
        this.disabled = false;
        this.fullWidth = false;
        this.loading = false;
        this.loadingLabel = 'Loading';
        this.pill = false;
        this.size = 'md';
        this.title = '';
        this.type = 'button';
        this.variant = 'primary';
        // Native slot projection is a Shadow DOM feature, so in light DOM we keep
        // host-provided content reactive by tracking and reusing the host nodes.
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
        // Spectre components intentionally render in light DOM so the global
        // `@phcdevworks/spectre-ui` styling contract can apply directly.
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
    disconnectedCallback() {
        this.stopContentObserver();
        super.disconnectedCallback();
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('variant') && !isButtonVariant(this.variant)) {
            this.variant = 'primary';
        }
        if (changedProperties.has('size') && !isButtonSize(this.size)) {
            this.size = 'md';
        }
        if (changedProperties.has('type') && !isButtonType(this.type)) {
            this.type = 'button';
        }
        if (changedProperties.has('loadingLabel')) {
            if (this.loadingLabel == null || this.loadingLabel.trim() === '') {
                this.loadingLabel = 'Loading';
            }
        }
        if (changedProperties.has('value') && this.value == null) {
            this.value = '';
        }
    }
    update(changedProperties) {
        this.stopContentObserver();
        super.update(changedProperties);
        this.startContentObserver();
    }
    get buttonClasses() {
        return getButtonClasses({
            disabled: this.isDisabled,
            fullWidth: this.fullWidth,
            loading: this.loading,
            pill: this.pill,
            size: this.size,
            variant: this.variant,
        });
    }
    get isDisabled() {
        return this.disabled || this.loading;
    }
    get hasProjectedContent() {
        return hasMeaningfulContent(this.projectedContent);
    }
    get visibleLabelFallback() {
        const trimmedLabel = this.label?.trim();
        return trimmedLabel ? trimmedLabel : undefined;
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
                return (Array.from(mutation.removedNodes).every((node) => this.isInternalButtonNode(node) || this.contains(node)) &&
                    Array.from(mutation.addedNodes).every((node) => this.isInternalButtonNode(node)));
            });
            if (isInternalMovement) {
                return;
            }
            if (this.syncProjectedContent()) {
                this.requestUpdate();
            }
        });
        this.contentObserver.observe(this, {
            childList: true,
        });
    }
    stopContentObserver() {
        this.contentObserver?.disconnect();
        this.contentObserver = undefined;
    }
    syncProjectedContent() {
        const nextProjectedContent = [];
        Array.from(this.childNodes).forEach((node) => {
            if (!this.isInternalButtonNode(node)) {
                nextProjectedContent.push(node);
            }
        });
        const hasChanged = nextProjectedContent.length !== this.projectedContent.length ||
            nextProjectedContent.some((node, index) => node !== this.projectedContent[index]);
        if (hasChanged) {
            this.projectedContent = nextProjectedContent;
        }
        return hasChanged;
    }
    isInternalButtonNode(node) {
        return (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-sp-button-native'));
    }
    get nativeButton() {
        return this.querySelector('[data-sp-button-native]');
    }
    focus(options) {
        this.nativeButton?.focus(options);
    }
    blur() {
        this.nativeButton?.blur();
    }
    renderButtonContent() {
        if (this.loading) {
            return this.loadingLabel;
        }
        if (this.hasProjectedContent) {
            return this.projectedContent;
        }
        return this.visibleLabelFallback ?? '';
    }
    render() {
        return html `
      <button
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        ?autofocus=${this.autofocus}
        class=${this.buttonClasses}
        data-sp-button-native
        ?disabled=${this.isDisabled}
        form=${ifDefined(this.form)}
        id=${ifDefined(this.id || undefined)}
        name=${ifDefined(this.name)}
        title=${ifDefined(this.title || undefined)}
        type=${this.type}
        value=${ifDefined(this.value)}
      >
        ${this.renderButtonContent() || nothing}
      </button>
    `;
    }
}
SpectreButtonElement.properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    loading: { type: Boolean, reflect: true },
    loadingLabel: { attribute: 'loading-label', type: String, reflect: true },
    name: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    title: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    value: { type: String, reflect: true },
};
export function defineSpectreButton(tagName = 'sp-button') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreButtonElement);
    return SpectreButtonElement;
}
