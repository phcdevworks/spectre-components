import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreFieldset, SpectreFieldsetElement } from '../src';

describe('sp-fieldset legend projection', () => {
  beforeAll(() => {
    defineSpectreFieldset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('projects a native <legend> provided in Light DOM into the internal native <fieldset>', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;

    const nativeLegend = document.createElement('legend');
    nativeLegend.textContent = 'Projected Legend';
    element.appendChild(nativeLegend);

    const content = document.createElement('div');
    content.textContent = 'Field content';
    element.appendChild(content);

    document.body.appendChild(element);

    // SpectreProjectableElement uses MutationObserver, it might need a tick or more
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const internalFieldset = element.querySelector('fieldset[data-sp-fieldset-native]');
    expect(internalFieldset).not.toBeNull();

    const projectedLegend = internalFieldset?.querySelector('legend');
    expect(projectedLegend).toBe(nativeLegend);
    expect(projectedLegend?.textContent).toBe('Projected Legend');

    expect(internalFieldset?.textContent).toContain('Field content');
  });

  it('handles both legend property and projected legend (property takes precedence or they coexist based on template)', async () => {
    const element = document.createElement('sp-fieldset') as SpectreFieldsetElement;
    element.legend = 'Property Legend';

    const nativeLegend = document.createElement('legend');
    nativeLegend.textContent = 'Projected Legend';
    element.appendChild(nativeLegend);

    document.body.appendChild(element);
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const internalFieldset = element.querySelector('fieldset[data-sp-fieldset-native]');
    const legends = internalFieldset?.querySelectorAll('legend');

    // In current implementation, both will be rendered.
    // One from the template (if legend prop is set) and one projected.
    expect(legends?.length).toBe(2);

    const propertyLegend = Array.from(legends || []).find(l => l.hasAttribute('data-sp-fieldset-legend'));
    const projectedLegend = Array.from(legends || []).find(l => !l.hasAttribute('data-sp-fieldset-legend'));

    expect(propertyLegend?.textContent).toBe('Property Legend');
    expect(projectedLegend?.textContent).toBe('Projected Legend');
  });
});
