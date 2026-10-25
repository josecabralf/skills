---
name: jev
description: Hand bulk yes/no and labelling calls to Jev, a cheap typed decision model on OpenRouter, so you read only what survives instead of every file or log line. Use BEFORE reading many files, long logs, or long lists just to decide which parts matter. That covers finding the files related to a feature or bug, picking the error lines out of a log, triaging or labelling many items (tickets, test failures, commits, TODOs, search hits), and ranking candidates by relevance. Also use when the user says jev, "delegate", or "save tokens". Skip it for generating or editing text, multi-step reasoning, maths, counting, and input small enough to read directly.
---

# Jev: Jev narrows, you read what survives

Jev returns typed judgments with probabilities, not text. It cannot write, explain, or reason in steps. Each item it rules out is content you never read.

In the commands below, `jev` stands for:

```bash
node "<base directory of this skill>/scripts/jev.mjs"
```

## First run

Run `jev status`.

- `ready` means go straight to the task.
- `not configured` means stop and tell the user to put an OpenRouter key in `~/.config/openrouter/api_key` or export `OPENROUTER_API_KEY`. Never ask them to paste the key into the chat, and never read or print that file.

## Commands

Inputs are files, directories (git-tracked files, or every file outside build folders), or `-` for stdin. Add `--lines` to judge each line separately, for logs and lists.

- **Filter**: `jev filter "<yes/no question>" <inputs> [--threshold 0.5]` prints the items Jev says yes to, most likely first. Use `--threshold 0` to rank every item.
- **Classify**: `jev classify "<question>" --labels bug,feature,question <inputs>` prints each item's label and confidence.

Examples:

```bash
jev filter "Does this file handle user authentication?" src/
jev filter "Is this log line an error or a crash?" app.log --lines
jev classify "What kind of change is this commit?" --labels feature,fix,refactor,docs - --lines < <(git log --oneline -200)
```

## Rules

- Ask about one item at a time. Each item goes in its own request, and the question must make sense for a single file or line.
- Treat the output as a shortlist, not an answer. Read the survivors before you act on them.
- A probability near the threshold is a coin toss. Read those items yourself.
- If the hits look wrong, rephrase the question more concretely before you fall back to reading everything.
- Files that look like credentials (`.env`, keys, `credentials.json`, `api_key`) are skipped automatically. Never pipe secrets in through stdin.
- Set `JEV_MODEL` to use another decision model, for example `~typesafe/jev-latest`.
