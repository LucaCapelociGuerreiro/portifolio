# ==============================================================================
# INFRAESTRUTURA ORACLE CLOUD - TERRAFORM
# ==============================================================================
# Configuração completa para Oracle Cloud Always Free Tier
# Analista DevOps Sênior - Infraestrutura como Código

terraform {
  required_version = ">= 1.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
  
  # Backend para armazenar o state remotamente (opcional)
  # backend "s3" {
  #   bucket = "terraform-state-bucket"
  #   key    = "portfolio/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# ==============================================================================
# PROVIDER CONFIGURATION
# ==============================================================================
provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

# ==============================================================================
# DATA SOURCES
# ==============================================================================

# Availability Domains
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

# Oracle Linux 8 Image
data "oci_core_images" "oracle_linux" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Oracle Linux"
  operating_system_version = "8"
  shape                    = "VM.Standard.E2.1.Micro"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# ==============================================================================
# NETWORKING
# ==============================================================================

# Virtual Cloud Network
resource "oci_core_vcn" "portfolio_vcn" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "portfolio-vcn"
  dns_label      = "portfoliovcn"
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Internet Gateway
resource "oci_core_internet_gateway" "portfolio_igw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio_vcn.id
  display_name   = "portfolio-igw"
  enabled        = true
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Route Table
resource "oci_core_route_table" "portfolio_rt" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio_vcn.id
  display_name   = "portfolio-route-table"
  
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.portfolio_igw.id
  }
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Security List
resource "oci_core_security_list" "portfolio_sl" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio_vcn.id
  display_name   = "portfolio-security-list"
  
  # Egress Rules - Allow all outbound
  egress_security_rules {
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = false
  }
  
  # Ingress Rules
  # SSH Access
  ingress_security_rules {
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 22
      max = 22
    }
  }
  
  # HTTP Access
  ingress_security_rules {
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 80
      max = 80
    }
  }
  
  # HTTPS Access
  ingress_security_rules {
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 443
      max = 443
    }
  }
  
  # Application Port (3000)
  ingress_security_rules {
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 3000
      max = 3000
    }
  }
  
  # Monitoring Ports (Prometheus/Grafana)
  ingress_security_rules {
    source      = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 9090
      max = 9090
    }
  }
  
  ingress_security_rules {
    source      = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    protocol    = "6" # TCP
    stateless   = false
    
    tcp_options {
      min = 3001
      max = 3001
    }
  }
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Subnet
resource "oci_core_subnet" "portfolio_subnet" {
  compartment_id      = var.compartment_ocid
  vcn_id              = oci_core_vcn.portfolio_vcn.id
  cidr_block          = "10.0.1.0/24"
  display_name        = "portfolio-subnet"
  dns_label           = "portfoliosub"
  route_table_id      = oci_core_route_table.portfolio_rt.id
  security_list_ids   = [oci_core_security_list.portfolio_sl.id]
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# ==============================================================================
# SSH KEY PAIR
# ==============================================================================

# Generate SSH Key Pair
resource "tls_private_key" "portfolio_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save private key locally
resource "local_file" "private_key" {
  content         = tls_private_key.portfolio_ssh.private_key_pem
  filename        = "${path.module}/portfolio-key.pem"
  file_permission = "0600"
}

# Save public key locally
resource "local_file" "public_key" {
  content  = tls_private_key.portfolio_ssh.public_key_openssh
  filename = "${path.module}/portfolio-key.pub"
}

# ==============================================================================
# COMPUTE INSTANCE
# ==============================================================================

# Cloud-init script
locals {
  cloud_init = base64encode(templatefile("${path.module}/cloud-init.yaml", {
    docker_compose_content = base64encode(file("${path.module}/../docker-compose.yml"))
    nginx_config_content   = base64encode(file("${path.module}/../nginx.conf"))
  }))
}

# Compute Instance
resource "oci_core_instance" "portfolio_instance" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "portfolio-server"
  shape               = "VM.Standard.E2.1.Micro"
  
  # Always Free Tier shape config
  shape_config {
    ocpus         = 1
    memory_in_gbs = 1
  }
  
  # Boot volume
  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.oracle_linux.images[0].id
    boot_volume_size_in_gbs = 47 # Always Free Tier limit
  }
  
  # Network configuration
  create_vnic_details {
    subnet_id                 = oci_core_subnet.portfolio_subnet.id
    display_name              = "portfolio-vnic"
    assign_public_ip          = true
    assign_private_dns_record = true
    hostname_label            = "portfolio"
  }
  
  # SSH Key
  metadata = {
    ssh_authorized_keys = tls_private_key.portfolio_ssh.public_key_openssh
    user_data          = local.cloud_init
  }
  
  # Prevent accidental deletion
  lifecycle {
    ignore_changes = [source_details[0].source_id]
  }
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
    "Application" = "NextJS-Portfolio"
  }
  
  timeouts {
    create = "10m"
  }
}

