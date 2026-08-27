-- AccessFlow AI Database Schema
-- Supabase PostgreSQL Migration 001

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. User Accessibility Profiles Table
CREATE TABLE IF NOT EXISTS user_accessibility_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
    explanation_level VARCHAR(20) NOT NULL DEFAULT 'simple' CHECK (explanation_level IN ('simple', 'detailed')),
    guidance_mode VARCHAR(30) NOT NULL DEFAULT 'step_by_step' CHECK (guidance_mode IN ('step_by_step')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_accessibility_profiles(user_id);

-- 4. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'analyzing', 'ready', 'failed')),
    raw_extracted_text TEXT,
    document_title VARCHAR(255),
    document_type VARCHAR(100),
    ai_analysis JSONB,
    ai_analysis_confidence VARCHAR(50) DEFAULT 'confirmed' CHECK (ai_analysis_confidence IN ('confirmed', 'uncertain')),
    processing_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- 5. Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    total_steps INTEGER NOT NULL DEFAULT 0,
    completed_steps INTEGER NOT NULL DEFAULT 0,
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    readiness_status VARCHAR(50) NOT NULL DEFAULT 'NOT_READY' CHECK (readiness_status IN ('READY_FOR_FINAL_REVIEW', 'NOT_READY')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_document_id ON workflows(document_id);

-- 6. Workflow Steps Table
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    official_instruction TEXT NOT NULL,
    simplified_explanation TEXT NOT NULL,
    field_payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    is_required BOOLEAN NOT NULL DEFAULT true,
    confidence VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (confidence IN ('confirmed', 'uncertain')),
    source_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workflow_id, step_order)
);

CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_order ON workflow_steps(workflow_id, step_order);

-- 7. Workflow Requirements Table
CREATE TABLE IF NOT EXISTS workflow_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    step_id UUID REFERENCES workflow_steps(id) ON DELETE SET NULL,
    requirement_type VARCHAR(50) NOT NULL DEFAULT 'document' CHECK (requirement_type IN ('document', 'action', 'eligibility', 'information')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT true,
    is_satisfied BOOLEAN NOT NULL DEFAULT false,
    confidence VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (confidence IN ('confirmed', 'uncertain')),
    source_text TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'satisfied', 'missing')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requirements_workflow_id ON workflow_requirements(workflow_id);
CREATE INDEX IF NOT EXISTS idx_requirements_step_id ON workflow_requirements(step_id);

-- 8. AI Interactions Table
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    step_id UUID REFERENCES workflow_steps(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    grounded BOOLEAN NOT NULL DEFAULT true,
    confidence VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (confidence IN ('confirmed', 'uncertain')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_workflow ON ai_interactions(workflow_id);

-- 9. Storage Bucket Setup (if Supabase storage is used)
-- Note: Create a private bucket named 'documents' in Supabase dashboard or via API
