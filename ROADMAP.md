# Spectre Components Roadmap

`@phcdevworks/spectre-components` is the Layer 3 web component delivery package
of the Spectre design system. It turns Spectre tokens and Spectre UI contracts
into Lit-based custom elements — accessible, framework-agnostic, and
standards-based. Its job is to expose component behavior reliably across
consumers, not to redefine the design system or own styling contracts.

---

## 1. Phase 1 — Foundation — Delivered

All foundation work is complete as of v1.1.0. The package has a stable Layer 3
shape with the core form primitive set shipped, validated, and CI-enforced.

### What is in place

- Eight production components covering core form primitives: `sp-button`,
  `sp-input`, `sp-textarea`, `sp-select`, `sp-checkbox`, `sp-radio`,
  `sp-label`, `sp-fieldset`.
- All components render in light DOM to consume `@phcdevworks/spectre-ui`
  styles directly without Shadow DOM piercing.
- `SpectreBaseElement` provides attribute proxying for `id`, `title`, and all
  ARIA attributes so they forward to the native element rather than the host.
- `SpectreProjectableElement` provides light-DOM content projection via
  `MutationObserver` for components that need to move slotted markup into a
  native container.
- Shared form validation utilities (`form.ts`) centralize allowlists and type
  guards.
- 95 tests across happy-dom with Vitest.
- ESM + CJS dual build via tsup with declaration files, root export, and
  subpath exports per component.
- Full validation gate via `npm run check`, enforced in CI on Node 22 and 24
  for every push and pull request.
- Multi-agent team (Claude Code, Codex, Copilot, Jules) with documented
  authority boundaries, PR creation requirements, and CodeRabbit review
  integration.

### What will not change

- All components render in light DOM. No component switches to Shadow DOM
  without explicit Bradley Potts approval.
- Component tag names (`sp-button`, `sp-input`, etc.) are stable public API.
  Rename requires a semver major bump and explicit approval.
- Public properties, events, slots, exports, and ARIA behavior are stable
  contracts.
- The `npm run check` gate is not optional. No gate may be removed or
  weakened without explicit approval.
- This package does not own token meaning, CSS recipe ownership, or framework
  adapter behavior.

---

## 2. Phase 2 — Contract Integrity and Component Hardening — Delivered

All Phase 2 work is complete as of v1.3.0. Machine-readable contract
validation, thin-adapter invariant checks, accessibility testing, and component
state and ARIA audits were delivered across the v1.2.0 and v1.3.0 release
cycle.

### P0: Contract Integrity — Delivered

- `components.contract.json` anchors the public component surface as a
  machine-readable manifest: tags, element classes, entry points, exported
  value symbols, exported types, and per-component rendering contracts
  (`renderMode`, `shadowDomApproved`).
- `scripts/check-contract.ts` validates that actual dist exports match the
  declared contract. Runs as `npm run check:contract` and is wired into
  `npm run check`.
- `scripts/check-invariants.ts` enforces thin-adapter rules: no hardcoded hex
  colors, no hardcoded spacing values in template literals, no local Spectre
  CSS custom property redefinitions, no Shadow DOM without manifest approval.
  Runs as `npm run check:invariants` and is wired into `npm run check`.

### P1: Component Hardening — Delivered

- Audited `sp-button` for `loading` state behavior, class mapping, and ARIA
  pattern.
- Audited `sp-input`, `sp-textarea`, `sp-select`, and `sp-checkbox` for
  `readonly`, `required`, and `disabled` forwarding completeness.
- Verified ARIA attribute proxy coverage is consistent across all eight
  components.
- Added `sp-fieldset` legend slot test coverage.
- Added `sp-radio` group coordination test coverage.
- Added `tests/accessibility.test.ts` — axe-core audit tests covering default,
  invalid, loading, and `aria-label`/legend scenarios for all eight components.
  Runs as part of `npm test` and the full `npm run check` gate.

---

## 3. Phase 3 — Component Surface Expansion

The core form primitive set and contract infrastructure are stable. This phase
expands the component surface to cover display and layout primitives already
defined as CSS recipes in `@phcdevworks/spectre-ui`.

### P0: New Display and Layout Components

#### Objective

Add display and layout components backed by upstream Spectre UI recipes.

#### Why it matters

Consumer applications currently have no web component wrappers for display
primitives like badges, cards, and icon boxes. These exist as CSS recipes in
`spectre-ui` but are not yet exposed as custom elements. Without them,
consumers fill the gap with local implementations that diverge from the Spectre
contract.

#### Deliverables

New components pending upstream recipe support:

- `sp-badge` — backed by `getBadgeClasses` in `@phcdevworks/spectre-ui`
- `sp-card` — backed by `getCardClasses` in `@phcdevworks/spectre-ui`
- `sp-icon-box` — backed by `getIconBoxClasses` in `@phcdevworks/spectre-ui`
- `sp-rating` — backed by `getRatingClasses` in `@phcdevworks/spectre-ui`
- `sp-testimonial` — backed by `getTestimonialClasses` in
  `@phcdevworks/spectre-ui`

Each new component requires: source, tests, exports, `AGENTS.md` component
table update, and `CHANGELOG.md [Unreleased]` entry.

#### Dependency notes

- Requires upstream recipe support in `@phcdevworks/spectre-ui` and explicit
  Bradley Potts approval before any component is added.
- Phase 2 hardening is complete, so the contract foundation is solid for
  expansion.

#### Risk if skipped

Consumer applications implement display primitives locally, diverging from the
Spectre contract and creating long-term maintenance surface in the wrong
package.

---

## 4. Phase 4 — Release Infrastructure

Reduce manual release overhead and keep publish metadata current. Version bumps
are currently manual. The component API classification in `CHANGELOG.md` already
encodes the semver signal; automating the proposal removes human error from
release decisions. Metadata gaps reduce package discoverability.

### P0: Semver Automation

- Add a semver proposal helper that reads the `CHANGELOG.md [Unreleased]`
  component API classification and proposes the release bump: `additive` →
  minor, `behavioral change` → minor or patch as appropriate, `breaking` →
  major.
- Wire the helper into the release procedure in `CLAUDE.md` and `CODEX.md`.
  Bradley Potts retains final version authority.

### P1: Publish Metadata and Dist Hygiene

- Verify npm publish metadata stays complete: `keywords`, `homepage`, `bugs`,
  and `repository`.
- Confirm `dist/` and `dist_verify/` remain generated-only and are never
  committed.
- Keep `CHANGELOG.md` compare links current on every release.

---

## 5. Explicitly Out of Scope

- Token meaning and semantic design values — belong in
  `@phcdevworks/spectre-tokens`.
- CSS recipes, Tailwind helpers, and class name utilities — belong in
  `@phcdevworks/spectre-ui`.
- Framework adapters (React, Vue, Svelte wrappers) — belong in downstream
  adapter packages.
- App shells, routing, service workers, manifest behavior, and startup
  orchestration.
- Speculative components without upstream recipe support and explicit approval.

---

## 6. Recommended Execution Order

1. **Phase 1** — done.
2. **Phase 2** — done.
3. **Phase 3 P0** — add display and layout components once upstream
   `@phcdevworks/spectre-ui` recipes exist and have explicit approval.
4. **Phase 4 P0** — add semver proposal helper; low effort, high release
   consistency payoff; can run in parallel with Phase 3.
5. **Phase 4 P1** — publish metadata and dist hygiene audit; can run in
   parallel with any Phase 3 work.
