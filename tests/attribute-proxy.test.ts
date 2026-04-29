import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreInput, SpectreInputElement } from '../src';

describe('attribute proxying', () => {
  beforeAll(() => {
    defineSpectreInput();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('proxies id from host to native control and removes it from host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('id', 'test-id');
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.id).toBe('test-id');
    expect(element.id).toBe('test-id');
    expect(element.getAttribute('id')).toBe('test-id');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
  });

  it('proxies title from host to native control and removes it from host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('title', 'test-title');
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('title')).toBe('test-title');
    expect(element.title).toBe('test-title');
    expect(element.getAttribute('title')).toBe('test-title');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'title')).toBe(false);
  });

  it('proxies aria-label from host to native control and removes it from host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('aria-label', 'test-label');
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBe('test-label');
    expect(element.getAttribute('aria-label')).toBe('test-label');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'aria-label')).toBe(false);
  });

  it('proxies aria-labelledby from host to native control and removes it from host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('aria-labelledby', 'test-labelledby');
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('aria-labelledby')).toBe('test-labelledby');
    expect(element.getAttribute('aria-labelledby')).toBe('test-labelledby');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'aria-labelledby')).toBe(false);
  });

  it('proxies aria-describedby from host to native control and removes it from host', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    element.setAttribute('aria-describedby', 'test-describedby');
    document.body.append(element);
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('aria-describedby')).toBe('test-describedby');
    expect(element.getAttribute('aria-describedby')).toBe('test-describedby');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'aria-describedby')).toBe(false);
  });

  it('updates proxied attributes dynamically', async () => {
    const element = document.createElement('sp-input') as SpectreInputElement;
    document.body.append(element);
    await element.updateComplete;

    element.setAttribute('title', 'new-title');
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.getAttribute('title')).toBe('new-title');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'title')).toBe(false);

    element.removeAttribute('title');
    await element.updateComplete;
    expect(input?.hasAttribute('title')).toBe(false);
    expect(element.title).toBe('');
  });

  it('handles initial attributes from markup', async () => {
    document.body.innerHTML = '<sp-input id="markup-id" title="markup-title" aria-label="markup-label"></sp-input>';
    const element = document.querySelector('sp-input') as SpectreInputElement;
    await element.updateComplete;

    const input = element.querySelector('input');
    expect(input?.id).toBe('markup-id');
    expect(input?.getAttribute('title')).toBe('markup-title');
    expect(input?.getAttribute('aria-label')).toBe('markup-label');

    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(HTMLElement.prototype.hasAttribute.call(element, 'title')).toBe(false);
    expect(HTMLElement.prototype.hasAttribute.call(element, 'aria-label')).toBe(false);
  });
});
