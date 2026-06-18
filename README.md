# Skills

Agent skills for practical engineering work: disciplined debugging, test-driven development, planning, documentation, and codebase design. They are intentionally small and hackable. Read them and edit them to fit your workflow.

## Quick Setup

Install with the [skills](https://skills.sh) CLI:

```bash
npx skills@latest add josecabralf/skills
```

Or clone the repo and symlink every skill into `~/.claude/skills/` for Claude Code. Symlinks keep the installed skills in sync with the working copy:

```bash
./scripts/link-skills.sh
```

Or copy a single skill directory by hand:

```bash
cp -r skills/diagnosing-bugs ~/.claude/skills/
```

`scripts/list-skills.sh` prints every `SKILL.md` in the repo. `.claude-plugin/plugin.json` declares the skills for installs through the Claude Code plugin system.

## What These Skills Are For

### Closing the gap between what you meant and what the agent built

- [`grill-me`](./skills/grill-me/SKILL.md) — get interviewed about a plan until every branch of the decision tree is resolved, before any code is written.
- [`grill-with-docs`](./skills/grill-with-docs/SKILL.md) — grilling session that challenges your plan against the existing domain model, sharpening terminology and updating docs inline.
- [`grilling`](./skills/grilling/SKILL.md) — a relentless interview that walks down every decision branch, with recommended answers per question.
- [`handoff`](./skills/handoff/SKILL.md) — compress a long conversation into a document the next session can pick up.
- [`prototype`](./skills/prototype/SKILL.md) — build a throwaway prototype (terminal app or toggleable UI variations) to flesh out a design before committing.

### Keeping code correct through feedback loops

- [`tdd`](./skills/tdd/SKILL.md) — red-green-refactor, enforced.
- [`diagnosing-bugs`](./skills/diagnosing-bugs/SKILL.md) — disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- [`write-unit-tests`](./skills/write-unit-tests/SKILL.md) / [`assess-unit-tests`](./skills/assess-unit-tests/SKILL.md) — author tests worth keeping, and audit the ones you already have.

### Designing and modelling code

- [`codebase-design`](./skills/codebase-design/SKILL.md) — design "deep modules" (lots of behaviour behind a small interface placed at a clean seam) for testability and leverage.
- [`domain-modeling`](./skills/domain-modeling/SKILL.md) — build and sharpen your project's domain model by challenging terms, inventing edge-case scenarios, and writing a glossary.
- [`improve-codebase-architecture`](./skills/improve-codebase-architecture/SKILL.md) — scan a codebase for "deepening opportunities" (refactors that turn shallow modules into deep ones) surfaced as an HTML report.

### Turning plans into work and decisions into prose

- [`to-issues`](./skills/to-issues/SKILL.md) — break a plan or PRD into independently-grabbable issues using tracer-bullet vertical slices.
- [`to-prd`](./skills/to-prd/SKILL.md) — synthesise the current conversation and codebase understanding into a PRD and publish it to the issue tracker.
- [`document`](./skills/document/SKILL.md) — write docs classified by [Diátaxis](https://diataxis.fr/) type, gated behind technical review and command testing.
- [`write-agents-md`](./skills/write-agents-md/SKILL.md) / [`write-for-human`](./skills/write-for-human/SKILL.md) — write high-signal agent instructions and human-facing prose that follow removal-test and style guidelines.
- [`writing-great-skills`](./skills/writing-great-skills/SKILL.md) — reference for writing and editing skills well, centred on **predictability** and determinism.
- [`teach`](./skills/teach/SKILL.md) — teach the user a new skill or concept across multiple sessions with a structured workspace and lesson plans.

## Skills Reference

### Engineering

- **[diagnosing-bugs](./skills/diagnosing-bugs/SKILL.md)** — Disciplined diagnosis loop for hard bugs and performance regressions.
- **[tdd](./skills/tdd/SKILL.md)** — Test-driven development with a red-green-refactor loop.
- **[to-issues](./skills/to-issues/SKILL.md)** — Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker.
- **[to-prd](./skills/to-prd/SKILL.md)** — Turn conversation context into a PRD and publish it to the issue tracker.
- **[codebase-design](./skills/codebase-design/SKILL.md)** — Design deep, testable modules using a shared vocabulary for code structure.
- **[improve-codebase-architecture](./skills/improve-codebase-architecture/SKILL.md)** — Surface architectural friction and propose deepening opportunities.
- **[domain-modeling](./skills/domain-modeling/SKILL.md)** — Build a project's domain model with a glossary and ADRs.
- **[prototype](./skills/prototype/SKILL.md)** — Build throwaway prototypes to flesh out a design before committing.
- **[teach](./skills/teach/SKILL.md)** — Teach a new skill or concept across multiple sessions.

### Testing

- **[write-unit-tests](./skills/write-unit-tests/SKILL.md)** — Author unit tests through a prohibitions-and-procedure flow: worth-existing → right-instrument → behaviour-name → assertion-first → minimum-arrangement → red-then-green.
- **[assess-unit-tests](./skills/assess-unit-tests/SKILL.md)** — Audit existing unit tests and emit one verdict per test (keep / refactor / delete / wrong-layer) with the named smell.

### Productivity

- **[grill-me](./skills/grill-me/SKILL.md)** — Interview the user relentlessly about a plan or design until reaching shared understanding.
- **[grill-with-docs](./skills/grill-with-docs/SKILL.md)** — Grilling session that produces ADRs and glossary entries as the design is stress-tested.
- **[grilling](./skills/grilling/SKILL.md)** — Relentless interview walking down every decision branch, with recommended answers.
- **[handoff](./skills/handoff/SKILL.md)** — Compact the current conversation into a handoff document for another agent.
- **[document](./skills/document/SKILL.md)** — Write and revise technical documentation as a TA, classified by Diátaxis type.
- **[write-agents-md](./skills/write-agents-md/SKILL.md)** — Write or audit AGENTS.md/CLAUDE.md agent-instruction files.
- **[write-for-human](./skills/write-for-human/SKILL.md)** — Write text for human readers: docs, comments, and explanations.
- **[writing-great-skills](./skills/writing-great-skills/SKILL.md)** — Reference for writing predictable, deterministic skills.

## Attribution

This repo is a curated collection. Some skills are original; most come from [mattpocock/skills](https://github.com/mattpocock/skills).

### Original to this repo

- [assess-unit-tests](./skills/assess-unit-tests/SKILL.md)
- [document](./skills/document/SKILL.md)
- [write-agents-md](./skills/write-agents-md/SKILL.md)
- [write-for-human](./skills/write-for-human/SKILL.md)
- [write-unit-tests](./skills/write-unit-tests/SKILL.md)

### Copied or adapted from [mattpocock/skills](https://github.com/mattpocock/skills)

- [codebase-design](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design)
- [diagnosing-bugs](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs)
- [domain-modeling](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling)
- [grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)
- [grill-with-docs](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-with-docs)
- [grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)
- [handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff)
- [improve-codebase-architecture](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture)
- [prototype](https://github.com/mattpocock/skills/tree/main/skills/engineering/prototype)
- [tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)
- [teach](https://github.com/mattpocock/skills/tree/main/skills/productivity/teach)
- [to-issues](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-issues)
- [to-prd](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-prd)
- [writing-great-skills](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills)

The `scripts/` helpers and the plugin manifest layout are also taken from that repo.

## License

[MIT](./LICENSE).