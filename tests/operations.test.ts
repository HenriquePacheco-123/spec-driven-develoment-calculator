import { describe, expect, it } from 'vitest'
import {
  DivisionByZeroError,
  NonFiniteResultError,
  add,
  applyOperator,
  divide,
  multiply,
  subtract,
} from '../src/core/operations'

describe('operations', () => {
  it('CALC-10 AC17 adds integers, decimals and negatives', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(1.5, 2.25)).toBe(3.75)
    expect(add(-4, 1)).toBe(-3)
  })

  it('CALC-10 AC17 subtracts integers, decimals and negatives', () => {
    expect(subtract(5, 8)).toBe(-3)
    expect(subtract(2.5, 0.5)).toBe(2)
    expect(subtract(-2, -5)).toBe(3)
  })

  it('CALC-10 AC17 multiplies integers, decimals and negatives', () => {
    expect(multiply(6, 7)).toBe(42)
    expect(multiply(1.5, 4)).toBe(6)
    expect(multiply(-1.5, 2)).toBe(-3)
    expect(multiply(-3, -3)).toBe(9)
  })

  it('CALC-10 AC17 divides integers, decimals and negatives', () => {
    expect(divide(8, 2)).toBe(4)
    expect(divide(1, 4)).toBe(0.25)
    expect(divide(-9, 3)).toBe(-3)
    expect(divide(-9, -3)).toBe(3)
  })

  it('CALC-10 AC17 divide throws DivisionByZeroError for a zero divisor', () => {
    expect(() => divide(5, 0)).toThrow(DivisionByZeroError)
    expect(() => divide(5, -0)).toThrow(DivisionByZeroError)
    expect(() => divide(0, 0)).toThrow(DivisionByZeroError)
  })

  it('CALC-10 AC17 DivisionByZeroError carries the user message', () => {
    expect(() => divide(1, 0)).toThrow('Não é possível dividir por zero')
  })

  it('CALC-10 AC17 applyOperator picks the operation by operator symbol', () => {
    expect(applyOperator('+', 2, 3)).toBe(5)
    expect(applyOperator('-', 2, 3)).toBe(-1)
    expect(applyOperator('*', 2, 3)).toBe(6)
    expect(applyOperator('/', 6, 3)).toBe(2)
  })

  it('CALC-10 AC17 applyOperator throws NonFiniteResultError on overflow', () => {
    expect(() => applyOperator('*', 1e308, 10)).toThrow(NonFiniteResultError)
    expect(() => applyOperator('*', 1e308, 10)).toThrow('Resultado fora do limite')
  })

  it('CALC-10 AC17 applyOperator keeps the division by zero error', () => {
    expect(() => applyOperator('/', 1, 0)).toThrow(DivisionByZeroError)
  })

  it('CALC-10 AC17 applyOperator returns a finite result untouched at the limit', () => {
    expect(applyOperator('*', 999999999999999, 999999999999999)).toBe(999999999999999 ** 2)
  })
})
