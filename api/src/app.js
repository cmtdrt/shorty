import express from 'express';
import pg from 'pg';
import { randomBytes } from 'node:crypto';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.get('/api/links', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM links ORDER BY code');
  res.json(rows);
});

app.post('/api/links', async (req, res) => {
  const code = randomBytes(3).toString('hex');
  const { rows } = await pool.query(
    'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
    [code, req.body.url],
  );
  res.status(201).json(rows[0]);
});

app.get('/s/:code', async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE links SET clicks = clicks + 1 WHERE code = $1 RETURNING url',
    [req.params.code],
  );
  if (rows.length === 0) return res.status(404).send('Lien introuvable');
  res.redirect(rows[0].url);
});
