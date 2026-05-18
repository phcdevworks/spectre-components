# Spectre Components Agent Guide

## Primary AI Developer

**Claude Code** (`claude-sonnet-4-6`) is the designated primary AI developer for
this repository, maintained on behalf of Bradley Potts
(brad.potts@coastdigitalgroup.com) at PHCDevworks. All development is driven
through Claude Code operating from `CLAUDE.md` as the authoritative working
guide. Human final review and commit authority rests with Bradley Potts.

Claude Code does not create git commits. Changes are prepared and validated,
then handed off for human review and commit.

See [CLAUDE.md](CLAUDE.md) for the full maintenance reference.

## AI Operating Model

This repository follows the Spectre AI factory model:

| Agent | Role | Authority |
| ----- | ---- | --------- |
| Claude Code | Lead developer responsible for primary implementation | `CLAUDE.md` |
| OpenAI Codex | Documentation, releases, production stabilization, repo hygiene, and config standardization | `CODEX.md` |
| GitHub Copilot | General development assistance | `COPILOT.md` and `.github/copilot-instructions.md` |
| Google Jules | Automated maintenance for small fixes, dependency updates, and micro-updates | `JULES.md` |

Claude Code keeps implementation leadership. Codex keeps release and
stabilization work clean. Copilot assists without owning decisions. Jules may
only take small, bounded maintenance tasks when configured for this repository.

## Codex Release Agent

**Codex** works as the documentation, release-readiness, production
stabilization, repo hygiene, and config standardization agent. Claude Code
continues to lead implementation from `CLAUDE.md`; Codex keeps production
readiness, documentation consistency, API stability, and validation in check.

Codex operates from [CODEX.md](CODEX.md) and the companion review checklists:

- [CODEX_REVIEW_CHECKLIST.md](CODEX_REVIEW_CHECKLIST.md)
- [CODEX_RELEASE_CHECKLIST.md](CODEX_RELEASE_CHECKLIST.md)

Codex does not create git commits unless Bradley Potts explicitly asks for a
commit. Release handoff still requires human review.

## GitHub Copilot Support Agent

**GitHub Copilot** works as the repository's general development assistance
agent. Claude Code continues to lead implementation, Codex continues to provide
release and stabilization oversight, and Copilot supports day-to-day editing,
GitHub-integrated review workflows, targeted refactor assistance, and
documentation synchronization.

Copilot operates from `COPILOT.md`, `.github/copilot-instructions.md`, any
scoped files in `.github/instructions/`, and reusable prompts in
`.github/prompts/`.

Copilot does not create git commits unless Bradley Potts explicitly asks for a
commit.

## Google Jules Maintenance Agent

**Google Jules** is reserved for automated maintenance: small fixes, dependency
updates, generated-output synchronization, and micro-updates. Jules must stay
within the task prompt, avoid feature ownership, and defer architectural or
release decisions to Claude Code, Codex, and Bradley Potts.

## Mission

Turn Spectre tokens and Spectre UI contracts into reusable, accessible,
framework-agnostic web components without redefining the underlying design
rules.

## Core Rules

1. Use Lit for component implementation.
2. Treat `@phcdevworks/spectre-tokens` as the source of visual meaning.
3. Treat `@phcdevworks/spectre-ui` as the styling contract layer.
4. Do not recreate token values locally.
5. Do not hardcode hex colors, spacing systems, shadows, or other visual
   primitives that should come from Spectre.
6. Keep this package framework-agnostic through standards-based web
   components.
7. Build accessibility into the default component behavior and structure.
8. Prefer small, production-ready component patterns over speculative
   abstractions or premature shared infrastructure.
9. Avoid app shell logic, routing, manifest behavior, startup orchestration, or
   framework adapters in this repository.
10. Treat component tags, public properties, events, slots, and accessibility
    behavior as stable contracts that should not change casually.

## Working Boundaries

- Design values and semantic meaning belong in `@phcdevworks/spectre-tokens`.
- CSS utilities, Tailwind helpers, and class recipes belong in
  `@phcdevworks/spectre-ui`.
- Lit-based custom element implementation belongs here.
- Framework adapters may wrap these components downstream, but adapters are out
  of scope in this package.

