from typing import Dict, Any, List, Tuple
from app.schemas.policy import InsurancePolicySchema

class ConfidenceScorer:
    """
    Evaluates extraction certainty and enforces human review thresholds.
    Requires manual review if overall confidence < 0.70 or critical fields are ambiguous.
    """

    REVIEW_THRESHOLD = 0.70

    @classmethod
    def score_extraction(
        cls, 
        policy: InsurancePolicySchema, 
        security_flags: List[str] = None
    ) -> Tuple[float, Dict[str, float], bool, List[str]]:
        """
        Calculates field-level confidence, aggregate score, and human review flags.
        Returns:
            - aggregate_score: float (0.0 to 1.0)
            - field_scores: Dict[str, float]
            - requires_human_review: bool
            - review_reasons: List[str]
        """
        field_scores: Dict[str, float] = {}
        review_reasons: List[str] = []

        # 1. Room Rent Confidence
        if policy.room_rent.type in ["no_capping", "single_private_room"]:
            field_scores["room_rent"] = 0.98
        elif policy.room_rent.type in ["fixed_amount", "percentage_of_sum_insured"]:
            if policy.room_rent.limit_amount or policy.room_rent.limit_percentage:
                field_scores["room_rent"] = 0.95
            else:
                field_scores["room_rent"] = 0.50
                review_reasons.append("Room rent limit type specified without numeric cap amount/percentage.")
        else:
            field_scores["room_rent"] = 0.40
            review_reasons.append("Unrecognized or ambiguous room rent restriction.")

        # 2. Waiting Periods Confidence
        wp = policy.waiting_period_months
        if wp.pre_existing > 0 and wp.pre_existing <= 48 and wp.initial >= 30:
            field_scores["waiting_periods"] = 0.97
        else:
            field_scores["waiting_periods"] = 0.60
            review_reasons.append(f"Pre-existing waiting period ({wp.pre_existing}m) is anomalous or missing.")

        # 3. Financials (Sum Insured & Premium)
        if policy.sum_insured >= 100000 and policy.premium >= 1000:
            field_scores["financials"] = 0.99
        elif policy.sum_insured > 0:
            field_scores["financials"] = 0.75
            review_reasons.append("Sum insured or annual premium appears unusually low or estimated.")
        else:
            field_scores["financials"] = 0.30
            review_reasons.append("Missing sum insured or base premium figure.")

        # 4. Exclusions Confidence
        if len(policy.exclusions) >= 2:
            field_scores["exclusions"] = 0.95
        elif len(policy.exclusions) == 1:
            field_scores["exclusions"] = 0.70
            review_reasons.append("Only single exclusion detected; policy wording may have unparsed exclusion tables.")
        else:
            field_scores["exclusions"] = 0.45
            review_reasons.append("Zero exclusions extracted from policy contract; requires human verification.")

        # 5. Provenance Grounding
        prov = policy.source_metadata.page_provenance
        if prov and len(prov) >= 2:
            field_scores["provenance"] = 0.98
        else:
            field_scores["provenance"] = 0.55
            review_reasons.append("Weak page provenance mapping (fewer than 2 verifiable page citations).")

        # 6. Prompt Injection / Security Flags Penalty
        if security_flags and len(security_flags) > 0:
            field_scores["security"] = 0.20
            review_reasons.append(f"Security Warning: PDF contains {len(security_flags)} prompt injection indicator(s).")
        else:
            field_scores["security"] = 1.0

        # Calculate weighted average
        weights = {
            "room_rent": 0.25,
            "waiting_periods": 0.25,
            "financials": 0.20,
            "exclusions": 0.15,
            "provenance": 0.15
        }

        base_score = sum(field_scores[k] * weights[k] for k in weights)

        # Apply security multiplier
        if field_scores["security"] < 1.0:
            base_score = base_score * 0.5  # Heavy penalty for untrusted/injected documents

        aggregate_score = round(max(0.05, min(0.99, base_score)), 2)

        # Trigger human review if below threshold or if critical fields flagged
        requires_human_review = (aggregate_score < cls.REVIEW_THRESHOLD) or (len(review_reasons) > 0 and aggregate_score < 0.85)

        return aggregate_score, field_scores, requires_human_review, review_reasons
