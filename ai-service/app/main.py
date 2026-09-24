import os
from fastapi import FastAPI, HTTPException, Security, Depends, status, UploadFile, File
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.schemas.policy import InsurancePolicySchema, PolicyExtractionResponse
from app.schemas.diff import PolicyVersionDiffResponse
from app.schemas.b2b import BatchExtractionRequest, BatchJobStatusResponse
from app.extraction.pdf_parser import PDFIngestionEngine, PDFSecurityException
from app.extraction.llm_extractor import LLMExtractionEngine
from app.rag.vector_store import rag_vector_store
from app.rag.qa_engine import PolicyQAService, QAResponse
from app.diff.diff_engine import PolicyDiffEngine
from app.b2b.extraction_service import B2BExtractionManager
from app.evaluation.evaluator import ModelEvaluator

API_KEY_NAME = "X-Internal-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET", "change_me_to_a_random_secure_64_char_secret_key")

def get_api_key(api_key: str = Security(api_key_header)):
    if api_key == INTERNAL_SECRET:
        return api_key
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate internal API credentials"
    )

app = FastAPI(
    title="PolicyLens AI — AI & RAG Core Intelligence Engine",
    version="1.2.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    plan_id: Optional[str] = "default"
    question: str

class PolicyCompareRequest(BaseModel):
    old_policy: InsurancePolicySchema
    new_policy: InsurancePolicySchema

class IndexDocumentRequest(BaseModel):
    plan_id: str
    document_name: str
    chunks: List[Dict[str, Any]]

class SemanticSearchRequest(BaseModel):
    query: str
    plan_id: Optional[str] = None
    top_k: int = 3

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai-rag-core",
        "vector_store": "pgvector" if rag_vector_store.use_pgvector else "in-memory-cosine",
        "modules": [
            "3.1 PyMuPDF Ingestion & Injection Defense",
            "3.2 LLM Extraction Engine",
            "3.3 Confidence Scoring (<0.70 Human Review)",
            "3.4 pgvector RAG Pipeline",
            "3.5 120-Question Benchmark Evaluator"
        ]
    }

# 3.1 & 3.2 & 3.3: Secure PDF Ingestion, LLM Extraction, and Confidence Scoring
@app.post("/extract-policy", response_model=PolicyExtractionResponse)
async def extract_policy(
    file: UploadFile = File(...),
    auth: str = Depends(get_api_key)
):
    """
    Ingests untrusted policy PDF, segments pages, checks security boundaries,
    and extracts canonical structured JSON with confidence scoring.
    """
    try:
        file_bytes = await file.read()
        file_hash = PDFIngestionEngine.calculate_sha256(file_bytes)
        pages = PDFIngestionEngine.extract_text_by_pages(file_bytes)

        # Chunk and index into RAG vector store for instant Q&A
        chunks = PDFIngestionEngine.chunk_document(pages)
        plan_id = file.filename.replace(".pdf", "").lower()
        rag_vector_store.index_chunks(plan_id, file.filename, chunks)

        # Extract structured canonical schema with LLM / fallback
        extraction_result = await LLMExtractionEngine.extract_structured_policy(
            pages=pages,
            document_name=file.filename,
            file_hash=file_hash
        )

        return extraction_result

    except PDFSecurityException as sec_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security Rejection: {str(sec_err)}"
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Extraction failure: {str(err)}"
        )

# 3.4: RAG Pipeline Grounded QA Endpoint
@app.post("/ask-policy", response_model=QAResponse)
async def ask_policy(
    payload: QuestionRequest,
    auth: str = Depends(get_api_key)
):
    """
    Grounded RAG endpoint answering questions strictly backed by policy PDF excerpts
    with verifiable page and quote citations.
    """
    return PolicyQAService.answer_question(payload.question, plan_id=payload.plan_id)

# 3.4: RAG Semantic Search
@app.post("/rag/search")
async def search_passages(
    payload: SemanticSearchRequest,
    auth: str = Depends(get_api_key)
):
    """
    Semantic search across indexed policy chunks using pgvector / cosine distance.
    """
    passages = rag_vector_store.search_similar_passages(
        payload.query, 
        plan_id=payload.plan_id, 
        top_k=payload.top_k
    )
    return {"query": payload.query, "count": len(passages), "passages": passages}

# 3.5: Automated Benchmark Evaluation Runner
@app.get("/evaluation/run")
def run_evaluation_benchmark(auth: str = Depends(get_api_key)):
    """
    Runs automated benchmark evaluation on 120 questions across grounding,
    citation accuracy, and prompt injection defense.
    """
    results = ModelEvaluator.run_evaluation()
    return results

# Phase 3 Diff Engine & B2B Batch Extraction
@app.post("/compare-versions", response_model=PolicyVersionDiffResponse)
async def compare_versions(
    payload: PolicyCompareRequest,
    auth: str = Depends(get_api_key)
):
    return PolicyDiffEngine.compare_policies(payload.old_policy, payload.new_policy)

@app.post("/b2b/extract-batch", response_model=BatchJobStatusResponse)
async def extract_batch_b2b(
    payload: BatchExtractionRequest,
    auth: str = Depends(get_api_key)
):
    return B2BExtractionManager.create_batch_job(payload)

@app.get("/b2b/jobs/{job_id}", response_model=BatchJobStatusResponse)
async def get_b2b_job(
    job_id: str,
    auth: str = Depends(get_api_key)
):
    job = B2BExtractionManager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch job not found")
    return job
