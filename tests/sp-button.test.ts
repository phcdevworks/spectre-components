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
    element.textContent = 'Save changes';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.className).toContain('sp-btn');
    expect(button?.className).toContain('sp-btn--secondary');
    expect(button?.className).toContain('sp-btn--lg');
    expect(button?.textContent?.trim()).toBe('Save changes');
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

  it('passes an accessible label to the native control', async () => {
    const element = document.createElement('sp-button') as SpectreButtonElement;
    element.label = 'Open menu';

    document.body.append(element);
    await element.updateComplete;

    const button = element.querySelector('button');

    expect(button?.getAttribute('aria-label')).toBe('Open menu');
  });
});
