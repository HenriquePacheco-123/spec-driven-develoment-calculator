const MAX_DECIMALS = 10
const MAX_DIGITS = 15

export type DisplaySize = 'normal' | 'small' | 'tiny'

/** Counts only digits: sign, decimal point and exponent are left out. */
export function countDigits(text: string): number {
  return text.replace(/e.*$/i, '').replace(/\D/g, '').length
}

function stripTrailingZeros(text: string): string {
  return text.includes('.') ? text.replace(/\.?0+$/, '') : text
}

function toExponential(value: number): string {
  const [mantissa = '', exponent = ''] = value.toExponential(MAX_DECIMALS).split('e')
  return `${stripTrailingZeros(mantissa)}e${exponent}`
}

/** A few units in the last place: the size of the error one arithmetic step leaves behind. */
const NOISE = 4 * Number.EPSILON

/** Drops floating point noise (`1000000.1 + 0.2` is `1000000.3000000001`) by rounding to 15 significant digits. */
function withoutNoise(value: number): number {
  const candidate = Number(value.toPrecision(15))
  return Math.abs(candidate - value) <= Math.abs(value) * NOISE ? candidate : value
}

/** Plain notation with at most 10 decimals and no trailing zeros. */
function plain(value: number): string {
  const text = String(value)
  const decimals = text.includes('e') ? MAX_DECIMALS : (text.split('.')[1] ?? '').length
  return stripTrailingZeros(value.toFixed(Math.min(decimals, MAX_DECIMALS)))
}

/** Rounds to 10 decimals, drops trailing zeros and uses exponential above 15 digits. */
export function formatResult(value: number): string {
  if (Math.abs(value) >= 1e21) return toExponential(value)
  const clean = withoutNoise(value)
  const fixed = plain(clean)
  if (countDigits(fixed) > MAX_DIGITS) return toExponential(clean)
  return fixed === '-0' ? '0' : fixed
}

export function displaySize(text: string): DisplaySize {
  if (text.length <= 9) return 'normal'
  if (text.length <= 13) return 'small'
  return 'tiny'
}
