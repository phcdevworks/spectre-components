# Spectre Components Agent Guide

This repository is maintained by PHCDevworks and contains the Lit-based web
component package of the Spectre system.

## Primary AI Developer

**Claude Code** (`claude-sonnet-4-6`) is the designated primary AI developer for
this repository, maintained on behalf of Bradley Potts at PHCDevworks. All development is driven
through Claude Code operating from `CLAUDE.md` as the authoritative working
guide. Human final review and commit authority rests with Bradley Potts.

Claude Code does not create git commits. Changes are prepared and validated,
then handed off for human review and commit.

## AI Operating Model

This repository follows the Spectre AI factory model:

| Agent          | Role                                                                                                         | Authority                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Claude Code    | Lead developer responsible for primary implementation                                                        | `CLAUDE.md`                                        |
| OpenAI Codex   | Documentation, releases, production stabilization, repo hygiene, and config standardization                  | `CODEX.md`                                         |
| ChatGPT        | Strategy, coordination, prompt design, and external review - support layer only, no implementation ownership | -                                                  |
| GitHub Copilot | General development assistance                                                                               | `COPILOT.md` and `.github/copilot-instructions.md` |
| Google Jules   | Automated maintenance for small fixes, dependency updates, and micro-updates                                 | `JULES.md`                                         |

Claude Code keeps implementation leadership. Codex keeps release and
stabilization work clean. ChatGPT provides strategy and coordination support
only. Copilot assists without owning decisions. Jules may commit bounded
automated maintenance when configured for this repository and when all
validation gates pass.

**Bradley Potts** holds final authority for all commits, merges, tags,
publishing, and releases. No AI agent holds commit authority in this repository
except Jules, which may commit bounded automated maintenance when all Jules
rules pass.

## Shared Edit Boundaries

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

| Tag           | Element class            | Entry point                                |
| ------------- | ------------------------ | ------------------------------------------ |
| `sp-button`   | `SpectreButtonElement`   | `@phcdevworks/spectre-components/button`   |
| `sp-input`    | `SpectreInputElement`    | `@phcdevworks/spectre-components/input`    |
| `sp-textarea` | `SpectreTextareaElement` | `@phcdevworks/spectre-components/textarea` |
| `sp-select`   | `SpectreSelectElement`   | `@phcdevworks/spectre-components/select`   |
| `sp-checkbox` | `SpectreCheckboxElement` | `@phcdevworks/spectre-components/checkbox` |
| `sp-radio`    | `SpectreRadioElement`    | `@phcdevworks/spectre-components/radio`    |
| `sp-label`    | `SpectreLabelElement`    | `@phcdevworks/spectre-components/label`    |
| `sp-fieldset` | `SpectreFieldsetElement` | `@phcdevworks/spectre-components/fieldset` |

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
