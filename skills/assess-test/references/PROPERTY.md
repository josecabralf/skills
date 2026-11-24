# Property-Based Smells

Good property test: a generator that covers the real input domain, a property that a wrong implementation would violate, failures that shrink to a minimal case, and a reproducible seed.

Strong property shapes: round-trip (`decode(encode(x)) == x`), invariant (sorted output is a permutation and ordered), oracle (matches a simpler reference implementation), metamorphic (`f(scale(x)) == scale(f(x))`), idempotence.

## Weak Property

- **Symptom.** The property holds for many wrong implementations (`len(result) >= 0`, "doesn't throw", type checks).
- **Diagnosis.** Runs a lot of inputs but checks almost nothing.
- **Repair.** Strengthen it with one of the shapes above. Sanity check: would an implementation that returns a constant or the input unchanged pass?

## Re-implemented Oracle

- **Symptom.** The oracle uses the same algorithm as the implementation.
- **Diagnosis.** A Tautology. Shared bugs pass.
- **Repair.** Use a dumber, obviously correct oracle (brute force, naive loop), or switch to a metamorphic or round-trip property.

## Filtered-to-Death Generator

- **Symptom.** Heavy `assume()` / `.filter()`, health-check warnings, or most generated cases discarded.
- **Diagnosis.** Slow, and quietly tests a narrow slice of the domain.
- **Repair.** Build valid inputs constructively (`map` / `flatMap` / composite strategies).

## Narrow Generator

- **Symptom.** The generator excludes the hard cases: empty, unicode, negatives, huge sizes, duplicates, NaN.
- **Diagnosis.** False confidence. Edge-case bugs are why you write property tests in the first place.
- **Repair.** Widen it to the real input contract. Exclude cases only when the spec does.

## Lost Counterexample

- **Symptom.** A bug found by the property is fixed, but no pinned example or stored seed (`@example`, regression file) stays behind.
- **Diagnosis.** The regression can come back without being caught, because generation is random.
- **Repair.** Add the shrunk counterexample as an explicit example or a unit test.

## Single-Example Property

- **Symptom.** The generator yields constants, or the test uses PBT machinery around one fixed input.
- **Diagnosis.** A unit test in disguise, with extra noise.
- **Repair.** **Convert → unit**.

## Sequence-in-a-Property

- **Symptom.** Generates lists of operations and replays them against a stateful object with hand-rolled checks.
- **Diagnosis.** Model-based testing reinvented, usually without preconditions or shrinking.
- **Repair.** **Convert → model-based (stateful PBT)** using the framework's stateful API.
