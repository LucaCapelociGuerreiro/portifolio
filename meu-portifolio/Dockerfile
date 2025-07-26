# ==============================================================================
# DOCKERFILE ULTRA-OTIMIZADO PARA ORACLE CLOUD - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Multi-stage build otimizado para reduzir uso de CPU/RAM
# Compatível com Oracle Cloud Always Free Tier

# Stage 1: Dependências com otimizações avançadas
FROM node:18-alpine AS deps

# Instalar apenas o essencial e limpar cache
RUN apk add --no-cache libc6-compat curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Configurações globais do npm para acelerar instalação
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar apenas os arquivos de dependências para aproveitar o cache
COPY package*.json .npmrc ./

# Criar .npmrc otimizado para acelerar instalação
RUN echo "registry=https://registry.npmjs.org/\nfetch-timeout=300000\nfetch-retry-mintimeout=20000\nfetch-retry-maxtimeout=120000\nnetwork-concurrency=8\ncache-min=3600\nprefer-offline=true\nfund=false\naudit=false" > .npmrc

# Instalar apenas dependências de produção com otimizações avançadas
RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline --no-progress --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Stage 2: Build otimizado com limitação de memória
FROM node:18-alpine AS builder
WORKDIR /app

# Configurar variáveis de ambiente para build otimizado
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Copiar apenas arquivos essenciais primeiro para melhorar cache
COPY next.config.js tsconfig.json jsconfig.json ./
COPY public ./public
COPY src ./src

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build com configurações de memória limitada e otimizações de performance
RUN NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build:fast -- --no-lint && \
    find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# Stage 3: Runtime ultra-leve com Alpine mínimo
FROM node:18-alpine AS runner
WORKDIR /app

# Instalar apenas o essencial para produção e limpar cache
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/* /tmp/*

# Configurações de segurança e performance
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256 --no-warnings --enable-source-maps=false"
ENV PORT=3000

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configurar usuário
USER nextjs

# Expor porta
EXPOSE 3000

# Health check otimizado
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1

# Comando otimizado para produção
CMD ["node", "server.js"]