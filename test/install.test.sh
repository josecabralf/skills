#!/usr/bin/env bash
# Runs install/uninstall against a throwaway HOME and checks every tool sees the skills.
set -euo pipefail
cd "$(dirname "$0")/.."
export HOME=$(mktemp -d) XDG_CONFIG_HOME= CLAUDE_CONFIG_DIR= OPENROUTER_API_KEY=
trap 'rm -rf "$HOME"' EXIT

mkdir -p "$HOME/.copilot/skills/tdd"   # a hand-made folder must survive
node bin/install.mjs >/dev/null 2>&1

test -f "$HOME/.agents/skills/jev/scripts/jev.mjs"
test -f "$HOME/.claude/skills/tdd/SKILL.md"
test -f "$HOME/.config/opencode/skills/jev/SKILL.md"
test -L "$HOME/.copilot/skills/jev"
test ! -L "$HOME/.copilot/skills/tdd"

node bin/install.mjs uninstall >/dev/null
test ! -e "$HOME/.agents/skills/jev"
test ! -e "$HOME/.claude/skills/tdd"
test -d "$HOME/.copilot/skills/tdd"
echo "install: ok"
