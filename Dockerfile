# --- STAGE 1: Builder ---
FROM node:22-slim AS builder

WORKDIR /app

# 1. Outils de compilation C/C++ pour better-sqlite3 (build natif lancé par pnpm install
#    grâce à "onlyBuiltDependencies" dans package.json)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Corepack fournit la version de pnpm pinée dans package.json
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# 3. Copie des fichiers de gestion de dépendances
COPY package.json pnpm-lock.yaml* ./

# 4. Installation reproductible de toutes les dépendances (dev incluses pour nuxt build)
RUN pnpm install --frozen-lockfile

# 5. Copie du code source et build de l'app Nuxt
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=3584"
RUN pnpm run build

# --- STAGE 2: Runner (prod) ---
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3100
ENV HOST=0.0.0.0

# Copie uniquement de l'output Nitro généré (qui embarque son propre serveur standalone)
COPY --from=builder /app/.output ./.output

EXPOSE 3100

CMD ["node", ".output/server/index.mjs"]
