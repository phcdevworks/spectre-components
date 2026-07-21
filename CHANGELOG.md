# Changelog

All notable changes to this project will be documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning
reflects package releases published to npm.

## [Unreleased]

## [1.9.0] - 2026-07-21

**Release Title:** TypeScript 7 Compatibility

Contract change type: additive

### Changed

- Widened the `typescript` peer dependency range to add TypeScript 7
  support: `^5.9 || ^6.0` → `^5.0 || ^6.0 || ^7.0`. Internal tooling
  (ESLint/typescript-eslint) runs against TypeScript 6 via an
  `npm:@typescript/typescript6` alias since `typescript-eslint` does not yet
  support TypeScript 7's programmatic API; TypeScript 7's native compiler is
  available via the `@typescript/native` devDependency alias.

### Fixed

- Added the existing `./footer` package export to `spectre.manifest.json`,
  restoring parity between the ecosystem manifest and the public exports map.

## [1.8.0] - 2026-07-07

**Release Title:** Phase 6 - Footer Parity

Contract change type: additive

### Added

- `sp-footer` - thin wrapper backed by `getFooterClasses`. Supports
  `bordered` and `full-width`. Closes the final gap against
  `@phcdevworks/spectre-ui-astro`.

## [1.7.0] - 2026-07-02

**Release Title:** Phase 6 - Interaction Parity

Contract change type: additive

### Added

- `sp-nav` - thin wrapper backed by `getNavClasses`. Supports `bordered`,
  `sticky`, and `full-width`.

- `sp-sidebar` - off-canvas sidebar backed by `getSidebarClasses`,
  `getSidebarBackdropClasses`, and `getSidebarToggleClasses`. Renders a toggle
  button and backdrop, and manages `open` state as native Lit element
  interactivity (click, backdrop click, `Esc`) instead of a ported script.
  Reflects open/closed state via `data-sidebar-open` on the host to match the
  Spectre CSS selector contract. Dispatches `sp-open` and `sp-close`.

- `sp-dropdown` - trigger + menu backed by `getDropdownClasses` and
  `getDropdownMenuClasses`. Supports `placement`
  (bottom-start/bottom-end/top-start/top-end, default `bottom-start`) and
  `full-width`. Projects `slot="trigger"` content into the trigger button and
  all other children into the menu. Closes on outside click or `Esc` and returns
  focus to the trigger. Dispatches `sp-open` and `sp-close`.

- `sp-modal` - overlay + dialog backed by `getModalClasses` and
  `getModalOverlayClasses`. Supports `open` and `full-width`. Implements
  focus-trap (`Tab`/`Shift+Tab`), `Esc`-to-close, backdrop-click-to-close,
  initial focus on open, and focus restoration on close. Dispatches `sp-close`.

- `sp-toast` - notification backed by `getToastClasses` and
  `getToastIconClasses`. Supports `variant` (info/success/warning/danger,
  default `info`), `dismissed`, `full-width`, and `auto-dismiss` (ms). Exposes
  imperative `show()`/`dismiss()` methods and dispatches `sp-show` and
  `sp-dismiss`. Projects `slot="icon"` content into an icon container only when
  present.

- `sp-tooltip` - hover/focus-triggered tooltip backed by `getTooltipClasses`.
  Supports `placement` (top/bottom/left/right, default `top`) and `visible`.
  Shows on trigger `mouseenter`/`focusin` and hides on `mouseleave`/`focusout`.
  Dispatches `sp-show` and `sp-hide`.

  These six close the remaining component-coverage gap against
  `@phcdevworks/spectre-ui-astro`, using its `.astro` adapters as the reference
  for recipe options and markup structure, with interactivity implemented as
  native Lit element state rather than ported scripts.

## [1.6.0] - 2026-07-01

**Release Title:** Phase 6 - Layout and Recipe Alignment

Contract change type: additive

### Added

- `sp-container` - layout component backed by `getContainerClasses`. Supports
  `max-width` (`prose`). Exports `spectreContainerMaxWidths` and
  `SpectreContainerMaxWidth`.

- `sp-grid` - layout component backed by `getGridClasses`. Supports `columns`
  (1/2/3/4/6/12, default `1`) and `gap` (sm/md/lg, default `md`). Exports
  `spectreGridColumns`, `spectreGridGaps`, `SpectreGridColumns`, and
  `SpectreGridGap`.

