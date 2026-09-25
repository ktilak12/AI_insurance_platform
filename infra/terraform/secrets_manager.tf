# AWS Secrets Manager & KMS Customer Managed Key (CMK)

resource "aws_kms_key" "secrets" {
  description             = "KMS Key for PolicyLens Credential & Vault Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "policylens-${var.environment}-secrets-key"
  }
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/policylens-${var.environment}-secrets"
  target_key_id = aws_kms_key.secrets.key_id
}

# Master Production Secrets Vault
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "policylens/${var.environment}/app-secrets"
  description             = "Master encrypted secrets vault for PolicyLens AI Platform"
  kms_key_id              = aws_kms_key.secrets.arn
  recovery_window_in_days = 30

  tags = {
    Name = "policylens-${var.environment}-app-secrets"
  }
}

# Initial JSON structure template stored in vault
resource "aws_secretsmanager_secret_version" "initial" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    DATABASE_URL         = "postgresql://policylens_admin:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/insurance_db"
    JWT_SECRET           = random_password.jwt_secret.result
    JWT_REFRESH_SECRET   = random_password.jwt_refresh_secret.result
    INTERNAL_API_SECRET  = random_password.internal_secret.result
    GEMINI_API_KEY       = "REPLACE_WITH_REAL_GEMINI_API_KEY"
    B2B_HMAC_MASTER_KEY  = random_password.hmac_secret.result
  })

  lifecycle {
    ignore_changes = [
      secret_string # Prevent Terraform from overwriting secrets updated via UI / CLI
    ]
  }
}

# Random high-entropy secret generators
resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

resource "random_password" "jwt_refresh_secret" {
  length  = 64
  special = false
}

resource "random_password" "internal_secret" {
  length  = 64
  special = false
}

resource "random_password" "hmac_secret" {
  length  = 64
  special = false
}
