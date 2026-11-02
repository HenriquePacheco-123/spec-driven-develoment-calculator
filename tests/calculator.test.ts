import { describe, expect, it } from 'vitest'
import { activeOperator, expressionOf, initialState, reducer } from '../src/core/calculator'
import type { Action, CalculatorState } from '../src/core/types'

const KEY_ACTIONS: Record<string, Action> = {
  '.': { type: 'decimal' },
  '+': { type: 'operator', operator: '+' },
  '-': { type: 'operator', operator: '-' },
  '*': { type: 'operator', operator: '*' },
  '/': { type: 'operator', operator: '/' },
  '=': { type: 'equals' },
  C: { type: 'clear' },
  CE: { type: 'clearEntry' },
  BS: { type: 'backspace' },
  NEG: { type: 'negate' },
  '%': { type: 'percent' },
}

/** Presses keys such as `'1', '2', '+', '='` and returns the final state. */
function press(...keys: string[]): CalculatorState {
  return keys.reduce<CalculatorState>((state, key) => {
    const action = KEY_ACTIONS[key] ?? { type: 'digit', digit: key }
    return reducer(state, action)
  }, initialState)
}

/** Presses keys one by one and returns the displayed value after each. */
function displays(...keys: string[]): string[] {
  let state = initialState
  return keys.map((key) => {
    state = reducer(state, KEY_ACTIONS[key] ?? { type: 'digit', digit: key })
    return state.currentValue
  })
}

describe('digits and decimal point', () => {
  it('CALC-01 AC1 appends each digit to the current number', () => {
    expect(press('1', '2', '3').currentValue).toBe('123')
    expect(press('9', '0', '5', '4', '8', '7', '6', '3', '2', '1').currentValue).toBe('9054876321')
  })

  it('CALC-02 AC2 keeps 0 when 0 is typed on 0', () => {
    expect(press('0', '0', '0').currentValue).toBe('0')
  })

  it('CALC-02 AC3 shows 7 when 7 is typed on 0 (007 becomes 7)', () => {
    expect(press('0', '0', '7').currentValue).toBe('7')
    expect(press('7').currentValue).toBe('7')
  })

  it('CALC-03 AC4 appends the decimal point to the current number', () => {
    expect(press('1', '.', '5').currentValue).toBe('1.5')
  })

  it('CALC-03 AC5 ignores a second decimal point', () => {
    expect(press('1', '.', '5', '.', '2').currentValue).toBe('1.52')
  })

  it('CALC-03 AC6 shows 0. when the decimal point comes first', () => {
    expect(press('.').currentValue).toBe('0.')
    expect(press('.', '5').currentValue).toBe('0.5')
  })

  it('CALC-04 AC7 accepts the 15th digit and ignores the 16th', () => {
    const fifteen = '123456789012345'
    expect(press(...fifteen).currentValue).toBe(fifteen)
    expect(press(...fifteen, '6').currentValue).toBe(fifteen)
  })

  it('CALC-04 AC7 counts digits only, not the decimal point', () => {
    const value = press(...'12345678901234', '.', '5', '6').currentValue
    expect(value).toBe('12345678901234.5')
  })

  it('EDGE-1 accepts the decimal point at 15 digits without a new digit', () => {
    const state = press(...'123456789012345', '.')
    expect(state.currentValue).toBe('123456789012345.')
    expect(press(...'123456789012345', '.', '6').currentValue).toBe('123456789012345.')
  })

  it('CALC-01 AC1 never mutates the previous state', () => {
    const before = { ...initialState }
    reducer(initialState, { type: 'digit', digit: '5' })
    expect(initialState).toEqual(before)
    expect(displays('1', '2')).toEqual(['1', '12'])
  })
})

