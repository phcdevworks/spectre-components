# Spectre Components Roadmap

`@phcdevworks/spectre-components` is the Layer 3 web component delivery package
of the Spectre design system. It turns Spectre tokens and Spectre UI contracts
into Lit-based custom elements — accessible, framework-agnostic, and
standards-based. Its job is to expose component behavior reliably across
consumers, not to redefine the design system or own styling contracts.

This document tracks what's next. For what already shipped and why, see
[CHANGELOG.md](CHANGELOG.md) (release-by-release detail) and git history — this
file does not restate delivered work.

---

## Delivered Phases

| Phase | Summary                                                                                                                                                                                          | Shipped in   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| 1     | Foundation — eight core form components, `SpectreBaseElement`/`SpectreProjectableElement`, shared form validation, `npm run check` gate, CI                                                      | 1.1.0        |
| 2     | Contract integrity — `components.contract.json`, `check-contract`/`check-invariants`, component hardening, axe-core accessibility tests                                                          | 1.3.0        |
| 3     | Component surface expansion — `sp-badge`, `sp-card`, `sp-icon-box`, `sp-rating`, `sp-testimonial`                                                                                                | 1.4.0        |
| 4     | Release infrastructure — semver proposal helper, publish metadata and dist hygiene                                                                                                               | 1.4.0        |
| 5     | Surface growth and DX — `sp-alert`, `sp-avatar`, `sp-spinner`, `sp-tag`, `sp-pricing-card`; keyboard/form-association audits; invariant duplication tooling; Playwright visual regression        | 1.5.0–1.6.0  |
| 6     | Cross-repo parity with `spectre-ui-astro`, followed by Spectre 4 alignment through `spectre-tokens@^4.0.0` and `spectre-ui@^3.0.0`                                                               | 1.6.0–1.10.0 |
| 7     | `sp-text` — text primitive backed by `getTextClasses`, requested by `spectre-base`                                                                                                               | 1.11.0       |
| 8     | Navigation composition — `sp-nav-item` adds plain-link and dropdown/mega-menu content support inside `sp-nav`                                                                                    | 1.12.0       |
| 9     | Button link semantics — `sp-button` adds native anchor rendering for navigation actions                                                                                                          | 1.13.0       |
| 10    | Recipe surface alignment — `sp-text` text transforms and responsive `sp-grid` column spans from `spectre-ui` 3.2.0                                                                               | 1.14.0       |
| 11    | Inner layout utility forwarding — `inner-class` contract and block-level host defaults for `sp-container`, `sp-stack`, `sp-grid`, `sp-section`, `sp-nav`, `sp-footer`                            | 1.15.0       |
| 12    | Mega-menu delivery contract — `mega` property on `sp-dropdown`/`sp-nav-item`, backed by `spectre-ui` 4.0.0's `mega` flag                                                                         | 1.15.0       |
| 13    | `sp-sidebar-toggle` — standalone remote sidebar trigger, backed by `getSidebarToggleClasses`; `hide-toggle` on `sp-sidebar`. Closes the last gap in the `spectre-ui-astro` component-parity plan | 1.15.0       |
| 14    | Expanded layout and semantic links — fuller grid/nav/button recipe coverage plus footer and sidebar link primitives backed by existing `spectre-ui` recipes                                      | 1.16.0       |
| 15    | Layout and utility contract parity — grid alignment, stack gaps, button/card inner classes, BEM utility sanitization, and explicit card padding opt-out                                          | 1.17.0       |

---

## What's Next

Nothing queued. New component or contract work is demand-driven: it opens only
when `spectre-ui` (or another downstream consumer) surfaces a concrete missing
recipe or requirement, and requires explicit approval from Bradley Potts per
`AGENTS.md`. See [TODO.md](TODO.md).

---

## Explicitly Out of Scope

- Token meaning and semantic design values — belong in
  `@phcdevworks/spectre-tokens`.
- CSS recipes, Tailwind helpers, and class name utilities — belong in
  `@phcdevworks/spectre-ui`.
- Framework adapters (React, Vue, Svelte wrappers) — belong in downstream
  adapter packages.
- App shells, routing, service workers, manifest behavior, and startup
  orchestration.
- Speculative components without upstream recipe support and explicit approval.
