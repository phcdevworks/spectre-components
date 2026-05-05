# Changelog

All notable changes to this project will be documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning
reflects package releases published to npm.

## [Unreleased]

## [1.1.0] - 2026-05-05

**Release Title:** Foundation API Tightening and Component Documentation

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

## [0.0.1] - 2026-04-13

**Release Title:** Initial Component Foundations

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
  https://github.com/phcdevworks/spectre-components/compare/1.1.0...HEAD
[1.1.0]:
  https://github.com/phcdevworks/spectre-components/compare/0.0.1...1.1.0
[0.0.1]: https://github.com/phcdevworks/spectre-components/tree/0.0.1
