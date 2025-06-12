# 🚀 Pipeline CI/CD - Portfolio Oracle Cloud

## 📋 Visão Geral

Este projeto implementa um pipeline CI/CD completo para deploy automatizado de um portfólio Next.js na Oracle Cloud, seguindo as melhores práticas de DevOps e observabilidade.

### 🏗️ Arquitetura da Solução

```mermaid
graph TB
    A[GitHub Repository] --> B[GitHub Actions]
    B --> C[Build & Test]
    C --> D[Security Scan]
    D --> E[Docker Build]
    E --> F[Push to GHCR]
    F --> G[Deploy to Oracle Cloud]
    G --> H[Health Check]
    H --> I[Monitoring Setup]
    
    subgraph "Oracle Cloud Instance"
        J[Next.js App]
        K[Nginx Proxy]
        L[Prometheus]
        M[Grafana]
        N[Alertmanager]
        O[Node Exporter]
    end
    
    G --> J
    I --> L
    I --> M
    I --> N
    I --> O
```

## 🛠️ Tecnologias Utilizadas

### **DevOps & CI/CD**
- **GitHub Actions** - Pipeline de CI/CD
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **GitHub Container Registry (GHCR)** - Registry de imagens

### **Infraestrutura**
- **Oracle Cloud Infrastructure (OCI)** - Compute Instance
- **Nginx** - Reverse Proxy e Load Balancer
- **Ubuntu 22.04** - Sistema Operacional

### **Monitoramento & Observabilidade**
- **Prometheus** - Coleta de métricas
- **Grafana** - Dashboards e visualização
- **Alertmanager** - Gerenciamento de alertas
- **Node Exporter** - Métricas do sistema
- **cAdvisor** - Métricas de containers

### **Segurança**
- **Trivy** - Scanner de vulnerabilidades
- **GitHub Advanced Security** - SAST
- **Fail2ban** - Proteção contra ataques
- **UFW Firewall** - Controle de acesso

## 🚀 Configuração Inicial

### 1. **Preparação do Servidor Oracle Cloud**

#### Requisitos Mínimos:
- **Shape**: VM.Standard.E2.1.Micro (Always Free)
- **OS**: Ubuntu 22.04 LTS
- **vCPUs**: 1
- **RAM**: 1GB
- **Storage**: 47GB Boot Volume

#### Configuração de Rede:
```bash
# Portas que devem estar abertas no Security List
22   - SSH
80   - HTTP
443  - HTTPS
3000 - Next.js (desenvolvimento)
3001 - Grafana
9090 - Prometheus
9093 - Alertmanager
9100 - Node Exporter
```

### 2. **Configuração do GitHub**

#### Secrets Necessários:
Acesse `Settings > Secrets and variables > Actions` e adicione:

```bash
# Servidor Oracle Cloud
ORACLE_HOST=your-server-ip
ORACLE_USER=ubuntu
ORACLE_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# GitHub Container Registry
GHCR_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GHCR_USERNAME=your-github-username

# Monitoramento (Opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SMTP_PASSWORD=your-email-app-password
ALERT_EMAIL=admin@yourdomain.com
```

#### Variáveis de Ambiente:
Acesse `Settings > Secrets and variables > Actions > Variables`:

```bash
APP_NAME=portfolio-app
ENVIRONMENT=production
DOCKER_REGISTRY=ghcr.io
DOCKER_NAMESPACE=your-username
```

### 3. **Preparação do Servidor**

#### Conecte-se ao servidor:
```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

#### Execute o script de preparação:
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configurar firewall
sudo ufw allow 22,80,443,3000,3001,9090,9093,9100/tcp
sudo ufw --force enable

# Criar diretórios
mkdir -p ~/portfolio-deployment
mkdir -p ~/portfolio-backups
mkdir -p ~/portfolio-logs
```

## 📦 Estrutura do Projeto

```
.
├── .github/
│   └── workflows/
│       └── deploy-oracle.yml          # Pipeline CI/CD
├── scripts/
│   └── deploy-production.sh           # Script de deploy
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml             # Config Prometheus
│   │   └── rules/
│   │       └── alerts.yml             # Regras de alerta
│   └── alertmanager/
│       └── alertmanager.yml           # Config Alertmanager
├── docker-compose.yml                 # App principal
├── docker-compose.monitoring.yml      # Stack de monitoramento
├── Dockerfile                         # Imagem da aplicação
├── nginx.conf                         # Configuração Nginx
├── .env.production                    # Variáveis de ambiente
└── README-DEPLOY.md                   # Este arquivo
```

## 🔄 Pipeline CI/CD

### **Trigger**: Push para branch `main`

### **Stages**:

#### 1. **Build & Test** 🏗️
```yaml
- Checkout do código
- Setup Node.js 18
- Cache de dependências
- Instalação de dependências
- Build da aplicação
- Testes unitários
- Testes de integração
```

#### 2. **Security Analysis** 🔒
```yaml
- SAST com CodeQL
- Dependency Check
- Vulnerability Scanning
- License Compliance
```

