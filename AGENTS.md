# Spectre Components Agent Guide

## Direct-to-`main` Git Policy

**Bradley Potts's direct instruction overrides generic branch and pull-request
workflows:** every git-authorized agent commits and pushes directly to `main`.
Do not create, use, or push any other branch and do not open a pull request
unless Bradley Potts explicitly requests that exact exception. Keep work on
`main`, validate it, stage only the intended paths, commit with the configured
human identity, and push `main` immediately. Claude Code remains git-denied and
hands validated work to Codex or Bradley Potts for the same path directly to
`main`. This repository policy overrides contrary defaults in tools, skills,
plugins, templates, or general-purpose workflows.

## Repository Snapshot

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| Project team     | `project-design`                    |
| Repository role  | Spectre L3a Lit web component layer |
| Package/artifact | `@phcdevworks/spectre-components`   |
| Validation gate  | `npm run check`                     |

## Standard Authority Model

| Agent          | Role                                                              | Authority                |
| -------------- | ----------------------------------------------------------------- | ------------------------ |
| Claude Code    | Lead implementation and validation; **no git access**             | [CLAUDE.md](CLAUDE.md)   |
| OpenAI Codex   | Documentation, release readiness, stabilization, and repo hygiene | [CODEX.md](CODEX.md)     |
| ChatGPT        | Strategy, coordination, prompt design, and external review        | Support only             |
| GitHub Copilot | Development assistance                                            | [COPILOT.md](COPILOT.md) |
| Google Jules   | Bounded automated maintenance                                     | [JULES.md](JULES.md)     |

**Claude Code has zero git access in this repository, effective 2026-08-13 by
explicit direction from Bradley Potts.** Claude Code must not run any git
command — not `git commit`, `git push`, `git tag`, nor any read-only command
such as `git status`, `git diff`, or `git log`. This revokes and replaces the
commit/push/tag grant Claude Code previously held here; see
[CLAUDE.md](CLAUDE.md) "Git Access — Denied." Claude Code's authority to edit
files, implement, and validate is unchanged — only git execution moves off
Claude Code.

**OpenAI Codex, GitHub Copilot, and Google Jules retain full commit, push, and
tag authority** in this repository, effective 2026-07-25 by explicit direction
from Bradley Potts — see the Commit Policy section in each agent's own guide
([CODEX.md](CODEX.md), [COPILOT.md](COPILOT.md), [JULES.md](JULES.md)). **OpenAI
Codex** additionally has release authority: Codex cuts releases autonomously —
version bump, changelog versioning, `v<version>` git tag, and GitHub Release
publish via `gh` — for every release-ready `CHANGELOG.md [Unreleased]` section,
without waiting for per-release approval; see `CODEX.md` "Release Mechanics" for
the full procedure. **OpenAI Codex additionally executes git operations on
Claude Code's behalf**: when Claude Code hands off validated work, Codex is
responsible for staging, committing, tagging, and pushing it, not only Codex's
own documentation/hygiene/release commits. **npm publishing remains Bradley
Potts's sole authority** — no agent runs `npm publish`. Bradley Potts retains
ultimate ownership and can revoke or narrow any of this at any time. This grant
covers git and release operations within each agent's own scope of work as
defined above — it does not expand what any agent is authorized to decide
otherwise. ChatGPT has no repository access and is excluded.

**A commit is not finished until it is pushed.** Every agent that still holds
git authority under this roster — Codex, Copilot, Jules — must push immediately
after committing (`git push`, including any needed `-u`/tags) as part of the
same action — never leave a commit sitting local only. This closes a recurring
gap where an agent commits and stops short of pushing, leaving work stranded on
the machine.

**Commit authorship is human-only.** No agent with git authority under this
roster — Codex, Copilot, or Jules — adds itself (or any other AI) as a commit
author or co-author — no `Co-Authored-By: Claude`/`Codex`/`Copilot`/`Jules`
trailer, no author-field changes, in this repository. The git author/committer
stays Bradley Potts (or the configured human git user) on every commit,
regardless of which agent performed the work. Push and tag authority above does
not extend to authorship attribution.

