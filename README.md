# @phcdevworks/spectre-components

[![GitHub issues](https://img.shields.io/github/issues/phcdevworks/spectre-components)](https://github.com/phcdevworks/spectre-components/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/phcdevworks/spectre-components)](https://github.com/phcdevworks/spectre-components/pulls)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-components)](LICENSE)

`@phcdevworks/spectre-components` is the Lit-based component layer of the
Spectre suite.

Maintained by PHCDevworks, it turns Spectre tokens and Spectre UI contracts
into reusable, accessible, framework-agnostic web components. It is the
canonical component implementation layer for Spectre, built on platform
standards and designed to be consumed directly or wrapped later by adapter
packages.

## Key capabilities

- Ships reusable web components implemented with Lit
- Consumes `@phcdevworks/spectre-tokens` as the source of visual meaning
- Consumes `@phcdevworks/spectre-ui` as the styling contract layer
- Keeps component delivery framework-agnostic through custom elements
- Builds accessibility into the initial component patterns
- Exposes a small, explicit API surface suitable for long-term growth

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
```

Register only the button when you want a narrower entry point:

```ts
import { defineSpectreButton } from "@phcdevworks/spectre-components/button";

defineSpectreButton();
```

Register only the input when you want the input-only entry point:

```ts
import { defineSpectreInput } from "@phcdevworks/spectre-components/input";

defineSpectreInput();
```

## What this package owns

- Lit-based web component implementation for Spectre
- Accessible component behavior and DOM structure
- Public custom element registration helpers
- Component-level TypeScript APIs for future adapters to build on

Golden rule: implement components from Spectre contracts, do not redefine those
contracts locally.

## What this package does not own

- Design-token values or semantic visual meaning That belongs to
  [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens).
- CSS utilities, class recipes, or styling contracts That belongs to
  [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui).
- Framework adapters such as React, Vue, Astro, or app-specific wrappers Those
  belong in downstream adapter packages.
- Routing, shell logic, manifest behavior, or startup orchestration Those are
  outside the scope of this package.

## Package exports / API surface

### Root package

`@phcdevworks/spectre-components` exports:

- `defineSpectreComponents()`
- `defineSpectreButton()`
- `defineSpectreInput()`
- `SpectreButtonElement`
- `SpectreInputElement`
- `spectreButtonVariants`
- `spectreButtonSizes`
- `spectreButtonTypes`
- `spectreInputTypes`
- `spectreInputSizes`
- `SpectreButtonProps` and related button types
- `SpectreInputProps` and related input types

### Button entry point

`@phcdevworks/spectre-components/button` exports the button-only API so
consumers can register a single component without importing the full package
entry.

### Input entry point

`@phcdevworks/spectre-components/input` exports the input-only API so
consumers can register just `sp-input` when they do not need the broader
component bundle.

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

## Current foundation

This v0 foundation includes:

- a publishable TypeScript package build
- root and subpath exports
- a Lit-based `sp-button` starter component
- a Lit-based `sp-input` foundation component
- explicit registration helpers instead of implicit global side effects
- Vitest coverage for baseline rendering and accessibility behavior

## Development

Install dependencies, then run the package checks:

```bash
npm run build
npm test
npm run lint
```

Key source areas:

- `src/components/` for custom elements
- `src/index.ts` for the root public API
- `tests/` for component behavior coverage

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
