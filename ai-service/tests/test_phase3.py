import pytest
from app.schemas.policy import InsurancePolicySchema, RoomRentLimit, WaitingPeriods, SourceMetadata
from app.diff.diff_engine import PolicyDiffEngine
from app.schemas.b2b import BatchExtractionRequest
from app.b2b.extraction_service import B2BExtractionManager

def get_dummy_policy(name="Plan A", premium=15000.0, ped_wait=36, room_type="fixed_amount", copay=10.0):
    return InsurancePolicySchema(
        provider="Sample Insurer",
        plan_name=name,
        category="health",
        premium=premium,
        sum_insured=1000000.0,
        policy_term_years=1,
        room_rent=RoomRentLimit(type=room_type, limit_amount=5000.0 if room_type=="fixed_amount" else None),
        waiting_period_months=WaitingPeriods(initial=30, specific_disease=24, pre_existing=ped_wait),
        copayment_percentage=copay,
        deductible_amount=0.0,
        restoration_benefit=True,
        no_claim_bonus_percentage=50.0,
        maternity_covered=False,
        daycare_treatments_covered=True,
        pre_hospitalization_days=60,
        post_hospitalization_days=180,
        exclusions=["Cosmetic surgery"],
        sub_limits=[],
        source_metadata=SourceMetadata(
            document_name="doc.pdf",
            document_hash="hash123",
            confidence_score=0.95,
            page_provenance={"room_rent": 5, "waiting_period": 8}
        )
    )

def test_diff_engine_favorable_changes():
    old_p = get_dummy_policy(name="Care 2024", ped_wait=36, room_type="fixed_amount", copay=10.0)
    new_p = get_dummy_policy(name="Care 2026", ped_wait=24, room_type="single_private_room", copay=0.0)
    
    result = PolicyDiffEngine.compare_policies(old_p, new_p)
    assert result.summary.favorable_count >= 3
    assert result.summary.overall_sentiment == "IMPROVED"
    assert result.summary.claims_impact_score > 50

def test_b2b_batch_extraction():
    req = BatchExtractionRequest(
        client_id="partner_broker_01",
        document_urls=["https://storage.example.com/policies/hdfc_optima.pdf"]
    )
    job = B2BExtractionManager.create_batch_job(req)
    assert job.job_id.startswith("job_")
    assert job.status == "COMPLETED"
    assert len(job.results) == 1
    assert job.results[0].confidence_score >= 0.90
