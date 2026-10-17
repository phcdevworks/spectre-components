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
  'accent',
  'accentOutline',
  'inverse',
  'warning',
  'link',
  'light',
  'dark'
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
  'cta',
  'inverse',
  'brand'
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
  'neutral',
  'brand'
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

export const spectreCardPaddingSizes = ['sm', 'md', 'lg'] as const

export type SpectreCardPaddingSize = (typeof spectreCardPaddingSizes)[number]

export function isCardPaddingSize(
  value: unknown
): value is SpectreCardPaddingSize {
  return (spectreCardPaddingSizes as readonly string[]).includes(
    value as string
  )
}

export const spectreAccentEdges = ['top', 'right', 'bottom', 'left'] as const

export type SpectreAccentEdge = (typeof spectreAccentEdges)[number]

export function isAccentEdge(value: unknown): value is SpectreAccentEdge {
  return (spectreAccentEdges as readonly string[]).includes(value as string)
}

export const spectreAccentColors = [
  'neutral',
  'brand',
  'info',
  'success',
  'warning',
  'danger',
  'cta',
  'accent'
] as const

export type SpectreAccentColor = (typeof spectreAccentColors)[number]

export function isAccentColor(value: unknown): value is SpectreAccentColor {
  return (spectreAccentColors as readonly string[]).includes(value as string)
}

export const spectreFooterAppearances = ['dark', 'light', 'system'] as const

export type SpectreFooterAppearance = (typeof spectreFooterAppearances)[number]

export function isFooterAppearance(
  value: unknown
): value is SpectreFooterAppearance {
  return (spectreFooterAppearances as readonly string[]).includes(
    value as string
  )
}

export const spectreFooterSurfaces = [
  'page',
  'card',
  'subtle',
  'inverse',
  'hero'
] as const

export type SpectreFooterSurface = (typeof spectreFooterSurfaces)[number]

export function isFooterSurface(value: unknown): value is SpectreFooterSurface {
  return (spectreFooterSurfaces as readonly string[]).includes(value as string)
}

export const spectreLogoCloudSizes = ['sm', 'md', 'lg'] as const

export type SpectreLogoCloudSize = (typeof spectreLogoCloudSizes)[number]

export function isLogoCloudSize(value: unknown): value is SpectreLogoCloudSize {
  return (spectreLogoCloudSizes as readonly string[]).includes(value as string)
}

export const spectreLogoCloudFills = ['subtle', 'card', 'none'] as const

export type SpectreLogoCloudFill = (typeof spectreLogoCloudFills)[number]

export function isLogoCloudFill(value: unknown): value is SpectreLogoCloudFill {
  return (spectreLogoCloudFills as readonly string[]).includes(value as string)
}

export const spectreQuoteSizes = ['sm', 'md', 'lg', 'xl'] as const

export type SpectreQuoteSize = (typeof spectreQuoteSizes)[number]

export function isQuoteSize(value: unknown): value is SpectreQuoteSize {
  return (spectreQuoteSizes as readonly string[]).includes(value as string)
}

export const spectreQuoteSurfaces = ['plain', 'subtle', 'inverse'] as const

export type SpectreQuoteSurface = (typeof spectreQuoteSurfaces)[number]

export function isQuoteSurface(value: unknown): value is SpectreQuoteSurface {
  return (spectreQuoteSurfaces as readonly string[]).includes(value as string)
}

export const spectreQuoteAccents = ['none', 'edge', 'mark'] as const

export type SpectreQuoteAccent = (typeof spectreQuoteAccents)[number]

export function isQuoteAccent(value: unknown): value is SpectreQuoteAccent {
  return (spectreQuoteAccents as readonly string[]).includes(value as string)
}

export const spectreQuoteAligns = ['start', 'center'] as const

export type SpectreQuoteAlign = (typeof spectreQuoteAligns)[number]

export function isQuoteAlign(value: unknown): value is SpectreQuoteAlign {
  return (spectreQuoteAligns as readonly string[]).includes(value as string)
}

export const spectreStatSizes = ['sm', 'md', 'lg', 'xl'] as const

export type SpectreStatSize = (typeof spectreStatSizes)[number]

export function isStatSize(value: unknown): value is SpectreStatSize {
  return (spectreStatSizes as readonly string[]).includes(value as string)
}

export const spectreStatAligns = ['start', 'center', 'end'] as const

export type SpectreStatAlign = (typeof spectreStatAligns)[number]

export function isStatAlign(value: unknown): value is SpectreStatAlign {
  return (spectreStatAligns as readonly string[]).includes(value as string)
}

export const spectreStatSurfaces = ['page', 'surface', 'inverse'] as const

