# 🛡️ InsureAI

### AI-Powered Insurance Policy Intelligence & Comparison Platform

> **Understand insurance. Compare policies. Ask questions. Make informed decisions.**

InsureAI is an AI-powered insurance intelligence platform designed to simplify the process of understanding and comparing insurance policies.

Insurance policies are often long, complex, and difficult to compare. InsureAI uses **AI, NLP, document intelligence, RAG, and explainable comparison algorithms** to convert complex policy documents into structured information that users can easily understand.

Instead of asking users to read dozens of pages of policy documents, InsureAI extracts important information, compares available plans based on user requirements, highlights important limitations, and provides evidence-backed answers from the original policy documents.

---

## 🚀 Why InsureAI?

Choosing insurance can involve comparing:

* Premium
* Coverage amount
* Waiting periods
* Deductibles
* Co-payment
* Room-rent limits
* Hospitalization benefits
* Exclusions
* Sub-limits
* Restoration benefits
* Maternity coverage
* Network hospitals
* Claim-related conditions

These details are often spread across long policy documents and different insurer websites.

### InsureAI aims to simplify this process:

```text
Insurance Documents
        ↓
AI Document Intelligence
        ↓
Structured Policy Data
        ↓
Comparison Engine
        ↓
Personalized Requirement Matching
        ↓
Explainable Results
        ↓
AI Policy Assistant
```

---

# 🎯 Core Objectives

InsureAI is designed around five major goals:

### 1. Simplify Insurance

Convert complex insurance language into simple, understandable information.

### 2. Compare Policies

Normalize policy information so users can compare plans using the same set of attributes.

### 3. Personalize Comparison

Understand the user's requirements and identify which policy features match those requirements.

### 4. Provide Evidence

Every important extracted fact should be traceable to its source document and page whenever possible.

### 5. Reduce AI Hallucination

The AI assistant uses retrieved policy content rather than relying only on general model knowledge.

---

# ✨ Key Features

## 🏥 Insurance Category Selection

Users can select the type of insurance they want to explore.

Initial MVP:

* Health Insurance

Planned:

* 🚗 Motor Insurance
* ✈️ Travel Insurance
* 🏠 Home Insurance
* ❤️ Life Insurance
* 🐾 Pet Insurance
* 🏢 Business Insurance

---

## 👤 Personalized Requirement Profile

Users provide their requirements through a simple questionnaire.

Example:

```text
Age: 24
Location: Chennai
Coverage Required: ₹10 Lakhs
Budget: ₹20,000/year

Preferences:
✓ Low waiting period
✓ Low/no co-payment
✓ High hospitalization coverage
✓ Restoration benefit
```

The platform converts these requirements into a structured profile.

---

# 📊 Policy Comparison

Insurance policies are converted into a common structure.

Example:

| Feature        | Plan A   | Plan B  | Plan C  |
| -------------- | -------- | ------- | ------- |
| Annual Premium | ₹14,500  | ₹17,200 | ₹12,800 |
| Coverage       | ₹10L     | ₹15L    | ₹10L    |
| Waiting Period | 3 Years  | 2 Years | 4 Years |
| Co-payment     | 0%       | 10%     | 20%     |
| Restoration    | Yes      | Yes     | No      |
| Room Rent      | No Limit | Limited | Limited |

The user can inspect the underlying policy information rather than relying on a single unexplained AI output.

---

# 🤖 AI Policy Intelligence

The platform can process insurance policy documents and extract structured information.

### Input

```text
Insurance Policy PDF
```

### Processing

```text
PDF
 ↓
Text Extraction
 ↓
Document Segmentation
 ↓
LLM Structured Extraction
 ↓
Schema Validation
 ↓
Confidence Checking
 ↓
Database
```

### Output

```json
{
  "plan_name": "Example Health Plan",
  "category": "health",
  "sum_insured": 1000000,
  "annual_premium": 14500,
  "pre_existing_waiting_period": "3 years",
  "copayment": "0%",
  "restoration": true,
  "maternity": false
}
```

