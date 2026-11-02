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

/** Rounds to 10 decimals, drops trailing zeros and uses exponential above 15 digits. */
export function formatResult(value: number): string {
  if (Math.abs(value) >= 1e21) return toExponential(value)
  const fixed = stripTrailingZeros(value.toFixed(MAX_DECIMALS))
  if (countDigits(fixed) > MAX_DIGITS) return toExponential(value)
  return fixed === '-0' ? '0' : fixed
}

export function displaySize(text: string): DisplaySize {
  if (text.length <= 9) return 'normal'
  if (text.length <= 13) return 'small'
  return 'tiny'
}
