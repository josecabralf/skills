#!/usr/bin/env node
// Hands bulk yes/no and labelling calls to Jev (TypeSafe) through OpenRouter's Decisions API.
//   jev.mjs status
//   jev.mjs filter "<yes/no question>" <paths...|-> [--lines] [--threshold 0.5]
//   jev.mjs classify "<question>" --labels a,b,c <paths...|-> [--lines]
// Node 18+, no dependencies. The key comes from $OPENROUTER_API_KEY or ~/.config/openrouter/api_key.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const API_URL = process.env.JEV_API_URL || 'https://openrouter.ai/api/alpha/decisions';
const MODEL = process.env.JEV_MODEL || 'typesafe/jev-1.13';
const KEY_FILE = path.join(os.homedir(), '.config', 'openrouter', 'api_key');
const MAX_CHARS = 90_000; // Jev's context is 32k tokens
const CONCURRENCY = 16;
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'target', 'vendor', '__pycache__', '.venv', 'venv']);
// Files that look like credentials are never sent to a third party.
const SECRET_RE = /(^|\/)(\.env(\..*)?|.*\.(pem|key|p12|pfx|jks)|id_(rsa|dsa|ecdsa|ed25519)(\.pub)?|\.npmrc|\.netrc|credentials(\.json)?|secrets?\.(json|ya?ml|toml)|api_key)$/i;

const die = (msg, code = 1) => { console.error(`jev: ${msg}`); process.exit(code); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function apiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();
  try { return fs.readFileSync(KEY_FILE, 'utf8').trim(); } catch { return ''; }
}

function parseArgs(argv) {
  const pos = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--lines') flags.lines = true;
    else if (argv[i].startsWith('--')) flags[argv[i].slice(2)] = argv[++i];
    else pos.push(argv[i]);
  }
  return { pos, flags };
}

function listFiles(dir) {
  try {
    const out = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 });
    return out.split('\0').filter(Boolean).map((f) => path.join(dir, f));
  } catch {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return SKIP_DIRS.has(e.name) || e.name.startsWith('.') ? [] : listFiles(p);
      return e.isFile() ? [p] : [];
    });
  }
}

function collect(specs, lines) {
  const items = [], skipped = [];
  const add = (id, text) => {
    const chunks = lines ? text.split(/\r?\n/).map((l, i) => [`${id}:${i + 1}`, l]) : [[id, text]];
    for (const [cid, t] of chunks) {
      if (t.trim()) items.push({ id: t.length > MAX_CHARS ? `${cid} (first ${MAX_CHARS} chars)` : cid, text: t.slice(0, MAX_CHARS) });
    }
  };
  for (const spec of specs) {
    if (spec === '-') { add('stdin', fs.readFileSync(0, 'utf8')); continue; }
    if (!fs.existsSync(spec)) die(`no such file or directory: ${spec}`);
    for (const f of fs.statSync(spec).isDirectory() ? listFiles(spec) : [spec]) {
      const buf = fs.statSync(f, { throwIfNoEntry: false })?.isFile() ? fs.readFileSync(f) : null;
      if (!buf || SECRET_RE.test(f) || buf.length > 2e6 || buf.subarray(0, 8000).includes(0)) { skipped.push(f); continue; }
      add(path.relative('.', f) || f, buf.toString('utf8'));
    }
  }
  if (!items.length) die('nothing to judge: pass files, directories, or - for stdin');
  return { items, skipped };
}

async function decide(state, questions) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json', 'X-OpenRouter-Title': 'jev skill' },
      body: JSON.stringify({ model: MODEL, state, questions }),
      signal: AbortSignal.timeout(60_000),
    });
    if (res.ok) return res.json();
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) { await sleep(500 * 2 ** attempt); continue; }
    die(`OpenRouter returned ${res.status}: ${(await res.text()).slice(0, 500)}`, res.status === 401 ? 3 : 1);
  }
}

// One item per request: packing several items into one state makes Jev less accurate.
async function askEach(items, question) {
  const answers = [];
  let next = 0, cost = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      const res = await decide({ source: items[i].id, content: items[i].text }, { q: question });
      answers[i] = res.answers.q;
      cost += res.usage?.cost || 0;
    }
  }));
  return { answers, cost };
}

const show = (it, lines) => (lines ? `${it.id}  ${it.text.trim().replace(/\s+/g, ' ').slice(0, 160)}` : it.id);

function footer(items, extra, cost, skipped) {
  console.log(`— ${items.length} judged · ${extra} · $${cost.toFixed(5)}`);
  if (skipped.length) console.log(`— skipped ${skipped.length} (secret-like, binary, or >2MB): ${skipped.join(', ').slice(0, 400)}`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, flags } = parseArgs(rest);
  if (cmd === 'status') {
    if (!apiKey()) die(`not configured: put an OpenRouter key in ${KEY_FILE} or export OPENROUTER_API_KEY`, 3);
    return console.log(`ready (model ${MODEL})`);
  }
  if (!apiKey()) die(`no OpenRouter key: put one in ${KEY_FILE} or export OPENROUTER_API_KEY`, 3);
  const question = pos.shift();

  if (cmd === 'filter' && question) {
    const threshold = Number(flags.threshold ?? 0.5);
    const { items, skipped } = collect(pos, flags.lines);
    const { answers, cost } = await askEach(items, { type: 'noul', instructions: question });
    const hits = items.map((it, i) => ({ it, p: answers[i].noul })).filter((r) => r.p >= threshold).sort((a, b) => b.p - a.p);
    hits.forEach((r) => console.log(`${r.p.toFixed(2)}  ${show(r.it, flags.lines)}`));
    return footer(items, `${hits.length} matched (p ≥ ${threshold})`, cost, skipped);
  }

  if (cmd === 'classify' && question && flags.labels) {
    const labels = flags.labels.split(',').map((l) => l.trim()).filter(Boolean);
    const { items, skipped } = collect(pos, flags.lines);
    const { answers, cost } = await askEach(items, { type: 'choice', instructions: question, criteria: Object.fromEntries(labels.map((l) => [l, l])) });
    const rows = items.map((it, i) => ({ it, a: answers[i] })).sort((x, y) => labels.indexOf(x.a.choice) - labels.indexOf(y.a.choice) || y.a.confidence - x.a.confidence);
    rows.forEach((r) => console.log(`${r.a.choice}  ${r.a.confidence.toFixed(2)}  ${show(r.it, flags.lines)}`));
    return footer(items, `${labels.length} labels`, cost, skipped);
  }

  die('usage: jev.mjs status | filter "<yes/no question>" <paths...|-> [--lines] [--threshold 0.5] | classify "<question>" --labels a,b,c <paths...|-> [--lines]');
}

main().catch((e) => die(e.message));