---

# 🔎 RAG-Based Policy Assistant

Users can ask questions about a policy.

### Example

**User:**

> Does this policy cover pre-existing diseases?

**InsureAI:**

> The policy provides coverage for pre-existing diseases subject to the waiting period specified in the policy terms.

**Source:** Policy Document → Page 24

The goal is to provide **grounded answers with supporting policy content** rather than unsupported AI responses.

---

# 🧠 AI Architecture

InsureAI uses multiple AI components instead of treating one LLM as the entire system.

```text
                    ┌────────────────────┐
                    │ Insurance Documents│
                    └─────────┬──────────┘
                              ↓
                 ┌─────────────────────────┐
                 │ Document Intelligence   │
                 │ PDF / OCR / NLP         │
                 └───────────┬─────────────┘
                             ↓
                 ┌─────────────────────────┐
                 │ Structured Extraction   │
                 │ LLM + Pydantic          │
                 └───────────┬─────────────┘
                             ↓
                ┌───────────────────────────┐
                │ Normalized Policy Database│
                └─────────────┬─────────────┘
                              ↓
               ┌──────────────┴──────────────┐
               ↓                             ↓
       Comparison Engine                 Vector DB
               ↓                             ↓
       User Requirements                    RAG
               ↓                             ↓
               └──────────────┬──────────────┘
                              ↓
                    Explainable Results
```

---

# 🧮 Personalized Fit Engine

InsureAI does not depend on a black-box recommendation.

The comparison engine evaluates how closely each policy matches the user's stated requirements.

Example factors:

```text
Coverage Requirement
        ↓
Premium Budget
        ↓
Waiting Period
        ↓
Co-payment
        ↓
Deductible
        ↓
Required Benefits
        ↓
User Preferences
```

The system can produce an explainable breakdown such as:

```text
✓ Coverage matches requirement
✓ Premium within selected budget
✓ Waiting period meets preference
✓ Restoration benefit available
⚠ 10% co-payment
⚠ Maternity not included
```

This makes the result easier to understand and audit.

---

# 📚 Policy Data Provenance

A major design principle of InsureAI is **traceability**.

Each important policy attribute should ideally maintain:

```json
{
  "field": "pre_existing_waiting_period",
  "value": "3 years",
  "source_document": "policy_wording.pdf",
  "page": 24,
  "confidence": 0.96,
  "last_verified": "2026-09-23"
}
```

This allows users and internal reviewers to understand where information came from.

---

# 🛡️ AI Safety Principles

Insurance is a high-impact domain, so the platform is designed around several principles:

### Evidence First

Important answers should be grounded in available policy documents.

### No Unsupported Claims

If the system cannot verify information, it should clearly communicate that limitation.

### Source Transparency

Important extracted information should retain its source.

### Human Review

Low-confidence document extraction can be flagged for review.

### Clear Language

Complex insurance terms should be explained in simple language without changing their meaning.

### User Decision Support

The platform is intended to help users understand and compare policy information, not replace professional or insurer advice.

---

# 🏗️ System Architecture

```text
                         ┌─────────────┐
                         │    User     │
                         └──────┬──────┘
                                │
                                ↓
                       ┌────────────────┐
                       │ React Frontend │
                       └───────┬────────┘
                               │
                               ↓
                       ┌────────────────┐
                       │ Node.js API    │
                       │ Express        │
                       └───────┬────────┘
                               │
               ┌───────────────┼────────────────┐
               ↓               ↓                ↓
        ┌────────────┐  ┌────────────┐   ┌─────────────┐
        │ PostgreSQL │  │ AI Service │   │ Auth        │
        │            │  │ FastAPI    │   │ JWT/OAuth   │
        └────────────┘  └─────┬──────┘   └─────────────┘
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
             Document AI              RAG
                    │                   │
                    ↓                   ↓
              PDF Processing       pgvector
```

