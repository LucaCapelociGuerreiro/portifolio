# ==============================================================================
# TERRAFORM OUTPUTS - ORACLE CLOUD INFRASTRUCTURE
# ==============================================================================
# Outputs para exposição de informações da infraestrutura
# Analista DevOps Sênior - Infraestrutura como Código

# ==============================================================================
# COMPUTE INSTANCE OUTPUTS
# ==============================================================================

output "instance_id" {
  description = "OCID da instância compute"
  value       = oci_core_instance.portfolio_instance.id
}

output "instance_public_ip" {
  description = "IP público da instância"
  value       = oci_core_instance.portfolio_instance.public_ip
  sensitive   = false
}

output "instance_private_ip" {
  description = "IP privado da instância"
  value       = oci_core_instance.portfolio_instance.private_ip
  sensitive   = false
}

output "instance_state" {
  description = "Estado atual da instância"
  value       = oci_core_instance.portfolio_instance.state
}

output "instance_shape" {
  description = "Shape da instância"
  value       = oci_core_instance.portfolio_instance.shape
}

output "instance_availability_domain" {
  description = "Availability Domain da instância"
  value       = oci_core_instance.portfolio_instance.availability_domain
}

# ==============================================================================
# NETWORK OUTPUTS
# ==============================================================================

output "vcn_id" {
  description = "OCID da Virtual Cloud Network"
  value       = oci_core_vcn.portfolio_vcn.id
}

output "vcn_cidr_blocks" {
  description = "CIDR blocks da VCN"
  value       = oci_core_vcn.portfolio_vcn.cidr_blocks
}

output "subnet_id" {
  description = "OCID da subnet"
  value       = oci_core_subnet.portfolio_subnet.id
}

output "subnet_cidr_block" {
  description = "CIDR block da subnet"
  value       = oci_core_subnet.portfolio_subnet.cidr_block
}

output "internet_gateway_id" {
  description = "OCID do Internet Gateway"
  value       = oci_core_internet_gateway.portfolio_igw.id
}

output "route_table_id" {
  description = "OCID da Route Table"
  value       = oci_core_route_table.portfolio_rt.id
}

output "security_list_id" {
  description = "OCID da Security List"
  value       = oci_core_security_list.portfolio_sl.id
}

# ==============================================================================
# SSH KEY OUTPUTS
# ==============================================================================

output "ssh_private_key_path" {
  description = "Caminho para a chave SSH privada"
  value       = local_file.private_key.filename
  sensitive   = true
}

output "ssh_public_key_path" {
  description = "Caminho para a chave SSH pública"
  value       = local_file.public_key.filename
}

output "ssh_public_key_content" {
  description = "Conteúdo da chave SSH pública"
  value       = tls_private_key.portfolio_ssh.public_key_openssh
  sensitive   = true
}

# ==============================================================================
# APPLICATION URLS
# ==============================================================================

output "application_url" {
  description = "URL da aplicação"
  value       = "http://${oci_core_instance.portfolio_instance.public_ip}"
}

output "application_https_url" {
  description = "URL HTTPS da aplicação (se SSL configurado)"
  value       = "https://${oci_core_instance.portfolio_instance.public_ip}"
}

output "ssh_connection_command" {
  description = "Comando para conectar via SSH"
  value       = "ssh -i ${local_file.private_key.filename} opc@${oci_core_instance.portfolio_instance.public_ip}"
  sensitive   = true
}

# ==============================================================================
# MONITORING URLS
# ==============================================================================

output "prometheus_url" {
  description = "URL do Prometheus (se habilitado)"
  value       = var.enable_monitoring ? "http://${oci_core_instance.portfolio_instance.public_ip}:${var.prometheus_port}" : "Monitoring disabled"
}

output "grafana_url" {
  description = "URL do Grafana (se habilitado)"
  value       = var.enable_monitoring ? "http://${oci_core_instance.portfolio_instance.public_ip}:${var.grafana_port}" : "Monitoring disabled"
}

output "node_exporter_url" {
  description = "URL do Node Exporter (se habilitado)"
  value       = var.enable_monitoring ? "http://${oci_core_instance.portfolio_instance.public_ip}:${var.node_exporter_port}" : "Monitoring disabled"
}

# ==============================================================================
# LOAD BALANCER OUTPUTS
# ==============================================================================

output "load_balancer_id" {
  description = "OCID do Load Balancer"
  value       = var.create_load_balancer ? oci_load_balancer_load_balancer.portfolio_lb[0].id : "Load Balancer not created"
}

output "load_balancer_public_ip" {
  description = "IP público do Load Balancer"
  value       = var.create_load_balancer ? oci_load_balancer_load_balancer.portfolio_lb[0].ip_address_details[0].ip_address : "Load Balancer not created"
}

output "load_balancer_url" {
  description = "URL do Load Balancer"
  value       = var.create_load_balancer ? "http://${oci_load_balancer_load_balancer.portfolio_lb[0].ip_address_details[0].ip_address}" : "Load Balancer not created"
}

