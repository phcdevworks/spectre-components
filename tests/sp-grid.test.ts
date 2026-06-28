import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineSpectreGrid, SpectreGridElement } from '../src';

describe('sp-grid', () => {
  beforeAll(() => {
    defineSpectreGrid();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a native div with the Spectre grid class and projected content', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement;
    const card = document.createElement('div');
    card.textContent = 'Grid item';
    element.append(card);

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div[data-sp-grid-native]');

    expect(div).not.toBeNull();
    expect(div?.className).toContain('sp-grid');
    expect(div?.textContent).toContain('Grid item');
  });

  it('defaults to columns=1 and gap=md', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.columns).toBe(1);
    expect(element.gap).toBe('md');
  });

  it('reflects valid columns and gap onto the div classes', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement;
    element.columns = 3;
    element.gap = 'lg';

    document.body.append(element);
    await element.updateComplete;

    const div = element.querySelector('div[data-sp-grid-native]');

    expect(div?.className).toContain('sp-grid-cols-3');
    expect(div?.className).toContain('sp-grid--gap-lg');
  });

  it('falls back to columns=1 for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement;
    // @ts-expect-error - testing invalid value
    element.columns = 5;

    document.body.append(element);
    await element.updateComplete;

    expect(element.columns).toBe(1);
  });

  it('falls back to gap=md for an invalid value', async () => {
    const element = document.createElement('sp-grid') as SpectreGridElement;
    // @ts-expect-error - testing invalid value
    element.gap = 'not-a-gap';

    document.body.append(element);
    await element.updateComplete;

    expect(element.gap).toBe('md');
  });
});
