import { type InputSize } from '@phcdevworks/spectre-ui';

export const spectreInputSizes = ['sm', 'md', 'lg'] as const;
export type SpectreInputSize = (typeof spectreInputSizes)[number];

export function isInputSize(value: string): value is InputSize {
  return (spectreInputSizes as readonly string[]).includes(value);
}
