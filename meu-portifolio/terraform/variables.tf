# ==============================================================================
# TERRAFORM VARIABLES - ORACLE CLOUD INFRASTRUCTURE
# ==============================================================================
# Variáveis para configuração da infraestrutura Oracle Cloud
# Analista DevOps Sênior - Infraestrutura como Código

# ==============================================================================
# ORACLE CLOUD CREDENTIALS
# ==============================================================================

variable "tenancy_ocid" {
  description = "OCID do tenancy Oracle Cloud"
  type        = string
  sensitive   = true
}

variable "user_ocid" {
  description = "OCID do usuário Oracle Cloud"
  type        = string
  sensitive   = true
}

variable "fingerprint" {
  description = "Fingerprint da chave API Oracle Cloud"
  type        = string
  sensitive   = true
}

variable "private_key_path" {
  description = "Caminho para a chave privada Oracle Cloud"
  type        = string
  sensitive   = true
}

variable "compartment_ocid" {
  description = "OCID do compartment Oracle Cloud"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Região Oracle Cloud"
  type        = string
  default     = "us-ashburn-1"
  
  validation {
    condition = contains([
      "us-ashburn-1",
      "us-phoenix-1",
      "eu-frankfurt-1",
      "uk-london-1",
      "ap-tokyo-1",
      "ap-seoul-1",
      "ap-mumbai-1",
      "sa-saopaulo-1",
      "ca-toronto-1",
      "eu-amsterdam-1"
    ], var.region)
    error_message = "Região deve ser uma região válida da Oracle Cloud."
  }
}

# ==============================================================================
# ENVIRONMENT CONFIGURATION
# ==============================================================================

variable "environment" {
  description = "Ambiente de deployment (dev, staging, production)"
  type        = string
  default     = "production"
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment deve ser dev, staging ou production."
  }
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "portfolio"
  
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Nome do projeto deve conter apenas letras minúsculas, números e hífens."
  }
}

variable "owner" {
  description = "Proprietário dos recursos"
  type        = string
  default     = "devops-team"
}

# ==============================================================================
# COMPUTE CONFIGURATION
# ==============================================================================

variable "instance_shape" {
  description = "Shape da instância Oracle Cloud"
  type        = string
  default     = "VM.Standard.E2.1.Micro"
  
  validation {
    condition = contains([
      "VM.Standard.E2.1.Micro",
      "VM.Standard.A1.Flex",
      "VM.Standard.E3.Flex",
      "VM.Standard.E4.Flex"
    ], var.instance_shape)
    error_message = "Shape deve ser um shape válido da Oracle Cloud."
  }
}

variable "instance_ocpus" {
  description = "Número de OCPUs para a instância"
  type        = number
  default     = 1
  
  validation {
    condition     = var.instance_ocpus >= 1 && var.instance_ocpus <= 4
    error_message = "OCPUs deve estar entre 1 e 4 para Always Free Tier."
  }
}

variable "instance_memory_gb" {
  description = "Memória em GB para a instância"
  type        = number
  default     = 1
  
  validation {
    condition     = var.instance_memory_gb >= 1 && var.instance_memory_gb <= 24
    error_message = "Memória deve estar entre 1 e 24 GB para Always Free Tier."
  }
}

variable "boot_volume_size_gb" {
  description = "Tamanho do volume de boot em GB"
  type        = number
  default     = 47
  
  validation {
    condition     = var.boot_volume_size_gb >= 47 && var.boot_volume_size_gb <= 200
    error_message = "Volume de boot deve estar entre 47 e 200 GB."
  }
}

# ==============================================================================
# NETWORK CONFIGURATION
# ==============================================================================

variable "vcn_cidr" {
  description = "CIDR block para a VCN"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vcn_cidr, 0))
    error_message = "VCN CIDR deve ser um bloco CIDR válido."
  }
}

variable "subnet_cidr" {
  description = "CIDR block para a subnet"
  type        = string
  default     = "10.0.1.0/24"
  
  validation {
    condition     = can(cidrhost(var.subnet_cidr, 0))
    error_message = "Subnet CIDR deve ser um bloco CIDR válido."
  }
}

