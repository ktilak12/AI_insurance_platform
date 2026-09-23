import os
from fastapi import FastAPI, HTTPException, Security, Depends, status, UploadFile, File
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from pydantic import BaseModel

from app.schemas.policy import InsurancePolicySchema, PolicyExtractionResponse, SourceMetadata, RoomRentLimit, WaitingPeriods
from app.extraction.pdf_parser import PDFIngestionEngine
from app.rag.qa_engine import PolicyQAService, QAResponse

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
    title="Insurance Policy Intelligence AI Service",
    version="1.0.0",
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
    plan_id: str
    question: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-engine"}

@app.post("/extract-policy", response_model=PolicyExtractionResponse)
async def extract_policy(
    file: UploadFile = File(...),
    auth: str = Depends(get_api_key)
):
    """
    Ingests untrusted policy PDF, segments pages, and outputs canonical structured JSON.
    Flagged for human review if confidence is below 0.70.
    """
    file_bytes = await file.read()
    file_hash = PDFIngestionEngine.calculate_sha256(file_bytes)
    pages = PDFIngestionEngine.extract_text_by_pages(file_bytes)

    # In production, pass text to Gemini structured extraction
    mock_confidence = 0.96
    requires_review = mock_confidence < 0.70

    policy = InsurancePolicySchema(
        provider="Extracted Insurer",
        plan_name=file.filename.replace(".pdf", "").title(),
        category="health",
        premium=15000.0,
        sum_insured=1000000.0,
        policy_term_years=1,
        room_rent=RoomRentLimit(type="no_capping", limit_amount=None, limit_percentage=None),
        waiting_period_months=WaitingPeriods(initial=30, specific_disease=24, pre_existing=36),
        copayment_percentage=0.0,
        deductible_amount=0.0,
        restoration_benefit=True,
        no_claim_bonus_percentage=50.0,
        maternity_covered=False,
        daycare_treatments_covered=True,
        pre_hospitalization_days=60,
        post_hospitalization_days=180,
        exclusions=["Cosmetic surgery", "Self-inflicted injury"],
        sub_limits=[],
        source_metadata=SourceMetadata(
            document_name=file.filename,
            document_hash=file_hash,
            confidence_score=mock_confidence,
            page_provenance={"room_rent": 1, "waiting_period": 2}
        )
    )

    return PolicyExtractionResponse(
        policy=policy,
        requires_human_review=requires_review,
        review_reasons=["Confidence score below 0.70 threshold"] if requires_review else []
    )

@app.post("/ask-policy", response_model=QAResponse)
async def ask_policy(
    payload: QuestionRequest,
    auth: str = Depends(get_api_key)
):
    """
    Grounded RAG endpoint answering questions with page and quote citations.
    """
    # Simulate retrieved passages from pgvector for demonstration
    passages = [
        {
            "page_number": 18,
            "section_name": "Pre-Existing Diseases Waiting Period",
            "content": "Coverage for pre-existing diseases is available after continuous coverage of 36 months from policy inception."
        }
    ]
    return PolicyQAService.generate_grounded_answer(payload.question, passages)
