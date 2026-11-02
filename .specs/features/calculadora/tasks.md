# Calculadora Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/calculadora/design.md`
**Status**: In Progress (all 26 tasks gated, waiting for the user commit, proofs and the Verifier)
**Approved**: 2026-11-02 - user: "aprovado, com ERR-03"
**Build**: `npm run build; npm run lint`
**Run unit**: `npx vitest run --reporter=verbose`

**Convention for tests:** every test name starts with the requirement ID and the AC number it proves, for example `CALC-01 AC1 appends the digit to the current number`. Edge-case tests start with `EDGE-1` to `EDGE-4`, in the order of the spec's Edge Cases list.

---

## Test Coverage Matrix

> Generated from the spec and PRD §8 - confirm before Execute. Guidelines found: none in the repo (new project); the PRD sets the 90% coverage floor on `src/core/`, applied in `vite.config.ts`. Strong defaults apply otherwise.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| `src/core/` (operations, format, reducer, selectors) | unit | All branches; 1:1 to spec ACs; every listed edge case; coverage >= 90% | `tests/operations.test.ts`, `tests/format.test.ts`, `tests/calculator.test.ts` | `npx vitest run` |
| `src/ui/` pure parts (`BUTTONS`, `resolveKey`, `flashButton`) | unit | One test per AC they carry (UI-01, UI-02, UI-05, A11Y-01, KEY-01 to KEY-05) | `tests/buttons.test.ts`, `tests/keyboard.test.ts` | `npx vitest run` |
| `index.html`, `style.css`, `README.md`, `package.json`, `vite.config.ts` | unit (static reads) | One test per AC they carry (A11Y-02 to A11Y-04, RESP-01, THEME-01, UI-05, UI-06, QUAL-01, QUAL-03 to QUAL-05) | `tests/page.test.ts`, `tests/styles.test.ts`, `tests/project.test.ts` | `npx vitest run` |
| `src/ui/` DOM glue (`createButtons`, `bindKeyboard`, `render`), `src/main.ts` | none - build gate and walk | - | - | build gate, then the walk |
| Types, tool config (`tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `.gitignore`) | none - build gate only | - | - | build gate only |

## Gate Check Commands

> Generated from the PRD §9 scripts - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests | `npx vitest run` |
| Full | Same as Quick (the project has no e2e or integration layer) | `npx vitest run` |
| Build | After phase completion, and after config or DOM-glue tasks | `npm run build; npm run lint; npm run coverage` |

---

## Execution Plan

Phases run in order, and tasks inside a phase run in order. Every task depends on the one before it in its phase; the first task of a phase depends on the last task of the previous phase, drawn as the arrow that opens the phase's diagram.

### Phase 1: Tooling

```
T1 → T2 → T3 → T4 → T5 → T6
```

### Phase 2: Core types and pure helpers

```
T6 → T7 → T8 → T9
```

### Phase 3: Reducer

```
T9 → T10 → T11 → T12 → T13 → T14 → T15 → T16
```

### Phase 4: UI logic

```
T16 → T17 → T18 → T19 → T20 → T21
```

### Phase 5: Page

```
T21 → T22 → T23 → T24
```

### Phase 6: Delivery

```
T24 → T25 → T26
```

---

## Task Breakdown

### T1: Initialize git and .gitignore

**What**: Run `git init` and add a `.gitignore` for `node_modules`, `dist`, `coverage`.
**Where**: `.gitignore`
**Depends on**: None
**Reuses**: Nothing yet
**Requirement**: QUAL-02

**Done when**:

- [x] `git rev-parse --is-inside-work-tree` prints `true`
- [x] `.gitignore` lists `node_modules`, `dist` and `coverage`
- [x] `.specs/` is tracked (not ignored)

**Tests**: none
**Gate**: `git status --short` shows only the intended files

**Commit**: `chore(repo): init git and gitignore` (done in the bootstrap commit, see Handoff)

---

### T2: Create package.json and install dev dependencies

**What**: Create `package.json` with the seven scripts from PRD §9, no `dependencies`, and devDependencies: `typescript`, `vite`, `vitest`, `@vitest/coverage-v8`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`, `prettier`, `eslint-config-prettier`, `@types/node`.
**Where**: `package.json`
**Depends on**: T1
**Reuses**: Nothing yet
**Requirement**: QUAL-01, QUAL-04

**Done when**:

- [x] Scripts `dev`, `build` (`tsc && vite build`), `preview`, `test` (`vitest run`), `coverage` (`vitest run --coverage`), `lint` (`eslint . --max-warnings 0`), `format` (`prettier --write .`) exist
- [x] `npm install` ends without errors
- [x] No `dependencies` key

**Tests**: none
**Gate**: `npm ls --depth=0` lists every devDependency

**Commit**: `chore(deps): add package.json and dev dependencies` (done in the bootstrap commit, see Handoff)

---

### T3: Configure TypeScript strict

**What**: Create `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `noEmit`, `moduleResolution: bundler`, DOM lib, and `include` for `src`, `tests` and `vite.config.ts`.
**Where**: `tsconfig.json`
**Depends on**: T2
**Reuses**: Nothing yet
**Requirement**: QUAL-02

**Done when**:

- [x] `npx tsc --showConfig` shows `strict: true`
- [x] `include` covers `src`, `tests` and `vite.config.ts`

**Tests**: none
**Gate**: `npx tsc --showConfig` exits 0

**Commit**: `chore(ts): add strict tsconfig` (done in the bootstrap commit, see Handoff)

---

### T4: Configure Vite and Vitest

**What**: Create `vite.config.ts` with the `test` block: `environment: node`, `include: tests/**/*.test.ts`, `passWithNoTests`, coverage via v8 on `src/core/**` with `thresholds` of 90 for lines, functions, branches and statements.
**Where**: `vite.config.ts`
**Depends on**: T3
**Reuses**: Nothing yet
**Requirement**: QUAL-03

**Done when**:

- [x] `npx vitest run` exits 0 with no tests yet
- [x] Thresholds of 90 are set for `src/core/**`

**Tests**: none
**Gate**: `npx vitest run` exits 0

**Commit**: `chore(test): configure vite and vitest with coverage thresholds`

---

### T5: Configure ESLint

**What**: Create `eslint.config.js` (flat config) with `@eslint/js` recommended, `typescript-eslint` recommended type-checked, `eslint-config-prettier`, browser and node globals, and ignores for `dist` and `coverage`.
**Where**: `eslint.config.js`
**Depends on**: T4
**Reuses**: Nothing yet
**Requirement**: QUAL-02

**Done when**:

- [x] `npx eslint . --max-warnings 0` exits 0

**Tests**: none
**Gate**: `npx eslint . --max-warnings 0` exits 0

**Commit**: `chore(lint): configure eslint` (done in the bootstrap commit, see Handoff)

---

### T6: Configure Prettier

**What**: Create `.prettierrc.json` (single quotes, no semicolons, print width 100) and format the repo once.
**Where**: `.prettierrc.json`
**Depends on**: T5
**Reuses**: Nothing yet
**Requirement**: QUAL-02

**Done when**:

- [x] `npx prettier --check .` exits 0

**Tests**: none
**Gate**: `npx prettier --check .` exits 0

**Commit**: `chore(format): configure prettier`

---

### T7: Define core types

**What**: Create the shared types: `Operator`, `Action`, `LastOperation`, `CalculatorState`, as in design Data Models. Add a placeholder `src/main.ts` only if `tsc` needs an input file.
**Where**: `src/core/types.ts`
**Depends on**: T6
**Reuses**: design.md Data Models
**Requirement**: CALC-05

**Done when**:

- [x] Types exported and match design.md
- [x] No TypeScript errors
- [x] Gate check passes: `npm run build; npm run lint`

**Tests**: none
**Gate**: build

**Commit**: `feat(core): add calculator types`

---

### T8: Implement the four operations

**What**: Create `add`, `subtract`, `multiply`, `divide`, `applyOperator`, `DivisionByZeroError` and `NonFiniteResultError`; write `tests/operations.test.ts` with one test per AC it carries.
**Where**: `src/core/operations.ts`
**Depends on**: T7
**Reuses**: `src/core/types.ts`
**Requirement**: CALC-10, ERR-03

**Done when**:

- [x] CALC-10 AC17 tests cover integers, decimals and negatives for each operation
- [x] `divide` by `0` throws `DivisionByZeroError`; by `0.0` and `-0` too
- [x] `applyOperator` throws `NonFiniteResultError` when the result is `Infinity`
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 9 tests in `tests/operations.test.ts`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): add arithmetic operations`

---

### T9: Implement result formatting

**What**: Create `formatResult`, `countDigits` and `displaySize`; write `tests/format.test.ts`.
**Where**: `src/core/format.ts`
**Depends on**: T8
**Reuses**: Nothing yet
**Requirement**: CALC-11, UI-06

**Done when**:

- [x] `0.1 + 0.2` formats as `0.3` (CALC-11 AC18)
- [x] `1 / 3` formats as `0.3333333333`
- [x] A result with more than 15 digits formats as exponential with up to 10 decimals, for example `1.2345678901e+20` (CALC-11 AC19)
- [x] `displaySize` returns `normal`, `small` or `tiny` by text length (UI-06 AC6, AC7)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 10 tests in `tests/format.test.ts`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): add result formatting and display size`

---

### T10: Reducer: initial state, digits and decimal point

**What**: Create `initialState` and `reducer` handling `digit` and `decimal` (CALC-01 to CALC-04) and the dispatch skeleton; write `tests/calculator.test.ts` with these cases.
**Where**: `src/core/calculator.ts`
**Depends on**: T9
**Reuses**: `src/core/types.ts`, `src/core/format.ts` (`countDigits`)
**Requirement**: CALC-01, CALC-02, CALC-03, CALC-04

**Done when**:

- [x] Digit appends; `0` then `0` stays `0`; `0` then `7` shows `7`
- [x] `.` appends once, a second `.` is ignored, `.` first shows `0.`
- [x] 15 digits block more digits, and `.` is still accepted at 15 digits (EDGE-1)
- [x] Reducer returns a new object and never mutates its input
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 9 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): reducer for digits and decimal point`

---

### T11: Reducer: operators

**What**: Handle the `operator` action: store the number and operator, calculate a pending operation, chain left to right, replace the operator when pressed twice, continue from a result.
**Where**: `src/core/calculator.ts` (modify)
**Depends on**: T10
**Reuses**: `src/core/operations.ts` (`applyOperator`), `src/core/format.ts` (`formatResult`)
**Requirement**: CALC-05, CALC-06, CALC-07, CALC-10

**Done when**:

- [x] `2 + 3 +` shows `5` with `+` pending
- [x] `2 + 3 × 4 =` is not tested here; `2 + 3 ×` shows `5`
- [x] `+` then `×` replaces the operator without calculating
- [x] `-` as the first operator with `0` is a subtraction of `0` (EDGE-2)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 6 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): reducer for operators`

---

### T12: Reducer: equals and repeated equals

**What**: Handle the `equals` action: run the pending operation, store `lastOperation`, repeat it on further `=`, use the current value as operand when none was typed, ignore `=` with nothing to run, and start a new calculation on a digit after a result.
**Where**: `src/core/calculator.ts` (modify)
**Depends on**: T11
**Reuses**: Nothing yet
**Requirement**: CALC-06, CALC-08, CALC-09

**Done when**:

- [x] `2 + 3 × 4 =` shows `20`
- [x] `2 + 3 = = =` shows `5`, `8`, `11`
- [x] `5 + =` shows `10`; `=` with no operator and no last operation changes nothing
- [x] Digit after a result starts a new calculation; operator after a result continues from it
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 8 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): reducer for equals and repeated equals`

---

### T13: Reducer: error state

**What**: Catch `DivisionByZeroError` (message `Não é possível dividir por zero`) and `NonFiniteResultError` (message `Resultado fora do limite`) in operator and equals handling, set `error`, ignore every action except `C` and digits while the error is set, and clear the error on `C` or a digit.
**Where**: `src/core/calculator.ts` (modify)
**Depends on**: T12
**Reuses**: Nothing yet
**Requirement**: ERR-01, ERR-02, ERR-03

**Done when**:

- [x] `5 ÷ 0 =` sets the error message
- [x] Operators, `=`, `±`, `%`, `⌫`, `CE` are ignored during the error
- [x] `C` clears the error; a digit clears it and starts a new calculation
- [x] `=` after an error cleared by `C` keeps `0` (EDGE-4)
- [x] `999999999999999 × 999999999999999 =` followed by repeated `=` ends in `Resultado fora do limite` (ERR-03 AC12)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 6 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): reducer error state for division by zero and overflow`

---

### T14: Reducer: controls

**What**: Handle `clear`, `clearEntry`, `backspace`, `negate` and `percent` with the transition rules in design.md.
**Where**: `src/core/calculator.ts` (modify)
**Depends on**: T13
**Reuses**: Nothing yet
**Requirement**: CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05

**Done when**:

- [x] `C` resets every field; `CE` clears only the current number; `CE` after a result acts as `C`
- [x] `⌫` removes the last character, gives `0` when nothing is left, and keeps a result
- [x] `±` flips the sign and leaves `0` alone
- [x] `%` divides the current number by 100, and `50 + 10 %` becomes `50 + 0.1`
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 10 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): reducer for clear, backspace, sign and percent`

---

### T15: Selectors: expression and active operator

**What**: Add `expressionOf` (for example `12 ×`, `2 + 3 =`, empty when idle) and `activeOperator` (the pending operator only while waiting for the next number).
**Where**: `src/core/calculator.ts` (modify)
**Depends on**: T14
**Reuses**: Nothing yet
**Requirement**: UI-03, UI-04

**Done when**:

- [x] `1 2 ×` gives `12 ×`; `2 + 3 =` gives `2 + 3 =`
- [x] `activeOperator` is `×` after `12 ×` and `null` after the next digit
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 4 new tests; coverage of `src/core/` is at least 90%

**Tests**: unit
**Gate**: quick

**Commit**: `feat(core): add expression and active operator selectors`

---

### T16: Static check: no eval or Function

**What**: Write a test that reads every file under `src/` and fails on `eval(`, `new Function` or `Function(`.
**Where**: `tests/no-eval.test.ts`
**Depends on**: T15
**Reuses**: Nothing yet
**Requirement**: CALC-12

**Done when**:

- [x] CALC-12 AC20 test passes on the current sources
- [x] The test fails when a temp file with `eval(` is added (checked once by hand, then removed)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: 1 new test

**Tests**: unit
**Gate**: quick

**Commit**: `test(core): forbid eval and Function in sources`

---

### T17: Button grid as data

**What**: Create `BUTTONS` with the 21 buttons in grid order (`C CE ⌫ %`, `7 8 9 ÷`, `4 5 6 ×`, `1 2 3 −`, `± 0 . +`, `=` with `span: 4`), each with `label`, `ariaLabel`, `action` and `kind`; write `tests/buttons.test.ts`.
**Where**: `src/ui/buttons.ts`
**Depends on**: T16
**Reuses**: `src/core/types.ts`
**Requirement**: UI-01, UI-02, UI-05, A11Y-01

**Done when**:

- [x] Order and labels match the grid in UI-01
- [x] Every button has a non-empty `ariaLabel`, for example `Dividir` and `Apagar último dígito`
- [x] Each button's action matches its label (UI-02)
- [x] Operators and `=` have a `kind` different from digits (UI-05)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 4 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(ui): describe the button grid as data`

---

### T18: Buttons: DOM creation, active marker and flash

**What**: Add `createButtons`, `markActive` and `flashButton` to the same file; test `flashButton` with a minimal fake element and fake timers.
**Where**: `src/ui/buttons.ts` (modify)
**Depends on**: T17
**Reuses**: Nothing yet
**Requirement**: UI-04, KEY-04

**Done when**:

- [x] `createButtons` renders one `<button>` per `BUTTONS` item and returns a map by label
- [x] `flashButton` adds `pressed` and removes it after 120 ms (KEY-04 AC7, unit)
- [x] `markActive` sets `aria-pressed` and a class on the active operator only
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 1 new test

**Tests**: unit
**Gate**: quick

**Commit**: `feat(ui): create buttons, mark active operator and flash on key press`

---

### T19: Keyboard map

**What**: Create `resolveKey(key, targetIsButton)` covering digits, `.` and `,`, operators, `Enter` and `=`, `Backspace`, `Escape`, `Delete`, `%`, and `null` for `Enter` or `Space` with a focused button; write `tests/keyboard.test.ts`.
**Where**: `src/ui/keyboard.ts`
**Depends on**: T18
**Reuses**: `src/core/types.ts`
**Requirement**: KEY-01, KEY-02, KEY-03, KEY-05

**Done when**:

- [x] Each key in PRD §7 maps to the action in KEY-01 to KEY-03
- [x] `Enter` and ` ` with `targetIsButton = true` return `null` (KEY-05)
- [x] Unmapped keys return `null`
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 8 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(ui): map keyboard keys to actions`

---

### T20: Keyboard binding

**What**: Add `bindKeyboard(dispatch, buttons)`: listen to `keydown`, call `resolveKey`, dispatch, flash the matching button, and `preventDefault` on `/` and `Enter`.
**Where**: `src/ui/keyboard.ts` (modify)
**Depends on**: T19
**Reuses**: `src/ui/buttons.ts` (`flashButton`)
**Requirement**: KEY-04, KEY-05

**Done when**:

- [x] The handler passes `event.target instanceof HTMLButtonElement` to `resolveKey`
- [x] Returns a function that removes the listener
- [x] Gate check passes: `npm run build; npm run lint; npm run coverage`

**Tests**: none
**Gate**: build

**Commit**: `feat(ui): bind keyboard events`

---

### T21: Render state to the DOM

**What**: Create `render(state, els)`: set the number text, the expression text, `data-size` from `displaySize`, and the active operator through `markActive`.
**Where**: `src/ui/render.ts`
**Depends on**: T20
**Reuses**: `expressionOf`, `activeOperator`, `displaySize`, `markActive`
**Requirement**: UI-03, UI-06

**Done when**:

- [x] Display shows `error` when it is set
- [x] `data-size` follows `displaySize` of the shown text
- [x] Gate check passes: `npm run build; npm run lint; npm run coverage`

**Tests**: none
**Gate**: build

**Commit**: `feat(ui): render calculator state`

---

### T22: Page markup

**What**: Create `index.html`: `#expression`, `#display` with `aria-live="polite"`, `#keys`, `lang="pt-BR"`, viewport meta, and the module script for `src/main.ts`; write `tests/page.test.ts`.
**Where**: `index.html`
**Depends on**: T21
**Reuses**: Nothing yet
**Requirement**: A11Y-02

**Done when**:

- [x] A11Y-02 AC2 test reads `index.html` and finds `aria-live="polite"` on the display
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 1 new test

**Tests**: unit
**Gate**: quick

**Commit**: `feat(ui): add page markup`

---

### T23: Styles: layout, themes and focus

**What**: Create `src/styles/style.css`: 4-column grid with `.span-4`, `--<role>-fg`/`--<role>-bg` variables for light and dark (`prefers-color-scheme`), accent colours for operators and `=`, active-operator style, `:focus-visible` outline, `pressed` style, `[data-size]` font sizes, overflow clipping; write `tests/styles.test.ts` with a contrast calculator.
**Where**: `src/styles/style.css`
**Depends on**: T22
**Reuses**: Nothing yet
**Requirement**: UI-05, UI-06, A11Y-03, A11Y-04, RESP-01, THEME-01

**Done when**:

- [x] Every `--<role>-fg` over `--<role>-bg` pair has contrast >= 4.5 in both themes (A11Y-04)
- [x] The dark block sits inside `@media (prefers-color-scheme: dark)` (THEME-01)
- [x] `:focus-visible` sets an outline (A11Y-03); operator and digit keys use different backgrounds (UI-05)
- [x] Grid uses `repeat(4, 1fr)` with no fixed width above 320px (RESP-01); `[data-size]` and overflow rules exist (UI-06)
- [x] Gate check passes: `npx vitest run`
- [x] Test count: at least 7 new tests

**Tests**: unit
**Gate**: quick

**Commit**: `feat(ui): add layout, themes and focus styles`

---

### T24: Entry point

**What**: Create `src/main.ts`: import the CSS, find the elements (throw if missing), hold the state, define `dispatch`, call `createButtons`, `bindKeyboard` and `render`.
**Where**: `src/main.ts`
**Depends on**: T23
**Reuses**: `reducer`, `render`, `createButtons`, `bindKeyboard`
**Requirement**: UI-02

**Done when**:

- [x] `npm run build` produces `dist/`
- [x] Walk: `1 2 × 3 4 5` shows `12 ×` above `345` (done in the final walk, see Handoff)
- [x] Gate check passes: `npm run build; npm run lint; npm run coverage`

**Tests**: none
**Gate**: build

**Commit**: `feat(ui): wire the calculator in main`

---

### T25: README

**What**: Write `README.md` in Portuguese: how to run, test and build; the 4x6 layout with `%` as a button; the design decisions (reducer, no eval, 10-decimal rounding, exponential over 15 digits).
**Where**: `README.md`
**Depends on**: T24
**Reuses**: Nothing yet
**Requirement**: QUAL-05

**Done when**:

- [x] README names `npm install && npm run dev`, `npm test`, `npm run coverage`, `npm run lint`, `npm run build`
- [x] README explains where `%` sits in the grid and the rounding and exponential limits

**Tests**: none
**Gate**: build

**Commit**: `docs: add README`

---

### T26: Project checks

**What**: Write `tests/project.test.ts` that reads `package.json`, `vite.config.ts` and `README.md`.
**Where**: `tests/project.test.ts`
**Depends on**: T25
**Reuses**: Nothing yet
**Requirement**: QUAL-01, QUAL-03, QUAL-04, QUAL-05

**Done when**:

- [x] QUAL-01 AC1: the seven scripts exist
- [x] QUAL-03 AC4: thresholds of 90 are set for `src/core/**`
- [x] QUAL-04 AC5: `package.json` has no `dependencies`
- [x] QUAL-05 AC6: README mentions how to run, how to test, `%` and the design decisions
- [x] Gate check passes: `npm run build; npm run lint; npm run coverage`
- [x] Test count: at least 4 new tests

**Tests**: unit
**Gate**: build

**Commit**: `test(project): check scripts, thresholds, dependencies and README`

---

## Checks

**C1** - Digits 0 to 9 append to the current number (`1` then `2` shows `12`) (CALC-01, AC 1)
Proof: run unit | ✓ CALC-01 AC1

**C2** - `0` then `0` keeps `0` (CALC-02, AC 2)
Proof: run unit | ✓ CALC-02 AC2

**C3** - `0` then `7` shows `7` (CALC-02, AC 3)
Proof: run unit | ✓ CALC-02 AC3

**C4** - The decimal point appends `.` to the current number (`1` `.` `5` shows `1.5`) (CALC-03, AC 4)
Proof: run unit | ✓ CALC-03 AC4

**C5** - A second `.` in the same number is ignored (CALC-03, AC 5)
Proof: run unit | ✓ CALC-03 AC5

**C6** - `.` with no digit before it shows `0.` (CALC-03, AC 6)
Proof: run unit | ✓ CALC-03 AC6

**C7** - A 15th digit is accepted and a 16th is ignored (CALC-04, AC 7)
Proof: run unit | ✓ CALC-04 AC7

**C8** - `1 2 +` keeps `12` as the previous value with `+` pending (CALC-05, AC 8)
Proof: run unit | ✓ CALC-05 AC8

**C9** - `2 + 3 +` shows `5` and keeps `+` pending (CALC-06, AC 9)
Proof: run unit | ✓ CALC-06 AC9

**C10** - `2 + 3 × 4 =` shows `20` (CALC-06, AC 10)
Proof: run unit | ✓ CALC-06 AC10

**C11** - `+` then `×` replaces the operator without calculating (CALC-07, AC 11)
Proof: run unit | ✓ CALC-07 AC11

**C12** - `2 + 3 =` shows `5` and stores the last operation (CALC-08, AC 12)
Proof: run unit | ✓ CALC-08 AC12

**C13** - `2 + 3 = = =` shows `5`, then `8`, then `11` (CALC-08, AC 13)
Proof: run unit | ✓ CALC-08 AC13

**C14** - `5 + =` shows `10` (CALC-08, AC 14)
Proof: run unit | ✓ CALC-08 AC14

**C15** - A digit after a result starts a new calculation (CALC-09, AC 15)
Proof: run unit | ✓ CALC-09 AC15

**C16** - An operator after a result continues from the result (CALC-09, AC 16)
Proof: run unit | ✓ CALC-09 AC16

**C17** - The four operations give correct results with integers, decimals and negatives (`-1.5 × 2 = -3`) (CALC-10, AC 17)
Proof: run unit | ✓ CALC-10 AC17

**C18** - `0.1 + 0.2` shows `0.3`, rounded to at most 10 decimals with trailing zeros removed (CALC-11, AC 18)
Proof: run unit | ✓ CALC-11 AC18

**C19** - A result with more than 15 digits shows as `1.2345678901e+20` style exponential (CALC-11, AC 19)
Proof: run unit | ✓ CALC-11 AC19

**C20** - No file under `src/` contains `eval(`, `new Function` or `Function(` (CALC-12, AC 20)
Proof: run unit | ✓ CALC-12 AC20

**C21** - `C` resets current value, previous value, operator, last operation and error (CTRL-01, AC 1)
Proof: run unit | ✓ CTRL-01 AC1

**C22** - `CE` sets the current number to `0` and keeps the operator and previous value (CTRL-02, AC 2)
Proof: run unit | ✓ CTRL-02 AC2

**C23** - `CE` right after a result acts as `C` (CTRL-02, AC 3)
Proof: run unit | ✓ CTRL-02 AC3

**C24** - `⌫` removes the last character, and gives `0` when nothing is left (`-5` becomes `0`) (CTRL-03, AC 4)
Proof: run unit | ✓ CTRL-03 AC4

**C25** - `⌫` right after a result keeps the result (CTRL-03, AC 5)
Proof: run unit | ✓ CTRL-03 AC5

**C26** - `±` flips the sign of the current number (`5` becomes `-5`) (CTRL-04, AC 6)
Proof: run unit | ✓ CTRL-04 AC6

**C27** - `±` on `0` keeps `0` (CTRL-04, AC 7)
Proof: run unit | ✓ CTRL-04 AC7

**C28** - `%` divides the current number by 100 (`50 + 10 %` leaves `0.1` as the operand) (CTRL-05, AC 8)
Proof: run unit | ✓ CTRL-05 AC8

**C29** - `5 ÷ 0 =` shows `Não é possível dividir por zero` (ERR-01, AC 9)
Proof: run unit | ✓ ERR-01 AC9

**C30** - During the error, operators, `=`, `±`, `%`, `⌫` and `CE` leave the state unchanged (ERR-02, AC 10)
Proof: run unit | ✓ ERR-02 AC10

**C31** - During the error, `C` clears it, and a digit clears it and starts a new calculation (ERR-02, AC 11)
Proof: run unit | ✓ ERR-02 AC11

**C63** - Multiplying until the result is `Infinity` shows `Resultado fora do limite` and blocks operators like the division error (ERR-03, AC 12)
Proof: run unit | ✓ ERR-03 AC12

**C32** - `BUTTONS` lists the 21 buttons in the grid order of UI-01, with `=` spanning 4 columns (UI-01, AC 1)
Proof: run unit | ✓ UI-01 AC1

**C33** - Each button in `BUTTONS` carries the action of its label (`7` is the digit 7, `÷` is the operator `/`) (UI-02, AC 2)
Proof: run unit | ✓ UI-02 AC2

**C34** - After `1 2 ×` the expression reads `12 ×` (UI-03, AC 3)
Proof: run unit | ✓ UI-03 AC3

**C35** - `activeOperator` is `*` after `12 ×` and `null` after the next digit (UI-04, AC 4)
Proof: run unit | ✓ UI-04 AC4

**C36** - The CSS gives operator keys a different background than digit keys (UI-05, AC 5)
Proof: run unit | ✓ UI-05 AC5

**C37** - `displaySize` shrinks the font as the displayed text grows (UI-06, AC 6)
Proof: run unit | ✓ UI-06 AC6

**C38** - The error message gets a reduced font size and the display clips overflow (UI-06, AC 7)
Proof: run unit | ✓ UI-06 AC7

**C39** - Keys `0` to `9` map to digit actions (KEY-01, AC 1)
Proof: run unit | ✓ KEY-01 AC1

**C40** - Keys `.` and `,` map to the decimal action (KEY-01, AC 2)
Proof: run unit | ✓ KEY-01 AC2

**C41** - Keys `+`, `-`, `*`, `/` map to the four operators (KEY-02, AC 3)
Proof: run unit | ✓ KEY-02 AC3

**C42** - Keys `Enter` and `=` map to equals (KEY-02, AC 4)
Proof: run unit | ✓ KEY-02 AC4

**C43** - `Backspace`, `Escape`, `Delete` map to `⌫`, `C`, `CE` (KEY-03, AC 5)
Proof: run unit | ✓ KEY-03 AC5

**C44** - Key `%` maps to percent (KEY-03, AC 6)
Proof: run unit | ✓ KEY-03 AC6

**C45** - `flashButton` adds `pressed` and removes it after 120 ms (KEY-04, AC 7)
Proof: run unit | ✓ KEY-04 AC7

**C46** - `Enter` or `Space` with a focused button maps to no action (KEY-05, AC 8)
Proof: run unit | ✓ KEY-05 AC8

**C47** - Every button has a non-empty descriptive `aria-label` (`Dividir`, `Apagar último dígito`) (A11Y-01, AC 1)
Proof: run unit | ✓ A11Y-01 AC1

**C48** - The display carries `aria-live="polite"` in `index.html` (A11Y-02, AC 2)
Proof: run unit | ✓ A11Y-02 AC2

**C49** - `style.css` sets an outline on `:focus-visible` (A11Y-03, AC 3)
Proof: run unit | ✓ A11Y-03 AC3

**C50** - Every foreground over background pair has contrast of at least 4.5 in the light and dark themes (A11Y-04, AC 4)
Proof: run unit | ✓ A11Y-04 AC4

**C51** - The key grid uses `repeat(4, 1fr)` and no fixed width above 320px (RESP-01, AC 5)
Proof: run unit | ✓ RESP-01 AC5

**C52** - The dark theme sits inside `@media (prefers-color-scheme: dark)` and the light theme is the default (THEME-01, AC 6)
Proof: run unit | ✓ THEME-01 AC6

**C53** - `package.json` exposes `dev`, `build`, `preview`, `test`, `coverage`, `lint` and `format` (QUAL-01, AC 1)
Proof: run unit | ✓ QUAL-01 AC1

**C54** - `npm run build` ends with exit code 0 under `tsc` strict (QUAL-02, AC 2)
Proof: `npm run build`

**C55** - `npm run lint` ends with exit code 0 and zero warnings (QUAL-02, AC 3)
Proof: `npm run lint`

**C56** - `vite.config.ts` sets coverage thresholds of 90 on `src/core/**`, so `npm run coverage` fails below 90 (QUAL-03, AC 4)
Proof: run unit | ✓ QUAL-03 AC4

**C57** - `package.json` declares no `dependencies` (QUAL-04, AC 5)
Proof: run unit | ✓ QUAL-04 AC5

**C58** - `README.md` covers how to run, how to test, the `%` layout and the design decisions (QUAL-05, AC 6)
Proof: run unit | ✓ QUAL-05 AC6

**C59** - A 15-digit number still accepts `.` (Edge case 1)
Proof: run unit | ✓ EDGE-1

**C60** - `-` as the first operator with `0` subtracts `0` (Edge case 2)
Proof: run unit | ✓ EDGE-2

**C61** - `1 ÷ 3 =` shows `0.3333333333` (Edge case 3)
Proof: run unit | ✓ EDGE-3

**C62** - `=` after an error cleared by `C` keeps `0` (Edge case 4)
Proof: run unit | ✓ EDGE-4
**C64** - `±` or `%` right after an operator makes the transformed number the second operand (`5 + ± =` shows `0`, `5 + % =` shows `5.05`) (CTRL-06, AC 13)
Proof: run unit | ✓ CTRL-06 AC13 treats % right after an operator as the typed second operand

**C65** - A result with a large integer part shows no floating point noise (`1000000.1 + 0.2` shows `1000000.3`, not `1.0000003e+6`) (CALC-11, AC 18)
Proof: run unit | ✓ CALC-11 AC18 keeps floating point noise out of results with a large integer part

**C66** - An overflow reached through a chained operator also shows `Resultado fora do limite` (ERR-03, AC 12)
Proof: run unit | ✓ ERR-03 AC12 shows the out of limit message when a chained operator overflows

**C67** - `npm run coverage` passes with at least 90% on `src/core/` (QUAL-03, AC 4)
Proof: `npm run coverage`

**C68** - Clicking `1 2 × 3 4 5` shows `12 ×` above `345`, and `×` stays marked until the first digit of the second number (UI-02, AC 2; UI-04, AC 4)
Proof: walk - Chrome clicks showed `12 ×` over `345` and one `.active` button, `Multiplicar`, until the digit

**C69** - Pressing a key flashes its button, and `Enter` on a focused button clicks only that button (KEY-04, AC 7; KEY-05, AC 8)
Proof: walk - `2 + 3 Enter` flashed `=` and showed `5`; `Enter` on a focused `5` button added one `5` only

---

## Handoff

The feature's live state, written as it happens - a compaction gives no warning.

**Settled mid-build:** Verifier finding F3 settled by the agent as new requirement CTRL-06 (spec AC 13: `±` or `%` right after an operator makes the number the second operand); the user approved that rule on 2026-11-02 - user: "pode aprovar mais não comitta nada". Execution is inline; user: "Inline, eu mesmo, porém não faça nenhum commite nem nada do tipo, depois eu que vou fazer e enviar para o github". No commits from here on: tasks are gated and marked complete in `tasks.md`, and the user commits and pushes. The bootstrap commit `6bd7436` predates this instruction. Baseline was red before T1 (no package.json); user chose "Scaffold mínimo antes (Recomendado)" on 2026-11-02. One bootstrap commit made T1, T2, T3 and T5 (git, `.gitignore`, `package.json` with dev dependencies, `tsconfig.json`, `eslint.config.js`) plus placeholder `index.html` and `src/main.ts`. T4 and T6 remain; T22 and T24 replace the placeholders. `npm audit` reports a moderate `minimatch` issue inside eslint (dev only, no runtime dependencies); not forced.
**Dispatched:** Verifier round 1 at HEAD `dcf30e7` (sent 2026-11-02; no screens sub-agent, no criterion cites a capture) - returned FAIL with findings F1 to F5; fixed in one pass, closing commit pending (user commits). Execution itself was inline, no batch workers.
**Walked:** Chrome headless against `vite preview` of the build, driven by playwright-core from `/tmp/walk` (outside the project), 2026-11-02. UI story: grid has 21 buttons in the UI-01 order; clicking `1 2 × 3 4 5` shows `12 ×` above `345`; `×` is the only `.active` button until a digit is typed; `5 0 %` shows `0.5`; `2 + 3 = = =` shows `11` with `8 + 3 =` above; `5 ÷ 0 =` shows `Não é possível dividir por zero` inside the display; 15 nines get `data-size=tiny` and fit. Keyboard story on a fresh page: `2 + 3 Enter` shows `2 + 3 =` above `5` and the `=` button gets `pressed`, gone after 250 ms; `Backspace`, `Delete`, `%`, `,` and `/` behave as in the PRD; `Enter` on a focused digit button only clicks that button. A11y story: `aria-live=polite` on the display; Tab shows a solid 3px outline; dark scheme gives `rgb(32, 33, 36)` and light `rgb(248, 249, 250)`; no horizontal scroll at 320, 360, 768 and 1280px. The user reaches each state by running `npm run dev` and doing the same clicks and keys. No capture binds this feature, so no `.running.png` files.

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6
Phase 2:  T7 → T8 → T9
Phase 3:  T10 → T11 → T12 → T13 → T14 → T15 → T16
Phase 4:  T17 → T18 → T19 → T20 → T21
Phase 5:  T22 → T23 → T24
Phase 6:  T25 → T26
```

Execution is strictly sequential. 26 tasks pack into batches of whole phases (about 7 tasks each).
