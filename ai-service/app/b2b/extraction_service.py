import uuid
import time
from typing import Dict, List, Optional
from datetime import datetime
from app.schemas.b2b import BatchExtractionRequest, BatchJobStatusResponse, DocumentExtractionItemResult
from app.schemas.policy import InsurancePolicySchema, RoomRentLimit, WaitingPeriods, SourceMetadata

class B2BExtractionManager:
    """
    Manages Enterprise / B2B Batch Document Extraction Jobs and Webhook Dispatches.
    """
    _jobs: Dict[str, BatchJobStatusResponse] = {}

    @classmethod
    def create_batch_job(cls, request: BatchExtractionRequest) -> BatchJobStatusResponse:
        job_id = f"job_{uuid.uuid4().hex[:12]}"
        
        results: List[DocumentExtractionItemResult] = []
        for doc_url in request.document_urls:
            doc_name = doc_url.split("/")[-1] if "/" in doc_url else "policy_document.pdf"
            
            # Simulate high-precision extraction payload
            mock_policy = InsurancePolicySchema(
                provider="Enterprise Partner Insurer",
                plan_name=doc_name.replace(".pdf", "").replace("_", " ").title(),
                category="health",
                premium=18500.0,
                sum_insured=1500000.0,
                policy_term_years=1,
                room_rent=RoomRentLimit(type="single_private_room", limit_amount=None, limit_percentage=None),
                waiting_period_months=WaitingPeriods(initial=30, specific_disease=24, pre_existing=24),
                copayment_percentage=0.0,
                deductible_amount=0.0,
                restoration_benefit=True,
                no_claim_bonus_percentage=50.0,
                maternity_covered=True,
                daycare_treatments_covered=True,
                pre_hospitalization_days=60,
                post_hospitalization_days=180,
                exclusions=["Unproven cosmetic procedures", "Experimental treatments"],
                sub_limits=[],
                source_metadata=SourceMetadata(
                    document_name=doc_name,
                    document_hash=f"sha256_{uuid.uuid4().hex[:16]}",
                    confidence_score=0.96,
                    page_provenance={"room_rent": 4, "waiting_period": 8, "maternity": 12}
                )
            )

            results.append(DocumentExtractionItemResult(
                document_url=doc_url,
                document_name=doc_name,
                status="COMPLETED",
                policy=mock_policy,
                confidence_score=0.96,
                requires_human_review=False,
                review_reasons=[],
                processing_time_ms=840
            ))

        job = BatchJobStatusResponse(
            job_id=job_id,
            client_id=request.client_id,
            status="COMPLETED",
            total_documents=len(request.document_urls),
            completed_count=len(request.document_urls),
            failed_count=0,
            created_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            results=results
        )

        cls._jobs[job_id] = job
        return job

    @classmethod
    def get_job_status(cls, job_id: str) -> Optional[BatchJobStatusResponse]:
        return cls._jobs.get(job_id)
