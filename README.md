# TP Shorty

> **Projet de TP** du cours « Dév avec Docker » (M2 Expert Développement Full Stack). Ce n'est pas une application maintenue : elle sert de support aux exercices.

Raccourcisseur d'URL : on colle une URL, on obtient un lien court `/s/<code>` qui compte les clics.

Elle est fournie **sans aucun fichier Docker** : c'est à vous de les écrire.

| Dossier | Contenu |
|---|---|
| `api/` | API Node.js 22 + Express, port 3000 |
| `front/` | React + Vite |
| `db/init.sql` | table `links` et liens de démo (PostgreSQL 17) |

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

## Lancer avec Docker

Une fois `.env` créé à la racine (`cp .env.example .env`, renseigner `POSTGRES_PASSWORD`), une seule commande démarre la stack de dev. Compose charge `compose.yaml` et `compose.override.yaml` tout seul. `--watch` synchronise `api/src` dans le conteneur et reconstruit l'image si `package.json` change :

```bash
docker compose up --watch
```

- Front (Vite) : http://localhost:5173
- API : http://localhost:3000
- PostgreSQL : `localhost:5432`, utilisateur et base `postgres`, mot de passe `POSTGRES_PASSWORD`

Sans la surcharge, la stack tourne avec le code figé dans les images : l'API est lancée par `node src/server.js`, le front est Nginx sur http://localhost:8080. Une modification de `server.js` ou de `App.jsx` n'apparaît qu'après reconstruction.

```bash
docker compose -f compose.yaml up -d --build
```

## Sécurité

Analyse Trivy (`--severity HIGH,CRITICAL`) des images de production, reconstruites avec `docker compose -f compose.yaml build --pull`. Aucune vulnérabilité CRITICAL. Vulnérabilités HIGH restantes :

### `shorty-api`

| Composant | Vulnérabilités | Version corrigée | Décision |
|---|---|---|---|
| npm, livré par `node:22-alpine` (`brace-expansion` ×5, `pacote` ×2, `ip-address`, `picomatch`, `sigstore`, `http-cache-semantics`) | 11 | oui, sauf `http-cache-semantics` | Supprimer npm de l'image finale : il ne sert qu'à `npm ci` pendant le build, pas à l'exécution de l'API. |
| `body-parser` 2.3.0, dépendance d'Express | 1 | 2.4.0 | Corriger : mettre à jour la dépendance dans `package-lock.json` (`npm update body-parser`). |

### `shorty-front`

| Composant | Vulnérabilités | Version corrigée | Décision |
|---|---|---|---|
| `curl` et `libcurl` (Alpine) | 1 (CVE-2026-92392) | 8.23.0-r0 | Corriger : mettre à jour les paquets Alpine au build, ou reconstruire avec `--pull` dès que l'image de base intègre le correctif. |
| `brotli-libs` (Alpine) | 1 (CVE-2026-111497) | 1.2.1-r0 | Même décision que pour `curl`. |