# ==============================================================================
# BLOCK STORAGE (OPCIONAL)
# ==============================================================================

# Block Volume para dados persistentes
resource "oci_core_volume" "portfolio_data" {
  count               = var.create_block_volume ? 1 : 0
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "portfolio-data-volume"
  size_in_gbs         = 50
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Attach block volume
resource "oci_core_volume_attachment" "portfolio_data_attachment" {
  count           = var.create_block_volume ? 1 : 0
  attachment_type = "iscsi"
  instance_id     = oci_core_instance.portfolio_instance.id
  volume_id       = oci_core_volume.portfolio_data[0].id
  display_name    = "portfolio-data-attachment"
}

# ==============================================================================
# LOAD BALANCER (OPCIONAL - Para alta disponibilidade)
# ==============================================================================

# Load Balancer
resource "oci_load_balancer_load_balancer" "portfolio_lb" {
  count          = var.create_load_balancer ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "portfolio-load-balancer"
  shape          = "flexible"
  
  shape_details {
    minimum_bandwidth_in_mbps = 10
    maximum_bandwidth_in_mbps = 10
  }
  
  subnet_ids = [oci_core_subnet.portfolio_subnet.id]
  
  is_private = false
  
  freeform_tags = {
    "Environment" = var.environment
    "Project"     = "Portfolio"
    "ManagedBy"   = "Terraform"
  }
}

# Backend Set
resource "oci_load_balancer_backend_set" "portfolio_backend_set" {
  count            = var.create_load_balancer ? 1 : 0
  load_balancer_id = oci_load_balancer_load_balancer.portfolio_lb[0].id
  name             = "portfolio-backend-set"
  policy           = "ROUND_ROBIN"
  
  health_checker {
    protocol          = "HTTP"
    port              = 80
    url_path          = "/"
    return_code       = 200
    interval_ms       = 30000
    timeout_in_millis = 3000
    retries           = 3
  }
}

# Backend
resource "oci_load_balancer_backend" "portfolio_backend" {
  count            = var.create_load_balancer ? 1 : 0
  load_balancer_id = oci_load_balancer_load_balancer.portfolio_lb[0].id
  backendset_name  = oci_load_balancer_backend_set.portfolio_backend_set[0].name
  ip_address       = oci_core_instance.portfolio_instance.private_ip
  port             = 80
  backup           = false
  drain            = false
  offline          = false
  weight           = 1
}

# Listener
resource "oci_load_balancer_listener" "portfolio_listener" {
  count                    = var.create_load_balancer ? 1 : 0
  load_balancer_id         = oci_load_balancer_load_balancer.portfolio_lb[0].id
  name                     = "portfolio-listener"
  default_backend_set_name = oci_load_balancer_backend_set.portfolio_backend_set[0].name
  port                     = 80
  protocol                 = "HTTP"
}