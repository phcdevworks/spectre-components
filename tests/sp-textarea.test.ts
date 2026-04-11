import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineSpectreTextarea, SpectreTextareaElement } from '../src';

describe('sp-textarea', () => {
  beforeAll(() => {
    defineSpectreTextarea();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native textarea with Spectre UI classes', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.placeholder = 'Add more detail';
    element.rows = 4;
    element.fullWidth = true;
    element.pill = true;

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');

    expect(textarea).not.toBeNull();
    expect(textarea?.className).toContain('sp-input');
    expect(textarea?.className).toContain('sp-input--md');
    expect(textarea?.className).toContain('sp-input--full');
    expect(textarea?.className).toContain('sp-input--pill');
    expect(textarea?.getAttribute('placeholder')).toBe('Add more detail');
    expect(textarea?.getAttribute('rows')).toBe('4');
    expect(textarea?.getAttribute('aria-invalid')).toBeNull();
  });

  it('reflects disabled, readonly, required, and name to the native textarea', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.disabled = true;
    element.readonly = true;
    element.required = true;
    element.name = 'notes';

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');

    expect(textarea?.disabled).toBe(true);
    expect(textarea?.readOnly).toBe(true);
    expect(textarea?.required).toBe(true);
    expect(textarea?.getAttribute('name')).toBe('notes');
    expect(textarea?.className).toContain('sp-input--disabled');
  });

  it('applies invalid semantics without overriding forwarded labeling', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.invalid = true;
    element.setAttribute('aria-label', 'Project summary');

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');

    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    expect(textarea?.getAttribute('aria-label')).toBe('Project summary');
    expect(textarea?.className).toContain('sp-input--error');
  });

  it('supports initial value from attribute and property updates', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.setAttribute('value', 'Initial notes');

    document.body.append(element);
    await element.updateComplete;

    let textarea = element.querySelector('textarea');
    expect(textarea?.value).toBe('Initial notes');

    element.value = 'Updated notes';
    await element.updateComplete;

    textarea = element.querySelector('textarea');
    expect(textarea?.value).toBe('Updated notes');
  });

  it('applies the consumer-facing id to the native textarea without duplicating it on the host', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.setAttribute('id', 'project-notes');

    document.body.append(element);
    await element.updateComplete;

    let textarea = element.querySelector('textarea');

    expect(element.id).toBe('project-notes');
    expect(element.getAttribute('id')).toBe('project-notes');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(textarea?.id).toBe('project-notes');

    element.id = 'customer-notes';
    await element.updateComplete;

    textarea = element.querySelector('textarea');

    expect(element.id).toBe('customer-notes');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(textarea?.id).toBe('customer-notes');
  });

  it('keeps host value in sync while native textarea input and change events bubble normally', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    const onInput = vi.fn();
    const onChange = vi.fn();

    element.addEventListener('input', onInput);
    element.addEventListener('change', onChange);

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');

    expect(textarea).not.toBeNull();

    textarea!.value = 'Typed notes';
    textarea!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('Typed notes');
    expect(onInput).toHaveBeenCalledTimes(1);

    textarea!.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.value).toBe('Typed notes');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards aria-labelledby and aria-describedby', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.setAttribute('aria-labelledby', 'label-id');
    element.setAttribute('aria-describedby', 'desc-id');

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');
    expect(textarea?.getAttribute('aria-labelledby')).toBe('label-id');
    expect(textarea?.getAttribute('aria-describedby')).toBe('desc-id');
  });

  it('coerces unsupported numeric values to safe defaults only where needed', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.rows = 0;
    element.maxlength = -10;
    element.minlength = -2;

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');

    expect(element.rows).toBe(2);
    expect(textarea?.getAttribute('rows')).toBe('2');
    expect(textarea?.hasAttribute('maxlength')).toBe(false);
    expect(textarea?.hasAttribute('minlength')).toBe(false);
  });

  it('handles focus and blur correctly', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    textarea?.addEventListener('focus', onFocus);
    textarea?.addEventListener('blur', onBlur);

    element.focus();
    expect(onFocus).toHaveBeenCalled();

    element.blur();
    expect(onBlur).toHaveBeenCalled();
  });

  it('forwards title to the native textarea', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.title = 'Please enter your feedback';

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');
    expect(textarea?.getAttribute('title')).toBe('Please enter your feedback');
  });

  it('applies classes for size, loading, and success states', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.size = 'sm';
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    let textarea = element.querySelector('textarea');
    expect(textarea?.className).toContain('sp-input--sm');
    expect(textarea?.className).toContain('sp-input--loading');
    expect(textarea?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    element.success = true;
    element.size = 'lg';
    await element.updateComplete;

    textarea = element.querySelector('textarea');
    expect(textarea?.className).toContain('sp-input--lg');
    expect(textarea?.className).toContain('sp-input--success');
    expect(textarea?.getAttribute('aria-busy')).toBe('false');
  });

  it('forwards autocomplete, autofocus, and inputmode', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    element.autocomplete = 'on';
    element.autofocus = true;
    element.inputmode = 'text';

    document.body.append(element);
    await element.updateComplete;

    const textarea = element.querySelector('textarea');
    expect(textarea?.getAttribute('autocomplete')).toBe('on');
    expect(textarea?.hasAttribute('autofocus')).toBe(true);
    expect(textarea?.getAttribute('inputmode')).toBe('text');
  });

  it('tightens maxlength, minlength and rows validation', async () => {
    const element = document.createElement(
      'sp-textarea',
    ) as SpectreTextareaElement;
    // @ts-expect-error - Testing invalid value
    element.maxlength = 'invalid';
    // @ts-expect-error - Testing invalid value
    element.minlength = -5;
    // @ts-expect-error - Testing invalid value
    element.rows = 0;

    document.body.append(element);
    await element.updateComplete;

    expect(element.maxlength).toBeUndefined();
    expect(element.minlength).toBeUndefined();
    expect(element.rows).toBe(2);

    element.rows = 5;
    await element.updateComplete;
    expect(element.rows).toBe(5);

    // @ts-expect-error - Testing invalid value
    element.rows = null;
    await element.updateComplete;
    expect(element.rows).toBe(2);
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
