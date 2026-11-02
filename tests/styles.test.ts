import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/style.css', 'utf8')
const DARK_QUERY = '@media (prefers-color-scheme: dark)'
const darkStart = css.indexOf(DARK_QUERY)
const light = css.slice(0, darkStart)
const dark = css.slice(darkStart)
const ROLES = ['screen', 'expression', 'key', 'control', 'operator', 'equals', 'active']

function colors(block: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    if (name !== undefined && value !== undefined) found.set(name, value)
  }
  return found
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(foreground: string, background: string): number {
  const [a, b] = [luminance(foreground), luminance(background)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function rule(selector: string): string {
  const escaped = selector.replace(/[.[\]'"]/g, '\\$&')
  const match = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)
  expect(match, `a rule for ${selector}`).not.toBeNull()
  return match?.[1] ?? ''
}

function fontSizeRem(selector: string): number {
  const match = /font-size:\s*([\d.]+)rem/.exec(rule(selector))
  expect(match, `a rem font-size in ${selector}`).not.toBeNull()
  return Number(match?.[1])
}

describe('style.css', () => {
  it('A11Y-04 AC4 keeps text contrast of at least 4.5 in the light theme', () => {
    const theme = colors(light)
    for (const role of ROLES) {
      const [fg, bg] = [theme.get(`${role}-fg`), theme.get(`${role}-bg`)]
      expect(fg, `${role}-fg`).toBeDefined()
      expect(bg, `${role}-bg`).toBeDefined()
      expect(contrast(fg ?? '', bg ?? ''), `light ${role}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('A11Y-04 AC4 keeps text contrast of at least 4.5 in the dark theme', () => {
    const theme = colors(dark)
    for (const role of ROLES) {
      const [fg, bg] = [theme.get(`${role}-fg`), theme.get(`${role}-bg`)]
      expect(fg, `${role}-fg`).toBeDefined()
      expect(bg, `${role}-bg`).toBeDefined()
      expect(contrast(fg ?? '', bg ?? ''), `dark ${role}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('THEME-01 AC6 defines the light theme by default and the dark one under prefers-color-scheme', () => {
    expect(darkStart).toBeGreaterThan(0)
    expect(colors(light).has('screen-bg')).toBe(true)
    expect(colors(dark).has('screen-bg')).toBe(true)
    expect(colors(light).get('screen-bg')).not.toBe(colors(dark).get('screen-bg'))
  })

  it('UI-05 AC5 gives operators and = backgrounds different from the digit keys in both themes', () => {
    for (const theme of [colors(light), colors(dark)]) {
      const digit = theme.get('key-bg')
      expect(theme.get('operator-bg')).not.toBe(digit)
      expect(theme.get('equals-bg')).not.toBe(digit)
      expect(theme.get('operator-bg')).not.toBe(theme.get('equals-bg'))
    }
    expect(rule('.key--operator')).toContain('var(--operator-bg)')
    expect(rule('.key--equals')).toContain('var(--equals-bg)')
  })

  it('A11Y-03 AC3 draws an outline on keyboard focus', () => {
    expect(rule('.key:focus-visible')).toMatch(/outline:\s*[^;]*\d+px/)
  })

  it('RESP-01 AC5 lays the keys out in four fractional columns', () => {
    expect(rule('.keys')).toContain('grid-template-columns: repeat(4, 1fr)')
    expect(rule('.span-4')).toContain('grid-column: span 4')
  })

  it('RESP-01 AC5 sets no fixed width wider than 320px', () => {
    const widths = [...css.matchAll(/(?:^|[\s;{])(?:min-)?width:\s*([\d.]+)(px|rem)\s*;/g)]
    for (const [, amount, unit] of widths) {
      const px = Number(amount) * (unit === 'rem' ? 16 : 1)
      expect(px).toBeLessThanOrEqual(320)
    }
    expect(rule('.calculator')).toContain('width: min(100%')
  })

  it('UI-06 AC6 shrinks the display font as the text grows', () => {
    const normal = fontSizeRem('.display')
    const small = fontSizeRem(`.display[data-size='small']`)
    const tiny = fontSizeRem(`.display[data-size='tiny']`)
    expect(tiny).toBeLessThan(small)
    expect(small).toBeLessThan(normal)
  })

  it('UI-06 AC7 clips overflow and wraps long text inside the display', () => {
    expect(rule('.display')).toContain('overflow: hidden')
    expect(rule('.display')).toContain('overflow-wrap: anywhere')
    expect(rule('.screen')).toContain('overflow: hidden')
  })
})
