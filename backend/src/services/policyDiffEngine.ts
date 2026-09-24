import { InsurancePolicy, ClauseDiff, PolicyVersionDiffResponse, PolicyDiffSummary } from '../types/policy';

export class PolicyDiffEngine {
  /**
   * Compares two insurance policy versions and produces an actionable, factual diff
   * with impact classifications and claim favorability scoring.
   */
  public static compare(oldPolicy: InsurancePolicy, newPolicy: InsurancePolicy): PolicyVersionDiffResponse {
    const diffs: ClauseDiff[] = [];

    // 1. Premium Check
    if (oldPolicy.premium !== newPolicy.premium) {
      const diffAmount = newPolicy.premium - oldPolicy.premium;
      const pct = ((newPolicy.premium - oldPolicy.premium) / oldPolicy.premium) * 100;
      diffs.push({
        clause_category: 'financials',
        field_name: 'Annual Base Premium',
        old_value: `₹${oldPolicy.premium.toLocaleString('en-IN')}`,
        new_value: `₹${newPolicy.premium.toLocaleString('en-IN')}`,
        impact: diffAmount > 0 ? 'RESTRICTIVE' : 'FAVORABLE',
        explanation: `Premium ${diffAmount > 0 ? 'increased' : 'decreased'} by ${Math.abs(pct).toFixed(1)}% (₹${Math.abs(diffAmount).toLocaleString('en-IN')}).`,
        old_page: oldPolicy.source_metadata?.page_provenance?.premium || 1,
        new_page: newPolicy.source_metadata?.page_provenance?.premium || 1
      });
    }

    // 2. Room Rent
    if (oldPolicy.room_rent.type !== newPolicy.room_rent.type || oldPolicy.room_rent.limit_amount !== newPolicy.room_rent.limit_amount) {
      const isFavorable = (
        ['no_capping', 'single_private_room'].includes(newPolicy.room_rent.type) &&
        !['no_capping', 'single_private_room'].includes(oldPolicy.room_rent.type)
      );

      diffs.push({
        clause_category: 'room_rent',
        field_name: 'Room Rent Limit',
        old_value: oldPolicy.room_rent.type.replace(/_/g, ' ').toUpperCase(),
        new_value: newPolicy.room_rent.type.replace(/_/g, ' ').toUpperCase(),
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: isFavorable 
          ? 'Room rent restriction lifted to single private/no capping, eliminating proportionate deduction risk on hospital bills.'
          : 'Room rent capping imposed; higher category rooms may trigger proportionate claim deductions.',
        old_page: oldPolicy.source_metadata?.page_provenance?.room_rent || 2,
        new_page: newPolicy.source_metadata?.page_provenance?.room_rent || 2
      });
    }

    // 3. Waiting Periods
    if (oldPolicy.waiting_period_months.pre_existing !== newPolicy.waiting_period_months.pre_existing) {
      const isFavorable = newPolicy.waiting_period_months.pre_existing < oldPolicy.waiting_period_months.pre_existing;
      diffs.push({
        clause_category: 'waiting_period',
        field_name: 'Pre-Existing Disease Waiting Period',
        old_value: `${oldPolicy.waiting_period_months.pre_existing} Months`,
        new_value: `${newPolicy.waiting_period_months.pre_existing} Months`,
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: isFavorable
          ? `Waiting period reduced from ${oldPolicy.waiting_period_months.pre_existing}m to ${newPolicy.waiting_period_months.pre_existing}m in accordance with revised IRDAI guidelines.`
          : `Waiting period extended to ${newPolicy.waiting_period_months.pre_existing} months.`,
        old_page: oldPolicy.source_metadata?.page_provenance?.waiting_period || 3,
        new_page: newPolicy.source_metadata?.page_provenance?.waiting_period || 3
      });
    }

    if (oldPolicy.waiting_period_months.specific_disease !== newPolicy.waiting_period_months.specific_disease) {
      const isFavorable = newPolicy.waiting_period_months.specific_disease < oldPolicy.waiting_period_months.specific_disease;
      diffs.push({
        clause_category: 'waiting_period',
        field_name: 'Specific Illness Waiting Period',
        old_value: `${oldPolicy.waiting_period_months.specific_disease} Months`,
        new_value: `${newPolicy.waiting_period_months.specific_disease} Months`,
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: `Specified illness waiting window changed to ${newPolicy.waiting_period_months.specific_disease} months.`,
        old_page: oldPolicy.source_metadata?.page_provenance?.waiting_period || 3,
        new_page: newPolicy.source_metadata?.page_provenance?.waiting_period || 3
      });
    }

    // 4. Co-Payment
    if (oldPolicy.copayment_percentage !== newPolicy.copayment_percentage) {
      const isFavorable = newPolicy.copayment_percentage < oldPolicy.copayment_percentage;
      diffs.push({
        clause_category: 'copay',
        field_name: 'Mandatory Co-Payment',
        old_value: `${oldPolicy.copayment_percentage}%`,
        new_value: `${newPolicy.copayment_percentage}%`,
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: `Mandatory claim cost sharing changed from ${oldPolicy.copayment_percentage}% to ${newPolicy.copayment_percentage}%.`,
        old_page: oldPolicy.source_metadata?.page_provenance?.copay || 4,
        new_page: newPolicy.source_metadata?.page_provenance?.copay || 4
      });
    }

    // 5. Restoration
    if (oldPolicy.restoration_benefit !== newPolicy.restoration_benefit) {
      diffs.push({
        clause_category: 'restoration',
        field_name: 'Sum Insured Restoration',
        old_value: oldPolicy.restoration_benefit ? 'Available (100%)' : 'Not Included',
        new_value: newPolicy.restoration_benefit ? 'Available (100%)' : 'Not Included',
        impact: newPolicy.restoration_benefit ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: newPolicy.restoration_benefit
          ? 'Automatic recharge of sum insured after full/partial exhaustion is now included.'
          : 'Automatic restoration benefit removed from base coverage.',
        old_page: oldPolicy.source_metadata?.page_provenance?.restoration || 5,
        new_page: newPolicy.source_metadata?.page_provenance?.restoration || 5
      });
    }

    // 6. NCB Multiplier
    if (oldPolicy.no_claim_bonus_percentage !== newPolicy.no_claim_bonus_percentage) {
      const isFavorable = newPolicy.no_claim_bonus_percentage > oldPolicy.no_claim_bonus_percentage;
      diffs.push({
        clause_category: 'ncb',
        field_name: 'No Claim Bonus (NCB)',
        old_value: `${oldPolicy.no_claim_bonus_percentage}% / year`,
        new_value: `${newPolicy.no_claim_bonus_percentage}% / year`,
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: `Cumulative bonus rate updated to ${newPolicy.no_claim_bonus_percentage}% per claim-free year.`,
        old_page: oldPolicy.source_metadata?.page_provenance?.ncb || 6,
        new_page: newPolicy.source_metadata?.page_provenance?.ncb || 6
      });
    }

    // 7. Hospitalization Window
    if (
      oldPolicy.pre_hospitalization_days !== newPolicy.pre_hospitalization_days ||
      oldPolicy.post_hospitalization_days !== newPolicy.post_hospitalization_days
    ) {
      const isFavorable = (
        newPolicy.pre_hospitalization_days >= oldPolicy.pre_hospitalization_days &&
        newPolicy.post_hospitalization_days >= oldPolicy.post_hospitalization_days
      );
      diffs.push({
        clause_category: 'hospitalization',
        field_name: 'Pre / Post Hospitalization Window',
        old_value: `${oldPolicy.pre_hospitalization_days} / ${oldPolicy.post_hospitalization_days} Days`,
        new_value: `${newPolicy.pre_hospitalization_days} / ${newPolicy.post_hospitalization_days} Days`,
        impact: isFavorable ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: `Medical expense window prior to admission and following discharge revised to ${newPolicy.pre_hospitalization_days} & ${newPolicy.post_hospitalization_days} days.`,
        old_page: 7,
        new_page: 7
      });
    }

    // 8. Exclusions
    const oldExclusions = new Set(oldPolicy.exclusions || []);
    const newExclusions = new Set(newPolicy.exclusions || []);

    const addedExclusions = [...newExclusions].filter(x => !oldExclusions.has(x));
    const removedExclusions = [...oldExclusions].filter(x => !newExclusions.has(x));

    for (const exc of addedExclusions) {
      diffs.push({
        clause_category: 'exclusions',
        field_name: 'New Exclusion Added',
        old_value: 'Covered / Silent',
        new_value: `Excluded: ${exc}`,
        impact: 'RESTRICTIVE',
        explanation: `"${exc}" is now explicitly non-payable under standard policy terms.`,
        old_page: 8,
        new_page: 8
      });
    }

    for (const exc of removedExclusions) {
      diffs.push({
        clause_category: 'exclusions',
        field_name: 'Exclusion Removed',
        old_value: `Excluded: ${exc}`,
        new_value: 'Now Covered / Restriction Lifted',
        impact: 'FAVORABLE',
        explanation: `"${exc}" is no longer excluded in the revised policy wording.`,
        old_page: 8,
        new_page: 8
      });
    }

    const favorableCount = diffs.filter(d => d.impact === 'FAVORABLE').length;
    const restrictiveCount = diffs.filter(d => d.impact === 'RESTRICTIVE').length;
    const neutralCount = diffs.filter(d => d.impact === 'NEUTRAL').length;

    let sentiment: 'IMPROVED' | 'DETERIORATED' | 'UNCHANGED' | 'MIXED' = 'UNCHANGED';
    if (favorableCount > restrictiveCount) {
      sentiment = 'IMPROVED';
    } else if (restrictiveCount > favorableCount) {
      sentiment = 'DETERIORATED';
    } else if (favorableCount > 0) {
      sentiment = 'MIXED';
    }

    const netScore = favorableCount - restrictiveCount;
    const claimsScore = Math.max(5, Math.min(95, 50 + netScore * 12.5));

    const summary: PolicyDiffSummary = {
      favorable_count: favorableCount,
      restrictive_count: restrictiveCount,
      neutral_count: neutralCount,
      overall_sentiment: sentiment,
      claims_impact_score: claimsScore,
      executive_summary: `Policy terms have ${sentiment.toLowerCase()}: ${favorableCount} consumer-favorable improvement(s) vs ${restrictiveCount} restrictive change(s).`
    };

    return {
      base_plan_name: oldPolicy.plan_name,
      base_version: oldPolicy.version || '2024 Wording',
      target_version: newPolicy.version || '2026 Updated Wording',
      summary,
      clause_diffs: diffs
    };
  }
}
