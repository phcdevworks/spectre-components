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
    expect(label?.className).toContain('sp-label');
    expect(label?.textContent).toContain('Project name');
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
});

function superHasIdAttribute(element: HTMLElement): boolean {
  return HTMLElement.prototype.hasAttribute.call(element, 'id');
}
