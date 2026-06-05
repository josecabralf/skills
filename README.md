# Skills

Agent skills for practical engineering work: disciplined debugging, test-driven development, planning, and documentation. They are intentionally small and hackable. Read them and edit them to fit your workflow.

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
cp -r skills/diagnose ~/.claude/skills/
```

`scripts/list-skills.sh` prints every `SKILL.md` in the repo. `.claude-plugin/plugin.json` declares the skills for installs through the Claude Code plugin system.

## What These Skills Are For

### Closing the gap between what you meant and what the agent built

- [`grill-me`](./skills/grill-me/SKILL.md) — get interviewed about a plan until every branch of the decision tree is resolved, before any code is written.
- [`handoff`](./skills/handoff/SKILL.md) — compress a long conversation into a document the next session can pick up.

### Keeping code correct through feedback loops

- [`tdd`](./skills/tdd/SKILL.md) — red-green-refactor, enforced.
- [`diagnose`](./skills/diagnose/SKILL.md) — reproduce → minimise → hypothesise → instrument → fix → regression-test, instead of guess-and-patch.
- [`write-unit-tests`](./skills/write-unit-tests/SKILL.md) / [`assess-unit-tests`](./skills/assess-unit-tests/SKILL.md) — author tests worth keeping, and audit the ones you already have.

### Turning plans into work and decisions into prose

- [`to-issues`](./skills/to-issues/SKILL.md) — break a plan or PRD into independently-grabbable issues using tracer-bullet vertical slices.
- [`document`](./skills/document/SKILL.md) — write docs classified by [Diátaxis](https://diataxis.fr/) type, gated behind technical review and command testing.
- [`write-a-skill`](./skills/write-a-skill/SKILL.md) — create new skills with proper structure and progressive disclosure.

## Skills Reference

### Engineering

- **[diagnose](./skills/diagnose/SKILL.md)** — Disciplined diagnosis loop for hard bugs and performance regressions.
- **[tdd](./skills/tdd/SKILL.md)** — Test-driven development with a red-green-refactor loop.
- **[to-issues](./skills/to-issues/SKILL.md)** — Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker.

### Testing

- **[write-unit-tests](./skills/write-unit-tests/SKILL.md)** — Author unit tests through a prohibitions-and-procedure flow: worth-existing → right-instrument → behavior-name → assertion-first → minimum-arrangement → red-then-green.
- **[assess-unit-tests](./skills/assess-unit-tests/SKILL.md)** — Audit existing unit tests and emit one verdict per test (keep / refactor / delete / wrong-layer) with the named smell.

### Productivity

- **[grill-me](./skills/grill-me/SKILL.md)** — Interview the user relentlessly about a plan or design until reaching shared understanding.
- **[handoff](./skills/handoff/SKILL.md)** — Compact the current conversation into a handoff document for another agent.
- **[document](./skills/document/SKILL.md)** — Write and revise technical documentation as a TA, classified by Diátaxis type.
- **[write-a-skill](./skills/write-a-skill/SKILL.md)** — Create new agent skills with proper structure, progressive disclosure, and bundled resources.

## Attribution

Most of these skills come from [mattpocock/skills](https://github.com/mattpocock/skills). Copied skills:

- [diagnose](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnose)
- [tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)
- [to-issues](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-issues)
- [grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)
- [handoff](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff)
- [write-a-skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/write-a-skill)

The `scripts/` helpers and the plugin manifest layout are also taken from that repo.

`assess-unit-tests`, `write-unit-tests`, and `document` are original to this repo.

## License

[MIT](./LICENSE).