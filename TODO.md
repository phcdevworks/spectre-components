# Spectre Components Execution Todo

This todo list is aligned to the current repository and the roadmap in
`ROADMAP.md`. It is intentionally scoped to component contract integrity,
existing component hardening, safe component expansion, and release
infrastructure.

---

## Phase 1 — Foundation: Completed

The initial component foundation is in place as of v1.1.0.

### P0: Core Component Surface

- [x] Ship the first production component set: `sp-button`, `sp-input`,
      `sp-textarea`, `sp-select`, `sp-checkbox`, `sp-radio`, `sp-label`, and
      `sp-fieldset`.

- [x] Publish root and subpath exports for each component.

- [x] Provide idempotent `defineSpectre*()` registration helpers.

### P1: Shared Component Infrastructure

- [x] Add `SpectreBaseElement` for forwarding `id`, `title`, and ARIA attributes
      to native elements.

- [x] Add `SpectreProjectableElement` for light-DOM content projection.

- [x] Centralize form allowlists and property validation helpers in
      `src/utils/form.ts`.

### P2: Validation Foundation

- [x] Enforce the full validation gate with `npm run check`.

- [x] Validate package export paths with `npm run check:exports`.

- [x] Run CI on every push and PR to `main` through `.github/workflows/ci.yml`.

---

## Phase 2 — Contract Integrity and Component Hardening: Completed

All Phase 2 items are delivered as of v1.3.0.

### P0: Contract Integrity

- [x] Add `components.contract.json` as a machine-readable manifest anchoring
      the public component surface: tags, element classes, entry points,
      exported value symbols, exported types, and per-component rendering
      contracts (`renderMode`, `shadowDomApproved`).

- [x] Add `scripts/check-contract.ts` — export-snapshot validator that reads
      `components.contract.json` and fails if actual dist exports drift from the
      declared contract. Runs as `npm run check:contract`.

- [x] Add `scripts/check-invariants.ts` — thin-adapter invariant checker that
      fails on hardcoded hex colors, hardcoded spacing values in template
      literals, local Spectre CSS custom property redefinitions, and Shadow DOM
      usage without explicit manifest approval. Runs as
      `npm run check:invariants`.

- [x] Wire both new checks into `npm run check` after the build step.

### P1: Component Hardening

- [x] Audit `sp-button` for missing `loading` state behavior, class mapping, and
      ARIA pattern.

- [x] Audit `sp-input` for `readonly` and `required` forwarding completeness.

- [x] Audit `sp-textarea` for `readonly` and `required` forwarding completeness.

- [x] Audit `sp-select` for `disabled` and `required` forwarding completeness.

- [x] Audit `sp-checkbox` for `required` forwarding completeness.

- [x] Verify ARIA attribute proxy coverage is consistent across all eight
      components.

- [x] Add `sp-fieldset` legend slot test coverage.

- [x] Add `sp-radio` group coordination test coverage.

- [x] Add `tests/accessibility.test.ts` — axe-core audit tests for all eight
      components covering default, invalid, loading, and `aria-label`/legend
      scenarios. Runs as part of `npm test` and the full `npm run check` gate.

---

## Phase 3 — Component Surface Expansion: Completed

All Phase 3 items are delivered. Full validation gate passes.

### P0: New Display and Layout Components

- [x] `sp-badge` — requires `getBadgeClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-card` — requires `getCardClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-icon-box` — requires `getIconBoxClasses` in `@phcdevworks/spectre-ui`
      as backing recipe.

- [x] `sp-rating` — requires `getRatingClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-testimonial` — requires `getTestimonialClasses` in
      `@phcdevworks/spectre-ui` as backing recipe.

Each new component requires source, tests, exports, docs, `AGENTS.md` component
inventory update, and `CHANGELOG.md [Unreleased]` entry.

---

## Phase 4 — Release Infrastructure

Semver proposal and release metadata checks are in place for the v1.4.0 release
prep.

### P0: Semver Automation

- [x] Add a semver proposal helper that reads `CHANGELOG.md [Unreleased]`
      component API classification and proposes the release bump: `additive` →
      minor, `behavioral change` → minor or patch, `breaking` → major.

- [x] Wire the helper into the release procedure in `CLAUDE.md` and `CODEX.md`.
      Bradley Potts retains final version authority.

### P1: Publish Metadata and Dist Hygiene

- [x] Verify npm publish metadata stays complete: `keywords`, `homepage`,
      `bugs`, and `repository`.

- [x] Confirm `dist/` and `dist_verify/` remain generated-only and are never
      committed.

- [x] Keep `CHANGELOG.md` compare links current on every release.

---

## Phase 5 — Surface Growth, Hardening, and DX: Completed

`@phcdevworks/spectre-ui` already ships recipes for several primitives that have
no `sp-*` wrapper yet. This phase expands the surface to cover them, deepens
test coverage on the existing thirteen components, and improves contributor
tooling. All three sub-phases (P0 new components, P1 hardening, P2 tooling
and contributor DX) are delivered.

