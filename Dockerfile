# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# dependências (melhor cache)
COPY package*.json ./
RUN npm ci

# código + build
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# instala só deps de produção
COPY package*.json ./
RUN npm ci --omit=dev

# copia build
COPY --from=builder /app/dist ./dist

# (opcional) se você usa migrations/seed via scripts, copie também:
# COPY --from=builder /app/migrations ./migrations

EXPOSE 3000
CMD ["node", "dist/main.js"]
