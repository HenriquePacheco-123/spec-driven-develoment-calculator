import { describe, expect, it } from 'vitest'
import { countDigits, displaySize, formatResult } from '../src/core/format'

describe('formatResult', () => {
  it('CALC-11 AC18 shows 0.1 + 0.2 as 0.3', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3')
    expect(formatResult(-0.1 - 0.2)).toBe('-0.3')
  })

  it('CALC-11 AC18 removes trailing zeros and keeps integers whole', () => {
    expect(formatResult(5)).toBe('5')
    expect(formatResult(2.5)).toBe('2.5')
    expect(formatResult(100)).toBe('100')
    expect(formatResult(-0)).toBe('0')
  })

  it('CALC-11 AC18 rounds to at most 10 decimals', () => {
    expect(formatResult(2 / 3)).toBe('0.6666666667')
    expect(formatResult(1e-11)).toBe('0')
    expect(formatResult(0.0000001)).toBe('0.0000001')
  })

  it('EDGE-3 shows 1 ÷ 3 as 0.3333333333', () => {
    expect(formatResult(1 / 3)).toBe('0.3333333333')
  })

  it('CALC-11 AC19 keeps a 15 digit result in plain notation', () => {
    expect(formatResult(123456789012345)).toBe('123456789012345')
    expect(formatResult(-999999999999999)).toBe('-999999999999999')
  })

  it('CALC-11 AC19 shows a result above 15 digits in exponential with up to 10 decimals', () => {
    expect(formatResult(1234567890123456)).toBe('1.2345678901e+15')
    expect(formatResult(-1234567890123456)).toBe('-1.2345678901e+15')
    expect(formatResult(1.2345678901234568e20)).toBe('1.2345678901e+20')
    expect(formatResult(1e20)).toBe('1e+20')
    expect(formatResult(999999999999999 * 999999999999999)).toBe('1e+30')
  })

  it('CALC-11 AC19 counts the digits of a decimal result too', () => {
    expect(formatResult(123456789012.34567)).toBe('1.2345678901e+11')
  })
})

describe('countDigits', () => {
  it('CALC-04 AC7 leaves sign and decimal point out of the count', () => {
    expect(countDigits('-12.5')).toBe(3)
    expect(countDigits('0.')).toBe(1)
    expect(countDigits('1.2345678901e+20')).toBe(11)
  })
})

describe('displaySize', () => {
  it('UI-06 AC6 keeps short numbers at normal size', () => {
    expect(displaySize('123456789')).toBe('normal')
  })

  it('UI-06 AC6 shrinks the font as the text grows', () => {
    expect(displaySize('1234567890')).toBe('small')
    expect(displaySize('-123456789.123')).toBe('tiny')
    expect(displaySize('123456789012345')).toBe('tiny')
  })

  it('UI-06 AC7 gives the error message the smallest size', () => {
    expect(displaySize('Não é possível dividir por zero')).toBe('tiny')
  })
})
