// Runs jev.mjs against a fake Decisions API, so no key or network is needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const JEV = path.resolve(import.meta.dirname, '../skills/jev/scripts/jev.mjs');
const run = promisify(execFile);

test('filter sends one item per request, skips secrets, and lists hits by probability', async () => {
  const seen = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const { state, questions } = JSON.parse(body);
      seen.push(state.source);
      assert.equal(req.headers.authorization, 'Bearer test-key');
      assert.equal(questions.q.type, 'noul');
      const noul = state.content.includes('ERROR') ? (state.content.includes('fatal') ? 0.9 : 0.7) : 0.1;
      res.end(JSON.stringify({ answers: { q: { type: 'noul', noul } }, usage: { cost: 0.00001 } }));
    });
  });
  await new Promise((r) => server.listen(0, r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-'));
  fs.writeFileSync(path.join(dir, 'app.log'), 'ok\nERROR timeout\n\nERROR fatal crash\n');
  fs.writeFileSync(path.join(dir, '.env'), 'ERROR=secret');
  try {
    const { stdout } = await run('node', [JEV, 'filter', 'Is this an error?', dir, '--lines'], {
      env: { ...process.env, OPENROUTER_API_KEY: 'test-key', JEV_API_URL: `http://127.0.0.1:${server.address().port}` },
    });
    const hits = stdout.split('\n').filter((l) => /^\d\.\d\d/.test(l));
    assert.match(hits[0], /^0\.90 .*app\.log:4/);
    assert.match(hits[1], /^0\.70 .*app\.log:2/);
    assert.equal(hits.length, 2);
    assert.equal(seen.length, 3);
    assert.ok(!seen.some((s) => s.includes('.env')));
    assert.match(stdout, /skipped 1/);
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
