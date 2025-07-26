#!/bin/bash
# ==============================================================================
# SCRIPT DE DEPLOY PARA PRODUÇÃO - ORACLE CLOUD
# ==============================================================================
# Script otimizado para deploy automatizado via GitHub Actions
# Analista DevOps Sênior - Automação e Observabilidade

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ==============================================================================
# CONFIGURAÇÕES E VARIÁVEIS
# ==============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Default values
DOCKER_IMAGE="${DOCKER_IMAGE:-ghcr.io/lucacg/portfolio-app:latest}"
APP_VERSION="${APP_VERSION:-$(date +%Y%m%d-%H%M%S)}"
ENVIRONMENT="${ENVIRONMENT:-production}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
GITHUB_ACTOR="${GITHUB_ACTOR:-}"
DEPLOY_DIR="${HOME}/portfolio-deployment"
BACKUP_DIR="${HOME}/portfolio-backups"
LOG_DIR="${HOME}/portfolio-logs"
MAX_RETRIES=3
HEALTH_CHECK_TIMEOUT=300  # 5 minutes
MONITORING_TIMEOUT=180    # 3 minutes

# ==============================================================================
# FUNÇÕES AUXILIARES
# ==============================================================================

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local url="$1"
    local timeout="$2"
    local service_name="$3"
    local counter=0
    
    log_info "Waiting for $service_name to be ready at $url..."
    
    while [ $counter -lt $timeout ]; do
        if curl -f -s "$url" >/dev/null 2>&1; then
            log_success "$service_name is ready!"
            return 0
        fi
        
        sleep 5
        counter=$((counter + 5))
        
        if [ $((counter % 30)) -eq 0 ]; then
            log_info "Still waiting for $service_name... ($counter/${timeout}s)"
        fi
    done
    
    log_error "$service_name failed to become ready within ${timeout}s"
    return 1
}

# Function to create backup
create_backup() {
    log_step "Creating backup of current deployment..."
    
    local backup_timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_path="$BACKUP_DIR/backup-$backup_timestamp"
    
    mkdir -p "$backup_path"
    
    # Backup docker-compose files
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        cp "$DEPLOY_DIR/docker-compose.yml" "$backup_path/"
    fi
    
    if [ -f "$DEPLOY_DIR/docker-compose.monitoring.yml" ]; then
        cp "$DEPLOY_DIR/docker-compose.monitoring.yml" "$backup_path/"
    fi
    
    # Backup environment file
    if [ -f "$DEPLOY_DIR/.env" ]; then
        cp "$DEPLOY_DIR/.env" "$backup_path/"
    fi
    
    # Backup monitoring configs
    if [ -d "$DEPLOY_DIR/monitoring" ]; then
        cp -r "$DEPLOY_DIR/monitoring" "$backup_path/"
    fi
    
    # Export current container images
    log_info "Backing up current container images..."
    docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | grep -E "(portfolio|nginx|prometheus|grafana)" > "$backup_path/images.txt" || true
    
    log_success "Backup created at $backup_path"
    
    # Cleanup old backups (keep last 5)
    log_info "Cleaning up old backups..."
    ls -t "$BACKUP_DIR" | tail -n +6 | xargs -r -I {} rm -rf "$BACKUP_DIR/{}"
}

# Function to rollback deployment
rollback_deployment() {
    log_error "Deployment failed! Initiating rollback..."
    
    local latest_backup=$(ls -t "$BACKUP_DIR" | head -n 1)
    
    if [ -n "$latest_backup" ] && [ -d "$BACKUP_DIR/$latest_backup" ]; then
        log_info "Rolling back to backup: $latest_backup"
        
        # Stop current containers
        docker-compose down --remove-orphans || true
        docker-compose -f docker-compose.monitoring.yml down --remove-orphans || true
        
        # Restore backup files
        cp -r "$BACKUP_DIR/$latest_backup/"* "$DEPLOY_DIR/"
        
        # Start previous version
        cd "$DEPLOY_DIR"
        docker-compose up -d
        
        log_warning "Rollback completed. Please check the application status."
    else
        log_error "No backup found for rollback!"
    fi
}

# Function to cleanup resources
cleanup_resources() {
    log_step "Cleaning up Docker resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    # Remove dangling containers
    docker container prune -f
    
    log_success "Docker cleanup completed"
}

# Function to check system resources
check_system_resources() {
    log_step "Checking system resources..."
    
    # Check disk space
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 85 ]; then
        log_warning "Disk usage is high: ${disk_usage}%"
        cleanup_resources
    else
        log_info "Disk usage: ${disk_usage}%"
    fi
    
    # Check memory
    local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    log_info "Memory usage: ${mem_usage}%"
    
    # Check load average
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    log_info "Load average: $load_avg"
}