- `sp-section` - layout wrapper backed by `getSectionClasses`. Renders a
  `<section>` with no additional variant props.

- `sp-stack` - layout component backed by `getStackClasses`. Supports
  `direction` (vertical/horizontal, default `vertical`), `basis` (`sidebar`),
  and `align` (center/stretch, default `center`). Exports `spectreStackAligns`,
  `spectreStackBases`, `spectreStackDirections`, `SpectreStackAlign`,
  `SpectreStackBasis`, and `SpectreStackDirection`.

  These four close part of the component-coverage gap against
  `@phcdevworks/spectre-ui-astro`, using its `.astro` adapters as the reference
  for recipe options and markup structure (interactivity, where applicable in
  later additions, is implemented as native Lit element state rather than ported
  scripts).

### Fixed

- `sp-badge`, `sp-card`, `sp-icon-box`, `sp-testimonial`, `sp-avatar`,
  `sp-pricing-card`, and `sp-tag` now render `role="group"` on their native
  element whenever an `aria-label` or `aria-labelledby` is forwarded. These
  components wrap a roleless `<div>`/`<span>`, and ARIA forbids `aria-label`/
  `aria-labelledby` on an element with no role - axe-core's
  `aria-prohibited-attr` rule flagged this as a violation. The role is omitted
  when no label is forwarded, so unlabeled instances are unaffected. Found while
  extending `tests/accessibility.test.ts` coverage (Phase 5 P1).

- `sp-checkbox` and `sp-radio` indicator spans now call `getCheckboxClasses`/
  `getRadioClasses` from `@phcdevworks/spectre-ui` instead of a hardcoded
  literal class string. Previously the `--checked`/`--disabled` modifier classes
  were never applied, so the indicator's visual state never changed on toggle or
  disable, regardless of the native `<input>`'s actual state.

- `sp-fieldset`'s root `<fieldset>` element now calls `getFieldsetClasses` from
  `@phcdevworks/spectre-ui`. Previously it rendered with no `class` attribute at
  all, so `@phcdevworks/spectre-ui`'s border/padding styling for `.sp-fieldset`
  never applied.

### Changed

- `sp-fieldset`'s legend now calls the purpose-built `getFieldsetLegendClasses`
  (`.sp-fieldset__legend`, themed via `--sp-fieldset-legend-text`) instead of
  the generic `getInputLabelClasses` (`.sp-label`, themed via
  `--sp-component-input-role-text`) it borrowed before
  `@phcdevworks/spectre-ui@2.6.0` published a fieldset-specific recipe.

- `sp-label` now calls `getLabelClasses` (`.sp-form-label`, themed via
  `--sp-label-*`) instead of `getInputLabelClasses` (`.sp-label`, themed via
  `--sp-component-input-role-text`) - the same kind of borrowed-recipe situation
  as `sp-fieldset`'s legend, now that a label-specific recipe exists. Added a
  `required` property, which `getLabelClasses` supports (renders
  `sp-form-label--required`) but the previous recipe did not.

  **Rendered class name change**: any external CSS that happened to target
  `sp-fieldset`'s legend or `sp-label`'s native `<label>` via the `.sp-label`
  class will no longer match - neither was a supported public styling hook, but
  this is called out explicitly since the class name itself is visible in the
  DOM.

- `sp-select` and `sp-textarea` now call the purpose-built
  `getSelectClasses`/`getTextareaClasses` recipes instead of borrowing
  `getInputClasses`, now that `@phcdevworks/spectre-tokens@3.3.1` and
  `@phcdevworks/spectre-ui@2.7.0` added `invalid`/`success`/`loading` state
  support to those recipes. `disabled` and `loading` are now forwarded as
  independent options instead of being collapsed into one `state` value, so each
  now renders its own modifier class.

  **Rendered class name change**: `sp-select`/`sp-textarea` previously rendered
  `sp-input--*` modifier classes (e.g. `sp-input--lg`, `sp-input--error`); they
  now render `sp-select--*`/`sp-textarea--*` (e.g. `sp-select--lg`,
  `sp-select--invalid`). `sp-input--*` was never a supported public styling hook
  on these elements, but this is called out explicitly since the class names are
  visible in the DOM.

