import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreBadge, SpectreBadgeElement } from '../src';

describe('sp-badge', () => {
  beforeAll(() => {
    defineSpectreBadge();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native span with the Spectre badge class and projected content', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    element.append('New');

    document.body.append(element);
    await element.updateComplete;

    const span = element.querySelector('span');

    expect(span).not.toBeNull();
    expect(span?.className).toContain('sp-badge');
    expect(span?.textContent).toContain('New');
  });

  it('defaults to variant=primary and size=md', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('primary');
    expect(element.size).toBe('md');
  });

  it('reflects a valid variant and size onto the span classes', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    element.variant = 'success';
    element.size = 'sm';

    document.body.append(element);
    await element.updateComplete;

    const span = element.querySelector('span');

    expect(span?.className).toContain('success');
    expect(span?.className).toContain('sm');
  });

  it('falls back to variant=primary for an invalid variant', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant';

    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('primary');
  });

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    // @ts-expect-error - testing invalid value
    element.size = 'xl';

    document.body.append(element);
    await element.updateComplete;

    expect(element.size).toBe('md');
  });

  it('forwards the consumer-facing id to the native span only', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    element.id = 'badge-1';

    document.body.append(element);
    await element.updateComplete;

    const span = element.querySelector('span');

    expect(element.getAttribute('id')).toBe('badge-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(span?.id).toBe('badge-1');
  });

  it('forwards ARIA attributes to the native span', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    element.setAttribute('aria-label', 'Status badge');
    element.setAttribute('aria-describedby', 'desc-1');

    document.body.append(element);
    await element.updateComplete;

    const span = element.querySelector('span');

    expect(span?.getAttribute('aria-label')).toBe('Status badge');
    expect(span?.getAttribute('aria-describedby')).toBe('desc-1');
  });

  it('falls back to disabled=false and loading=false when null is assigned', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    document.body.append(element);
    await element.updateComplete;

    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);

    // @ts-expect-error - testing fallback
    element.disabled = null;
    await element.updateComplete;
    expect(element.disabled).toBe(false);

    element.loading = true;
    await element.updateComplete;
    expect(element.loading).toBe(true);

    // @ts-expect-error - testing fallback
    element.loading = null;
    await element.updateComplete;
    expect(element.loading).toBe(false);
  });

  it('reflects the loading state to the aria-busy attribute', async () => {
    const element = document.createElement('sp-badge') as SpectreBadgeElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const span = element.querySelector('[data-sp-badge-native]');
    expect(span?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(span?.getAttribute('aria-busy')).toBe('false');
  });
});
