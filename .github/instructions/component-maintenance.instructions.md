---
applyTo: "src/components/**,src/utils/**,tests/**"
description: "Use when editing Spectre components, shared rendering/form utilities, or component tests. Enforces stable component contracts, light DOM expectations, and synchronized validation."
---

# Component Maintenance Instructions

- Preserve public component contracts unless the task explicitly requires a
  breaking change.
- Keep components aligned with Spectre boundaries: tokens and semantic design
  meaning stay upstream, recipe/styling contracts stay in
  `@phcdevworks/spectre-ui`, and Lit custom element behavior stays here.
- Do not switch components away from light DOM without explicit approval.
- Reuse shared utilities when practical, but avoid speculative abstractions.
- Add or update focused tests for changed component behavior.
- If a component API, accessibility behavior, export, or registration helper
  changes, also review `README.md`, `AGENTS.md`, `CHANGELOG.md`, `package.json`,
  and `tsup.config.ts` for required follow-up updates.
- Validate with the narrowest useful command first, then run `npm run check`
  before handoff for non-trivial changes.
