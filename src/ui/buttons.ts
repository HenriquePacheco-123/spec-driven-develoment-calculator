import { OPERATOR_SYMBOLS } from '../core/calculator'
import type { Action, Operator } from '../core/types'

export type ButtonKind = 'digit' | 'operator' | 'equals' | 'control'

export interface ButtonSpec {
  /** Identifies the action, so a key press can find its button. */
  id: string
  label: string
  ariaLabel: string
  action: Action
  kind: ButtonKind
  /** Number of grid columns the button spans; one when absent. */
  span?: number
}

export function actionId(action: Action): string {
  switch (action.type) {
    case 'digit':
      return `digit-${action.digit}`
    case 'operator':
      return `operator-${action.operator}`
    default:
      return action.type
  }
}

function make(label: string, ariaLabel: string, action: Action, kind: ButtonKind): ButtonSpec {
  return { id: actionId(action), label, ariaLabel, action, kind }
}

const DIGIT_NAMES = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
]

function digit(value: number): ButtonSpec {
  const text = String(value)
  return make(text, `Dígito ${DIGIT_NAMES[value] ?? text}`, { type: 'digit', digit: text }, 'digit')
}

function operator(value: Operator, ariaLabel: string): ButtonSpec {
  return make(OPERATOR_SYMBOLS[value], ariaLabel, { type: 'operator', operator: value }, 'operator')
}

/** The keypad in grid order: four columns, six rows, `=` on the whole last row. */
export const BUTTONS: readonly ButtonSpec[] = [
  make('C', 'Limpar tudo', { type: 'clear' }, 'control'),
  make('CE', 'Limpar entrada', { type: 'clearEntry' }, 'control'),
  make('⌫', 'Apagar último dígito', { type: 'backspace' }, 'control'),
  make('%', 'Porcentagem', { type: 'percent' }, 'control'),
  digit(7),
  digit(8),
  digit(9),
  operator('/', 'Dividir'),
  digit(4),
  digit(5),
  digit(6),
  operator('*', 'Multiplicar'),
  digit(1),
  digit(2),
  digit(3),
  operator('-', 'Subtrair'),
  make('±', 'Inverter sinal', { type: 'negate' }, 'control'),
  digit(0),
  make('.', 'Ponto decimal', { type: 'decimal' }, 'digit'),
  operator('+', 'Somar'),
  { ...make('=', 'Calcular resultado', { type: 'equals' }, 'equals'), span: 4 },
]

const FLASH_MS = 120

/** Builds the keypad in `root` and sends each button's action to `dispatch` on click. */
export function createButtons(
  root: HTMLElement,
  dispatch: (action: Action) => void,
): Map<string, HTMLButtonElement> {
  const buttons = new Map<string, HTMLButtonElement>()
  for (const spec of BUTTONS) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = spec.label
    button.setAttribute('aria-label', spec.ariaLabel)
    button.classList.add('key', `key--${spec.kind}`)
    if (spec.span !== undefined) button.classList.add(`span-${spec.span}`)
    button.addEventListener('click', () => {
      dispatch(spec.action)
    })
    root.append(button)
    buttons.set(spec.id, button)
  }
  return buttons
}

/** Gives a button a brief visual press, used when its key is pressed. */
export function flashButton(button: HTMLElement): void {
  button.classList.add('pressed')
  setTimeout(() => {
    button.classList.remove('pressed')
  }, FLASH_MS)
}

/** Highlights the pending operator button and clears the highlight on the others. */
export function markActive(
  buttons: ReadonlyMap<string, HTMLButtonElement>,
  active: Operator | null,
): void {
  for (const [id, button] of buttons) {
    if (!id.startsWith('operator-')) continue
    const isActive = id === `operator-${active}`
    button.classList.toggle('active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  }
}
