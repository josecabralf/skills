---
name: write-agents-md
description: Writes or audits AGENTS.md/CLAUDE.md agent-instruction files. Use when creating one, trimming or reviewing an existing one, or when the user asks to set up agent instructions for a repo.
---

# Write AGENTS.md / CLAUDE.md

Produce a short, high-signal instruction file. Bloat is the primary failure mode: a long file reduces adherence to everything in it.

## Rules (apply to every line)

1. **Removal test**: would removing this line cause the agent to make mistakes? If no, cut it.
2. **Include** only what is broadly applicable AND non-derivable: conventions that differ from defaults, repo etiquette (branch/PR rules), env quirks, gotchas. **Exclude**: file-by-file descriptions, practices the model already knows, detailed API docs (link instead), time-sensitive info.
3. **Verifiable imperatives**: "Run `npm test` before committing", not "test your changes". If compliance can't be checked, rewrite or cut.
4. **Length**: target under ~80 lines; never exceed 200.
5. **Progressive disclosure**: the main file is a table of contents. Multi-step procedures → skills; deep or sometimes-relevant knowledge → linked docs or path-scoped rules.
6. **Right altitude**: strong heuristics, neither brittle edge-case lists nor platitudes.
7. **Layering**: a nested file must complement its parents, never repeat them.
8. Use `IMPORTANT`/`YOU MUST` sparingly; emphasis inflation devalues it.

## Structure

Adapt to the repo; skip sections with no content:

1. **Repository layout** only if the structure doesn't explain itself (unconventional layout, monorepo, ambiguous dir names).
2. **Commands** lint, test, build: exact and copy-pasteable, including flags the model can't guess.
3. **Conventions & gotchas** only those passing rule 2.
4. **Pointers** per rule 5.

## Writing

1. **Inventory**: existing instruction files (root, monorepo parents, nested), skills, README, docs/, and Makefile/package.json/pyproject.toml for real commands.
2. **Verify**: run every candidate command; only working ones go in the file.
3. **Draft** per the structure.
4. If one file must serve multiple agent tools, write AGENTS.md as the single source and a one-line CLAUDE.md containing `@AGENTS.md`.

## Auditing

Walk the file line by line; mark each keep / rewrite / cut / relocate, citing the rule that triggered the verdict.

## Maintenance (tell the user)

Prune like code. A rule repeatedly ignored → file too long. The agent asking already-answered questions → ambiguous phrasing.
