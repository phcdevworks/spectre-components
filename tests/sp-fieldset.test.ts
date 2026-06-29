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
    expect(legend?.textContent?.trim()).toBe('Contact preferences');
    expect(legend?.className).toContain('sp-fieldset__legend');
    expect(fieldset?.className).toContain('sp-fieldset');
    expect(fieldset?.textContent).toContain('Email updates');
  });

  it('applies the disabled modifier class to the native fieldset', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.disabled = true;

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');

    expect(fieldset?.className).toContain('sp-fieldset--disabled');
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

  it('forwards autofocus to the native fieldset and removes it from the host', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.autofocus = true;

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');
    expect(fieldset?.hasAttribute('autofocus')).toBe(true);
    expect(element.autofocus).toBe(true);
    expect(superHasAttribute(element, 'autofocus')).toBe(false);
  });

  it('reflects and forwards loading, invalid, and success states', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.loading = true;
    element.invalid = true;
    element.success = true;

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');

    expect(element.hasAttribute('loading')).toBe(true);
    expect(element.hasAttribute('invalid')).toBe(true);
    expect(element.hasAttribute('success')).toBe(true);

    expect(fieldset?.getAttribute('aria-busy')).toBe('true');
    expect(fieldset?.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset?.disabled).toBe(true);

    element.loading = false;
    await element.updateComplete;
    expect(fieldset?.getAttribute('aria-busy')).toBe('false');
    expect(fieldset?.disabled).toBe(false);
  });

  it('allows rich content in the legend via light-DOM projection', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    const legend = document.createElement('legend');
    legend.innerHTML = '<span>Rich</span> Legend';
    element.append(legend);
    element.append(createChild('Content'));

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');
    const projectedLegend = fieldset?.querySelector('legend');

    expect(projectedLegend).not.toBeNull();
    expect(projectedLegend?.innerHTML).toContain('<span>Rich</span> Legend');
    expect(fieldset?.textContent).toContain('Content');
  });

  it('does not render a legend when property is empty or whitespace', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.legend = '  ';

    document.body.append(element);
    await element.updateComplete;

    const legend = element.querySelector('legend');
    expect(legend).toBeNull();

    element.legend = '';
    await element.updateComplete;
    expect(element.querySelector('legend')).toBeNull();
  });

  it('forwards autocapitalize and spellcheck to the native fieldset', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.autocapitalize = 'words';
    element.spellcheck = false;

    document.body.append(element);
    await element.updateComplete;

    const fieldset = element.querySelector('fieldset');

    expect(fieldset?.getAttribute('autocapitalize')).toBe('words');
    expect(fieldset?.getAttribute('spellcheck')).toBe('false');

    element.autocapitalize = '';
    element.spellcheck = null;
    await element.updateComplete;

    expect(fieldset?.hasAttribute('autocapitalize')).toBe(false);
    expect(fieldset?.hasAttribute('spellcheck')).toBe(false);
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

function superHasAttribute(element: HTMLElement, attr: string): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, attr);
}
