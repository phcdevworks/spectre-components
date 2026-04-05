import { html, render } from 'lit';
import { defineSpectreButton, defineSpectreInput } from './src';

// Inject styles for better visual verification
const style = document.createElement('style');
style.textContent = `
  body {
    padding: 2rem;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .row {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  /* Mock Spectre UI classes for visual distinction since we don't have the real CSS */
  .sp-btn { border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
  .sp-btn--primary { background: #007bff; color: white; border-color: #0056b3; }
  .sp-btn--pill { border-radius: 50px; }

  .sp-input { border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px; }
  .sp-input--success { border-color: #28a745; background-color: #d4edda; }
  .sp-input--loading { border-color: #ffc107; background-color: #fff3cd; }
  .sp-input--pill { border-radius: 50px; }
`;
document.head.appendChild(style);

defineSpectreButton();
defineSpectreInput();

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
`;

render(template, document.body);
