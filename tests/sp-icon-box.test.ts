import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreIconBox, SpectreIconBoxElement } from '../src';

describe('sp-icon-box', () => {
  beforeAll(() => {
    defineSpectreIconBox();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre icon-box class and projected content', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    element.append('★');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-iconbox');
    expect(div?.textContent).toContain('★');
  });

  it('defaults to variant=primary and size=md', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('primary');
    expect(element.size).toBe('md');
  });

  it('reflects a valid variant and size onto the div classes', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    element.variant = 'danger';
    element.size = 'lg';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('danger');
    expect(div?.className).toContain('lg');
  });

  it('falls back to variant=primary for an invalid variant', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    // @ts-expect-error - testing invalid value
    element.variant = 'not-a-variant';

    document.body.append(element);
    await element.updateComplete;

    expect(element.variant).toBe('primary');
  });

  it('falls back to size=md for an invalid size', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    // @ts-expect-error - testing invalid value
    element.size = 'xl';

    document.body.append(element);
    await element.updateComplete;

    expect(element.size).toBe('md');
  });

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    element.id = 'icon-box-1';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(element.getAttribute('id')).toBe('icon-box-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(div?.id).toBe('icon-box-1');
  });

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    element.setAttribute('aria-label', 'Feature icon');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.getAttribute('aria-label')).toBe('Feature icon');
  });

  it('falls back to disabled=false and loading=false when null is assigned', async () => {
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
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
    const element = document.createElement('sp-icon-box') as SpectreIconBoxElement;
    element.loading = true;

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('[data-sp-icon-box-native]');
    expect(div?.getAttribute('aria-busy')).toBe('true');

    element.loading = false;
    await element.updateComplete;
    expect(div?.getAttribute('aria-busy')).toBe('false');
  });
});
