import { describe, expect, it } from 'vitest'
import { resolveKey } from '../src/ui/keyboard'

describe('resolveKey', () => {
  it('KEY-01 AC1 maps the keys 0 to 9 to digit actions', () => {
    for (const digit of '0123456789') {
      expect(resolveKey(digit, false)).toEqual({ type: 'digit', digit })
    }
  })

  it('KEY-01 AC2 maps . and , to the decimal point', () => {
    expect(resolveKey('.', false)).toEqual({ type: 'decimal' })
    expect(resolveKey(',', false)).toEqual({ type: 'decimal' })
  })

  it('KEY-02 AC3 maps + - * / to the four operators', () => {
    expect(resolveKey('+', false)).toEqual({ type: 'operator', operator: '+' })
    expect(resolveKey('-', false)).toEqual({ type: 'operator', operator: '-' })
    expect(resolveKey('*', false)).toEqual({ type: 'operator', operator: '*' })
    expect(resolveKey('/', false)).toEqual({ type: 'operator', operator: '/' })
  })

  it('KEY-02 AC4 maps Enter and = to equals', () => {
    expect(resolveKey('Enter', false)).toEqual({ type: 'equals' })
    expect(resolveKey('=', false)).toEqual({ type: 'equals' })
  })

  it('KEY-03 AC5 maps Backspace, Escape and Delete to ⌫, C and CE', () => {
    expect(resolveKey('Backspace', false)).toEqual({ type: 'backspace' })
    expect(resolveKey('Escape', false)).toEqual({ type: 'clear' })
    expect(resolveKey('Delete', false)).toEqual({ type: 'clearEntry' })
  })

  it('KEY-03 AC6 maps % to percent', () => {
    expect(resolveKey('%', false)).toEqual({ type: 'percent' })
  })

  it('KEY-05 AC8 maps Enter and Space on a focused button to no action', () => {
    expect(resolveKey('Enter', true)).toBeNull()
    expect(resolveKey(' ', true)).toBeNull()
  })

  it('KEY-05 AC8 still maps other keys while a button has focus', () => {
    expect(resolveKey('5', true)).toEqual({ type: 'digit', digit: '5' })
    expect(resolveKey('=', true)).toEqual({ type: 'equals' })
    expect(resolveKey('Escape', true)).toEqual({ type: 'clear' })
  })

  it('KEY-01 AC1 maps keys without a function to no action', () => {
    expect(resolveKey('a', false)).toBeNull()
    expect(resolveKey('Shift', false)).toBeNull()
    expect(resolveKey(' ', false)).toBeNull()
    expect(resolveKey('10', false)).toBeNull()
  })
})
