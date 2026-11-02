import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const html = readFileSync('index.html', 'utf8')

function openingTag(id: string): string {
  const match = new RegExp(`<[^>]*\\bid="${id}"[^>]*>`).exec(html)
  expect(match, `an element with id="${id}"`).not.toBeNull()
  return match?.[0] ?? ''
}

describe('index.html', () => {
  it('A11Y-02 AC2 marks the display with aria-live="polite"', () => {
    expect(openingTag('display')).toContain('aria-live="polite"')
  })

  it('A11Y-02 AC2 keeps the expression line outside the live region', () => {
    expect(openingTag('expression')).not.toContain('aria-live')
  })
})
