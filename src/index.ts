export * from './components';

import { defineSpectreButton } from './components/button';
import { defineSpectreInput } from './components/input';
import { defineSpectreTextarea } from './components/textarea';

export function defineSpectreComponents(): void {
  defineSpectreButton();
  defineSpectreInput();
  defineSpectreTextarea();
}
