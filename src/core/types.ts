export type Operator = '+' | '-' | '*' | '/'

export type Action =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'clearEntry' }
  | { type: 'backspace' }
  | { type: 'negate' }
  | { type: 'percent' }

export interface LastOperation {
  operator: Operator
  /** Value on the left of the last execution; becomes the result on every repeated `=`. */
  left: string
  operand: string
}

export interface CalculatorState {
  /** Number being typed or shown. */
  currentValue: string
  /** Accumulated value on the left of the pending operator. */
  previousValue: string | null
  operator: Operator | null
  lastOperation: LastOperation | null
  /** An operator was just pressed and the next number has not started. */
  waitingForOperand: boolean
  /** The display shows the result of an `=`. */
  afterResult: boolean
  error: string | null
}
