export * from './components';

import { defineSpectreButton } from './components/button';
import { defineSpectreInput } from './components/input';

export function defineSpectreComponents(): void {
  defineSpectreButton();
  defineSpectreInput();
}