---

# 🧰 Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

## Backend

* Node.js
* Express.js
* TypeScript

## AI / Machine Learning

* Python
* FastAPI
* Pandas
* NumPy
* scikit-learn
* XGBoost
* LLM APIs
* NLP
* RAG

## Document Intelligence

* PyMuPDF
* OCR
* Pydantic
* Structured LLM extraction

## Database

* PostgreSQL
* pgvector

## Authentication

* JWT
* OAuth

## Development

* Git
* GitHub
* VS Code
* Docker

---

# 📁 Project Structure

```text
insureai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
├── ai-service/
│   ├── app/
│   │   ├── extraction/
│   │   ├── rag/
│   │   ├── embeddings/
│   │   ├── recommendation/
│   │   ├── evaluation/
│   │   └── schemas/
│   │
│   ├── tests/
│   └── requirements.txt
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── documents/
│
├── evaluation/
│   ├── datasets/
│   ├── expected_answers/
│   └── reports/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── product/
│
├── infrastructure/
│   ├── docker/
│   └── deployment/
│
├── .env.example
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

# 🗄️ Core Data Model

```text
Users
 │
 ├── User Preferences
 │
 └── Comparison Sessions

Insurance Categories
 │
 └── Insurance Plans
          │
          ├── Plan Features
          ├── Exclusions
          ├── Coverage
          ├── Pricing
          └── Documents
                    │
                    └── Document Chunks
```

---

# 🔄 Data Pipeline

```text
                   POLICY DOCUMENT
                         │
                         ↓
                  Text Extraction
                         │
                         ↓
                   Page Splitting
                         │
                         ↓
                     Chunking
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
       Structured Extraction      Embeddings
             ↓                       ↓
        Validation                pgvector
             ↓                       ↓
        PostgreSQL                  RAG
             │                       │
             └───────────┬───────────┘
                         ↓
                   Application
```

---

# 📈 AI Evaluation

The AI system is evaluated using a dedicated test dataset.

Example evaluation questions:

```text
What is the waiting period?

Does the plan cover maternity?

Is there a room-rent limit?

What is the co-payment?

What are the major exclusions?

Does restoration apply?
```

### Metrics

| Metric                     | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| Extraction Accuracy        | Measures structured field extraction                   |
| Retrieval Accuracy         | Measures whether correct policy sections are retrieved |
| Answer Accuracy            | Measures correctness of AI answers                     |
| Citation Accuracy          | Checks whether evidence supports the answer            |
| Recommendation Consistency | Checks repeatability of comparison results             |

---

# 🗺️ Product Roadmap

## Phase 1: MVP

### Health Insurance

* Policy ingestion
* Document extraction
* Policy comparison
* User requirements
* Personalized fit analysis
* RAG assistant
* Source references

---

## Phase 2: Expansion

```text
Health
   ↓
Motor
   ↓
Travel
   ↓
Home
   ↓
Life
```

Additional features:

* Saved comparisons
* Policy alerts
* Renewal reminders
* Policy history
* Improved recommendation models

---

## Phase 3: Insurance Intelligence Platform

Future capabilities:

### 🔄 Policy Change Detection

Compare policy versions and identify changes.

### 📄 Existing Policy Analysis

Upload an existing policy and understand its major terms.

### 🤖 Insurance AI Assistant

Ask questions about insurance concepts and policy documents.

### 🔌 Insurance Intelligence API

Allow other applications to use policy extraction and comparison capabilities.

### 🏢 B2B Platform

Potential applications for:

* Insurance technology companies
* Brokers
* Financial platforms
* Enterprise benefits platforms
* Insurance operations teams

---

# 🔐 Security

Security is a core requirement because insurance documents may contain sensitive information.

Planned controls include:

* Password hashing
* JWT/OAuth authentication
* API rate limiting
* Input validation
* Secure environment variables
* Database access control
* Encryption in transit
* Secure document processing
* Audit logs
* File validation
* Prompt-injection protection
* Access-controlled policy documents

---

# ⚙️ Local Development

## Prerequisites

Install:

```text
Node.js
Python 3.11+
PostgreSQL
Git
Docker
```

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/insureai.git

cd insureai
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## AI Service

```bash
cd ai-service

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload
```

---

# 🔑 Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL=
JWT_SECRET=
LLM_API_KEY=
EMBEDDING_API_KEY=
VECTOR_DATABASE_URL=
```

