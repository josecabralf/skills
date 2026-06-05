# Diátaxis type selection

Every page serves exactly one of four user needs. The type sets the structure and register.

## Decision

Answer two questions about the reader:

|                          | Serves their **study** | Serves their **work** |
|--------------------------|------------------------|-----------------------|
| **Practical steps**      | Tutorial               | How-to guide          |
| **Theoretical knowledge**| Explanation            | Reference             |

Shortcuts:

- Reader cannot yet formulate the question themselves → Tutorial
- Reader has a task and a deadline → How-to guide
- Reader needs to look something up mid-task → Reference
- Reader asks "why is it like this?" → Explanation

## Type register

[Tutorial](diataxis/TUTORIAL.md)
[How-to guide](diataxis/HOW-TO.md)
[Reference](diataxis/REFERENCE.md)
[Explanation](diataxis/EXPLANATION.md)

## Type-purity smells

Flag these during self-check; they mean the content is drifting types:

- A tutorial that explains background mid-step → move the explanation out, link to it.
- A how-to that teaches concepts before the steps → cut to the steps; link the concepts.
- A reference entry that says "you should usually..." → that's guidance; move it to a how-to.
- An explanation with numbered steps → that's a how-to wearing an explanation's title.
