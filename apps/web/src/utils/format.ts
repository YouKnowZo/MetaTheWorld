// src/utils/format.ts
/**
 * Formats a number with a fixed number of decimal places.
 * If the input is null/undefined/not a number, returns a fallback string.
 */
export function formatNumber(value: number | undefined | null, fractionDigits: number, fallback: string = '0') {
  const num = typeof value === 'number' && !isNaN(value) ? value : Number(fallback);
  return num.toFixed(fractionDigits);
}
