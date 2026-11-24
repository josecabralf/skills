---
name: assess-test
description: Audit existing tests for quality and for whether each should be a different type of test. Use when reviewing a PR that touches tests, when tests are flaky, brittle or slow, or when asked if a test is worth keeping or should be another type. Not for writing new tests.
---

# Assess Test

Two questions per test: **is it good as what it is?** and **should it be a different kind of test?**

Read test bodies first, and open production code only when a gate can't be judged without it. For suites over ~30 tests, assess one representative per repeated pattern and list which tests share its verdict.

## 1. Classify

Tag each test with one type. Use cheap signals (imports, fixtures, path) before reading bodies:

| Type | Signals | Reference |
|---|---|---|
| Unit (example-based) | Hard-coded inputs → expected output; in-process; doubles for I/O | `references/UNIT.md` |
| Property-based | `hypothesis`, `fast-check`, `proptest`, `quickcheck`, `jqwik`, `@given`, `fc.assert`, generators | `references/PROPERTY.md` |
| Integration | Real DB / queue / filesystem / HTTP server, testcontainers, app factory + test client, several real modules wired | `references/INTEGRATION.md` |
| System (e2e) | Playwright, Cypress, Selenium, deployed env URL, full stack driven from outside | `references/SYSTEM.md` |
| Model-based (stateful PBT) | Random command sequences run against the SUT and a simple data model in lockstep, with shrinking: `RuleBasedStateMachine`, `fc.commands`, `proptest-state-machine`, jqwik actions, QuickCheck state machines | `references/MODEL-STATEFUL.md` |
| Model-based (graph) | A state machine / statechart walked to generate test paths for coverage, with event executors and per-state assertions: `@xstate/graph` / `@xstate/test` (`createTestModel`, `getShortestPaths`), GraphWalker, ModelJUnit | `references/MODEL-GRAPH.md` |

Load only the references for types actually present. Contract and approval tests: treat as integration and unit respectively, and say so in the output.

## 2. Run (status)

Never judge what a run can decide. Run the tests under review once with quiet output, skip reasons and durations (e.g. `pytest -q -rs --durations=20`). Ask before running anything that touches shared resources, and before any system test. If you don't run them, write `Status: not run`.

| Status | Meaning |
|---|---|
| pass | Green. |
| broken | Collection or import error. Never executed. |
| failing | Runs, red. It may be catching a real regression, so being red is never a reason to delete. |
| env | Red only because a DB / service / credential is missing. Never merge into broken. |
| skipped-dead | The skip/xfail condition can never be true again. Zero coverage that looks green. Delete or unskip. |
| skipped-live | The skip condition is still real. Note what would re-enable it. |
| slow | Over 1s for a unit/property test, over 5s for an integration test. On a shared host, rank relatively. |

`slow` is added on top of pass/failing. The status is reported next to the verdict and doesn't replace it.

## 3. Gates (all types)

**Worth-existing.** Does the code under test make a decision, and does being right about it matter? Skip-list: getters, setters, DTOs, config, DI wiring, generated code, framework behaviour, pure delegation, properties the type checker already proves, prototypes. Fail → **delete**, reason *tests trivial code*. Stop here. A test that targets a symbol / route / schema that no longer exists also fails this gate, reason *targets removed code*.

**Right-type.** Is the question the test asks answered best by its current type? Fail → **convert**.

| Signal in the test | Better type |
|---|---|
| Many examples (≥5) of one rule, table-driven edge cases, hand-picked boundaries | Property-based (keep found bugs as pinned unit examples) |
| Unit test with ≥4 doubles, or assertions only on calls to collaborators | Integration |
| Integration test exercising pure logic (containers spun up, logic never touches I/O) | Unit or property-based |
| Integration test whose value is a cross-service user journey | System |
| E2E test covering a branch / validation edge case / error message | Unit or integration (keep 1 happy path e2e) |
| Unit or property test replaying a sequence of calls against a stateful object | Model-based (stateful PBT) |
| Many hand-written e2e tests walking variations of one UI or workflow state machine | Model-based (graph) |
| Model-based test on stateless code, or sequences that never matter | Property-based |
| Graph model whose bugs hide in data values, not in which transitions are taken | Model-based (stateful PBT) |
| Stateful PBT whose real risk is UI/workflow transition coverage | Model-based (graph) |
| Property test whose "property" is one fixed example | Unit |
| Test checks another team's API shape | Contract |

Name the target type, not a vague "wrong layer".

## 4. Name the smell

Match against `references/SMELLS.md`, then the loaded type reference. Pick one smell, the dominant one. No match and assertions cover the public contract → no smell.

## 5. Verdict

- **keep**: no smell.
- **refactor**: smell can be fixed in place. Keep the test until it's rewritten.
- **delete**: smell defeats the test's purpose (it can't fail, or it fails for no reason), it failed worth-existing, or it's skipped-dead and not worth unskipping. Before deleting, name what already covers the behaviour, or why the test can't catch a regression. If you can't, the verdict is refactor.
- **convert → <type>**: it failed right-type.

```
<test name / location> [<type>]
  Status: pass | broken | failing | env | skipped-dead | skipped-live | not run  (+ slow)
  Verdict: keep | refactor | delete | convert → <type>
  Smell: <catalogue name, or —>
  Next action: <one line, or —>
```

## Suite close

- **Type mix.** Count per type. Flag inverted pyramids (more e2e than unit) and missing types (stateful core without a model or property test; pure algorithm only tested by examples).
- **Smell distribution.** Count per smell. The top three are the suite's structural problems.
- **Status counts.** Broken, env and skipped-dead come first: they are coverage the suite claims but doesn't have.
- **Verdict ratios.** Counts of keep / refactor / delete / convert (split convert by target type).
- **Naming audit.** Tests named after methods (`testDoFoo`) vs. behaviour (`rejects_expired_token`). Method-named tests tend to break when the code is refactored.