- Bumped `@phcdevworks/spectre-tokens` to `^3.3.1` and `@phcdevworks/spectre-ui`
  to `^2.7.0`, closing dependency drift against the current published
  `project-design` versions.

### Testing

- Phase 5 P1 hardening pass (no other source changes required):
  - Keyboard interaction audit for `sp-select`, `sp-radio`, and `sp-checkbox`
    confirmed no custom `keydown` handling exists anywhere in the package -
    native browser keyboard semantics (space/enter activation, native radio
    group navigation) pass through untouched. Added tests asserting native
    keydown events are never intercepted or `preventDefault()`-ed, and that
    native input/change events correctly update host properties.
  - Form-association audit for `sp-input`, `sp-textarea`, `sp-select`,
    `sp-checkbox`, and `sp-radio` confirmed native form participation
    (`FormData`, `checkValidity()`, ancestor `form.checkValidity()`) works
    correctly without `ElementInternals`/`formAssociated`, since each component
    renders a real native form control as a light-DOM descendant. Added
    end-to-end tests submitting through an ancestor `<form>`.
  - Extended `tests/accessibility.test.ts` with axe-core scenarios covering
    populated, empty, and slot-projection states for `sp-badge`, `sp-card`,
    `sp-icon-box`, `sp-rating`, and `sp-testimonial` - this surfaced the
    `role="group"` fix above.
  - Audited `sp-card` and `sp-testimonial` for slotted-content edge cases
    (whitespace-only text, empty slotted elements, nested interactive elements,
    long-text overflow). Confirmed `hasMeaningfulContent()` and
    `SpectreProjectableElement` already handle all four correctly; added
    regression tests locking in the behavior.
  - Added Playwright-based visual regression coverage
    (`visual-tests/components.visual.spec.ts`) snapshotting all 21 components
    via the existing `verification_app.ts` page. Run with `npm run test:visual`;
    regenerate baselines with `npm run test:visual:update`. Local opt-in only -
    not wired into `npm run check` or CI, since cross-runner font/rendering
    differences make CI-gated pixel diffs a separate decision.

## [1.5.0] - 2026-06-11

**Release Title:** Phase 5 - Display Surface Expansion

Contract change type: additive

### Added

- `sp-alert` - display component backed by `getAlertClasses`. Supports `variant`
  (info/success/warning/danger/neutral), `size` (sm/md/lg), `dismissed`,
  `disabled`, `loading`, and `full-width`. Renders with `role="alert"` and
  `aria-busy` reflecting the loading state. Exports `spectreAlertVariants`,
  `spectreAlertSizes`, `SpectreAlertVariant`, `SpectreAlertSize`, and
  `SpectreAlertProps`.

- `sp-avatar` - display component backed by `getAvatarClasses`. Supports `size`
  (xs/sm/md/lg/xl), `shape` (circle/square), `interactive`, `disabled`,
  `loading`, `full-width`, and `placeholder`. Reflects the `loading` state to
  `aria-busy`. Exports `spectreAvatarShapes`, `spectreAvatarSizes`,
  `SpectreAvatarShape`, `SpectreAvatarSize`, and `SpectreAvatarProps`.

- `sp-spinner` - loading indicator backed by `getSpinnerClasses`. Supports
  `variant` (primary/secondary/success/warning/danger/info/neutral/accent/cta),
  `size` (sm/md/lg), `disabled`, and `loading` (defaults to `true`). Renders
  with `role="status"`, reflects the `loading` state to `aria-busy`, and
  defaults `aria-label` to `Loading`. Exports `spectreSpinnerVariants`,
  `spectreSpinnerSizes`, `SpectreSpinnerVariant`, `SpectreSpinnerSize`, and
  `SpectreSpinnerProps`.

- `sp-tag` - display component backed by `getTagClasses`. Supports `variant`
  (default/primary/secondary/success/warning/danger/info/neutral/accent/cta/outline/ghost),
  `size` (sm/md/lg), `interactive`, `selected`, `dismissible`, `disabled`,
  `loading`, and `full-width`. Reflects the `loading` state to `aria-busy`.
  Exports `spectreTagVariants`, `spectreTagSizes`, `SpectreTagVariant`,
  `SpectreTagSize`, and `SpectreTagProps`.