### P0: New Components with Existing Backing Recipes

- [x] `sp-alert` — requires `getAlertClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-avatar` — requires `getAvatarClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-spinner` — requires `getSpinnerClasses` in `@phcdevworks/spectre-ui`
      as backing recipe.

- [x] `sp-tag` — requires `getTagClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-pricing-card` — backed by `getPricingCardClasses` and related helpers
      in `@phcdevworks/spectre-ui@1.8.0`. Recipe is available.

Each new component requires source, tests, exports, docs, `AGENTS.md` component
inventory update, and `CHANGELOG.md [Unreleased]` entry, plus explicit approval
per `AGENTS.md` before work begins.

### P1: Deeper Hardening and Coverage — Completed

- [x] Audit keyboard interaction coverage for `sp-select`, `sp-radio`, and
      `sp-checkbox` (arrow-key navigation, space/enter activation, focus order).
      No custom `keydown` handling exists anywhere in the package — native
      browser keyboard semantics pass through untouched. Added tests proving
      native keydown events are never intercepted.

- [x] Audit form-association behavior (`formAssociated`, `ElementInternals`,
      validity state reporting) across `sp-input`, `sp-textarea`, `sp-select`,
      `sp-checkbox`, and `sp-radio`. Native form participation already works
      via light-DOM native controls — no `ElementInternals` shim needed.
      Added end-to-end `FormData`/`checkValidity()` tests submitting through
      an ancestor `<form>`.

- [x] Extend `tests/accessibility.test.ts` with axe-core scenarios for the five
      Phase 3 display components (`sp-badge`, `sp-card`, `sp-icon-box`,
      `sp-rating`, `sp-testimonial`) covering populated, empty, and
      slot-projection states. Surfaced a real `aria-prohibited-attr` violation
      (forwarded `aria-label`/`aria-labelledby` on a roleless `<div>`/`<span>`)
      across `sp-badge`, `sp-card`, `sp-icon-box`, `sp-testimonial`,
      `sp-avatar`, `sp-pricing-card`, and `sp-tag`; fixed by rendering
      `role="group"` whenever a label is forwarded.

- [x] Audit `sp-card` and `sp-testimonial` for slotted-content edge cases
      (empty slots, nested interactive elements, long-text overflow).
      Confirmed `hasMeaningfulContent()` and `SpectreProjectableElement`
      already handle all four correctly; added regression tests.

### P2: Tooling and Contributor DX

- [x] Extend `scripts/check-invariants.ts` to flag duplicated class-mapping
      logic across components that could be centralized in `src/utils/`.
      Delivered: a cross-file duplication check fails the gate when an
      identical private getter body is repeated across 3+ component files
      (`DUPLICATION_THRESHOLD`). Paired with this, `isDisabled` and
      `hasForwardedLabel` were centralized into `SpectreBaseElement`,
      removing the duplication across every affected component.

- [x] Evaluate adding visual regression testing (e.g. Playwright snapshot tests
      against `@phcdevworks/spectre-ui` styling) to catch unintended rendering
      drift across releases. Delivered: `visual-tests/components.visual.spec.ts`
      drives the existing `verification_app.ts` page (the same one
      `playwright.config.ts` already pointed `webServer` at) and snapshots
      each of its 15 `<section>` groups, covering all 21 components. Run with
      `npm run test:visual`; regenerate baselines with
      `npm run test:visual:update` after an intentional visual change.
      Committed baselines live in
      `visual-tests/components.visual.spec.ts-snapshots/`. Deliberately not
      wired into `.github/workflows/ci.yml` or `npm run check` — cross-runner
      font/rendering differences make CI-gated pixel diffs a separate,
      bigger decision than local opt-in coverage; revisit only if Bradley
      Potts wants CI enforcement.

- [x] Evaluate a lightweight component preview/docs harness (e.g. a local
      Storybook-style page) so contributors can visually verify components
      without a consumer app. Closed as already satisfied:
      `verification_app.ts` plus `npm run verify:app` (Vite dev server)
      already renders every component via `defineSpectreComponents()` across
      multiple states in a real browser, and is now also the page the visual
      regression suite (above) renders against. A dedicated Storybook-style
      tool would only be worth the added dependency and maintenance surface
      if per-prop interactive controls (not just visual verification) become
      a real need — re-open only if that's explicitly requested.

Phase 5 P2 is complete. Any further items in this phase still require
explicit approval from Bradley Potts before implementation begins, per the
package boundaries in
`AGENTS.md`.

---

## Phase 6 — Cross-Repo Parity Gaps (spectre-ui-astro)

Audit against `@phcdevworks/spectre-ui-astro` (the L3b sibling) found gaps in
both directions. P1 items are not approved for implementation yet — see
`AGENTS.md` package-boundary approval requirement. P0 is approved and
partially delivered.

### P0: Recipe Backing Gap on Existing Components — Partially delivered

