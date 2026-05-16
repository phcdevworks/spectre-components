# @phcdevworks/spectre-components

[![CI](https://github.com/phcdevworks/spectre-components/actions/workflows/ci.yml/badge.svg)](https://github.com/phcdevworks/spectre-components/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@phcdevworks/spectre-components)](https://www.npmjs.com/package/@phcdevworks/spectre-components)
[![GitHub issues](https://img.shields.io/github/issues/phcdevworks/spectre-components)](https://github.com/phcdevworks/spectre-components/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/phcdevworks/spectre-components)](https://github.com/phcdevworks/spectre-components/pulls)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-components)](LICENSE)

`@phcdevworks/spectre-components` is the **Layer 3** Lit-based web component
package of the Spectre design system. It turns Spectre tokens
(`@phcdevworks/spectre-tokens`) and Spectre UI styling contracts
(`@phcdevworks/spectre-ui`) into reusable, accessible, framework-agnostic
custom elements. It is the canonical component implementation layer for
Spectre — built on platform standards and designed to be consumed directly or
wrapped by downstream adapter packages.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Security Policy](SECURITY.md)

## Key capabilities

- Ships reusable web components implemented with Lit
- Consumes `@phcdevworks/spectre-tokens` as the source of visual meaning
- Consumes `@phcdevworks/spectre-ui` as the styling contract layer
- Keeps component delivery framework-agnostic through custom elements
- Builds accessibility into the initial component patterns
- Exposes a small, explicit API surface suitable for long-term growth

## When to use this package

- You are building UI that consumes the Spectre design system and want
  standards-based, framework-agnostic custom elements.
- You want accessible, typed form controls (`sp-button`, `sp-input`,
  `sp-select`, etc.) without coupling to a specific JavaScript framework.
- You are building a framework adapter (React, Vue, Astro) and need a
  reliable, stable element layer to wrap.

## When not to use this package

- You only need CSS classes or design tokens — use `@phcdevworks/spectre-ui`
  or `@phcdevworks/spectre-tokens` directly instead.
- You need components styled outside the Spectre token/UI contract — do not
  redefine visual primitives inside this package.
- You need framework-specific wrappers or server-side rendering adapters —
  those belong in a downstream adapter package, not here.

## Installation

```bash
npm install @phcdevworks/spectre-components @phcdevworks/spectre-ui @phcdevworks/spectre-tokens
```

## Quick start

Import the Spectre CSS layers first, then register the custom elements you want
to use:

```ts
import "@phcdevworks/spectre-tokens/index.css";
import "@phcdevworks/spectre-ui/index.css";

import { defineSpectreComponents } from "@phcdevworks/spectre-components";

defineSpectreComponents();
```

Use the components in markup:

```html
<sp-button variant="primary" size="md">Save</sp-button>
<sp-button variant="ghost" size="sm">Cancel</sp-button>
<sp-input name="email" type="email" placeholder="Email address"></sp-input>
<sp-textarea name="bio" rows="4" placeholder="Short bio"></sp-textarea>
<sp-select name="role">
  <option value="admin">Admin</option>
  <option value="user">User</option>
</sp-select>
<sp-checkbox name="terms" value="accepted">Accept terms</sp-checkbox>
<sp-radio name="plan" value="monthly">Monthly</sp-radio>
<sp-label for="email">Email address</sp-label>
<sp-fieldset legend="Contact preferences">
  <sp-checkbox name="email-updates">Email updates</sp-checkbox>
</sp-fieldset>
```

Register only what you need using the per-component entry points:

```ts
import { defineSpectreButton } from "@phcdevworks/spectre-components/button";
import { defineSpectreInput } from "@phcdevworks/spectre-components/input";
import { defineSpectreTextarea } from "@phcdevworks/spectre-components/textarea";
import { defineSpectreSelect } from "@phcdevworks/spectre-components/select";
import { defineSpectreCheckbox } from "@phcdevworks/spectre-components/checkbox";
import { defineSpectreRadio } from "@phcdevworks/spectre-components/radio";
import { defineSpectreLabel } from "@phcdevworks/spectre-components/label";
import { defineSpectreFieldset } from "@phcdevworks/spectre-components/fieldset";
```

## What this package owns

- Lit-based web component implementation for Spectre
- Accessible component behavior and DOM structure
- Public custom element registration helpers
- Component-level TypeScript APIs for future adapters to build on

Golden rule: implement components from Spectre contracts, do not redefine those
contracts locally.

## What this package does not own

- Design-token values or semantic visual meaning. That belongs to
  [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens).
- CSS utilities, class recipes, or styling contracts. That belongs to
  [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui).
- Framework adapters such as React, Vue, Astro, or app-specific wrappers. Those
  belong in downstream adapter packages.
- Routing, shell logic, manifest behavior, or startup orchestration. Those are
  outside the scope of this package.

## Package exports / API surface

### Root package

`@phcdevworks/spectre-components` exports everything from all component entry
points plus the `defineSpectreComponents()` bulk registration helper.

**Registration helpers**

- `defineSpectreComponents()` — registers all components at once
- `defineSpectreButton()`, `defineSpectreInput()`, `defineSpectreTextarea()`
- `defineSpectreSelect()`, `defineSpectreCheckbox()`, `defineSpectreRadio()`
- `defineSpectreLabel()`, `defineSpectreFieldset()`

**Element classes**

- `SpectreButtonElement`, `SpectreInputElement`, `SpectreTextareaElement`
- `SpectreSelectElement`, `SpectreCheckboxElement`, `SpectreRadioElement`
- `SpectreLabelElement`, `SpectreFieldsetElement`

**Constants and types (button)**

- `spectreButtonVariants`, `spectreButtonSizes`, `spectreButtonTypes`
- `SpectreButtonVariant`, `SpectreButtonSize`, `SpectreButtonType`
- `SpectreButtonProps`

**Constants and types (input / textarea / select)**

- `spectreInputSizes`, `spectreInputTypes`
- `SpectreInputSize`, `SpectreInputType`
- `SpectreInputProps`, `SpectreTextareaProps`, `SpectreSelectProps`

**Props interfaces (checkbox / radio / label / fieldset)**

- `SpectreCheckboxProps`, `SpectreRadioProps`
- `SpectreLabelProps`, `SpectreFieldsetProps`

### Button entry point

`@phcdevworks/spectre-components/button` — registers only `sp-button`.

Exports: `defineSpectreButton`, `SpectreButtonElement`, `SpectreButtonProps`,
`spectreButtonVariants`, `spectreButtonSizes`, `spectreButtonTypes`,
`SpectreButtonVariant`, `SpectreButtonSize`, `SpectreButtonType`.

### Input entry point

`@phcdevworks/spectre-components/input` — registers only `sp-input`.

Exports: `defineSpectreInput`, `SpectreInputElement`, `SpectreInputProps`,
`spectreInputSizes`, `spectreInputTypes`, `SpectreInputSize`, `SpectreInputType`.

### Textarea entry point

`@phcdevworks/spectre-components/textarea` — registers only `sp-textarea`.

Exports: `defineSpectreTextarea`, `SpectreTextareaElement`, `SpectreTextareaProps`.

Size constants shared with input: import `spectreInputSizes` / `SpectreInputSize`
from `@phcdevworks/spectre-components/input`.

### Select entry point

`@phcdevworks/spectre-components/select` — registers only `sp-select`.

Exports: `defineSpectreSelect`, `SpectreSelectElement`, `SpectreSelectProps`.

Size constants shared with input: import `spectreInputSizes` / `SpectreInputSize`
from `@phcdevworks/spectre-components/input`.

### Checkbox entry point

`@phcdevworks/spectre-components/checkbox` — registers only `sp-checkbox`.

Exports: `defineSpectreCheckbox`, `SpectreCheckboxElement`, `SpectreCheckboxProps`.

### Radio entry point

`@phcdevworks/spectre-components/radio` — registers only `sp-radio`.

Exports: `defineSpectreRadio`, `SpectreRadioElement`, `SpectreRadioProps`.

### Label entry point

`@phcdevworks/spectre-components/label` — registers only `sp-label`.

Exports: `defineSpectreLabel`, `SpectreLabelElement`, `SpectreLabelProps`.

### Fieldset entry point

`@phcdevworks/spectre-components/fieldset` — registers only `sp-fieldset`.

Exports: `defineSpectreFieldset`, `SpectreFieldsetElement`, `SpectreFieldsetProps`.

## Relationship to the rest of Spectre

Spectre keeps responsibilities separate:

- [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens)
  defines design values and semantic meaning
- [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui)
  provides CSS, Tailwind helpers, recipes, and styling contracts
- `@phcdevworks/spectre-components` turns those layers into Lit-based reusable
  web components

That separation keeps visual meaning centralized, styling contracts stable, and
component behavior reusable across frameworks.

## Components

| Element                  | Tag           | Description                                          |
| ------------------------ | ------------- | ---------------------------------------------------- |
| `SpectreButtonElement`   | `sp-button`   | Button with variant, size, loading, and pill support |
| `SpectreInputElement`    | `sp-input`    | Text input with state, size, and type support        |
| `SpectreTextareaElement` | `sp-textarea` | Multiline text input with resizable rows             |
| `SpectreSelectElement`   | `sp-select`   | Native select with projected option elements         |
| `SpectreCheckboxElement` | `sp-checkbox` | Checkbox with projected or property-based label      |
| `SpectreRadioElement`    | `sp-radio`    | Radio button with projected or property-based label  |
| `SpectreLabelElement`    | `sp-label`    | Accessible label with `for` forwarding               |
| `SpectreFieldsetElement` | `sp-fieldset` | Fieldset group with legend text and slot support     |

## Development

```bash
git clone https://github.com/phcdevworks/spectre-components.git
cd spectre-components
npm install
npm run check        # lint + test + build — the single full validation command
```

Requires Node.js `^22.12.0 || >=24.0.0` and npm `11.14.1`.

| Command | Purpose |
|---------|---------|
| `npm run check` | Full validation (lint + test + build) |
| `npm run build` | Compile ESM + CJS with declarations into `dist/` |
| `npm test` | Run Vitest suite (happy-dom) |
| `npm run lint` | ESLint |
| `npm run dev` | tsup watch mode |
| `npm run clean` | Remove `dist/` and `coverage/` |

Key source areas:

- `src/components/` — one directory per custom element
- `src/index.ts` — root public API and bulk registration helper
- `tests/` — component behavior coverage (Vitest + happy-dom)

## Troubleshooting

**Build fails with type errors** — TypeScript 6 is required. Run
`npm install` to ensure dev dependencies are up to date, then `npm run build`.

**Tests fail in CI but pass locally** — Tests run under happy-dom. Make sure
you are on Node `^22.12.0 || >=24.0.0`. The CI matrix tests both versions.

**Custom element already defined** — Each `defineSpectre*()` helper is
idempotent; calling it twice is safe. If you see "already defined" errors,
check that two different versions of this package are not loaded in the same
page context.

**Styles are not applying** — This package renders in light DOM. The Spectre
CSS layers must be imported before the components are registered:
`@phcdevworks/spectre-tokens/index.css` then
`@phcdevworks/spectre-ui/index.css`.

## Contributing

PHCDevworks maintains this package as part of the Spectre suite.

When contributing:

- treat `@phcdevworks/spectre-tokens` as the source of visual meaning
- treat `@phcdevworks/spectre-ui` as the styling contract layer
- avoid redefining visual primitives locally
- keep components accessible by default
- run `npm run build`, `npm test`, and `npm run lint` before opening a pull
  request

## License

MIT © PHCDevworks. See [LICENSE](LICENSE).
