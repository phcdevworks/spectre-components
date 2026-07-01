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
    expect(select?.className).toContain('sp-select');
    expect(select?.className).toContain('sp-select--lg');
    expect(select?.className).toContain('sp-select--full');
    expect(options).toHaveLength(2);
    expect(options?.[0]?.value).toBe('small');
    expect(options?.[1]?.textContent).toBe('Medium');
  });

  it('reflects a native arrow-key-driven option change to the host value', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.append(createOption('small', 'Small'), createOption('medium', 'Medium'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select') as HTMLSelectElement;

    // Browsers cycle the selected option on ArrowDown/ArrowUp and fire
    // `input`/`change` on the native select — simulate that native
    // sequence directly to verify our `value` property tracks it.
    select.value = 'medium';
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.value).toBe('medium');
  });

  it('does not intercept or preventDefault native keydown events', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.append(createOption('small', 'Small'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    });

    select?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('reflects disabled, required, and name to the native select and handles dynamic updates', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.disabled = true;
    element.required = true;
    element.name = 'size';
    element.append(createOption('small', 'Small'));

    document.body.append(element);
    await element.updateComplete;

    let select = element.querySelector('select');

    expect(select?.disabled).toBe(true);
    expect(select?.required).toBe(true);
    expect(select?.getAttribute('name')).toBe('size');
    expect(select?.className).toContain('sp-select--disabled');

    element.disabled = false;
    element.required = false;
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.disabled).toBe(false);
    expect(select?.required).toBe(false);
    expect(select?.className).not.toContain('sp-select--disabled');
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
    expect(select?.className).toContain('sp-select--invalid');
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
    expect(select?.className).toContain('sp-select--loading');
    expect(select?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    element.success = true;
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.className).toContain('sp-select--success');
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
    expect(select?.className).toContain('sp-select--md');
  });

  it('reflects the pill property and applies the pill class', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.pill = true;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    expect(element.hasAttribute('pill')).toBe(true);
    expect(select?.className).toContain('sp-select--pill');

    element.pill = false;
    await element.updateComplete;
    expect(element.hasAttribute('pill')).toBe(false);
    expect(select?.className).not.toContain('sp-select--pill');
  });

  it('forwards the form attribute to the native select', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.form = 'test-form';
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    expect(select?.getAttribute('form')).toBe('test-form');
  });

  it('participates in ancestor form submission via FormData', async () => {
    const form = document.createElement('form');
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.name = 'plan';
    element.append(createOption('free', 'Free'), createOption('pro', 'Pro'));
    form.append(element);
    document.body.append(form);
    await element.updateComplete;

    element.value = 'pro';
    await element.updateComplete;

    const formData = new FormData(form);
    expect(formData.get('plan')).toBe('pro');
  });

  it('reports native required validity through the wrapper', async () => {
    const form = document.createElement('form');
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.name = 'plan';
    element.required = true;
    element.append(
      createOption('', ''),
      createOption('free', 'Free'),
    );
    form.append(element);
    document.body.append(form);
    await element.updateComplete;

    const select = element.querySelector('select') as HTMLSelectElement;

    expect(select.checkValidity()).toBe(false);
    expect(form.checkValidity()).toBe(false);

    element.value = 'free';
    await element.updateComplete;

    expect(select.checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('forwards autocapitalize and spellcheck to the native select', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.autocapitalize = 'words';
    element.spellcheck = true;
    element.append(createOption('free', 'Free'));

    document.body.append(element);
    await element.updateComplete;

    const select = element.querySelector('select');
    expect(select?.getAttribute('autocapitalize')).toBe('words');
    expect(select?.getAttribute('spellcheck')).toBe('true');

    element.autocapitalize = 'none';
    element.spellcheck = false;
    await element.updateComplete;
    expect(select?.getAttribute('autocapitalize')).toBe('none');
    expect(select?.getAttribute('spellcheck')).toBe('false');
  });

  it('synchronizes value correctly when resetting to an empty string', async () => {
    const element = document.createElement('sp-select') as SpectreSelectElement;
    element.append(createOption('', 'Select...'), createOption('val', 'Value'));
    element.value = 'val';

    document.body.append(element);
    await element.updateComplete;

    let select = element.querySelector('select');
    expect(select?.value).toBe('val');

    element.value = '';
    await element.updateComplete;

    select = element.querySelector('select');
    expect(select?.value).toBe('');
    expect(element.value).toBe('');
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
