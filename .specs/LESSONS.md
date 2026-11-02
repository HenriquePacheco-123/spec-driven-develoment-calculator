# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Test number formatting at several magnitudes, not only small values, because floating point noise grows with the integer part
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `core` · harmful: 0
- features: calculadora
- evidence: verification.md F1, src/core/format.ts:23 (core)
- last seen: 2026-11-02T21:06:13Z

### L-002 - Treat every spelling of zero as zero when a rule says zero is special
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `core` · harmful: 0
- features: calculadora
- evidence: verification.md F2, src/core/calculator.ts:96 (core)
- last seen: 2026-11-02T21:06:13Z

### L-003 - Specify what each modifier does in every state of the input machine, including right after an operator
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `core` · harmful: 0
- features: calculadora
- evidence: verification.md F3, CTRL-06 (core)
- last seen: 2026-11-02T21:06:13Z

### L-004 - Test both sides of every threshold and make static-file tests assert that their regex matched something
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: calculadora
- evidence: verification.md F4, C37 C49 C50 C51 C63 (tests)
- last seen: 2026-11-02T21:06:13Z

### L-005 - Give every user-visible control a proof, a test or a walk check, even when its logic lives in pure helpers
- signal: `weak_test` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: calculadora
- evidence: verification.md F5, src/ui (ui)
- last seen: 2026-11-02T21:06:13Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
