import type { Action, Operator } from '../core/types'
import { actionId, flashButton } from './buttons'

const OPERATOR_KEYS: ReadonlySet<string> = new Set<Operator>(['+', '-', '*', '/'])

const KEY_ACTIONS: Readonly<Record<string, Action>> = {
  '.': { type: 'decimal' },
  ',': { type: 'decimal' },
  Enter: { type: 'equals' },
  '=': { type: 'equals' },
  Backspace: { type: 'backspace' },
  Escape: { type: 'clear' },
  Delete: { type: 'clearEntry' },
  '%': { type: 'percent' },
}

/**
 * Maps a `KeyboardEvent.key` to an action, or `null` when the key does nothing.
 * `Enter` and `Space` on a focused button are left to the button's own click.
 */
export function resolveKey(key: string, targetIsButton: boolean): Action | null {
  if (targetIsButton && (key === 'Enter' || key === ' ')) return null
  if (/^[0-9]$/.test(key)) return { type: 'digit', digit: key }
  if (OPERATOR_KEYS.has(key)) return { type: 'operator', operator: key as Operator }
  return KEY_ACTIONS[key] ?? null
}

/** Listens to the keyboard, dispatches the mapped action and flashes its button. */
export function bindKeyboard(
  dispatch: (action: Action) => void,
  buttons: ReadonlyMap<string, HTMLElement>,
): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const action = resolveKey(event.key, event.target instanceof HTMLButtonElement)
    if (action === null) return
    event.preventDefault()
    dispatch(action)
    const button = buttons.get(actionId(action))
    if (button) flashButton(button)
  }
  document.addEventListener('keydown', onKeyDown)
  return () => {
    document.removeEventListener('keydown', onKeyDown)
  }
}
