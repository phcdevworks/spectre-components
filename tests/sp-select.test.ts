import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineSpectreSelect, SpectreSelectElement } from '../src';

describe('sp-select', () => {
  beforeAll(() => {
    defineSpectreSelect();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native select with Spectre UI classes and projected options', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.size = 'lg';
    element.fullWidth = true;
    element.append(createOption('small', 'Small'), createOption('medium', 'Medium'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    const options = select?.querySelectorAll('option');

    expect(select).not.toBeNull();
    expect(select?.className).toContain('sp-input');
    expect(select?.className).toContain('sp-input--lg');
    expect(select?.className).toContain('sp-input--full');
    expect(options).toHaveLength(2);
    expect(options?.[0]?.value).toBe('small');
    expect(options?.[1]?.textContent).toBe('Medium');
  });

  it('reflects disabled, required, and name to the native select', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.disabled = true;
    element.required = true;
    element.name = 'size';
    element.append(createOption('small', 'Small'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');

    expect(select?.disabled).toBe(true);
    expect(select?.required).toBe(true);
    expect(select?.getAttribute('name')).toBe('size');
    expect(select?.className).toContain('sp-input--disabled');
  });

  it('applies invalid semantics without overriding forwarded labeling', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.invalid = true;
    element.setAttribute('aria-label', 'Plan');
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');

    expect(select?.getAttribute('aria-invalid')).toBe('true');
    expect(select?.getAttribute('aria-label')).toBe('Plan');
    expect(select?.className).toContain('sp-input--error');
  });

  it('supports initial value from attribute and property updates', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.append(createOption('free', 'Free'), createOption('pro', 'Pro'));
    element.setAttribute('value', 'pro');

    document.body.append(element);
    await element.updateComplete;

    let select = element.querySelector('select');
    expect(select?.value).toBe('pro');

    element.value = 'free';
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.value).toBe('free');
  });

  it('defaults host value from the selected native option when no explicit value is provided', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    const freeOption = createOption('free', 'Free');
    const proOption = createOption('pro', 'Pro');
    proOption.selected = true;
    element.append(freeOption, proOption);

    document.body.append(element);
    await element.updateComplete;
    await element.updateComplete;

    const select = element.querySelector('select');

    expect(select?.value).toBe('pro');
    expect(element.value).toBe('pro');
  });

  it('applies the consumer-facing id to the native select without duplicating it on the host', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.setAttribute('id', 'plan-select');
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    let select = element.querySelector('select');

    expect(element.id).toBe('plan-select');
    expect(element.getAttribute('id')).toBe('plan-select');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(select?.id).toBe('plan-select');

    element.id = 'billing-plan';
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.id).toBe('billing-plan');
  });

  it('keeps host value in sync while native select events bubble normally', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    const onInput = vi.fn();
    const onChange = vi.fn();
    element.append(createOption('free', 'Free'), createOption('pro', 'Pro'));

    element.addEventListener('input', onInput);
    element.addEventListener('change', onChange);

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');

    expect(select).not.toBeNull();

    select!.value = 'pro';
    select!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('pro');
    expect(onInput).toHaveBeenCalledTimes(1);

    select!.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.value).toBe('pro');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards aria-labelledby and aria-describedby', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.setAttribute('aria-labelledby', 'label-id');
    element.setAttribute('aria-describedby', 'desc-id');
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    expect(select?.getAttribute('aria-labelledby')).toBe('label-id');
    expect(select?.getAttribute('aria-describedby')).toBe('desc-id');
  });

  it('handles focus and blur correctly', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    select?.addEventListener('focus', onFocus);
    select?.addEventListener('blur', onBlur);

    element.focus();
    expect(onFocus).toHaveBeenCalled();

    element.blur();
    expect(onBlur).toHaveBeenCalled();
  });

  it('forwards title and autofocus to the native select', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.title = 'Choose a plan';
    element.autofocus = true;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    expect(select?.getAttribute('title')).toBe('Choose a plan');
    expect(select?.hasAttribute('autofocus')).toBe(true);
  });

  it('applies success and loading classes correctly', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.loading = true;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    let select = element.querySelector('select');
    expect(select?.className).toContain('sp-input--loading');
    expect(select?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    element.success = true;
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.className).toContain('sp-input--success');
    expect(select?.getAttribute('aria-busy')).toBe('false');
  });

  it('falls back safely for unsupported size values', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.size = 'xl' as never;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');

    expect(element.size).toBe('md');
    expect(select?.className).toContain('sp-input--md');
  });

});

function createOption(value: string, label: string): HTMLOptionElement {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
