// Recipe-forced interaction states. Real interaction is styled by native
// pseudo-classes; these force the look for documentation, previews, and
// visual tests.
export const hoverFocusStateProperties = {
  focused: { type: Boolean, reflect: true },
  hovered: { type: Boolean, reflect: true }
} as const

export const interactionStateProperties = {
  ...hoverFocusStateProperties,
  active: { type: Boolean, reflect: true }
} as const

export interface SpectreHoverFocusStateProps {
  focused?: boolean | undefined
  hovered?: boolean | undefined
}

export interface SpectreInteractionStateProps extends SpectreHoverFocusStateProps {
  active?: boolean | undefined
}

export function hoverFocusStates(element: SpectreHoverFocusStateProps): {
  focused: boolean
  hovered: boolean
} {
  return {
    focused: element.focused ?? false,
    hovered: element.hovered ?? false
  }
}

export function interactionStates(element: SpectreInteractionStateProps): {
  active: boolean
  focused: boolean
  hovered: boolean
} {
  return { ...hoverFocusStates(element), active: element.active ?? false }
}
