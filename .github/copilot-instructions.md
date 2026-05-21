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

- Focused checks first: `npm run lint`, `npm run typecheck`, `npm test`, or
  `npm run build`.
- Use `npm run check` as the full validation gate.

## Pull Request Creation

When opening a PR, populate every section of
`.github/pull_request_template.md`:

- **Linked issue** — issue number (`#N`) or `N/A`.
- **Summary of changes** — one or two bullets describing what changed.
- **Component API change type** — exactly one of `additive`, `behavioral
  change`, `breaking`, or `N/A`.
- **Type of Change** — check every box that applies.
- **Checklist** — check each completed item; leave blocked items unchecked
  with a brief inline note.

Never submit a PR with an empty body or only the template headings left
unfilled. CodeRabbit's description check blocks such PRs.

## References

- Shared boundaries: `AGENTS.md`
- Lead implementation rules: `CLAUDE.md`
- Release/readiness rules: `CODEX.md`
- Copilot support context: `COPILOT.md`
- Scoped task instructions: `.github/instructions/`
