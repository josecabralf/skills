# Test Smells

Symptom → diagnosis → repair. Used by `write-tests` (to prevent) and `assess-tests` (to detect).

## Mock-the-mock

- **Symptom.** Test mocks an internal collaborator and asserts only that specific methods were called.
- **Diagnosis.** Asserts wiring, not behavior. Catches almost no bugs; breaks on harmless refactors.
- **Repair.** Extract a pure function for the interesting logic; assert its return value.

## Fourth-mock

- **Symptom.** A single unit test instantiates four or more test doubles.
- **Diagnosis.** The unit is the wrong scope, or production code is missing a seam.
- **Repair.** Rescope to integration (orchestration *is* the contract there), or refactor production code to expose a pure core.

## Tautology

- **Symptom.** The expected value is computed inside the test by re-running the implementation's formula.
- **Diagnosis.** The test passes whatever the implementation does.
- **Repair.** Hard-code the expected value from the spec.

## Mystery Guest

- **Symptom.** Test reads from a fixture file, DB row, or shared resource not visible in the test body.
- **Diagnosis.** Scenario cannot be reproduced from the test alone.
- **Repair.** Inline the scenario data. If large, extract a named builder visible from the test file.

## Fragile Test

- **Symptom.** Renaming a private method or reordering internal calls breaks the test even when observable behavior is unchanged.
- **Diagnosis.** Coupled to implementation shape.
- **Repair.** Replace call-verification with output / state assertions, or move the test up a layer.

## Eager Test

- **Symptom.** One test method asserts on many unrelated behaviors.
- **Diagnosis.** Failures localise to "something broke in this region", not a specific bug.
- **Repair.** Split into one-behavior-per-test. Each name is a sentence describing the behavior.

## Obscure Test

- **Symptom.** Arrange section spans 30+ lines; assertion is one line.
- **Diagnosis.** Scenario is wider than a single unit.
- **Repair.** Extract a builder, or rescope to a higher layer.

## Erratic Test

- **Symptom.** Passes locally, fails intermittently in CI (or vice versa).
- **Diagnosis.** Hidden dependency on time, ordering, environment, or concurrency.
- **Repair.** Inject clock / scheduler / executor. If non-deterministic and unfixable, delete.

## Sleep-in-Test

- **Symptom.** Test calls `sleep()` or polls with backoff.
- **Diagnosis.** Flaky-by-design and slow.
- **Repair.** Inject clock / scheduler. Drive time from the test.

## Chained Tests

- **Symptom.** Tests share a module-level fixture; reordering changes the outcome.
- **Diagnosis.** Failures are non-local.
- **Repair.** Build state per test. Use builders if construction is expensive.

## Snapshot-Only

- **Symptom.** The only assertion is `toMatchSnapshot()` with no invariant.
- **Diagnosis.** Reviewer becomes the assertion; opaque protection.
- **Repair.** Pair with a hard-coded invariant, or replace with explicit asserts and delete the snapshot.
