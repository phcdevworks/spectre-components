# Spectre Components Execution Todo

Phases 1 through 10 are complete — see [ROADMAP.md](ROADMAP.md) for the full
delivery history and [CHANGELOG.md](CHANGELOG.md) for release-by-release
detail.

## Phase 11: Inner Layout Utility Forwarding

Gated on the publication of the `spectre-ui` Phase 8 layout utility release.

- [ ] Add an explicit, safe contract for applying consumer-supplied `sp-*`
      utility classes to the native inner element rendered by layout
      components (`sp-container`, `sp-stack`, `sp-grid`, `sp-section`,
      `sp-nav`, and `sp-footer`). Do not overload the host `class` attribute:
      host display/layout and inner component layout are distinct targets.
- [ ] Establish block-level host defaults for structural layout elements so
      backgrounds, margins, and full-width inner content are not trapped inside
      the browser's default inline custom-element box. Keep inline primitives
      unchanged and test host versus inner-element responsibilities separately.
- [ ] Add regression coverage showing layout utilities reach the effective
      styled element without changing the host's own classes.
- [ ] Document the markup contract and update the component changelog.

Requested by a downstream integration on 2026-08-07 after a production child
theme had to target generated inner elements (`> .sp-stack`, `> .sp-grid`,
and similar selectors) for basic layout composition.

## Phase 12: Mega-Menu Delivery Contract

Gated on publication of the corresponding `spectre-ui` wide-menu geometry
contract.

- [ ] Extend `sp-nav-item`/`sp-dropdown` with the additive property or variant
      needed to select container-anchored wide-menu geometry without exposing
      internal selectors to consumers.
- [ ] Verify simple dropdown behavior remains unchanged while mega-menu content
      can use responsive Grid utilities, bounded height, and scrolling.
- [ ] Add behavior, accessibility, and projected-content regression coverage;
      document the public contract and update `CHANGELOG.md`.

New component or contract work here is otherwise demand-driven: it opens only
when `spectre-ui` (or another downstream consumer) surfaces a concrete missing
recipe or requirement, and requires explicit approval from Bradley Potts per
`AGENTS.md` before implementation begins.

---

## Explicitly Out of Scope

- Do not add token meaning or semantic design values here.
- Do not add CSS recipe ownership here.
- Do not add framework adapters or framework-only files here.
- Do not add app shell, routing, manifest, service worker, or startup
  orchestration here.
- Do not add speculative components without upstream recipe support and
  explicit approval.
