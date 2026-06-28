import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreSection, SpectreSectionElement } from '../src';

describe('sp-section', () => {
  beforeAll(() => {
    defineSpectreSection();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native section with the Spectre section class and projected content', async () => {
    const element = document.createElement('sp-section') as SpectreSectionElement;
    const heading = document.createElement('h2');
    heading.textContent = 'Section heading';
    element.append(heading);

    document.body.append(element);
    await element.updateComplete;

    const section = element.querySelector('section');

    expect(section).not.toBeNull();
    expect(section?.className).toContain('sp-section');
    expect(section?.textContent).toContain('Section heading');
  });

  it('forwards the consumer-facing id to the native section only', async () => {
    const element = document.createElement('sp-section') as SpectreSectionElement;
    element.id = 'section-1';

    document.body.append(element);
    await element.updateComplete;

    const section = element.querySelector('section');

    expect(element.getAttribute('id')).toBe('section-1');
    expect(HTMLElement.prototype.hasAttribute.call(element, 'id')).toBe(false);
    expect(section?.id).toBe('section-1');
  });

  it('forwards ARIA attributes to the native section', async () => {
    const element = document.createElement('sp-section') as SpectreSectionElement;
    element.setAttribute('aria-labelledby', 'section-heading');

    document.body.append(element);
    await element.updateComplete;

    const section = element.querySelector('section');

    expect(section?.getAttribute('aria-labelledby')).toBe('section-heading');
  });
});
