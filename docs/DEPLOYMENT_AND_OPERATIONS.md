# 🚀 PolicyLens AI — Deployment, Infrastructure & Operations Guide

> **Phase 6: Production Deployment & MVP Launch Playbook**  
> Complete manual for zero-downtime microservice orchestration, PostgreSQL `pgvector` provisioning, AWS Secrets Manager credential vaulting, and automated CI/CD pipelines.

---

## 📋 Table of Contents

1. [Architectural Topology](#1-architectural-topology)
2. [CI/CD Automation (GitHub Actions)](#2-cicd-automation-github-actions)
3. [Infrastructure as Code (Terraform Provisioning)](#3-infrastructure-as-code-terraform-provisioning)
4. [Container Orchestration & Docker Compose](#4-container-orchestration--docker-compose)
5. [Enterprise Secret Management (AWS Secrets Manager)](#5-enterprise-secret-management-aws-secrets-manager)
6. [Database Migrations & pgvector Vector Operations](#6-database-migrations--pgvector-vector-operations)
7. [Zero-Downtime Rolling Deployment & Health Checks](#7-zero-downtime-rolling-deployment--health-checks)
8. [Monitoring, Alerting & Incident Recovery](#8-monitoring-alerting--incident-recovery)

---

## 1. Architectural Topology

```
                                  [ Internet / Clients ]
                                             │
                                             ▼
                             [ CloudFront CDN (Global Edge) ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [ S3: React SPA ]                             [ HTTPS Route53 ]
        (Immutable Static Assets)                                  │
                                                                   ▼
                                                   [ Application Load Balancer (ALB) ]
                                                   (SSL/TLS 1.3 Termination, WAF)
                                                                   │
                                       ┌───────────────────────────┴───────────────────────────┐
                                       ▼                                                       ▼
                        [ ECS Fargate: Node API Gateway ]                     [ ECS Fargate: Python AI Workers ]
                         (Express / JWT / Fit Engine)                         (FastAPI / PyMuPDF / Gemini RAG)
                                       │                                                       │
                                       ├───────────────────────────┬───────────────────────────┤
                                       ▼                           ▼                           ▼
                        [ Aurora PG16 + pgvector ]     [ Redis Cache / Queue ]     [ S3: Policy Documents ]
                         (Encrypted with KMS CMK)       (Rate Limits & Jobs)       (Encrypted Server-Side)
```

---

## 2. CI/CD Automation (GitHub Actions)

### Continuous Integration (`.github/workflows/ci.yml`)
Every pull request and push to `main` executes a 5-stage automated matrix:
1. **Frontend Build & Lint**: Validates React 18 + TypeScript strict compilation with Vite.
2. **Backend Unit Testing**: Runs Jest test suites with 100% passing requirement across auth, fit comparison, and AI gateway modules.
3. **AI Service Pytest**: Tests PyMuPDF parsing, prompt injection defense, and RAG vector store retrieval.
4. **Database Schema Validation**: Launches an ephemeral `pgvector/pgvector:pg16` service container to verify that `./database/migrations/001_initial_schema.sql` applies cleanly without syntax or extension errors.
5. **TruffleHog Secret Auditing**: Scans git commit history for accidental API key or credential leakage.

### Continuous Deployment (`.github/workflows/deploy.yml`)
On tagged releases or merges to `main`:
1. **Multi-Stage Container Builds**: Packages optimized, minimal alpine images for `backend`, `ai-service`, and `frontend`.
2. **Container Registry Push**: Publishes signed Docker images to GitHub Container Registry (`ghcr.io`) / AWS ECR with immutable Git SHA tags.
3. **Rolling Deployment Execution**: Updates ECS task definitions or Kubernetes deployments with zero downtime.

---

## 3. Infrastructure as Code (Terraform Provisioning)

All AWS cloud infrastructure is declaratively defined under `./infra/terraform/`.

### Prerequisites
- Terraform `>= 1.7.0`
- AWS CLI configured with administrator or deployer credentials in target region (default: `ap-south-1` Mumbai for IRDAI local data residence compliance).

### Provisioning Steps
```bash
cd infra/terraform

# 1. Initialize remote state and plugins
terraform init

# 2. Review execution plan
terraform plan -out=tfplan.binary

# 3. Apply infrastructure resources
terraform apply tfplan.binary
```

### Key Provisioned Resources:
- **VPC & Subnets**: Multi-AZ public, private application, and private database subnets with NAT Gateways.
- **RDS PostgreSQL 16**: Configured with `vector` extension, 64MB `work_mem` for fast indexing, and storage encryption with Customer Managed KMS Key.
- **ECS Fargate Cluster**: Autoscaling clusters for Node API Gateway and Python AI Workers with Application Load Balancer target groups.
- **S3 & CloudFront**: S3 document storage with KMS encryption and Origin Access Control (OAC) backed CloudFront CDN.
- **Secrets Manager**: KMS-encrypted master vault with automated access policies.

---

## 4. Container Orchestration & Docker Compose

### Local & Staging Deployment with Docker Compose
Run the entire platform locally with a single command:
```bash
# 1. Copy template environment file
cp .env.example .env

# 2. Start full-stack services (DB, Redis, Backend, AI-Service, Frontend)
docker-compose up -d --build

# 3. Verify running containers and health status
docker-compose ps
```

| Service Container | Port | Description | Healthcheck Endpoint |
|---|---|---|---|
| `policylens_db` | 5432 | PostgreSQL 16 + pgvector | `pg_isready -U postgres` |
| `policylens_redis` | 6379 | Redis 7 Alpine In-Memory Store | `redis-cli ping` |
| `policylens_backend` | 5000 | Node Express API Gateway | `http://localhost:5000/api/health` |
| `policylens_ai_service` | 8000 | Python FastAPI RAG Engine | `http://localhost:8000/health` |
| `policylens_frontend` | 80 | React SPA via Nginx Alpine | `http://localhost/` |

---

## 5. Enterprise Secret Management (AWS Secrets Manager)

### Architecture
PolicyLens implements a **Zero-Hardcoded Secrets** policy:
- In **Production**: Containers query `AWS_SECRETS_VAULT_NAME` (`policylens/production/app-secrets`) via IAM Task Roles.
- Secrets are cached in memory with a **15-minute TTL** (`SecretsManagerService`) to prevent latency and API rate limits.
- In **Development/Testing**: Services seamlessly fall back to local `.env` variables.

### Vault Schema Structure (`infra/secrets/policy_secrets_template.json`):
```json
{
  "DATABASE_URL": "postgresql://policylens_admin:STRONG_PASSWORD@rds-host:5432/insurance_db",
  "JWT_SECRET": "SECURE_64_CHAR_HEX_KEY",
  "JWT_REFRESH_SECRET": "SECURE_64_CHAR_REFRESH_KEY",
  "INTERNAL_API_SECRET": "INTERNAL_INTER_SERVICE_HMAC_KEY",
  "GEMINI_API_KEY": "AIzaSy_PRODUCTION_GEMINI_KEY",
  "B2B_HMAC_MASTER_KEY": "B2B_WEBHOOK_SIGNATURE_KEY"
}
```

### Rotating Secrets via AWS CLI:
```bash
aws secretsmanager put-secret-value \
  --secret-id policylens/production/app-secrets \
  --secret-string file://new_secrets.json \
  --region ap-south-1
```

---

## 6. Database Migrations & pgvector Vector Operations

### Applying Database Migrations
```bash
# Using direct psql client:
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d insurance_db -f ./database/migrations/001_initial_schema.sql
```

### pgvector Embedding Setup
- The schema configures 768-dimensional vector embeddings for policy document chunks.
- Vector indexing utilizes **IVFFlat** cosine distance index:
```sql
CREATE INDEX document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## 7. Zero-Downtime Rolling Deployment & Health Checks

### Zero-Downtime Strategy
1. **Graceful Signal Handling**: Node and Python containers use `dumb-init` to intercept `SIGTERM` and finish inflight HTTP requests before shutting down.
2. **Health Check Probes**:
   - Backend: `/api/health` validates internal database connectivity and AI Gateway availability.
   - AI Service: `/health` verifies FastAPI worker readiness.
3. **Rolling Updates**: ECS Fargate and Kubernetes deploy new tasks, wait for health probes to return `200 OK`, then gracefully terminate legacy tasks.

---

## 8. Monitoring, Alerting & Incident Recovery

- **AWS CloudWatch / Prometheus Metrics**: Track latency (p95, p99), error rates (5xx), and extraction queue depth.
- **Audit Logging**: All comparison requests and policy diff queries are logged to `audit_logs` table for IRDAI compliance auditing.
- **Database Automated Snapshots**: Daily point-in-time recovery (PITR) with 30-day retention across multi-AZ Aurora instances.
