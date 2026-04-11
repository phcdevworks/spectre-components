export * from './components';

import { defineSpectreButton } from './components/button';
import { defineSpectreInput } from './components/input';
import { defineSpectreTextarea } from './components/textarea';
import { defineSpectreSelect } from './components/select';

export function defineSpectreComponents(): void {
  defineSpectreButton();
  defineSpectreInput();
  defineSpectreTextarea();
  defineSpectreSelect();
}
