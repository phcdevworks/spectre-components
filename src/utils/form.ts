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