`sp-checkbox`, `sp-fieldset`, `sp-label`, `sp-radio`, `sp-select`, and
`sp-textarea` shipped since Phase 1 with no backing recipe in
`@phcdevworks/spectre-ui`, unlike every other component in this package. The
gate (`@phcdevworks/spectre-tokens` Phase 7 / `@phcdevworks/spectre-ui`
Phase 4e publishing) cleared in `@phcdevworks/spectre-ui@2.6.0`. Investigation
found three distinct situations, not one uniform gap — see per-item detail
below.

- [x] `sp-checkbox`, `sp-radio` — fixed a real bug: the indicator `<span>`
      hardcoded a literal class string with no `--checked`/`--disabled`
      modifier ever applied. Now calls `getCheckboxClasses`/`getRadioClasses`.
      Added indicator-class test coverage (previously untested).

- [x] `sp-fieldset` — fixed a real bug: the root `<fieldset>` had no `class`
      attribute at all, so `.sp-fieldset` border/padding styling never
      applied. Now calls `getFieldsetClasses`. Legend switched from the
      generic `getInputLabelClasses` to the purpose-built
      `getFieldsetLegendClasses` (`.sp-fieldset__legend`, not `.sp-label`).

- [x] `sp-label` — switched from `getInputLabelClasses` to the purpose-built
      `getLabelClasses` (`.sp-form-label`, not `.sp-label`). Added a new
      `required` property (`getLabelClasses` supports it; the component
      didn't expose it before). Rendered class name changes from `sp-label`
      to `sp-form-label` — called out explicitly in `CHANGELOG.md` since it's
      visible in the DOM, even though it was never a supported styling hook.

- [ ] `sp-select`, `sp-textarea` — **deferred, not a silent gap-fill.**
      `getSelectClasses`/`getTextareaClasses` only support `{disabled,
      focused}`, unlike `getInputClasses` (which these two currently use)
      supporting `size`/`fullWidth`/`pill`/`invalid`/`success`/`loading` —
      all of which `sp-select`/`sp-textarea`'s own public properties
      actually drive today. Switching as originally planned would silently
      drop that functionality, not just swap styling tokens. Filed as an
      upstream request in `project-design/spectre-ui/TODO.md` Phase 5 P0
      (added 2026-06-29) asking whether `@phcdevworks/spectre-ui` should
      expand these two recipes to option-parity with `getInputClasses`, or
      whether the minimal option set is intentional. Revisit once that's
      decided — do not switch unilaterally either way.

### P1: Components Present in spectre-ui-astro but Missing Here

`spectre-ui-astro` ships `SpDropdown`, `SpModal`, `SpNav`, `SpSidebar`,
`SpToast`, and `SpTooltip` on top of recipes that already exist in
`@phcdevworks/spectre-ui` (Phase 4, delivered v2.9.0-aligned). No Lit
equivalents exist here yet.

- [ ] Evaluate `sp-dropdown` — backing recipes `getDropdownClasses`,
      `getDropdownMenuClasses`, `getDropdownItemClasses` already published.

- [ ] Evaluate `sp-modal` — backing recipes `getModalClasses`,
      `getModalOverlayClasses` already published. Needs focus-trap and
      `Esc`-to-close behavior considerations beyond what a thin Astro
      wrapper provides.

- [ ] Evaluate `sp-nav` — backing recipes `getNavClasses`,
      `getNavLinksClasses`, `getNavLinkClasses` already published.

- [ ] Evaluate `sp-sidebar` — backing recipe `getSidebarClasses` already
      published.

- [ ] Evaluate `sp-toast` — backing recipes `getToastClasses`,
      `getToastIconClasses` already published. Likely needs an imperative
      show/dismiss API, which is a meaningfully different contract from the
      other display components.

- [ ] Evaluate `sp-tooltip` — backing recipe `getTooltipClasses` already
      published. Needs positioning/hover-trigger behavior considerations.

Each item requires explicit approval from Bradley Potts before implementation
begins, per `AGENTS.md`.

---

## Recommended Execution Order

1. Phase 1 — done.
2. Phase 2 — done.
3. Phase 3 P0 — done.
4. Phase 4 P0 — done.
5. Phase 4 P1 — done.
6. Phase 5 P0 — done. Added sp-alert, sp-avatar, sp-spinner, sp-tag, and
   sp-pricing-card.
7. Phase 5 P1 — done. Hardening and coverage audits; fixed an
   `aria-prohibited-attr` violation found across seven display components.
8. Phase 5 P2 — done. Invariant-check duplication detection and visual
   regression testing (Playwright, local opt-in) delivered. Component
   preview/docs harness closed as already satisfied by the existing
   verification app.

---

## Explicitly Out of Scope

- Do not add token meaning or semantic design values here.
- Do not add CSS recipe ownership here.
- Do not add framework adapters or framework-only files here.
- Do not add app shell, routing, manifest, service worker, or startup
  orchestration here.
- Do not add speculative components without upstream recipe support and explicit
  approval.
