import { countDigits, formatResult } from './format'
import { DivisionByZeroError, NonFiniteResultError, applyOperator } from './operations'
import type { Action, CalculatorState, Operator } from './types'

const MAX_DIGITS = 15

export const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  lastOperation: null,
  waitingForOperand: false,
  afterResult: false,
  error: null,
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.afterResult) return inputDigit(initialState, digit)
  if (state.waitingForOperand) {
    return { ...state, currentValue: digit, waitingForOperand: false }
  }
  if (countDigits(state.currentValue) >= MAX_DIGITS) return state
  const currentValue = state.currentValue === '0' ? digit : state.currentValue + digit
  return { ...state, currentValue }
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.afterResult) return { ...initialState, currentValue: '0.' }
  if (state.waitingForOperand) {
    return { ...state, currentValue: '0.', waitingForOperand: false }
  }
  if (state.currentValue.includes('.')) return state
  return { ...state, currentValue: state.currentValue + '.' }
}

function inputOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.operator !== null && state.waitingForOperand) return { ...state, operator }
  const current = Number(state.currentValue)
  if (state.operator !== null && state.previousValue !== null) {
    const result = formatResult(applyOperator(state.operator, Number(state.previousValue), current))
    return {
      ...state,
      previousValue: result,
      currentValue: result,
      operator,
      waitingForOperand: true,
    }
  }
  return {
    ...state,
    previousValue: formatResult(current),
    operator,
    waitingForOperand: true,
    afterResult: false,
  }
}

function finishOperation(operator: Operator, left: string, operand: string): CalculatorState {
  const result = formatResult(applyOperator(operator, Number(left), Number(operand)))
  return {
    ...initialState,
    currentValue: result,
    lastOperation: { operator, left, operand },
    afterResult: true,
  }
}

function pressEquals(state: CalculatorState): CalculatorState {
  if (state.operator !== null && state.previousValue !== null) {
    return finishOperation(
      state.operator,
      state.previousValue,
      formatResult(Number(state.currentValue)),
    )
  }
  if (state.lastOperation) {
    const { operator, operand } = state.lastOperation
    return finishOperation(operator, state.currentValue, operand)
  }
  return state
}

function clearEntry(state: CalculatorState): CalculatorState {
  if (state.afterResult) return initialState
  return { ...state, currentValue: '0', waitingForOperand: false }
}

function backspace(state: CalculatorState): CalculatorState {
  if (state.afterResult || state.waitingForOperand) return state
  const shortened = state.currentValue.slice(0, -1)
  const currentValue = shortened === '' || shortened === '-' || shortened === '-0' ? '0' : shortened
  return { ...state, currentValue }
}

function negate(state: CalculatorState): CalculatorState {
  if (Number(state.currentValue) === 0) return state
  const currentValue = state.currentValue.startsWith('-')
    ? state.currentValue.slice(1)
    : `-${state.currentValue}`
  return { ...state, currentValue, waitingForOperand: false }
}

function percent(state: CalculatorState): CalculatorState {
  return {
    ...state,
    currentValue: formatResult(Number(state.currentValue) / 100),
    waitingForOperand: false,
  }
}

function reduceAction(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit)
    case 'decimal':
      return inputDecimal(state)
    case 'operator':
      return inputOperator(state, action.operator)
    case 'equals':
      return pressEquals(state)
    case 'clear':
      return initialState
    case 'clearEntry':
      return clearEntry(state)
    case 'backspace':
      return backspace(state)
    case 'negate':
      return negate(state)
    case 'percent':
      return percent(state)
  }
}

export const OPERATOR_SYMBOLS: Readonly<Record<Operator, string>> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}

/** Text of the secondary line: the pending operation, or the one just executed. */
export function expressionOf(state: CalculatorState): string {
  if (state.error !== null) return ''
  if (state.operator !== null && state.previousValue !== null) {
    return `${state.previousValue} ${OPERATOR_SYMBOLS[state.operator]}`
  }
  if (state.afterResult && state.lastOperation) {
    const { left, operator, operand } = state.lastOperation
    return `${left} ${OPERATOR_SYMBOLS[operator]} ${operand} =`
  }
  return ''
}

/** The operator to highlight: pending and still waiting for the next number. */
export function activeOperator(state: CalculatorState): Operator | null {
  return state.waitingForOperand ? state.operator : null
}

export function reducer(state: CalculatorState, action: Action): CalculatorState {
  if (state.error !== null) {
    if (action.type === 'clear') return initialState
    if (action.type === 'digit') return reduceAction(initialState, action)
    return state
  }
  try {
    return reduceAction(state, action)
  } catch (error) {
    if (error instanceof DivisionByZeroError || error instanceof NonFiniteResultError) {
      return { ...initialState, error: error.message }
    }
    throw error
  }
}
