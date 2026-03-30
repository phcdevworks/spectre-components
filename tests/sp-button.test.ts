import { afterEach, beforeAll, describe, expect, it } from 'vitest';

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
    expect(button?.getAttribute('aria-label')).toBeNull();
  });

  it('uses aria-label only when there is no visible text', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.setAttribute('aria-label', 'Icon action');

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.textContent?.trim()).toBe('');
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
});