export type SpectreStatSurface = (typeof spectreStatSurfaces)[number]

export function isStatSurface(value: unknown): value is SpectreStatSurface {
  return (spectreStatSurfaces as readonly string[]).includes(value as string)
}

export const spectreSectionHeadLayouts = ['stacked', 'split'] as const

export type SpectreSectionHeadLayout =
  (typeof spectreSectionHeadLayouts)[number]

export function isSectionHeadLayout(
  value: unknown
): value is SpectreSectionHeadLayout {
  return (spectreSectionHeadLayouts as readonly string[]).includes(
    value as string
  )
}

export const spectreSectionHeadAligns = ['start', 'center'] as const

export type SpectreSectionHeadAlign = (typeof spectreSectionHeadAligns)[number]

export function isSectionHeadAlign(
  value: unknown
): value is SpectreSectionHeadAlign {
  return (spectreSectionHeadAligns as readonly string[]).includes(
    value as string
  )
}

export const spectreSkeletonShapes = ['text', 'rect', 'circle'] as const

export type SpectreSkeletonShape = (typeof spectreSkeletonShapes)[number]

export function isSkeletonShape(value: unknown): value is SpectreSkeletonShape {
  return (spectreSkeletonShapes as readonly string[]).includes(value as string)
}

export const spectreSectionHeroSizes = ['sm', 'md', 'lg'] as const

export type SpectreSectionHero = (typeof spectreSectionHeroSizes)[number]

export function isSectionHero(value: unknown): value is SpectreSectionHero {
  return (spectreSectionHeroSizes as readonly string[]).includes(
    value as string
  )
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
  'cta',
  'inverse'
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

export const spectreContainerMaxWidths = ['none', 'prose', 'wide'] as const

export type SpectreContainerMaxWidth =
  (typeof spectreContainerMaxWidths)[number]

export function isContainerMaxWidth(
  value: unknown
): value is SpectreContainerMaxWidth {
  return (spectreContainerMaxWidths as readonly string[]).includes(
    value as string
  )
}

export const spectreGridColumns = [1, 2, 3, 4, 6, 12, 'auto'] as const

export type SpectreGridColumns = (typeof spectreGridColumns)[number]

export function isGridColumns(value: unknown): value is SpectreGridColumns {
  return (spectreGridColumns as readonly (number | string)[]).includes(
    value as number | string
  )
}

export type SpectreGridResponsiveColumns = Exclude<SpectreGridColumns, 'auto'>

export interface SpectreGridColumnsOptions {
  base?: SpectreGridColumns
  md?: SpectreGridResponsiveColumns
  lg?: SpectreGridResponsiveColumns
}

function isGridResponsiveColumns(
  value: unknown
): value is SpectreGridResponsiveColumns {
  return value !== 'auto' && isGridColumns(value)
}

export function isGridColumnsOptions(
  value: unknown
): value is SpectreGridColumnsOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridColumns(candidate.base)) &&
    (candidate.md === undefined || isGridResponsiveColumns(candidate.md)) &&
    (candidate.lg === undefined || isGridResponsiveColumns(candidate.lg))
  )
}

export const spectreGridGaps = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl'
] as const

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

export interface SpectreGridFixedTrackCountOptions {
  base?: SpectreGridFixedTrackCount
  md?: SpectreGridFixedTrackCount
  lg?: SpectreGridFixedTrackCount
}

export function isGridFixedTrackCountOptions(
  value: unknown
): value is SpectreGridFixedTrackCountOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridFixedTrackCount(candidate.base)) &&
    (candidate.md === undefined || isGridFixedTrackCount(candidate.md)) &&
    (candidate.lg === undefined || isGridFixedTrackCount(candidate.lg))
  )
}

export const spectreGridTemplates = [
  'edge-fluid-edge',
  'label-fluid-fluid',
  'fluid-fixed'
] as const

export type SpectreGridTemplate = (typeof spectreGridTemplates)[number]

export function isGridTemplate(value: unknown): value is SpectreGridTemplate {
  return (spectreGridTemplates as readonly string[]).includes(value as string)
}

export interface SpectreGridTemplateOptions {
  base?: SpectreGridTemplate
  md?: SpectreGridTemplate
  lg?: SpectreGridTemplate
}

export function isGridTemplateOptions(
  value: unknown
): value is SpectreGridTemplateOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridTemplate(candidate.base)) &&
    (candidate.md === undefined || isGridTemplate(candidate.md)) &&
    (candidate.lg === undefined || isGridTemplate(candidate.lg))
  )
}