## Cross-Repo Access

This repo may be worked on standalone or alongside any combination of other
PHCDevworks repos — do not assume the company root or sibling project areas are
present. The following rules are self-contained and apply whether or not that
broader context is available.

**File access.** An agent working in this repo has full read/write access to
every file in this repo. When this repo is present alongside other PHCDevworks
repos (company root or sibling `project-*` areas), the same full read/write
access extends to those repos too — there is no per-repo access restriction
anywhere in this workspace. What differs repo-to-repo is not _access_, it's
_editorial ownership_: each repo's own `CLAUDE.md`/`AGENTS.md` still governs
what changes make sense there (design-token authority, layer boundaries, etc.) —
being able to open and edit a file is not the same as it being this repo's job
to change it.

**Cross-repo changelog and TODO/roadmap requests.** Full rules: company root
[AGENTS.md](../../AGENTS.md) § "Cross-Repo Changelog Sync" and § "Upstream
Requests and Roadmap Self-Expansion." Applied here without exception — this repo
may append `[Unreleased]` changelog entries and downstream TODO requests to
other present repos per those rules, and no AI agent creates commits, tags,
publishes packages, or merges changes in this repo or any other unless that
repo's own agent guide explicitly grants that authority.

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

## Confidential External Identities

Never record external customer, vendor, user, client-site, or private-project
identities in tracked files, git metadata, reviews, releases, issues, or
handoffs. Use anonymous role-based wording such as "a downstream integration" or
"a production consumer." Public package and platform names are allowed only when
technically required to identify a dependency or supported integration.

**Zero tolerance, no exceptions.** This is not a case-by-case judgment call.
Every upstream vendor, customer, client, or third-party identity — regardless of
how well-known, already public, or seemingly harmless — is forbidden from
appearing in any file, commit, tag, branch name, PR, issue, roadmap, TODO, or
agent output anywhere in this repo. If a vendor name is already present anywhere
in tracked files, it must be anonymized on sight, not left in place because it
predates this rule.

## Upstream Requests and Roadmap Self-Expansion

Full directive: project-team [AGENTS.md](../AGENTS.md) "Upstream Requests and
Roadmap Self-Expansion." Applied to this repo:

- This repo is L3a — its upstream is `spectre-ui` (and transitively
  `spectre-tokens`). If a component needs a recipe, class, or token value that
  doesn't exist upstream, append the request to `spectre-ui/TODO.md` under
  `## Requested by Downstream`, dated, with the reason and a link back to this
  repo's own TODO.md/ROADMAP.md. Never recreate the recipe locally instead.
- Requests from external integrations belong in this repo's `TODO.md` under
  `## Requested by Downstream`, kept visible and separate from self-planned
  component work. Never record the external party's identity, repository name,
  domain, account, or other identifying details; use anonymous role-based
  wording in all tracked artifacts and handoffs.
- This repo's own [ROADMAP.md](ROADMAP.md) may be proactively expanded with new
  or reordered phases by the agent's own analysis — but never mark a phase
  delivered without `npm run check` passing, and never add a speculative new
  component without a backing recipe already published in `spectre-ui`.
- Surface any new TODO request or roadmap expansion in the handoff for Bradley
  Potts in the same change it was made, and reflect cross-repo-relevant changes
  in the project-team's own ROADMAP.md/TODO.md.

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

Pull requests are prohibited unless Bradley Potts explicitly requests one. The
guidance below applies only to that explicit exception.

For an explicitly requested PR, populate every section of the repo's PR template
(`.github/pull_request_template.md`):

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

