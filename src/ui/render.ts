import { activeOperator, expressionOf } from '../core/calculator'
import { displaySize } from '../core/format'
import type { CalculatorState } from '../core/types'
import { markActive } from './buttons'

export interface DisplayElements {
  expression: HTMLElement
  display: HTMLElement
  buttons: ReadonlyMap<string, HTMLButtonElement>
}

/** Writes the state to the page: number, expression, font size and active operator. */
export function render(state: CalculatorState, elements: DisplayElements): void {
  const text = state.error ?? state.currentValue
  elements.display.textContent = text
  elements.display.dataset.size = displaySize(text)
  elements.expression.textContent = expressionOf(state)
  markActive(elements.buttons, activeOperator(state))
}
