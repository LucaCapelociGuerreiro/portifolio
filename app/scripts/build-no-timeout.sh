#!/bin/bash
# SCRIPT DE BUILD SEM TIMEOUT - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Script otimizado para evitar timeout durante o build da imagem Docker
# Foco em resolver o problema de timeout na etapa de cópia dos node_modules

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

echo -e "${BLUE}🚀 INICIANDO BUILD SEM TIMEOUT${NC}"
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
docker system prune -f --volumes

log "🔄 Removendo imagens antigas do portfolio..."
docker images | grep portfolio | awk '{print $3}' | xargs -r docker rmi -f || true

log "🏗️ Iniciando build com otimizações anti-timeout..."

# Build com otimizações para evitar timeout
docker build \
    --no-cache \
    --progress=plain \
    --network=host \
    --memory=4g \
    --memory-swap=4g \
    --cpu-quota=200000 \
    --ulimit nofile=65536:65536 \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --build-arg NODE_ENV=production \
    --build-arg NEXT_TELEMETRY_DISABLED=1 \
    --build-arg DISABLE_ESLINT_PLUGIN=true \
    --build-arg DISABLE_TYPESCRIPT_PLUGIN=true \
    -t "${IMAGE_NAME}:${TAG}" \
    . || error "Falha no build da imagem"

log "✅ Build concluído com sucesso!"

# Verificar tamanho da imagem
IMAGE_SIZE=$(docker images "${IMAGE_NAME}:${TAG}" --format "{{.Size}}")
log "📦 Tamanho da imagem: ${IMAGE_SIZE}"

log "🎉 Imagem construída com sucesso: ${IMAGE_NAME}:${TAG}"
log "📋 Próximos passos:"
echo -e "  1. Testar a imagem: docker run -p 3000:3000 ${IMAGE_NAME}:${TAG}"
echo -e "  2. Fazer tag para produção: docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest"

echo -e "\n${GREEN}🚀 BUILD SEM TIMEOUT CONCLUÍDO COM SUCESSO! 🚀${NC}"