// A responsive `weight` or `count` applies only at the breakpoints where
// `template` is also set; the recipe owns that resolution.
export interface SpectreGridExplicitTemplateOptions {
  template: SpectreGridTemplate | SpectreGridTemplateOptions
  weight?: SpectreGridLeadingWeight | SpectreGridLeadingWeightOptions
  count?: SpectreGridFixedTrackCount | SpectreGridFixedTrackCountOptions
}

export function isGridExplicitTemplateOptions(
  value: unknown
): value is SpectreGridExplicitTemplateOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (isGridTemplate(candidate.template) ||
      isGridTemplateOptions(candidate.template)) &&
    (candidate.weight === undefined ||
      isGridLeadingWeight(candidate.weight) ||
      isGridLeadingWeightOptions(candidate.weight)) &&
    (candidate.count === undefined ||
      isGridFixedTrackCount(candidate.count) ||
      isGridFixedTrackCountOptions(candidate.count))
  )
}

export const spectreStackDirections = ['vertical', 'horizontal'] as const

export type SpectreStackDirection = (typeof spectreStackDirections)[number]

export function isStackDirection(
  value: unknown
): value is SpectreStackDirection {
  return (spectreStackDirections as readonly string[]).includes(value as string)
}

export const spectreStackBases = ['none', 'sidebar'] as const

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

export const spectreStackGaps = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl'
] as const

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
  'danger',
  'neutral'
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
  '6xl',
  '7xl',
  '8xl',
  '9xl'
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
  'brand',
  'accent',
  'onInverse',
  'onInverseMuted',
  'onInverseBrand',
  'onInverseAccent',
  'onSurface',
  'onSurfaceMuted',
  'onSurfaceSubtle',
  'onSurfaceMeta',
  'onSurfaceBrand',
  'onSurfaceAccent'
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

export const spectreTextWeights = [400, 500, 600, 700, 800, 900] as const

export type SpectreTextWeight = (typeof spectreTextWeights)[number]

export function isTextWeight(value: unknown): value is SpectreTextWeight {
  return (spectreTextWeights as readonly number[]).includes(value as number)
}

export const spectreTextLeadings = [
  'none',
  'tight',
  'snug',
  'normal',
  'relaxed',
  'loose'
] as const

export type SpectreTextLeading = (typeof spectreTextLeadings)[number]

export function isTextLeading(value: unknown): value is SpectreTextLeading {
  return (spectreTextLeadings as readonly string[]).includes(value as string)
}

export const spectreTextFontSizes = [
  12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128
] as const

export type SpectreTextFontSize = (typeof spectreTextFontSizes)[number]

export function isTextFontSize(value: unknown): value is SpectreTextFontSize {
  return (spectreTextFontSizes as readonly number[]).includes(value as number)
}

export const spectreTextTrackings = [
  'tightest',
  'tighter',
  'tight',
  'normal',
  'wide',
  'wider',
  'widest'
] as const

export type SpectreTextTracking = (typeof spectreTextTrackings)[number]

export function isTextTracking(value: unknown): value is SpectreTextTracking {
  return (spectreTextTrackings as readonly string[]).includes(value as string)
}

export const spectreTextDecorations = ['thin', 'base', 'thick'] as const

export type SpectreTextDecoration = (typeof spectreTextDecorations)[number]

export function isTextDecoration(
  value: unknown
): value is SpectreTextDecoration {
  return (spectreTextDecorations as readonly string[]).includes(value as string)
}

export const spectreTextUnderlineOffsets = ['sm', 'md', 'lg'] as const

export type SpectreTextUnderlineOffset =
  (typeof spectreTextUnderlineOffsets)[number]

export function isTextUnderlineOffset(
  value: unknown
): value is SpectreTextUnderlineOffset {
  return (spectreTextUnderlineOffsets as readonly string[]).includes(
    value as string
  )
}

export const spectreLinkTones = ['default', 'onInverse'] as const

export type SpectreLinkTone = (typeof spectreLinkTones)[number]

export function isLinkTone(value: unknown): value is SpectreLinkTone {
  return (spectreLinkTones as readonly string[]).includes(value as string)
}

export const spectreSurfaces = [
  'page',
  'card',
  'input',
  'overlay',
  'subtle',
  'hero',
  'hover',
  'selected',
  'active',
  'divider',
  'inverse'
] as const

export type SpectreSurface = (typeof spectreSurfaces)[number]

export function isSurface(value: unknown): value is SpectreSurface {
  return (spectreSurfaces as readonly string[]).includes(value as string)
}

export const spectreSurfaceTags = [
  'div',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'li'
] as const

export type SpectreSurfaceTag = (typeof spectreSurfaceTags)[number]

