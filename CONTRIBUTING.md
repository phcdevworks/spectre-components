# Contributing to Spectre Components

Thanks for helping improve Spectre Components. This package is the canonical Lit-based web component layer of the Spectre suite — it turns Spectre tokens and Spectre UI contracts into reusable, accessible, framework-agnostic custom elements.

## Spectre Design Philosophy

Spectre is a **specification-driven design system** built on a strict hierarchy:

### 1. @phcdevworks/spectre-tokens (Layer 1 - DNA)

- **Purpose**: Single source of truth for design values (colors, spacing, typography, semantic roles).
- **Rules**: Defines semantic meaning, not UI behavior. Designers own JSON; engineers maintain transforms.

### 2. @phcdevworks/spectre-ui (Layer 2 - The Blueprint)

- **Purpose**: Converts tokens into real CSS and class recipes.
- **Rules**: MUST consume tokens, MUST NOT redefine values. Every CSS selector has a matching recipe.

### 3. @phcdevworks/spectre-components (Layer 3 - Components)

- **Purpose**: Turns Layer 1 and Layer 2 contracts into Lit-based reusable web components.
- **Rules**: Components consume tokens and UI contracts. Never redefine visual primitives locally.

### 4. Framework Adapters (Layer 4 - Delivery)

- **Purpose**: Map components to specific frameworks (WordPress, Astro, etc.).
- **Rules**: Adapters never define styles or duplicate CSS.

> **The Golden Rule**: Tokens define _meaning_. UI defines _structure_. Components define _behavior_. Adapters define _delivery_.

---

## Development Philosophy

### 1. Component Implementation

**Purpose**: Lit-based custom elements that consume Spectre contracts

**Exports**: Custom element registration helpers and TypeScript types

**Rules**:

- Use Lit for all component implementation
- Treat `@phcdevworks/spectre-tokens` as the source of visual meaning
- Treat `@phcdevworks/spectre-ui` as the styling contract layer
- Never hardcode hex colors, spacing, or other visual primitives
- Build accessibility into default component behavior
- All source files must be TypeScript with strict types

### 2. Component API Contract

**Purpose**: Stable public interface for component consumers

**Rules**:

- Keep component tags, properties, events, slots, and ARIA behavior stable
- Prefer explicit registration helpers over implicit global side effects
- Export types alongside runtime code
- Keep each component's public API small and intentional

### 3. Build Configuration

**Purpose**: Compile TypeScript to JavaScript with proper types and subpath exports

**Key mechanism**:

- tsup generates ESM and CJS output with declarations
- Vitest with happy-dom for component behavior testing
- Root and subpath exports per component

**Rules**:

- All source code must compile cleanly
- Follow TypeScript strict mode
- Ship ESM and CJS from `dist/`

### Golden Rule (Non-Negotiable)

**Components consume contracts — they do not define them.**

`@phcdevworks/spectre-components` ships compiled JavaScript + type declarations from `dist/`.

- If it's a design value → belongs in `@phcdevworks/spectre-tokens`
- If it's a CSS recipe or utility → belongs in `@phcdevworks/spectre-ui`
- If it's a Lit web component → belongs here in `src/components/`

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/phcdevworks/spectre-components.git
cd spectre-components
```

2. Install dependencies:

```bash
npm install
```

3. Build and validate the package:

```bash
npm run check
# or run steps individually:
npm run build
npm test
npm run lint
```

## Project Structure

```
spectre-components/
├── src/
│   ├── components/       # One directory per custom element
│   │   ├── button/
│   │   ├── input/
│   │   └── ...
│   └── index.ts          # Root public API
├── tests/                # Vitest component tests
├── dist/                 # Built assets (generated)
├── tsconfig.json
└── package.json
```

**Responsibilities**:

- **Component authors**: Implement custom elements in `src/components/`
- **Test writers**: Cover behavior and accessibility in `tests/`
- **API maintainers**: Update `src/index.ts` and subpath entry points
- **Build engineers**: Update tsup config when export structure changes

## Contribution Guidelines

### Component Development

1. **Consume don't redefine** – Pull from spectre-tokens and spectre-ui; never recreate locally
2. **Accessibility first** – ARIA roles, keyboard nav, and focus behavior are part of the contract
3. **Type everything** – TypeScript strict mode, avoid `any`
4. **Test component behavior** – Rendering, prop handling, and accessibility before committing

### Source File Development

- Use Lit for custom element implementation
- Follow modern ES module patterns
- Keep one component per directory with its own types and entry point
- Export registration helpers, not constructors, as the primary API

### Configuration Changes

- Follow TypeScript best practices
- Keep tsup export entries aligned with package.json exports
- Test that `npm run build` completes cleanly after config changes

### Code Quality

- Run `npm run check` before committing (lint + test + build)
- Avoid `any` — use explicit types or `unknown`
- Keep the public API surface small and explicit

### Documentation

- Update README.md when adding new components or changing the API surface
- Include usage examples for new components
- Document breaking changes in CHANGELOG.md
- Keep inline comments minimal and focused on non-obvious behavior

## Pull Request Process

1. **Branch from `main`**
2. **Make your changes** and test locally (`npm run check`)
3. **Add or update tests** for any component behavior that changed
4. **Update documentation** (README.md, CHANGELOG.md) to reflect changes
5. **Open a PR** describing:
   - The motivation for the change
   - What was changed
   - Testing notes (components tested, accessibility verified)
6. **Respond to feedback** and make requested changes

## Known Gaps (Not Done Yet)

- Full component coverage for all Spectre UI patterns
- Storybook or interactive component preview
- Visual regression testing
- Framework adapter packages (React, Vue, Svelte)
- Server-side rendering support

## Questions or Issues?

Please open an issue or discussion on GitHub if you're unsure about the best approach for a change. Coordinating early avoids conflicts with:

- Component API contract stability
- Token and UI contract ownership boundaries
- Accessibility behavior requirements

## Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
