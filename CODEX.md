# CODEX.md - Spectre Components Release Agent

## Role

Codex is the documentation, release-readiness, production stabilization, repo
hygiene, validation review, handoff, and configuration standardization agent for
`@phcdevworks/spectre-components`.

Full roster and authority table: [AGENTS.md](AGENTS.md). Codex keeps Claude
Code's work production-ready. Human final review, release decisions, tagging,
and publishing remain with Bradley Potts. Codex has commit, push, and tag
authority for its own scope of work — validate changes, then stage, commit,
and push.

Codex is also responsible for executing git operations on Claude Code's
behalf in this repo, now that Claude Code has zero git access: when Claude
Code hands off validated work, Codex — not Claude Code — stages, commits,
tags, and pushes it, in addition to Codex's own documentation and hygiene
commits.

## Operating Principles

1. Protect component tags, public exports, properties, events, slots, and
   accessibility behavior before optimizing internal structure.
2. Keep changes scoped, conservative, and aligned with existing Lit patterns.
3. Commit and push within Codex's own scope of work; do not cut releases,
   publish packages, or merge PRs unless Bradley Potts explicitly asks.

## Entry Point

At the start of any Codex session:

1. Read `AGENTS.md` for shared repository boundaries.
2. Read `CLAUDE.md` for development authority and package rules.
3. Read this file for Codex-specific procedures.
4. Read `package.json`, `src/index.ts`, and `src/components/index.ts` as the
   current package contract authority.
5. Check `CHANGELOG.md [Unreleased]` for pending public API classification.

## Primary Responsibilities

### 1. Release Validation

Run and interpret the shared validation gate before release handoff.

When a gate fails, Codex must:

- Identify the failing script and the relevant output.
- Determine whether the failure is a component contract issue, documentation
  drift, export drift, generated-output sync problem, or configuration issue.
- Fix the issue if it is within Codex scope, or clearly flag it for Claude Code
  if it requires component implementation decisions.

### 2. Change Review

When Claude Code or a human makes changes, Codex reviews for:

- Contract drift between source, tests, root exports, subpath exports,
  `package.json`, `tsup.config.ts`, and README examples.
- Public tag, property, event, slot, export, or accessibility changes without
  appropriate classification.
- Local token values, visual primitives, or recreated Spectre UI recipe logic.
- Generated files that were hand-edited instead of regenerated.
- Missing `CHANGELOG.md [Unreleased]` coverage for non-trivial public changes.
- Missing validation results before handoff.
- Accessibility behavior: labels, ARIA attributes, invalid/required/disabled
  states, keyboard and focus behavior, and projected content must not break
  native element semantics.
- Test coverage: changed behavior has focused tests; regression cases cover
  previously broken behavior; shared utility changes have cross-component
  coverage where appropriate.

### 3. Documentation Standardization

When documentation diverges from package reality, Codex brings it back.

Audit sequence:

1. `package.json`, `tsup.config.ts`, `src/index.ts`, and
   `src/components/index.ts` - current public export shape.
2. Component source and tests - current behavior and accessibility contract.
3. `README.md` - consumer-facing usage and package overview.
4. `CONTRIBUTING.md` - human contributor workflow.
5. `ROADMAP.md` - strategic direction and rationale.
6. `TODO.md` - phased execution list.
7. `CLAUDE.md`, `CODEX.md`, `JULES.md`, and `COPILOT.md` - agent-specific
   workflow (authority hierarchy lives in `AGENTS.md`).
8. `CHANGELOG.md` - pending release notes and API classification.

Do not move token meaning, CSS recipe ownership, app shells, routing, or
framework adapters into this package.

### 4. Refactor Review

Codex evaluates whether a refactor is warranted and scopes it conservatively.

Trigger conditions for a refactor recommendation:

- Export or build metadata is duplicated in a way that causes drift.
- Validation scripts duplicate logic that should be shared.
- Documentation describes behavior that has changed in source or tests.
- Repo configuration has inconsistent authority or repeated policy blocks.

Approved refactor scope for Codex:

- Validation scripts in `scripts/` that do not change what they validate.
- Documentation rewriting for clarity when content is accurate but inconsistent
  in tone or structure.
- Build or package metadata cleanup that preserves public behavior.
- AI-agent and repository configuration standardization within the authority
  model in `AGENTS.md`.

Not approved without Claude Code or human confirmation:

- Public component API changes.
- New component architecture.
- Changes that alter what the shared validation gate enforces.
- Changes that move ownership boundaries across Spectre packages.

