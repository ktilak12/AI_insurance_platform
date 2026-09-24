# System Architecture & Security Specification

## 1. High-Level Architecture Overview

The system follows a decoupled, secure multi-tier architecture separating user-facing web services, business logic/auth orchestration, and isolated AI document processing workloads.

```
┌────────────────┐          HTTPS / TLS 1.3         ┌────────────────────────────────┐
│ React Frontend │ ◄──────────────────────────────► │  Node.js Backend & API Gateway │
│ (Vite + TS)    │                                  │  (Express 4.x / TS / Zod)      │
└────────────────┘                                  └───────────────┬────────────────┘
                                                                    │
                                              Internal REST + Secret Auth Key (mTLS/HMAC)
                                              Header: X-Internal-API-Key
                                                                    │
                                                                    ▼
┌────────────────┐      SQL / pgvector Queries      ┌────────────────────────────────┐
│   PostgreSQL   │ ◄──────────────────────────────► │   FastAPI AI & RAG Engine      │
│   (pgvector)   │                                  │   (PyMuPDF / Gemini / Pydantic)│
└────────────────┘                                  └────────────────────────────────┘
```

---

## 2. Phase 4: Core Backend Services (`/backend`)

### 4.1 Authentication Service (`AuthService` & `/api/auth`)
- **JWT Architecture**:
  - **Short-lived Access Token (15 min)**: Signs `{ id, email, role }` with `JWT_SECRET`.
  - **Long-lived Refresh Token (7 days)**: Signed with separate `JWT_REFRESH_SECRET`.
  - **Token Rotation**: Refresh tokens are revoked and replaced with single-use rotation, preventing replay attacks.
- **Password Security**: Salted hashing via `bcryptjs` (cost factor 10).
- **OAuth 2.0 Integration**: Federated login endpoint (`POST /api/auth/oauth`) for Google / GitHub auth providers.

### 4.2 User Requirements API (`UserRequirementsService` & `/api/user/requirements`)
- **Secure Health Profiling**:
  - Collects age, city, budget, target sum insured, acceptable waiting periods, and declared health conditions.
  - Strict input validation via **Zod schemas** (`requirementProfileSchema`).
  - Privacy Compliance: Endpoints support data deletion (`DELETE /api/user/requirements`) for the "Right to be forgotten".

### 4.3 Plan Comparison Engine (`ComparisonEngine` & `/api/compare`)
- **IRDAI Unbiased Scoring Algorithm**:
  - **Budget Fit (25%)**: Proportional scaling penalty if premium exceeds budget.
  - **Coverage Fit (25%)**: Deficit penalty if sum insured is under user target.
  - **Waiting Period Fit (20%)**: Compares pre-existing disease (PED) and specific ailment clauses.
  - **Room Rent Proportionate Deduction Risk (15%)**: Assesses whether capped room rent triggers proportionate deduction penalties across doctor and surgeon invoices.
  - **Co-Payment Fit (10%)**: Evaluates zero co-pay requirement vs mandatory insurer cost sharing.
  - **Auto-Restoration & Maternity (5%)**: Checks inclusion of 100% recharge benefits.
  - **Zero Sponsor Manipulation**: Sorting strictly follows mathematical fit percentage.

### 4.4 Secure AI Gateway (`AIGatewayService`)
- **Internal Authentication**: Requires `X-Internal-API-Key` matching `INTERNAL_API_SECRET` to prevent unauthorized AI invocation.
- **Resilience & Circuit Breaker**:
  - Dynamic health checking (`GET /api/health` queries `/health` on FastAPI).
  - Graceful degradation fallback if the AI engine is warming up or temporarily unreachable.
  - Request timeout enforcement (10,000ms).

---

## 3. Threat Model & Security Controls

| Threat Vector | Risk Level | Mitigation Strategy |
| :--- | :--- | :--- |
| **Prompt Injection via PDFs** | Critical | Treat all PDF content as untrusted raw string data. Separate instruction context and data context completely using structured delimiters and system prompts. |
| **Hallucination / False Fact** | Critical | Strict RAG policy: If relevant chunk similarity score is below threshold or evidence is missing, AI replies with "Cannot verify from available policy document" rather than guessing. |
| **PII & Data Leakage** | High | Customer questionnaire and health disclosures are stored encrypted at rest (AES-256-GCM). Role-Based Access Control (RBAC) on all API endpoints. |
| **DDoS / LLM API Cost Exhaustion** | High | IP and User-based token bucket rate limiters on all chat and extraction endpoints. |
| **Regulatory Non-Compliance (IRDAI)**| High | Neutral comparison algorithms only. System explicitly disables "Best Plan" sorting or sponsor-biased weighting. |
