import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreContainer, SpectreContainerElement } from '../src';

describe('sp-container', () => {
  beforeAll(() => {
    defineSpectreContainer();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre container class and projected content', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Container content';
    element.append(paragraph);

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-container');
    expect(div?.textContent).toContain('Container content');
  });

  it('defaults to no maxWidth modifier', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.maxWidth).toBeUndefined();
    const div = element.querySelector('div');
    expect(div?.className).not.toContain('max-width');
  });

  it('reflects a valid maxWidth onto the div classes', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    element.maxWidth = 'prose';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('sp-container--max-width-prose');
  });

  it('falls back to no maxWidth for an invalid value', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    // @ts-expect-error - testing invalid value
    element.maxWidth = 'not-a-width';

    document.body.append(element);
    await element.updateComplete;

    expect(element.maxWidth).toBeUndefined();
  });

  it('forwards the consumer-facing id to the native div only', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    element.id = 'container-1';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(element.getAttribute('id')).toBe('container-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(div?.id).toBe('container-1');
  });

  it('forwards ARIA attributes to the native div', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    element.setAttribute('aria-label', 'Main content');

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.getAttribute('aria-label')).toBe('Main content');
  });

  it('defaults the host to block display', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    document.body.append(element);
    await element.updateComplete;

    expect(getComputedStyle(element).display).toBe('block');
  });

  it('applies innerClass to the native div without touching the host class', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    element.className = 'host-class';
    element.innerClass = 'sp-mt-4 sp-bg-primary-500';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('sp-mt-4');
    expect(div?.className).toContain('sp-bg-primary-500');
    expect(div?.className).not.toContain('host-class');
    expect(element.className).toBe('host-class');
  });

  it('drops unsafe or non-sp- tokens from innerClass', async () => {
    const element = document.createElement('sp-container') as SpectreContainerElement;
    element.innerClass = 'sp-mt-4 not-allowed "><script>alert(1)</script>';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div');

    expect(div?.className).toContain('sp-mt-4');
    expect(div?.className).not.toContain('not-allowed');
    expect(div?.className).not.toContain('script');
  });
});
