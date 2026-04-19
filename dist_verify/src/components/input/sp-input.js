import { LitElement, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getInputClasses, } from '@phcdevworks/spectre-ui';
export const spectreInputTypes = [
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
    'date',
    'datetime-local',
    'month',
    'time',
    'week',
];
export const spectreInputSizes = ['sm', 'md', 'lg'];
function isInputType(value) {
    return spectreInputTypes.includes(value);
}
export function isInputSize(value) {
    return spectreInputSizes.includes(value);
}
export class SpectreInputElement extends LitElement {
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
        this.readonly = false;
        this.required = false;
        this.size = 'md';
        this.success = false;
        this.title = '';
        this.type = 'text';
        this.value = '';
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
        if (changedProperties.has('type') && !isInputType(this.type)) {
            this.type = 'text';
        }
        if (changedProperties.has('value') && this.value == null) {
            this.value = '';
        }
        if (changedProperties.has('maxlength')) {
            if (this.maxlength == null ||
                !Number.isInteger(this.maxlength) ||
                this.maxlength < 0) {
                this.maxlength = undefined;
            }
        }
        if (changedProperties.has('minlength')) {
            if (this.minlength == null ||
                !Number.isInteger(this.minlength) ||
                this.minlength < 0) {
                this.minlength = undefined;
            }
        }
    }
    get inputClasses() {
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
    get nativeInput() {
        return this.querySelector('[data-sp-input-native]');
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
    handleInput(event) {
        const input = event.currentTarget;
        this.value = input.value;
    }
    handleChange(event) {
        const input = event.currentTarget;
        this.value = input.value;
    }
    focus(options) {
        this.nativeInput?.focus(options);
    }
    blur() {
        this.nativeInput?.blur();
    }
    render() {
        return html `
      <input
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        autocomplete=${ifDefined(this.autocomplete)}
        ?autofocus=${this.autofocus}
        class=${this.inputClasses}
        data-sp-input-native
        ?disabled=${this.isDisabled}
        form=${ifDefined(this.form)}
        ?readonly=${this.readonly}
        ?required=${this.required}
        id=${ifDefined(this.id || undefined)}
        inputmode=${ifDefined(this.inputmode)}
        max=${ifDefined(this.max)}
        maxlength=${ifDefined(this.maxlength)}
        min=${ifDefined(this.min)}
        minlength=${ifDefined(this.minlength)}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        step=${ifDefined(this.step)}
        title=${ifDefined(this.title || undefined)}
        type=${this.type}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      />
    `;
    }
}
SpectreInputElement.properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autocomplete: { type: String },
    autofocus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
    inputmode: { type: String },
    invalid: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    max: { type: String },
    maxlength: { type: Number },
    min: { type: String },
    minlength: { type: Number },
    name: { type: String },
    pill: { type: Boolean, reflect: true },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    step: { type: String },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    type: { type: String, reflect: true },
    value: { type: String },
};
export function defineSpectreInput(tagName = 'sp-input') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreInputElement);
    return SpectreInputElement;
}