describe('operators', () => {
  it('CALC-05 AC8 stores the number and the operator and waits for the next number', () => {
    const state = press('1', '2', '+')
    expect(state.previousValue).toBe('12')
    expect(state.operator).toBe('+')
    expect(state.waitingForOperand).toBe(true)
  })

  it('CALC-05 AC8 stores each of the four operators', () => {
    expect(press('8', '-').operator).toBe('-')
    expect(press('8', '*').operator).toBe('*')
    expect(press('8', '/').operator).toBe('/')
  })

  it('CALC-06 AC9 calculates the pending operation when a new operator follows (2 + 3 + shows 5)', () => {
    const state = press('2', '+', '3', '+')
    expect(state.currentValue).toBe('5')
    expect(state.previousValue).toBe('5')
    expect(state.operator).toBe('+')
    expect(state.waitingForOperand).toBe(true)
  })

  it('CALC-06 AC9 chains left to right (2 + 3 × shows 5, then × 4 +  shows 20)', () => {
    expect(press('2', '+', '3', '*').currentValue).toBe('5')
    expect(press('2', '+', '3', '*', '4', '+').currentValue).toBe('20')
  })

  it('CALC-07 AC11 replaces the pending operator without calculating', () => {
    const state = press('5', '+', '*')
    expect(state.operator).toBe('*')
    expect(state.previousValue).toBe('5')
    expect(state.currentValue).toBe('5')
    expect(press('2', '+', '3', '+', '*').currentValue).toBe('5')
  })

  it('CALC-10 AC17 calculates decimals and subtraction through the reducer', () => {
    expect(press('0', '.', '5', '+', '0', '.', '2', '5', '+').currentValue).toBe('0.75')
    expect(press('3', '-', '5', '-').currentValue).toBe('-2')
    expect(press('1', '.', '5', '*', '2', '*').currentValue).toBe('3')
  })

  it('EDGE-2 treats - as the first operator with 0 as a subtraction of 0', () => {
    const state = press('-')
    expect(state.previousValue).toBe('0')
    expect(state.operator).toBe('-')
    expect(press('-', '5', '-').currentValue).toBe('-5')
  })

  it('CALC-05 AC8 drops a dangling decimal point from the stored number', () => {
    expect(press('5', '.', '+').previousValue).toBe('5')
  })
})

describe('equals', () => {
  it('CALC-06 AC10 evaluates 2 + 3 × 4 = from left to right as 20', () => {
    expect(press('2', '+', '3', '*', '4', '=').currentValue).toBe('20')
  })

  it('CALC-08 AC12 shows the result and stores the last operation', () => {
    const state = press('2', '+', '3', '=')
    expect(state.currentValue).toBe('5')
    expect(state.lastOperation).toEqual({ operator: '+', left: '2', operand: '3' })
    expect(state.operator).toBeNull()
    expect(state.previousValue).toBeNull()
    expect(state.afterResult).toBe(true)
  })

  it('CALC-08 AC13 repeats the last operation on every further = (5, 8, 11)', () => {
    expect(displays('2', '+', '3', '=', '=', '=').slice(3)).toEqual(['5', '8', '11'])
  })

  it('CALC-08 AC13 repeats a multiplication too (2 × 3 = = gives 6, 18)', () => {
    expect(displays('2', '*', '3', '=', '=').slice(3)).toEqual(['6', '18'])
  })

  it('CALC-08 AC14 uses the current value as operand when none was typed (5 + = shows 10)', () => {
    expect(press('5', '+', '=').currentValue).toBe('10')
  })

  it('CALC-08 AC12 does nothing with no operator and no last operation', () => {
    expect(press('=')).toEqual(initialState)
    expect(press('7', '=').currentValue).toBe('7')
  })

  it('CALC-09 AC15 starts a new calculation when a digit follows a result', () => {
    const state = press('2', '+', '3', '=', '9')
    expect(state.currentValue).toBe('9')
    expect(state.lastOperation).toBeNull()
    expect(press('2', '+', '3', '=', '.').currentValue).toBe('0.')
  })

  it('CALC-09 AC16 continues from the result when an operator follows', () => {
    const state = press('2', '+', '3', '=', '*')
    expect(state.previousValue).toBe('5')
    expect(state.operator).toBe('*')
    expect(press('2', '+', '3', '=', '*', '2', '=').currentValue).toBe('10')
  })

  it('CALC-10 AC17 divides through the reducer', () => {
    expect(press('1', '/', '4', '=').currentValue).toBe('0.25')
  })

  it('CALC-11 AC18 shows 0.1 + 0.2 as 0.3', () => {
    expect(press('0', '.', '1', '+', '0', '.', '2', '=').currentValue).toBe('0.3')
  })

  it('EDGE-3 shows 1 ÷ 3 as 0.3333333333', () => {
    expect(press('1', '/', '3', '=').currentValue).toBe('0.3333333333')
  })

  it('CALC-11 AC19 shows a result above 15 digits in exponential notation', () => {
    const big = '999999999999999'
    expect(press(...big, '*', ...big, '=').currentValue).toBe('1e+30')
  })
})

