from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class RoomRentLimit(BaseModel):
    type: str = Field(..., description="no_capping, percentage_of_sum_insured, fixed_amount, single_private_room")
    limit_amount: Optional[float] = None
    limit_percentage: Optional[float] = None

class ICULimit(BaseModel):
    type: str = Field(..., description="no_capping, percentage_of_sum_insured, fixed_amount")
    limit_amount: Optional[float] = None

class WaitingPeriods(BaseModel):
    initial: int = Field(default=30, description="Initial waiting period in days")
    specific_disease: int = Field(default=24, description="Waiting period for specific diseases in months")
    pre_existing: int = Field(default=36, description="Waiting period for pre-existing diseases in months")

class SubLimit(BaseModel):
    treatment_name: str
    limit_amount: float

class SourceMetadata(BaseModel):
    document_name: str
    document_hash: str
    extracted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    page_provenance: Dict[str, int] = Field(default_factory=dict, description="Field to page number mapping")

class InsurancePolicySchema(BaseModel):
    provider: str
    plan_name: str
    category: str = "health"
    premium: float = Field(..., ge=0)
    sum_insured: float = Field(..., ge=0)
    policy_term_years: int = 1
    room_rent: RoomRentLimit
    icu_limit: Optional[ICULimit] = None
    waiting_period_months: WaitingPeriods
    copayment_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    deductible_amount: float = Field(default=0.0, ge=0.0)
    restoration_benefit: bool = False
    no_claim_bonus_percentage: float = 0.0
    maternity_covered: bool = False
    daycare_treatments_covered: bool = True
    pre_hospitalization_days: int = 60
    post_hospitalization_days: int = 180
    exclusions: List[str] = Field(default_factory=list)
    sub_limits: List[SubLimit] = Field(default_factory=list)
    source_metadata: SourceMetadata

class PolicyExtractionResponse(BaseModel):
    policy: InsurancePolicySchema
    requires_human_review: bool
    review_reasons: List[str] = Field(default_factory=list)
