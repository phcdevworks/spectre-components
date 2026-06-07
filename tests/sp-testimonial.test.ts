import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreTestimonial, SpectreTestimonialElement } from '../src';

describe('sp-testimonial', () => {
  beforeAll(() => {
    defineSpectreTestimonial();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre testimonial class and projected content', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    const quote = document.createElement('p');
    quote.textContent = 'Great product!';
    element.append(quote);

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-testimonial');
    expect(div?.textContent).toContain('Great product!');
  });

  it('defaults to variant=elevated', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('elevated');
  });

  it('reflects a valid variant onto the div classes', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    element.variant = 'flat';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('flat');
  });

  it('falls back to variant=elevated for an invalid variant', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant';

    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('elevated');
  });

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    element.id = 'testimonial-1';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(element.getAttribute('id')).toBe('testimonial-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(div?.id).toBe('testimonial-1');
  });

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    element.setAttribute('aria-label', 'Customer testimonial');
    element.setAttribute('aria-describedby', 'author-bio');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.getAttribute('aria-label')).toBe('Customer testimonial');
    expect(div?.getAttribute('aria-describedby')).toBe('author-bio');
  });

  it('falls back to disabled=false and loading=false when null is assigned', async () => {
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
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
    const element = document.createElement('sp-testimonial') as SpectreTestimonialElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-testimonial-native]');
    expect(div?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(div?.getAttribute('aria-busy')).toBe('false');
  });
});
