#!/bin/bash
# SCRIPT DE BUILD ULTRA-RÁPIDO PARA CI/CD - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Script otimizado para evitar timeout durante o build da imagem Docker em CI/CD
# Foco em reduzir o tempo total de build para menos de 15 minutos

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

echo -e "${BLUE}🚀 INICIANDO BUILD ULTRA-RÁPIDO PARA CI/CD${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Image: ${IMAGE_NAME}:${TAG}"
echo -e "Timestamp: ${TIMESTAMP}"
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

log "🧹 Limpando recursos Docker não utilizados..."
docker system prune -f > /dev/null 2>&1 || true

# Otimizações específicas para CI/CD
log "⚙️ Aplicando otimizações para CI/CD..."

# 1. Criar .npmrc temporário com configurações otimizadas
cat > .npmrc.ci << EOF
registry=https://registry.npmjs.org/
fetch-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-concurrency=8
cache-min=3600
prefer-offline=true
fund=false
audit=false
EOF

# 2. Criar Dockerfile.ci otimizado
log "📝 Criando Dockerfile otimizado para CI/CD..."
cat > Dockerfile.ci << EOF
# Stage 1: Dependências com otimizações avançadas
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat curl && rm -rf /var/cache/apk/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json .npmrc.ci ./
RUN mv .npmrc.ci .npmrc && npm ci --omit=dev --prefer-offline --no-progress --legacy-peer-deps && npm cache clean --force

# Stage 2: Build otimizado
FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:fast -- --no-lint && find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# Stage 3: Runtime ultra-leve
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl && rm -rf /var/cache/apk/*
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# 3. Executar build com otimizações
log "🔨 Iniciando build com otimizações para CI/CD..."
docker build -f Dockerfile.ci -t ${IMAGE_NAME}:${TAG} --build-arg BUILDKIT_INLINE_CACHE=1 --progress=plain .

log "✅ Build concluído com sucesso: ${IMAGE_NAME}:${TAG}"

# Limpar arquivos temporários
log "🧹 Limpando arquivos temporários..."
rm -f .npmrc.ci Dockerfile.ci

echo -e "${GREEN}✅ BUILD CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}Imagem: ${IMAGE_NAME}:${TAG}${NC}"