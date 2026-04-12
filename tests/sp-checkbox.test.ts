import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineSpectreCheckbox, SpectreCheckboxElement } from '../src';

describe('sp-checkbox', () => {
  beforeAll(() => {
    defineSpectreCheckbox();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native checkbox and label text', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    element.label = 'Accept terms';
    element.name = 'terms';
    element.value = 'accepted';

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=checkbox]');
    const label = element.querySelector('.sp-label');

    expect(input).not.toBeNull();
    expect(input?.getAttribute('name')).toBe('terms');
    expect(input?.getAttribute('value')).toBe('accepted');
    expect(label?.textContent).toBe('Accept terms');
  });

  it('forwards the consumer-facing id to the native checkbox only', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    element.setAttribute('id', 'terms-checkbox');

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=checkbox]');

    expect(element.getAttribute('id')).toBe('terms-checkbox');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(input?.id).toBe('terms-checkbox');
  });

  it('forwards aria labeling and only sets aria-invalid when invalid', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    element.setAttribute('aria-label', 'Accept terms');
    element.setAttribute('aria-labelledby', 'terms-label');
    element.setAttribute('aria-describedby', 'terms-help');

    document.body.append(element);
    await element.updateComplete;

    let input = element.querySelector('input[type=checkbox]');

    expect(input?.getAttribute('aria-label')).toBe('Accept terms');
    expect(input?.getAttribute('aria-labelledby')).toBe('terms-label');
    expect(input?.getAttribute('aria-describedby')).toBe('terms-help');
    expect(input?.hasAttribute('aria-invalid')).toBe(false);

    element.invalid = true;
    await element.updateComplete;

    input = element.querySelector('input[type=checkbox]');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps checked state in sync while native events bubble', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    const onInput = vi.fn();
    const onChange = vi.fn();

    element.addEventListener('input', onInput);
    element.addEventListener('change', onChange);

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=checkbox]');

    expect(input).not.toBeNull();

    if (input === null || (input instanceof HTMLInputElement) === false) {
      throw new Error('Expected a native checkbox input');
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

  it('passes focus and blur through to the native checkbox', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=checkbox]');
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
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    element.label = 'Reflected Label';
    element.title = 'Checkbox Title';
    element.autofocus = true;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input[type=checkbox]');

    expect(element.getAttribute('label')).toBe('Reflected Label');
    expect(element.getAttribute('title')).toBe('Checkbox Title');
    expect(element.hasAttribute('autofocus')).toBe(true);
    expect(input?.getAttribute('title')).toBe('Checkbox Title');
    expect(input?.hasAttribute('autofocus')).toBe(true);
  });

  it('normalizes null/undefined value to "on"', async () => {
    const element = document.createElement('sp-checkbox') as SpectreCheckboxElement;
    element.value = null as never;

    document.body.append(element);
    await element.updateComplete;

    expect(element.value).toBe('on');
    const input = element.querySelector('input[type=checkbox]');
    expect(input?.getAttribute('value')).toBe('on');
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
