# System Architecture & Security Specification

## 1. High-Level Architecture Overview

The system follows a decoupled, secure multi-tier architecture separating user-facing web services, business logic/auth orchestration, and isolated AI document processing workloads.

```
┌────────────────┐          HTTPS / TLS 1.3         ┌───────────────────────┐
│ React Frontend │ ◄──────────────────────────────► │  Node.js Backend API  │
│ (Vite + TS)    │                                  │ (Express / Gateway)   │
└────────────────┘                                  └──────────┬────────────┘
                                                               │
                                         Internal REST + Secret Auth Key (mTLS/HMAC)
                                                               │
                                                               ▼
┌────────────────┐      SQL / pgvector Queries      ┌───────────────────────┐
│   PostgreSQL   │ ◄──────────────────────────────► │   FastAPI AI Engine   │
│   (pgvector)   │                                  │   (Python 3.11+)      │
└────────────────┘                                  └───────────────────────┘
```

---

## 2. Communication Protocols & Service Boundaries

### Node.js API Gateway (`/backend`)
- **Primary Responsibilities**:
  - User Authentication (JWT with secure HTTP-only cookies, Argon2 password hashing).
  - Rate Limiting & Abuse Prevention (`express-rate-limit`, `helmet` HTTP security headers).
  - Regulatory Compliance Guardrails (stripping promotional flags, ensuring unbiased comparison data).
  - User profile and questionnaire session management.
  - Proxying authenticated AI/comparison requests to the internal AI service.

### FastAPI AI Engine (`/ai-service`)
- **Primary Responsibilities**:
  - Secure Document Processing (PyMuPDF parser, OCR fallback).
  - Untrusted PDF Sandboxing & Prompt Injection Defense.
  - LLM Structured Output extraction adhering strictly to the canonical Insurance Policy JSON Schema via Pydantic.
  - Vector embeddings generation & `pgvector` similarity search for RAG.
  - Confidence calculation (scores `< 0.70` flagged for mandatory human/data verification).
  - Policy Q&A grounded generation with mandatory source citation (Page number, Section name, Document hash).

---

## 3. Threat Model & Security Controls

| Threat Vector | Risk Level | Mitigation Strategy |
| :--- | :--- | :--- |
| **Prompt Injection via PDFs** | Critical | Treat all PDF content as untrusted raw string data. Separate instruction context and data context completely using structured delimiters and system prompts. |
| **Hallucination / False Fact** | Critical | Strict RAG policy: If relevant chunk similarity score is below threshold or evidence is missing, AI replies with "Cannot verify from available policy document" rather than guessing. |
| **PII & Data Leakage** | High | Customer questionnaire and health disclosures are stored encrypted at rest (AES-256-GCM). Role-Based Access Control (RBAC) on all API endpoints. |
| **DDoS / LLM API Cost Exhaustion** | High | IP and User-based token bucket rate limiters on all chat and extraction endpoints. |
| **Regulatory Non-Compliance (IRDAI)**| High | Neutral comparison algorithms only. System explicitly disables "Best Plan" sorting or sponsor-biased weighting. |
