import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
}
const viteConfig = readFileSync('vite.config.ts', 'utf8')
const readme = readFileSync('README.md', 'utf8')

describe('project', () => {
  it('QUAL-01 AC1 exposes dev, build, preview, test, coverage, lint and format scripts', () => {
    const scripts = Object.keys(packageJson.scripts ?? {})
    for (const name of ['dev', 'build', 'preview', 'test', 'coverage', 'lint', 'format']) {
      expect(scripts).toContain(name)
    }
  })

  it('QUAL-03 AC4 sets coverage thresholds of 90 on src/core', () => {
    expect(viteConfig).toMatch(/include:\s*\[\s*'src\/core\/\*\*'\s*\]/)
    for (const metric of ['lines', 'functions', 'branches', 'statements']) {
      expect(viteConfig).toMatch(new RegExp(`${metric}:\\s*90\\b`))
    }
  })

  it('QUAL-04 AC5 declares no runtime dependencies', () => {
    expect(packageJson.dependencies).toBeUndefined()
  })

  it('QUAL-05 AC6 explains in the README how to run and how to test', () => {
    expect(readme).toContain('npm install && npm run dev')
    expect(readme).toContain('npm test')
    expect(readme).toContain('npm run coverage')
  })

  it('QUAL-05 AC6 documents the layout decision for % and the design decisions', () => {
    expect(readme).toMatch(/## Layout e o botão `%`/)
    expect(readme).toContain('acrescentar uma linha')
    expect(readme).toMatch(/## Decisões de design/)
  })
})