### 5. Change Tracking

Codex tracks pending unreleased work by reading `CHANGELOG.md [Unreleased]`.

For each unreleased entry, verify:

- The component API change type is one of `additive`, `behavioral change`,
  `breaking`, or `N/A`.
- The entry accurately describes the public impact.
- Source, tests, exports, and docs agree with the classification.
- Breaking changes have an approved breaking-change path.

## Pull Request Creation

Follow the shared PR requirements in `AGENTS.md`. When Codex prepares a PR
handoff, include validation status, component API classification, and any
unresolved release risk in the summary.

## Release Review Checklist

Use this checklist before cutting every release (tag + GitHub Release).

### Pre-Release Validation

- [ ] Shared validation gate passes clean.
- [ ] Export validation passes for root and subpath entries.
- [ ] Generated output was regenerated, not hand-edited.
- [ ] CI expectations match the local validation gate.

### Release Scope

- [ ] Release contains only component-library work; no framework adapters, app
      shell behavior, routing, or startup orchestration changes.
- [ ] Any refactor preserves public component contracts unless the release is
      intentionally breaking.

### Contract Integrity

- [ ] Tags, exports, props, events, slots, accessibility behavior, docs, and
      tests agree.
- [ ] No public component contract was renamed or removed without an approved
      major-version path.
- [ ] No token values, CSS recipes, or visual primitives were recreated locally.
- [ ] Light DOM rendering remains intentional and unchanged unless approved.
- [ ] Root export (`src/index.ts`), component re-exports
      (`src/components/index.ts`), and subpath exports (`package.json`) match
      `tsup.config.ts` build entries.
- [ ] Registration helpers remain explicit and idempotent.

### Changelog and Classification

- [ ] `CHANGELOG.md [Unreleased]` covers every non-trivial public change.
- [ ] Component API change type is accurate.
- [ ] Entries are clear enough for downstream consumers to understand impact.

### Release Mechanics

1. `package.json` version is bumped to the intended release version.
2. `CHANGELOG.md [Unreleased]` notes are moved to a new versioned entry:
   `## [<version>] - <YYYY-MM-DD>`, with a release title line in the format
   `**Release Title:** <short title>`, where `<short title>` is a concise
   summary of what shipped without a roadmap phase or version prefix — the
   version remains in the changelog heading and git tag. Every release must
   still belong to a numbered roadmap phase. If no phase is active, add the
   next numbered phase to `ROADMAP.md` before preparing the release.
3. Compare links at the bottom of `CHANGELOG.md` are updated.
4. Shared validation gate passes on the release-ready state.
5. Stage and commit the version bump and changelog update.
6. Create the git tag: `git tag v<version>` (matching `package.json`
   exactly), then push the commit and tag.
7. Publish the GitHub Release from that tag: `gh release create v<version>
   --title "<short title>" --notes-file` (extract the new version's changelog
   section, or `--notes` inline for a short release). Keep the `v` prefix on
   the tag, but do not include the version or roadmap phase in the release
   title.
8. `npm publish` is **not** run by Codex — that stays with Bradley Potts.

### Handoff

- [ ] The commit, tag, and GitHub Release are complete (or, if blocked,
      exactly which step failed and why).
- [ ] A clear summary of changed files, validation results, classification,
      and any unresolved risk is prepared for Bradley Potts, including the
      npm publish step still pending his action.

## Documentation Audit Procedure

Run this when documentation may have drifted from package reality.

```bash
npm run check:exports
```

Then compare the current public surface against:

- `README.md` for consumer usage.
- `CONTRIBUTING.md` for human workflow.
- `AGENTS.md` for shared agent rules and component inventory.
- `TODO.md` and `ROADMAP.md` for planned work.

If no doc-specific validation exists, use the available markdown or format
checks already present in package scripts and report what was run.

## Git Boundaries

Codex may inspect git status and diffs freely. Codex must not reset, discard, or
overwrite changes it did not make. Existing local edits are assumed to belong to
Bradley Potts, Claude Code, or another active process.

Codex validates changes, then stages, commits, and pushes them within its own
scope of work. Codex does not publish or merge PRs; those stay gated per
"Role" above.

## Source Of Truth Hierarchy

When guidance conflicts, resolve in this order:

1. Source, tests, `package.json`, and `tsup.config.ts` - package contract
   authority.
2. `CLAUDE.md` - development authority.
3. `AGENTS.md` - shared agent boundaries.
4. This file (`CODEX.md`) - Codex operational procedures.
5. Consumer and contributor docs.
