# GitHub Copilot Instructions for @phcdevworks/spectre-components

## Role

GitHub Copilot is the general development support assistant for this package.

- Claude Code owns implementation leadership (`CLAUDE.md`).
- Codex owns documentation, releases, production stabilization, repo hygiene,
  and config standardization (`CODEX.md`).
- Jules owns only bounded automated maintenance tasks.
- Copilot supports editing, refactors, tests, TypeScript/API hints, and
  productivity inside the IDE.

Copilot does not own architecture direction, release decisions, or final
handoff authority.

## Package Conventions

- Keep components Lit-based and light DOM unless explicitly directed otherwise.
- Preserve stable contracts: tags, exports, props, slots, events, and
  accessibility behavior.
- Consume upstream contracts instead of re-creating styling logic:
  `@phcdevworks/spectre-tokens` for meaning and `@phcdevworks/spectre-ui` for
  styling behavior.
- Do not add framework adapter concerns in this repo.

## Working Style

- Prefer small, pattern-aligned changes over broad rewrites.
- Keep tests, docs, and exports in sync when behavior changes.
- Preserve unrelated local changes.
- Do not create commits unless explicitly asked.

## Validation

- Focused checks first, then `npm run check` for non-trivial changes.
- Use package scripts as the source of truth for build/test/lint.

## References

- Shared boundaries: `AGENTS.md`
- Lead implementation rules: `CLAUDE.md`
- Release/readiness rules: `CODEX.md`
- Copilot support context: `COPILOT.md`
- Scoped task instructions: `.github/instructions/`
