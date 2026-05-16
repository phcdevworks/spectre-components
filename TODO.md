# Spectre Components Execution Todo

This todo list is aligned to the current repository and the roadmap in
`ROADMAP.md`. It reflects the current state of the package as of v1.1.0.

## P0: Contract Integrity

- [ ] Add `components.contract.json` as a machine-readable manifest anchoring
  the public component surface (tags, element classes, entry points, exported
  types).

- [ ] Add automated export-snapshot validation that reads from the manifest and
  fails if the actual exported symbols drift from the declared contract.

- [ ] Add a thin-adapter invariant check to `npm run check`:
  - No hardcoded hex colors or spacing values in component source
  - No local token redefinitions
  - No Shadow DOM without explicit approval recorded in the manifest

- [x] Enforce `npm run check` in CI on every push and PR to `main` — done via `.github/workflows/ci.yml`.

---

## P1: Component Hardening

- [ ] Audit `sp-button` for missing `loading` state (class + ARIA pattern).
- [ ] Audit `sp-input` for `readonly` and `required` forwarding completeness.
- [ ] Audit `sp-textarea` for `readonly` and `required` forwarding completeness.
- [ ] Audit `sp-select` for `disabled` and `required` forwarding completeness.
- [ ] Audit `sp-checkbox` for `required` forwarding completeness.
- [ ] Verify ARIA attribute proxy coverage is consistent across all eight components.
- [ ] Add `sp-fieldset` legend slot test coverage.
- [ ] Add `sp-radio` group coordination test coverage.

---

## P2: Component Surface Expansion

These should only be started after P0 is complete and upstream spectre-ui
recipes exist to back them.

- [ ] `sp-badge` — requires `getBadgeClasses` in spectre-ui as backing recipe.
- [ ] `sp-card` — requires `getCardClasses` in spectre-ui as backing recipe.
- [ ] `sp-icon-box` — requires `getIconBoxClasses` in spectre-ui as backing recipe.
- [ ] `sp-rating` — requires `getRatingClasses` in spectre-ui as backing recipe.
- [ ] `sp-testimonial` — requires `getTestimonialClasses` in spectre-ui as backing recipe.

---

## P3: Release Infrastructure

- [ ] Keep CHANGELOG.md compare links current on every release.
- [ ] Verify npm publish metadata: `keywords`, `homepage`, `bugs`, `repository`.
- [ ] Confirm `dist/` and `dist_verify/` are gitignored and never committed.
