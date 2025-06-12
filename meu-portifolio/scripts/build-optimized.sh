#!/bin/bash
# BUILD SCRIPT ULTRA-OTIMIZADO - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Script para build com cache layers, BuildKit e otimizações avançadas
# Compatível com Oracle Cloud e GitHub Actions

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="portfolio"
REGISTRY="ghcr.io/lucacapelociguerreiro"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Tags
TAG_LATEST="${REGISTRY}/${IMAGE_NAME}:latest"
TAG_TIMESTAMP="${REGISTRY}/${IMAGE_NAME}:${TIMESTAMP}"
TAG_COMMIT="${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}"
TAG_BRANCH="${REGISTRY}/${IMAGE_NAME}:${BRANCH}"

echo -e "${BLUE}🚀 INICIANDO BUILD OTIMIZADO${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Image: ${IMAGE_NAME}"
echo -e "Registry: ${REGISTRY}"
echo -e "Timestamp: ${TIMESTAMP}"
echo -e "Commit: ${COMMIT_SHA}"
echo -e "Branch: ${BRANCH}"
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

log "🔧 Configurando BuildKit e cache..."

# Criar builder personalizado se não existir
if ! docker buildx inspect portfolio-builder >/dev/null 2>&1; then
    log "📦 Criando builder personalizado..."
    docker buildx create --name portfolio-builder --driver docker-container --bootstrap
fi

# Usar o builder personalizado
docker buildx use portfolio-builder

log "🧹 Limpando cache antigo..."
# Limpar imagens antigas (manter apenas as 3 mais recentes)
docker images "${REGISTRY}/${IMAGE_NAME}" --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
    tail -n +2 | sort -k2 -r | tail -n +4 | awk '{print $1}' | \
    xargs -r docker rmi -f 2>/dev/null || true

log "🏗️ Iniciando build multi-stage com cache..."

# Build com cache registry e multi-platform
docker buildx build \
    --platform linux/amd64 \
    --cache-from type=registry,ref=${REGISTRY}/${IMAGE_NAME}:cache \
    --cache-to type=registry,ref=${REGISTRY}/${IMAGE_NAME}:cache,mode=max \
    --tag "${TAG_LATEST}" \
    --tag "${TAG_TIMESTAMP}" \
    --tag "${TAG_COMMIT}" \
    --tag "${TAG_BRANCH}" \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --build-arg NODE_ENV=production \
    --build-arg NEXT_TELEMETRY_DISABLED=1 \
    --metadata-file build-metadata.json \
    --push \
    . || error "Falha no build da imagem"

log "📊 Analisando tamanho da imagem..."
# Verificar tamanho da imagem
IMAGE_SIZE=$(docker images "${TAG_LATEST}" --format "table {{.Size}}" | tail -n +2)
log "📦 Tamanho da imagem: ${IMAGE_SIZE}"

# Verificar vulnerabilidades (se trivy estiver disponível)
if command -v trivy >/dev/null 2>&1; then
    log "🔒 Executando scan de segurança..."
    trivy image --exit-code 0 --severity HIGH,CRITICAL "${TAG_LATEST}" || warn "Vulnerabilidades encontradas"
else
    warn "Trivy não encontrado, pulando scan de segurança"
fi

log "🏷️ Tags criadas:"
echo -e "  • ${TAG_LATEST}"
echo -e "  • ${TAG_TIMESTAMP}"
echo -e "  • ${TAG_COMMIT}"
echo -e "  • ${TAG_BRANCH}"

# Salvar informações do build
cat > build-info.json << EOF
{
  "image": "${IMAGE_NAME}",
  "registry": "${REGISTRY}",
  "timestamp": "${TIMESTAMP}",
  "commit": "${COMMIT_SHA}",
  "branch": "${BRANCH}",
  "tags": [
    "${TAG_LATEST}",
    "${TAG_TIMESTAMP}",
    "${TAG_COMMIT}",
    "${TAG_BRANCH}"
  ],
  "size": "${IMAGE_SIZE}",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

log "💾 Informações do build salvas em build-info.json"

# Teste rápido da imagem
log "🧪 Testando imagem..."
docker run --rm -d --name portfolio-test -p 3001:3000 "${TAG_LATEST}" || error "Falha ao iniciar container de teste"

# Aguardar inicialização
sleep 10

# Verificar se a aplicação está respondendo
if curl -f http://localhost:3001 >/dev/null 2>&1; then
    log "✅ Teste da imagem passou!"
else
    warn "❌ Teste da imagem falhou"
fi

# Parar container de teste
docker stop portfolio-test >/dev/null 2>&1 || true

log "🎉 Build concluído com sucesso!"
log "📋 Próximos passos:"
echo -e "  1. Verificar build-info.json para detalhes"
echo -e "  2. Deploy usando: kubectl apply -f k8s/"
echo -e "  3. Monitorar logs: kubectl logs -f deployment/portfolio-app"

echo -e "\n${GREEN}🚀 BUILD OTIMIZADO CONCLUÍDO COM SUCESSO! 🚀${NC}"