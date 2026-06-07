import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreRating, SpectreRatingElement } from '../src';

describe('sp-rating', () => {
  beforeAll(() => {
    defineSpectreRating();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre rating class and role=img', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-rating-native]');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-rating');
    expect(div?.getAttribute('role')).toBe('img');
  });

  it('defaults to value=0, max=5, size=md', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.value).toBe(0);
    expect(element.max).toBe(5);
    expect(element.size).toBe('md');
  });

  it('renders the correct number of star spans based on max', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.max = 5;
    element.value = 3;

    document.body.append(element);
    await element.updateComplete;

    const starsContainer = element.querySelector('[data-sp-rating-native] > div');
    const stars = starsContainer?.querySelectorAll('span');

    expect(stars?.length).toBe(5);
  });

  it('generates a default aria-label expressing value out of max', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.value = 4;
    element.max = 5;

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-rating-native]');

    expect(div?.getAttribute('aria-label')).toBe('Rating: 4 out of 5');
  });

  it('uses a consumer-provided aria-label over the default', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.value = 4;
    element.setAttribute('aria-label', 'Excellent — 4 stars');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-rating-native]');

    expect(div?.getAttribute('aria-label')).toBe('Excellent — 4 stars');
  });

  it('renders the label text when the label property is set', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.value = 3;
    element.label = '3 out of 5';

    document.body.append(element);
    await element.updateComplete;

    expect(element.textContent).toContain('3 out of 5');
  });

  it('clamps value to max', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.max = 5;
    element.value = 10;

    document.body.append(element);
    await element.updateComplete;

    expect(element.value).toBe(5);
  });

  it('falls back to max=5 for invalid max values', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.max = -1;

    document.body.append(element);
    await element.updateComplete;

    expect(element.max).toBe(5);
  });

  it('falls back to value=0 for negative values', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.value = -3;

    document.body.append(element);
    await element.updateComplete;

    expect(element.value).toBe(0);
  });

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    // @ts-expect-error - testing invalid value
    element.size = 'xl';

    document.body.append(element);
    await element.updateComplete;

    expect(element.size).toBe('md');
  });

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.id = 'rating-1';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-rating-native]');

    expect(element.getAttribute('id')).toBe('rating-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(div?.id).toBe('rating-1');
  });

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-rating-native]');
    expect(div?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(div?.getAttribute('aria-busy')).toBe('false');
  });

  it('reflects the disabled state in the label classes when disabled', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.label = 'Rate me';
    element.disabled = true;

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('.sp-rating-text');
    expect(label?.className).toContain('disabled');
  });

  it('reflects the disabled state in the label classes when loading', async () => {
    const element = document.createElement('sp-rating') as SpectreRatingElement;
    element.label = 'Rate me';
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('.sp-rating-text');
    expect(label?.className).toContain('disabled');
  });
});
