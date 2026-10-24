# Vue d'ensemble du projet

## Concept

Site personnel / portfolio « labo » de Yvan Langlois (ingénieur infrastructure IT), déployé sur **yvan.uk** :

- **Blog technique bilingue** (fr/en) — articles Markdown sur l'homelab, la robotique, l'IA…
- **Esthétique terminal/CRT rétro** : scanlines, barre de balayage animée, vert phosphore `#1aff80` sur noir (`#050505`). Effet codé en CSS pur dans `app/app.vue`.
- **Jukebox** : musique d'ambiance (`public/audio/plantasia.ogg`) pilotée depuis le header, état global via `useState` (`app/composables/jukebox.ts`).
- **MacroView** : dashboard data-viz de 8 indicateurs mondiaux (population, PIB, GES, internet, inflation, taux, chômage, activité) via l'API Banque mondiale, graphiques Chart.js avec zoom plein écran.

Le projet est issu du **starter template Nuxt UI** (des restes du template sont encore présents, voir [etat-actuel.md](./etat-actuel.md)).

## Stack technique

| Catégorie | Choix | Version |
|---|---|---|
| Framework | Nuxt (structure `app/`, convention Nuxt 4) | 4.4.4 |
| UI | Vue + @nuxt/ui | 3.5 / 4.7 |
| CSS | Tailwind CSS (syntaxe v4, `@theme` dans `app/assets/css/main.css`) | 4 |
| Contenu | @nuxt/content (Markdown → SQLite local via `better-sqlite3`) | 3.16 |
| i18n | @nuxtjs/i18n (stratégie `no_prefix`) | 10.6 |
| Animations | @vueuse/motion (directives `v-motion`, directive custom `pop-in`) | 3 |
| Graphiques | chart.js + vue-chartjs | 4.5 / 5.3 |
| Icônes | @iconify-json/lucide, @iconify-json/simple-icons (+ heroicons via @nuxt/ui) | — |
| Langage | TypeScript + vue-tsc | 6.0.3 |
| Gestionnaire | pnpm (`packageManager` piné) | 10.33.2 |

## Structure des dossiers

```
frontend/
├── app/                        # convention Nuxt 4
│   ├── app.vue                 # layout unique inline (header/nav/footer + effet CRT)
│   ├── app.config.ts           # thème Nuxt UI (primary: green, neutral: slate)
│   ├── assets/css/main.css     # Tailwind 4 + palette green custom + font Public Sans
│   ├── composables/            # jukebox.ts (audio), useTypewriter.ts (machine à écrire)
│   ├── utils/                  # world-bank.ts (données macro), format-date.ts (dates localisées)
│   └── pages/
├── content/journal/{fr,en}/    # articles Markdown (5 FR, 4 EN), dates ISO
├── content.config.ts           # collection `journal` (schéma zod validé : title, date ISO, description)
├── i18n/locales/{fr,en}.json   # tout le contenu éditorial (CV, discovery, hero…)
├── public/                     # favicon, audio, images/vidéos webp/mp4 des articles
├── tests/                      # 15 tests Vitest (4 fichiers)
├── docs/                       # cette documentation
└── (pas de server/, layouts/, middleware/, stores/ ni components/)
```

## Routage et pages

Routing fichier-based dans `app/pages/` :

| Route | Fichier | Contenu |
|---|---|---|
| `/` | `index.vue` | Hero animé (typewriter), 4 derniers articles, grille de skills, CTA |
| `/about` | `about.vue` | CV complet — 100 % piloté par les JSON i18n via `tm()`/`rt()` |
| `/discovery` | `discovery.vue` | Annuaire de liens classés par catégorie (données i18n) |
| `/journal` | `journal/index.vue` | Liste des articles de la locale courante |
| `/journal/:slug` | `journal/[slug].vue` | Article rendu via `<ContentRenderer>` |
| `/macroview` | `macroview.vue` | Dashboard Chart.js (API Banque mondiale) |

Particularités :

- **Pas de `layouts/`** : tout le layout vit dans `app.vue` (`<NuxtPage />` inline).
- **Pas de middleware**, pas de `server/` (pas d'API maison, pas de routes Nitro custom).
- La locale n'apparaît **pas dans les URL** (`strategy: 'no_prefix'`) ; elle se reflète dans le chemin du contenu (`content/journal/fr/…` vs `en/…`). Le slug d'article est partagé entre les langues.
- La route `/` est pré-rendue (`routeRules` dans `nuxt.config.ts`), le reste est SSR Nitro.

## Contenu et i18n

- **Contenu** : collection `journal` déclarée dans `content.config.ts` (type `page`, schéma zod validé `title`/`date`/`description`). Frontmatter au format ISO `YYYY-MM-DD` — tri SQL exact même entre années, affichage localisé via `formatDate` (`app/utils/format-date.ts`). Les médias des articles sont dans `public/journal/`.
- **i18n** : deux locales (`fr` défaut, `en`), fichiers JSON dans `i18n/locales/`, chargement paresseux, détection navigateur désactivée. Toggle fr↔en dans le header (`app.vue`).
- Rechargement des données au changement de langue : `{ watch: [locale] }` sur les `useAsyncData`.

## État et données

- **Pas de Pinia** ; état global via `useState` (jukebox).
- Données : `useAsyncData` + `queryCollection('journal')` ; `useFetch` côté client pour les endpoints Banque mondiale (`macroview.vue`).
- `better-sqlite3` est en `dependencies` car @nuxt/content v3 indexe le Markdown en SQLite (`.data/content/contents.sqlite`).

## Style / UI

- Nuxt UI v4 (composants `UApp`, `UButton`, `UBadge`, `UIcon`…), configuré via `app/app.config.ts`.
- Thème **uniquement dark**, font « Public Sans », palette green recalibrée.
- Effet CRT global : scanlines fixes + barre de balayage animée + vignettage, en CSS pur (`app.vue`).
- Transition de page floutée entre les routes (`app.pageTransition` = « page » ; CSS `.page-enter/leave` dans `app.vue`).

## Qualité, CI/CD, déploiement

- **ESLint** : flat config `eslint.config.mjs` (@nuxt/eslint, style `commaDangle: 'never'`, `braceStyle: '1tbs'`).
- **Tests** : Vitest (`pnpm test`) — 15 tests, 4 fichiers dans `tests/` : formatage/traitement des données Banque mondiale (`app/utils/world-bank.ts`), formatage localisé des dates (`app/utils/format-date.ts`), parité des locales i18n, frontmatter des articles.
- **Typecheck** : `nuxt typecheck` (vue-tsc) — 0 erreur depuis le 24/10.
- **Devtools** : actives en dev uniquement (clé `$production` dans `nuxt.config.ts` + `NODE_ENV=production` figé au build Docker).
- **CI** : `.github/workflows/ci.yml` — sur push : `lint` + `typecheck` + `test` + `build` (Node 22).
- **Renovate** : `renovate.json` (preset Nuxt).
- **Déploiement** auto-hébergé manuel : `Dockerfile` multi-stage (runtime Nitro standalone, port 3100) + `docker-compose.yml` + script `build.sh` (build → `docker save` → rsync/ssh vers un VPS → `docker load` + compose up).

Analyse détaillée du pipeline, de ses limites et du plan d'amélioration : [deploiement.md](./deploiement.md).

## Commandes

```bash
pnpm dev        # serveur de dev (port 3100)
pnpm build      # build de production
pnpm preview    # prévisualisation du build
pnpm lint       # ESLint
pnpm typecheck  # vérification TypeScript
pnpm test       # tests unitaires Vitest (11 tests)
```
