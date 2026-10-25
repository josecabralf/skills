#!/usr/bin/env node
// Installs every skill in ../skills for Claude Code, GitHub Copilot, OpenCode and ThinkRail.
//   npx github:josecabralf/skills             install all skills
//   npx github:josecabralf/skills uninstall   remove them
// The real copy goes to ~/.agents/skills (ThinkRail reads it natively); the other tools get symlinks to it.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills');
const HOME = os.homedir();
const STORE = path.join(HOME, '.agents', 'skills');
const LINKS = {
  'Claude Code': path.join(process.env.CLAUDE_CONFIG_DIR || path.join(HOME, '.claude'), 'skills'),
  'GitHub Copilot': path.join(HOME, '.copilot', 'skills'),
  OpenCode: path.join(process.env.XDG_CONFIG_HOME || path.join(HOME, '.config'), 'opencode', 'skills'),
};

const isLink = (p) => fs.lstatSync(p, { throwIfNoEntry: false })?.isSymbolicLink();
const exists = (p) => fs.lstatSync(p, { throwIfNoEntry: false }) !== undefined;
const skills = fs.readdirSync(SRC).filter((n) => fs.existsSync(path.join(SRC, n, 'SKILL.md')));
const [cmd = 'install'] = process.argv.slice(2);

// If ~/.agents/skills resolves into this repo, installing would delete the repo's own skills.
if (exists(STORE) && fs.realpathSync(STORE).startsWith(fs.realpathSync(SRC))) {
  console.error(`error: ${STORE} points into this repo. Remove it and re-run.`);
  process.exit(1);
}

if (cmd === 'install') {
  for (const name of skills) {
    const real = path.join(STORE, name);
    fs.rmSync(real, { recursive: true, force: true });
    fs.cpSync(path.join(SRC, name), real, { recursive: true });
    console.log(`${name} → ${real} (ThinkRail)`);
    for (const [tool, dir] of Object.entries(LINKS)) {
      const link = path.join(dir, name);
      // Never clobber a real skill folder the user put there by hand.
      if (exists(link) && !isLink(link)) { console.warn(`  skip ${tool}: ${link} is not a symlink`); continue; }
      fs.mkdirSync(dir, { recursive: true });
      fs.rmSync(link, { force: true });
      fs.symlinkSync(path.relative(dir, real), link);
      console.log(`  ${tool}: ${link}`);
    }
  }
  // Only reports whether the jev skill can find an OpenRouter key; the key is never copied or printed.
  spawnSync(process.execPath, [path.join(STORE, 'jev', 'scripts', 'jev.mjs'), 'status'], { stdio: 'inherit' });
  console.log('Done. Start a new session in each tool to pick the skills up.');
} else if (cmd === 'uninstall') {
  for (const name of skills) {
    for (const dir of Object.values(LINKS)) if (isLink(path.join(dir, name))) fs.rmSync(path.join(dir, name));
    fs.rmSync(path.join(STORE, name), { recursive: true, force: true });
    console.log(`removed ${name}`);
  }
} else {
  console.error('usage: install.mjs [install|uninstall]');
  process.exit(1);
}
