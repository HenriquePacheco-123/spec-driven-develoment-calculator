# Calculadora verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at dcf30e7
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `calculator.test.ts` `CALC-01 AC1 appends each digit to the current number` | yes - all ten digits typed, value asserted |
| C2 | `calculator.test.ts` `CALC-02 AC2 keeps 0 when 0 is typed on 0` | yes |
| C3 | `calculator.test.ts` `CALC-02 AC3 shows 7 when 7 is typed on 0 (007 becomes 7)` | yes |
| C4 | `calculator.test.ts` `CALC-03 AC4 appends the decimal point to the current number` | yes |
| C5 | `calculator.test.ts` `CALC-03 AC5 ignores a second decimal point` | yes |
| C6 | `calculator.test.ts` `CALC-03 AC6 shows 0. when the decimal point comes first` | yes |
| C7 | `calculator.test.ts` `CALC-04 AC7 accepts the 15th digit and ignores the 16th` | yes - both sides of the bound |
| C8 | `calculator.test.ts` `CALC-05 AC8 stores the number and the operator and waits for the next number` | yes |
| C9 | `calculator.test.ts` `CALC-06 AC9 calculates the pending operation when a new operator follows (2 + 3 + shows 5)` | yes |
| C10 | `calculator.test.ts` `CALC-06 AC10 evaluates 2 + 3 × 4 = from left to right as 20` | yes |
| C11 | `calculator.test.ts` `CALC-07 AC11 replaces the pending operator without calculating` | yes |
| C12 | `calculator.test.ts` `CALC-08 AC12 shows the result and stores the last operation` | yes |
| C13 | `calculator.test.ts` `CALC-08 AC13 repeats the last operation on every further = (5, 8, 11)` | yes - asserts the 5, 8, 11 sequence |
| C14 | `calculator.test.ts` `CALC-08 AC14 uses the current value as operand when none was typed (5 + = shows 10)` | yes |
| C15 | `calculator.test.ts` `CALC-09 AC15 starts a new calculation when a digit follows a result` | yes |
| C16 | `calculator.test.ts` `CALC-09 AC16 continues from the result when an operator follows` | yes |
| C17 | `operations.test.ts` `CALC-10 AC17 adds/subtracts/multiplies/divides integers, decimals and negatives` (plus reducer tests in `calculator.test.ts`) | yes - four operations each on the three kinds; negatives not typed through the reducer (`±`), only at function level |
| C18 | `format.test.ts` `CALC-11 AC18 shows 0.1 + 0.2 as 0.3` (first line; also `calculator.test.ts` same name) | no - the rule breaks on a value the test does not use: `1000000.1 + 0.2` shows `1.0000003e+6` (see F1). Tests use only small magnitudes, so float noise in `toFixed(10)` is never exercised |
| C19 | `format.test.ts` `CALC-11 AC19 keeps a 15 digit result in plain notation` and `... above 15 digits in exponential with up to 10 decimals` (also `calculator.test.ts`) | no - the boundary is held for integers (15 plain, 16 exponential), but a 15-digit-or-fewer decimal result with noise becomes exponential: `1234567890 + 0.12345` shows `1.2345678901e+9` (F1) |
| C20 | `no-eval.test.ts` `CALC-12 AC20 contains no eval, new Function or Function call under src/` | yes - narrow: regex misses `globalThis['Function']` and string `setTimeout`, but none exist |
| C21 | `calculator.test.ts` `CTRL-01 AC1 resets every field with C` | yes - `toEqual(initialState)` after a pending op and after a result; the error case is held by ERR-02 AC11 |
| C22 | `calculator.test.ts` `CTRL-02 AC2 clears only the current number with CE` | yes |
| C23 | `calculator.test.ts` `CTRL-02 AC3 acts as C when CE follows a result` | yes |
| C24 | `calculator.test.ts` `CTRL-03 AC4 removes the last character` / `... gives 0 when nothing is left, including -5` | yes |
| C25 | `calculator.test.ts` `CTRL-03 AC5 keeps the result when ⌫ follows a result` | yes |
| C26 | `calculator.test.ts` `CTRL-04 AC6 flips the sign of the current number` | yes |
| C27 | `calculator.test.ts` `CTRL-04 AC7 keeps 0 when ± is pressed on 0` | no - only `0`; the zero spelled `0.` / `0.0` becomes `-0.` / `-0.0` (F2) |
| C28 | `calculator.test.ts` `CTRL-05 AC8 divides the current number by 100` (and `turns 50 + 10 % into 50 + 0.1`) | yes |
| C29 | `calculator.test.ts` `ERR-01 AC9 shows the division by zero message on 5 ÷ 0 =` | yes |
| C30 | `calculator.test.ts` `ERR-02 AC10 ignores operators, =, ±, %, ⌫, CE and the decimal point during the error` | yes - identity (`toBe`) on every listed key |
| C31 | `calculator.test.ts` `ERR-02 AC11 clears the error with C` / `... with a digit that starts a new calculation` | yes |
| C63 | `calculator.test.ts` `ERR-03 AC12 shows the out of limit message when repeated multiplication overflows` | yes - message, operator blocked, digit restarts; only `+` and digit are probed, not the full AC10 list, and the chained-operator path (`inputOperator`) is not exercised with Infinity |
| C32 | `buttons.test.ts` `UI-01 AC1 lists the 21 buttons in the grid order...` / `... makes = span the four columns` | yes - at the data level the Matrix names; the rendered DOM is not tested |
| C33 | `buttons.test.ts` `UI-02 AC2 gives each button the action of its label` | yes for the data; the click-to-dispatch-to-render wiring (`createButtons`, `main.ts`) has no test, only the build and the Handoff walk |
| C34 | `calculator.test.ts` `UI-03 AC3 shows the pending operation on the secondary line (1 2 × gives 12 ×)` | yes |
| C35 | `calculator.test.ts` `UI-04 AC4 marks the operator only until the next number is typed` | yes - `markActive` (the visual part) is untested |
| C36 | `buttons.test.ts` `UI-05 AC5 marks operators and = with kinds...` and `styles.test.ts` `UI-05 AC5 gives operators and = backgrounds different...` (both share the name) | yes - styles test asserts distinct backgrounds in both themes and that the rules use the vars |
| C37 | `format.test.ts` `UI-06 AC6 shrinks the font as the text grows` and `styles.test.ts` `UI-06 AC6 shrinks the display font as the text grows` | no - loose at the 13/14 boundary: no 13-character case, so `<= 12` would pass; the CSS sizes only checked as ordered |
| C38 | `format.test.ts` `UI-06 AC7 gives the error message the smallest size` and `styles.test.ts` `UI-06 AC7 clips overflow and wraps long text inside the display` | yes - `render` choosing `displaySize(error)` is glue, untested |
| C39 | `keyboard.test.ts` `KEY-01 AC1 maps the keys 0 to 9 to digit actions` | yes |
| C40 | `keyboard.test.ts` `KEY-01 AC2 maps . and , to the decimal point` | yes |
| C41 | `keyboard.test.ts` `KEY-02 AC3 maps + - * / to the four operators` | yes |
| C42 | `keyboard.test.ts` `KEY-02 AC4 maps Enter and = to equals` | yes |
| C43 | `keyboard.test.ts` `KEY-03 AC5 maps Backspace, Escape and Delete to ⌫, C and CE` | yes |
| C44 | `keyboard.test.ts` `KEY-03 AC6 maps % to percent` | yes |
| C45 | `buttons.test.ts` `KEY-04 AC7 adds pressed and removes it after 120 ms` | yes for `flashButton` (119/120 ms); that `bindKeyboard` calls it and `.pressed` has a visible style is untested |
| C46 | `keyboard.test.ts` `KEY-05 AC8 maps Enter and Space on a focused button to no action` | yes for `resolveKey`; the `event.target instanceof HTMLButtonElement` wiring in `bindKeyboard` is untested |
| C47 | `buttons.test.ts` `A11Y-01 AC1 gives every button a descriptive aria-label` | yes - data level; `setAttribute` in `createButtons` untested |
| C48 | `page.test.ts` `A11Y-02 AC2 marks the display with aria-live="polite"` | yes |
| C49 | `styles.test.ts` `A11Y-03 AC3 draws an outline on keyboard focus` | yes - loose: regex `outline:\s*[^;]*\d+px` also accepts `outline: none 1px` |
| C50 | `styles.test.ts` `A11Y-04 AC4 keeps text contrast of at least 4.5 in the light theme` / `... dark theme` | yes for the seven declared pairs, both themes, real luminance math; it does not check that the rules bind each pair (only operator/equals bg are checked elsewhere) |
| C51 | `styles.test.ts` `RESP-01 AC5 lays the keys out in four fractional columns` / `... sets no fixed width wider than 320px` | yes - weak: the width regex matches no declaration in the file (loop is vacuous); the claim rests on `toContain('width: min(100%')`; no-horizontal-scroll is not tested |
| C52 | `styles.test.ts` `THEME-01 AC6 defines the light theme by default and the dark one under prefers-color-scheme` | yes - only `screen-bg` is compared |
| C53 | `project.test.ts` `QUAL-01 AC1 exposes dev, build, preview, test, coverage, lint and format scripts` | yes |
| C54 | `npm run build` (lone proof, exit 0, `tsc` strict confirmed in `tsconfig.json:8`) | yes |
| C55 | `npm run lint` (lone proof, `--max-warnings 0`, exit 0) | yes |
| C56 | `project.test.ts` `QUAL-03 AC4 sets coverage thresholds of 90 on src/core` | yes - config only; `npm run coverage` is not in `proofs.md` (F5) |
| C57 | `project.test.ts` `QUAL-04 AC5 declares no runtime dependencies` | yes |
| C58 | `project.test.ts` `QUAL-05 AC6 explains in the README how to run and how to test` / `... documents the layout decision...` | yes - loose: asserts heading and phrase presence, not content |
| C59 | `calculator.test.ts` `EDGE-1 accepts the decimal point at 15 digits without a new digit` | yes |
| C60 | `calculator.test.ts` `EDGE-2 treats - as the first operator with 0 as a subtraction of 0` | yes |
| C61 | `calculator.test.ts` `EDGE-3 shows 1 ÷ 3 as 0.3333333333` (also `format.test.ts`) | yes - both tests assert the value |
| C62 | `calculator.test.ts` `EDGE-4 keeps 0 on = after an error cleared by C` | yes |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| F1 (major) A result well under 15 digits is shown in exponential because `toFixed(10)` exposes binary noise on numbers with a large integer part. Breaks CALC-11 AC18 and AC19 | `src/core/format.ts:23-24`. Throwaway test at HEAD: `1000000.1 + 0.2 =` shows `1.0000003e+6` (expected `1000000.3`); `1234567890 + 0.12345 =` shows `1.2345678901e+9` (expected `1234567890.12345`, 15 digits). `123456.789 × 1` and `99999.99 + 0.01` are fine, so it appears from about 1e6 up. C18/C19 tests only use magnitudes below that | round first (e.g. `Number(value.toPrecision(15))` or round to 10 decimals with an exact method) before `toFixed` and the digit count; add tests for these inputs at `formatResult` and through the reducer | |
| F2 (minor) `±` on a zero typed as `0.` or `0.0` produces negative zero. Breaks CTRL-04 AC7 and the assumption "evita `-0`" | `src/core/calculator.ts:96` compares only to `'0'`. Throwaway: `.` `±` gives `-0.`; `0 . 0 ±` gives `-0.0`. C27 tests only `0` | treat any value with `Number(x) === 0` as zero in `negate`; test `0.` and `0.0` | |
| F3 (minor, spec silent) `±` and `%` while waiting for the operand change the display but keep `waitingForOperand`, so the operator stays highlighted and `⌫` does nothing on the shown value | `src/core/calculator.ts:95-105`. Throwaway: `5 + ± =` shows `0` (5 + -5) while the display read `-5` after `±`; `5 + %` shows `0.05` with `+` still marked active (by reading) | decide the rule in the spec (operate on the shown value and clear `waitingForOperand`, or ignore) and add a criterion and check | |
| F4 (test strength) Boundary and binding gaps: C37 has no 13-character case for `displaySize` (`<= 12` passes); C51's width loop matches no declaration; C50 does not prove each rule uses its contrast pair; C49 accepts `outline: none 1px`; C63 probes only `+` and a digit | `tests/format.test.ts:53-62`; `tests/styles.test.ts:93-100`, `:46-64`, `:84-86`; `tests/calculator.test.ts:243-251` | add a 13-char case; assert real widths or no-overflow rules; assert `.key`, `.key--control`, `.screen` and `.expression` use their pairs; require a non-`none` outline style and color; probe the full AC10 key list on the ERR-03 state | |
| F5 (coverage gap) DOM glue has no automated test and no walk check: `createButtons` click wiring, `render`, `markActive`, `bindKeyboard` (`preventDefault`, flash call, `instanceof HTMLButtonElement`). UI-02, UI-04 (visual), KEY-04 and KEY-05 are held only by pure helpers. The Matrix names "build gate and walk", but no check is a walk. Also, `npm run coverage` (Gate Check Commands) is not in `proofs.md`, so the Goal "coverage >= 90% on `src/core/`" has no proof | `src/ui/buttons.ts:82-101,111-122`, `src/ui/keyboard.ts:33-45`, `src/ui/render.ts:13-18`; `proofs.md` lists only build and lint | add a walk check with a `**Walked:**` line, or jsdom tests for the glue; add a `npm run coverage` proof | |
