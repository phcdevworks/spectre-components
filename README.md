# @phcdevworks/spectre-components

[![npm version](https://img.shields.io/npm/v/@phcdevworks/spectre-components)](https://www.npmjs.com/package/@phcdevworks/spectre-components)
[![CI](https://github.com/phcdevworks/spectre-components/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/phcdevworks/spectre-components/actions/workflows/ci.yml)
[![License](https://img.shields.io/npm/l/@phcdevworks/spectre-components)](LICENSE)
[![Node](https://img.shields.io/node/v/@phcdevworks/spectre-components)](https://nodejs.org)

`@phcdevworks/spectre-components` is the **Layer 3** Lit-based web component
package of the Spectre design system. It turns Spectre tokens
(`@phcdevworks/spectre-tokens`) and Spectre UI styling contracts
(`@phcdevworks/spectre-ui`) into reusable, accessible, framework-agnostic custom
elements — the canonical component implementation layer for Spectre, designed to
be consumed directly or wrapped by downstream adapter packages.

[Contributing](CONTRIBUTING.md) | [Code of Conduct](CODE_OF_CONDUCT.md) |
[Changelog](CHANGELOG.md) | [Roadmap](ROADMAP.md) |
[Security Policy](SECURITY.md)

## Why this package exists alongside spectre-ui

`@phcdevworks/spectre-ui` owns CSS: class recipes, Tailwind helpers, and the
styling contract that maps Spectre tokens to visual output. It ships CSS rules
and JavaScript class-name helpers — nothing more.

This package sits above that. It owns **behavior**: the Lit element classes that
apply those CSS recipes, forward ARIA attributes to native elements, manage
focus delegation, handle content projection, validate properties, and expose a
stable TypeScript API surface for downstream adapters.

The separation keeps each layer focused:

| Layer  | Package                               | Owns                                   |
| ------ | ------------------------------------- | -------------------------------------- |
| L1     | `@phcdevworks/spectre-tokens`         | Design values and semantic meaning     |
| L2     | `@phcdevworks/spectre-ui`             | CSS recipes and styling contracts      |
| **L3** | **`@phcdevworks/spectre-components`** | **Lit web component behavior and API** |
| L4     | Downstream adapters                   | Framework-specific delivery            |

If you only need CSS class names, use `@phcdevworks/spectre-ui` directly. If you
need ready-to-use HTML elements with behavior, accessibility, and a typed API,
use this package.

## Key capabilities

- Lit-based custom elements on the Custom Elements standard
- Renders in **light DOM** so `@phcdevworks/spectre-ui` global styles apply
  directly — no Shadow DOM piercing required
- ARIA attributes (`aria-label`, `aria-labelledby`, `aria-describedby`) are
  forwarded to the native element, not left on the host
- Focus and blur delegate to the inner native element
- Property validation with safe fallbacks in `willUpdate()`
- Idempotent `defineSpectre*()` helpers — safe to call multiple times
- ESM + CJS dual build with TypeScript declaration files
- Tree-shakeable subpath exports per component

## When to use this package

- You are building UI with the Spectre design system and want standards-based
  custom elements with baked-in behavior and accessibility.
- You want typed form controls (`sp-button`, `sp-input`, `sp-select`, etc.) and
  display primitives (`sp-badge`, `sp-card`, `sp-rating`, etc.) that work in any
  framework or in plain HTML.
- You are writing a framework adapter (React, Vue, Astro) and need a reliable,
  stable element layer to wrap.

## When not to use this package

- You only need CSS class names — use `@phcdevworks/spectre-ui` directly.
- You are adding routing, shell logic, or app-startup orchestration — those are
  out of scope here.
- You need framework-specific component files (JSX, SFCs, Astro components) —
  those belong in a downstream adapter package.

## Installation

```bash
npm install @phcdevworks/spectre-components @phcdevworks/spectre-ui @phcdevworks/spectre-tokens
```

## Quick start

### Plain HTML

Import the CSS layers and register all components from a script tag or entry
module. These are standard custom elements — no build step required for
consumption.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Spectre CSS layers must load before any markup is rendered -->
    <link
      rel="stylesheet"
      href="/node_modules/@phcdevworks/spectre-tokens/index.css"
    />
    <link
      rel="stylesheet"
      href="/node_modules/@phcdevworks/spectre-ui/index.css"
    />
  </head>
  <body>
    <sp-label for="email">Email address</sp-label>
    <sp-input
      id="email"
      name="email"
      type="email"
      placeholder="you@example.com"
    ></sp-input>

    <sp-button variant="primary" type="submit">Send</sp-button>
    <sp-button variant="ghost" type="button">Cancel</sp-button>

    <script type="module">
      import { defineSpectreComponents } from '/node_modules/@phcdevworks/spectre-components/dist/index.js'
      defineSpectreComponents()
    </script>
  </body>
</html>
```

### JavaScript / TypeScript module

```ts
import '@phcdevworks/spectre-tokens/index.css'
import '@phcdevworks/spectre-ui/index.css'

// Register everything at once
import { defineSpectreComponents } from '@phcdevworks/spectre-components'
defineSpectreComponents()

// Or register only what you use
import { defineSpectreButton } from '@phcdevworks/spectre-components/button'
import { defineSpectreInput } from '@phcdevworks/spectre-components/input'
defineSpectreButton()
defineSpectreInput()
```

### Full form example

```html
<sp-fieldset legend="Contact preferences">
  <sp-label for="email">Email address</sp-label>
  <sp-input id="email" name="email" type="email" required></sp-input>

  <sp-label for="bio">Bio</sp-label>
  <sp-textarea id="bio" name="bio" rows="4" maxlength="500"></sp-textarea>

  <sp-label for="role">Role</sp-label>
  <sp-select id="role" name="role">
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </sp-select>

  <sp-checkbox name="terms" value="accepted" required>
    I accept the <a href="/terms">terms of service</a>
  </sp-checkbox>

  <sp-radio name="plan" value="monthly">Monthly billing</sp-radio>
  <sp-radio name="plan" value="annual">Annual billing</sp-radio>

  <sp-button variant="primary" type="submit">Save</sp-button>
  <sp-button variant="ghost" type="reset">Reset</sp-button>
</sp-fieldset>
```

### Framework integration note

These are standard HTML custom elements. They work in every major framework that
supports the Custom Elements standard:

**React 19+** — supports custom element properties and events natively:

```tsx
// React 19: properties and events work directly
<sp-input name="email" type="email" onInput={(e) => setValue(e.target.value)} />
```

**React 18 and below** — set attributes via `ref` for properties, listen for
native events on the element:

```tsx
const inputRef = useRef(null)
useEffect(() => {
  if (inputRef.current) inputRef.current.invalid = true
}, [])

return <sp-input ref={inputRef} name="email" />
```

**Vue 3** — supports custom elements out of the box with `v-bind` and `v-on`
directive compatibility. Mark the `sp-*` prefix in `compilerOptions` as a custom
element to suppress unknown-element warnings:

```ts
// vite.config.ts
plugins: [
  vue({
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith('sp-') }
    }
  })
]
```

```html
<sp-input name="email" :invalid="hasError" @change="handleChange" />
```

**Astro** — use components as static custom elements or with `client:load` when
JavaScript interactivity is needed:

```astro
---
import '@phcdevworks/spectre-tokens/index.css';
import '@phcdevworks/spectre-ui/index.css';
---
<script>
  import { defineSpectreComponents } from '@phcdevworks/spectre-components';
  defineSpectreComponents();
</script>
<sp-button variant="primary">Click me</sp-button>
```

> Framework adapter packages that wrap these components into idiomatic JSX or
> SFC APIs belong in a downstream adapter — not in this package.

## Accessibility

All components follow WCAG 2.1 AA baseline expectations by default.

**ARIA attribute forwarding** — `aria-label`, `aria-labelledby`, and
`aria-describedby` set on the host element are automatically forwarded to the
inner native element so screen readers receive them on the correct target.

**Native element semantics** — every component renders a real native element
(`<button>`, `<input>`, `<textarea>`, `<select>`, `<label>`, `<fieldset>`) or a
semantic light-DOM container with forwarded ARIA attributes, so browser
accessibility APIs work without customization.

**State communication**

| State      | ARIA effect                                          |
| ---------- | ---------------------------------------------------- |
| `loading`  | `aria-busy="true"` on the native element             |
| `invalid`  | `aria-invalid="true"` on the native element          |
| `disabled` | native `disabled` attribute (removes from tab order) |
| `required` | native `required` attribute                          |

**Focus delegation** — `.focus()` and `.blur()` called on the host are delegated
to the inner native element so external `focus()` calls work as expected.

**Label association** — use `<sp-label for="id">` paired with `id` on the target
control, or wrap controls inside a `<sp-fieldset>`. The `for` attribute forwards
to the native `<label>` element.

**Keyboard behavior** — provided entirely by the native element inside each
component. No custom keyboard handling is layered on top.

## Light DOM rendering

All components render in **light DOM** (`createRenderRoot() { return this; }`).
This is intentional: it allows `@phcdevworks/spectre-ui` global CSS to reach the
native element directly without Shadow DOM piercing.

As a result, these components have no `::part()` exports — the native element is
directly selectable using standard CSS combinators or the stable internal data
attributes:

```css
/* Target the native input inside sp-input */
sp-input input {
  font-size: 0.875rem;
}

/* Stable internal hook — won't break if markup restructures */
sp-input [data-sp-input-native] {
  font-size: 0.875rem;
}
```

Do not switch any component from light DOM to Shadow DOM without a
design-system-level decision.

## Components

### sp-button

Renders a `<button>` with Spectre variant, size, loading, and pill support.

**Attributes**

| Attribute          | Type                                                                  | Default   | Description                                              |
| ------------------ | --------------------------------------------------------------------- | --------- | -------------------------------------------------------- |
| `variant`          | `primary \| secondary \| ghost \| danger \| success \| cta \| accent` | `primary` | Visual style                                             |
| `size`             | `sm \| md \| lg`                                                      | `md`      | Control size                                             |
| `type`             | `button \| submit \| reset`                                           | `button`  | Native button type                                       |
| `label`            | string                                                                | —         | Text label (overridden by content projection)            |
| `loading`          | boolean                                                               | `false`   | Busy state — disables the button and shows loading label |
| `loading-label`    | string                                                                | `Loading` | Accessible text shown during loading                     |
| `disabled`         | boolean                                                               | `false`   | Disables the button                                      |
| `full-width`       | boolean                                                               | `false`   | Spans full container width                               |
| `pill`             | boolean                                                               | `false`   | Pill / fully-rounded corners                             |
| `name`             | string                                                                | —         | Form field name                                          |
| `value`            | string                                                                | `''`      | Submitted value                                          |
| `form`             | string                                                                | —         | Associates with a form by ID                             |
| `autofocus`        | boolean                                                               | `false`   | Autofocus on page load                                   |
| `id`               | string                                                                | —         | Forwarded to the native `<button>`                       |
| `title`            | string                                                                | —         | Forwarded to the native `<button>`                       |
| `aria-label`       | string                                                                | —         | Forwarded to the native `<button>`                       |
| `aria-labelledby`  | string                                                                | —         | Forwarded to the native `<button>`                       |
| `aria-describedby` | string                                                                | —         | Forwarded to the native `<button>`                       |

**Events** — native button events bubble normally (`click`, `focus`, `blur`).

**Content projection** — place children inside `<sp-button>` to use them as
button content instead of the `label` property:

```html
<sp-button variant="primary">
  <svg aria-hidden="true">...</svg>
  Save changes
</sp-button>
```

**Internal target** — `[data-sp-button-native]` selects the native `<button>`.

---

### sp-input

Renders an `<input>` with state, size, and type support.

**Attributes**

| Attribute                 | Type                                                                                                             | Default | Description                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------- |
| `type`                    | `text \| email \| password \| search \| tel \| url \| number \| date \| datetime-local \| month \| time \| week` | `text`  | Native input type             |
| `size`                    | `sm \| md \| lg`                                                                                                 | `md`    | Control size                  |
| `name`                    | string                                                                                                           | —       | Form field name               |
| `value`                   | string                                                                                                           | `''`    | Current value                 |
| `placeholder`             | string                                                                                                           | —       | Placeholder text              |
| `disabled`                | boolean                                                                                                          | `false` | Disables the input            |
| `loading`                 | boolean                                                                                                          | `false` | Busy state                    |
| `readonly`                | boolean                                                                                                          | `false` | Read-only mode                |
| `required`                | boolean                                                                                                          | `false` | Marks field as required       |
| `invalid`                 | boolean                                                                                                          | `false` | Error state (`aria-invalid`)  |
| `success`                 | boolean                                                                                                          | `false` | Success state                 |
| `full-width`              | boolean                                                                                                          | `false` | Spans full container width    |
| `pill`                    | boolean                                                                                                          | `false` | Pill / fully-rounded corners  |
| `autocomplete`            | string                                                                                                           | —       | Native autocomplete hint      |
| `inputmode`               | string                                                                                                           | —       | Virtual keyboard hint         |
| `min` / `max` / `step`    | string                                                                                                           | —       | Numeric/date range            |
| `minlength` / `maxlength` | number                                                                                                           | —       | Character length constraints  |
| `form`                    | string                                                                                                           | —       | Associates with a form by ID  |
| `autofocus`               | boolean                                                                                                          | `false` | Autofocus on page load        |
| `id` / `title` / `aria-*` | string                                                                                                           | —       | Forwarded to native `<input>` |

**Events** — `input` and `change` fire from the native `<input>` and bubble.

**Internal target** — `[data-sp-input-native]` selects the native `<input>`.

---

### sp-textarea

Renders a `<textarea>` with row control and resize support.

**Attributes** — same as `sp-input` except no `type`, `min`, `max`, `step`, and
adds:

| Attribute | Type   | Default | Description        |
| --------- | ------ | ------- | ------------------ |
| `rows`    | number | `2`     | Visible row height |

**Events** — `input` and `change` fire from the native `<textarea>`.

**Internal target** — `[data-sp-textarea-native]` selects the native
`<textarea>`.

---

### sp-select

Renders a `<select>`. Pass `<option>` elements as children — they are projected
into the native select element.

**Attributes** — same as `sp-input` minus `type`, `placeholder`, `readonly`,
`inputmode`, `min`, `max`, `step`, `minlength`, `maxlength`.

**Events** — `input` and `change` fire from the native `<select>`.

**Content projection** — `<option>` and `<optgroup>` children are moved into the
native `<select>`:

```html
<sp-select name="country" required>
  <option value="">Select a country</option>
  <optgroup label="Americas">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </optgroup>
</sp-select>
```

**Internal target** — `[data-sp-select-native]` selects the native `<select>`.

---

### sp-checkbox

Renders a `<label>` wrapping an `<input type="checkbox">` with indicator.

**Attributes**

| Attribute                                        | Type    | Default | Description                                   |
| ------------------------------------------------ | ------- | ------- | --------------------------------------------- |
| `name`                                           | string  | —       | Form field name                               |
| `value`                                          | string  | `on`    | Submitted value when checked                  |
| `checked`                                        | boolean | `false` | Checked state                                 |
| `label`                                          | string  | —       | Text label (overridden by content projection) |
| `disabled`                                       | boolean | `false` | Disables the checkbox                         |
| `loading`                                        | boolean | `false` | Busy state                                    |
| `required`                                       | boolean | `false` | Marks field as required                       |
| `invalid`                                        | boolean | `false` | Error state                                   |
| `success`                                        | boolean | `false` | Success state                                 |
| `form` / `autofocus` / `id` / `title` / `aria-*` | —       | —       | Forwarded to native `<input>`                 |

**Events** — `input` and `change` fire from the native checkbox input.

**Content projection** — children become the label content (supports rich
markup):

```html
<sp-checkbox name="terms" value="accepted" required>
  I accept the <a href="/terms">terms of service</a>
</sp-checkbox>
```

**Internal target** — `[data-sp-checkbox-native]` selects the native checkbox.

---

### sp-radio

Renders a `<label>` wrapping an `<input type="radio">` with indicator. Group
multiple `sp-radio` elements by giving them the same `name`.

**Attributes** — same as `sp-checkbox`. `value` defaults to `on`.

**Events** — `input` and `change` fire from the native radio input.

**Content projection** — same as `sp-checkbox`.

```html
<sp-radio name="plan" value="monthly">Monthly — $9/mo</sp-radio>
<sp-radio name="plan" value="annual">Annual — $90/yr</sp-radio>
```

**Internal target** — `[data-sp-radio-native]` selects the native radio input.

---

### sp-label

Renders a `<label>` with `for` forwarding. Use to associate a visible label with
any form control.

**Attributes**

| Attribute                 | Type   | Default | Description                                                  |
| ------------------------- | ------ | ------- | ------------------------------------------------------------ |
| `for`                     | string | —       | ID of the associated control (forwarded to native `<label>`) |
| `id` / `title` / `aria-*` | string | —       | Forwarded to native `<label>`                                |

**Content projection** — children become the label text (supports rich markup):

```html
<sp-label for="email">
  Email address <span aria-hidden="true">*</span>
</sp-label>
```

**Internal target** — `[data-sp-label-native]` selects the native `<label>`.

---

### sp-fieldset

Renders a `<fieldset>` with optional legend and group-level state.

**Attributes**

| Attribute                                   | Type    | Default | Description                        |
| ------------------------------------------- | ------- | ------- | ---------------------------------- |
| `legend`                                    | string  | —       | Text for the `<legend>` element    |
| `disabled`                                  | boolean | `false` | Disables all controls in the group |
| `loading`                                   | boolean | `false` | Busy state                         |
| `invalid`                                   | boolean | `false` | Group-level error state            |
| `success`                                   | boolean | `false` | Group-level success state          |
| `form` / `name` / `id` / `title` / `aria-*` | string  | —       | Forwarded to native `<fieldset>`   |

**Content projection** — children are placed inside the native `<fieldset>`
alongside the legend:

```html
<sp-fieldset legend="Billing address" name="billing">
  <sp-label for="city">City</sp-label>
  <sp-input id="city" name="city" required></sp-input>

  <sp-label for="zip">ZIP code</sp-label>
  <sp-input id="zip" name="zip" type="text" maxlength="10"></sp-input>
</sp-fieldset>
```

**Internal target** — `[data-sp-fieldset-native]` selects the native
`<fieldset>`.

---

### sp-badge

Renders a `<span>` display primitive backed by the Spectre badge recipe.

**Attributes**

| Attribute                 | Type                                                                                                           | Default   | Description                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------- |
| `variant`                 | `primary \| secondary \| ghost \| danger \| success \| warning \| info \| accent \| cta \| neutral \| outline` | `primary` | Visual style                     |
| `size`                    | `sm \| md \| lg`                                                                                               | `md`      | Badge size                       |
| `disabled`                | boolean                                                                                                        | `false`   | Disabled visual state            |
| `loading`                 | boolean                                                                                                        | `false`   | Busy visual state                |
| `full-width`              | boolean                                                                                                        | `false`   | Spans full container width       |
| `id` / `title` / `aria-*` | string                                                                                                         | —         | Forwarded to the native `<span>` |

**Content projection** — children become the badge content.

**Internal target** — `[data-sp-badge-native]` selects the native `<span>`.

---

### sp-card

Renders a `<div>` container backed by the Spectre card recipe.

**Attributes**

| Attribute                 | Type                                   | Default    | Description                     |
| ------------------------- | -------------------------------------- | ---------- | ------------------------------- |
| `variant`                 | `elevated \| flat \| outline \| ghost` | `elevated` | Visual style                    |
| `padded`                  | boolean                                | `true`     | Applies card padding            |
| `full-height`             | boolean                                | `false`    | Spans full container height     |
| `interactive`             | boolean                                | `false`    | Applies interactive styling     |
| `disabled`                | boolean                                | `false`    | Disabled visual state           |
| `loading`                 | boolean                                | `false`    | Busy visual state               |
| `id` / `title` / `aria-*` | string                                 | —          | Forwarded to the native `<div>` |

**Content projection** — children become the card content.

**Internal target** — `[data-sp-card-native]` selects the native `<div>`.

---

### sp-icon-box

Renders a `<div>` icon container backed by the Spectre icon-box recipe.

**Attributes**

| Attribute                 | Type                                                                                                           | Default   | Description                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------- |
| `variant`                 | `primary \| secondary \| ghost \| danger \| success \| warning \| info \| accent \| cta \| neutral \| outline` | `primary` | Visual style                    |
| `size`                    | `sm \| md \| lg`                                                                                               | `md`      | Icon-box size                   |
| `disabled`                | boolean                                                                                                        | `false`   | Disabled visual state           |
| `loading`                 | boolean                                                                                                        | `false`   | Busy visual state               |
| `interactive`             | boolean                                                                                                        | `false`   | Applies interactive styling     |
| `pill`                    | boolean                                                                                                        | `false`   | Pill / fully-rounded corners    |
| `full-width`              | boolean                                                                                                        | `false`   | Spans full container width      |
| `id` / `title` / `aria-*` | string                                                                                                         | —         | Forwarded to the native `<div>` |

**Content projection** — children become the icon-box content.

**Internal target** — `[data-sp-icon-box-native]` selects the native `<div>`.

---

### sp-rating

Renders a read-only rating visualization with generated star spans.

**Attributes**

| Attribute                 | Type             | Default | Description                            |
| ------------------------- | ---------------- | ------- | -------------------------------------- |
| `value`                   | number           | `0`     | Filled star count                      |
| `max`                     | number           | `5`     | Total star count                       |
| `size`                    | `sm \| md \| lg` | `md`    | Rating size                            |
| `label`                   | string           | —       | Optional visible text beside the stars |
| `disabled`                | boolean          | `false` | Disabled visual state                  |
| `loading`                 | boolean          | `false` | Busy visual state                      |
| `id` / `title` / `aria-*` | string           | —       | Forwarded to the rating container      |

**Accessibility** — renders `role="img"` and computes an accessible label like
`Rating: 4 out of 5` unless `aria-label` is provided.

**Internal target** — `[data-sp-rating-native]` selects the rating container.

---

### sp-testimonial

Renders a `<div>` testimonial container backed by the Spectre testimonial
recipe.

**Attributes**

| Attribute                 | Type                                   | Default    | Description                     |
| ------------------------- | -------------------------------------- | ---------- | ------------------------------- |
| `variant`                 | `elevated \| flat \| outline \| ghost` | `elevated` | Visual style                    |
| `full-height`             | boolean                                | `false`    | Spans full container height     |
| `interactive`             | boolean                                | `false`    | Applies interactive styling     |
| `disabled`                | boolean                                | `false`    | Disabled visual state           |
| `loading`                 | boolean                                | `false`    | Busy visual state               |
| `id` / `title` / `aria-*` | string                                 | —          | Forwarded to the native `<div>` |

**Content projection** — children become the testimonial content.

**Internal target** — `[data-sp-testimonial-native]` selects the native `<div>`.

## Package exports / API surface

### Root — `@phcdevworks/spectre-components`

Exports everything from all component entry points plus the bulk registration
helper.

**Bulk registration**

```ts
import { defineSpectreComponents } from '@phcdevworks/spectre-components'
defineSpectreComponents() // registers all sp-* elements
```

**Per-component helpers** (same as individual entry points):
`defineSpectreButton`, `defineSpectreInput`, `defineSpectreTextarea`,
`defineSpectreSelect`, `defineSpectreCheckbox`, `defineSpectreRadio`,
`defineSpectreLabel`, `defineSpectreFieldset`, `defineSpectreBadge`,
`defineSpectreCard`, `defineSpectreIconBox`, `defineSpectreRating`,
`defineSpectreTestimonial`

**Element classes**: `SpectreButtonElement`, `SpectreInputElement`,
`SpectreTextareaElement`, `SpectreSelectElement`, `SpectreCheckboxElement`,
`SpectreRadioElement`, `SpectreLabelElement`, `SpectreFieldsetElement`,
`SpectreBadgeElement`, `SpectreCardElement`, `SpectreIconBoxElement`,
`SpectreRatingElement`, `SpectreTestimonialElement`

**Button constants and types**: `spectreButtonVariants`, `spectreButtonSizes`,
`spectreButtonTypes`, `SpectreButtonVariant`, `SpectreButtonSize`,
`SpectreButtonType`, `SpectreButtonProps`

**Input / textarea / select constants and types**: `spectreInputSizes`,
`spectreInputTypes`, `SpectreInputSize`, `SpectreInputType`,
`SpectreInputProps`, `SpectreTextareaProps`, `SpectreSelectProps`

**Props interfaces** (checkbox / radio / label / fieldset):
`SpectreCheckboxProps`, `SpectreRadioProps`, `SpectreLabelProps`,
`SpectreFieldsetProps`

**Display constants and types**: `spectreBadgeVariants`, `spectreBadgeSizes`,
`spectreCardVariants`, `spectreIconBoxVariants`, `spectreIconBoxSizes`,
`spectreRatingSizes`, `spectreTestimonialVariants`, `SpectreBadgeVariant`,
`SpectreBadgeSize`, `SpectreCardVariant`, `SpectreIconBoxVariant`,
`SpectreIconBoxSize`, `SpectreRatingSize`, `SpectreTestimonialVariant`,
`SpectreBadgeProps`, `SpectreCardProps`, `SpectreIconBoxProps`,
`SpectreRatingProps`, `SpectreTestimonialProps`

### Subpath entry points

Each entry point registers only that component and exports only its surface:

| Entry point       | Registers        | Key exports                                                                              |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `.../button`      | `sp-button`      | `defineSpectreButton`, `SpectreButtonElement`, button constants and types                |
| `.../input`       | `sp-input`       | `defineSpectreInput`, `SpectreInputElement`, input constants and types                   |
| `.../textarea`    | `sp-textarea`    | `defineSpectreTextarea`, `SpectreTextareaElement`, `SpectreTextareaProps`                |
| `.../select`      | `sp-select`      | `defineSpectreSelect`, `SpectreSelectElement`, `SpectreSelectProps`                      |
| `.../checkbox`    | `sp-checkbox`    | `defineSpectreCheckbox`, `SpectreCheckboxElement`, `SpectreCheckboxProps`                |
| `.../radio`       | `sp-radio`       | `defineSpectreRadio`, `SpectreRadioElement`, `SpectreRadioProps`                         |
| `.../label`       | `sp-label`       | `defineSpectreLabel`, `SpectreLabelElement`, `SpectreLabelProps`                         |
| `.../fieldset`    | `sp-fieldset`    | `defineSpectreFieldset`, `SpectreFieldsetElement`, `SpectreFieldsetProps`                |
| `.../badge`       | `sp-badge`       | `defineSpectreBadge`, `SpectreBadgeElement`, badge constants and types                   |
| `.../card`        | `sp-card`        | `defineSpectreCard`, `SpectreCardElement`, card constants and types                      |
| `.../icon-box`    | `sp-icon-box`    | `defineSpectreIconBox`, `SpectreIconBoxElement`, icon-box constants and types            |
| `.../rating`      | `sp-rating`      | `defineSpectreRating`, `SpectreRatingElement`, rating constants and types                |
| `.../testimonial` | `sp-testimonial` | `defineSpectreTestimonial`, `SpectreTestimonialElement`, testimonial constants and types |

Size constants are shared between input, textarea, and select. Import
`spectreInputSizes` / `SpectreInputSize` from `.../input` when needed alongside
textarea or select.

## Relationship to the rest of Spectre

```
spectre-tokens  →  design values (colors, spacing, typography)
spectre-ui      →  CSS recipes and Tailwind helpers
spectre-components  →  Lit web component behavior  ← you are here
[adapters]      →  React / Vue / Astro wrappers
```

The Golden Rule: **tokens define meaning, UI defines structure, components
define behavior, adapters define delivery.** This package only owns the behavior
layer.

## Development

```bash
git clone https://github.com/phcdevworks/spectre-components.git
cd spectre-components
npm install
npm run check        # full release validation gate
```

Requires Node.js `^22.13.0 || >=24.0.0` and npm `11.16.0`.

| Command                    | Purpose                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run check`            | Full validation (lint → typecheck → test → build → export, contract, invariant, and ecosystem checks) |
| `npm run build`            | Compile ESM + CJS with declarations into `dist/`                                                      |
| `npm test`                 | Run Vitest suite under happy-dom                                                                      |
| `npm run lint`             | ESLint                                                                                                |
| `npm run check:exports`    | Verify built subpath exports resolve correctly                                                        |
| `npm run check:contract`   | Verify built exports match `components.contract.json`                                                 |
| `npm run check:invariants` | Verify light-DOM and no-hardcoded-visual invariants                                                   |
| `npm run check:ecosystem`  | Validate `spectre.manifest.json`                                                                      |
| `npm run dev`              | tsup watch mode                                                                                       |
| `npm run clean`            | Remove `dist/` and `coverage/`                                                                        |

Key source areas:

- `src/components/` — one directory per custom element
- `src/utils/` — `base.ts`, `projectable.ts`, `form.ts`, `dom.ts`
- `src/index.ts` — root public API and bulk registration helper
- `tests/` — component behavior coverage (Vitest + happy-dom)
- `scripts/check-exports.ts` — post-build export resolution check

## Troubleshooting

**Build fails with type errors** — TypeScript 6 is required. Run `npm install`,
then `npm run build`.

**Tests fail in CI but pass locally** — Tests run under happy-dom. Confirm you
are on Node `^22.13.0 || >=24.0.0`. CI tests both versions.

**Custom element already defined** — Each `defineSpectre*()` helper is
idempotent; calling it twice is safe. If you see conflicts, two different
versions of this package may be loaded in the same page.

**Styles are not applying** — The Spectre CSS layers must load before components
are registered. Import `@phcdevworks/spectre-tokens/index.css` and
`@phcdevworks/spectre-ui/index.css` at the top of your entry module.

**Properties not reflecting in React 18** — React 18 sets custom element
properties as attributes. Use a `ref` to set properties imperatively, or upgrade
to React 19 which supports custom elements fully.

## Validation

Run the full validation gate before any pull request:

```bash
npm run check
```

This runs: lint → typecheck → tests → build → export validation → contract
validation → invariant checks → ecosystem manifest validation. All steps must
pass.

## AI and automation boundaries

Claude Code (`claude-sonnet-4-6`) is the primary development agent for this
repository. Codex handles releases and production stabilization. Jules handles
small automated fixes and dependency updates. GitHub Copilot provides
development support.

Claude Code, Codex, and Copilot do not create git commits by default. Jules may
commit only bounded automated maintenance when the `JULES.md` scope and
validation gates pass. Release decisions, tags, and publishing remain with
Bradley Potts.

**Protected from automated change:** component public API surface (tags,
properties, events, slots, ARIA), the light-DOM rendering model, and the
zero-hardcode-values rule. See [AGENTS.md](AGENTS.md) for full agent governance
and boundary rules.

## Contributing

PHCDevworks maintains this package as part of the Spectre suite.

Contribution boundaries:

- Components must consume `@phcdevworks/spectre-ui` class helpers — do not
  recreate CSS locally.
- Design values must come from `@phcdevworks/spectre-tokens` — do not hardcode
  colors, spacing, or other visual primitives.
- Component tags, properties, events, slots, and ARIA behavior are stable API —
  breaking changes require a semver major bump.
- Render in light DOM only — Shadow DOM changes require design-system approval.
- No framework-specific code — no JSX, SFCs, or Astro components in this
  package.
- Run `npm run check` before opening a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## License

MIT © PHCDevworks. See [LICENSE](LICENSE).
