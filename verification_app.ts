import '@phcdevworks/spectre-tokens/index.css';
import '@phcdevworks/spectre-ui/index.css';

import { html, render } from 'lit';
import { defineSpectreComponents } from './src';

defineSpectreComponents();

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
      <sp-checkbox>
        <span>Accept <strong>Rich Terms</strong></span>
      </sp-checkbox>
    </div>
  </section>

  <section>
    <h2>sp-radio</h2>
    <div class='row'>
      <sp-radio label='Free' name='plan' value='free'></sp-radio>
      <sp-radio label='Pro' name='plan' value='pro' checked></sp-radio>
      <sp-radio label='Enterprise' name='plan' value='enterprise'></sp-radio>
      <sp-radio name='plan' value='rich'>
        <span>Custom <strong>Pro</strong> Plan</span>
      </sp-radio>
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

    <sp-fieldset legend='  '>
      <p>This fieldset has a whitespace legend and should not render a legend tag.</p>
    </sp-fieldset>

    <sp-fieldset legend='Autofocus Fieldset' autofocus>
      <p>This fieldset should have autofocus.</p>
    </sp-fieldset>
  </section>

  <section>
    <h2>sp-badge</h2>
    <div class='row'>
      <sp-badge variant='primary'>New</sp-badge>
      <sp-badge variant='danger'>3</sp-badge>
      <sp-badge variant='success' loading>Syncing</sp-badge>
    </div>
  </section>

  <section>
    <h2>sp-tag</h2>
    <div class='row'>
      <sp-tag>Default</sp-tag>
      <sp-tag variant='success'>Active</sp-tag>
      <sp-tag aria-label='Featured item'>Featured</sp-tag>
    </div>
  </section>

  <section>
    <h2>sp-card / sp-pricing-card</h2>
    <div class='row'>
      <sp-card>
        <h3>Card title</h3>
        <p>Card body content.</p>
      </sp-card>
      <sp-card interactive>
        <h3>Interactive card</h3>
        <a href='#'>View details</a>
      </sp-card>
      <sp-pricing-card>
        <h3>Pro plan</h3>
        <p>$19/mo</p>
      </sp-pricing-card>
    </div>
  </section>

  <section>
    <h2>sp-alert</h2>
    <div class='row'>
      <sp-alert variant='info'>Heads up — this is an alert.</sp-alert>
      <sp-alert variant='danger'>Something went wrong.</sp-alert>
    </div>
  </section>

  <section>
    <h2>sp-testimonial</h2>
    <div class='row'>
      <sp-testimonial>
        <blockquote>Great product.</blockquote>
        <cite>Jane Doe</cite>
      </sp-testimonial>
    </div>
  </section>

  <section>
    <h2>sp-avatar / sp-icon-box / sp-rating / sp-spinner</h2>
    <div class='row'>
      <sp-avatar aria-label='Bradley Potts'>BP</sp-avatar>
      <sp-icon-box aria-label='Feature icon'>
        <svg width='24' height='24' aria-hidden='true'><circle cx='12' cy='12' r='10' /></svg>
      </sp-icon-box>
      <sp-rating></sp-rating>
      <sp-rating value='4' label='4 out of 5 stars'></sp-rating>
      <sp-spinner></sp-spinner>
    </div>
  </section>

  <section>
    <h2>Layout: sp-container / sp-grid / sp-section / sp-stack</h2>
    <sp-container max-width='prose'>
      <sp-section>
        <sp-stack direction='horizontal' align='center'>
          <sp-badge variant='primary'>A</sp-badge>
          <sp-badge variant='secondary'>B</sp-badge>
          <sp-badge variant='success'>C</sp-badge>
        </sp-stack>
        <sp-grid columns='3' gap='md'>
          <sp-card><p>Grid item 1</p></sp-card>
          <sp-card><p>Grid item 2</p></sp-card>
          <sp-card><p>Grid item 3</p></sp-card>
        </sp-grid>
      </sp-section>
    </sp-container>
  </section>
`;

render(template, document.body);
