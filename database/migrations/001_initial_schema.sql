-- Enable pgvector extension for semantic search and RAG embeddings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Insurers Table
CREATE TABLE IF NOT EXISTS insurers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    cin VARCHAR(100),
    irdai_registration_no VARCHAR(100),
    claim_settlement_ratio NUMERIC(5, 2),
    network_hospitals_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insurance Plans Table
CREATE TABLE IF NOT EXISTS insurance_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insurer_id UUID NOT NULL REFERENCES insurers(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL DEFAULT 'health',
    plan_name VARCHAR(255) NOT NULL,
    uin_no VARCHAR(100),
    min_sum_insured NUMERIC(12, 2) NOT NULL,
    max_sum_insured NUMERIC(12, 2) NOT NULL,
    starting_premium NUMERIC(10, 2) NOT NULL,
    copay_percentage NUMERIC(5, 2) DEFAULT 0.0,
    pre_existing_waiting_months INT DEFAULT 36,
    initial_waiting_days INT DEFAULT 30,
    specific_disease_waiting_months INT DEFAULT 24,
    restoration_benefit BOOLEAN DEFAULT FALSE,
    maternity_covered BOOLEAN DEFAULT FALSE,
    room_rent_capping_type VARCHAR(50) DEFAULT 'no_capping',
    raw_policy_json JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Policy Documents & Ingestion Provenance
CREATE TABLE IF NOT EXISTS policy_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES insurance_plans(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    file_url TEXT NOT NULL,
    total_pages INT NOT NULL,
    extraction_confidence NUMERIC(4, 3) NOT NULL,
    extraction_status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'review_required'
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Document Chunks & Vector Store (for Grounded RAG)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES policy_documents(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES insurance_plans(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    section_name VARCHAR(255),
    content TEXT NOT NULL,
    embedding vector(768), -- Dimension compatible with Gemini / modern embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for high performance cosine distance similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 5. Users & Requirement Profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'compliance_officer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_requirement_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    age INT,
    city VARCHAR(100),
    family_members_count INT DEFAULT 1,
    budget_max NUMERIC(10, 2),
    sum_insured_target NUMERIC(12, 2),
    max_acceptable_waiting_months INT,
    pre_existing_conditions TEXT[],
    importance_weights JSONB, -- { "premium": 0.4, "waiting_period": 0.3, "coverage": 0.3 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit & Compliance Logs (Strict IRDAI non-bias tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    payload JSONB,
    response_metadata JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
