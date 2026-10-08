import { app, pool } from './app.js';

const port = process.env.PORT ?? 3000;
const server = app.listen(port, () => console.log(`API sur le port ${port}`));

// docker stop envoie SIGTERM : on s'arrête proprement.
process.on('SIGTERM', () => {
  server.close();
  pool.end();
});
