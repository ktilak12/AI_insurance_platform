import { InsurancePolicy, UserRequirementProfile, FitAnalysisResult } from '../types/policy';

export class ComparisonEngine {
  /**
   * Neutral, Non-Manipulative Fit Analysis Scoring Algorithm.
   * Built in strict compliance with IRDAI Web Aggregator Guidelines.
   * Evaluates mathematical fit across financials, coverage, waiting periods, room rent, and clauses.
   */
  public static calculateFit(
    policy: InsurancePolicy,
    requirements: UserRequirementProfile
  ): FitAnalysisResult {
    const points: string[] = [];
    let score = 100;

    // 1. Budget Fit Evaluation (Weight: 25%)
    let budgetFit: boolean | 'warning' = true;
    if (requirements.budget_max) {
      if (policy.premium <= requirements.budget_max) {
        points.push(`Annual premium (₹${policy.premium.toLocaleString('en-IN')}) is within your target budget of ₹${requirements.budget_max.toLocaleString('en-IN')}.`);
      } else {
        budgetFit = 'warning';
        const overPct = ((policy.premium - requirements.budget_max) / requirements.budget_max) * 100;
        const penalty = Math.min(25, Math.round(overPct * 0.5));
        score -= penalty;
        points.push(`Premium (₹${policy.premium.toLocaleString('en-IN')}) exceeds your budget by ₹${(policy.premium - requirements.budget_max).toLocaleString('en-IN')} (+${overPct.toFixed(0)}%).`);
      }
    }

    // 2. Coverage (Sum Insured) Target Fit (Weight: 25%)
    let coverageFit: boolean | 'warning' = true;
    if (requirements.sum_insured_target) {
      if (policy.sum_insured >= requirements.sum_insured_target) {
        points.push(`Sum Insured of ₹${(policy.sum_insured / 100000).toFixed(0)} Lakhs satisfies your desired coverage target of ₹${(requirements.sum_insured_target / 100000).toFixed(0)} Lakhs.`);
      } else {
        coverageFit = 'warning';
        const deficit = requirements.sum_insured_target - policy.sum_insured;
        score -= 20;
        points.push(`Sum Insured (₹${(policy.sum_insured / 100000).toFixed(0)}L) is below your requested target of ₹${(requirements.sum_insured_target / 100000).toFixed(0)}L (deficit of ₹${(deficit / 100000).toFixed(0)}L).`);
      }
    }

    // 3. Waiting Period Fit (Weight: 20%)
    let waitingPeriodFit: boolean | 'warning' = true;
    if (requirements.max_acceptable_waiting_months !== undefined) {
      const actualPed = policy.waiting_period_months.pre_existing;
      if (actualPed <= requirements.max_acceptable_waiting_months) {
        points.push(`Pre-existing conditions waiting period of ${actualPed} months complies with your preferred maximum limit (${requirements.max_acceptable_waiting_months}m).`);
      } else {
        waitingPeriodFit = 'warning';
        score -= 18;
        points.push(`Pre-existing disease waiting period is ${actualPed} months, exceeding your preference of ${requirements.max_acceptable_waiting_months} months.`);
      }
    }

    // 4. Room Rent Capping Risk Evaluation (Weight: 15%)
    if (['no_capping', 'single_private_room'].includes(policy.room_rent.type)) {
      points.push(`Room rent restriction: ${policy.room_rent.type.replace(/_/g, ' ')}. Proportionate deduction penalty on hospital bills is 100% waived.`);
    } else {
      score -= 12;
      points.push(`Room rent capping applied (${policy.room_rent.type.replace(/_/g, ' ')}). Staying in a higher-tier room triggers proportionate claim deductions across doctor, nursing, and OT fees.`);
    }

    // 5. Co-Payment Evaluation (Weight: 10%)
    let copayFit: boolean | 'warning' = true;
    if (requirements.preferences?.no_copay) {
      if (policy.copayment_percentage === 0) {
        points.push(`Zero mandatory co-payment: Insurer pays 100% of approved hospital bill items.`);
      } else {
        copayFit = 'warning';
        score -= 15;
        points.push(`Has a mandatory ${policy.copayment_percentage}% co-payment clause on all hospital claims.`);
      }
    }

    // 6. Restoration Benefit Evaluation (Weight: 5%)
    if (requirements.preferences?.restoration) {
      if (policy.restoration_benefit) {
        points.push(`Automatic Sum Insured Restoration: 100% recharge included upon claim exhaustion.`);
      } else {
        score -= 5;
        points.push(`Sum Insured auto-restoration is not included in the base plan.`);
      }
    }

    // 7. Maternity Coverage Preference
    let maternityFit: boolean | 'warning' = true;
    if (requirements.preferences?.maternity) {
      if (policy.maternity_covered) {
        points.push(`Maternity and newborn delivery expenses are covered.`);
      } else {
        maternityFit = 'warning';
        score -= 15;
        points.push(`Maternity is excluded under standard base coverage.`);
      }
    }

    // 8. Pre-Existing Conditions Matching
    if (requirements.pre_existing_conditions && requirements.pre_existing_conditions.length > 0) {
      const conditionsList = requirements.pre_existing_conditions.join(', ');
      points.push(`Declared conditions (${conditionsList}): Subject to ${policy.waiting_period_months.pre_existing}-month continuous waiting period before claim admissibility.`);
    }

    return {
      plan_id: policy.id || policy.plan_name.toLowerCase().replace(/\s+/g, '-'),
      plan_name: policy.plan_name,
      provider: policy.provider,
      overall_fit_percentage: Math.max(10, Math.min(100, score)),
      breakdown: {
        budget_fit: budgetFit,
        coverage_fit: coverageFit,
        waiting_period_fit: waitingPeriodFit,
        copay_fit: copayFit,
        maternity_fit: maternityFit
      },
      explanation_points: points
    };
  }
}
