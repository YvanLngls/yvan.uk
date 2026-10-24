# yvan.uk

Site personnel — explorations techniques, homelab, robotique et notes en français et en anglais, avec une esthétique terminal/CRT rétro. En ligne sur [yvan.uk](https://yvan.uk).

## Fonctionnalités

- **Journal bilingue** (fr/en) propulsé par `@nuxt/content` — articles en Markdown
- **MacroView** : dashboard de 8 indicateurs mondiaux (API Banque mondiale, Chart.js)
- **Jukebox** : musique d'ambiance intégrée
- Effet CRT global (scanlines, balayage), transitions de page fondu/flouté, thème sombre

## Stack

Nuxt 4 · Vue 3 · Nuxt UI · Tailwind CSS 4 · @nuxt/content 3 · @nuxtjs/i18n · Chart.js · TypeScript · pnpm

## Démarrage

```bash
pnpm install
pnpm dev        # http://localhost:3100
```

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de développement (port 3100) |
| `pnpm build` | Build de production |
| `pnpm preview` | Prévisualisation du build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Vérification TypeScript (vue-tsc) |
| `pnpm test` | Tests unitaires Vitest |

## Tests

11 tests unitaires dans `tests/` : formatage des données Banque mondiale (`app/utils/world-bank.ts`), parité des locales i18n (l'interface doit être bilingue — le journal ne l'est pas obligatoirement), validité du frontmatter des articles. La CI (GitHub Actions) exécute lint + typecheck + test + build à chaque push.

## Structure

```
app/            # pages, composables, utils, assets (convention Nuxt 4)
content/journal # articles Markdown par locale (fr, en)
i18n/locales    # interface bilingue
tests/          # tests unitaires Vitest
docs/           # documentation du projet (état, roadmap, déploiement)
```

## Déploiement

Auto-hébergé sur un VPS via Docker (multi-stage, runtime Nitro standalone). Le pipeline est documenté dans [docs/deploiement.md](docs/deploiement.md).

## Licence

Voir [LICENSE](LICENSE).
