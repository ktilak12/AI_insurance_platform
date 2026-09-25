import { InsurancePolicy, UserRequirementProfile, FitAnalysisResult } from '../types/policy';

export class MatchingEngine {
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
    const positiveMatches: string[] = [];
    const caveatsAndWarnings: string[] = [];
    let score = 100;

    // 1. Budget Fit Evaluation (Weight: 20%)
    let budgetFit: boolean | 'warning' = true;
    if (requirements.budget_max) {
      if (policy.premium <= requirements.budget_max) {
        const savings = requirements.budget_max - policy.premium;
        const msg = `Annual premium (₹${policy.premium.toLocaleString('en-IN')}) is within your target budget of ₹${requirements.budget_max.toLocaleString('en-IN')}${savings > 0 ? ` (₹${savings.toLocaleString('en-IN')} buffer)` : ''}.`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        budgetFit = 'warning';
        const overPct = ((policy.premium - requirements.budget_max) / requirements.budget_max) * 100;
        const penalty = Math.min(22, Math.round(overPct * 0.45));
        score -= penalty;
        const msg = `Premium (₹${policy.premium.toLocaleString('en-IN')}) exceeds your budget ceiling by ₹${(policy.premium - requirements.budget_max).toLocaleString('en-IN')} (+${overPct.toFixed(0)}%).`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    }

    // 2. Coverage (Sum Insured) Target Fit (Weight: 20%)
    let coverageFit: boolean | 'warning' = true;
    if (requirements.sum_insured_target) {
      if (policy.sum_insured >= requirements.sum_insured_target) {
        const msg = `Sum Insured of ₹${(policy.sum_insured / 100000).toFixed(0)} Lakhs satisfies your desired coverage target of ₹${(requirements.sum_insured_target / 100000).toFixed(0)} Lakhs.`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        coverageFit = 'warning';
        const deficit = requirements.sum_insured_target - policy.sum_insured;
        score -= 20;
        const msg = `Sum Insured (₹${(policy.sum_insured / 100000).toFixed(0)}L) is below your requested target of ₹${(requirements.sum_insured_target / 100000).toFixed(0)}L (deficit of ₹${(deficit / 100000).toFixed(0)}L).`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    }

    // 3. Waiting Period Fit (Weight: 20%)
    let waitingPeriodFit: boolean | 'warning' = true;
    if (requirements.max_acceptable_waiting_months !== undefined) {
      const actualPed = policy.waiting_period_months.pre_existing;
      if (actualPed <= requirements.max_acceptable_waiting_months) {
        const msg = `Pre-existing conditions waiting period of ${actualPed} months complies with your preferred maximum limit (${requirements.max_acceptable_waiting_months}m).`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        waitingPeriodFit = 'warning';
        score -= 18;
        const msg = `Pre-existing disease waiting period is ${actualPed} months, exceeding your preference of ${requirements.max_acceptable_waiting_months} months.`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    }

    // 4. Room Rent Capping Risk Evaluation (Weight: 15%)
    let roomRentFit: boolean | 'warning' = true;
    if (['no_capping', 'single_private_room'].includes(policy.room_rent.type)) {
      const msg = `Room rent restriction: ${policy.room_rent.type.replace(/_/g, ' ')}. Proportionate deduction penalty on hospital bills is 100% waived.`;
      points.push(msg);
      positiveMatches.push(msg);
    } else {
      roomRentFit = 'warning';
      score -= 15;
      const msg = `Room rent capping applied (${policy.room_rent.type.replace(/_/g, ' ')}). Staying in a higher-tier room triggers proportionate claim deductions across doctor, nursing, and OT fees.`;
      points.push(msg);
      caveatsAndWarnings.push(msg);
    }

    // 5. Co-Payment Evaluation (Weight: 10%)
    let copayFit: boolean | 'warning' = true;
    const requestedZeroCopay = requirements.copay_tolerance === 0 || requirements.preferences?.no_copay;
    if (requestedZeroCopay) {
      if (policy.copayment_percentage === 0) {
        const msg = `Zero mandatory co-payment: Insurer pays 100% of approved hospital bill items.`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        copayFit = 'warning';
        score -= 15;
        const msg = `Has a mandatory ${policy.copayment_percentage}% co-payment clause on hospital claims.`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    } else if (requirements.copay_tolerance && policy.copayment_percentage > requirements.copay_tolerance) {
      copayFit = 'warning';
      score -= 10;
      const msg = `Mandatory co-payment (${policy.copayment_percentage}%) exceeds your threshold (${requirements.copay_tolerance}%).`;
      points.push(msg);
      caveatsAndWarnings.push(msg);
    }

    // 6. Restoration Benefit Evaluation (Weight: 5%)
    let restorationFit: boolean | 'warning' = true;
    if (requirements.preferences?.restoration) {
      if (policy.restoration_benefit) {
        const msg = `Automatic Sum Insured Restoration: 100% recharge included upon claim exhaustion.`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        restorationFit = 'warning';
        score -= 6;
        const msg = `Sum Insured auto-restoration is not included in the base plan.`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    }

    // 7. Maternity Coverage Preference (Weight: 5%)
    let maternityFit: boolean | 'warning' = true;
    if (requirements.preferences?.maternity) {
      if (policy.maternity_covered) {
        const msg = `Maternity and newborn delivery expenses are covered.`;
        points.push(msg);
        positiveMatches.push(msg);
      } else {
        maternityFit = 'warning';
        score -= 12;
        const msg = `Maternity is excluded under standard base coverage.`;
        points.push(msg);
        caveatsAndWarnings.push(msg);
      }
    }

    // 8. Pre-Existing Conditions Matching
    if (requirements.pre_existing_conditions && requirements.pre_existing_conditions.length > 0 && !requirements.pre_existing_conditions.includes('none')) {
      const conditionsList = requirements.pre_existing_conditions.join(', ');
      const pedMsg = `Declared conditions (${conditionsList}): Subject to ${policy.waiting_period_months.pre_existing}-month continuous waiting period before claim admissibility.`;
      points.push(pedMsg);
    }

    // 9. OPD & Special Add-ons
    if (requirements.preferences?.opd_cover && policy.opd_benefit_included) {
      const msg = `Includes OPD doctor consultations and prescription medicine reimbursement.`;
      points.push(msg);
      positiveMatches.push(msg);
    }

    if (requirements.preferences?.global_cover && policy.global_coverage_included) {
      const msg = `Includes Worldwide emergency hospitalization coverage.`;
      points.push(msg);
      positiveMatches.push(msg);
    }

    const finalScore = Math.max(15, Math.min(100, score));

    return {
      plan_id: policy.id,
      plan_name: policy.plan_name,
      provider: policy.provider,
      overall_fit_percentage: finalScore,
      breakdown: {
        budget_fit: budgetFit,
        coverage_fit: coverageFit,
        waiting_period_fit: waitingPeriodFit,
        room_rent_fit: roomRentFit,
        copay_fit: copayFit,
        maternity_fit: maternityFit,
        restoration_fit: restorationFit
      },
      explanation_points: points,
      positive_matches: positiveMatches,
      caveats_and_warnings: caveatsAndWarnings
    };
  }
}
