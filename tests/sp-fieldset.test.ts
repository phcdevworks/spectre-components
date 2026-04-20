import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreFieldset, SpectreFieldsetElement } from '../src';

describe('sp-fieldset', () => {
  beforeAll(() => {
    defineSpectreFieldset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native fieldset with projected children and legend text', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.legend = 'Contact preferences';
    element.append(createChild('Email updates'));

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');
    const legend = element.querySelector('legend');

    expect(fieldset).not.toBeNull();
    expect(legend?.textContent).toBe('Contact preferences');
    expect(legend?.className).toContain('sp-label');
    expect(fieldset?.textContent).toContain('Email updates');
  });

  it('forwards aria attributes and disabled state to the native fieldset', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.disabled = true;
    element.setAttribute('aria-label', 'Contact preferences');
    element.setAttribute('aria-labelledby', 'contact-legend');
    element.setAttribute('aria-describedby', 'contact-help');

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');

    expect(fieldset?.disabled).toBe(true);
    expect(fieldset?.getAttribute('aria-label')).toBe('Contact preferences');
    expect(fieldset?.getAttribute('aria-labelledby')).toBe('contact-legend');
    expect(fieldset?.getAttribute('aria-describedby')).toBe('contact-help');
  });

  it('forwards the consumer-facing id to the native fieldset only', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.id = 'contact-methods';

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');

    expect(element.getAttribute('id')).toBe('contact-methods');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(fieldset?.id).toBe('contact-methods');
  });

  it('forwards the form attribute to the native fieldset', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.form = 'test-form';

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');
    expect(fieldset?.getAttribute('form')).toBe('test-form');
  });
});

function createChild(text: string): HTMLDivElement {
  const child = document.createElement('div');
  child.textContent = text;
  return child;
}

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
