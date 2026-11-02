# calculadora proofs

**HEAD**: b009800
**Tree**: clean
**Shell**: /bin/sh
**Result**: 71 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run unit / ✓ CALC-01 AC1` | pass |
| C2 | `run unit / ✓ CALC-02 AC2` | pass |
| C3 | `run unit / ✓ CALC-02 AC3` | pass |
| C4 | `run unit / ✓ CALC-03 AC4` | pass |
| C5 | `run unit / ✓ CALC-03 AC5` | pass |
| C6 | `run unit / ✓ CALC-03 AC6` | pass |
| C7 | `run unit / ✓ CALC-04 AC7` | pass |
| C8 | `run unit / ✓ CALC-05 AC8` | pass |
| C9 | `run unit / ✓ CALC-06 AC9` | pass |
| C10 | `run unit / ✓ CALC-06 AC10` | pass |
| C11 | `run unit / ✓ CALC-07 AC11` | pass |
| C12 | `run unit / ✓ CALC-08 AC12` | pass |
| C13 | `run unit / ✓ CALC-08 AC13` | pass |
| C14 | `run unit / ✓ CALC-08 AC14` | pass |
| C15 | `run unit / ✓ CALC-09 AC15` | pass |
| C16 | `run unit / ✓ CALC-09 AC16` | pass |
| C17 | `run unit / ✓ CALC-10 AC17` | pass |
| C18 | `run unit / ✓ CALC-11 AC18` | pass |
| C19 | `run unit / ✓ CALC-11 AC19` | pass |
| C20 | `run unit / ✓ CALC-12 AC20` | pass |
| C21 | `run unit / ✓ CTRL-01 AC1` | pass |
| C22 | `run unit / ✓ CTRL-02 AC2` | pass |
| C23 | `run unit / ✓ CTRL-02 AC3` | pass |
| C24 | `run unit / ✓ CTRL-03 AC4` | pass |
| C25 | `run unit / ✓ CTRL-03 AC5` | pass |
| C26 | `run unit / ✓ CTRL-04 AC6` | pass |
| C27 | `run unit / ✓ CTRL-04 AC7` | pass |
| C28 | `run unit / ✓ CTRL-05 AC8` | pass |
| C29 | `run unit / ✓ ERR-01 AC9` | pass |
| C30 | `run unit / ✓ ERR-02 AC10` | pass |
| C31 | `run unit / ✓ ERR-02 AC11` | pass |
| C63 | `run unit / ✓ ERR-03 AC12` | pass |
| C32 | `run unit / ✓ UI-01 AC1` | pass |
| C33 | `run unit / ✓ UI-02 AC2` | pass |
| C34 | `run unit / ✓ UI-03 AC3` | pass |
| C35 | `run unit / ✓ UI-04 AC4` | pass |
| C36 | `run unit / ✓ UI-05 AC5` | pass |
| C37 | `run unit / ✓ UI-06 AC6` | pass |
| C38 | `run unit / ✓ UI-06 AC7` | pass |
| C39 | `run unit / ✓ KEY-01 AC1` | pass |
| C40 | `run unit / ✓ KEY-01 AC2` | pass |
| C41 | `run unit / ✓ KEY-02 AC3` | pass |
| C42 | `run unit / ✓ KEY-02 AC4` | pass |
| C43 | `run unit / ✓ KEY-03 AC5` | pass |
| C44 | `run unit / ✓ KEY-03 AC6` | pass |
| C45 | `run unit / ✓ KEY-04 AC7` | pass |
| C46 | `run unit / ✓ KEY-05 AC8` | pass |
| C47 | `run unit / ✓ A11Y-01 AC1` | pass |
| C48 | `run unit / ✓ A11Y-02 AC2` | pass |
| C49 | `run unit / ✓ A11Y-03 AC3` | pass |
| C50 | `run unit / ✓ A11Y-04 AC4` | pass |
| C51 | `run unit / ✓ RESP-01 AC5` | pass |
| C52 | `run unit / ✓ THEME-01 AC6` | pass |
| C53 | `run unit / ✓ QUAL-01 AC1` | pass |
| C54 | `npm run build` | pass |
| C55 | `npm run lint` | pass |
| C56 | `run unit / ✓ QUAL-03 AC4` | pass |
| C57 | `run unit / ✓ QUAL-04 AC5` | pass |
| C58 | `run unit / ✓ QUAL-05 AC6` | pass |
| C59 | `run unit / ✓ EDGE-1` | pass |
| C60 | `run unit / ✓ EDGE-2` | pass |
| C61 | `run unit / ✓ EDGE-3` | pass |
| C62 | `run unit / ✓ EDGE-4` | pass |
| C64 | `run unit / ✓ CTRL-06 AC13 treats % right after an operator as the typed second operand` | pass |
| C65 | `run unit / ✓ CALC-11 AC18 keeps floating point noise out of results with a large integer part` | pass |
| C66 | `run unit / ✓ ERR-03 AC12 shows the out of limit message when a chained operator overflows` | pass |
| C67 | `npm run coverage` | pass |
| C68 | `walk - Chrome clicks showed 12 × over 345 and one .active button, Multiplicar, until the digit` | pass (Walked) |
| C69 | `walk - 2 + 3 Enter flashed = and showed 5; Enter on a focused 5 button added one 5 only` | pass (Walked) |
| Build | `npm run build` | pass |
| Build | `npm run lint` | pass |

## Output

`Run unit` - exit 0

```
 ✓ tests/calculator.test.ts > controls > CTRL-05 AC8 keeps negatives and decimals exact 0ms
 ✓ tests/calculator.test.ts > selectors > UI-03 AC3 shows the pending operation on the secondary line (1 2 × gives 12 ×) 0ms
 ✓ tests/calculator.test.ts > selectors > UI-03 AC3 uses the symbols of the buttons 0ms
 ✓ tests/calculator.test.ts > selectors > UI-03 AC3 shows the executed operation after = (2 + 3 =) 0ms
 ✓ tests/calculator.test.ts > selectors > UI-03 AC3 leaves the secondary line empty when idle or in error 0ms
 ✓ tests/calculator.test.ts > selectors > UI-04 AC4 marks the operator only until the next number is typed 0ms
 ✓ tests/calculator.test.ts > selectors > UI-04 AC4 marks no operator when idle or after a result 0ms
 ✓ tests/calculator.test.ts > modifiers right after an operator > CTRL-06 AC13 treats ± right after an operator as the typed second operand 0ms
 ✓ tests/calculator.test.ts > modifiers right after an operator > CTRL-06 AC13 treats % right after an operator as the typed second operand 0ms
 ✓ tests/calculator.test.ts > overflow through a chained operator > ERR-03 AC12 shows the out of limit message when a chained operator overflows 0ms

 Test Files  9 passed (9)
      Tests  114 passed (114)
   Start at  18:02:49
   Duration  135ms (transform 261ms, setup 0ms, import 334ms, tests 31ms, environment 1ms)
```

`npm run build` - exit 0

```
> calculadora@0.0.0 build
> tsc && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 11 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.73 kB │ gzip: 0.38 kB
dist/assets/index-CWWmfhml.css  2.32 kB │ gzip: 0.95 kB
dist/assets/index-DL7eWzrh.js   6.89 kB │ gzip: 2.75 kB

✓ built in 34ms
```

`npm run lint` - exit 0

```
> calculadora@0.0.0 lint
> eslint . --max-warnings 0
```

`npm run coverage` - exit 0

```
 % Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |   98.29 |    96.93 |     100 |   97.93 |                   
 calculator.ts |   97.36 |    97.29 |     100 |   96.92 | 30,171            
 format.ts     |     100 |       95 |     100 |     100 | 42                
---------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 98.29% ( 115/117 )
Branches     : 96.93% ( 95/98 )
Functions    : 100% ( 27/27 )
Lines        : 97.93% ( 95/97 )
================================================================================
```
