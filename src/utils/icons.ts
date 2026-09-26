import { html, svg, type TemplateResult } from 'lit'

const paths = {
  check: svg`<path d="M3 8.5l3 3 7-7" />`,
  chevronDown: svg`<path d="M4 6l4 4 4-4" />`,
  chevronLeft: svg`<path d="M10 4l-4 4 4 4" />`,
  chevronRight: svg`<path d="M6 4l4 4-4 4" />`,
  close: svg`<path d="M4 4l8 8M12 4l-8 8" />`
}

export type SpectreIconName = keyof typeof paths

// Decorative stroke icons; sizing comes from an `sp-icon-*` utility class.
export function renderIcon(
  name: SpectreIconName,
  sizeClass = 'sp-icon-sm'
): TemplateResult {
  return html`<svg
    aria-hidden="true"
    class="${sizeClass}"
    fill="none"
    focusable="false"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 16 16"
  >
    ${paths[name]}
  </svg>`
}
