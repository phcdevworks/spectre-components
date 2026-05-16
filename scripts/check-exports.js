// Validates that every documented subpath export resolves and exposes the
// expected registration functions and element classes after a build.
// Run via: npm run check:exports  (requires dist/ to exist)

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** @type {Array<[string, string[]]>} */
const CHECKS = [
  ['dist/index.js', ['defineSpectreComponents']],
  ['dist/button.js', ['defineSpectreButton', 'SpectreButtonElement']],
  ['dist/input.js', ['defineSpectreInput', 'SpectreInputElement', 'spectreInputSizes', 'spectreInputTypes']],
  ['dist/textarea.js', ['defineSpectreTextarea', 'SpectreTextareaElement']],
  ['dist/select.js', ['defineSpectreSelect', 'SpectreSelectElement']],
  ['dist/checkbox.js', ['defineSpectreCheckbox', 'SpectreCheckboxElement']],
  ['dist/radio.js', ['defineSpectreRadio', 'SpectreRadioElement']],
  ['dist/label.js', ['defineSpectreLabel', 'SpectreLabelElement']],
  ['dist/fieldset.js', ['defineSpectreFieldset', 'SpectreFieldsetElement']],
];

let passed = 0;
let failed = 0;

for (const [relPath, expectedExports] of CHECKS) {
  const absPath = join(root, relPath);
  let mod;

  try {
    mod = await import(absPath);
  } catch (err) {
    console.error(`FAIL  ${relPath}: could not import — ${err.message}`);
    failed++;
    continue;
  }

  for (const name of expectedExports) {
    if (mod[name] !== undefined) {
      console.log(`  ok  ${relPath}: ${name}`);
      passed++;
    } else {
      console.error(`FAIL  ${relPath}: missing export "${name}"`);
      failed++;
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