# Function to update system packages
update_system() {
    log_step "Updating system packages..."
    
    sudo apt-get update -qq
    sudo apt-get upgrade -y -qq
    
    # Install/update essential packages
    sudo apt-get install -y -qq curl wget htop vim git jq
    
    log_success "System update completed"
}

# Function to setup monitoring
setup_monitoring() {
    log_step "Setting up monitoring stack..."
    
    # Ensure monitoring directories exist
    mkdir -p "$DEPLOY_DIR/monitoring/prometheus/data"
    mkdir -p "$DEPLOY_DIR/monitoring/grafana/data"
    mkdir -p "$DEPLOY_DIR/monitoring/alertmanager/data"
    
    # Set proper permissions
    sudo chown -R 472:472 "$DEPLOY_DIR/monitoring/grafana/data" || true
    sudo chown -R 65534:65534 "$DEPLOY_DIR/monitoring/prometheus/data" || true
    sudo chown -R 65534:65534 "$DEPLOY_DIR/monitoring/alertmanager/data" || true
    
    log_success "Monitoring setup completed"
}

# Function to configure firewall
configure_firewall() {
    log_step "Configuring firewall rules..."
    
    # Check if ufw is available
    if command_exists ufw; then
        # Allow SSH
        sudo ufw allow 22/tcp
        
        # Allow HTTP/HTTPS
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        
        # Allow monitoring ports (restrict to local network if needed)
        sudo ufw allow 3001/tcp  # Grafana
        sudo ufw allow 9090/tcp  # Prometheus
        sudo ufw allow 9093/tcp  # Alertmanager
        sudo ufw allow 9100/tcp  # Node Exporter
        
        # Enable firewall if not already enabled
        sudo ufw --force enable
        
        log_success "Firewall configured"
    else
        log_warning "UFW not available, skipping firewall configuration"
    fi
}

# ==============================================================================
# FUNÇÃO PRINCIPAL DE DEPLOY
# ==============================================================================

deploy_application() {
    log_step "🚀 Starting deployment process..."
    
    # Create necessary directories
    mkdir -p "$DEPLOY_DIR" "$BACKUP_DIR" "$LOG_DIR"
    cd "$DEPLOY_DIR"
    
    # Load environment variables if .env exists
    if [ -f ".env" ]; then
        log_info "Loading environment variables..."
        set -a  # automatically export all variables
        source .env
        set +a
    fi
    
    log_info "📦 Docker Image: $DOCKER_IMAGE"
    log_info "🏷️  App Version: $APP_VERSION"
    log_info "🌍 Environment: $ENVIRONMENT"
    
    # GitHub Container Registry login
    if [ -n "$GITHUB_TOKEN" ] && [ -n "$GITHUB_ACTOR" ]; then
        log_step "🔐 Logging into GitHub Container Registry..."
        echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
        log_success "Successfully logged into GitHub Container Registry"
    else
        log_warning "GitHub credentials not provided, skipping registry login"
    fi
    
    # Pull latest images with retry logic
    log_step "⬇️  Pulling latest Docker images..."
    local retry_count=0
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if docker-compose pull; then
            log_success "Images pulled successfully"
            break
        else
            retry_count=$((retry_count + 1))
            log_warning "Pull attempt $retry_count failed, retrying..."
            sleep 10
        fi
    done
    
    if [ $retry_count -eq $MAX_RETRIES ]; then
        log_error "Failed to pull images after $MAX_RETRIES attempts"
        return 1
    fi
    
    # Stop existing containers gracefully
    log_step "⏹️  Stopping existing containers..."
    docker-compose down --remove-orphans || true
    docker-compose -f docker-compose.monitoring.yml down --remove-orphans || true
    
    # Start application containers
    log_step "🏃 Starting application containers..."
    docker-compose up -d
    
    # Wait for application to be ready
    log_step "⏳ Waiting for application to be ready..."
    if wait_for_service "http://localhost:80" $HEALTH_CHECK_TIMEOUT "Application"; then
        log_success "✅ Application is healthy!"
    else
        # Try alternative health check
        if wait_for_service "http://localhost:3000" 60 "Application (port 3000)"; then
            log_success "✅ Application is healthy on port 3000!"
        else
            log_error "❌ Application health check failed!"
            rollback_deployment
            return 1
        fi
    fi
    
    # Start monitoring stack
    log_step "📊 Starting monitoring stack..."
    setup_monitoring
    docker-compose -f docker-compose.monitoring.yml up -d
    
    # Wait for monitoring services
    log_step "⏳ Waiting for monitoring services..."
    wait_for_service "http://localhost:3001" $MONITORING_TIMEOUT "Grafana" || log_warning "Grafana not ready"
    wait_for_service "http://localhost:9090" $MONITORING_TIMEOUT "Prometheus" || log_warning "Prometheus not ready"
    wait_for_service "http://localhost:9093" 60 "Alertmanager" || log_warning "Alertmanager not ready"
    
    # Show running containers
    log_step "📋 Currently running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Show system status
    log_step "📊 System status:"
    echo "=== Docker Stats ==="
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    echo "\n=== System Resources ==="
    free -h
    df -h /
    
    log_success "🎉 Deployment completed successfully!"
    
    # Display access URLs
    echo "\n=== 🔗 Access URLs ==="
    echo "Application: http://$(curl -s ifconfig.me):80"
    echo "Grafana: http://$(curl -s ifconfig.me):3001 (admin/admin)"
    echo "Prometheus: http://$(curl -s ifconfig.me):9090"
    echo "Alertmanager: http://$(curl -s ifconfig.me):9093"
}

