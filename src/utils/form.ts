import { type InputSize } from '@phcdevworks/spectre-ui';

export const spectreInputSizes = ['sm', 'md', 'lg'] as const;
export type SpectreInputSize = (typeof spectreInputSizes)[number];

export function isInputSize(value: unknown): value is InputSize {
  return (spectreInputSizes as readonly string[]).includes(value as string);
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
