import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
export class SpectreRadioElement extends LitElement {
    constructor() {
        super(...arguments);
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.autofocus = false;
        this.checked = false;
        this.disabled = false;
        this.invalid = false;
        this.label = '';
        this.required = false;
        this.title = '';
        this.value = 'on';
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
    willUpdate(changedProperties) {
        if (changedProperties.has('value') && this.value == null) {
            this.value = 'on';
        }
    }
    update(changedProperties) {
        this.stopContentObserver();
        super.update(changedProperties);
        this.startContentObserver();
    }
    get nativeInput() {
        return this.querySelector('[data-sp-radio-native]');
    }
    get hasProjectedContent() {
        return this.projectedContent.some((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                return true;
            }
            if (node.nodeType === Node.TEXT_NODE) {
                return (node.textContent?.trim().length ?? 0) > 0;
            }
            return false;
        });
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
                return (Array.from(mutation.removedNodes).every((node) => this.isInternalRadioNode(node) || this.contains(node)) &&
                    Array.from(mutation.addedNodes).every((node) => this.isInternalRadioNode(node)));
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
            if (!this.isInternalRadioNode(node)) {
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
    isInternalRadioNode(node) {
        return (node.nodeType === Node.ELEMENT_NODE &&
            node.hasAttribute('data-sp-radio-label'));
    }
    handleInput(event) {
        const input = event.currentTarget;
        this.checked = input.checked;
    }
    handleChange(event) {
        const input = event.currentTarget;
        this.checked = input.checked;
    }
    focus(options) {
        this.nativeInput?.focus(options);
    }
    blur() {
        this.nativeInput?.blur();
    }
    render() {
        const labelContent = this.hasProjectedContent
            ? this.projectedContent
            : this.label
                ? html `<span class='sp-label'>${this.label}</span>`
                : nothing;
        return html `
      <label data-sp-radio-label>
        <input
          aria-describedby=${ifDefined(this.forwardedAriaDescribedBy)}
          aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
          aria-label=${ifDefined(this.forwardedAriaLabel)}
          aria-labelledby=${ifDefined(this.forwardedAriaLabelledBy)}
          ?autofocus=${this.autofocus}
          data-sp-radio-native
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          form=${ifDefined(this.form)}
          id=${ifDefined(this.id || undefined)}
          name=${ifDefined(this.name)}
          ?required=${this.required}
          title=${ifDefined(this.title || undefined)}
          type='radio'
          value=${ifDefined(this.value || undefined)}
          @change=${this.handleChange}
          @input=${this.handleInput}
        />
        ${labelContent}
      </label>
    `;
    }
}
SpectreRadioElement.properties = {
    ariaLabel: { attribute: 'aria-label', type: String },
    ariaLabelledBy: { attribute: 'aria-labelledby', type: String },
    ariaDescribedBy: { attribute: 'aria-describedby', type: String },
    autofocus: { type: Boolean, reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    form: { type: String },
    invalid: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    name: { type: String },
    required: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    value: { type: String },
};
export function defineSpectreRadio(tagName = 'sp-radio') {
    const existingElement = customElements.get(tagName);
    if (existingElement) {
        return existingElement;
    }
    customElements.define(tagName, SpectreRadioElement);
    return SpectreRadioElement;
}
