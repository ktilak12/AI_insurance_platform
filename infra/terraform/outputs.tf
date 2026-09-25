output = {
  vpc_id = aws_vpc.main.id
  alb_dns_name = aws_lb.api_alb.dns_name
  rds_endpoint = aws_db_instance.postgres.endpoint
  secrets_vault_arn = aws_secretsmanager_secret.app_secrets.arn
  kms_key_arn = aws_kms_key.secrets.arn
  s3_documents_bucket = aws_s3_bucket.policy_docs.bucket
  cloudfront_domain_name = aws_cloudfront_distribution.cdn.domain_name
}
