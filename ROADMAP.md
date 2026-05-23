# Spectre Components Roadmap

`@phcdevworks/spectre-components` is the Layer 3 web component delivery package
of the Spectre design system. It turns Spectre tokens and Spectre UI contracts
into Lit-based custom elements - accessible, framework-agnostic, and
standards-based. Its job is to expose component behavior reliably across
consumers, not to redefine the design system or own styling contracts.

---

## 1. Foundation Status - Delivered

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

## 2. Roadmap - Mature Phase

The foundation is stable. The next phase establishes machine-readable contracts,
hardens existing component reliability and accessibility, and expands the surface
safely as upstream Spectre UI recipes support it.

---

### P0: Contract Integrity

**Objective** Establish machine-readable authority for the public component
surface.

**Why it matters** The package currently has no automated snapshot of exported
symbols. Contract drift between source, exports, and documentation is caught
manually. A machine-readable manifest and automated validation close that gap
before the surface grows further.

**Deliverables**

- Add `components.contract.json` as a machine-readable manifest anchoring the
  public component surface: tags, element classes, entry points, exported
  types, and protected accessibility and rendering contracts.
- Add automated export-snapshot validation that reads from the manifest and
  fails if actual exported symbols drift from the declared contract.
- Add a thin-adapter invariant check to `npm run check`: no hardcoded hex
  colors or spacing values, no local token redefinitions, no recreated
  `@phcdevworks/spectre-ui` recipes, no Shadow DOM without explicit approval
  recorded in the manifest.

**Dependency notes**

- No upstream dependency. Can be built independently.

**Risk if skipped**

- Export drift and contract creep go undetected until consumer breakage
  surfaces them.

---

### P1: Component Hardening

**Objective** Improve the reliability, accessibility, and test coverage of the
existing eight components before adding new ones.

**Why it matters** Some standard states (`readonly`, `required`, `loading`) are
incomplete across components. ARIA attribute forwarding may be inconsistent.
Adding new components on top of unaudited foundations risks compounding the
gaps.

**Deliverables**

- Audit `sp-button` for missing `loading` state behavior, class mapping, and
  ARIA pattern.
- Audit `sp-input`, `sp-textarea`, `sp-select`, and `sp-checkbox` for
  `readonly`, `required`, and `disabled` forwarding completeness.
- Verify ARIA attribute proxy coverage is consistent across all eight
  components.
- Add `sp-fieldset` legend slot test coverage.
- Add `sp-radio` group coordination test coverage.
- Add an accessibility audit step to the validation flow.

**Dependency notes**

- Does not require P0 to be complete, but the contract manifest makes audit
  results more durable.

**Risk if skipped**

- Accessibility gaps and missing state handling create silent breakage in
  downstream consumers that are hard to trace back to this package.

---

### P2: Component Surface Expansion

**Objective** Add display and layout components backed by upstream Spectre UI
recipes.

**Why it matters** Consumer applications currently have no web component wrappers
for display primitives like badges, cards, and icon boxes. These exist as CSS
recipes in `spectre-ui` but are not yet exposed as custom elements. Without
them, consumers fill the gap with local implementations that diverge from the
Spectre contract.

**Deliverables**

New components pending upstream recipe support:

- `sp-badge` - backed by `getBadgeClasses` in `@phcdevworks/spectre-ui`
- `sp-card` - backed by `getCardClasses` in `@phcdevworks/spectre-ui`
- `sp-icon-box` - backed by `getIconBoxClasses` in `@phcdevworks/spectre-ui`
- `sp-rating` - backed by `getRatingClasses` in `@phcdevworks/spectre-ui`
- `sp-testimonial` - backed by `getTestimonialClasses` in
  `@phcdevworks/spectre-ui`

Each new component requires: source, tests, exports, `AGENTS.md` component
table update, and `CHANGELOG.md [Unreleased]` entry.

**Dependency notes**

- Requires upstream recipe support in `@phcdevworks/spectre-ui` and explicit
  approval before any component is added.
- P1 hardening should be complete or well underway first.

**Risk if skipped**

- Consumer applications implement display primitives locally, diverging from the
  Spectre contract and creating long-term maintenance surface in the wrong
  package.

---

### P3: Release Infrastructure

**Objective** Reduce manual release overhead and keep publish metadata current.

**Why it matters** Version bumps are currently manual. The component API
classification in `CHANGELOG.md` already encodes the semver signal; automating
the proposal removes human error from release decisions. Metadata gaps reduce
package discoverability.

**Deliverables**

- Add a semver proposal helper that reads the `CHANGELOG.md [Unreleased]`
  component API classification and proposes the release bump: `additive` ->
  minor, `behavioral change` -> minor or patch as appropriate, `breaking` ->
  major.
- Verify npm publish metadata stays complete: `keywords`, `homepage`, `bugs`,
  and `repository`.
- Confirm `dist/` and `dist_verify/` remain generated-only and are never
  committed.
- Keep `CHANGELOG.md` compare links current on every release.

**Dependency notes**

- No upstream dependency. Can be built in parallel with any other phase.

**Risk if skipped**

- Version bumps remain manual and error-prone. A breaking change could ship
  as a minor bump if the classification line is misread.

---

## 3. Explicitly Out of Scope

- Token meaning and semantic design values - belong in
  `@phcdevworks/spectre-tokens`.
- CSS recipes, Tailwind helpers, and class name utilities - belong in
  `@phcdevworks/spectre-ui`.
- Framework adapters (React, Vue, Svelte wrappers) - belong in downstream
  adapter packages.
- App shells, routing, service workers, manifest behavior, and startup
  orchestration.
- Speculative components without upstream recipe support and explicit approval.

---

## 4. Recommended Execution Order

1. **P0 - Contract integrity** - establishes machine-readable authority before
   the surface grows further; high correctness payoff, no upstream dependency.
2. **P1 - Component hardening** - close accessibility and state gaps before
   adding new components; best done with the P0 manifest in place.
3. **P2 - Surface expansion** - add new components only after upstream recipes
   exist and P1 auditing is complete.
4. **P3 - Release automation** - low effort, high consistency payoff; can run
   in parallel with any phase once the contract manifest is stable.
