# CLAUDE.md - Spectre Components

Primary implementation guide for Claude Code. Read this before making source
changes.

## Project Identity

- **Package:** `@phcdevworks/spectre-components`
- **Layer:** L3 of the Spectre design suite - Lit-based web component delivery
- **Human owner:** Bradley Potts
- **Primary AI developer:** Claude Code (`claude-sonnet-4-6`)

`AGENTS.md` is the shared guide for agent roles, edit boundaries, validation, PR
requirements, and non-negotiable package boundaries. This file only covers
Claude Code's implementation workflow.

## Commit Policy

Claude Code does not create git commits in this repository. Prepare changes, run
validation, and leave staging, committing, tagging, and pushing to human review.

## Implementation Authority

Claude Code is the lead implementation authority for component behavior,
accessibility, package contracts, and architecture. Resolve implementation
conflicts by referencing this file, the source code, tests, `package.json`, and
`AGENTS.md`.

## What This Repository Is

`@phcdevworks/spectre-components` turns Spectre tokens and Spectre UI styling
contracts into Lit-based custom elements. The package owns component behavior,
native element wiring, accessibility behavior, registration helpers, and public
TypeScript entry points.

Consumer-facing usage belongs in `README.md`. Human contribution workflow
belongs in `CONTRIBUTING.md`. Shared agent policy belongs in `AGENTS.md`.

## Stack

| Tool                       | Purpose                                 |
| -------------------------- | --------------------------------------- |
| Lit                        | Custom element implementation           |
| TypeScript                 | Strict typing throughout                |
| tsup                       | ESM + CJS build with declarations       |
| Vitest + happy-dom         | Component behavior tests                |
| ESLint + typescript-eslint | Lint                                    |
| Node                       | Runtime requirement from `package.json` |
| npm                        | Package manager from `package.json`     |

## Architecture

### Utility layer (`src/utils/`)

- `base.ts` - `SpectreBaseElement extends LitElement`. Overrides `id`, `title`,
  `aria-label`, `aria-labelledby`, and `aria-describedby` so they proxy to the
  native element instead of staying on the host.
- `projectable.ts` - `SpectreProjectableElement extends SpectreBaseElement`.
  Adds light-DOM content projection via `MutationObserver`.
- `form.ts` - Allowlists, type guards, and `normalizeInt()` for shared form
  property validation.
- `dom.ts` - `hasMeaningfulContent()` helper used by the projectable base.

### Light DOM rendering

All components render in light DOM (`createRenderRoot() { return this }`) so the
`@phcdevworks/spectre-ui` global styles apply directly. Treat that as an
intentional package contract.

### Component structure

Each component lives in its own directory:

```text
src/components/<name>/
  index.ts
  sp-<name>.ts
```

Every component:

1. Defines a `Spectre<Name>Props` interface for the public property contract.
2. Declares `static properties` for Lit reactivity.
3. Validates and sanitizes properties in `willUpdate()`.
4. Delegates focus and blur to the native element.
5. Exports an idempotent `defineSpectre<Name>(tagName?)` registration helper.

## Commands

```bash
npm run build
npm test
npm run lint
npm run typecheck
npm run check
npm run check:exports
```

Use the shared validation policy in `AGENTS.md` for when to run the full gate.

## Development Workflow

1. Install dependencies with `npm install` or `npm ci`.
2. Make the smallest source, test, and documentation changes needed.
3. Keep source, tests, exports, docs, and changelog entries synchronized when
   public behavior changes.
4. Run focused checks while developing.
5. Run the shared validation gate before handoff when required by `AGENTS.md`.

## Adding a New Component

1. Create `src/components/<name>/sp-<name>.ts`.
2. Extend `SpectreBaseElement` for simple native rendering, or
   `SpectreProjectableElement` when external markup must be projected into a
   native element.
3. Create `src/components/<name>/index.ts` to re-export the class, define
   helper, and public constants or types.
4. Add the component export to `src/components/index.ts`.
5. Add the registration call to `src/index.ts`.
6. Add the subpath entry to `tsup.config.ts` and `package.json` exports.
7. Add behavior and accessibility tests under `tests/`.
8. Update consumer-facing docs and the shared component inventory.
9. Add a `CHANGELOG.md [Unreleased]` entry.

New components require a backing recipe in `@phcdevworks/spectre-ui` and
explicit approval, as defined in `AGENTS.md`.

## Changing an Existing Component

- Treat tag names, public properties, events, slots, exports, and ARIA behavior
  as stable API.
- Preserve native element semantics unless the change is explicitly approved.
- Keep visual behavior downstream of `@phcdevworks/spectre-tokens` and
  `@phcdevworks/spectre-ui`.
- Update tests for changed behavior and documentation for changed public
  surface.

## Release Procedure

1. Move `[Unreleased]` entries under a new `[x.y.z] - YYYY-MM-DD` heading.
2. Bump `version` in `package.json`.
3. Add the comparison link at the bottom of `CHANGELOG.md`.
4. Run the shared validation gate.
5. Hand off to Bradley Potts for review, commit, tag, and publish.

## Key Files

| File                       | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `src/utils/base.ts`        | Attribute proxy base class                           |
| `src/utils/projectable.ts` | Light-DOM projection base class                      |
| `src/utils/form.ts`        | Shared form property allowlists and validators       |
| `src/index.ts`             | Root public API and bulk registration helper         |
| `src/components/index.ts`  | Component export barrel                              |
| `tsup.config.ts`           | Build entry points                                   |
| `package.json`             | Exports map, scripts, engines, version, dependencies |
| `CHANGELOG.md`             | Release history and `[Unreleased]` entries           |

## Code Style

- ES modules throughout, strict TypeScript, no `any`.
- Prettier config: single quotes, no semicolons, trailing commas off, 80-char
  print width.
- No comments unless the why is non-obvious. Never comment what the code does.
- Keep Lit components small, explicit, accessible, and aligned with existing
  component patterns.
