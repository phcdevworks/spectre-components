import { type InputSize } from '@phcdevworks/spectre-ui';

export const spectreInputSizes = ['sm', 'md', 'lg'] as const;
export type SpectreInputSize = (typeof spectreInputSizes)[number];

export function isInputSize(value: string): value is InputSize {
  return (spectreInputSizes as readonly string[]).includes(value);
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

export function isInputType(value: string): value is SpectreInputType {
  return (spectreInputTypes as readonly string[]).includes(value);
}
