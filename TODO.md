# Spectre Components Execution Todo

Phases 1 through 17 are complete — see [ROADMAP.md](ROADMAP.md) for the full
delivery history and [CHANGELOG.md](CHANGELOG.md) for release-by-release detail.

New component or contract work here is demand-driven: it opens only when
`spectre-ui` (or another downstream consumer) surfaces a concrete missing recipe
or requirement, and requires explicit approval from Bradley Potts per
`AGENTS.md` before implementation begins.

---

## Requested by Downstream

### 2026-09-16 — `sp-badge` native utility hook parity

A production consumer has to target the rendered `.sp-badge` descendant from a
host-scoped selector to make supported Spectre utility-level adjustments to the
native badge surface. Layout primitives and several other visual components
already expose sanitized `inner-class`; `sp-badge` does not.

Implementation instructions:

- Add an additive `innerClass` / `inner-class` public property to `sp-badge`,
  matching the existing sanitized utility-hook pattern used by components such
  as card, button, grid, stack, section, container, nav, and footer.
- Pass the value through `sanitizeUtilityClasses()` and append only accepted
  `sp-*` utility classes to the native badge class list. Do not permit arbitrary
  downstream class injection.
- Do not change badge variants, sizes, default rendering, ARIA behavior,
  projected-content behavior, or the existing `getBadgeClasses()` contract.
- Add focused tests proving valid Spectre utilities reach the native badge,
  invalid/non-Spectre classes are rejected, and the host class remains
  untouched.
- Update the component contract manifest/inventory, README API table, and
  `CHANGELOG.md [Unreleased]` when implemented.
- Run `npm run check` before removing this item. Remove the TODO only after the
  acceptance criteria and validation pass per `CLAUDE.md`.

Acceptance criteria:

- A consumer can make supported utility-level native badge adjustments without
  reaching through the host with a `.sp-badge` descendant selector.
- The hook behaves consistently with the existing `inner-class` contract on
  other projectable components.
- No new visual meaning or recipe logic is recreated in this package.

## Explicitly Out of Scope

- Do not add token meaning or semantic design values here.
- Do not add CSS recipe ownership here.
- Do not add framework adapters or framework-only files here.
- Do not add app shell, routing, manifest, service worker, or startup
  orchestration here.
- Do not add speculative components without upstream recipe support and explicit
  approval.

## Card Edge Accents

- [ ] Add an optional, backward-compatible card edge-accent API after the
      corresponding `spectre-tokens` values and `spectre-ui` recipe contract
      are published. With Bradley Potts's approval for the public-property
      addition, expose validated accent color and `top | right | bottom | left`
      position properties/attributes, pass them to `getCardClasses`, preserve
      current output when omitted, and update component contract coverage,
      documentation, tests, and examples. The upstream request was filed on
      2026-09-18 in
      [spectre-ui/TODO.md](../spectre-ui/TODO.md#requested-by-downstream).