## Current Components

| Tag           | Element class            | Entry point                   |
| ------------- | ------------------------ | ----------------------------- |
| `sp-button`   | `SpectreButtonElement`   | `@phcdevworks/spectre-components/button`   |
| `sp-input`    | `SpectreInputElement`    | `@phcdevworks/spectre-components/input`    |
| `sp-textarea` | `SpectreTextareaElement` | `@phcdevworks/spectre-components/textarea` |
| `sp-select`   | `SpectreSelectElement`   | `@phcdevworks/spectre-components/select`   |
| `sp-checkbox` | `SpectreCheckboxElement` | `@phcdevworks/spectre-components/checkbox` |
| `sp-radio`    | `SpectreRadioElement`    | `@phcdevworks/spectre-components/radio`    |
| `sp-label`    | `SpectreLabelElement`    | `@phcdevworks/spectre-components/label`    |
| `sp-fieldset` | `SpectreFieldsetElement` | `@phcdevworks/spectre-components/fieldset` |

## Implementation Notes

- Prefer consuming `@phcdevworks/spectre-ui` recipe APIs over recreating class
  composition logic inside components.
- Keep the public API explicit through root and subpath exports.
- Prefer explicit registration helpers over implicit global side effects.
- Keep component files intentional and easy to scale: one component directory
  per element, with its own types and entry point when needed.
- All components render in light DOM so the global `@phcdevworks/spectre-ui`
  styling contract applies directly without Shadow DOM piercing.
- `SpectreBaseElement` handles attribute proxying for `id`, `title`, and ARIA
  attributes so they forward to the native element rather than staying on the
  host.
- `SpectreProjectableElement` handles light-DOM content projection for
  components that need to slot external markup into their native element.

## Rendering Guidance

- Default to the rendering strategy that best preserves the
  `@phcdevworks/spectre-ui` styling contract.
- If a component renders in light DOM to consume shared Spectre styles
  directly, treat that as an intentional architectural decision.
- Do not switch between light DOM and Shadow DOM casually; treat rendering
  boundary changes as design-system-level decisions.

## AI Hard Limits

The following are unconditional — no agent may override them without explicit
approval from Bradley Potts recorded in a commit message or PR description.

**Scope limits**
- Do not add app-specific components (page headers, sidebars, navigation
  shells, dashboards, or any component whose purpose is tied to a specific
  application rather than a design primitive).
- Do not add framework-only code. No JSX files, no Vue SFCs, no Astro
  components, no Svelte files. This package exports web components only.
- Do not add routing, shell coordination, manifest behavior, service workers,
  or app initialization logic.
- Do not add speculative new components without a backing recipe in
  `@phcdevworks/spectre-ui` and explicit approval.

**Design system limits**
- Do not hardcode colors, spacing, shadows, border-radius, or any visual
  primitive. All visual decisions come from `@phcdevworks/spectre-tokens` and
  `@phcdevworks/spectre-ui`.
- Do not redefine token meaning or semantic roles locally.
- Do not recreate CSS class recipes that already exist in
  `@phcdevworks/spectre-ui`.

**Architecture limits**
- Do not switch any component from light DOM to Shadow DOM. Light DOM is the
  intentional rendering contract for consuming shared Spectre styles.
- Do not introduce speculative base classes or abstraction layers without
  repeated proven need across at least three components.
- Do not remove or weaken the `npm run check` gate (lint → typecheck → test →
  build → export validation).

**Stability limits**
- Do not change a component tag name (`sp-button`, `sp-input`, etc.) — ever.
  Tags are stable public API.
- Do not remove or rename a public property, event, or exported symbol without
  a semver major version bump.
- Do not edit `dist/` or `dist_verify/` by hand — these are build artifacts.

## Validation Flow

1. Update component source, tests, and package metadata as needed.
2. Run focused checks while developing (`npm run lint`, `npm run typecheck`,
   `npm test`, or `npm run build` as appropriate).
3. Run `npm run check` before handoff.
5. Update `CHANGELOG.md` under `[Unreleased]` for every non-trivial change.
6. Validate example or sandbox usage if the component API changed.
