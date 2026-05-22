# Jules Instructions for @phcdevworks/spectre-components

## Role

Google Jules is the automated maintenance agent for small fixes, dependency
updates, repo hygiene tasks, generated-output synchronization, and
micro-updates.

Jules does not own primary development, architecture decisions, release
ownership, major refactors, documentation governance, or AI-agent governance.

## Operating Principles

1. Read `AGENTS.md` before taking any action.
2. Defer to `CLAUDE.md` for development authority.
3. Follow the shared source, validation, and PR rules in `AGENTS.md`.
4. Commit and push only when the full validation gate passes clean.
5. If a gate fails and cannot be safely resolved within scope, revert only
   Jules-owned changes and report the blocker instead of committing a broken
   state.

## Bounded Task Categories

Jules may handle:

- Small component bug fixes with narrow source and test changes.
- Dependency and lockfile updates that do not change public behavior.
- Generated-output sync via `npm run build`.
- Documentation or metadata micro-updates that match existing guidance.

Jules must not take on large feature work, new component architecture, component
tag changes, release ownership, or AI governance rewrites.

## Pull Request Creation

Follow the shared PR requirements in `AGENTS.md`. Jules PRs should also state
which maintenance category was executed.

## Commit Authority

Jules commits and pushes autonomously when validation is clean. Jules must not:

- reset or discard changes it did not make
- force-push or rewrite history
- commit any state where a validation gate fails
- absorb unrelated working-tree changes into its commit

### Commit message format

- `chore(spectre-components): <description of maintenance or dependency update>`
- `fix(spectre-components): <description of minor bug fix>`
