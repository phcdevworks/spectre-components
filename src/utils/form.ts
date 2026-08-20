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

export const spectreGridAligns = [
  'start',
  'center',
  'end',
  'baseline',
  'stretch'
] as const

export type SpectreGridAlign = (typeof spectreGridAligns)[number]

export function isGridAlign(value: unknown): value is SpectreGridAlign {
  return (spectreGridAligns as readonly string[]).includes(value as string)
}

export const spectreGridSpans = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  'full'
] as const

export type SpectreGridSpan = (typeof spectreGridSpans)[number]

export function isGridSpan(value: unknown): value is SpectreGridSpan {
  return (spectreGridSpans as readonly (number | string)[]).includes(
    value as number | string
  )
}

export interface SpectreGridSpanOptions {
  base?: SpectreGridSpan
  md?: SpectreGridSpan
  lg?: SpectreGridSpan
}

export function isGridSpanOptions(
  value: unknown
): value is SpectreGridSpanOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridSpan(candidate.base)) &&
    (candidate.md === undefined || isGridSpan(candidate.md)) &&
    (candidate.lg === undefined || isGridSpan(candidate.lg))
  )
}

export const spectreGridOffsets = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
] as const

export type SpectreGridOffset = (typeof spectreGridOffsets)[number]

export function isGridOffset(value: unknown): value is SpectreGridOffset {
  return (spectreGridOffsets as readonly number[]).includes(value as number)
}

export interface SpectreGridOffsetOptions {
  base?: SpectreGridOffset
  md?: SpectreGridOffset
  lg?: SpectreGridOffset
}

export function isGridOffsetOptions(
  value: unknown
): value is SpectreGridOffsetOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridOffset(candidate.base)) &&
    (candidate.md === undefined || isGridOffset(candidate.md)) &&
    (candidate.lg === undefined || isGridOffset(candidate.lg))
  )
}

export const spectreGridOrders = [
  'first',
  'last',
  'none',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12
] as const

export type SpectreGridOrder = (typeof spectreGridOrders)[number]

export function isGridOrder(value: unknown): value is SpectreGridOrder {
  return (spectreGridOrders as readonly (number | string)[]).includes(
    value as number | string
  )
}

export interface SpectreGridOrderOptions {
  base?: SpectreGridOrder
  md?: SpectreGridOrder
  lg?: SpectreGridOrder
}

export function isGridOrderOptions(
  value: unknown
): value is SpectreGridOrderOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridOrder(candidate.base)) &&
    (candidate.md === undefined || isGridOrder(candidate.md)) &&
    (candidate.lg === undefined || isGridOrder(candidate.lg))
  )
}

export const spectreGridLeadingWeights = [1.5, 1.6, 2, 2.5, 3] as const

export type SpectreGridLeadingWeight =
  (typeof spectreGridLeadingWeights)[number]

export function isGridLeadingWeight(
  value: unknown
): value is SpectreGridLeadingWeight {
  return (spectreGridLeadingWeights as readonly number[]).includes(
    value as number
  )
}

export interface SpectreGridLeadingWeightOptions {
  base?: SpectreGridLeadingWeight
  md?: SpectreGridLeadingWeight
  lg?: SpectreGridLeadingWeight
}

export function isGridLeadingWeightOptions(
  value: unknown
): value is SpectreGridLeadingWeightOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridLeadingWeight(candidate.base)) &&
    (candidate.md === undefined || isGridLeadingWeight(candidate.md)) &&
    (candidate.lg === undefined || isGridLeadingWeight(candidate.lg))
  )
}

export interface SpectreGridLeadingTracksOptions {
  weight: SpectreGridLeadingWeight | SpectreGridLeadingWeightOptions
}

export function isGridLeadingTracksOptions(
  value: unknown
): value is SpectreGridLeadingTracksOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    isGridLeadingWeight(candidate.weight) ||
    isGridLeadingWeightOptions(candidate.weight)
  )
}

export const spectreGridFixedTrackCounts = [1, 2, 3, 4] as const

export type SpectreGridFixedTrackCount =
  (typeof spectreGridFixedTrackCounts)[number]

export function isGridFixedTrackCount(
  value: unknown
): value is SpectreGridFixedTrackCount {
  return (spectreGridFixedTrackCounts as readonly number[]).includes(
    value as number
  )
}

export interface SpectreGridFixedTracksOptions {
  count: SpectreGridFixedTrackCount
}

