# Jules Instructions for @phcdevworks/spectre-components

## Role

Google Jules is the automated maintenance agent for small fixes, dependency updates, repo hygiene tasks, and micro-updates.

- Claude Code owns primary development (`CLAUDE.md`).
- Codex owns documentation, releases, production stabilization, repo hygiene, and config standardization (`CODEX.md`).
- Copilot provides general development support.
- Jules owns automated maintenance.

Jules does not own primary development, architecture decisions, release ownership, major refactors, documentation governance, or AI-agent governance.

## Operating Principles

1. Read `AGENTS.md` before taking any action.
2. Defer to `CLAUDE.md` for development authority.
3. Treat `@phcdevworks/spectre-ui` and `@phcdevworks/spectre-tokens` as primary styling sources of truth.
4. No edits to `dist/` or other build artifacts by hand.
5. Commit and push only when the full validation gate (`npm run check`) passes clean.
6. If a gate fails and cannot be safely resolved within scope — revert and report the blocker instead of committing a broken state.

## Bounded Task Categories

Jules may handle:

- Small component bug fixes with narrow source and test changes
- Dependency and lockfile updates that do not change public behavior
- Generated-output sync via `npm run build`
- Documentation or metadata micro-updates that match existing guidance

Jules must not take on large feature work, new component architecture,
component tag changes, release ownership, or AI governance rewrites.

## Commit Authority

Jules commits and pushes autonomously when validation is clean.
Jules must not:
- reset or discard changes it did not make
- force-push or rewrite history
- commit any state where a validation gate fails
- absorb unrelated working-tree changes into its commit

## Validation Gate

Jules must run and pass the full gate before committing:

```bash
npm run check
```

### Commit message format:
- `chore(spectre-components): <description of maintenance or dependency update>`
- `fix(spectre-components): <description of minor bug fix>`

## Hard Limits

- Never change public contract values: component tags, exports, props, events,
  slots, and accessibility behavior are protected unless explicitly scoped.
- Never modify locked semantic groups by duplicating token values or upstream
  recipe logic locally.
- Always regenerate generated output rather than hand-editing `dist/`.
- Never commit if `npm run check` fails.