# ==============================================================================
# FUNÇÃO DE VERIFICAÇÃO PÓS-DEPLOY
# ==============================================================================

post_deploy_verification() {
    log_step "🔍 Running post-deployment verification..."
    
    local verification_failed=false
    
    # Test application endpoints
    log_info "Testing application endpoints..."
    
    # Main application
    if curl -f -s http://localhost:80 >/dev/null; then
        log_success "✅ Main application is accessible"
    else
        log_error "❌ Main application is not accessible"
        verification_failed=true
    fi
    
    # Health endpoint
    if curl -f -s http://localhost:80/health >/dev/null; then
        log_success "✅ Health endpoint is working"
    else
        log_warning "⚠️  Health endpoint not available (may not be implemented)"
    fi
    
    # Monitoring services
    log_info "Testing monitoring services..."
    
    if curl -f -s http://localhost:3001 >/dev/null; then
        log_success "✅ Grafana is accessible"
    else
        log_warning "⚠️  Grafana is not accessible"
    fi
    
    if curl -f -s http://localhost:9090 >/dev/null; then
        log_success "✅ Prometheus is accessible"
    else
        log_warning "⚠️  Prometheus is not accessible"
    fi
    
    # Check container health
    log_info "Checking container health..."
    local unhealthy_containers=$(docker ps --filter "health=unhealthy" --format "{{.Names}}")
    if [ -n "$unhealthy_containers" ]; then
        log_error "❌ Unhealthy containers found: $unhealthy_containers"
        verification_failed=true
    else
        log_success "✅ All containers are healthy"
    fi
    
    # Performance test
    log_info "Running basic performance test..."
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:80)
    log_info "📊 Response time: ${response_time}s"
    
    if (( $(echo "$response_time < 5" | bc -l) )); then
        log_success "✅ Performance test passed"
    else
        log_warning "⚠️  Response time is high: ${response_time}s"
    fi
    
    if [ "$verification_failed" = true ]; then
        log_error "❌ Post-deployment verification failed!"
        return 1
    else
        log_success "✅ Post-deployment verification passed!"
        return 0
    fi
}

# ==============================================================================
# FUNÇÃO PRINCIPAL
# ==============================================================================

main() {
    echo "==============================================================================="
    echo "🚀 PORTFOLIO DEPLOYMENT SCRIPT - ORACLE CLOUD"
    echo "==============================================================================="
    echo "Analista DevOps Sênior - Automação e Observabilidade"
    echo "Started at: $(date)"
    echo "==============================================================================="
    
    # Trap to handle errors and cleanup
    trap 'log_error "Deployment failed at line $LINENO. Exit code: $?"; rollback_deployment; exit 1' ERR
    
    # Check prerequisites
    log_step "🔍 Checking prerequisites..."
    
    if ! command_exists docker; then
        log_error "Docker is not installed!"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        log_error "Docker Compose is not installed!"
        exit 1
    fi
    
    if ! command_exists curl; then
        log_error "curl is not installed!"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
    
    # Check system resources
    check_system_resources
    
    # Update system (optional)
    if [ "${UPDATE_SYSTEM:-false}" = "true" ]; then
        update_system
    fi
    
    # Configure firewall (optional)
    if [ "${CONFIGURE_FIREWALL:-false}" = "true" ]; then
        configure_firewall
    fi
    
    # Create backup
    create_backup
    
    # Deploy application
    if deploy_application; then
        log_success "🎉 Deployment successful!"
        
        # Run post-deployment verification
        if post_deploy_verification; then
            log_success "🎉 All verification checks passed!"
        else
            log_warning "⚠️  Some verification checks failed, but deployment is complete"
        fi
        
        # Cleanup resources
        cleanup_resources
        
        echo "\n==============================================================================="
        echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
        echo "==============================================================================="
        echo "Application URL: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
        echo "Grafana: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP'):3001"
        echo "Prometheus: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP'):9090"
        echo "==============================================================================="
        
    else
        log_error "❌ Deployment failed!"
        exit 1
    fi
}

# ==============================================================================
# EXECUÇÃO
# ==============================================================================

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi