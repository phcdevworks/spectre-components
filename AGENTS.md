# Spectre Components Agent Guide

## Repository Snapshot

| Field | Value |
|-------|-------|
| Project team | `project-design` |
| Repository role | Spectre L3a Lit web component layer |
| Package/artifact | `@phcdevworks/spectre-components` |
| Validation gate | `npm run check` |

## Standard Authority Model

| Agent | Role | Authority |
|-------|------|-----------|
| Claude Code | Lead implementation and validation | [CLAUDE.md](CLAUDE.md) |
| OpenAI Codex | Documentation, release readiness, stabilization, and repo hygiene | [CODEX.md](CODEX.md) |
| ChatGPT | Strategy, coordination, prompt design, and external review | Support only |
| GitHub Copilot | Development assistance | [COPILOT.md](COPILOT.md) |
| Google Jules | Bounded automated maintenance | [JULES.md](JULES.md) |

Bradley Potts holds final authority for commits, merges, tags, publishing, and
releases.

## Standard Handoff

Every AI-prepared change should report files changed, validation performed,
public behavior or contract impact, and unresolved risks. Do not edit generated
outputs directly. Do not update [CHANGELOG.md](CHANGELOG.md) unless the change
is release-relevant.

This repository is maintained by PHCDevworks and contains the Lit-based web
component package of the Spectre system.

## Human Approval Boundaries

