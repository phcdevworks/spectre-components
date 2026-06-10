# Changelog

All notable changes to this project will be documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning
reflects package releases published to npm.

## [Unreleased]

Contract change type: additive

### Added

- `sp-alert` — display component backed by `getAlertClasses`. Supports `variant`
  (info/success/warning/danger/neutral), `size` (sm/md/lg), `dismissed`,
  `disabled`, `loading`, and `full-width`. Renders with `role="alert"` and
  `aria-busy` reflecting the loading state. Exports `spectreAlertVariants`,
  `spectreAlertSizes`, `SpectreAlertVariant`, `SpectreAlertSize`, and
  `SpectreAlertProps`.

- `sp-avatar` — display component backed by `getAvatarClasses`. Supports `size`
  (xs/sm/md/lg/xl), `shape` (circle/square), `interactive`, `disabled`,
  `loading`, `full-width`, and `placeholder`. Reflects the `loading` state to
  `aria-busy`. Exports `spectreAvatarShapes`, `spectreAvatarSizes`,
  `SpectreAvatarShape`, `SpectreAvatarSize`, and `SpectreAvatarProps`.

- `sp-spinner` — loading indicator backed by `getSpinnerClasses`. Supports
  `variant` (primary/secondary/success/warning/danger/info/neutral/accent/cta),
  `size` (sm/md/lg), `disabled`, and `loading` (defaults to `true`). Renders
  with `role="status"`, reflects the `loading` state to `aria-busy`, and
  defaults `aria-label` to `Loading`. Exports `spectreSpinnerVariants`,
  `spectreSpinnerSizes`, `SpectreSpinnerVariant`, `SpectreSpinnerSize`, and
  `SpectreSpinnerProps`.

- `sp-tag` — display component backed by `getTagClasses`. Supports `variant`
  (default/primary/secondary/success/warning/danger/info/neutral/accent/cta/outline/ghost),
  `size` (sm/md/lg), `interactive`, `selected`, `dismissible`, `disabled`,
  `loading`, and `full-width`. Reflects the `loading` state to `aria-busy`.
  Exports `spectreTagVariants`, `spectreTagSizes`, `SpectreTagVariant`,
  `SpectreTagSize`, and `SpectreTagProps`.

- `sp-pricing-card` — display container backed by `getPricingCardClasses`.
  Supports `featured`, `interactive`, `disabled`, `loading`, and
  `full-height`. Reflects the `loading` state to `aria-busy`. Exports
  `SpectrePricingCardProps`.

## [1.4.0] - 2026-06-07

**Release Title:** Display Component Expansion and Ecosystem Manifest Gate

Contract change type: additive

### Added

- Added `@phcdevworks/spectre-manifest` as a devDependency.
  `spectre.manifest.json` at the repo root declares this package's ecosystem
  role, layer, exports, and allowed dependency targets. `check:ecosystem`
  validates it in the check pipeline.
- `sp-badge` — display component backed by `getBadgeClasses`. Supports `variant`
  (11 values), `size` (sm/md/lg), `disabled`, `loading`, and `full-width`.
  Exports `spectreBadgeVariants`, `spectreBadgeSizes`, `SpectreBadgeVariant`,
  `SpectreBadgeSize`, and `SpectreBadgeProps`.
- `sp-card` — display container backed by `getCardClasses`. Supports `variant`
  (elevated/flat/outline/ghost), `padded`, `full-height`, `interactive`,
  `disabled`, and `loading`. Exports `spectreCardVariants`,
  `SpectreCardVariant`, and `SpectreCardProps`.
- `sp-icon-box` — display component backed by `getIconBoxClasses`. Supports
  `variant` (11 values), `size` (sm/md/lg), `disabled`, `loading`,
  `interactive`, `pill`, and `full-width`. Exports `spectreIconBoxVariants`,
  `spectreIconBoxSizes`, `SpectreIconBoxVariant`, `SpectreIconBoxSize`, and
  `SpectreIconBoxProps`.
- `sp-rating` — display component backed by `getRatingClasses`. Renders star
  spans programmatically from `value` and `max` with a `role="img"` container
  and a computed accessible label. Supports `size` (sm/md/lg), `disabled`,
  `loading`, and a `label` text property. Exports `spectreRatingSizes`,
  `SpectreRatingSize`, and `SpectreRatingProps`.
- `sp-testimonial` — display container backed by `getTestimonialClasses`.
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

**Release Title:** Contract Validation and Accessibility Audit Gate

Contract change type: additive

### Added

- `components.contract.json` — machine-readable manifest anchoring the public
  component surface: tags, element classes, entry points, exported value
  symbols, exported types, and per-component rendering contracts (`renderMode`,
  `shadowDomApproved`).
- `scripts/check-contract.ts` — export-snapshot validator that reads
  `components.contract.json` and fails if actual dist exports drift from the
  declared contract. Runs as `npm run check:contract`.
- `scripts/check-invariants.ts` — thin-adapter invariant checker that fails on
  hardcoded hex colors, hardcoded spacing values in template literals, local
  Spectre CSS custom property redefinitions, and Shadow DOM usage without
  explicit approval in the manifest. Runs as `npm run check:invariants`.
- Both new checks are wired into `npm run check` after the build step.

- `axe-core` devDependency added to support runtime ARIA and accessibility
  validation in tests.
- `tests/accessibility.test.ts` — axe-core audit tests for all eight components
  (`sp-button`, `sp-input`, `sp-textarea`, `sp-select`, `sp-checkbox`,
  `sp-radio`, `sp-label`, `sp-fieldset`). Covers default, invalid, loading, and
  aria-label/legend scenarios. Runs as part of `npm test` and the full
  `npm run check` gate.

## [1.2.0] - 2026-05-23

**Release Title:** Styling Contract Alignment and Export Validation

Contract change type: additive

### Added

- `sp-button`: added `icon-only` property to align with updated styling contract
  in `@phcdevworks/spectre-ui`.
- `sp-label`: added `disabled` property to align with updated styling contract
  in `@phcdevworks/spectre-ui`.
- `scripts/check-exports.ts` — post-build export resolution check that imports
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

**Release Title:** Foundation API Tightening and Component Documentation

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

**Release Title:** Foundation Stabilization and Package Release

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

**Release Title:** Initial Component Foundations

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
  https://github.com/phcdevworks/spectre-components/compare/1.4.0...HEAD
[1.4.0]: https://github.com/phcdevworks/spectre-components/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/phcdevworks/spectre-components/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/phcdevworks/spectre-components/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/phcdevworks/spectre-components/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/phcdevworks/spectre-components/compare/0.0.1...1.0.0
[0.0.1]: https://github.com/phcdevworks/spectre-components/tree/0.0.1
