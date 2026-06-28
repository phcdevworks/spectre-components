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

    const input = element.querySelector(
      'input[type=radio]',
    ) as HTMLInputElement | null;
    const label = element.querySelector('.sp-label');

    expect(input).not.toBeNull();
    expect(input?.getAttribute('name')).toBe('plan');
    expect(input?.getAttribute('value')).toBe('pro');
    expect(label?.textContent).toBe('Pro plan');
  });

  it('checks via native space-key activation on the native radio', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector<HTMLInputElement>('input[type=radio]');
    expect(input).not.toBeNull();

    // Browsers check a radio's `checked` state on Space/arrow-key selection
    // before firing `click`/`change` — simulate that native sequence
    // directly on the native input to verify our `checked` property
    // tracks it. Real arrow-key group navigation is native UA behavior
    // for same-`name` radios and isn't exercised by a DOM test environment.
    input!.checked = true;
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  it('does not intercept or preventDefault native keydown events', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector<HTMLInputElement>('input[type=radio]');
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    });

    input?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('forwards the form attribute to the native radio', async () => {
    const element = document.createElement('sp-radio') as SpectreRadioElement;
    element.form = 'test-form';

    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector<HTMLInputElement>('input[type=radio]');
    expect(input?.getAttribute('form')).toBe('test-form');
  });

  it('participates in ancestor form submission via FormData only when checked', async () => {
    const form = document.createElement('form');
    const radio1 = document.createElement('sp-radio') as SpectreRadioElement;
    radio1.name = 'plan';
    radio1.value = 'free';
    const radio2 = document.createElement('sp-radio') as SpectreRadioElement;
    radio2.name = 'plan';
    radio2.value = 'pro';
    form.append(radio1, radio2);
    document.body.append(form);
    await radio1.updateComplete;
    await radio2.updateComplete;

    expect(new FormData(form).get('plan')).toBeNull();

    radio2.checked = true;
    await radio2.updateComplete;

    expect(new FormData(form).get('plan')).toBe('pro');
  });

  it('reports native required validity as satisfied when any radio in the group is checked', async () => {
    const form = document.createElement('form');
    const radio1 = document.createElement('sp-radio') as SpectreRadioElement;
    radio1.name = 'plan';
    radio1.required = true;
    const radio2 = document.createElement('sp-radio') as SpectreRadioElement;
    radio2.name = 'plan';
    radio2.required = true;
    form.append(radio1, radio2);
    document.body.append(form);
    await radio1.updateComplete;
    await radio2.updateComplete;

    expect(form.checkValidity()).toBe(false);

    radio2.checked = true;
    await radio2.updateComplete;

    expect(form.checkValidity()).toBe(true);
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

    const input = element.querySelector(
      'input[type=radio]',
    ) as HTMLInputElement | null;
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

  it('coordinates checked state within a named group', async () => {
    const radio1 = document.createElement('sp-radio') as SpectreRadioElement;
    radio1.name = 'group1';
    radio1.value = '1';
    radio1.checked = true;

    const radio2 = document.createElement('sp-radio') as SpectreRadioElement;
    radio2.name = 'group1';
    radio2.value = '2';

    document.body.append(radio1, radio2);
    await Promise.all([radio1.updateComplete, radio2.updateComplete]);

    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);

    // Simulate clicking the second radio
    const nativeRadio2 = radio2.querySelector('input');
    if (nativeRadio2) {
      nativeRadio2.checked = true;
      nativeRadio2.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await Promise.all([radio1.updateComplete, radio2.updateComplete]);

    expect(radio2.checked).toBe(true);
    // Note: In standard DOM without ElementInternals/form-associated logic
    // in the custom element itself, radio1.checked might still be true.
    // This test ensures that AT LEAST the clicked one becomes checked.
    expect(radio1.checked).toBe(false);
  });

  describe('group synchronization', () => {
    it('unchecks other radios in the same group when checked programmatically', async () => {
      const radio1 = document.createElement('sp-radio') as SpectreRadioElement;
      radio1.name = 'group_sync_1';
      radio1.value = '1';

      const radio2 = document.createElement('sp-radio') as SpectreRadioElement;
      radio2.name = 'group_sync_1';
      radio2.value = '2';
      radio2.checked = true;

      document.body.append(radio1, radio2);
      await Promise.all([radio1.updateComplete, radio2.updateComplete]);

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);

      // Act: programmatically check radio1
      radio1.checked = true;
      await Promise.all([radio1.updateComplete, radio2.updateComplete]);

      // Assert
      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(false);
    });

    it('unchecks other radios in the same group when checked via user interaction', async () => {
      const radio1 = document.createElement('sp-radio') as SpectreRadioElement;
      radio1.name = 'group_sync_2';
      radio1.value = '1';

      const radio2 = document.createElement('sp-radio') as SpectreRadioElement;
      radio2.name = 'group_sync_2';
      radio2.value = '2';
      radio2.checked = true;

      document.body.append(radio1, radio2);
      await Promise.all([radio1.updateComplete, radio2.updateComplete]);

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);

      // Act: simulate user interaction on radio1
      const input = radio1.querySelector('input');
      input!.checked = true;
      input!.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.all([radio1.updateComplete, radio2.updateComplete]);

      // Assert
      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(false);
    });
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
