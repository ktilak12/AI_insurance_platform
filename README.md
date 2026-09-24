# 🛡️ PolicyLens AI — AI Insurance Intelligence Platform

> **"We turn complicated insurance policies into comparable facts and explain which plans fit your requirements, with evidence from the policy documents."**

Built with enterprise-grade security, IRDAI-compliant transparent comparisons, semantic version diffing, and B2B batch document extraction APIs.

---

## 🌟 Key Platform Modules

1. **Personalized Fit Analysis**: Transparent, non-manipulative matching against user budgets, waiting period preferences, and room rent capping restrictions.
2. **Policy "What Changed?" Diff Engine (Phase 3)**: Automated clause-by-clause semantic comparison across policy editions (e.g. 2024 vs 2026), classifying impact into `FAVORABLE`, `RESTRICTIVE`, and `NEUTRAL` with a **Claims Settlement Favorability Score**.
3. **B2B Document Intelligence API (Phase 3)**: High-throughput batch PDF extraction with API key authentication, confidence scores, human-review triggers, webhooks, and multi-language developer SDKs.
4. **Grounded Policy AI Q&A**: Strict RAG pipeline generating answers with mandatory page number and quote citations from insurer contracts.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS (Glassmorphism Dark UI)
- **Backend API Gateway**: Node.js + Express + TypeScript (JWT Auth, Helmet, Rate Limiting)
- **AI & RAG Service**: Python 3.11 + FastAPI + PyMuPDF + Google GenAI / Gemini
- **Database & Vector Store**: PostgreSQL 16 + `pgvector`
- **CI/CD & Security**: GitHub Actions, Pre-commit hooks, TruffleHog Secret Scanner

---

## 📁 Repository Structure

```
├── .github/workflows/ci.yml       # Automated test & secret scanning CI pipeline
├── ai-service/                    # Python FastAPI AI document & RAG engine
│   ├── app/
│   │   ├── diff/                  # Semantic policy version comparator
│   │   ├── b2b/                   # B2B batch document extraction manager
│   │   ├── extraction/            # PyMuPDF parser & prompt injection defense
│   │   ├── rag/                   # Grounded QA engine with page citations
│   │   ├── evaluation/            # Automated benchmark evaluation QA dataset
│   │   ├── schemas/               # Pydantic structured output models
│   │   └── main.py                # FastAPI endpoints
│   ├── tests/                     # Pytest suite
│   └── requirements.txt
├── backend/                       # Node.js Express API Gateway
│   ├── src/
│   │   ├── services/              # Fit Comparison & PolicyDiff engines
│   │   ├── middleware/            # JWT auth & security filters
│   │   ├── types/                 # Shared TypeScript interfaces
│   │   └── index.ts               # Express entrypoint
│   ├── tests/                     # Jest suite
│   └── package.json
├── database/                      # PostgreSQL DDL, migrations, and canonical schemas
│   ├── migrations/                # pgvector & relational schema scripts
│   ├── schemas/                   # Canonical Insurance Policy JSON Schema
│   └── seeds/                     # Standardized health policy & version diff seed data
├── docs/                          # Architecture, ER diagrams, Security & Business specs
│   ├── ARCHITECTURE.md
│   ├── ER_DIAGRAM.md
│   ├── SECURITY.md
│   ├── BUSINESS_MODEL_AND_COMPLIANCE.md
│   └── PITCH_DECK_AND_ROADMAP.md
├── frontend/                      # Modern React user application
│   ├── src/
│   │   ├── App.tsx                # Fit Wizard, Policy Diff Engine, B2B Portal, AI Chat
│   │   └── types/                 # Frontend TypeScript definitions
│   └── package.json
├── docker-compose.yml             # Full-stack container deployment
└── .pre-commit-config.yaml        # Security & format pre-commit hooks
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optional, for DB & full containerized setup)

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Running with Docker Compose
```bash
docker-compose up -d
```

### 4. Running Manually

**Backend API Gateway:**
```bash
cd backend
npm install
npm run dev
```

**AI & RAG Service:**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend Application:**
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
