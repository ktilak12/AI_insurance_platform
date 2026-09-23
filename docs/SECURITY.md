# Enterprise Security & Compliance Policy

## 1. Zero Trust AI Document Ingestion
- Uploaded PDFs from users or insurers are treated as untrusted bytecode.
- The extraction engine strictly separates user data from LLM system instructions to neutralize indirect prompt injection attacks.
- Extraction payloads must pass Pydantic schema validation before any database persistence.

## 2. Secrets Management & Key Rotation
- Production secrets must never be committed to Git.
- CI/CD pipeline enforces `detect-secrets` and `trufflehog` audits on every PR.
- AWS Secrets Manager / GCP Secret Manager should be used for dynamic credential resolution in production.

## 3. IRDAI Regulatory Guardrails
- Under IRDAI web aggregator guidelines, comparison algorithms must remain 100% neutral and transparent.
- No dynamic sorting or highlight badges (e.g. "Bestseller", "Most Recommended") based on insurer commissions or sponsor placement.
- Every displayed policy fact links directly to its source policy wording PDF page number.
