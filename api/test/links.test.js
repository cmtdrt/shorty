// Tests d'intégration : il faut une base initialisée avec db/init.sql (DATABASE_URL).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { app, pool } from '../src/app.js';

const server = app.listen(0);
const base = `http://localhost:${server.address().port}`;
after(() => { server.close(); pool.end(); });

test('crée un lien puis redirige', async () => {
  const created = await fetch(`${base}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://example.com/' }),
  }).then((r) => r.json());

  const res = await fetch(`${base}/s/${created.code}`, { redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), 'https://example.com/');
});
