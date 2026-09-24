from typing import List, Dict, Any
from app.schemas.policy import InsurancePolicySchema
from app.schemas.diff import ClauseDiff, PolicyDiffSummary, PolicyVersionDiffResponse

class PolicyDiffEngine:
    """
    Semantic Policy Comparison & Version Diff Engine.
    Identifies clause modifications and classifies their impact on consumer claims.
    """

    @staticmethod
    def compare_policies(old_policy: InsurancePolicySchema, new_policy: InsurancePolicySchema) -> PolicyVersionDiffResponse:
        diffs: List[ClauseDiff] = []

        # 1. Premium & Financials
        if old_policy.premium != new_policy.premium:
            diff_amount = new_policy.premium - old_policy.premium
            pct = ((new_policy.premium - old_policy.premium) / old_policy.premium) * 100
            diffs.append(ClauseDiff(
                clause_category="financials",
                field_name="Annual Base Premium",
                old_value=f"₹{old_policy.premium:,.0f}",
                new_value=f"₹{new_policy.premium:,.0f}",
                impact="RESTRICTIVE" if diff_amount > 0 else "FAVORABLE",
                explanation=f"Premium {'increased' if diff_amount > 0 else 'decreased'} by {abs(pct):.1f}% (₹{abs(diff_amount):,.0f}).",
                old_page=old_policy.source_metadata.page_provenance.get("premium", 1),
                new_page=new_policy.source_metadata.page_provenance.get("premium", 1)
            ))

        # 2. Room Rent Capping
        old_rr_type = old_policy.room_rent.type
        new_rr_type = new_policy.room_rent.type
        if old_rr_type != new_rr_type or old_policy.room_rent.limit_amount != new_policy.room_rent.limit_amount:
            is_fav = (new_rr_type in ["no_capping", "single_private_room"] and old_rr_type not in ["no_capping", "single_private_room"])
            diffs.append(ClauseDiff(
                clause_category="room_rent",
                field_name="Room Rent Limit",
                old_value=old_rr_type.replace('_', ' ').title(),
                new_value=new_rr_type.replace('_', ' ').title(),
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation="Room rent restriction upgraded to single private/no capping eliminating proportionate deduction risk." if is_fav else "Room rent restriction tightened which may trigger proportionate deduction penalties on claims.",
                old_page=old_policy.source_metadata.page_provenance.get("room_rent", 2),
                new_page=new_policy.source_metadata.page_provenance.get("room_rent", 2)
            ))

        # 3. Pre-Existing Disease (PED) Waiting Period
        old_ped = old_policy.waiting_period_months.pre_existing
        new_ped = new_policy.waiting_period_months.pre_existing
        if old_ped != new_ped:
            is_fav = new_ped < old_ped
            diffs.append(ClauseDiff(
                clause_category="waiting_period",
                field_name="Pre-Existing Diseases Waiting Period",
                old_value=f"{old_ped} Months",
                new_value=f"{new_ped} Months",
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation=f"PED waiting period shortened from {old_ped} to {new_ped} months, compliant with revised IRDAI norms." if is_fav else f"Waiting period extended from {old_ped} to {new_ped} months.",
                old_page=old_policy.source_metadata.page_provenance.get("waiting_period", 3),
                new_page=new_policy.source_metadata.page_provenance.get("waiting_period", 3)
            ))

        # 4. Specific Disease Waiting Period
        old_spec = old_policy.waiting_period_months.specific_disease
        new_spec = new_policy.waiting_period_months.specific_disease
        if old_spec != new_spec:
            is_fav = new_spec < old_spec
            diffs.append(ClauseDiff(
                clause_category="waiting_period",
                field_name="Specific Illness Waiting Period",
                old_value=f"{old_spec} Months",
                new_value=f"{new_spec} Months",
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation=f"Waiting for listed ailments (cataract, hernia, joint replacement) changed to {new_spec} months.",
                old_page=old_policy.source_metadata.page_provenance.get("waiting_period", 3),
                new_page=new_policy.source_metadata.page_provenance.get("waiting_period", 3)
            ))

        # 5. Co-Payment
        old_copay = old_policy.copayment_percentage
        new_copay = new_policy.copayment_percentage
        if old_copay != new_copay:
            is_fav = new_copay < old_copay
            diffs.append(ClauseDiff(
                clause_category="copay",
                field_name="Mandatory Co-Payment",
                old_value=f"{old_copay}%",
                new_value=f"{new_copay}%",
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation=f"Mandatory co-payment changed from {old_copay}% to {new_copay}%.",
                old_page=old_policy.source_metadata.page_provenance.get("copay", 4),
                new_page=new_policy.source_metadata.page_provenance.get("copay", 4)
            ))

        # 6. Restoration Benefit
        if old_policy.restoration_benefit != new_policy.restoration_benefit:
            diffs.append(ClauseDiff(
                clause_category="restoration",
                field_name="Sum Insured Auto-Restoration",
                old_value="Available" if old_policy.restoration_benefit else "Not Included",
                new_value="Available" if new_policy.restoration_benefit else "Not Included",
                impact="FAVORABLE" if new_policy.restoration_benefit else "RESTRICTIVE",
                explanation="Sum insured recharge/restoration upon exhaustion is now enabled." if new_policy.restoration_benefit else "Automatic recharge benefit has been removed from base plan.",
                old_page=old_policy.source_metadata.page_provenance.get("restoration", 5),
                new_page=new_policy.source_metadata.page_provenance.get("restoration", 5)
            ))

        # 7. No Claim Bonus (NCB)
        if old_policy.no_claim_bonus_percentage != new_policy.no_claim_bonus_percentage:
            is_fav = new_policy.no_claim_bonus_percentage > old_policy.no_claim_bonus_percentage
            diffs.append(ClauseDiff(
                clause_category="ncb",
                field_name="No Claim Bonus Multiplier",
                old_value=f"{old_policy.no_claim_bonus_percentage}%",
                new_value=f"{new_policy.no_claim_bonus_percentage}%",
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation=f"NCB annual multiplier adjusted to {new_policy.no_claim_bonus_percentage}%.",
                old_page=old_policy.source_metadata.page_provenance.get("ncb", 6),
                new_page=new_policy.source_metadata.page_provenance.get("ncb", 6)
            ))

        # 8. Pre / Post Hospitalization Coverage
        if (old_policy.pre_hospitalization_days != new_policy.pre_hospitalization_days or
            old_policy.post_hospitalization_days != new_policy.post_hospitalization_days):
            is_fav = (new_policy.pre_hospitalization_days >= old_policy.pre_hospitalization_days and
                      new_policy.post_hospitalization_days >= old_policy.post_hospitalization_days)
            diffs.append(ClauseDiff(
                clause_category="hospitalization",
                field_name="Pre & Post Hospitalization Days",
                old_value=f"{old_policy.pre_hospitalization_days} / {old_policy.post_hospitalization_days} Days",
                new_value=f"{new_policy.pre_hospitalization_days} / {new_policy.post_hospitalization_days} Days",
                impact="FAVORABLE" if is_fav else "RESTRICTIVE",
                explanation=f"Coverage window for pre/post medical bills revised to {new_policy.pre_hospitalization_days}/{new_policy.post_hospitalization_days} days.",
                old_page=old_policy.source_metadata.page_provenance.get("hospitalization", 7),
                new_page=new_policy.source_metadata.page_provenance.get("hospitalization", 7)
            ))

        # 9. Exclusions Diff
        old_exc = set(old_policy.exclusions)
        new_exc = set(new_policy.exclusions)
        added_exc = new_exc - old_exc
        removed_exc = old_exc - new_exc

        for item in added_exc:
            diffs.append(ClauseDiff(
                clause_category="exclusions",
                field_name="New Exclusion Added",
                old_value="Covered / Unspecified",
                new_value=f"Excluded: {item}",
                impact="RESTRICTIVE",
                explanation=f"'{item}' is now explicitly listed under permanent policy exclusions.",
                old_page=old_policy.source_metadata.page_provenance.get("exclusions", 8),
                new_page=new_policy.source_metadata.page_provenance.get("exclusions", 8)
            ))

        for item in removed_exc:
            diffs.append(ClauseDiff(
                clause_category="exclusions",
                field_name="Exclusion Removed (Expanded Coverage)",
                old_value=f"Excluded: {item}",
                new_value="Now Covered / Removed from Exclusions",
                impact="FAVORABLE",
                explanation=f"'{item}' is no longer excluded in the updated policy wording.",
                old_page=old_policy.source_metadata.page_provenance.get("exclusions", 8),
                new_page=new_policy.source_metadata.page_provenance.get("exclusions", 8)
            ))

        # Calculate Summary
        favorable_count = sum(1 for d in diffs if d.impact == "FAVORABLE")
        restrictive_count = sum(1 for d in diffs if d.impact == "RESTRICTIVE")
        neutral_count = sum(1 for d in diffs if d.impact == "NEUTRAL")

        if favorable_count > restrictive_count:
            sentiment = "IMPROVED"
        elif restrictive_count > favorable_count:
            sentiment = "DETERIORATED"
        elif favorable_count > 0:
            sentiment = "MIXED"
        else:
            sentiment = "UNCHANGED"

        # Baseline claims favorability index (50 neutral, scaled by ratio)
        net_diff = favorable_count - restrictive_count
        claims_score = max(5.0, min(95.0, 50.0 + (net_diff * 12.5)))

        exec_summary = (
            f"Comparison between {old_policy.plan_name} and {new_policy.plan_name} reveals "
            f"{favorable_count} favorable enhancement(s) and {restrictive_count} restrictive change(s). "
            f"Overall policy terms have {sentiment.lower()}."
        )

        return PolicyVersionDiffResponse(
            base_plan_name=old_policy.plan_name,
            base_version="2024 Wording",
            target_version="2026 Updated Wording",
            summary=PolicyDiffSummary(
                favorable_count=favorable_count,
                restrictive_count=restrictive_count,
                neutral_count=neutral_count,
                overall_sentiment=sentiment,
                executive_summary=exec_summary,
                claims_impact_score=claims_score
            ),
            clause_diffs=diffs
        )
