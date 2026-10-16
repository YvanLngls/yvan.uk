# État actuel du projet

Bilan établi le 16/10/2026 (Nuxt 4.4.4, @nuxt/ui 4.7, @nuxt/content 3.13, pnpm 10).

## Ce qui fonctionne

- Site complet et déployé : blog bilingue, `/about`, `/discovery`, `/macroview`, jukebox.
- Stack moderne et à jour (Nuxt 4, Tailwind 4, TypeScript 6, @nuxt/content 3).
- CI verte : lint + typecheck sur chaque push.
- Bonnes pratiques Nuxt bien appliquées : `useAsyncData`, rechargement au changement de langue (`watch: [locale]`), pré-rendu de `/`, SEO de base (`useSeoMeta` global).
- Déploiement Docker documenté et reproductible (`build.sh`).

## Dette technique

### 🔴 Critique — hygiène du dépôt git

- **~36 000 fichiers suivis** dans git, dont l'intégralité de `node_modules/`, 243 fichiers `.nuxt/` générés et la base SQLite `.data/content/contents.sqlite`. Pack git ≈ **192 MiB**.
- **Double lockfile** : `package-lock.json` (npm, 754 Ko, obsolète) coexiste avec `pnpm-lock.yaml`.
- `.gitignore` réduit à 3 lignes (`.env`, `build.sh`, `.output`).

### 🟠 Important — code mort et bugs

- **`app/pages/world-data.vue`** : copie quasi conforme de `macroview.vue` (~240 lignes identiques), absente de la nav, clés i18n `world-data.*` inexistantes → page orpheline cassée. Probablement l'ancienne version de macroview.
- **`app/components/AppLogo.vue` et `TemplateMenu.vue`** : restes du starter Nuxt UI, inutilisés.
- **Icône manquante** : `about.vue` référence `streamline-plump:sign-at-solid` (via les JSON i18n) mais `@iconify-json/streamline-plump` n'est pas installé → icône non affichée.
- **`Dockerfile:23`** : chemin cassé (`better-sqlite3@* /node_modules`, espace parasite) masqué par `|| true` ; image en `node:20` alors que la CI cible Node 22 ; `--frozen-lockfile` commenté.
- **SEO article** : pas de `useHead` dynamique sur `/journal/:slug` (le titre de l'article n'apparaît pas dans l'onglet).
- **`titleTemplate` inopérant** dans `app.vue` (`chunk ? chunk : title` ne fait rien).

### 🟡 À surveiller

- Commentaires de debug laissés dans `nuxt.config.ts:39-44` (« ← Corrigé », « ← Sans slash final, plus fiable »).
- Code du typewriter **dupliqué sur 3 pages** (index, journal, macroview) — non factorisé.
- Tri des articles par date **lexicographique** (`order('date', 'DESC')` sur `MM/DD/YYYY`) : fonctionne avec ce format, fragile autrement.
- 2 articles FR (`ai-my-take.md`, `first-short-story.md`) **sans version anglaise** — comportement de fallback à vérifier/décider.
- Transition de page : CSS `.page-enter/leave` présent dans `app.vue` mais `app.pageTransition` non activé dans `nuxt.config.ts`.
- `discovery.vue:28` : `import { computed } from 'vue'` au milieu du `<script setup>` (fonctionne, non idiomatique).
- `devtools.enabled: true` potentiellement actif en production.
- `macroview.vue` en TypeScript, `world-data.vue` en JavaScript — typage hétérogène.
- README.md d'origine du starter Nuxt UI jamais remplacé.

## Points forts à conserver

- Périmètre maîtrisé, code court et lisible (~10 fichiers Vue/TS).
- CI + Renovate en place.
- Conventions de nommage standard Nuxt respectées.
