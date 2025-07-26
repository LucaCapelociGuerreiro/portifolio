# ================================================================
# Stage 1: Instala TODAS as dependências (incluindo dev) Luca Capeloci
# ================================================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat curl && rm -rf /var/cache/apk/*
WORKDIR /app

COPY ./package.json ./package-lock.json ./
# ✅ Instalar TUDO (incluindo devDependencies)
RUN npm ci --legacy-peer-deps

# ================================================================
# Stage 2: Build do Next.js
# ================================================================
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY . .
# ✅ Copiar node_modules com dev + prod
COPY --from=deps /app/node_modules ./node_modules

# ✅ Agora o Next.js está disponível para buildar
RUN npm run build:fast -- --no-lint && \
    find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# ================================================================
# Stage 3: Runtime (apenas artefatos finais)
# ================================================================
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl && rm -rf /var/cache/apk/* /tmp/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256 --no-warnings --enable-source-maps=false"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# ✅ Copiar apenas arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1

CMD ["node", "server.js"]
