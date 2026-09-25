# 🛡️ PolicyLens AI — Executive Summary & Master Platform Blueprint

> **Enterprise-Grade AI Insurance Intelligence Platform**  
> *"We turn complicated insurance policies into comparable facts and explain which plans fit your requirements, with evidence from the policy documents."*

---

## 🏛️ Comprehensive 7-Phase Execution Matrix

| Phase | Core Focus | Implemented Capabilities & Deliverables | Verification Status |
|---|---|---|---|
| **Phase 1: Architecture & Data Foundations** | Canonical Schema & Ingestion | • Canonical Insurance JSON Schema with 100+ normalized fields<br>• PostgreSQL 16 + `pgvector` relational & vector schema<br>• PyMuPDF Byte-Exact OCR layout parser<br>• Multi-tier prompt injection and jailbreak defense filter | ✅ Verified & Seeded |
| **Phase 2: Core AI Engines** | Semantic Extraction & RAG | • Gemini 1.5/2.5 Flash structured policy extraction<br>• 768-dimensional vector embedding pipeline<br>• Grounded RAG Q&A engine with strict zero-hallucination guardrails<br>• Automated benchmark QA evaluation suite | ✅ Verified & Tested |
| **Phase 3: Differentiators & B2B APIs** | Semantic Policy Diff & Batch API | • Automated Policy "What Changed?" 2024 vs 2026 Semantic Comparator<br>• Claims Settlement Favorability Score (0–100)<br>• Multi-tenant B2B Batch Extraction API with API Key auth<br>• Webhook delivery & multi-language developer SDKs (cURL, Python, Node) | ✅ Verified & Integrated |
| **Phase 4: Core Backend Services** | API Gateway & Security | • Node.js + Express + TypeScript API Gateway<br>• JWT Authentication with refresh token rotation & bcrypt<br>• Deterministic `ComparisonEngine` with IRDAI mathematical weighting<br>• Secure AI Gateway routing requests to Python RAG engine | ✅ 15/15 Tests Passing |
| **Phase 5: Frontend Application** | Unbiased User Experience | • **5.1 Landing & Category Pages**: Health deep dive, 4 trap guides, transparency pledge<br>• **5.2 Conversational Form**: 10-question interactive profiling wizard<br>• **5.3 Comparison View**: Explainable recommendations, match %, side-by-side matrix<br>• **5.4 AI Assistant Chat**: Grounded Q&A with direct PDF page badges & Provenance Modal | ✅ Built & Bundled |
| **Phase 6: Deployment & MVP Launch** | Secure Cloud Infrastructure | • GitHub Actions CI/CD matrix (`ci.yml` & `deploy.yml`)<br>• Multi-stage Dockerfiles for Node, Python, and React Nginx<br>• Full-stack `docker-compose.yml` with Redis and healthchecks<br>• Terraform IaC (VPC, RDS `pgvector`, ECS Fargate, S3, CloudFront, Secrets Manager)<br>• Kubernetes manifests with AWS Secrets Store CSI driver | ✅ Configured & Validated |
| **Phase 7: Business Blueprint** | Commercial Strategy & GTM | • Dual-engine B2B SaaS ($499–$6.5k/mo) + B2C Policy Audit (₹499) model<br>• Comprehensive Competitor Teardown (PolicyBazaar, Ditto, Plum)<br>• 12-Slide Institutional Seed Investor Pitch Deck ($2.5M Ask)<br>• 18-Month Strategic Product Roadmap across Health, Motor, Travel & Claims | ✅ Documented |

---

## 🔑 Key Differentiators & Moats

1. **Byte-Exact Document Provenance**: Every single claim rule, waiting period, or room rent explanation is linked to the exact PDF page number and cryptographic SHA-256 hash.
2. **Zero-Sponsored Neutrality**: Ranking is driven purely by deterministic mathematical fit against the user's 10 profile constraints—no distributor pay-to-play bias.
3. **Semantic Policy Diff Engine**: Automatically highlights fine-print clause modifications across annual policy renewals, classifying changes as `FAVORABLE`, `RESTRICTIVE`, or `NEUTRAL`.
4. **B2B High-Throughput API**: Enables brokers, wealthtech platforms, and neo-banks to parse and normalize any insurance PDF into structured JSON in under 1.5 seconds.

---

## 📁 Repository Directory Structure

```
├── .github/workflows/
│   ├── ci.yml                     # 5-stage automated CI test & TruffleHog scan
│   └── deploy.yml                 # Multi-stage Docker build & cloud deploy CD
├── ai-service/                    # Python 3.11 FastAPI RAG & document engine
│   ├── app/
│   │   ├── b2b/                   # B2B batch document manager
│   │   ├── core/                  # AWS Secrets Manager integration
│   │   ├── diff/                  # Policy version semantic comparator
│   │   ├── extraction/            # PyMuPDF parser & prompt injection defense
│   │   ├── rag/                   # Grounded RAG QA & pgvector store
│   │   └── main.py                # FastAPI entrypoint
│   └── Dockerfile                 # Multi-stage Python 3.11 slim image
├── backend/                       # Node.js 20 Express TypeScript API Gateway
│   ├── src/
│   │   ├── middleware/            # JWT auth & security filters
│   │   ├── routes/                # Auth, requirements & comparison routes
│   │   ├── services/              # ComparisonEngine, DiffEngine, SecretsManager
│   │   └── index.ts               # Express entrypoint
│   ├── tests/                     # Jest test suites (15 tests passing)
│   └── Dockerfile                 # Multi-stage Node 20 alpine image
├── database/                      # Database DDL, migrations, and seeds
│   ├── migrations/                # PostgreSQL 16 + pgvector schema
│   ├── schemas/                   # Canonical Insurance Policy JSON schema
│   └── seeds/                     # Top health plans & policy diff seed data
├── docs/                          # Comprehensive architectural & business docs
│   ├── ARCHITECTURE.md            # System architecture & RAG dataflow
│   ├── BUSINESS_MODEL_AND_COMPLIANCE.md # SaaS pricing & competitor teardowns
│   ├── DEPLOYMENT_AND_OPERATIONS.md # Deployment manual & Terraform guide
│   ├── ER_DIAGRAM.md              # Database entity relationships
│   ├── EXECUTIVE_SUMMARY.md       # Master platform blueprint
│   ├── PITCH_DECK_AND_ROADMAP.md  # 12-slide investor deck & 18-month roadmap
│   └── SECURITY.md                # Threat modeling & defense in depth
├── frontend/                      # React 18 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/            # Landing, 10-Q Profile, Compare, Chat, Modals
│   │   ├── data/                  # Standardized policies & profiling questions
│   │   ├── types/                 # Frontend TypeScript interfaces
│   │   ├── utils/                 # Deterministic MatchingEngine
│   │   └── App.tsx                # Master responsive layout
│   ├── Dockerfile                 # Multi-stage Node + Nginx Alpine image
│   └── nginx.conf                 # Security headers & SPA fallback config
├── infra/                         # Infrastructure as Code & Orchestration
│   ├── k8s/                       # Kubernetes deployment & CSI secrets manifests
│   ├── secrets/                   # Master AWS Secrets Manager JSON template
│   └── terraform/                 # Terraform AWS VPC, RDS, ECS, S3, CloudFront
└── docker-compose.yml             # Full-stack local container orchestration
```
