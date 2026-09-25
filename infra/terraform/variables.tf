variable "aws_region" {
  description = "AWS Primary Deployment Region (e.g., ap-south-1 Mumbai for IRDAI local data compliance)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment name (production, staging, dev)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_instance_class" {
  description = "RDS PostgreSQL Instance Class"
  type        = string
  default     = "db.r6g.xlarge"
}

variable "backend_image" {
  description = "Docker image URI for Node.js API Gateway"
  type        = string
  default     = "ghcr.io/ktilak12/policylens-backend"
}

variable "ai_service_image" {
  description = "Docker image URI for Python AI RAG Service"
  type        = string
  default     = "ghcr.io/ktilak12/policylens-ai-service"
}
