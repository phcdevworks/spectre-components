# Codex Release Readiness

Use this checklist when Codex is asked to review, prepare, or validate a
release for `@phcdevworks/spectre-components`.

## Scope

- [ ] Read `CLAUDE.md`, `AGENTS.md`, `CODEX.md`, and the root Codex checklists.
- [ ] Review `git status --short` and identify unrelated existing changes.
- [ ] Confirm public API changes have tests, docs, and changelog coverage.
- [ ] Confirm package exports and `tsup.config.ts` entry points stay aligned.

## Contract Checks

- [ ] Component tags, properties, events, slots, and accessibility behavior are
      intentionally changed or preserved.
- [ ] Light DOM rendering remains intentional.
- [ ] Styling continues to come from `@phcdevworks/spectre-ui` contracts.
- [ ] No token values or visual primitives were recreated locally.

## Validation

Prefer the full gate before handoff:

```bash
npm run check
```

If validation cannot run, record the exact command and reason.

## Handoff

Summarize changed files, validation results, skipped checks, remaining risks,
and any release notes Bradley should review.
