# 🛡️ PolicyLens AI — AI Insurance Intelligence Platform

> **"We turn complicated insurance policies into comparable facts and explain which plans fit your requirements, with evidence from the policy documents."**

Built with enterprise-grade security and IRDAI-compliant transparent comparisons.

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
│   │   ├── extraction/            # PyMuPDF parser & prompt injection defense
│   │   ├── rag/                   # Grounded QA engine with page citations
│   │   ├── evaluation/            # Automated benchmark evaluation QA dataset
│   │   ├── schemas/               # Pydantic structured output models
│   │   └── main.py                # FastAPI endpoints
│   ├── tests/                     # Pytest suite
│   └── requirements.txt
├── backend/                       # Node.js Express API Gateway
│   ├── src/
│   │   ├── services/              # Non-manipulative Fit Comparison Engine
│   │   ├── middleware/            # JWT auth & security filters
│   │   ├── types/                 # Shared TypeScript interfaces
│   │   └── index.ts               # Express entrypoint
│   └── package.json
├── database/                      # PostgreSQL DDL, migrations, and canonical schemas
│   ├── migrations/                # pgvector & relational schema scripts
│   ├── schemas/                   # Canonical Insurance Policy JSON Schema
│   └── seeds/                     # Standardized health policy seed data
├── docs/                          # Architecture, ER diagrams, Security & Business specs
│   ├── ARCHITECTURE.md
│   ├── ER_DIAGRAM.md
│   ├── SECURITY.md
│   ├── BUSINESS_MODEL_AND_COMPLIANCE.md
│   └── PITCH_DECK_AND_ROADMAP.md
├── frontend/                      # Modern React user application
│   ├── src/
│   │   ├── App.tsx                # Requirement wizard, comparison cards, AI chat
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