- `sp-pricing-card` - display container backed by `getPricingCardClasses`.
  Supports `featured`, `interactive`, `disabled`, `loading`, and `full-height`.
  Reflects the `loading` state to `aria-busy`. Exports
  `SpectrePricingCardProps`.

## [1.4.0] - 2026-06-07

**Release Title:** Phase 4 - Display Component Expansion and Ecosystem Manifest
Gate

Contract change type: additive

### Added

- Added `@phcdevworks/spectre-manifest` as a devDependency.
  `spectre.manifest.json` at the repo root declares this package's ecosystem
  role, layer, exports, and allowed dependency targets. `check:ecosystem`
  validates it in the check pipeline.
- `sp-badge` - display component backed by `getBadgeClasses`. Supports `variant`
  (11 values), `size` (sm/md/lg), `disabled`, `loading`, and `full-width`.
  Exports `spectreBadgeVariants`, `spectreBadgeSizes`, `SpectreBadgeVariant`,
  `SpectreBadgeSize`, and `SpectreBadgeProps`.
- `sp-card` - display container backed by `getCardClasses`. Supports `variant`
  (elevated/flat/outline/ghost), `padded`, `full-height`, `interactive`,
  `disabled`, and `loading`. Exports `spectreCardVariants`,
  `SpectreCardVariant`, and `SpectreCardProps`.
- `sp-icon-box` - display component backed by `getIconBoxClasses`. Supports
  `variant` (11 values), `size` (sm/md/lg), `disabled`, `loading`,
  `interactive`, `pill`, and `full-width`. Exports `spectreIconBoxVariants`,
  `spectreIconBoxSizes`, `SpectreIconBoxVariant`, `SpectreIconBoxSize`, and
  `SpectreIconBoxProps`.
- `sp-rating` - display component backed by `getRatingClasses`. Renders star
  spans programmatically from `value` and `max` with a `role="img"` container
  and a computed accessible label. Supports `size` (sm/md/lg), `disabled`,
  `loading`, and a `label` text property. Exports `spectreRatingSizes`,
  `SpectreRatingSize`, and `SpectreRatingProps`.
- `sp-testimonial` - display container backed by `getTestimonialClasses`.
  Supports `variant` (elevated/flat/outline/ghost), `full-height`,
  `interactive`, `disabled`, and `loading`. Exports
  `spectreTestimonialVariants`, `SpectreTestimonialVariant`, and
  `SpectreTestimonialProps`.
- Added subpath exports for all five new components in `package.json` and
  `tsup.config.ts`.
- Extended `components.contract.json` with entries for all five new components.
- Added new variant and type-guard helpers to `src/utils/form.ts`:
  `spectreBadgeVariants`, `spectreCardVariants`, `spectreIconBoxVariants`, and
  `spectreTestimonialVariants`.

### Changed

- Updated `@phcdevworks/spectre-tokens` to `^2.8.0` and
  `@phcdevworks/spectre-ui` to `^1.8.0`.
- Aligned `engines.node` requirement with upstream styling contract.

## [1.3.0] - 2026-06-04

**Release Title:** Phase 3 - Contract Validation and Accessibility Audit Gate

Contract change type: additive

### Added

- `components.contract.json` - machine-readable manifest anchoring the public
  component surface: tags, element classes, entry points, exported value
  symbols, exported types, and per-component rendering contracts (`renderMode`,
  `shadowDomApproved`).
- `scripts/check-contract.ts` - export-snapshot validator that reads
  `components.contract.json` and fails if actual dist exports drift from the
  declared contract. Runs as `npm run check:contract`.
- `scripts/check-invariants.ts` - thin-adapter invariant checker that fails on
  hardcoded hex colors, hardcoded spacing values in template literals, local
  Spectre CSS custom property redefinitions, and Shadow DOM usage without
  explicit approval in the manifest. Runs as `npm run check:invariants`.
- Both new checks are wired into `npm run check` after the build step.

- `axe-core` devDependency added to support runtime ARIA and accessibility
  validation in tests.
- `tests/accessibility.test.ts` - axe-core audit tests for all eight components
  (`sp-button`, `sp-input`, `sp-textarea`, `sp-select`, `sp-checkbox`,
  `sp-radio`, `sp-label`, `sp-fieldset`). Covers default, invalid, loading, and
  aria-label/legend scenarios. Runs as part of `npm test` and the full
  `npm run check` gate.

