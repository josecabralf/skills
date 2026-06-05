# Style guide

## Don'ts

- **Emdashes as soft pauses.** Use a comma, period, or restructure.
  - No: "This relation is optional — and easy to configure."
  - Yes: "This relation is optional. Configure it with one command."
- **Marketing vocabulary.** Banned: `delve`, `robust`, `seamless`, `leverage`, `comprehensive`, `powerful`, `elegant`, `intuitive`, `boast`, `navigate the complexities of`, `in the realm of`, `in today's fast-paced`, `pivotal`, `groundbreaking`, `vibrant`, `renowned`, `testament`. Say what it does instead.
  - No: "This service offers a robust, seamless integration with the database."
  - Yes: "This service connects to the database over a connection pool."
- **Hedging openers.** State the fact directly.
  - No: "It's worth noting that `log_level` defaults to `info`."
  - Yes: "`log_level` defaults to `info`."
- **Listicle padding** ("Here are the key things to keep in mind:", "Let's explore", "Without further ado"). Cut the introducer; start the content.
- **Motivational paragraph endings** ("Now you're ready to deploy."). Stop when the instruction is complete.
- **Self-referential framing** ("In this section, we will walk through..."). Start the content.
- **Rhetorical-question section openers.** Answer the question and put the answer first.
  - No: "Why does the service need a database?"
  - Yes: "The service requires a database to persist state."
- **Bullet lists where a sentence is clearer.** Use a fenced code block for commands; prose for explanations.
- **Vague attribution and weasel quantifiers** ("Some users report..."). State the constraint directly.
  - No: "Some users have reported that `webhook_url` must be set before the first run."
  - Yes: "`webhook_url` must be set before the first run or startup fails."
- **"Not just X, but Y" and rule-of-three padding.** One plain sentence.
- **Copula replacements** ("serves as", "functions as", "acts as the entry point for"). Use `is`.
  - No: "This key serves as the entry point for external traffic."
  - Yes: "`external_host` is the hostname advertised to incoming traffic."
- **Importance inflation** (`crucial`, `critical`, `important`, `essential`) unless something breaks. Say what breaks.
  - No: "It's important to set `mode` correctly."
  - Yes: "If `mode` is `queue`, the cache connection is required or the process exits with `\"missing cache\"`."

## Required positive patterns

- **Name source file when introducing config keys, env vars, flags, actions, or status strings.** Reference where it is declared on first mention (the config file, the schema, the env definition).
- **Quote status strings, error strings, and default values verbatim in backticks.** "The process stays in `\"waiting for database\"` until the connection succeeds."
- **Show commands as fenced code blocks, not prose.** Do not write "You can run the config command if you want to."
  ```bash
  systemctl start myservice
  myservice config set log_level=debug
  ```
- **Lead with the operative information; put context after.**
  - No: "Because the service stores state in the database, you need to configure it before starting."
  - Yes: "Configure the database before the first start. The service stores state there and fails without it."
- **Use imperatives.** "Run the status command" not "You can run the status command to see the current state."
- **Use Markdown headings (`##`, `###`); never number sections.** `## Configure the database`, not `3. Configure the database`.
- **Code examples must run as-is.** No `<your-value>` placeholders. If a value genuinely varies, say so in prose after the block.
