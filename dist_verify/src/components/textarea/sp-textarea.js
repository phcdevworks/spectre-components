import { LitElement, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getInputClasses } from '@phcdevworks/spectre-ui';
import { isInputSize, } from '../input/sp-input';
const DEFAULT_ROWS = 2;
export class SpectreTextareaElement extends LitElement {
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
        this.rows = DEFAULT_ROWS;
        this.size = 'md';
        this.success = false;
        this.title = '';
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
        if (changedProperties.has('rows')) {
            if (this.rows == null ||
                !Number.isInteger(this.rows) ||
                this.rows < 1) {
                this.rows = DEFAULT_ROWS;
            }
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
    get textareaClasses() {
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
    get nativeTextarea() {
        return this.querySelector('[data-sp-textarea-native]');
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
        const textarea = event.currentTarget;
        this.value = textarea.value;
    }
    handleChange(event) {
        const textarea = event.currentTarget;
        this.value = textarea.value;
    }
    focus(options) {
        this.nativeTextarea?.focus(options);
    }
    blur() {
        this.nativeTextarea?.blur();
    }
    render() {
        return html `
      <textarea
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
        aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
        aria-label=${ifDefined(this.forwardedAriaLabel)}
        aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
        autocomplete=${ifDefined(this.autocomplete)}
        ?autofocus=${this.autofocus}
        class=${this.textareaClasses}
        data-sp-textarea-native
        ?disabled=${this.isDisabled}
        form=${ifDefined(this.form)}
        inputmode=${ifDefined(this.inputmode)}
        ?readonly=${this.readonly}
        ?required=${this.required}
        id=${ifDefined(this.id || undefined)}
        maxlength=${ifDefined(this.maxlength)}
        minlength=${ifDefined(this.minlength)}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        rows=${this.rows}
        title=${ifDefined(this.title || undefined)}
        .value=${live(this.value)}
        @change=${this.handleChange}
        @input=${this.handleInput}
      ></textarea>
    `;
    }
}
SpectreTextareaElement.properties = {
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
    maxlength: { type: Number },
    minlength: { type: Number },
    name: { type: String },
    pill: { type: Boolean, reflect: true },
    placeholder: { type: String },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    rows: { type: Number },
    size: { type: String, reflect: true },
    success: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
};
export function defineSpectreTextarea(tagName = 'sp-textarea') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreTextareaElement);
    return SpectreTextareaElement;
}
