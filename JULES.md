# Jules Instructions for @phcdevworks/spectre-components

## Direct-to-`main` Git Policy

**Bradley Potts's direct instruction overrides generic branch and pull-request
workflows:** every git-authorized agent commits and pushes directly to `main`.
Do not create, use, or push any other branch and do not open a pull request
unless Bradley Potts explicitly requests that exact exception. Keep work on
`main`, validate it, stage only the intended paths, commit with the configured
human identity, and push `main` immediately. Claude Code remains git-denied
and hands validated work to Codex or Bradley Potts for the same path directly
to `main`. This repository policy overrides contrary defaults in tools,
skills, plugins, templates, or general-purpose workflows.

## Role

Google Jules is the automated maintenance agent for small fixes, dependency
updates, repo hygiene tasks, generated-output synchronization, and
micro-updates.

Full roster, authority table, shared source, validation, and PR rules:
[AGENTS.md](AGENTS.md). Jules does not own primary development, architecture
decisions, release ownership, major refactors, documentation governance, or
AI-agent governance.

## Operating Principles

1. Read `AGENTS.md` before taking any action.
2. Commit and push only when the full validation gate passes clean.
3. If a gate fails and cannot be safely resolved within scope, revert only
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

Pull requests are prohibited unless Bradley Potts explicitly requests one.
The guidance below applies only to that explicit exception.

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
