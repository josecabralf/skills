# System (E2E) Smells

Good system test: a critical user journey driven from outside, through the real deployed stack, with stable locators, explicit waits, its own isolated data, and few in number.

## Edge Case at the Top

- **Symptom.** E2E test for a validation message, branch, or error permutation.
- **Diagnosis.** The slowest and flakiest way to check logic that a lower layer can reach.
- **Repair.** **Convert → unit / integration**. Keep e2e for the happy path of the journey.

## Selector-Coupled

- **Symptom.** CSS / XPath / nth-child locators, or text that changes with copy edits.
- **Diagnosis.** Fragile. Breaks on markup refactors.
- **Repair.** Use role / label / test-id locators.

## Fixed Waits

- **Symptom.** `waitForTimeout`, `sleep`, or retry-until-green wrappers.
- **Diagnosis.** Sleep-in-Test. Masks race conditions instead of exposing them.
- **Repair.** Wait on explicit conditions (element state, network idle on a specific request, an event).

## Retry-Masked

- **Symptom.** Test-level retries in CI hide a known flaky test.
- **Diagnosis.** An Erratic test treated as passing. Real regressions can look like flakes.
- **Repair.** Find the nondeterminism and fix it. Quarantine the test with an owner and deadline, or delete it.

## Shared Environment Data

- **Symptom.** Relies on pre-existing accounts or records in a shared environment, or leaves data behind.
- **Diagnosis.** A Mystery Guest plus Chained Tests across runs and teams.
- **Repair.** Create data per test through APIs or seeds and clean it up afterwards, or use unique tenants.

## Marathon Journey

- **Symptom.** One test walks an entire product (sign-up → configure → purchase → refund) asserting all along.
- **Diagnosis.** Eager. A failure early on hides everything after it, and the run is very slow.
- **Repair.** Split it into journeys that each start from seeded state through an API shortcut.

## UI Used as Setup

- **Symptom.** Logs in and fills forms through the UI just to reach the step under test.
- **Diagnosis.** Slow, and every test depends on unrelated screens.
- **Repair.** Do setup through APIs or stored auth state. Drive the UI only for the behaviour being tested.
