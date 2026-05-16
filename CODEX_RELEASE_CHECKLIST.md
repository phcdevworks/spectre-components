# Codex Release Checklist

Use this checklist when preparing or reviewing a release candidate for
`@phcdevworks/spectre-components`.

## Scope

- Confirm the release only contains component-library work.
- Confirm there are no framework adapters, app shell behavior, routing, or
  startup orchestration changes.
- Confirm any refactor preserves public component contracts unless the release
  is intentionally breaking.

## Package Surface

- Root export remains valid in `src/index.ts`.
- Component re-exports remain valid in `src/components/index.ts`.
- Subpath exports in `package.json` match build entries in `tsup.config.ts`.
- New component directories include their own `index.ts` entry point.
- Registration helpers remain explicit and idempotent.

## Component Quality

- Component implementation uses Lit.
- Styling comes from `@phcdevworks/spectre-ui` contracts.
- Visual meaning comes from `@phcdevworks/spectre-tokens`.
- Light DOM rendering remains intentional.
- Native form behavior, labels, ARIA attributes, focus, and disabled states are
  covered where relevant.

## Documentation

- `README.md` reflects public usage and component API changes.
- `AGENTS.md` component inventory is current.
- `CLAUDE.md` architecture notes remain accurate.
- `CHANGELOG.md` has `[Unreleased]` entries for non-trivial changes.

## Validation

Run:

```bash
npm run check
```

Record:

- Command result.
- Any failures or skipped checks.
- Any remaining release risk.

## Human Handoff

Leave Bradley with:

- Release summary.
- Validation summary.
- Files changed.
- Risk notes.
- Any recommended semver impact.

