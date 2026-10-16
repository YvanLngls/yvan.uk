# CI/CD et déploiement

Analyse établie le 16/10/2026 à la suite d'une discussion sur le pipeline actuel.

## État actuel

Le « pipeline » actuel est **manuel** : un script `build.sh` à la racine du projet, **gitigné volontairement** car il contient des informations sensibles (IP du VPS `45.148.29.206`, accès SSH…).

Séquence du script :

1. Build local de l'image Docker
2. `docker save` de l'image
3. `rsync`/`ssh` vers le VPS
4. `docker load` + `docker compose up -d` sur le VPS

Éléments associés : `Dockerfile` multi-stage (runtime Nitro standalone, port 3100), `docker-compose.yml`, CI GitHub Actions (lint + typecheck uniquement, pas de build), Renovate.

## Avantages de l'approche

- Script unique, transparent, reproductible — tout le pipeline est lisible d'un coup d'œil
- Pas de dépendance à une plateforme externe
- Docker garantit un artefact identique entre build et runtime

## Limites identifiées

- **Pas automatisé** : un push ne déploie rien, tout repose sur l'exécution manuelle du script
- **Point unique de défaillance : le poste local** (clés SSH, Docker, pnpm) — impossible de déployer depuis une autre machine ou en déplacement
- **L'artefact de prod est construit localement** : la CI ne fait que lint/typecheck → risque de dérive « ça marchait chez moi »
- **Pas de health check post-déploiement** ni de rollback automatique
- **Script non versionné** : seule copie sur la machine locale ; panne du poste = perte du pipeline
- **Secrets en clair** dans le script, lisibles par tout processus tournant sous l'utilisateur
- IP du VPS visible dans l'historique git (dépôt public) — non critique en soi, mais à savoir

## Recommandations

### Court terme — fiabiliser l'existant

- [ ] Sortir les secrets du script : alias SSH (`~/.ssh/config`, ex. `Host yvan-vps`) + variables d'environnement (fichier `.env.deploy` gitigné) → le script ne contient plus rien de sensible et devient commitable/versionné
- [ ] Ajouter un health check après déploiement (`curl` sur le site) + rollback sur échec (conserver l'image précédente)
- [ ] Sauvegarder le script hors de la machine (gestionnaire de mots de passe / dépôt privé / archive chiffrée)
- [ ] Utilisateur de déploiement dédié côté VPS, authentification par clé SSH uniquement

### Moyen terme — vraie CD (GitHub Actions)

- [ ] Build de l'image Docker en CI sur chaque push vers `main`
- [ ] Push de l'image vers GitHub Container Registry (gratuit pour un dépôt public)
- [ ] Étape de déploiement : `ssh` au VPS → `docker compose pull && up -d` (secrets GitHub : IP, clé SSH)
- [ ] Conserver `build.sh` comme commande de secours manuelle

## Décision actuelle

L'approche manuelle est **conservée pour l'instant**. Les chantiers correspondants sont intégrés à la [roadmap](./roadmap.md) (Phase 2 et Phase 4).