describe('error state', () => {
  const ZERO_ERROR = 'Não é possível dividir por zero'

  it('ERR-01 AC9 shows the division by zero message on 5 ÷ 0 =', () => {
    expect(press('5', '/', '0', '=').error).toBe(ZERO_ERROR)
    expect(press('0', '/', '0', '=').error).toBe(ZERO_ERROR)
  })

  it('ERR-01 AC9 shows the message when a chained operator triggers the division', () => {
    expect(press('5', '/', '0', '+').error).toBe(ZERO_ERROR)
    expect(press('5', '/', '0', '.', '0', '=').error).toBe(ZERO_ERROR)
  })

  it('ERR-02 AC10 ignores operators, =, ±, %, ⌫, CE and the decimal point during the error', () => {
    const errored = press('5', '/', '0', '=')
    for (const key of ['+', '-', '*', '/', '=', 'NEG', '%', 'BS', 'CE', '.']) {
      expect(reducer(errored, KEY_ACTIONS[key] as Action)).toBe(errored)
    }
  })

  it('ERR-02 AC11 clears the error with C', () => {
    expect(press('5', '/', '0', '=', 'C')).toEqual(initialState)
  })

  it('ERR-02 AC11 clears the error with a digit that starts a new calculation', () => {
    const state = press('5', '/', '0', '=', '7')
    expect(state.error).toBeNull()
    expect(state.currentValue).toBe('7')
    expect(state.operator).toBeNull()
    expect(state.previousValue).toBeNull()
  })

  it('EDGE-4 keeps 0 on = after an error cleared by C', () => {
    const state = press('5', '/', '0', '=', 'C', '=')
    expect(state.currentValue).toBe('0')
    expect(state.error).toBeNull()
  })

  it('ERR-03 AC12 shows the out of limit message when repeated multiplication overflows', () => {
    let state = press(...'999999999999999', '*', ...'999999999999999', '=')
    for (let i = 0; i < 40 && state.error === null; i += 1) {
      state = reducer(state, { type: 'equals' })
    }
    expect(state.error).toBe('Resultado fora do limite')
    expect(reducer(state, { type: 'operator', operator: '+' })).toBe(state)
    expect(reducer(state, { type: 'digit', digit: '4' }).currentValue).toBe('4')
  })
})