variable "allowed_ssh_cidrs" {
  description = "Lista de CIDRs permitidos para acesso SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_http_cidrs" {
  description = "Lista de CIDRs permitidos para acesso HTTP/HTTPS"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# ==============================================================================
# APPLICATION CONFIGURATION
# ==============================================================================

variable "app_port" {
  description = "Porta da aplicação"
  type        = number
  default     = 3000
  
  validation {
    condition     = var.app_port >= 1024 && var.app_port <= 65535
    error_message = "Porta da aplicação deve estar entre 1024 e 65535."
  }
}

variable "nginx_port" {
  description = "Porta do Nginx"
  type        = number
  default     = 80
  
  validation {
    condition     = var.nginx_port >= 80 && var.nginx_port <= 65535
    error_message = "Porta do Nginx deve estar entre 80 e 65535."
  }
}

variable "ssl_port" {
  description = "Porta SSL/HTTPS"
  type        = number
  default     = 443
  
  validation {
    condition     = var.ssl_port >= 443 && var.ssl_port <= 65535
    error_message = "Porta SSL deve estar entre 443 e 65535."
  }
}

# ==============================================================================
# MONITORING CONFIGURATION
# ==============================================================================

variable "enable_monitoring" {
  description = "Habilitar monitoramento com Prometheus e Grafana"
  type        = bool
  default     = true
}

variable "prometheus_port" {
  description = "Porta do Prometheus"
  type        = number
  default     = 9090
  
  validation {
    condition     = var.prometheus_port >= 1024 && var.prometheus_port <= 65535
    error_message = "Porta do Prometheus deve estar entre 1024 e 65535."
  }
}

variable "grafana_port" {
  description = "Porta do Grafana"
  type        = number
  default     = 3001
  
  validation {
    condition     = var.grafana_port >= 1024 && var.grafana_port <= 65535
    error_message = "Porta do Grafana deve estar entre 1024 e 65535."
  }
}

variable "node_exporter_port" {
  description = "Porta do Node Exporter"
  type        = number
  default     = 9100
  
  validation {
    condition     = var.node_exporter_port >= 1024 && var.node_exporter_port <= 65535
    error_message = "Porta do Node Exporter deve estar entre 1024 e 65535."
  }
}

# ==============================================================================
# STORAGE CONFIGURATION
# ==============================================================================

variable "create_block_volume" {
  description = "Criar volume de bloco adicional para dados"
  type        = bool
  default     = false
}

variable "block_volume_size_gb" {
  description = "Tamanho do volume de bloco em GB"
  type        = number
  default     = 50
  
  validation {
    condition     = var.block_volume_size_gb >= 50 && var.block_volume_size_gb <= 32768
    error_message = "Volume de bloco deve estar entre 50 e 32768 GB."
  }
}

variable "backup_retention_days" {
  description = "Dias de retenção para backups"
  type        = number
  default     = 7
  
  validation {
    condition     = var.backup_retention_days >= 1 && var.backup_retention_days <= 365
    error_message = "Retenção de backup deve estar entre 1 e 365 dias."
  }
}

# ==============================================================================
# LOAD BALANCER CONFIGURATION
# ==============================================================================

variable "create_load_balancer" {
  description = "Criar Load Balancer para alta disponibilidade"
  type        = bool
  default     = false
}

variable "lb_shape" {
  description = "Shape do Load Balancer"
  type        = string
  default     = "flexible"
  
  validation {
    condition     = contains(["flexible", "100Mbps", "400Mbps", "8000Mbps"], var.lb_shape)
    error_message = "Shape do LB deve ser flexible, 100Mbps, 400Mbps ou 8000Mbps."
  }
}

variable "lb_min_bandwidth_mbps" {
  description = "Largura de banda mínima do Load Balancer em Mbps"
  type        = number
  default     = 10
  
  validation {
    condition     = var.lb_min_bandwidth_mbps >= 10 && var.lb_min_bandwidth_mbps <= 8000
    error_message = "Largura de banda mínima deve estar entre 10 e 8000 Mbps."
  }
}

variable "lb_max_bandwidth_mbps" {
  description = "Largura de banda máxima do Load Balancer em Mbps"
  type        = number
  default     = 10
  
  validation {
    condition     = var.lb_max_bandwidth_mbps >= 10 && var.lb_max_bandwidth_mbps <= 8000
    error_message = "Largura de banda máxima deve estar entre 10 e 8000 Mbps."
  }
}

# ==============================================================================
# SECURITY CONFIGURATION
# ==============================================================================

variable "enable_waf" {
  description = "Habilitar Web Application Firewall"
  type        = bool
  default     = false
}

variable "enable_ddos_protection" {
  description = "Habilitar proteção DDoS"
  type        = bool
  default     = true
}

variable "ssh_public_key" {
  description = "Chave SSH pública para acesso à instância (opcional)"
  type        = string
  default     = ""
}

variable "enable_os_management" {
  description = "Habilitar gerenciamento automático do OS"
  type        = bool
  default     = true
}

# ==============================================================================
# TAGS CONFIGURATION
# ==============================================================================

variable "common_tags" {
  description = "Tags comuns para todos os recursos"
  type        = map(string)
  default = {
    "ManagedBy"   = "Terraform"
    "Project"     = "Portfolio"
    "Environment" = "production"
    "Owner"       = "DevOps-Team"
    "CostCenter"  = "Engineering"
  }
}

variable "additional_tags" {
  description = "Tags adicionais específicas do ambiente"
  type        = map(string)
  default     = {}
}

# ==============================================================================
# BACKUP CONFIGURATION
# ==============================================================================

variable "enable_automatic_backups" {
  description = "Habilitar backups automáticos"
  type        = bool
  default     = true
}

variable "backup_schedule" {
  description = "Cronograma de backup (cron format)"
  type        = string
  default     = "0 2 * * *" # Diário às 2h da manhã
  
  validation {
    condition     = can(regex("^[0-9*,-/]+ [0-9*,-/]+ [0-9*,-/]+ [0-9*,-/]+ [0-9*,-/]+$", var.backup_schedule))
    error_message = "Cronograma de backup deve estar no formato cron válido."
  }
}

# ==============================================================================
# PERFORMANCE CONFIGURATION
# ==============================================================================

variable "enable_auto_scaling" {
  description = "Habilitar auto scaling (requer múltiplas instâncias)"
  type        = bool
  default     = false
}

variable "min_instances" {
  description = "Número mínimo de instâncias para auto scaling"
  type        = number
  default     = 1
  
  validation {
    condition     = var.min_instances >= 1 && var.min_instances <= 10
    error_message = "Número mínimo de instâncias deve estar entre 1 e 10."
  }
}

variable "max_instances" {
  description = "Número máximo de instâncias para auto scaling"
  type        = number
  default     = 3
  
  validation {
    condition     = var.max_instances >= 1 && var.max_instances <= 10
    error_message = "Número máximo de instâncias deve estar entre 1 e 10."
  }
}