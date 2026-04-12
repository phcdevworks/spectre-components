import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineSpectreButton, SpectreButtonElement } from '../src';

describe('sp-button', () => {
  beforeAll(() => {
    defineSpectreButton();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native button with Spectre UI classes', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.variant = 'secondary';
    element.size = 'lg';
    element.append(document.createTextNode('Save changes'));

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.className).toContain('sp-btn');
    expect(button?.className).toContain('sp-btn--secondary');
    expect(button?.className).toContain('sp-btn--lg');
    expect(button?.textContent?.trim()).toBe('Save changes');
    expect(button?.getAttribute('aria-label')).toBeNull();
  });

  it('disables the native button while loading', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.loading = true;
    element.loadingLabel = 'Submitting';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.textContent?.trim()).toBe('Submitting');
  });

  it('falls back to label when no projected content exists', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.label = 'Open menu';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.textContent?.trim()).toBe('Open menu');
  });

  it('forwards aria-label even when there is visible text', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.setAttribute('aria-label', 'Icon action');
    element.label = 'Visible text';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.textContent?.trim()).toBe('Visible text');
    expect(button?.getAttribute('aria-label')).toBe('Icon action');
  });

  it('updates projected content when host content changes later', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.label = 'Fallback';

    document.body.append(element);
    await element.updateComplete;

    element.append(document.createTextNode('Publish'));
    await Promise.resolve();
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.textContent?.trim()).toBe('Publish');
    expect(button?.getAttribute('aria-label')).toBeNull();
  });

  it('forwards id to the native button', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.id = 'submit-btn';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');
    expect(button?.id).toBe('submit-btn');
    expect(element.getAttribute('id')).toBe('submit-btn');
    // Ensure the id is not on the host element's actual DOM attributes
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
  });

  it('forwards aria-labelledby and aria-describedby', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.setAttribute('aria-labelledby', 'label-id');
    element.setAttribute('aria-describedby', 'desc-id');

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');
    expect(button?.getAttribute('aria-labelledby')).toBe('label-id');
    expect(button?.getAttribute('aria-describedby')).toBe('desc-id');
  });

  it('handles focus and blur correctly', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    button?.addEventListener('focus', onFocus);
    button?.addEventListener('blur', onBlur);

    element.focus();
    expect(onFocus).toHaveBeenCalled();

    element.blur();
    expect(onBlur).toHaveBeenCalled();
  });

  it('forwards name, value, title, and autofocus to the native button', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.name = 'submit-action';
    element.value = 'save';
    element.title = 'Click to save changes';
    element.autofocus = true;

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');
    expect(button?.getAttribute('name')).toBe('submit-action');
    expect(button?.getAttribute('value')).toBe('save');
    expect(button?.getAttribute('title')).toBe('Click to save changes');
    expect(button?.hasAttribute('autofocus')).toBe(true);
  });

  it('preserves content when toggling loading state', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.append(document.createTextNode('Original Content'));

    document.body.append(element);
    await element.updateComplete;

    let button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Original Content');

    // Toggle loading
    element.loading = true;
    await element.updateComplete;
    button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Loading'); // Default loading label

    // Toggle back
    element.loading = false;
    await element.updateComplete;
    button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Original Content');
  });

  it('tightens loadingLabel fallback', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.loading = true;
    element.loadingLabel = '  '; // Empty/whitespace

    document.body.append(element);
    await element.updateComplete;

    let button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Loading');

    element.loadingLabel = 'Processing...';
    await element.updateComplete;
    button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Processing...');

    // @ts-expect-error -- exercising runtime fallback for invalid consumer value
    element.loadingLabel = null;
    await element.updateComplete;
    button = element.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Loading');
  });
});
