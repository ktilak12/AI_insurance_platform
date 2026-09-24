from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ClauseDiff(BaseModel):
    clause_category: str = Field(..., description="room_rent, waiting_period, copay, deductible, restoration, exclusions, sub_limits, general")
    field_name: str
    old_value: str
    new_value: str
    impact: Literal["FAVORABLE", "RESTRICTIVE", "NEUTRAL"]
    explanation: str
    old_page: Optional[int] = None
    new_page: Optional[int] = None

class PolicyDiffSummary(BaseModel):
    favorable_count: int
    restrictive_count: int
    neutral_count: int
    overall_sentiment: Literal["IMPROVED", "DETERIORATED", "UNCHANGED", "MIXED"]
    executive_summary: str
    claims_impact_score: float = Field(..., ge=0.0, le=100.0, description="Score 0-100 indicating consumer favorability shift")

class PolicyVersionDiffResponse(BaseModel):
    base_plan_name: str
    base_version: str
    target_version: str
    summary: PolicyDiffSummary
    clause_diffs: List[ClauseDiff]
