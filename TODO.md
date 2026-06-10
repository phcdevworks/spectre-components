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

## Phase 5 — Surface Growth, Hardening, and DX

`@phcdevworks/spectre-ui` already ships recipes for several primitives that have
no `sp-*` wrapper yet. This phase expands the surface to cover them, deepens
test coverage on the existing thirteen components, and improves contributor
tooling.

### P0: New Components with Existing Backing Recipes

- [x] `sp-alert` — requires `getAlertClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-avatar` — requires `getAvatarClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [x] `sp-spinner` — requires `getSpinnerClasses` in `@phcdevworks/spectre-ui`
      as backing recipe.

- [ ] `sp-tag` — requires `getTagClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.

- [ ] `sp-pricing-card` — backed by `getPricingCardClasses` and related helpers
      in `@phcdevworks/spectre-ui@1.8.0`. Recipe is available.

Each new component requires source, tests, exports, docs, `AGENTS.md` component
inventory update, and `CHANGELOG.md [Unreleased]` entry, plus explicit approval
per `AGENTS.md` before work begins.

### P1: Deeper Hardening and Coverage

- [ ] Audit keyboard interaction coverage for `sp-select`, `sp-radio`, and
      `sp-checkbox` (arrow-key navigation, space/enter activation, focus order).

- [ ] Audit form-association behavior (`formAssociated`, `ElementInternals`,
      validity state reporting) across `sp-input`, `sp-textarea`, `sp-select`,
      `sp-checkbox`, and `sp-radio`.

- [ ] Extend `tests/accessibility.test.ts` with axe-core scenarios for the five
      Phase 3 display components (`sp-badge`, `sp-card`, `sp-icon-box`,
      `sp-rating`, `sp-testimonial`) covering populated, empty, and
      slot-projection states.

- [ ] Audit `sp-card` and `sp-testimonial` for slotted-content edge cases
      (empty slots, nested interactive elements, long-text overflow).

### P2: Tooling and Contributor DX

- [ ] Evaluate adding visual regression testing (e.g. Playwright snapshot tests
      against `@phcdevworks/spectre-ui` styling) to catch unintended rendering
      drift across releases.

- [ ] Evaluate a lightweight component preview/docs harness (e.g. a local
      Storybook-style page) so contributors can visually verify components
      without a consumer app.

- [ ] Extend `scripts/check-invariants.ts` to flag duplicated class-mapping
      logic across components that could be centralized in `src/utils/`.

Each item in this phase requires explicit approval from Bradley Potts before
implementation begins, per the package boundaries in `AGENTS.md`.

---

## Recommended Execution Order

1. Phase 1 — done.
2. Phase 2 — done.
3. Phase 3 P0 — done.
4. Phase 4 P0 — done.
5. Phase 4 P1 — done.
6. **Phase 5 P0 — active.** Add sp-avatar, sp-spinner, sp-tag, sp-pricing-card.
   All backing recipes available in `@phcdevworks/spectre-ui@1.8.0`.
7. Phase 5 P1 — hardening; start after P0 ships.
8. Phase 5 P2 — tooling/DX; requires explicit approval.

---

## Explicitly Out of Scope

- Do not add token meaning or semantic design values here.
- Do not add CSS recipe ownership here.
- Do not add framework adapters or framework-only files here.
- Do not add app shell, routing, manifest, service worker, or startup
  orchestration here.
- Do not add speculative components without upstream recipe support and explicit
  approval.
