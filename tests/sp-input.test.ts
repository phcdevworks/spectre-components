import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineSpectreInput, SpectreInputElement } from '../src';

describe('sp-input', () => {
  beforeAll(() => {
    defineSpectreInput();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native input with Spectre UI classes', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.size = 'lg';
    element.fullWidth = true;
    element.placeholder = 'Email address';

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');

    expect(input).not.toBeNull();
    expect(input?.className).toContain('sp-input');
    expect(input?.className).toContain('sp-input--lg');
    expect(input?.className).toContain('sp-input--full');
    expect(input?.getAttribute('type')).toBe('text');
    expect(input?.getAttribute('placeholder')).toBe('Email address');
    expect(input?.getAttribute('aria-invalid')).toBeNull();
  });

  it('reflects disabled, readonly, and required state to the native input', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.disabled = true;
    element.readonly = true;
    element.required = true;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');

    expect(input?.disabled).toBe(true);
    expect(input?.readOnly).toBe(true);
    expect(input?.required).toBe(true);
    expect(input?.className).toContain('sp-input--disabled');
  });

  it('applies invalid semantics without overriding the accessible name', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.invalid = true;
    element.setAttribute('aria-label', 'Project name');

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-label')).toBe('Project name');
    expect(input?.className).toContain('sp-input--error');
  });

  it('supports initial value from attribute and property updates', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('value', 'initial@example.com');

    document.body.append(element);
    await element.updateComplete;

    let input = element.querySelector('input');
    expect(input?.value).toBe('initial@example.com');

    element.value = 'next@example.com';
    await element.updateComplete;

    input = element.querySelector('input');
    expect(input?.value).toBe('next@example.com');
  });

  it('applies the consumer-facing id to the native input without duplicating it on the host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('id', 'email-address');

    document.body.append(element);
    await element.updateComplete;

    let input = element.querySelector('input');

    expect(element.id).toBe('email-address');
    expect(element.getAttribute('id')).toBe('email-address');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(input?.id).toBe('email-address');

    element.id = 'billing-email';
    await element.updateComplete;

    input = element.querySelector('input');

    expect(element.id).toBe('billing-email');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(input?.id).toBe('billing-email');
  });

  it('keeps host value in sync while native input and change events bubble normally', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    const onInput = vi.fn();
    const onChange = vi.fn();

    element.addEventListener('input', onInput);
    element.addEventListener('change', onChange);

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');

    expect(input).not.toBeNull();

    input!.value = 'typed value';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('typed value');
    expect(onInput).toHaveBeenCalledTimes(1);

    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.value).toBe('typed value');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('falls back safely for unsupported type and size values', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.type = 'file' as never;
    element.size = 'xl' as never;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');

    expect(element.type).toBe('text');
    expect(element.size).toBe('md');
    expect(input?.getAttribute('type')).toBe('text');
    expect(input?.className).toContain('sp-input--md');
  });

  it('forwards aria-labelledby and aria-describedby', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('aria-labelledby', 'label-id');
    element.setAttribute('aria-describedby', 'desc-id');

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('aria-labelledby')).toBe('label-id');
    expect(input?.getAttribute('aria-describedby')).toBe('desc-id');
  });

  it('handles focus and blur correctly', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    input?.addEventListener('focus', onFocus);
    input?.addEventListener('blur', onBlur);

    element.focus();
    expect(onFocus).toHaveBeenCalled();

    element.blur();
    expect(onBlur).toHaveBeenCalled();
  });

  it('forwards title and autofocus to the native input', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.title = 'Enter your email';
    element.autofocus = true;

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('title')).toBe('Enter your email');
    expect(input?.hasAttribute('autofocus')).toBe(true);
  });

  it('applies success, loading, and pill classes correctly', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.success = true;
    element.pill = true;

    document.body.append(element);
    await element.updateComplete;

    let input = element.querySelector('input');
    expect(input?.className).toContain('sp-input--success');
    expect(input?.className).toContain('sp-input--pill');

    element.success = false;
    element.loading = true;
    await element.updateComplete;

    input = element.querySelector('input');
    expect(input?.className).toContain('sp-input--loading');
    expect(input?.className).not.toContain('sp-input--success');
    expect(input?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    input = element.querySelector('input');
    expect(input?.getAttribute('aria-busy')).toBe('false');
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
