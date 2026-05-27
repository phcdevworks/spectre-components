# Spectre Components Execution Todo

This todo list is aligned to the current repository and the roadmap in
`ROADMAP.md`. It is intentionally scoped to component contract integrity,
existing component hardening, safe component expansion, and release
infrastructure.

## Phase 1 - Foundation: Completed

The initial component foundation is in place as of v1.1.0. The package has a
stable Layer 3 shape for reusable Lit web components backed by Spectre tokens
and Spectre UI styling contracts.

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

## Phase 2 - Mature Component Operations

All items below are forward-looking. This phase starts from the stable v1.1.0
component foundation and focuses on machine-readable contracts, stronger
accessibility coverage, safe expansion, and release consistency.

### P0: Contract Integrity

- [ ] Add `components.contract.json` as a machine-readable manifest anchoring
      the public component surface:
  - tags
  - element classes
  - entry points
  - exported types
  - protected accessibility and rendering contracts

- [ ] Add automated export-snapshot validation that reads from the manifest and
      fails if actual exported symbols drift from the declared contract.

- [ ] Add a thin-adapter invariant check to `npm run check`:
  - no hardcoded hex colors or spacing values in component source
  - no local token redefinitions
  - no recreated `@phcdevworks/spectre-ui` recipes
  - no Shadow DOM without explicit approval recorded in the manifest

### P1: Component Hardening

- [x] Audit `sp-button` for missing `loading` state behavior, class mapping, and
      ARIA pattern.

- [x] Audit `sp-input` for `readonly` and `required` forwarding completeness.

- [x] Audit `sp-textarea` for `readonly` and `required` forwarding completeness.

- [x] Audit `sp-select` for `disabled` and `required` forwarding completeness.

- [x] Audit `sp-checkbox` for `required` forwarding completeness.

- [ ] Verify ARIA attribute proxy coverage is consistent across all eight
      components.

- [x] Add `sp-fieldset` legend slot test coverage.

- [x] Add `sp-radio` group coordination test coverage.

- [ ] Add an accessibility audit step to the validation flow.

### P2: Component Surface Expansion

New components should only be added when upstream Spectre UI tokens and CSS
recipes exist to back them. Do not add components that require local visual
decisions.

- [ ] `sp-badge` - requires `getBadgeClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.
- [ ] `sp-card` - requires `getCardClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.
- [ ] `sp-icon-box` - requires `getIconBoxClasses` in `@phcdevworks/spectre-ui`
      as backing recipe.
- [ ] `sp-rating` - requires `getRatingClasses` in `@phcdevworks/spectre-ui` as
      backing recipe.
- [ ] `sp-testimonial` - requires `getTestimonialClasses` in
      `@phcdevworks/spectre-ui` as backing recipe.

Each new component requires source, tests, exports, docs, component inventory,
and changelog updates.

### P3: Release Infrastructure

- [ ] Keep `CHANGELOG.md` compare links current on every release.

- [ ] Add a semver proposal helper that reads `CHANGELOG.md [Unreleased]`
      component API classification and proposes the release bump.

- [ ] Verify npm publish metadata stays complete: `keywords`, `homepage`,
      `bugs`, and `repository`.

- [ ] Confirm `dist/` and `dist_verify/` remain generated-only and are never
      committed.

## Recommended Execution Order

1. Add the component contract manifest.
2. Add export-snapshot and thin-adapter invariant validation.
3. Harden existing component states and accessibility coverage.
4. Add the accessibility audit step.
5. Expand the component surface only after upstream Spectre UI recipes exist.
6. Add release automation helpers after the contract manifest is stable.

## Explicitly Out of Scope

- Do not add token meaning or semantic design values here.
- Do not add CSS recipe ownership here.
- Do not add framework adapters or framework-only files here.
- Do not add app shell, routing, manifest, service worker, or startup
  orchestration here.
- Do not add speculative components without upstream recipe support and explicit
  approval.
