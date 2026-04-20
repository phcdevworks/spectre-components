export * from './components';
import { defineSpectreButton } from './components/button';
import { defineSpectreInput } from './components/input';
import { defineSpectreTextarea } from './components/textarea';
import { defineSpectreSelect } from './components/select';
import { defineSpectreCheckbox } from './components/checkbox';
import { defineSpectreRadio } from './components/radio';
import { defineSpectreLabel } from './components/label';
import { defineSpectreFieldset } from './components/fieldset';
export function defineSpectreComponents() {
    defineSpectreButton();
    defineSpectreInput();
    defineSpectreTextarea();
    defineSpectreSelect();
    defineSpectreCheckbox();
    defineSpectreRadio();
    defineSpectreLabel();
    defineSpectreFieldset();
}
