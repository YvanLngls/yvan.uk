# Roadmap

Chantiers issus du bilan du 16/10/2026 (voir [etat-actuel.md](./etat-actuel.md)). Ordre de priorité : du plus bloquant/risqué vers l'amélioration continue.

## Phase 0 — Hygiène du dépôt git ✅ (terminée le 16/10/2026)

Objectif : un dépôt propre, rapide à cloner, sans artefacts générés. **Résultat : 57 fichiers suivis (contre 36 169), pack de 25,7 MiB (contre 192 MiB).**

- [x] Refaire le `.gitignore` (`node_modules/`, `.nuxt/`, `.output/`, `.data/`, `*.log`, `.pnpm-store/`, `.DS_Store`…)
- [x] Supprimer `package-lock.json` (npm n'est utilisé nulle part ; pnpm uniquement)
- [x] Retirer les artefacts déjà suivis (`git rm -r --cached node_modules .nuxt .data`)
- [x] Réinitialiser l'historique : branche orpheline → un seul commit propre + force push (choix retenu à la place de `git filter-repo`). Backup de l'ancien dépôt : `~/yvan.uk-backup-20261016.bundle`
- [x] Décider ce qui doit rester versionné : `public/journal/` reste dans git (~28 M — LFS/CDN jugés superflus)
- [ ] Sauvegarder `build.sh` hors du poste, puis supprimer le backup bundle une fois le site vérifié (actions manuelles)

## Phase 1 — Code mort et bugs ✅ (terminée le 24/10/2026)

- [x] Supprimer `app/pages/world-data.vue` (doublon cassé de macroview) ✅ 16/10 — aucune référence dans le code ; choix : suppression sans redirection
- [x] Supprimer `app/components/AppLogo.vue` et `app/components/TemplateMenu.vue` (restes du starter) ✅ 16/10 — dossier `app/components/` désormais vide
- [x] Icône `streamline-plump:sign-at-solid` ✅ 24/10 — collection `@iconify-json/streamline-plump` installée
- [x] `Dockerfile` ✅ 24/10 — base `node:22` alignée avec la CI, `--frozen-lockfile`, corepack piné sur pnpm 10.33.2, étape de build natif hacky supprimée (redondante avec `onlyBuiltDependencies`)
- [x] Commentaires de debug `nuxt.config.ts` ✅ 24/10
- [x] SEO `/journal/:slug` ✅ 24/10 — `useHead` réactif (titre + description depuis le frontmatter) ; `titleTemplate` simplifié

## Phase 2 — Durcissement qualité 🟡

- [x] **Remettre la CI au vert** ✅ 24/10 — `eslint --fix`, typage manuel (`about.vue`, `discovery.vue`, `macroview.vue` + extraction de `app/utils/world-bank.ts`), option i18n obsolète `lazy` retirée. 0 erreur lint, 0 erreur typecheck
- [x] `pnpm build` en CI ✅ 24/10 — 4ᵉ étape du workflow, build Nuxt (pré-rendu inclus) vérifié à chaque push
- [x] Parité i18n ✅ 24/10 — décision : l'**interface** doit être bilingue (testée), le **journal** n'est pas obligé d'avoir les deux versions d'un article
- [x] `app.pageTransition` ✅ 24/10 — transition « page » activée (fondu flouté, CSS existant réutilisé), choix A
- [x] Devtools coupés en production ✅ 24/10 — clé `$production` dans `nuxt.config.ts` + `NODE_ENV=production` dans le Dockerfile builder ; ⚠️ prend effet au prochain déploiement
- [x] Tests unitaires Vitest ✅ 24/10 — 11 tests : formatage/traitement Banque mondiale, parité des locales (exemption `about.skills` en attendant l'alignement des CV), frontmatter des articles. Étape `test` ajoutée à la CI
- [x] README.md du projet ✅ 24/10 — remplace celui du starter
- [ ] Déploiement — fiabiliser `build.sh` : secrets externalisés (alias SSH + `.env.deploy`), health check post-déploiement + rollback, backup du script hors du poste, utilisateur dédié sur le VPS (détail : [deploiement.md](./deploiement.md)) — **reporté volontairement**

## Phase 3 — Améliorations 🔵

- [x] Factoriser l'effet typewriter ✅ 24/10 — composable `useTypewriter` (`app/composables/useTypewriter.ts`) utilisé par les 3 pages ; corrige au passage deux timers jamais nettoyés (index, journal)
- [x] Trier les articles par date réelle ✅ 24/10 — dates ISO `YYYY-MM-DD` dans les frontmatter (9 articles migrés), affichage localisé via `formatDate` (`Intl.DateTimeFormat` : « 14 octobre 2026 » / « October 14, 2026 »), schéma zod validant le format, tri SQL exact même entre années
- [x] Uniformiser le typage TypeScript ✅ 24/10 — toutes les pages sont en `lang="ts"` et passent le typecheck
- [x] `discovery.vue` import de `computed` ✅ 24/10 — déjà en tête de script (observation obsolète)
- [ ] À discuter : toggle dark/light, recherche dans le journal, RSS feed, analytics respectueux de la vie privée

## Phase 4 — CI/CD automatisée (GitHub Actions) 🔵

Objectif : déploiement automatique sur chaque push vers `main` (analyse complète : [deploiement.md](./deploiement.md)).

- [ ] Build de l'image Docker en CI
- [ ] Push de l'image vers GitHub Container Registry
- [ ] Étape de déploiement : ssh au VPS → `docker compose pull && up -d` (IP et clé SSH en secrets GitHub)
- [ ] Conserver `build.sh` comme commande de secours manuelle

---

**Règle de mise à jour** : cocher les cases au fil de l'avancement et déplacer les observations résolues hors de [etat-actuel.md](./etat-actuel.md).
