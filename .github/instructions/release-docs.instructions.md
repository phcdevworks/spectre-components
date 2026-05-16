---
applyTo: "CHANGELOG.md,README.md,AGENTS.md,CODEX.md,CODEX_REVIEW_CHECKLIST.md,CODEX_RELEASE_CHECKLIST.md,package.json,tsup.config.ts,.github/**"
description: "Use when updating release-readiness docs, GitHub metadata, exports, changelog entries, or repository-standardization files. Keeps handoff artifacts aligned with the current package contract."
---

# Release And Documentation Instructions

- Keep documentation aligned with the current package API and repository
  workflow.
- Record every non-trivial repository or behavior change in `CHANGELOG.md`
  under `[Unreleased]`.
- When public exports or entry points change, verify `package.json` exports and
  `tsup.config.ts` entry points stay synchronized.
- Prefer concise, maintainer-facing guidance over generic process language.
- Keep GitHub support files consistent with the existing CI, templates, and
  release workflow already present in this repository.
- When writing review or release guidance, include validation expectations and
  unresolved-risk reporting.
