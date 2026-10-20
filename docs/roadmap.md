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

## Phase 1 — Code mort et bugs 🟠

- [ ] Supprimer `app/pages/world-data.vue` (doublon cassé de macroview) — et sa route disparaît avec
- [ ] Supprimer `app/components/AppLogo.vue` et `app/components/TemplateMenu.vue` (restes du starter)
- [ ] Corriger l'icône `streamline-plump:sign-at-solid` : ajouter `@iconify-json/streamline-plump` **ou** la remplacer par une icône déjà disponible
- [ ] Corriger le `Dockerfile` : chemin L23, base `node:22` alignée avec la CI, réactiver `--frozen-lockfile`
- [ ] Nettoyer les commentaires de debug dans `nuxt.config.ts`
- [ ] SEO : `useHead` dynamique sur `/journal/:slug` (titre + description depuis le frontmatter)
- [ ] Réparer ou supprimer `titleTemplate` dans `app.vue`

## Phase 2 — Durcissement qualité 🟡

- [ ] Ajouter `pnpm build` à la CI (actuellement seulement lint + typecheck)
- [ ] Vérifier le fallback i18n pour les 2 articles FR sans version EN (`ai-my-take`, `first-short-story`) — traduire ou accepter le fallback
- [ ] Activer `app.pageTransition` dans `nuxt.config.ts` **ou** supprimer le CSS mort correspondant
- [ ] Désactiver les devtools en production
- [ ] (Optionnel) Mettre en place Vitest sur les composables/utilitaires critiques
- [ ] Écrire un vrai `README.md` du projet (remplacer celui du starter)
- [ ] Déploiement — fiabiliser `build.sh` : secrets externalisés (alias SSH + `.env.deploy`), health check post-déploiement + rollback, backup du script hors du poste, utilisateur dédié sur le VPS (détail : [deploiement.md](./deploiement.md))

## Phase 3 — Améliorations 🔵

- [ ] Factoriser l'effet typewriter en composable/composant partagé (3 duplications actuellement)
- [ ] Trier les articles par date réelle (parser le frontmatter plutôt que tri lexicographique)
- [ ] Uniformiser le typage TypeScript sur toutes les pages
- [ ] `discovery.vue` : remonter l'import de `computed` en tête de `<script setup>`
- [ ] À discuter : toggle dark/light, recherche dans le journal, RSS feed, analytics respectueux de la vie privée

## Phase 4 — CI/CD automatisée (GitHub Actions) 🔵

Objectif : déploiement automatique sur chaque push vers `main` (analyse complète : [deploiement.md](./deploiement.md)).

- [ ] Build de l'image Docker en CI
- [ ] Push de l'image vers GitHub Container Registry
- [ ] Étape de déploiement : ssh au VPS → `docker compose pull && up -d` (IP et clé SSH en secrets GitHub)
- [ ] Conserver `build.sh` comme commande de secours manuelle

---

**Règle de mise à jour** : cocher les cases au fil de l'avancement et déplacer les observations résolues hors de [etat-actuel.md](./etat-actuel.md).
