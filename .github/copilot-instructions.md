# Copilot Instructions For Spectre Components

This repository uses a coordinated AI workflow:

- Claude Code leads implementation and follows `CLAUDE.md` as the primary
  maintenance guide.
- Codex provides documentation, releases, production stabilization, repo
  hygiene, config standardization, review, and release-readiness oversight from
  `CODEX.md`.
- GitHub Copilot provides general development assistance, GitHub-integrated
  review support, documentation synchronization, and targeted refactor help.
- Google Jules, when configured, handles only automated maintenance for small
  fixes, dependency updates, and micro-updates.

Use this repository-specific guidance whenever assisting in this workspace.

## Operating Model

- Read `CLAUDE.md`, `AGENTS.md`, `CODEX.md`, and `CHANGELOG.md` before making
  non-trivial changes.
- Treat Claude Code's workflow and repository architecture guidance as the
  primary source of truth.
- Do not take ownership of implementation direction, release decisions, or
  final handoff authority.
- Keep public component contracts stable: tag names, exports, public
  properties, slots, events, and accessibility behavior should not change
  casually.
- Prefer small, production-ready refactors that improve maintainability without
  redefining Spectre token meaning, UI contracts, or rendering boundaries.
- Keep documentation, changelog entries, exports, and tests synchronized with
  code changes.

## Repository Rules

- Use Lit for component implementation.
- Keep all components in light DOM unless a design-system-level decision says
  otherwise.
- Do not hardcode colors, spacing, shadows, or token-derived visual primitives.
- Prefer `@phcdevworks/spectre-ui` contracts over recreating styling logic.
- Do not add framework adapters, routing, app shell logic, or unrelated tooling
  abstractions here.

## Copilot Support Priorities

- Help keep the package production ready by checking API stability,
  accessibility, validation status, docs consistency, and release notes.
- When changing source, also consider whether `README.md`, `AGENTS.md`,
  `CHANGELOG.md`, `package.json`, `tsup.config.ts`, or tests need updates.
- Prefer the narrowest useful validation first, then finish with `npm run check`
  before release handoff when code or docs meaningfully change.
- Do not create git commits unless explicitly asked.
- Do not expand Jules tasks into feature ownership or release ownership.
- Preserve unrelated user changes in the worktree.

## GitHub Workflow Support

- Use the existing issue templates, PR template, Dependabot setup, and CI
  workflow instead of creating parallel processes.
- When preparing a review or handoff, summarize changed behavior, validation
  results, remaining risks, and any follow-up documentation needs.
- Keep recommendations concrete and repository-specific rather than generic.
