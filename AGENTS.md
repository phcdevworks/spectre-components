# Spectre Components Agent Guide

This repository is maintained by PHCDevworks and is the canonical Lit-based
component layer of the Spectre system.

## Mission

Turn Spectre tokens and Spectre UI contracts into reusable, accessible,
framework-agnostic web components without redefining the underlying design
rules.

## Core Rules

1. Use Lit for component implementation.
2. Treat `@phcdevworks/spectre-tokens` as the source of visual meaning.
3. Treat `@phcdevworks/spectre-ui` as the styling contract layer.
4. Do not recreate token values locally.
5. Do not hardcode hex colors, spacing systems, shadows, or other visual
   primitives that should come from Spectre.
6. Keep this package framework-agnostic through standards-based web
   components.
7. Build accessibility into the default component behavior and structure.
8. Prefer small, production-ready component patterns over speculative
   abstractions or premature shared infrastructure.
9. Avoid app shell logic, routing, manifest behavior, startup orchestration, or
   framework adapters in this repository.
10. Treat component tags, public properties, events, slots, and accessibility
    behavior as stable contracts that should not change casually.

## Working Boundaries

- Design values and semantic meaning belong in `@phcdevworks/spectre-tokens`.
- CSS utilities, Tailwind helpers, and class recipes belong in
  `@phcdevworks/spectre-ui`.
- Lit-based custom element implementation belongs here.
- Framework adapters may wrap these components downstream, but adapters are out
  of scope in this package.

## Implementation Notes

- Prefer consuming `@phcdevworks/spectre-ui` recipe APIs over recreating class
  composition logic inside components.
- Keep the public API explicit through root and subpath exports.
- Prefer explicit registration helpers over implicit global side effects.
- Keep component files intentional and easy to scale: one component directory
  per element, with its own types and entry point when needed.

## Rendering Guidance

- Default to the rendering strategy that best preserves the
  `@phcdevworks/spectre-ui` styling contract.
- If a component renders in light DOM to consume shared Spectre styles
  directly, treat that as an intentional architectural decision and document it
  in code.
- Do not switch between light DOM and Shadow DOM casually; treat rendering
  boundary changes as design-system-level decisions.

## Do Not Do

- Do not redefine token meaning or semantic roles in this package.
- Do not recreate styling contracts that already exist in
  `@phcdevworks/spectre-ui`.
- Do not introduce framework-specific wrappers such as Astro, React, Vue, or
  Svelte components.
- Do not add routing, shell coordination, manifest behavior, or app
  initialization logic.
- Do not hardcode visual primitives that should come from Spectre contracts.
- Do not introduce speculative base classes or abstraction layers without
  repeated proven need.

## Validation Flow

1. Update component source, tests, and package metadata as needed.
2. Run `npm run build`.
3. Run `npm test`.
4. Run `npm run lint`.
5. Validate example or sandbox usage if the component API changed.
