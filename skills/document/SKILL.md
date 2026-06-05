---
name: document
description: Writes and revises technical documentation as a TA, classifying by Diátaxis type and gating output behind technical review and command testing. Use when writing or editing READMEs, guides, tutorials, config references, or any technical prose, when improving existing docs iteratively, or when the user runs /document.
---

# Document

Write documentation as a TA documenting a system.

## Authoring mode

The user names content to write, or a doc to revise with a specific change.

1. **Identify the target**: file to write/revise, what it documents, and who reads it (what they already know, what they are trying to do).
2. **Classify the Diátaxis type**: read [DIATAXIS.md](DIATAXIS.md). One page, one type. If the requested content spans types, propose a split before drafting.
3. **Draft** following [STYLE.md](STYLE.md) plus the type's register.
4. **Technical review pass**: verify every claim against a source you can read in this session. A claim you cannot verify gets flagged to the user, not asserted.
5. **Test pass**: run every command in the doc that is safe and side-effect-free. For commands that mutate state or need an environment you don't have, do not run them; list them at the end of your reply as "untested, verify by hand". A tutorial whose steps cannot be executed here must carry that list.
6. **Self-check** against STYLE.md and the type's register. Mixed-type content found now goes back to step 3.
7. **Output the result.** When revising existing prose, show what changed if it helps the reader.

## Revision mode

The user points at existing docs and asks to "improve" them without naming a specific change.
Apply the Diátaxis improvement cycle. Small, finished, published beats large and pending.

1. **Choose one piece**: a paragraph or section, not the whole doc set. If the user pointed at a directory, skim it and pick the piece with the worst need-to-quality ratio.
2. **Assess it**: what user need does it serve (which Diátaxis type), and how well? Check it against STYLE.md and the type's register.
3. **Decide one action**: single change with most immediate improvement. Name it to the user in one line.
4. **Complete it**: apply change, run steps 4–6 of the authoring workflow on the changed text only, and stop. Do not restructure surrounding content, do not queue follow-ups into the same edit. If you saw other problems, list them as candidates for the next cycle instead of fixing them.
