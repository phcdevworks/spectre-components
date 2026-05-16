# Codex Change Review Checklist

Use this checklist for pre-release review, PR review, or cleanup passes.

## API Stability

- Tags, public properties, events, slots, exports, and accessibility behavior are
  unchanged unless the change is intentional and documented.
- Optional properties and reflected attributes behave consistently with existing
  components.
- Native element behavior remains available through the custom element wrapper.

## Accessibility

- Labels, descriptions, ARIA attributes, and invalid/required/disabled states
  reach the native element.
- Keyboard and focus behavior match the underlying native control.
- Rich projected content does not break native semantics.

## Implementation

- No local token values, hex colors, custom spacing systems, or hardcoded visual
  primitives were added.
- No framework-specific wrapper code was introduced.
- Shared utilities are used where they already exist.
- New abstraction only exists because repeated code made it worthwhile.

## Tests

- Changed behavior has focused tests.
- Shared utility changes have cross-component coverage when appropriate.
- Regression cases cover previously broken behavior.

## Docs And Release Notes

- Public API changes are documented.
- `CHANGELOG.md` has the right Added, Changed, Fixed, Deprecated, Removed,
  Security, or Breaking entry.
- Release notes describe user-facing impact instead of internal mechanics only.

