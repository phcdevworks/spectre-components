import '@phcdevworks/spectre-tokens/index.css'
import '@phcdevworks/spectre-ui/index.css'

import { html, render } from 'lit'
import { defineSpectreComponents } from './src'

defineSpectreComponents()

const template = html`
  <section>
    <h2>sp-button</h2>
    <div class="row">
      <sp-button
        variant="primary"
        title="Submit your data"
        name="submit-btn"
        value="save"
      >
        Button with Title
      </sp-button>
      <sp-button variant="primary" loading loading-label="Processing...">
        Content to be preserved
      </sp-button>
    </div>
  </section>

  <section>
    <h2>sp-input</h2>
    <div class="row">
      <sp-input placeholder="Pill Input" pill></sp-input>
      <sp-input value="Success state" success title="Success input"></sp-input>
      <sp-input value="Loading state" loading title="Loading input"></sp-input>
    </div>
  </section>

  <section>
    <h2>sp-select</h2>
    <div class="row">
      <sp-select name="plan">
        <option value="free">Free</option>
        <option value="pro" selected>Pro</option>
      </sp-select>
      <sp-select name="state" invalid>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </sp-select>
      <sp-select name="size" loading>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
      </sp-select>
    </div>
  </section>

  <section>
    <h2>sp-textarea</h2>
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

  <section>
    <h2>sp-label</h2>
    <div class="row">
      <sp-label for="verification-name">Project name</sp-label>
      <sp-input id="verification-name" value="Spectre Components"></sp-input>
    </div>
  </section>

  <section>
    <h2>sp-checkbox</h2>
    <div class="row">
      <sp-checkbox label="Accept terms" name="terms"></sp-checkbox>
      <sp-checkbox label="Subscribe to updates" checked></sp-checkbox>
      <sp-checkbox label="Required option" invalid required></sp-checkbox>
      <sp-checkbox>
        <span>Accept <strong>Rich Terms</strong></span>
      </sp-checkbox>
    </div>
  </section>

  <section>
    <h2>sp-radio</h2>
    <div class="row">
      <sp-radio label="Free" name="plan" value="free"></sp-radio>
      <sp-radio label="Pro" name="plan" value="pro" checked></sp-radio>
      <sp-radio label="Enterprise" name="plan" value="enterprise"></sp-radio>
      <sp-radio name="plan" value="rich">
        <span>Custom <strong>Pro</strong> Plan</span>
      </sp-radio>
    </div>
  </section>

  <section>
    <h2>sp-fieldset</h2>
    <sp-fieldset legend="Contact preferences" aria-describedby="contact-help">
      <div class="row">
        <sp-checkbox label="Email updates" name="contact-email"></sp-checkbox>
        <sp-checkbox label="Product news" name="contact-news"></sp-checkbox>
      </div>
      <p id="contact-help">Choose how you would like to hear from us.</p>
    </sp-fieldset>

    <sp-fieldset legend="  ">
      <p>
        This fieldset has a whitespace legend and should not render a legend
        tag.
      </p>
    </sp-fieldset>

    <sp-fieldset legend="Autofocus Fieldset" autofocus>
      <p>This fieldset should have autofocus.</p>
    </sp-fieldset>
  </section>

  <section>
    <h2>sp-badge</h2>
    <div class="row">
      <sp-badge variant="primary">New</sp-badge>
      <sp-badge variant="danger">3</sp-badge>
      <sp-badge variant="success" loading>Syncing</sp-badge>
    </div>
  </section>

  <section>
    <h2>sp-tag</h2>
    <div class="row">
      <sp-tag>Default</sp-tag>
      <sp-tag variant="success">Active</sp-tag>
      <sp-tag aria-label="Featured item">Featured</sp-tag>
    </div>
  </section>

  <section>
    <h2>sp-card / sp-pricing-card</h2>
    <div class="row">
      <sp-card>
        <h3>Card title</h3>
        <p>Card body content.</p>
      </sp-card>
      <sp-card interactive>
        <h3>Interactive card</h3>
        <a href="#">View details</a>
      </sp-card>
      <sp-pricing-card>
        <h3>Pro plan</h3>
        <p>$19/mo</p>
      </sp-pricing-card>
    </div>
  </section>

  <section>
    <h2>sp-alert</h2>
    <div class="row">
      <sp-alert variant="info">Heads up — this is an alert.</sp-alert>
      <sp-alert variant="danger">Something went wrong.</sp-alert>
    </div>
  </section>

  <section>
    <h2>sp-testimonial</h2>
    <div class="row">
      <sp-testimonial>
        <blockquote>Great product.</blockquote>
        <cite>Jane Doe</cite>
      </sp-testimonial>
    </div>
  </section>

  <section>
    <h2>sp-avatar / sp-icon-box / sp-rating / sp-spinner</h2>
    <div class="row">
      <sp-avatar aria-label="Bradley Potts">BP</sp-avatar>
      <sp-icon-box aria-label="Feature icon">
        <svg width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </sp-icon-box>
      <sp-rating></sp-rating>
      <sp-rating value="4" label="4 out of 5 stars"></sp-rating>
      <sp-spinner></sp-spinner>
    </div>
  </section>

  <section>
    <h2>Layout: sp-container / sp-grid / sp-section / sp-stack</h2>
    <sp-container max-width="prose">
      <sp-section>
        <sp-stack direction="horizontal" align="center">
          <sp-badge variant="primary">A</sp-badge>
          <sp-badge variant="secondary">B</sp-badge>
          <sp-badge variant="success">C</sp-badge>
        </sp-stack>
        <sp-grid columns="3" gap="md">
          <sp-card><p>Grid item 1</p></sp-card>
          <sp-card><p>Grid item 2</p></sp-card>
          <sp-card><p>Grid item 3</p></sp-card>
        </sp-grid>
      </sp-section>
    </sp-container>
  </section>

  <section>
    <h2>sp-text</h2>
    <sp-text level="h1">Heading 1</sp-text>
    <sp-text level="h2">Heading 2</sp-text>
    <sp-text level="p">Default paragraph text</sp-text>
    <sp-text level="span" variant="muted">Muted inline text</sp-text>
    <sp-text variant="brand" size="lg">Brand-colored large text</sp-text>
    <sp-text family="mono" size="sm">Monospace small text</sp-text>
  </section>

  <section>
    <h2>sp-nav / sp-nav-item</h2>
    <sp-nav aria-label="Primary navigation" bordered>
      <sp-nav-item href="#home">Home</sp-nav-item>
      <sp-nav-item href="#about">About</sp-nav-item>
      <sp-nav-item dropdown label="Products">
        <a href="#components">Components</a>
        <a href="#tokens">Tokens</a>
      </sp-nav-item>
    </sp-nav>
  </section>

  <section>
    <h2>sp-sidebar / sp-sidebar-toggle</h2>
    <sp-sidebar-toggle for="verification-sidebar"></sp-sidebar-toggle>
    <sp-sidebar id="verification-sidebar" hide-toggle>
      <a href="#dashboard">Dashboard</a>
      <a href="#settings">Settings</a>
    </sp-sidebar>
  </section>

  <section>
    <h2>sp-alert (dismissible / icon)</h2>
    <sp-alert variant="brand" dismissible>
      <svg slot="icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" />
      </svg>
      A new version is available.
    </sp-alert>
  </section>

  <section>
    <h2>sp-tabs / sp-tab-panel</h2>
    <sp-tabs aria-label="Account settings">
      <sp-tab-panel label="Profile">Profile settings</sp-tab-panel>
      <sp-tab-panel label="Security">Security settings</sp-tab-panel>
      <sp-tab-panel label="Billing" disabled>Billing settings</sp-tab-panel>
    </sp-tabs>
    <sp-tabs variant="pill" vertical aria-label="Vertical pills">
      <sp-tab-panel label="One">First panel</sp-tab-panel>
      <sp-tab-panel label="Two">Second panel</sp-tab-panel>
    </sp-tabs>
  </section>

  <section>
    <h2>sp-accordion / sp-accordion-item</h2>
    <sp-accordion data-verify="accordion">
      <sp-accordion-item label="Shipping" open
        >Ships in 2 days.</sp-accordion-item
      >
      <sp-accordion-item label="Returns">30 day returns.</sp-accordion-item>
      <sp-accordion-item label="Warranty" disabled>One year.</sp-accordion-item>
    </sp-accordion>
  </section>

  <section>
    <h2>sp-breadcrumb</h2>
    <sp-breadcrumb data-verify="breadcrumb">
      <a href="#home">Home</a>
      <a href="#library">Library</a>
      <span>Data</span>
    </sp-breadcrumb>
  </section>

  <section>
    <h2>sp-list-group / sp-list-group-item</h2>
    <sp-list-group
      data-verify="list-group"
      accent="left"
      aria-label="Mailboxes"
    >
      <sp-list-group-item href="#inbox" active>Inbox</sp-list-group-item>
      <sp-list-group-item interactive>Archive</sp-list-group-item>
      <sp-list-group-item interactive disabled>Spam</sp-list-group-item>
    </sp-list-group>
  </section>

  <section>
    <h2>sp-offcanvas</h2>
    <sp-offcanvas data-verify="offcanvas" label="Filters" placement="end">
      <p>Filter content</p>
      <sp-button slot="footer" variant="primary">Apply</sp-button>
    </sp-offcanvas>
  </section>

  <section>
    <h2>sp-carousel</h2>
    <sp-carousel data-verify="carousel" aria-label="Featured">
      <sp-card><p>Slide one</p></sp-card>
      <sp-card><p>Slide two</p></sp-card>
      <sp-card><p>Slide three</p></sp-card>
    </sp-carousel>
  </section>

  <section>
    <h2>sp-table</h2>
    <sp-table data-verify="table" striped hoverable aria-label="Team">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ada</td>
            <td>Engineer</td>
          </tr>
          <tr>
            <td>Grace</td>
            <td>Admiral</td>
          </tr>
        </tbody>
      </table>
    </sp-table>
  </section>

  <section>
    <h2>sp-pagination</h2>
    <sp-pagination total="20" page="10"></sp-pagination>
  </section>

  <section>
    <h2>sp-stepper</h2>
    <sp-stepper data-verify="stepper" aria-label="Checkout" current="1">
      <span>Cart</span>
      <span>Shipping</span>
      <span>Payment</span>
    </sp-stepper>
  </section>
  <section>
    <h2>Form controls: sp-switch / sp-range / sp-file-input</h2>
    <sp-switch data-verify="switch" checked>Email alerts</sp-switch>
    <sp-range data-verify="range" aria-label="Volume" value="25"></sp-range>
    <sp-file-input aria-label="Attachment"></sp-file-input>
  </section>

  <section>
    <h2>sp-input-group</h2>
    <sp-input-group data-verify="input-group" aria-label="Handle">
      <span slot="addon">@</span>
      <input aria-label="Username" />
      <button type="button">Check</button>
    </sp-input-group>
  </section>

  <section>
    <h2>sp-choice-card</h2>
    <sp-choice-card name="ship" value="std" checked
      >Standard shipping</sp-choice-card
    >
    <sp-choice-card name="ship" value="exp">Express shipping</sp-choice-card>
  </section>

  <section>
    <h2>sp-progress</h2>
    <sp-progress
      data-verify="progress"
      label="Uploading"
      value="40"
    ></sp-progress>
    <sp-progress
      aria-label="Loading"
      indeterminate
      variant="info"
    ></sp-progress>
  </section>

  <section>
    <h2>sp-popover</h2>
    <sp-popover data-verify="popover" label="Details">
      <span slot="trigger">Info</span>
      <p>Popover body</p>
    </sp-popover>
  </section>

  <section>
    <h2>sp-datepicker</h2>
    <sp-datepicker data-verify="datepicker" value="2026-09-15"></sp-datepicker>
  </section>

  <section>
    <h2>sp-external-auth-button / sp-card-bleed / sp-prose</h2>
    <sp-external-auth-button>Continue with Example</sp-external-auth-button>
    <sp-card>
      <sp-card-bleed edges="top" padded><p>Bleed band</p></sp-card-bleed>
      <p>Card body</p>
    </sp-card>
    <sp-prose
      ><h3>Prose</h3>
      <p>Body with <code>code</code>.</p></sp-prose
    >
  </section>
`

render(template, document.body)
