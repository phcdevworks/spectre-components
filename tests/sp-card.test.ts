import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreCard, SpectreCardElement } from '../src';

describe('sp-card', () => {
  beforeAll(() => {
    defineSpectreCard();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre card class and projected content', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    const heading = document.createElement('h2');
    heading.textContent = 'Card Title';
    element.append(heading);

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-card');
    expect(div?.textContent).toContain('Card Title');
  });

  it('defaults to variant=elevated and padded=true', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('elevated');
    expect(element.padded).toBe(true);
  });

  it('reflects a valid variant onto the div classes', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    element.variant = 'outline';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('outline');
  });

  it('falls back to variant=elevated for an invalid variant', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant';

    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('elevated');
  });

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    element.id = 'card-1';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(element.getAttribute('id')).toBe('card-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(div?.id).toBe('card-1');
  });

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    element.setAttribute('aria-label', 'Product card');
    element.setAttribute('aria-labelledby', 'card-heading');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.getAttribute('aria-label')).toBe('Product card');
    expect(div?.getAttribute('aria-labelledby')).toBe('card-heading');
  });

  it('falls back to padded=true when null is assigned', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    document.body.append(element);
    await element.updateComplete;

    // @ts-expect-error - testing fallback
    element.padded = null;
    await element.updateComplete;
    expect(element.padded).toBe(true);
  });

  it('falls back to disabled=false and loading=false when null is assigned', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    document.body.append(element);
    await element.updateComplete;

    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);

    // @ts-expect-error - testing fallback
    element.disabled = null;
    await element.updateComplete;
    expect(element.disabled).toBe(false);
  });

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-card') as SpectreCardElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-card-native]');
    expect(div?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(div?.getAttribute('aria-busy')).toBe('false');
  });
});
