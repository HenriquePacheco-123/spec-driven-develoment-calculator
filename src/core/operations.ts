import type { Operator } from './types'

export class DivisionByZeroError extends Error {
  constructor() {
    super('Não é possível dividir por zero')
    this.name = 'DivisionByZeroError'
  }
}

export class NonFiniteResultError extends Error {
  constructor() {
    super('Resultado fora do limite')
    this.name = 'NonFiniteResultError'
  }
}

export const add = (a: number, b: number): number => a + b
export const subtract = (a: number, b: number): number => a - b
export const multiply = (a: number, b: number): number => a * b

export function divide(a: number, b: number): number {
  if (b === 0) throw new DivisionByZeroError()
  return a / b
}

export function applyOperator(operator: Operator, a: number, b: number): number {
  const result = { '+': add, '-': subtract, '*': multiply, '/': divide }[operator](a, b)
  if (!Number.isFinite(result)) throw new NonFiniteResultError()
  return result
}