export function isSurfaceTag(value: unknown): value is SpectreSurfaceTag {
  return (spectreSurfaceTags as readonly string[]).includes(value as string)
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

export const spectreTabsVariants = ['line', 'pill'] as const

export type SpectreTabsVariant = (typeof spectreTabsVariants)[number]

export function isTabsVariant(value: unknown): value is SpectreTabsVariant {
  return (spectreTabsVariants as readonly string[]).includes(value as string)
}

export const spectreOffcanvasPlacements = [
  'start',
  'end',
  'top',
  'bottom'
] as const

export type SpectreOffcanvasPlacement =
  (typeof spectreOffcanvasPlacements)[number]

export function isOffcanvasPlacement(
  value: unknown
): value is SpectreOffcanvasPlacement {
  return (spectreOffcanvasPlacements as readonly string[]).includes(
    value as string
  )
}

export const spectreTableSizes = ['sm', 'md'] as const

export type SpectreTableSize = (typeof spectreTableSizes)[number]

export function isTableSize(value: unknown): value is SpectreTableSize {
  return (spectreTableSizes as readonly string[]).includes(value as string)
}

export const spectreStepperOrientations = ['horizontal', 'vertical'] as const

export type SpectreStepperOrientation =
  (typeof spectreStepperOrientations)[number]

export function isStepperOrientation(
  value: unknown
): value is SpectreStepperOrientation {
  return (spectreStepperOrientations as readonly string[]).includes(
    value as string
  )
}

export const spectreStepperTones = ['brand', 'accent'] as const

export type SpectreStepperTone = (typeof spectreStepperTones)[number]

export function isStepperTone(value: unknown): value is SpectreStepperTone {
  return (spectreStepperTones as readonly string[]).includes(value as string)
}

export const spectreSpacingScale = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl'
] as const

export type SpectreSpacingStep = (typeof spectreSpacingScale)[number]

export function isSpacingStep(value: unknown): value is SpectreSpacingStep {
  return (spectreSpacingScale as readonly string[]).includes(value as string)
}

export const spectreGridColStarts = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
] as const

export type SpectreGridColStart = (typeof spectreGridColStarts)[number]

export function isGridColStart(value: unknown): value is SpectreGridColStart {
  return (spectreGridColStarts as readonly number[]).includes(value as number)
}

export interface SpectreGridColStartOptions {
  base?: SpectreGridColStart
  md?: SpectreGridColStart
  lg?: SpectreGridColStart
}

export function isGridColStartOptions(
  value: unknown
): value is SpectreGridColStartOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    (candidate.base === undefined || isGridColStart(candidate.base)) &&
    (candidate.md === undefined || isGridColStart(candidate.md)) &&
    (candidate.lg === undefined || isGridColStart(candidate.lg))
  )
}

export const spectrePopoverPlacements = [
  'top',
  'bottom',
  'left',
  'right'
] as const

export type SpectrePopoverPlacement = (typeof spectrePopoverPlacements)[number]

export function isPopoverPlacement(
  value: unknown
): value is SpectrePopoverPlacement {
  return (spectrePopoverPlacements as readonly string[]).includes(
    value as string
  )
}

export const spectreProgressVariants = [
  'brand',
  'neutral',
  'info',
  'success',
  'warning',
  'danger'
] as const

export type SpectreProgressVariant = (typeof spectreProgressVariants)[number]

export function isProgressVariant(
  value: unknown
): value is SpectreProgressVariant {
  return (spectreProgressVariants as readonly string[]).includes(
    value as string
  )
}

export const spectreTextPresets = ['heading', 'display', 'lead'] as const

export type SpectreTextPreset = (typeof spectreTextPresets)[number]

export function isTextPreset(value: unknown): value is SpectreTextPreset {
  return (spectreTextPresets as readonly string[]).includes(value as string)
}

export const spectreHeadingLevels = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
] as const

export type SpectreHeadingLevel = (typeof spectreHeadingLevels)[number]

export function isHeadingLevel(value: unknown): value is SpectreHeadingLevel {
  return (spectreHeadingLevels as readonly string[]).includes(value as string)
}

export const spectreDisplayLevels = [1, 2, 3, 4, 5, 6] as const

export type SpectreDisplayLevel = (typeof spectreDisplayLevels)[number]

export function isDisplayLevel(value: unknown): value is SpectreDisplayLevel {
  return (spectreDisplayLevels as readonly number[]).includes(value as number)
}

export const spectreTableRowVariants = [
  'neutral',
  'info',
  'success',
  'warning',
  'danger'
] as const

export type SpectreTableRowVariant = (typeof spectreTableRowVariants)[number]

export function isTableRowVariant(
  value: unknown
): value is SpectreTableRowVariant {
  return (spectreTableRowVariants as readonly string[]).includes(
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