export function isGridFixedTracksOptions(
  value: unknown
): value is SpectreGridFixedTracksOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return isGridFixedTrackCount(candidate.count)
}

export const spectreGridTemplates = [
  'edge-fluid-edge',
  'label-fluid-fluid'
] as const

export type SpectreGridTemplate = (typeof spectreGridTemplates)[number]

export function isGridTemplate(value: unknown): value is SpectreGridTemplate {
  return (spectreGridTemplates as readonly string[]).includes(value as string)
}

export interface SpectreGridExplicitTemplateOptions {
  template: SpectreGridTemplate
  weight?: SpectreGridLeadingWeight
}

export function isGridExplicitTemplateOptions(
  value: unknown
): value is SpectreGridExplicitTemplateOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    isGridTemplate(candidate.template) &&
    (candidate.weight === undefined || isGridLeadingWeight(candidate.weight))
  )
}

export const spectreStackDirections = ['vertical', 'horizontal'] as const

export type SpectreStackDirection = (typeof spectreStackDirections)[number]

export function isStackDirection(
  value: unknown
): value is SpectreStackDirection {
  return (spectreStackDirections as readonly string[]).includes(value as string)
}

export const spectreStackBases = ['sidebar'] as const

export type SpectreStackBasis = (typeof spectreStackBases)[number]

export function isStackBasis(value: unknown): value is SpectreStackBasis {
  return (spectreStackBases as readonly string[]).includes(value as string)
}

export const spectreNavAligns = ['start', 'center', 'end'] as const

export type SpectreNavAlign = (typeof spectreNavAligns)[number]

export function isNavAlign(value: unknown): value is SpectreNavAlign {
  return (spectreNavAligns as readonly string[]).includes(value as string)
}

export const spectreStackAligns = ['center', 'stretch'] as const

export type SpectreStackAlign = (typeof spectreStackAligns)[number]

export function isStackAlign(value: unknown): value is SpectreStackAlign {
  return (spectreStackAligns as readonly string[]).includes(value as string)
}

export const spectreStackGaps = ['sm', 'md', 'lg'] as const

export type SpectreStackGap = (typeof spectreStackGaps)[number]

export function isStackGap(value: unknown): value is SpectreStackGap {
  return (spectreStackGaps as readonly string[]).includes(value as string)
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

export const spectreSidebarLinkLevels = ['parent', 'child'] as const

export type SpectreSidebarLinkLevel = (typeof spectreSidebarLinkLevels)[number]

export function isSidebarLinkLevel(
  value: unknown
): value is SpectreSidebarLinkLevel {
  return (spectreSidebarLinkLevels as readonly string[]).includes(
    value as string
  )
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

export const spectreTextSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl'
] as const

export type SpectreTextSize = (typeof spectreTextSizes)[number]

export function isTextSize(value: unknown): value is SpectreTextSize {
  return (spectreTextSizes as readonly string[]).includes(value as string)
}

export const spectreTextVariants = [
  'default',
  'muted',
  'subtle',
  'meta',
  'brand'
] as const

export type SpectreTextVariant = (typeof spectreTextVariants)[number]

export function isTextVariant(value: unknown): value is SpectreTextVariant {
  return (spectreTextVariants as readonly string[]).includes(value as string)
}

export const spectreTextFamilies = ['sans', 'serif', 'mono'] as const

export type SpectreTextFamily = (typeof spectreTextFamilies)[number]

export function isTextFamily(value: unknown): value is SpectreTextFamily {
  return (spectreTextFamilies as readonly string[]).includes(value as string)
}

export const spectreTextLevels = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span'
] as const

export type SpectreTextLevel = (typeof spectreTextLevels)[number]

export function isTextLevel(value: unknown): value is SpectreTextLevel {
  return (spectreTextLevels as readonly string[]).includes(value as string)
}

export const spectreTextTransforms = [
  'none',
  'uppercase',
  'lowercase',
  'capitalize'
] as const

export type SpectreTextTransform = (typeof spectreTextTransforms)[number]

export function isTextTransform(value: unknown): value is SpectreTextTransform {
  return (spectreTextTransforms as readonly string[]).includes(value as string)
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

const spectreUtilityClassPattern =
  /^sp-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/

export function sanitizeUtilityClasses(
  value: string | null | undefined
): string {
  if (!value) {
    return ''
  }
  return value
    .split(/\s+/)
    .filter((token) => spectreUtilityClassPattern.test(token))
    .join(' ')
}
