#!/bin/bash
# SCRIPT DE BUILD COM CACHE EXTERNO - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Script otimizado para utilizar cache externo e reduzir o tempo de build
# Ideal para ambientes de CI/CD com suporte a cache persistente

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="portfolio"
TIMESTAMP=$(date +%s)
TAG="${TIMESTAMP}"
CACHE_DIR="/tmp/docker-cache"

echo -e "${BLUE}🚀 INICIANDO BUILD COM CACHE EXTERNO${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Image: ${IMAGE_NAME}:${TAG}"
echo -e "Timestamp: ${TIMESTAMP}"
echo -e "Cache Dir: ${CACHE_DIR}"
echo ""

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar se Docker está rodando
if ! docker info >/dev/null 2>&1; then
    error "Docker não está rodando ou não está acessível"
fi

# Habilitar BuildKit para builds otimizados
export DOCKER_BUILDKIT=1
export BUILDKIT_PROGRESS=plain

# Criar diretório de cache se não existir
log "📁 Configurando diretório de cache externo..."
mkdir -p "${CACHE_DIR}/node_modules"
mkdir -p "${CACHE_DIR}/npm"

# Otimizações específicas para CI/CD
log "⚙️ Aplicando otimizações para build com cache..."

# 1. Criar .npmrc otimizado
cat > .npmrc.cache << EOF
registry=https://registry.npmjs.org/
fetch-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-concurrency=8
cache-min=3600
prefer-offline=true
fund=false
audit=false
cache=${CACHE_DIR}/npm
EOF

# 2. Criar Dockerfile otimizado para cache externo
log "📝 Criando Dockerfile otimizado para cache externo..."
cat > Dockerfile.cache << EOF
# Stage 1: Dependências com cache externo
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat curl && rm -rf /var/cache/apk/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json .npmrc.cache ./
RUN mv .npmrc.cache .npmrc

# Montar cache externo
VOLUME ["${CACHE_DIR}/node_modules", "${CACHE_DIR}/npm"]

# Instalar dependências com cache
RUN npm ci --omit=dev --prefer-offline --no-progress --legacy-peer-deps

# Stage 2: Build otimizado
FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Copiar apenas arquivos essenciais primeiro
COPY next.config.js tsconfig.json jsconfig.json ./
COPY public ./public
COPY src ./src

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build com otimizações
RUN npm run build:fast -- --no-lint && find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# Stage 3: Runtime ultra-leve
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl && rm -rf /var/cache/apk/*
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
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1
CMD ["node", "server.js"]
EOF

# 3. Executar build com cache externo
log "🔨 Iniciando build com cache externo..."
docker build -f Dockerfile.cache -t ${IMAGE_NAME}:${TAG} \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from ${IMAGE_NAME}:latest \
  --progress=plain \
  --mount=type=bind,source=${CACHE_DIR}/node_modules,target=/app/node_modules \
  --mount=type=bind,source=${CACHE_DIR}/npm,target=/root/.npm \
  .

log "✅ Build concluído com sucesso: ${IMAGE_NAME}:${TAG}"

# Limpar arquivos temporários
log "🧹 Limpando arquivos temporários..."
rm -f .npmrc.cache Dockerfile.cache

echo -e "${GREEN}✅ BUILD COM CACHE CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}Imagem: ${IMAGE_NAME}:${TAG}${NC}"