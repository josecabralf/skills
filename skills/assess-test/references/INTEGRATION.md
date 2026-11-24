# Integration Smells

Good integration test: real collaborators across one or a few boundaries (DB, queue, HTTP, filesystem), assertions on observable effects, isolated state per test, and failure paths covered as well as the happy path.

## Mocked Boundary

- **Symptom.** The boundary the test claims to integrate with (DB, broker, HTTP API) is replaced by a fake or in-memory stand-in with different semantics (SQLite for Postgres, dict for Redis).
- **Diagnosis.** Misses exactly the class of bug it exists to catch: constraints, transactions, serialization, dialect differences.
- **Repair.** Use the real dependency (container or ephemeral instance). If it's too slow, keep the fake for unit tests and add a few true integration tests.

## Containerized Pure Logic

- **Symptom.** Spins up DB / containers / app server, but what it asserts is computation that never touches I/O.
- **Diagnosis.** Slow and erratic for no benefit.
- **Repair.** **Convert → unit** (or **property-based** if it's many cases of one rule).

## Leaky State

- **Symptom.** Tests share a DB / bucket / queue without truncation, transaction rollback, or unique namespaces. Fixed ports or hard-coded IDs.
- **Diagnosis.** Chained / Erratic tests at the infrastructure level. Parallel runs break.
- **Repair.** Isolate per test: roll back the transaction, use unique schema / prefix / IDs, use random ports.

## Asserting Internals

- **Symptom.** Asserts on internal table rows, private queues, or log lines instead of the component's public output or API.
- **Diagnosis.** Fragile. Breaks on harmless schema or log changes.
- **Repair.** Assert through the public interface (call the read endpoint, consume the emitted event). Inspect storage directly only when storage *is* the contract.

## Happy-Path-Only

- **Symptom.** Only success cases. No timeouts, retries, constraint violations, partial failures, or duplicate deliveries.
- **Diagnosis.** Integration bugs live in the failure paths.
- **Repair.** Add cases for the boundary's failure modes (inject faults with a proxy or fault-injecting server).

## Journey Creep

- **Symptom.** Wires many services and walks a multi-step user flow.
- **Diagnosis.** Has the cost of a system test with integration-level setup hacks.
- **Repair.** **Convert → system** for the journey, or narrow it to one boundary.
