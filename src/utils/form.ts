import {
  type ButtonSize,
  type ButtonVariant,
  type InputSize,
} from '@phcdevworks/spectre-ui';

export const spectreInputSizes = ['sm', 'md', 'lg'] as const;
export type SpectreInputSize = (typeof spectreInputSizes)[number];

export function isInputSize(value: unknown): value is InputSize | ButtonSize {
  return (spectreInputSizes as readonly string[]).includes(value as string);
}

export const spectreButtonVariants = [
  'primary',
  'secondary',
  'ghost',
  'danger',
  'success',
  'cta',
  'accent',
] as const;

export type SpectreButtonVariant = (typeof spectreButtonVariants)[number];

export function isButtonVariant(value: unknown): value is ButtonVariant {
  return (spectreButtonVariants as readonly string[]).includes(value as string);
}

export const spectreButtonTypes = ['button', 'submit', 'reset'] as const;

export type SpectreButtonType = (typeof spectreButtonTypes)[number];

export function isButtonType(value: unknown): value is SpectreButtonType {
  return (spectreButtonTypes as readonly string[]).includes(value as string);
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
  'week',
] as const;

export type SpectreInputType = (typeof spectreInputTypes)[number];

export function isInputType(value: unknown): value is SpectreInputType {
  return (spectreInputTypes as readonly string[]).includes(value as string);
}

export function normalizeInt(
  value: unknown,
  fallback: number | undefined,
  min = 0,
): number | undefined {
  if (
    value == null ||
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < min
  ) {
    return fallback;
  }
  return value;
}
