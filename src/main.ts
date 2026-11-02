import './styles/style.css'
import { initialState, reducer } from './core/calculator'
import type { Action } from './core/types'
import { createButtons } from './ui/buttons'
import { bindKeyboard } from './ui/keyboard'
import { render, type DisplayElements } from './ui/render'

function element(id: string): HTMLElement {
  const found = document.getElementById(id)
  if (found === null) throw new Error(`Missing element #${id}`)
  return found
}

let state = initialState

function dispatch(action: Action): void {
  state = reducer(state, action)
  render(state, elements)
}

const buttons = createButtons(element('keys'), dispatch)
const elements: DisplayElements = {
  expression: element('expression'),
  display: element('display'),
  buttons,
}

bindKeyboard(dispatch, buttons)
render(state, elements)
