from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.policy import InsurancePolicySchema

class BatchExtractionRequest(BaseModel):
    client_id: str
    document_urls: List[str]
    webhook_url: Optional[str] = None
    priority: Literal["low", "standard", "high"] = "standard"

class DocumentExtractionItemResult(BaseModel):
    document_url: str
    document_name: str
    status: Literal["PENDING", "PROCESSING", "COMPLETED", "FAILED"]
    policy: Optional[InsurancePolicySchema] = None
    confidence_score: float = 0.0
    requires_human_review: bool = False
    review_reasons: List[str] = Field(default_factory=list)
    processing_time_ms: int = 0
    error_message: Optional[str] = None

class BatchJobStatusResponse(BaseModel):
    job_id: str
    client_id: str
    status: Literal["QUEUED", "PROCESSING", "COMPLETED", "PARTIALLY_FAILED", "FAILED"]
    total_documents: int
    completed_count: int
    failed_count: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    results: List[DocumentExtractionItemResult] = Field(default_factory=list)

class B2BExtractionResponse(BaseModel):
    job_id: str
    status: str
    message: str
    estimated_seconds: int