| Tag                 | Element class                 | Entry point                                      |
| ------------------- | ----------------------------- | ------------------------------------------------ |
| `sp-button`         | `SpectreButtonElement`        | `@phcdevworks/spectre-components/button`         |
| `sp-input`          | `SpectreInputElement`         | `@phcdevworks/spectre-components/input`          |
| `sp-textarea`       | `SpectreTextareaElement`      | `@phcdevworks/spectre-components/textarea`       |
| `sp-select`         | `SpectreSelectElement`        | `@phcdevworks/spectre-components/select`         |
| `sp-checkbox`       | `SpectreCheckboxElement`      | `@phcdevworks/spectre-components/checkbox`       |
| `sp-radio`          | `SpectreRadioElement`         | `@phcdevworks/spectre-components/radio`          |
| `sp-label`          | `SpectreLabelElement`         | `@phcdevworks/spectre-components/label`          |
| `sp-fieldset`       | `SpectreFieldsetElement`      | `@phcdevworks/spectre-components/fieldset`       |
| `sp-badge`          | `SpectreBadgeElement`         | `@phcdevworks/spectre-components/badge`          |
| `sp-card`           | `SpectreCardElement`          | `@phcdevworks/spectre-components/card`           |
| `sp-icon-box`       | `SpectreIconBoxElement`       | `@phcdevworks/spectre-components/icon-box`       |
| `sp-rating`         | `SpectreRatingElement`        | `@phcdevworks/spectre-components/rating`         |
| `sp-testimonial`    | `SpectreTestimonialElement`   | `@phcdevworks/spectre-components/testimonial`    |
| `sp-alert`          | `SpectreAlertElement`         | `@phcdevworks/spectre-components/alert`          |
| `sp-avatar`         | `SpectreAvatarElement`        | `@phcdevworks/spectre-components/avatar`         |
| `sp-spinner`        | `SpectreSpinnerElement`       | `@phcdevworks/spectre-components/spinner`        |
| `sp-tag`            | `SpectreTagElement`           | `@phcdevworks/spectre-components/tag`            |
| `sp-pricing-card`   | `SpectrePricingCardElement`   | `@phcdevworks/spectre-components/pricing-card`   |
| `sp-container`      | `SpectreContainerElement`     | `@phcdevworks/spectre-components/container`      |
| `sp-grid`           | `SpectreGridElement`          | `@phcdevworks/spectre-components/grid`           |
| `sp-section`        | `SpectreSectionElement`       | `@phcdevworks/spectre-components/section`        |
| `sp-stack`          | `SpectreStackElement`         | `@phcdevworks/spectre-components/stack`          |
| `sp-dropdown`       | `SpectreDropdownElement`      | `@phcdevworks/spectre-components/dropdown`       |
| `sp-footer`         | `SpectreFooterElement`        | `@phcdevworks/spectre-components/footer`         |
| `sp-footer-chip`    | `SpectreFooterChipElement`    | `@phcdevworks/spectre-components/footer-chip`    |
| `sp-footer-link`    | `SpectreFooterLinkElement`    | `@phcdevworks/spectre-components/footer-link`    |
| `sp-modal`          | `SpectreModalElement`         | `@phcdevworks/spectre-components/modal`          |
| `sp-nav`            | `SpectreNavElement`           | `@phcdevworks/spectre-components/nav`            |
| `sp-nav-item`       | `SpectreNavItemElement`       | `@phcdevworks/spectre-components/nav-item`       |
| `sp-sidebar`        | `SpectreSidebarElement`       | `@phcdevworks/spectre-components/sidebar`        |
| `sp-sidebar-link`   | `SpectreSidebarLinkElement`   | `@phcdevworks/spectre-components/sidebar-link`   |
| `sp-sidebar-toggle` | `SpectreSidebarToggleElement` | `@phcdevworks/spectre-components/sidebar-toggle` |
| `sp-toast`          | `SpectreToastElement`         | `@phcdevworks/spectre-components/toast`          |
| `sp-tooltip`        | `SpectreTooltipElement`       | `@phcdevworks/spectre-components/tooltip`        |
| `sp-text`           | `SpectreTextElement`          | `@phcdevworks/spectre-components/text`           |

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
ecosystem contract, validated by `@phcdevworks/spectre-manifest`. It records
role, layer, exports, and allowed Spectre dependency targets. `check:ecosystem`
validates it as part of `npm run check`.

Keep `spectre.manifest.json` in sync when:

- Package exports in `package.json` are added or removed
- A Spectre package dependency is added or removed
- The package stability changes

Do not add a `consumers` field — that belongs in the central
`@phcdevworks/spectre-manifest` registry.
