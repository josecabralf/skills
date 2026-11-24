# Model-Based (Graph) Smells

Good graph-based model test: a state machine that matches the spec, generated paths that meet a deliberate coverage target, state assertions that prove the system is in *that* state, thin and stable event executors, and a path count that stays manageable as the model grows.

## Stale Model

- **Symptom.** The machine is maintained separately from the product and lags behind it: states the app no longer has, missing new transitions, tests "fixed" by editing the model to match observed behaviour.
- **Diagnosis.** It tests the model, not the spec. Drift turns every failure into a model edit.
- **Repair.** Derive the model from the production machine where possible (same XState config). Otherwise review model changes against the spec, never against test output.

## Hollow State Assertions

- **Symptom.** The check for a state is generic ("page loaded", URL matches) or missing, so distinct states pass the same check.
- **Diagnosis.** A path can take a wrong transition and still pass. You get coverage without verifying anything.
- **Repair.** Assert what makes each state unique: the visible elements, data, and enabled actions the spec promises.

## Weak Coverage Target

- **Symptom.** Only shortest paths, or state coverage alone, when the risk is in transition sequences (back-navigation, retry after error, re-entering a state).
- **Diagnosis.** Reaches every state once and misses the bugs that depend on history.
- **Repair.** Raise the target to transition coverage or transition pairs, or add targeted paths for history-dependent flows.

## Path Explosion

- **Symptom.** Simple-path or all-paths generation produces hundreds of slow e2e runs, or the suite times out as the machine grows.
- **Diagnosis.** Thoroughness swamped by cost, so the suite gets skipped or trimmed by hand.
- **Repair.** Use shortest or transition-coverage paths, filter with guards, split the machine into sub-machines, or run the executors at integration level instead of through a browser.

## Brittle Event Executors

- **Symptom.** Executors use CSS/XPath selectors, fixed waits, or multi-step UI scripts per event.
- **Diagnosis.** Selector-Coupled / Fixed Waits (see `SYSTEM.md` smells), multiplied by every path that uses the event.
- **Repair.** Use role/test-id locators and explicit waits, one small executor per event.

## Unmodeled Data

- **Symptom.** Events carry no payloads, and every path uses the same data while the bugs depend on input values.
- **Diagnosis.** Control flow is covered but data-dependent behaviour isn't.
- **Repair.** Parameterize events with representative payloads. If values are the main risk, **convert → model-based (stateful PBT)** or add property-based tests below.

## Unreachable or Dead States

- **Symptom.** Path generation never reaches some states, or the coverage report is ignored.
- **Diagnosis.** A model bug (missing transition, impossible guard), or a part of the spec that is never tested.
- **Repair.** Fail the suite when declared states or transitions aren't covered. Fix the model or delete the dead state.
