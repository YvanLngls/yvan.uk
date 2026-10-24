# État actuel du projet

Bilan établi le 16/10/2026, mis à jour le 24/10/2026 (Nuxt 4.4.4, @nuxt/ui 4.7, @nuxt/content 3.13, pnpm 10).

## Ce qui fonctionne

- Site complet et déployé : blog bilingue, `/about`, `/discovery`, `/macroview`, jukebox.
- Stack moderne et à jour (Nuxt 4, Tailwind 4, TypeScript 6, @nuxt/content 3).
- CI **verte depuis le 24/10** : 0 erreur lint, 0 erreur typecheck, 11 tests Vitest (3 fichiers) sur chaque push.
- Bonnes pratiques Nuxt bien appliquées : `useAsyncData`, rechargement au changement de langue (`watch: [locale]`), pré-rendu de `/`, SEO de base (`useSeoMeta` global).
- Déploiement Docker documenté et reproductible (`build.sh`).

## Dette technique

### 🔴 Critique — hygiène du dépôt git ✅ résolu le 16/10/2026

Résolu par réinitialisation complète de l'historique (un seul commit propre + force push ; backup : `~/yvan.uk-backup-20261016.bundle`) :

- 36 169 fichiers suivis (dont `node_modules/`, `.nuxt/`, `.data/`) → **57 fichiers** ; pack **192 MiB → 25,7 MiB**
- Double lockfile éliminé (npm supprimé, pnpm uniquement) ; `.gitignore` refait
- Reste côté utilisateur : sauvegarde hors poste de `build.sh`, suppression du backup bundle après vérification du site

### 🟡 À surveiller

- Code du typewriter **dupliqué sur 3 pages** (index, journal, macroview) — non factorisé.
- Tri des articles par date **lexicographique** (`order('date', 'DESC')` sur `MM/DD/YYYY`) : fonctionne avec ce format, fragile autrement — gardé sous contrôle par un test.
- 2 articles FR (`ai-my-take.md`, `first-short-story.md`) sans version anglaise — **choix assumé (24/10)** : le journal n'est pas bilingue par obligation, la parité i18n ne porte que sur l'interface (testée).
- Transition de page : CSS `.page-enter/leave` présent dans `app.vue` mais `app.pageTransition` non activé dans `nuxt.config.ts`.
- `discovery.vue:28` : `import { computed } from 'vue'` au milieu du `<script setup>` (fonctionne, non idiomatique).
- `devtools.enabled: true` potentiellement actif en production.
- README.md d'origine du starter Nuxt UI jamais remplacé.

## Points forts à conserver

- Périmètre maîtrisé, code court et lisible (~10 fichiers Vue/TS).
- CI + Renovate en place.
- Conventions de nommage standard Nuxt respectées.