describe('controls', () => {
  it('CTRL-01 AC1 resets every field with C', () => {
    expect(press('5', '+', '3', 'C')).toEqual(initialState)
    expect(press('2', '+', '3', '=', 'C')).toEqual(initialState)
  })

  it('CTRL-02 AC2 clears only the current number with CE', () => {
    const state = press('5', '+', '3', 'CE')
    expect(state.currentValue).toBe('0')
    expect(state.operator).toBe('+')
    expect(state.previousValue).toBe('5')
    expect(press('5', '+', '3', 'CE', '4', '=').currentValue).toBe('9')
  })

  it('CTRL-02 AC3 acts as C when CE follows a result', () => {
    expect(press('2', '+', '3', '=', 'CE')).toEqual(initialState)
  })

  it('CTRL-03 AC4 removes the last character', () => {
    expect(press('1', '2', '3', 'BS').currentValue).toBe('12')
    expect(press('1', '.', 'BS').currentValue).toBe('1')
  })

  it('CTRL-03 AC4 gives 0 when nothing is left, including -5', () => {
    expect(press('5', 'BS').currentValue).toBe('0')
    expect(press('5', 'NEG', 'BS').currentValue).toBe('0')
    expect(press('0', '.', '5', 'NEG', 'BS', 'BS').currentValue).toBe('0')
  })

  it('CTRL-03 AC4 leaves the shown number alone while waiting for the next number', () => {
    expect(press('5', '+', 'BS').currentValue).toBe('5')
  })

  it('CTRL-03 AC5 keeps the result when ⌫ follows a result', () => {
    const result = press('2', '+', '3', '=')
    expect(reducer(result, { type: 'backspace' })).toBe(result)
  })

  it('CTRL-04 AC6 flips the sign of the current number', () => {
    expect(press('5', 'NEG').currentValue).toBe('-5')
    expect(press('5', 'NEG', 'NEG').currentValue).toBe('5')
  })

  it('CTRL-04 AC7 keeps 0 when ± is pressed on 0', () => {
    expect(press('NEG').currentValue).toBe('0')
    expect(press('0', 'NEG').currentValue).toBe('0')
  })

  it('CTRL-05 AC8 divides the current number by 100', () => {
    expect(press('5', '0', '%').currentValue).toBe('0.5')
    expect(press('0', '%').currentValue).toBe('0')
  })

  it('CTRL-05 AC8 turns 50 + 10 % into 50 + 0.1', () => {
    const state = press('5', '0', '+', '1', '0', '%')
    expect(state.previousValue).toBe('50')
    expect(state.currentValue).toBe('0.1')
    expect(press('5', '0', '+', '1', '0', '%', '=').currentValue).toBe('50.1')
  })

  it('CTRL-05 AC8 keeps negatives and decimals exact', () => {
    expect(press('1', '.', '5', 'NEG', '%').currentValue).toBe('-0.015')
  })
})

describe('selectors', () => {
  it('UI-03 AC3 shows the pending operation on the secondary line (1 2 × gives 12 ×)', () => {
    expect(expressionOf(press('1', '2', '*'))).toBe('12 ×')
    expect(expressionOf(press('1', '2', '*', '3', '4', '5'))).toBe('12 ×')
  })

  it('UI-03 AC3 uses the symbols of the buttons', () => {
    expect(expressionOf(press('8', '+'))).toBe('8 +')
    expect(expressionOf(press('8', '-'))).toBe('8 −')
    expect(expressionOf(press('8', '/'))).toBe('8 ÷')
  })

  it('UI-03 AC3 shows the executed operation after = (2 + 3 =)', () => {
    expect(expressionOf(press('2', '+', '3', '='))).toBe('2 + 3 =')
    expect(expressionOf(press('2', '+', '3', '=', '='))).toBe('5 + 3 =')
  })

  it('UI-03 AC3 leaves the secondary line empty when idle or in error', () => {
    expect(expressionOf(initialState)).toBe('')
    expect(expressionOf(press('5', '/', '0', '='))).toBe('')
  })

  it('UI-04 AC4 marks the operator only until the next number is typed', () => {
    expect(activeOperator(press('1', '2', '*'))).toBe('*')
    expect(activeOperator(press('1', '2', '*', '3'))).toBeNull()
    expect(activeOperator(press('1', '2', '*', '+'))).toBe('+')
  })

  it('UI-04 AC4 marks no operator when idle or after a result', () => {
    expect(activeOperator(initialState)).toBeNull()
    expect(activeOperator(press('2', '+', '3', '='))).toBeNull()
  })
})
