import { afterEach, describe, expect, it, vi } from 'vitest'
import { BUTTONS, flashButton } from '../src/ui/buttons'

const byLabel = (label: string) => BUTTONS.find((button) => button.label === label)

describe('BUTTONS', () => {
  it('UI-01 AC1 lists the 21 buttons in the grid order of four columns and six rows', () => {
    const labels = BUTTONS.map((button) => button.label)
    expect(labels).toEqual([
      ...['C', 'CE', '⌫', '%'],
      ...['7', '8', '9', '÷'],
      ...['4', '5', '6', '×'],
      ...['1', '2', '3', '−'],
      ...['±', '0', '.', '+'],
      '=',
    ])
  })

  it('UI-01 AC1 makes = span the four columns of the last row and no other button spans', () => {
    expect(byLabel('=')?.span).toBe(4)
    expect(BUTTONS.filter((button) => button.span !== undefined)).toHaveLength(1)
  })

  it('UI-02 AC2 gives each button the action of its label', () => {
    expect(byLabel('7')?.action).toEqual({ type: 'digit', digit: '7' })
    expect(byLabel('0')?.action).toEqual({ type: 'digit', digit: '0' })
    expect(byLabel('.')?.action).toEqual({ type: 'decimal' })
    expect(byLabel('÷')?.action).toEqual({ type: 'operator', operator: '/' })
    expect(byLabel('×')?.action).toEqual({ type: 'operator', operator: '*' })
    expect(byLabel('−')?.action).toEqual({ type: 'operator', operator: '-' })
    expect(byLabel('+')?.action).toEqual({ type: 'operator', operator: '+' })
    expect(byLabel('=')?.action).toEqual({ type: 'equals' })
    expect(byLabel('C')?.action).toEqual({ type: 'clear' })
    expect(byLabel('CE')?.action).toEqual({ type: 'clearEntry' })
    expect(byLabel('⌫')?.action).toEqual({ type: 'backspace' })
    expect(byLabel('±')?.action).toEqual({ type: 'negate' })
    expect(byLabel('%')?.action).toEqual({ type: 'percent' })
  })

  it('UI-02 AC2 gives every button a distinct id', () => {
    expect(new Set(BUTTONS.map((button) => button.id)).size).toBe(BUTTONS.length)
  })

  it('UI-05 AC5 marks operators and = with kinds different from digits', () => {
    for (const label of ['÷', '×', '−', '+']) expect(byLabel(label)?.kind).toBe('operator')
    expect(byLabel('=')?.kind).toBe('equals')
    for (const label of ['0', '7', '.']) expect(byLabel(label)?.kind).toBe('digit')
  })

  it('A11Y-01 AC1 gives every button a descriptive aria-label', () => {
    for (const button of BUTTONS) expect(button.ariaLabel.trim().length).toBeGreaterThan(2)
    expect(byLabel('÷')?.ariaLabel).toBe('Dividir')
    expect(byLabel('⌫')?.ariaLabel).toBe('Apagar último dígito')
    expect(byLabel('7')?.ariaLabel).toBe('Dígito sete')
    expect(new Set(BUTTONS.map((button) => button.ariaLabel)).size).toBe(BUTTONS.length)
  })
})

describe('flashButton', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('KEY-04 AC7 adds pressed and removes it after 120 ms', () => {
    vi.useFakeTimers()
    const classes = new Set<string>()
    const button = {
      classList: {
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
      },
    } as unknown as HTMLElement

    flashButton(button)
    expect(classes.has('pressed')).toBe(true)
    vi.advanceTimersByTime(119)
    expect(classes.has('pressed')).toBe(true)
    vi.advanceTimersByTime(1)
    expect(classes.has('pressed')).toBe(false)
  })
})
