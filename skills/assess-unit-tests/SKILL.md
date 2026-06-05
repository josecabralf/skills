---
name: assess-unit-tests
description: Audit existing unit tests and emit one verdict per test (keep / refactor / delete / wrong-layer) with the named smell and a one-line next action. Use when reviewing a PR that touches tests, when tests are described as flaky / brittle / fragile, when asked "is this test worth keeping?", or when a test-suite audit is requested. Filters out tests that should never have existed before naming smells in the survivors. Do not use for authoring new tests, integration tests, e2e tests, property-based tests, or contract tests.
---

# Assess Unit Tests

Per-test verdict driven by a named smell. See `TEST-SMELLS.md` for the catalogue.

## Verdicts

- **keep** — no smell; assertions on public contract; setup minimal.
- **refactor** — smell is fixable in place (Mystery Guest, Obscure Test, Snapshot-Only, Sleep-in-Test, Chained Tests, Eager Test).
- **delete** — smell defeats the test's purpose (Mock-the-mock, Tautology, Fragile Test) or fails worth-existing.
- **wrong-layer** — Fourth-mock, duplicates an integration test, or runs containers for pure logic.

## Scope check

Confirm the suite is unit tests. If integration / e2e / property-based / contract: STOP — wrong skill.

## Per-test pass

### 1. Should this test exist?

Both gates:

- **Worth-existing.** Code makes a decision **and** being right matters? Skip-list: getters, setters, DTOs, config, DI wiring, generated code, framework code, pure delegations, type-checker-proven properties, prototypes.
- **Right-instrument.**

| Real question | Right tool |
|---|---|
| Holds for *all* inputs in a class? | Property-based test |
| Matches another team's API? | Contract test |
| Orchestration of collaborators? | Integration test |
| Output stable across versions? | Approval + invariant |

If either gate fails: verdict shortcuts to **delete** with categorical reason (*tests trivial code*, *belongs as property-based test*, etc.). Skip steps 2–3.

### 2. Name the smell

Read the test. Match against the catalogue in `TEST-SMELLS.md`. One named smell — the dominant one. If no smell matches and the assertions reference the public contract: no smell.

### 3. Verdict + next action

Apply the verdict table. Emit:

```
<test name / location>
  Verdict: keep | refactor | delete | wrong-layer
  Smell: <name from catalogue, or — if keep>
  Next action: <one line, or — if keep>
```

## Suite close

After all per-test blocks:

- **Smell distribution.** Count of each smell. Top three are the suite's structural problems.
- **Verdict ratios.** keep / refactor / delete / wrong-layer counts.
- **Naming audit.** Tests named after a method (`testDoFoo`) vs. behaviorally (`should_…`). Method-named tests predict refactor-resistance debt.
