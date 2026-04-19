import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getInputClasses } from '@phcdevworks/spectre-ui';
import { isInputSize, } from '../input/sp-input';
function isSelectableContent(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName;
        return tagName === 'OPTION' || tagName === 'OPTGROUP';
    }
    if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent?.trim().length ?? 0) > 0;
    }
    return false;
}
export class SpectreSelectElement extends LitElement {
    constructor() {
        super(...arguments);
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.autofocus = false;
        this.disabled = false;
        this.fullWidth = false;
        this.invalid = false;
        this.loading = false;
        this.pill = false;
        this.required = false;
        this.size = 'md';
        this.success = false;
        this.title = '';
        this.value = '';
        this.projectedOptions = [];
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
        // Spectre UI styling contract can apply directly.
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        const hostId = super.getAttribute('id');
        if (hostId !== null) {
            this.id = hostId;
        }
        this.syncProjectedOptions();
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
    willUpdate(changedProperties) {
        if (changedProperties.has('size') && !isInputSize(this.size)) {
            this.size = 'md';
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
    updated(changedProperties) {
        super.updated(changedProperties);
        const nativeSelect = this.nativeSelect;
        if (!nativeSelect) {
            return;
        }
        if (this.value !== '' && nativeSelect.value !== this.value) {
            nativeSelect.value = this.value;
        }
        if (this.value === '' && !this.hasAttribute('value')) {
            const nativeValue = nativeSelect.value ?? '';
            if (nativeValue !== '' && nativeValue !== this.value) {
                this.updateComplete.then(() => {
                    if (this.value === '' && !this.hasAttribute('value')) {
                        this.value = nativeValue;
                    }
                });
            }
        }
    }
    get selectClasses() {
        return getInputClasses({
            fullWidth: this.fullWidth,
            pill: this.pill,
            size: this.size,
            state: this.isDisabled
                ? this.disabled
                    ? 'disabled'
                    : 'loading'
                : this.invalid
                    ? 'error'
                    : this.success
                        ? 'success'
                        : 'default',
        });
    }
    get isDisabled() {
        return this.disabled || this.loading;
    }
    get nativeSelect() {
        return this.querySelector('[data-sp-select-native]');
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
                return (Array.from(mutation.removedNodes).every((node) => this.isInternalSelectNode(node) || this.contains(node)) &&
                    Array.from(mutation.addedNodes).every((node) => this.isInternalSelectNode(node)));
            });
            if (isInternalMovement) {
                return;
            }
            if (this.syncProjectedOptions()) {
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
    syncProjectedOptions() {
        const nextProjectedOptions = [];
        Array.from(this.childNodes).forEach((node) => {
            if (!this.isInternalSelectNode(node) && isSelectableContent(node)) {
                nextProjectedOptions.push(node);
            }
        });
        const hasChanged = nextProjectedOptions.length !== this.projectedOptions.length ||
            nextProjectedOptions.some((node, index) => node !== this.projectedOptions[index]);
        if (hasChanged) {
            this.projectedOptions = nextProjectedOptions;
        }
        return hasChanged;
    }
    isInternalSelectNode(node) {
        return (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-sp-select-native'));
    }
    handleInput(event) {
        const select = event.currentTarget;
        this.value = select.value;
    }
    handleChange(event) {
        const select = event.currentTarget;
        this.value = select.value;
    }
    focus(options) {
        this.nativeSelect?.focus(options);
    }
    blur() {
        this.nativeSelect?.blur();
    }
    render() {
        return html `
      <select
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        autocomplete=${ifDefined(this.autocomplete)}
        ?autofocus=${this.autofocus}
        class=${this.selectClasses}
        data-sp-select-native
        ?disabled=${this.isDisabled}
        form=${ifDefined(this.form)}
        id=${ifDefined(this.id || undefined)}
        name=${ifDefined(this.name)}
        ?required=${this.required}
        title=${ifDefined(this.title || undefined)}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      >
        ${this.projectedOptions.length > 0 ? this.projectedOptions : nothing}
      </select>
    `;
    }
}
SpectreSelectElement.properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autocomplete: { type: String },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    name: { type: String },
    pill: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
};
export function defineSpectreSelect(tagName = 'sp-select') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreSelectElement);
    return SpectreSelectElement;
}