# ==============================================================================
# STORAGE OUTPUTS
# ==============================================================================

output "boot_volume_id" {
  description = "OCID do volume de boot"
  value       = oci_core_instance.portfolio_instance.boot_volume_id
}

output "block_volume_id" {
  description = "OCID do volume de bloco adicional"
  value       = var.create_block_volume ? oci_core_volume.portfolio_data[0].id : "Block volume not created"
}

output "block_volume_attachment_id" {
  description = "OCID do attachment do volume de bloco"
  value       = var.create_block_volume ? oci_core_volume_attachment.portfolio_data_attachment[0].id : "Block volume not created"
}

# ==============================================================================
# DEPLOYMENT INFORMATION
# ==============================================================================

output "deployment_info" {
  description = "Informações de deployment"
  value = {
    environment           = var.environment
    project_name         = var.project_name
    region               = var.region
    instance_shape       = var.instance_shape
    vcn_cidr            = var.vcn_cidr
    subnet_cidr         = var.subnet_cidr
    monitoring_enabled   = var.enable_monitoring
    load_balancer_enabled = var.create_load_balancer
    block_volume_enabled = var.create_block_volume
    deployment_timestamp = timestamp()
  }
}

# ==============================================================================
# GITHUB ACTIONS SECRETS
# ==============================================================================

output "github_actions_secrets" {
  description = "Secrets necessários para GitHub Actions"
  value = {
    ORACLE_SERVER_IP      = oci_core_instance.portfolio_instance.public_ip
    ORACLE_SSH_USER       = "opc"
    ORACLE_SSH_PRIVATE_KEY = "# Conteúdo da chave privada em ${local_file.private_key.filename}"
    ORACLE_TENANCY_OCID   = var.tenancy_ocid
    ORACLE_USER_OCID      = var.user_ocid
    ORACLE_FINGERPRINT    = var.fingerprint
    ORACLE_REGION         = var.region
    ORACLE_COMPARTMENT_OCID = var.compartment_ocid
  }
  sensitive = true
}

# ==============================================================================
# COST OPTIMIZATION
# ==============================================================================

output "cost_optimization_info" {
  description = "Informações para otimização de custos"
  value = {
    always_free_eligible = {
      compute_shape = var.instance_shape == "VM.Standard.E2.1.Micro" ? "Yes" : "No"
      boot_volume_size = var.boot_volume_size_gb <= 47 ? "Yes" : "No"
      block_volume_size = var.create_block_volume && var.block_volume_size_gb <= 200 ? "Yes" : "No"
      load_balancer = var.create_load_balancer ? "No - Additional cost" : "Yes"
    }
    estimated_monthly_cost = {
      compute = var.instance_shape == "VM.Standard.E2.1.Micro" ? "$0 (Always Free)" : "Variable"
      storage = "$0 (Always Free up to 200GB)"
      network = "$0 (Always Free up to 10TB)"
      load_balancer = var.create_load_balancer ? "~$20/month" : "$0"
    }
  }
}

# ==============================================================================
# SECURITY INFORMATION
# ==============================================================================

output "security_info" {
  description = "Informações de segurança"
  value = {
    ssh_access = {
      port = 22
      allowed_cidrs = var.allowed_ssh_cidrs
      key_file = local_file.private_key.filename
    }
    web_access = {
      http_port = var.nginx_port
      https_port = var.ssl_port
      app_port = var.app_port
      allowed_cidrs = var.allowed_http_cidrs
    }
    monitoring_access = var.enable_monitoring ? {
      prometheus_port = var.prometheus_port
      grafana_port = var.grafana_port
      node_exporter_port = var.node_exporter_port
      access_restriction = "Internal VCN only"
    } : "Monitoring disabled"
  }
}

# ==============================================================================
# MAINTENANCE INFORMATION
# ==============================================================================

output "maintenance_info" {
  description = "Informações de manutenção"
  value = {
    backup_enabled = var.enable_automatic_backups
    backup_schedule = var.backup_schedule
    backup_retention_days = var.backup_retention_days
    os_management_enabled = var.enable_os_management
    auto_scaling_enabled = var.enable_auto_scaling
    min_instances = var.min_instances
    max_instances = var.max_instances
  }
}

# ==============================================================================
# QUICK START COMMANDS
# ==============================================================================

output "quick_start_commands" {
  description = "Comandos para início rápido"
  value = {
    ssh_connect = "ssh -i ${local_file.private_key.filename} opc@${oci_core_instance.portfolio_instance.public_ip}"
    check_app = "curl http://${oci_core_instance.portfolio_instance.public_ip}"
    check_health = "curl http://${oci_core_instance.portfolio_instance.public_ip}/health"
    view_logs = "ssh -i ${local_file.private_key.filename} opc@${oci_core_instance.portfolio_instance.public_ip} 'docker-compose logs -f'"
    restart_app = "ssh -i ${local_file.private_key.filename} opc@${oci_core_instance.portfolio_instance.public_ip} 'cd ~/portfolio-deploy && docker-compose restart'"
  }
  sensitive = true
}