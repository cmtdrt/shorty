import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En dev, Vite relaie /api et /s/ vers l'API.
const api = process.env.API_URL ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': api, '/s/': api } },
});
