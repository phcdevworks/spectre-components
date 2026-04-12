import '@phcdevworks/spectre-tokens/index.css';
import '@phcdevworks/spectre-ui/index.css';

import { html, render } from 'lit';
import {
  defineSpectreButton,
  defineSpectreCheckbox,
  defineSpectreFieldset,
  defineSpectreInput,
  defineSpectreLabel,
  defineSpectreRadio,
  defineSpectreSelect,
  defineSpectreTextarea,
} from './src';

defineSpectreButton();
defineSpectreCheckbox();
defineSpectreFieldset();
defineSpectreInput();
defineSpectreLabel();
defineSpectreRadio();
defineSpectreSelect();
defineSpectreTextarea();

const template = html`
  <section>
    <h2>sp-button</h2>
    <div class='row'>
      <sp-button variant='primary' title='Submit your data' name='submit-btn' value='save'>
        Button with Title
      </sp-button>
      <sp-button variant='primary' loading loading-label='Processing...'>
        Content to be preserved
      </sp-button>
    </div>
  </section>

  <section>
    <h2>sp-input</h2>
    <div class='row'>
      <sp-input placeholder='Pill Input' pill></sp-input>
      <sp-input value='Success state' success title='Success input'></sp-input>
      <sp-input value='Loading state' loading title='Loading input'></sp-input>
    </div>
  </section>

  <section>
    <h2>sp-select</h2>
    <div class='row'>
      <sp-select name='plan'>
        <option value='free'>Free</option>
        <option value='pro' selected>Pro</option>
      </sp-select>
      <sp-select name='state' invalid>
        <option value='draft'>Draft</option>
        <option value='published'>Published</option>
      </sp-select>
      <sp-select name='size' loading>
        <option value='small'>Small</option>
        <option value='medium'>Medium</option>
      </sp-select>
    </div>
  </section>

  <section>
    <h2>sp-textarea</h2>
    <div class='row'>
      <sp-textarea placeholder='Standard Textarea'></sp-textarea>
      <sp-textarea placeholder='Disabled Textarea' disabled></sp-textarea>
      <sp-textarea placeholder='Readonly Textarea' readonly value='Read only content'></sp-textarea>
      <sp-textarea placeholder='Invalid Textarea' invalid></sp-textarea>
    </div>
  </section>

  <section>
    <h2>sp-label</h2>
    <div class='row'>
      <sp-label for='verification-name'>Project name</sp-label>
      <sp-input id='verification-name' value='Spectre Components'></sp-input>
    </div>
  </section>

  <section>
    <h2>sp-checkbox</h2>
    <div class='row'>
      <sp-checkbox label='Accept terms' name='terms'></sp-checkbox>
      <sp-checkbox label='Subscribe to updates' checked></sp-checkbox>
      <sp-checkbox label='Required option' invalid required></sp-checkbox>
    </div>
  </section>

  <section>
    <h2>sp-radio</h2>
    <div class='row'>
      <sp-radio label='Free' name='plan' value='free'></sp-radio>
      <sp-radio label='Pro' name='plan' value='pro' checked></sp-radio>
      <sp-radio label='Enterprise' name='plan' value='enterprise'></sp-radio>
    </div>
  </section>

  <section>
    <h2>sp-fieldset</h2>
    <sp-fieldset legend='Contact preferences' aria-describedby='contact-help'>
      <div class='row'>
        <sp-checkbox label='Email updates' name='contact-email'></sp-checkbox>
        <sp-checkbox label='Product news' name='contact-news'></sp-checkbox>
      </div>
      <p id='contact-help'>Choose how you would like to hear from us.</p>
    </sp-fieldset>
  </section>
`;

render(template, document.body);
