#!/bin/bash

# ==============================================================================
# SCRIPT DE DEPLOY ULTRA-OTIMIZADO - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Deploy automatizado para Oracle Cloud com limitações de recursos
# Compatível com Always Free Tier

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==============================================================================
# CONFIGURAÇÕES INICIAIS
# ==============================================================================

log "🚀 Iniciando deploy otimizado para Oracle Cloud"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute o script no diretório do projeto."
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    log_error "Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# ==============================================================================
# LIMPEZA E PREPARAÇÃO
# ==============================================================================

log "🧹 Limpando ambiente..."

# Parar containers existentes
docker-compose down --remove-orphans 2>/dev/null || true

# Remover imagens antigas para economizar espaço
docker image prune -f
docker container prune -f

# Limpar cache do npm
npm cache clean --force

# Limpar diretórios de build
rm -rf .next
rm -rf node_modules/.cache
rm -rf nginx-cache

log_success "Ambiente limpo com sucesso"

# ==============================================================================
# CONFIGURAÇÕES DE AMBIENTE PARA PRODUÇÃO
# ==============================================================================

log "⚙️ Configurando ambiente de produção..."

# Criar arquivo .env.production se não existir
if [ ! -f ".env.production" ]; then
    cat > .env.production << EOF
# Configurações otimizadas para Oracle Cloud
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max-old-space-size=256
PORT=3000
HOSTNAME=0.0.0.0

# Build ID único para cache busting
NEXT_PUBLIC_BUILD_ID=build-$(date +%s)
EOF
    log_success "Arquivo .env.production criado"
fi

# Criar diretório de cache do Nginx
mkdir -p nginx-cache
chmod 755 nginx-cache

log_success "Configurações aplicadas"

# ==============================================================================
# BUILD OTIMIZADO
# ==============================================================================

log "🔨 Iniciando build otimizado..."

# Configurar variáveis de ambiente para build
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=512"

# Build com Docker Compose
log "Construindo imagens Docker..."
docker-compose build --no-cache --parallel

log_success "Build concluído com sucesso"

# ==============================================================================
# VERIFICAÇÕES DE SEGURANÇA
# ==============================================================================

log "🔒 Executando verificações de segurança..."

# Verificar se há vulnerabilidades críticas
if command -v npm &> /dev/null; then
    npm audit --audit-level=critical --production || log_warning "Vulnerabilidades encontradas, mas continuando..."
fi

# Verificar configurações do Docker
if docker-compose config > /dev/null 2>&1; then
    log_success "Configuração do Docker Compose válida"
else
    log_error "Configuração do Docker Compose inválida"
    exit 1
fi

log_success "Verificações de segurança concluídas"

# ==============================================================================
# DEPLOY COM LIMITAÇÕES DE RECURSOS
# ==============================================================================

log "🚀 Iniciando deploy com limitações de recursos..."

# Iniciar serviços com configurações otimizadas
docker-compose up -d

# Aguardar serviços ficarem saudáveis
log "⏳ Aguardando serviços ficarem saudáveis..."
sleep 30

# Verificar health checks
max_attempts=12
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose ps | grep -q "healthy"; then
        log_success "Serviços estão saudáveis"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        log_error "Serviços não ficaram saudáveis após $max_attempts tentativas"
        docker-compose logs
        exit 1
    fi
    
    log "Tentativa $attempt/$max_attempts - Aguardando health check..."
    sleep 10
    ((attempt++))
done

# ==============================================================================
# VERIFICAÇÕES PÓS-DEPLOY
# ==============================================================================

log "✅ Executando verificações pós-deploy..."

# Verificar se aplicação está respondendo
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "Aplicação está respondendo na porta 3000"
else
    log_error "Aplicação não está respondendo na porta 3000"
    docker-compose logs app
    exit 1
fi

# Verificar se Nginx está funcionando
if curl -f http://localhost:80 > /dev/null 2>&1; then
    log_success "Nginx está funcionando na porta 80"
else
    log_warning "Nginx não está respondendo na porta 80"
fi

# Mostrar uso de recursos
log "📊 Uso de recursos dos containers:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# ==============================================================================
# CONFIGURAÇÕES DE MONITORAMENTO
# ==============================================================================

log "📈 Configurando monitoramento básico..."

# Criar script de monitoramento simples
cat > monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoramento básico
echo "=== Status dos Containers ==="
docker-compose ps

echo "\n=== Uso de Recursos ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo "\n=== Logs Recentes ==="
docker-compose logs --tail=10

echo "\n=== Health Check ==="
curl -s http://localhost:3000 > /dev/null && echo "App: OK" || echo "App: FAIL"
curl -s http://localhost:80 > /dev/null && echo "Nginx: OK" || echo "Nginx: FAIL"
EOF

chmod +x monitor.sh

log_success "Script de monitoramento criado: ./monitor.sh"

# ==============================================================================
# FINALIZAÇÃO
# ==============================================================================

log_success "🎉 Deploy concluído com sucesso!"
echo ""
echo "📋 Resumo do Deploy:"
echo "   • Aplicação: http://localhost:3000"
echo "   • Nginx: http://localhost:80"
echo "   • Monitoramento: ./monitor.sh"
echo "   • Logs: docker-compose logs -f"
echo ""
echo "🔧 Comandos úteis:"
echo "   • Parar: docker-compose down"
echo "   • Reiniciar: docker-compose restart"
echo "   • Logs: docker-compose logs -f [service]"
echo "   • Status: docker-compose ps"
echo ""
log "✨ Deploy otimizado para Oracle Cloud concluído!"