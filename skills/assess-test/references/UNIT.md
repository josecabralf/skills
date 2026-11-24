# Unit (Example-Based) Smells

Good unit test: fixed input → expected output from the spec, in-process, milliseconds, isolated from I/O only at real boundaries.

## Mock-the-mock

- **Symptom.** Mocks an internal collaborator and only asserts that certain methods were called.
- **Diagnosis.** Asserts wiring, not behaviour. Catches almost no bugs and breaks on harmless refactors.
- **Repair.** Extract the interesting logic into a pure function and assert its return value, or **convert → integration**.

## Fourth-mock

- **Symptom.** Four or more test doubles in one test.
- **Diagnosis.** Wrong scope, or the production code is missing a seam.
- **Repair.** **Convert → integration** (there, the orchestration *is* the contract), or refactor the production code to expose a pure core.

## Mocking What You Don't Own

- **Symptom.** A third-party client (SDK, ORM, HTTP lib) is mocked directly, call by call.
- **Diagnosis.** The mock encodes a guess about the library's behaviour. It stays green when the real library disagrees.
- **Repair.** Wrap the library in a thin adapter you own and mock that. Cover the adapter with an integration test.

## Example Farm

- **Symptom.** Many near-identical examples (a parametrize table, copy-pasted cases) exercising one rule at hand-picked boundaries.
- **Diagnosis.** It only covers the cases someone thought of. Adding examples makes the suite longer, not more thorough.
- **Repair.** **Convert → property-based**. Keep the examples that pinned real bugs as named regression cases.

## Hidden Stateful Sequence

- **Symptom.** A test calls a stateful object several times in a row and asserts along the way (cart add/remove/checkout, cache put/evict/get).
- **Diagnosis.** It covers one path through a state space that has many.
- **Repair.** If the state space is the risk, **convert → model-based (stateful PBT)**. Otherwise split it into one transition per test.