Component tag names (`sp-*`), public properties, events, slots, exports, and
accessibility behavior are protected contracts. Removing or renaming any of
these, switching a component from light DOM to Shadow DOM, or adding a
speculative component without a backing `@phcdevworks/spectre-ui` recipe
requires explicit approval from Bradley Potts before merge. See
[Non-Negotiable Limits](#non-negotiable-limits) for the full list.

## Upstream Requests and Roadmap Self-Expansion

Full directive: project-team [AGENTS.md](../AGENTS.md) "Upstream Requests and
Roadmap Self-Expansion." Applied to this repo:

- This repo is L3a — its upstream is `spectre-ui` (and transitively
  `spectre-tokens`). If a component needs a recipe, class, or token value that
  doesn't exist upstream, append the request to `spectre-ui/TODO.md` under
  `## Requested by Downstream`, dated, with the reason and a link back to this
  repo's own TODO.md/ROADMAP.md. Never recreate the recipe locally instead.
- There is no known downstream consumer of this repo within the workspace yet.
  If one appears, it should append requests to this repo's own `TODO.md` under
  `## Requested by Downstream`, kept visible and separate from self-planned
  component work.
- This repo's own [ROADMAP.md](ROADMAP.md) may be proactively expanded with new
  or reordered phases by the agent's own analysis — but never mark a phase
  delivered without `npm run check` passing, and never add a speculative new
  component without a backing recipe already published in `spectre-ui`.
- Surface any new TODO request or roadmap expansion in the handoff for Bradley
  Potts in the same change it was made, and reflect cross-repo-relevant
  changes in the project-team's own ROADMAP.md/TODO.md.

## Shared Source Rules

These rules apply to every agent without exception.

| Path                                           | Status                  | Notes                                                                                       |
| ---------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `src/components/`                              | **May edit**            | Lit custom element implementations, public props, slots, events, and accessibility behavior |
| `src/utils/`                                   | **May edit**            | Shared component utilities; keep abstractions proven and small                              |
| `src/index.ts`, `src/components/index.ts`      | **May edit carefully**  | Public registration and export contract                                                     |
| `tests/`                                       | **May edit**            | Keep behavior and accessibility coverage aligned with source                                |
| `scripts/`                                     | **May edit**            | Validation tooling such as export checks                                                    |
| `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md` | **May edit**            | Keep public docs and release notes aligned with component contracts                         |
| `package.json`, `tsup.config.ts`               | **May edit carefully**  | Required when public entry points change                                                    |
| `dist/`, `dist_verify/`                        | **Never edit directly** | Generated build output; regenerate via `npm run build`                                      |
| `spectre.manifest.json`                        | **May edit**            | Update when exports, Spectre dependencies, or stability change                              |
| Component tag names (`sp-*`)                   | **Protected**           | Require explicit Bradley Potts approval and a breaking-change path                          |

Full validation command: `npm run check`.

Detailed implementation procedure lives in `CLAUDE.md`. Codex release and
documentation workflow lives in `CODEX.md`. Human contribution workflow lives in
`CONTRIBUTING.md`. Consumer-facing usage belongs in `README.md`.

## Agent-Specific Guides

- `CLAUDE.md` - primary development authority and implementation workflow.
- `CODEX.md` - documentation, release, stabilization, validation review, and
  handoff workflow.
- `JULES.md` - bounded automated maintenance and commit workflow.
- `COPILOT.md` and `.github/copilot-instructions.md` - support-assistant
  workflow.

## Pull Request Creation

Every agent that opens a PR must populate every section of the repo's PR
template (`.github/pull_request_template.md`):

- **Linked issue** - issue number (`#N`) or `N/A`.
- **Summary of changes** - one or two bullets describing what changed.
- **Component API change type** - exactly one of `additive`,
  `behavioral change`, `breaking`, or `N/A`.
- **Type of Change** - check every box that applies.
- **Checklist** - check each completed item; leave blocked items unchecked with
  a brief inline note.

Never submit a PR with an empty body or only the template headings left
unfilled. CodeRabbit's description check blocks such PRs.

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
6. Keep this package framework-agnostic through standards-based web components.
7. Build accessibility into the default component behavior and structure.
8. Prefer small, production-ready component patterns over speculative
   abstractions or premature shared infrastructure.
9. Avoid app shell logic, routing, manifest behavior, startup orchestration, or
   framework adapters in this repository.
10. Treat component tags, public properties, events, slots, exports, and
    accessibility behavior as stable contracts that should not change casually.
11. All `scripts/` tooling is TypeScript (`.ts`); never add a new `.js`/`.mjs`
    script. Run via `node --experimental-strip-types scripts/<name>.ts`.

## Working Boundaries

- Design values and semantic meaning belong in `@phcdevworks/spectre-tokens`.
- CSS utilities, Tailwind helpers, and class recipes belong in
  `@phcdevworks/spectre-ui`.
- Lit-based custom element implementation belongs here.
- Framework adapters may wrap these components downstream, but adapters are out
  of scope in this package.
- App-specific shells, dashboards, routing, service workers, manifests, and
  startup orchestration are out of scope.

## Current Components

| Tag              | Element class               | Entry point                                   |
| ---------------- | --------------------------- | --------------------------------------------- |
| `sp-button`      | `SpectreButtonElement`      | `@phcdevworks/spectre-components/button`      |
| `sp-input`       | `SpectreInputElement`       | `@phcdevworks/spectre-components/input`       |
| `sp-textarea`    | `SpectreTextareaElement`    | `@phcdevworks/spectre-components/textarea`    |
| `sp-select`      | `SpectreSelectElement`      | `@phcdevworks/spectre-components/select`      |
| `sp-checkbox`    | `SpectreCheckboxElement`    | `@phcdevworks/spectre-components/checkbox`    |
| `sp-radio`       | `SpectreRadioElement`       | `@phcdevworks/spectre-components/radio`       |
| `sp-label`       | `SpectreLabelElement`       | `@phcdevworks/spectre-components/label`       |
| `sp-fieldset`    | `SpectreFieldsetElement`    | `@phcdevworks/spectre-components/fieldset`    |
| `sp-badge`       | `SpectreBadgeElement`       | `@phcdevworks/spectre-components/badge`       |
| `sp-card`        | `SpectreCardElement`        | `@phcdevworks/spectre-components/card`        |
| `sp-icon-box`    | `SpectreIconBoxElement`     | `@phcdevworks/spectre-components/icon-box`    |
| `sp-rating`      | `SpectreRatingElement`      | `@phcdevworks/spectre-components/rating`      |
| `sp-testimonial` | `SpectreTestimonialElement` | `@phcdevworks/spectre-components/testimonial` |
| `sp-alert`       | `SpectreAlertElement`       | `@phcdevworks/spectre-components/alert`       |
| `sp-avatar`      | `SpectreAvatarElement`      | `@phcdevworks/spectre-components/avatar`      |
| `sp-spinner`     | `SpectreSpinnerElement`     | `@phcdevworks/spectre-components/spinner`     |
| `sp-tag`         | `SpectreTagElement`         | `@phcdevworks/spectre-components/tag`         |
| `sp-pricing-card` | `SpectrePricingCardElement` | `@phcdevworks/spectre-components/pricing-card` |

## Core Component Contract

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

## Non-Negotiable Limits

The following are unconditional. No agent may override them without explicit
approval from Bradley Potts recorded in a commit message or PR description.

- Do not add app-specific components such as page headers, sidebars, navigation
  shells, dashboards, or any component tied to a specific application rather
  than a design primitive.
- Do not add framework-only code. No JSX files, Vue SFCs, Astro components, or
  Svelte files. This package exports web components only.
- Do not add routing, shell coordination, manifest behavior, service workers, or
  app initialization logic.
- Do not add speculative new components without a backing recipe in
  `@phcdevworks/spectre-ui` and explicit approval.
- Do not hardcode colors, spacing, shadows, border-radius, or any visual
  primitive. All visual decisions come from `@phcdevworks/spectre-tokens` and
  `@phcdevworks/spectre-ui`.
- Do not redefine token meaning or semantic roles locally.
- Do not recreate CSS class recipes that already exist in
  `@phcdevworks/spectre-ui`.
- Do not switch any component from light DOM to Shadow DOM. Light DOM is the
  intentional rendering contract for consuming shared Spectre styles.
- Do not introduce speculative base classes or abstraction layers without
  repeated proven need across at least three components.
- Do not remove or weaken the `npm run check` gate.
- Do not change a component tag name (`sp-button`, `sp-input`, etc.).
- Do not remove or rename a public property, event, slot, accessibility
  behavior, or exported symbol without a semver major version bump.
- Do not edit `dist/` or `dist_verify/` by hand.

## Validation Flow

1. Update component source, tests, docs, and package metadata as needed.
2. Run focused checks while developing (`npm run lint`, `npm run typecheck`,
   `npm test`, or `npm run build` as appropriate).
3. Run `npm run check` before handoff.
4. Update `CHANGELOG.md` under `[Unreleased]` for every non-trivial public
   change.
5. Validate example or sandbox usage if the component API changed.

## Ecosystem Manifest

`spectre.manifest.json` at the root is this package's declaration in the Spectre
ecosystem contract, validated by `@phcdevworks/spectre-manifest`. It records role,
layer, exports, and allowed Spectre dependency targets. `check:ecosystem` validates
it as part of `npm run check`.

Keep `spectre.manifest.json` in sync when:
- Package exports in `package.json` are added or removed
- A Spectre package dependency is added or removed
- The package stability changes

Do not add a `consumers` field — that belongs in the central
`@phcdevworks/spectre-manifest` registry.
