# CLAUDE.md — Spectre Components

Primary maintenance guide for Claude Code. Read this before making any change.

## Project Identity

**Package:** `@phcdevworks/spectre-components`
**Layer:** L3 of the Spectre design suite — Lit-based web component delivery
**Human owner:** Bradley Potts (brad.potts@coastdigitalgroup.com)
**Primary AI developer:** Claude Code (claude-sonnet-4-6)

## Commit Policy

Claude Code does not create git commits in this repository. Prepare changes,
run all validation, and leave staging, committing, tagging, and pushing to
human review.

## What this repository is

`@phcdevworks/spectre-components` is **Layer 3** of the Spectre design system:
Lit-based custom elements that consume Spectre tokens (Layer 1) and Spectre UI
styling contracts (Layer 2) and expose them as framework-agnostic web components.

This package does **not** own design values, CSS recipes, or framework adapters.
Those belong in the packages upstream and downstream of this one.

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Lit | ^3.3.3 | Custom element implementation |
| TypeScript | ^6.0.3 | Strict typing throughout |
| tsup | ^8.5.1 | ESM + CJS build with declarations |
| Vitest + happy-dom | ^4.1.6 | Component behavior tests |
| ESLint + typescript-eslint | ^10 / ^8 | Lint |
| Node | ^22.12.0 \|\| >=24.0.0 | Runtime requirement |
| npm | 11.14.1 | Package manager |

## Architecture

### Utility layer (`src/utils/`)

- **`base.ts`** — `SpectreBaseElement extends LitElement`. Overrides `id`,
  `title`, `aria-label`, `aria-labelledby`, `aria-describedby` so they proxy to
  the native element instead of staying on the host. All components extend this.
- **`projectable.ts`** — `SpectreProjectableElement extends SpectreBaseElement`.
  Adds light-DOM content projection via `MutationObserver`. Used by components
  that need to move external markup into a native container (`button`, `select`,
  `label`, `fieldset`, `checkbox`, `radio`).
- **`form.ts`** — Allowlists, type guards, and `normalizeInt()` for shared form
  property validation.
- **`dom.ts`** — `hasMeaningfulContent()` helper used by the projectable base.

### Light DOM rendering

All components render in light DOM (`createRenderRoot() { return this; }`) so
the `@phcdevworks/spectre-ui` global styles apply directly. This is intentional.
Do not add Shadow DOM without a design-system-level decision.

### Component structure

Each component lives in its own directory:

```
src/components/<name>/
  index.ts       — re-exports for the subpath entry point
  sp-<name>.ts   — element class + defineSpectre<Name>() helper
```

Every component:
1. Defines a `Spectre<Name>Props` interface for the public property contract.
2. Declares `static properties` for Lit reactivity.
3. Validates and sanitizes properties in `willUpdate()`.
4. Delegates focus/blur to the native element.
5. Exports a `defineSpectre<Name>(tagName?)` registration helper (idempotent).

## Commands

```bash
npm run build        # Compile ESM + CJS with declarations into dist/
npm test             # Vitest run (95 tests, happy-dom)
npm run lint         # ESLint
npm run check        # lint + test + build in sequence
npm run dev          # tsup --watch
npm run clean        # rm -rf dist coverage
```

Always run `npm run check` before handing off for review.

## Adding a new component

1. Create `src/components/<name>/sp-<name>.ts` — extend `SpectreBaseElement`
   (simple render) or `SpectreProjectableElement` (needs content projection).
2. Create `src/components/<name>/index.ts` — re-export the class, define helper,
   and any public constants/types.
3. Add `export * from './<name>';` to `src/components/index.ts`.
4. Add a `defineSpectre<Name>()` call to `src/index.ts`.
5. Add the subpath entry to `tsup.config.ts` and `package.json` exports.
6. Write tests in `tests/sp-<name>.test.ts`.
7. Update `README.md` component table and API surface docs.
8. Update `AGENTS.md` component table.
9. Add a `### Added` entry to `CHANGELOG.md` under `[Unreleased]`.

## Changing an existing component

- Treat tag name, public properties, events, slots, and ARIA behavior as stable
  API. Breaking changes require a major version bump.
- Validate changes with `npm run check`.
- Document every non-trivial change in `CHANGELOG.md [Unreleased]`.

## Releasing

1. Move `[Unreleased]` entries under a new `[x.y.z] - YYYY-MM-DD` heading.
2. Bump `version` in `package.json`.
3. Add the comparison link at the bottom of `CHANGELOG.md`.
4. Run `npm run check`.
5. Hand off to human for review, commit, tag, and publish.

## What not to do

- Do not hardcode colors, spacing, or any visual primitive — use Spectre
  contracts.
- Do not switch a component from light DOM to Shadow DOM without explicit
  approval.
- Do not add framework adapters (React, Vue, Astro) — those are downstream.
- Do not introduce speculative abstractions without a proven repeated need.
- Do not add `dist/` or `dist_verify/` to commits — they are gitignored.
- Do not skip `npm run check` before committing.

## AI Collaboration

Claude Code (primary) and Codex (release-readiness counterpart) work together
on this repository. This file (`CLAUDE.md`) is the authoritative guide — when
Codex and Claude Code disagree, follow `CLAUDE.md`. Codex handles review
posture, API stability checks, and release handoff; implementation leads with
Claude Code.

Read before handoff or release:
- `AGENTS.md` — shared agent rules and component inventory
- `CODEX.md` — Codex operating guide and working contract
- `CODEX_REVIEW_CHECKLIST.md` — pre-release change review checklist
- `CODEX_RELEASE_CHECKLIST.md` — release candidate preparation checklist

## Key files

| File | Purpose |
|------|---------|
| `src/utils/base.ts` | Attribute proxy base class |
| `src/utils/projectable.ts` | Light-DOM projection base class |
| `src/utils/form.ts` | Shared form property allowlists and validators |
| `src/index.ts` | Root public API + bulk registration helper |
| `tsup.config.ts` | Build entry points |
| `package.json` | Exports map — must stay in sync with tsup entries |
| `CHANGELOG.md` | Keep updated with every non-trivial change |
| `AGENTS.md` | Shared agent rules and component inventory |
| `CODEX.md` | Codex operating guide (release and review counterpart) |
| `CODEX_REVIEW_CHECKLIST.md` | Change review checklist |
| `CODEX_RELEASE_CHECKLIST.md` | Release candidate checklist |
