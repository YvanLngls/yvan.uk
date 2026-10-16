# --- STAGE 1: Builder ---
FROM node:20-slim AS builder

WORKDIR /app

# 1. Installation des outils nécessaires à la compilation C/C++ pour better-sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Activation de Corepack pour disposer de PNPM (version détectée depuis package.json)
RUN corepack enable && corepack prepare pnpm@latest --activate

# 3. Copie des fichiers de gestion de dépendances
COPY package.json pnpm-lock.yaml* ./

# 4. Installation de TOUTES les dépendances (pnpm install installe aussi les devDependencies requises pour nuxt build)
RUN pnpm install # --frozen-lockfile

# 5. 🔥 FORCER la compilation native de better-sqlite3 pour Linux
RUN cd node_modules/.pnpm/better-sqlite3@* /node_modules/better-sqlite3 2>/dev/null && pnpm rebuild better-sqlite3 || npx node-gyp rebuild --directory node_modules/better-sqlite3 || true

# 6. Copie du reste du code source et build de l'app Nuxt
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=3584"
RUN pnpm run build

# --- STAGE 2: Runner (prod) ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3100
ENV HOST=0.0.0.0

# Copie uniquement de l'output Nitro généré (qui embarque son propre serveur standalone)
COPY --from=builder /app/.output ./.output

EXPOSE 3100

CMD ["node", ".output/server/index.mjs"]
