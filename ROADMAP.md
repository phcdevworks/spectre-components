# Spectre Components Roadmap

`@phcdevworks/spectre-components` is the Layer 3 web component delivery package
of the Spectre design system. It turns Spectre tokens and Spectre UI contracts
into Lit-based custom elements — accessible, framework-agnostic, and
standards-based. Its job is to expose component behavior reliably across
consumers, not to redefine the design system or own styling contracts.

This document tracks what's next. For what already shipped and why, see
[CHANGELOG.md](CHANGELOG.md) (release-by-release detail) and git history —
this file does not restate delivered work.

---

## Delivered Phases

| Phase | Summary | Shipped in |
| --- | --- | --- |
| 1 | Foundation — eight core form components, `SpectreBaseElement`/`SpectreProjectableElement`, shared form validation, `npm run check` gate, CI | 1.1.0 |
| 2 | Contract integrity — `components.contract.json`, `check-contract`/`check-invariants`, component hardening, axe-core accessibility tests | 1.3.0 |
| 3 | Component surface expansion — `sp-badge`, `sp-card`, `sp-icon-box`, `sp-rating`, `sp-testimonial` | 1.4.0 |
| 4 | Release infrastructure — semver proposal helper, publish metadata and dist hygiene | 1.4.0 |
| 5 | Surface growth and DX — `sp-alert`, `sp-avatar`, `sp-spinner`, `sp-tag`, `sp-pricing-card`; keyboard/form-association audits; invariant duplication tooling; Playwright visual regression | 1.5.0–1.6.0 |
| 6 | Cross-repo parity with `spectre-ui-astro`, followed by Spectre 4 alignment through `spectre-tokens@^4.0.0` and `spectre-ui@^3.0.0` | 1.6.0–1.10.0 |
| 7 | `sp-text` — text primitive backed by `getTextClasses`, requested by `spectre-base` | 1.11.0 |
| 8 | Navigation composition — `sp-nav-item` adds plain-link and dropdown/mega-menu content support inside `sp-nav` | 1.12.0 |
| 9 | Button link semantics — `sp-button` adds native anchor rendering for navigation actions | 1.13.0 |
| 10 | Recipe surface alignment — `sp-text` text transforms and responsive `sp-grid` column spans from `spectre-ui` 3.2.0 | 1.14.0 |

---

## What's Next

### Phase 11 — Inner Layout Utility Forwarding

downstream integration's first production child theme exposed a delivery gap: layout
utilities applied to a custom-element host do not reach the native light-DOM
element that owns the component recipe classes. Phase 11 will add an explicit
inner-class contract to layout components after the `spectre-ui` Phase 8 layout
utility release is published. See [TODO.md](TODO.md) for the gated work queue.

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
