# TP Shorty

> **Projet de TP** du cours « Dév avec Docker » (M2 Expert Développement Full Stack). Ce n'est pas une application maintenue : elle sert de support aux exercices.

Raccourcisseur d'URL : on colle une URL, on obtient un lien court `/s/<code>` qui compte les clics.

Elle est fournie **sans aucun fichier Docker** : c'est à vous de les écrire.

| Dossier | Contenu |
|---|---|
| `api/` | API Node.js 22 + Express, port 3000 |
| `front/` | React + Vite |
| `db/init.sql` | table `links` et deux liens de démo (PostgreSQL 17) |

## API

| Route | Rôle |
|---|---|
| `GET /health` | vérifie la connexion à la base |
| `GET /api/links` | liste des liens |
| `POST /api/links` | crée un lien : `{ "url": "https://..." }` |
| `GET /s/:code` | redirige vers l'URL et compte le clic |

Variables d'environnement : `DATABASE_URL` (ex. `postgres://shorty:shorty@localhost:5432/shorty`) et `PORT` (3000 par défaut).

## Front

En dev, `npm run dev` lance Vite, qui relaie `/api` et `/s/` vers l'API (adresse dans `API_URL`, par défaut `http://localhost:3000`).

En prod, `npm run build` produit des fichiers statiques dans `dist/`. Il faut un serveur web qui les sert et relaie `/api` et `/s/` vers l'API.

## Lancer sans Docker

Il faut Node.js 22 et un PostgreSQL 17 avec une base initialisée par `db/init.sql`.

```bash
cd api && npm ci
cp .env.example .env                        # adapter DATABASE_URL
node --env-file=.env --watch src/server.js

cd front && npm ci && npm run dev           # http://localhost:5173
```

Tests de l'API (il faut la base) : `DATABASE_URL=... npm test`.