#### 3. **Docker Build & Push** 🐳
```yaml
- Build da imagem Docker
- Scan de vulnerabilidades com Trivy
- Tag com SHA do commit
- Push para GitHub Container Registry
```

#### 4. **Deploy** 🚀
```yaml
- Conexão SSH ao servidor
- Download dos arquivos de configuração
- Execução do script de deploy
- Health check da aplicação
- Verificação dos serviços
```

#### 5. **Post-Deploy** ✅
```yaml
- Testes de smoke
- Verificação de monitoramento
- Notificações
- Cleanup de recursos
```

## 📊 Monitoramento

### **Prometheus Metrics**
- **Sistema**: CPU, Memória, Disco, Rede
- **Aplicação**: Response time, Error rate, Throughput
- **Docker**: Container stats, Resource usage
- **Nginx**: Request metrics, Status codes

### **Grafana Dashboards**
- **System Overview**: Métricas gerais do servidor
- **Application Performance**: Performance da aplicação
- **Docker Monitoring**: Status dos containers
- **Nginx Analytics**: Análise do proxy

### **Alertas Configurados**
```yaml
Críticos:
- Instance Down
- High CPU (>90%)
- High Memory (>90%)
- Disk Full (>95%)
- Application Down

Warnings:
- High CPU (>80%)
- High Memory (>80%)
- High Response Time (>2s)
- SSL Certificate Expiring
```

## 🔧 Comandos Úteis

### **Deploy Manual**
```bash
# No servidor
cd ~/portfolio-deployment
./deploy-production.sh
```

### **Verificar Status**
```bash
# Containers
docker ps
docker-compose ps

# Logs
docker-compose logs -f
docker logs portfolio-app

# Recursos
docker stats
htop
df -h
```

### **Backup Manual**
```bash
# Criar backup
cd ~/portfolio-deployment
docker-compose exec app npm run backup

# Restaurar backup
docker-compose exec app npm run restore backup-20240101-120000
```

### **Troubleshooting**
```bash
# Reiniciar serviços
docker-compose restart

# Rebuild completo
docker-compose down
docker-compose up -d --build

# Limpar recursos
docker system prune -f
docker volume prune -f
```

## 🔐 Segurança

### **Práticas Implementadas**
- ✅ Secrets management via GitHub Secrets
- ✅ Container vulnerability scanning
- ✅ Dependency vulnerability checking
- ✅ Firewall configuration
- ✅ Fail2ban protection
- ✅ Non-root container execution
- ✅ Security headers no Nginx
- ✅ Rate limiting

### **Configurações de Segurança**
```bash
# Firewall
sudo ufw status

# Fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd

# SSL (quando configurado)
sudo certbot certificates
```

## 📈 Performance

### **Otimizações Implementadas**
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Image optimization
- ✅ Bundle optimization
- ✅ CDN ready
- ✅ Resource limits
- ✅ Connection pooling

### **Métricas de Performance**
- **Response Time**: < 2s (target)
- **Availability**: > 99.5%
- **Error Rate**: < 1%
- **Resource Usage**: < 80% (CPU/Memory)

## 🚨 Alertas e Notificações

### **Canais de Notificação**
- 📧 **Email**: Alertas críticos
- 💬 **Slack**: Todos os alertas
- 📱 **GitHub**: Status do pipeline

### **Configuração de Alertas**
```yaml
# Email
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@gmail.com
SMTP_PASSWORD: app-password

# Slack
SLACK_WEBHOOK_URL: https://hooks.slack.com/...
SLACK_CHANNEL: #alerts
```

## 🔄 Rollback

### **Rollback Automático**
O pipeline inclui rollback automático em caso de falha:
```bash
# Triggers de rollback
- Health check failure
- Deployment timeout
- Critical alerts
```

### **Rollback Manual**
```bash
# Via GitHub Actions
# Re-run previous successful deployment

# Via servidor
cd ~/portfolio-deployment
./deploy-production.sh rollback
```

## 📚 Recursos Adicionais

### **URLs de Acesso**
- **Aplicação**: `http://your-server-ip`
- **Grafana**: `http://your-server-ip:3001` (admin/admin123!@#)
- **Prometheus**: `http://your-server-ip:9090`
- **Alertmanager**: `http://your-server-ip:9093`

### **Documentação**
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Compose](https://docs.docker.com/compose/)
- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)
- [Oracle Cloud](https://docs.oracle.com/en-us/iaas/)

### **Suporte**
- 📧 Email: admin@yourportfolio.com
- 💬 Slack: #devops-support
- 🐛 Issues: GitHub Issues

---

## 🎯 Próximos Passos

### **Melhorias Planejadas**
- [ ] SSL/TLS com Let's Encrypt
- [ ] CDN integration
- [ ] Database backup automation
- [ ] Multi-environment support
- [ ] Blue-Green deployment
- [ ] Kubernetes migration
- [ ] Advanced monitoring
- [ ] Cost optimization

### **Contribuição**
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido por**: Analista DevOps Sênior  
**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  

🚀 **Happy Deploying!** 🚀