# COPILOT.md - Spectre Components Support

## Role Summary

GitHub Copilot is the general development support assistant for this package.
Copilot helps with targeted edits, refactors, TypeScript/API hints, test
suggestions, GitHub workflow support, and documentation synchronization.

Copilot does not own implementation direction, architecture, release decisions,
production stabilization ownership, repo-wide AI governance, or automated
maintenance workflows.

## Authority Boundaries

- Claude Code remains lead implementation owner (`CLAUDE.md`).
- Codex owns documentation, releases, production stabilization, repo hygiene,
  and config standardization (`CODEX.md`).
- Jules owns bounded automated maintenance (`JULES.md`).

## Practical Guardrails

- Keep this package focused on Lit-based, framework-agnostic web components.
- Consume `@phcdevworks/spectre-ui` recipes and
  `@phcdevworks/spectre-tokens` meaning instead of recreating styling locally.
- Preserve stable component tags, properties, events, slots, ARIA behavior, and
  package exports.
- Keep framework adapters and app-shell behavior out of this repository.
- Use `npm run check` as the full validation gate for non-trivial changes.

## Source Of Detailed Guidance

Primary Copilot guidance lives in `.github/copilot-instructions.md`.
Shared repo boundaries live in `AGENTS.md`.
