import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineSpectreRadio, SpectreRadioElement } from '../src';

describe('sp-radio', () => {
  beforeAll(() => {
    defineSpectreRadio();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native radio and label text', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.label = 'Pro plan';
    element.name = 'plan';
    element.value = 'pro';

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');
    const label = element.querySelector('.sp-label');

    expect(input).not.toBeNull();
    expect(input?.getAttribute('name')).toBe('plan');
    expect(input?.getAttribute('value')).toBe('pro');
    expect(label?.textContent).toBe('Pro plan');
  });

  it('forwards the form attribute to the native radio', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.form = 'test-form';

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');
    expect(input?.getAttribute('form')).toBe('test-form');
  });

  it('supports rich content labels via projection', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.innerHTML = '<span>Select <strong>Option</strong></span>';

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('label');
    expect(label?.innerHTML).toContain('<span>Select <strong>Option</strong></span>');

    // Should favor projected content over label property
    element.label = 'Should be ignored';
    await element.updateComplete;
    expect(label?.innerHTML).toContain('<span>Select <strong>Option</strong></span>');
    expect(label?.textContent).not.toContain('Should be ignored');
  });

  it('forwards the consumer-facing id to the native radio only', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.setAttribute('id', 'plan-pro');

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');

    expect(element.getAttribute('id')).toBe('plan-pro');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(input?.id).toBe('plan-pro');
  });

  it('forwards aria labeling and only sets aria-invalid when invalid', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.setAttribute('aria-label', 'Pro plan');
    element.setAttribute('aria-labelledby', 'plan-label');
    element.setAttribute('aria-describedby', 'plan-help');

    document.body.append(element);
    await element.updateComplete;

    let input = element.querySelector('input[type=radio]');

    expect(input?.getAttribute('aria-label')).toBe('Pro plan');
    expect(input?.getAttribute('aria-labelledby')).toBe('plan-label');
    expect(input?.getAttribute('aria-describedby')).toBe('plan-help');
    expect(input?.hasAttribute('aria-invalid')).toBe(false);

    element.invalid = true;
    await element.updateComplete;

    input = element.querySelector('input[type=radio]');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps checked state in sync while native events bubble', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    const onInput = vi.fn();
    const onChange = vi.fn();

    element.addEventListener('input', onInput);
    element.addEventListener('change', onChange);

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');

    expect(input).not.toBeNull();

    if (input === null || (input instanceof HTMLInputElement) === false) {
      throw new Error('Expected a native radio input');
    }

    input.checked = true;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(onInput).toHaveBeenCalledTimes(1);

    input.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('passes focus and blur through to the native radio', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    input?.addEventListener('focus', onFocus);
    input?.addEventListener('blur', onBlur);

    element.focus();
    expect(onFocus).toHaveBeenCalled();

    element.blur();
    expect(onBlur).toHaveBeenCalled();
  });

  it('reflects label, title, and autofocus properties', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.label = 'Reflected Label';
    element.title = 'Radio Title';
    element.autofocus = true;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');

    expect(element.getAttribute('label')).toBe('Reflected Label');
    expect(element.getAttribute('title')).toBe('Radio Title');
    expect(element.hasAttribute('autofocus')).toBe(true);
    expect(input?.getAttribute('title')).toBe('Radio Title');
    expect(input?.hasAttribute('autofocus')).toBe(true);
  });

  it('normalizes null/undefined value to "on"', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.value = null as never;

    document.body.append(element);
    await element.updateComplete;

    expect(element.value).toBe('on');
    const input = element.querySelector('input[type=radio]');
    expect(input?.getAttribute('value')).toBe('on');
  });

  it('does not render a label span if label is empty', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.label = '';

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('.sp-label');
    expect(label).toBeNull();
  });

  it('supports loading state and forwards aria-busy', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=radio]');
    expect(input?.disabled).toBe(true);
    expect(input?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(input?.disabled).toBe(false);
    expect(input?.getAttribute('aria-busy')).toBe('false');
  });

  it('supports success state', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.success = true;

    document.body.append(element);
    await element.updateComplete;

    expect(element.success).toBe(true);
    expect(element.hasAttribute('success')).toBe(true);
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