## [1.2.0] - 2026-05-23

**Release Title:** Phase 2 - Styling Contract Alignment and Export Validation

Contract change type: additive

### Added

- `sp-button`: added `icon-only` property to align with updated styling contract
  in `@phcdevworks/spectre-ui`.
- `sp-label`: added `disabled` property to align with updated styling contract
  in `@phcdevworks/spectre-ui`.
- `scripts/check-exports.ts` - post-build export resolution check that imports
  each subpath entry point and verifies the expected registration functions and
  element classes are present.
- `check:exports` npm script wired into `npm run check` after the build step, so
  CI now validates exports on every push and PR.
- README: "Why this package exists alongside spectre-ui" architectural
  explanation covering the L1–L4 Spectre layer model.
- README: per-component API reference tables covering all attributes, events,
  content projection behavior, and internal CSS targeting hooks for all eight
  components.
- README: Accessibility section documenting ARIA forwarding, focus delegation,
  state-to-ARIA mapping, and label association patterns.
- README: Light DOM rendering explanation and CSS targeting guidance
  (`data-sp-*-native` attribute selectors as stable hooks).
- README: Framework integration notes for React 19+, React 18, Vue 3, and Astro
  with minimal working examples.
- AGENTS.md: AI Hard Limits section with explicit unconditional rules covering
  scope, design system boundaries, architecture, and API stability.
- CLAUDE.md: "What not to do" expanded with framework-specific examples and
  explicit component scope and stability rules.
- Added Codex companion operating and release review documentation.
- Added workspace GitHub Copilot instruction, scoped repository guidance, and a
  reusable release-readiness prompt for standardized AI collaboration.

### Changed

- Updated `@phcdevworks/spectre-tokens` to `^2.6.0` and
  `@phcdevworks/spectre-ui` to `^1.6.0`.
- `sp-button`: updated `getButtonClasses` call to include `iconOnly` state.
- `sp-input` and `sp-textarea`: expanded native attribute support and reinforced
  coverage for standard form-control attributes.
- `sp-label`, `sp-fieldset`, `sp-checkbox`, `sp-radio`: updated internal labels
  and legends to use `getInputLabelClasses` recipe from
  `@phcdevworks/spectre-ui`, ensuring consistent typography and disabled states.
- Bumped `lit` to `^3.3.3`.
- Bumped dev dependency ranges and updated lockfile.
- Aligned AI guidance, PR checklist language, and package validation so
  `npm run check` consistently covers lint, typecheck, tests, build, and export
  validation.
- Updated contributor-facing validation notes to match the full `npm run check`
  gate.
- Fixed existing TypeScript test and CSS side-effect import typing drift exposed
  by the restored typecheck gate.
- Added root Copilot support guidance to match the Spectre AI instruction
  structure used by `@phcdevworks/spectre-tokens`.
- Corrected README automation wording so Jules' bounded maintenance commit
  authority matches `JULES.md`.
- Updated shared agent guidance to reference the root Copilot support file.
- Migrated `scripts/check-exports` and `scripts/propose-version` to TypeScript
  and updated npm script invocations to run the `.ts` files directly.

### Fixed

- `sp-button`: added missing `sp-label` class to property-based label fallbacks
  and loading labels for typography consistency with other form controls.
- `sp-textarea`: reflect `rows` property to the host attribute so HTML
  serialization stays consistent with the declared value.
- `sp-fieldset`: added missing `aria-invalid` attribute to the native
  `<fieldset>` element.
- `sp-fieldset`: tightened legend rendering to avoid empty legend output.
- `sp-radio`: synchronized programmatic checked-state changes across radio
  groups.
- Refactored form utility normalization helpers for tighter property validation
  across `rows`, `maxlength`, and `minlength` inputs.

## [1.1.0] - 2026-05-05

**Release Title:** Phase 1 - Foundation API Tightening and Component
Documentation

Contract change type: additive

### Added

- `form` association support for `sp-input`, `sp-select`, and `sp-textarea`.
- Rich label content support for checkbox and radio controls while preserving
  their native input behavior.
- Shared light-DOM projection and attribute proxying utilities for foundation
  components.
- Focused coverage for attribute forwarding, projected content synchronization,
  form association, and label rendering behavior.
