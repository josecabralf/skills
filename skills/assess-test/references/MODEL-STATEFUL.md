# Model-Based (Stateful PBT) Smells

Good model-based test: a simple model (e.g. a dict for a cache, a list for a queue) independent of the system under test, commands with preconditions, postconditions comparing the system under test (SUT) against the model after every step, invariants, and shrinkable, reproducible sequences.

## Mirror Model

- **Symptom.** The model reuses or copies the SUT's implementation.
- **Diagnosis.** A Tautology. Shared bugs never diverge.
- **Repair.** Rewrite the model as the simplest data structure that captures the spec.

## Blind Steps

- **Symptom.** Commands mutate both model and SUT but only compare them at the end, or never.
- **Diagnosis.** Divergences are found late and shrink badly. Some never surface.
- **Repair.** Check postconditions after every command, and check invariants after every step.

## Missing Preconditions

- **Symptom.** Commands are generated regardless of state, then filtered or caught in the body (e.g. `pop` on an empty queue wrapped in `try`).
- **Diagnosis.** Wastes runs and hides real invalid-transition bugs.
- **Repair.** Add preconditions. Model invalid transitions explicitly when rejecting them is part of the spec.

## Coarse Model

- **Symptom.** The model tracks too little (a count instead of contents, a status instead of data).
- **Diagnosis.** A Weak Property at the state level. Wrong content passes.
- **Repair.** Track the observable state the spec promises.

## Narrow Command Set

- **Symptom.** Only the commands that are easy to write. Delete, concurrent access, failure, restart, and time passing are missing.
- **Diagnosis.** The risky interleavings are never explored.
- **Repair.** Add the commands where bugs live, with fault and time commands where the framework allows.

## Stateless Target

- **Symptom.** Model-based machinery around code whose output depends only on its input.
- **Diagnosis.** Costly and indirect.
- **Repair.** **Convert → property-based**.

## Unreproducible Run

- **Symptom.** No seed is logged, shrinking is disabled, or failing sequences aren't persisted.
- **Diagnosis.** Failures can't be acted on. The test ends up Erratic in practice.
- **Repair.** Enable shrinking and seed or database persistence. Pin found sequences as regression tests.