Never commit real API keys.

---

# 🧪 Testing

Run frontend tests:

```bash
npm test
```

Backend tests:

```bash
npm run test
```

Python tests:

```bash
pytest
```

---

# 🐳 Docker

Start the development environment:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

---

# 📡 Example API

### Upload Policy

```http
POST /api/policies/upload
```

### Extract Policy

```http
POST /api/policies/{id}/extract
```

### Compare Plans

```http
POST /api/comparison
```

### Ask Policy AI

```http
POST /api/policies/{id}/ask
```

### Get Plan

```http
GET /api/plans/{id}
```

---

# 💡 Example User Flow

```text
User opens InsureAI
        ↓
Selects Health Insurance
        ↓
Enters requirements
        ↓
System retrieves available policy information
        ↓
Plans are normalized
        ↓
Comparison engine evaluates requirements
        ↓
User explores plan details
        ↓
User asks Policy AI a question
        ↓
RAG retrieves relevant policy section
        ↓
AI generates evidence-backed response
        ↓
User reviews information and makes their own decision
```

---

# 🌱 Startup Vision

The long-term goal of InsureAI is to build an **insurance intelligence layer** that makes complex insurance information easier for people and organizations to understand.

```text
             INSURANCE DOCUMENTS
                     │
                     ↓
              POLICY INTELLIGENCE
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Compare     Explain    Search
          │          │          │
          └──────────┼──────────┘
                     ↓
              Better Understanding
```

The platform can eventually evolve from a consumer comparison product into infrastructure for insurance intelligence across multiple applications.

---

# ⚠️ Disclaimer

InsureAI is intended to provide insurance information, document analysis, and comparison support.

Insurance policies contain detailed terms, conditions, exclusions, limits, and eligibility requirements. Users should review the applicable policy documents and seek appropriate professional or insurer guidance before making insurance decisions.

Information displayed by the platform should be verified against the applicable and current policy documentation.

The commercial operation of an insurance comparison, lead-generation, solicitation, or distribution platform may be subject to applicable insurance and intermediary regulations. Regulatory requirements should be reviewed with qualified legal/compliance professionals before commercial launch.

---

# 🤝 Contributing

Contributions are welcome.

### Development process

```text
Fork
 ↓
Create branch
 ↓
Make changes
 ↓
Write tests
 ↓
Create Pull Request
 ↓
Code Review
 ↓
Merge
```

Example:

```bash
git checkout -b feature/policy-rag
```

---

# 📜 License

This project is currently intended for development and research purposes.

License terms will be updated before public/commercial release.

---

# 👨‍💻 Team

**InsureAI**

Building intelligent tools for understanding complex insurance information.

---

## ⭐ Project Status

```text
🚧 Active Development
```

### Current Focus

```text
[✓] Product Architecture
[✓] Insurance Data Model
[ ] Policy Document Pipeline
[ ] AI Extraction
[ ] Comparison Engine
[ ] RAG Assistant
[ ] Frontend MVP
[ ] Evaluation Framework
[ ] Beta Testing
[ ] Production Deployment
```

---

# 🔮 Future

> **Insurance shouldn't require a law degree and a highlighter.**

InsureAI is building the intelligence layer between complex insurance documents and the people trying to understand them.

**Understand → Compare → Verify → Decide**
