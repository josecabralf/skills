# Shared Test Smells

Apply to every test type. Symptom → diagnosis → repair.

## Tautology

- **Symptom.** The test computes its expected value by re-running the implementation's logic (or the model / oracle copies the implementation).
- **Diagnosis.** Passes whatever the implementation does.
- **Repair.** Hard-code the expected value from the spec, or use an independent oracle.

## Fragile Test

- **Symptom.** Breaks on renames, reordered internal calls, markup / schema tweaks, or log text changes when observable behaviour is unchanged.
- **Diagnosis.** Coupled to implementation shape.
- **Repair.** Assert on outputs / observable state, or move the test to where that state is public.

## Mystery Guest

- **Symptom.** Relies on a fixture file, seeded row, env var, or shared resource you can't see in the test body.
- **Diagnosis.** You can't reproduce the scenario from the test alone.
- **Repair.** Inline the scenario data, or use a named builder that is visible from the test file.

## Eager Test

- **Symptom.** One test asserts many unrelated behaviours.
- **Diagnosis.** A failure only tells you "something in this area broke".
- **Repair.** Split it so each test covers one behaviour, named as a sentence.

## Obscure Test

- **Symptom.** The setup is 30+ lines and the assertion is one line.
- **Diagnosis.** The scenario is wider than the type allows, or setup is hiding intent.
- **Repair.** Extract builders, or move the test up a layer.

## Erratic Test

- **Symptom.** Passes and fails intermittently, or differently locally vs. in CI.
- **Diagnosis.** Hidden dependency on time, ordering, randomness without a seed, environment, or concurrency.
- **Repair.** Inject the clock / scheduler / seed, and isolate state. If it can't be fixed, delete it. A flaky test does more harm than having no test.

## Sleep-in-Test

- **Symptom.** `sleep()`, fixed waits, or ad-hoc polling.
- **Diagnosis.** Slow and flaky by design.
- **Repair.** Drive time from the test, or wait on an explicit condition.

## Chained Tests

- **Symptom.** Tests share mutable state, so running them in a different order changes the result.
- **Diagnosis.** Failures show up far from their cause.
- **Repair.** Build state per test. Use builders or transactions if construction is expensive.

## Snapshot-Only

- **Symptom.** The only assertion is a snapshot / golden file, with no invariant.
- **Diagnosis.** The reviewer becomes the assertion, so it protects nothing you can see.
- **Repair.** Pair it with a hard-coded invariant, or replace it with explicit assertions.

## No-Fail

- **Symptom.** No assertion, assertions inside swallowed `try`, or assertions that hold for any implementation (`is not None`, `len >= 0`).
- **Diagnosis.** Can't catch a regression.
- **Repair.** Assert on the specific expected outcome. If there's nothing worth asserting, delete it.
