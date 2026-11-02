import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const FORBIDDEN = /\beval\s*\(|\bnew\s+Function\b|(?<![\w.])Function\s*\(/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : [path]
  })
}

describe('sources', () => {
  it('CALC-12 AC20 contains no eval, new Function or Function call under src/', () => {
    const files = sourceFiles('src').filter((file) => /\.(ts|js|css|html)$/.test(file))
    expect(files.length).toBeGreaterThan(0)
    const offenders = files.filter((file) => FORBIDDEN.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })
})