- Contributor, security, code of conduct, and expanded component usage
  documentation.

### Changed

- Bumped the package release version to `1.1.0`.
- Refactored foundation components around shared base/projectable behavior while
  keeping their public custom element contracts explicit.
- Standardized label rendering, property accessors, optional property typing,
  and form-control implementation details across the current component set.
- Tightened package exports and removed unnecessary public type re-exports from
  the select entry point.
- Updated Spectre, TypeScript, ESLint, Vitest, Prettier, and related dependency
  ranges and lockfile entries.

### Fixed

- Unified forwarding for `id`, `title`, ARIA attributes, and native control
  attributes across form components.
- Improved projected light-DOM content synchronization so external content is
  preserved more predictably during updates.
- Improved checkbox, radio, select, label, and fieldset accessibility behavior
  and DOM hygiene.
- Fixed exact optional property type compliance across component classes.

## [1.0.0] - 2026-04-26

**Release Title:** Phase 1 - Foundation Stabilization and Package Release

Contract change type: N/A

### Added

- `form` association support for `sp-input`, `sp-select`, and `sp-textarea`.
- Rich label content support for checkbox and radio controls.
- Shared base and projectable utilities for light-DOM component rendering and
  content projection.
- Contributor documentation and TypeScript-based ESLint configuration.
- Focused tests for select, label, fieldset, checkbox, radio, projected content,
  and form-control behavior.

### Changed

- Bumped the package release version to `1.0.0`.
- Updated Spectre dependency ranges to `@phcdevworks/spectre-tokens` `^2.4.0`
  and `@phcdevworks/spectre-ui` `^1.4.0`.
- Standardized foundation component implementation patterns across the current
  public component set.
- Refactored components to use shared light-DOM projection and base behavior
  instead of duplicating component plumbing.
- Tightened label rendering, select sizing, fieldset behavior, and form
  component APIs.
- Updated TypeScript, ESLint, Vitest, Prettier, Rollup, and related lockfile
  entries.

### Fixed

- Improved projected content synchronization in light-DOM components.
- Improved checkbox, radio, select, label, and fieldset accessibility behavior.
- Improved DOM hygiene for checkbox and radio label rendering.
- Fixed linting and build issues around the tightened `sp-select` API.

## [0.0.1] - 2026-04-13

**Release Title:** Phase 0 - Initial Component Foundations

Contract change type: N/A

### Added

- Initial package scaffold for `@phcdevworks/spectre-components`.
- Root package export plus explicit subpath exports for component-level
  registration and consumption.
- `defineSpectreComponents()` helper for opt-in registration of the current
  component set.
- Initial public component set:
  - `sp-button`
  - `sp-input`
  - `sp-textarea`
  - `sp-select`
  - `sp-checkbox`
  - `sp-radio`
  - `sp-label`
  - `sp-fieldset`
- Vitest coverage for the initial component surface.
- Repository and editor setup files for contributing and release readiness.

### Changed

- Tightened component APIs to better align form control behavior across button,
  input, textarea, and select patterns.
- Consolidated package CSS import expectations for release packaging.
- Updated package metadata, exports, and dependency ranges for the first npm
  release.

### Fixed

- Improved ARIA reactivity and accessibility fallbacks across the early form
  control components.
- Improved slotted content handling, content persistence, and loading behavior
  in foundational controls.
- Tightened property validation and control consistency for early public APIs.

[unreleased]:
  https://github.com/phcdevworks/spectre-components/compare/1.9.0...HEAD
[1.9.0]: https://github.com/phcdevworks/spectre-components/compare/1.8.0...1.9.0
[1.8.0]: https://github.com/phcdevworks/spectre-components/compare/1.7.0...1.8.0
[1.7.0]: https://github.com/phcdevworks/spectre-components/compare/1.6.0...1.7.0
[1.6.0]: https://github.com/phcdevworks/spectre-components/compare/1.5.0...1.6.0
[1.5.0]: https://github.com/phcdevworks/spectre-components/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/phcdevworks/spectre-components/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/phcdevworks/spectre-components/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/phcdevworks/spectre-components/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/phcdevworks/spectre-components/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/phcdevworks/spectre-components/compare/0.0.1...1.0.0
[0.0.1]: https://github.com/phcdevworks/spectre-components/tree/0.0.1
