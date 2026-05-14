# Spectre Components Roadmap

This roadmap reflects the current repository shape of `@phcdevworks/spectre-components`
as of v1.1.0.

`@phcdevworks/spectre-components` is the Layer 3 web component delivery package of
the Spectre design system. Its job is to expose Spectre tokens and UI contracts as
standards-based, framework-agnostic custom elements — not to redefine the design system
or own styling contracts.

The work below focuses on hardening the existing component surface, improving test
coverage and contract enforcement, and safely expanding the component set as upstream
Spectre contracts support it.

---

## 1. Current Repo Assessment

### Current strengths

- Eight production components covering core form primitives: `sp-button`, `sp-input`,
  `sp-textarea`, `sp-select`, `sp-checkbox`, `sp-radio`, `sp-label`, `sp-fieldset`.
- All components render in light DOM to consume `@phcdevworks/spectre-ui` styles directly.
- `SpectreBaseElement` provides attribute proxying for `id`, `title`, and all ARIA
  attributes so they forward to the native element rather than the host.
- `SpectreProjectableElement` provides light-DOM content projection via MutationObserver
  for components that need to move slotted markup into a native container.
- Shared form validation utilities (`form.ts`) centralize allowlists and type guards.
- 95 tests across happy-dom with Vitest.
- ESM + CJS dual build via tsup with declaration files.

### Current gaps to harden

- No machine-readable component contract manifest (parallel to `contract.manifest.json`
  in spectre-tokens or `ui-contract.manifest.json` in spectre-ui).
- Public API surface validation is manual — no automated snapshot of exported symbols.
- CHANGELOG compare links need to stay current on releases.
- No display or layout components yet (progress, badge, card, alert, avatar, etc.).
- `npm run check` does not yet have a CI enforcement path.

---

## 2. P0 — Contract Integrity

These items establish machine-readable authority and automated validation before
expanding the component surface.

- [ ] Add `components.contract.json` as a machine-readable manifest anchoring the
  public component surface (tags, element classes, entry points, exported types).
- [ ] Add automated export-snapshot validation against the manifest.
- [ ] Add a thin-adapter invariant check: no hardcoded hex colors, no local token
  redefinitions, no Shadow DOM without explicit approval.
- [ ] Enforce `npm run check` in CI on every push and PR to `main`.

---

## 3. P1 — Component Hardening

Improve the reliability and accessibility of the existing eight components before
adding new ones.

- [ ] Audit all components for missing standard states: `disabled`, `readonly`,
  `required`, `loading` (where applicable).
- [ ] Verify ARIA attribute forwarding is complete and consistent across all eight
  components.
- [ ] Add `sp-fieldset` legend slot test coverage.
- [ ] Add `sp-radio` group coordination test coverage.
- [ ] Add accessibility audit step to the validation flow.

---

## 4. P2 — Component Surface Expansion

New components should only be added when upstream Spectre UI tokens and CSS recipes
exist to back them. Do not add components that require local visual decisions.

Candidates pending upstream contract support:

- `sp-badge` — backed by `getBadgeClasses` in spectre-ui
- `sp-card` — backed by `getCardClasses` in spectre-ui
- `sp-icon-box` — backed by `getIconBoxClasses` in spectre-ui
- `sp-rating` — backed by `getRatingClasses` in spectre-ui
- `sp-testimonial` — backed by `getTestimonialClasses` in spectre-ui

Each new component requires:
- A component directory under `src/components/`
- `defineSpectre<Name>()` registration helper
- Subpath export in `package.json` and `tsup.config.ts`
- Test coverage in `tests/`
- AGENTS.md component table update
- CHANGELOG.md `[Unreleased]` entry

---

## 5. P3 — Release Infrastructure

- [ ] Keep CHANGELOG.md compare links current on every release.
- [ ] Verify npm publish metadata is complete (keywords, homepage, bugs, repository).
- [ ] Confirm `dist/` and `dist_verify/` are gitignored and never committed.
