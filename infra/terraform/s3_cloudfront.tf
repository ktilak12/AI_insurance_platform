# S3 Storage for Policy PDF Wordings & CloudFront CDN for Frontend SPA

# S3 Bucket for Policy Document PDFs
resource "aws_s3_bucket" "policy_docs" {
  bucket        = "policylens-${var.environment}-documents-${data.aws_caller_identity.current.account_id}"
  force_destroy = false

  tags = {
    Name = "policylens-${var.environment}-documents"
  }
}

resource "aws_s3_bucket_versioning" "docs_versioning" {
  bucket = aws_s3_bucket.policy_docs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "docs_crypto" {
  bucket = aws_s3_bucket.policy_docs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.secrets.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "docs_private" {
  bucket = aws_s3_bucket.policy_docs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Frontend S3 Bucket & CloudFront CDN
resource "aws_s3_bucket" "frontend_static" {
  bucket = "policylens-${var.environment}-frontend-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "policylens-${var.environment}-frontend"
  }
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "policylens-${var.environment}-oac"
  description                       = "OAC for frontend S3 access"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.frontend_static.bucket_regional_domain_name
    origin_id                = "S3-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-frontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # SPA routing support
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "policylens-${var.environment}-cdn"
  }
}

data "aws_caller_identity" "current" {}
