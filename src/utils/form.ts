import {
  type ButtonSize,
  type ButtonVariant,
  type InputSize
} from '@phcdevworks/spectre-ui'

export const spectreInputSizes = ['sm', 'md', 'lg'] as const
export type SpectreInputSize = (typeof spectreInputSizes)[number]

export function isInputSize(value: unknown): value is InputSize | ButtonSize {
  return (spectreInputSizes as readonly string[]).includes(value as string)
}

export const spectreButtonVariants = [
  'primary',
  'secondary',
  'ghost',
  'danger',
  'success',
  'cta',
  'accent'
] as const

export type SpectreButtonVariant = (typeof spectreButtonVariants)[number]

export function isButtonVariant(value: unknown): value is ButtonVariant {
  return (spectreButtonVariants as readonly string[]).includes(value as string)
}

export const spectreButtonTypes = ['button', 'submit', 'reset'] as const

export type SpectreButtonType = (typeof spectreButtonTypes)[number]

export function isButtonType(value: unknown): value is SpectreButtonType {
  return (spectreButtonTypes as readonly string[]).includes(value as string)
}

export const spectreInputTypes = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week'
] as const

export type SpectreInputType = (typeof spectreInputTypes)[number]

export function isInputType(value: unknown): value is SpectreInputType {
  return (spectreInputTypes as readonly string[]).includes(value as string)
}

export const spectreBadgeVariants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'neutral',
  'info',
  'ghost',
  'outline',
  'accent',
  'cta'
] as const

export type SpectreBadgeVariant = (typeof spectreBadgeVariants)[number]

export function isBadgeVariant(value: unknown): value is SpectreBadgeVariant {
  return (spectreBadgeVariants as readonly string[]).includes(value as string)
}

export const spectreAlertVariants = [
  'info',
  'success',
  'warning',
  'danger',
  'neutral'
] as const

export type SpectreAlertVariant = (typeof spectreAlertVariants)[number]

export function isAlertVariant(value: unknown): value is SpectreAlertVariant {
  return (spectreAlertVariants as readonly string[]).includes(value as string)
}

export const spectreCardVariants = [
  'elevated',
  'flat',
  'outline',
  'ghost'
] as const

export type SpectreCardVariant = (typeof spectreCardVariants)[number]

export function isCardVariant(value: unknown): value is SpectreCardVariant {
  return (spectreCardVariants as readonly string[]).includes(value as string)
}

export const spectreIconBoxVariants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'ghost',
  'accent',
  'cta',
  'outline'
] as const

export type SpectreIconBoxVariant = (typeof spectreIconBoxVariants)[number]

export function isIconBoxVariant(
  value: unknown
): value is SpectreIconBoxVariant {
  return (spectreIconBoxVariants as readonly string[]).includes(value as string)
}

export const spectreTestimonialVariants = [
  'elevated',
  'flat',
  'outline',
  'ghost'
] as const

export type SpectreTestimonialVariant =
  (typeof spectreTestimonialVariants)[number]

export function isTestimonialVariant(
  value: unknown
): value is SpectreTestimonialVariant {
  return (spectreTestimonialVariants as readonly string[]).includes(
    value as string
  )
}

export const spectreSpinnerVariants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'accent',
  'cta'
] as const

export type SpectreSpinnerVariant = (typeof spectreSpinnerVariants)[number]

export function isSpinnerVariant(
  value: unknown
): value is SpectreSpinnerVariant {
  return (spectreSpinnerVariants as readonly string[]).includes(value as string)
}

export const spectreTagVariants = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'accent',
  'cta',
  'outline',
  'ghost'
] as const

export type SpectreTagVariant = (typeof spectreTagVariants)[number]

export function isTagVariant(value: unknown): value is SpectreTagVariant {
  return (spectreTagVariants as readonly string[]).includes(value as string)
}

export const spectreAvatarSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type SpectreAvatarSize = (typeof spectreAvatarSizes)[number]

export function isAvatarSize(value: unknown): value is SpectreAvatarSize {
  return (spectreAvatarSizes as readonly string[]).includes(value as string)
}

export const spectreAvatarShapes = ['circle', 'square'] as const

export type SpectreAvatarShape = (typeof spectreAvatarShapes)[number]

export function isAvatarShape(value: unknown): value is SpectreAvatarShape {
  return (spectreAvatarShapes as readonly string[]).includes(value as string)
}

export const spectreContainerMaxWidths = ['prose'] as const

export type SpectreContainerMaxWidth =
  (typeof spectreContainerMaxWidths)[number]

export function isContainerMaxWidth(
  value: unknown
): value is SpectreContainerMaxWidth {
  return (spectreContainerMaxWidths as readonly string[]).includes(
    value as string
  )
}

export const spectreGridColumns = [1, 2, 3, 4, 6, 12] as const

export type SpectreGridColumns = (typeof spectreGridColumns)[number]

export function isGridColumns(value: unknown): value is SpectreGridColumns {
  return (spectreGridColumns as readonly number[]).includes(value as number)
}

export const spectreGridGaps = ['sm', 'md', 'lg'] as const

export type SpectreGridGap = (typeof spectreGridGaps)[number]

export function isGridGap(value: unknown): value is SpectreGridGap {
  return (spectreGridGaps as readonly string[]).includes(value as string)
}

export const spectreStackDirections = ['vertical', 'horizontal'] as const

export type SpectreStackDirection = (typeof spectreStackDirections)[number]

export function isStackDirection(
  value: unknown
): value is SpectreStackDirection {
  return (spectreStackDirections as readonly string[]).includes(
    value as string
  )
}

export const spectreStackBases = ['sidebar'] as const

export type SpectreStackBasis = (typeof spectreStackBases)[number]

export function isStackBasis(value: unknown): value is SpectreStackBasis {
  return (spectreStackBases as readonly string[]).includes(value as string)
}

export const spectreStackAligns = ['center', 'stretch'] as const

export type SpectreStackAlign = (typeof spectreStackAligns)[number]

export function isStackAlign(value: unknown): value is SpectreStackAlign {
  return (spectreStackAligns as readonly string[]).includes(value as string)
}

export const spectreDropdownPlacements = [
  'bottom-start',
  'bottom-end',
  'top-start',
  'top-end'
] as const

export type SpectreDropdownPlacement =
  (typeof spectreDropdownPlacements)[number]

export function isDropdownPlacement(
  value: unknown
): value is SpectreDropdownPlacement {
  return (spectreDropdownPlacements as readonly string[]).includes(
    value as string
  )
}

export const spectreToastVariants = [
  'info',
  'success',
  'warning',
  'danger'
] as const

export type SpectreToastVariant = (typeof spectreToastVariants)[number]

export function isToastVariant(value: unknown): value is SpectreToastVariant {
  return (spectreToastVariants as readonly string[]).includes(value as string)
}

export const spectreTooltipPlacements = [
  'top',
  'bottom',
  'left',
  'right'
] as const

export type SpectreTooltipPlacement = (typeof spectreTooltipPlacements)[number]

export function isTooltipPlacement(
  value: unknown
): value is SpectreTooltipPlacement {
  return (spectreTooltipPlacements as readonly string[]).includes(
    value as string
  )
}

export function normalizeInt(
  value: unknown,
  fallback: number | undefined,
  min = 0
): number | undefined {
  if (
    value == null ||
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < min
  ) {
    return fallback
  }
  return value
}
