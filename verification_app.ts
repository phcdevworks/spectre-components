import '@phcdevworks/spectre-tokens/dist/index.css';
import '@phcdevworks/spectre-ui/dist/base.css';
import '@phcdevworks/spectre-ui/dist/components.css';
import '@phcdevworks/spectre-ui/dist/utilities.css';

import { html, render } from 'lit';
import {
  defineSpectreButton,
  defineSpectreInput,
  defineSpectreTextarea,
} from './src';

defineSpectreButton();
defineSpectreInput();
defineSpectreTextarea();

const template = html`
  <section>
    <h2>sp-button Enhancements</h2>
    <div class="row">
      <sp-button variant="primary" title="Submit your data" name="submit-btn" value="save">
        Button with Title
      </sp-button>
      <sp-button variant="primary" loading loading-label="Processing...">
        Content to be preserved
      </sp-button>
    </div>
  </section>

  <section>
    <h2>sp-input Enhancements</h2>
    <div class="row">
      <sp-input placeholder="Pill Input" pill></sp-input>
      <sp-input value="Success state" success title="Success input"></sp-input>
      <sp-input value="Loading state" loading title="Loading input"></sp-input>
    </div>
  </section>

  <section>
    <h2>sp-textarea Enhancements</h2>
    <div class="row">
      <sp-textarea placeholder="Standard Textarea"></sp-textarea>
      <sp-textarea placeholder="Disabled Textarea" disabled></sp-textarea>
      <sp-textarea
        placeholder="Readonly Textarea"
        readonly
        value="Read only content"
      ></sp-textarea>
      <sp-textarea placeholder="Invalid Textarea" invalid></sp-textarea>
    </div>
  </section>
`;

render(template, document.body);
