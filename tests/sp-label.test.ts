import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreLabel, SpectreLabelElement } from '../src';

describe('sp-label', () => {
  beforeAll(() => {
    defineSpectreLabel();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native label with the Spectre label class and projected content', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.append('Project name');

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('label');

    expect(label).not.toBeNull();
    expect(label?.className).toContain('sp-form-label');
    expect(label?.textContent).toContain('Project name');
  });

  it('applies the required modifier class when required is true', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.required = true;
    element.append('Project name');

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('label');

    expect(label?.className).toContain('sp-form-label--required');
  });

  it('falls back to required=false when null or undefined is assigned', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.required = true;

    document.body.append(element);
    await element.updateComplete;

    expect(element.required).toBe(true);

    // @ts-expect-error - testing fallback
    element.required = null;
    await element.updateComplete;
    expect(element.required).toBe(false);

    element.required = true;
    await element.updateComplete;
    expect(element.required).toBe(true);

    element.required = undefined;
    await element.updateComplete;
    expect(element.required).toBe(false);
  });

  it('forwards the for attribute and consumer-facing id to the native label only', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.htmlFor = 'project-name';
    element.id = 'project-name-label';
    element.append('Project name');

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('label');

    expect(element.getAttribute('id')).toBe('project-name-label');
    expect(superHasIdAttribute(element)).toBe(false);
    expect(label?.getAttribute('for')).toBe('project-name');
    expect(label?.id).toBe('project-name-label');
  });

  it('forwards ARIA attributes to the native label', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.setAttribute('aria-label', 'Custom Label');
    element.setAttribute('aria-labelledby', 'label-id');
    element.setAttribute('aria-describedby', 'description-id');

    document.body.append(element);
    await element.updateComplete;

    const label = element.querySelector('label');

    expect(label?.getAttribute('aria-label')).toBe('Custom Label');
    expect(label?.getAttribute('aria-labelledby')).toBe('label-id');
    expect(label?.getAttribute('aria-describedby')).toBe('description-id');
  });

  it('falls back to disabled=false when null or undefined is assigned', async () => {
    const element = document.createElement('sp-label') as SpectreLabelElement;
    element.disabled = true;

    document.body.append(element);
    await element.updateComplete;

    expect(element.disabled).toBe(true);

    // @ts-expect-error - testing fallback
    element.disabled = null;
    await element.updateComplete;
    expect(element.disabled).toBe(false);

    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);

    element.disabled = undefined;
    await element.updateComplete;
    expect(element.disabled).toBe(false);
  });
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
