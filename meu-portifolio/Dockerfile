# ==============================================================================
# DOCKERFILE ULTRA-OTIMIZADO PARA ORACLE CLOUD - lUCA CAPELOCI
# ==============================================================================
# Multi-stage build otimizado para reduzir uso de CPU/RAM
# Compatível com Oracle Cloud Always Free Tier

# Stage 1: Dependências
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat curl && rm -rf /var/cache/apk/*
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json .npmrc ./
RUN echo "registry=https://registry.npmjs.org/\nfetch-timeout=300000\nfetch-retry-mintimeout=20000\nfetch-retry-maxtimeout=120000\nnetwork-concurrency=8\ncache-min=3600\nprefer-offline=true\nfund=false\naudit=false" > .npmrc

RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline --no-progress --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /root/.npm

# ==============================================================================
# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

# ✅ Corrigido: copiar apenas arquivos que realmente existem
COPY next.config.js ./
COPY public ./public
COPY src ./src

# Copiar tsconfig.json somente se existir
# (isso evita erro se faltar)
COPY tsconfig.json* ./  || true

# Dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build:fast -- --no-lint && \
    find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# ==============================================================================
# Stage 3: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl && rm -rf /var/cache/apk/* /tmp/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256 --no-warnings --enable-source-maps=false"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1

CMD ["node", "server.js"]
