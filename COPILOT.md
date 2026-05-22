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
- Shared source, validation, PR, and package-boundary rules live in `AGENTS.md`.

## Practical Guardrails

- Keep assistance scoped to targeted edits, suggestions, and local cleanup.
- Defer release, architecture, and governance decisions to the owning guide.
- Preserve unrelated local changes.
- Do not create commits, tags, or releases unless explicitly asked.

## Pull Request Creation

Follow the shared PR requirements in `AGENTS.md`.

## Source Of Detailed Guidance

Primary Copilot guidance lives in `.github/copilot-instructions.md`. Shared repo
boundaries live in `AGENTS.md`. Codex release rules live in `CODEX.md`.
