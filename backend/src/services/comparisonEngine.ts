import { InsurancePolicy, UserRequirementProfile, FitAnalysisResult } from '../types/policy';

export class ComparisonEngine {
  /**
   * Calculates explainable fit analysis between user requirements and insurance policies.
   * Strictly adheres to non-manipulative factual matching.
   */
  public static calculateFit(
    policy: InsurancePolicy,
    requirements: UserRequirementProfile
  ): FitAnalysisResult {
    const points: string[] = [];
    let matchScore = 100;

    // 1. Budget Fit Evaluation
    let budgetFit: boolean | 'warning' = true;
    if (requirements.budget_max) {
      if (policy.premium <= requirements.budget_max) {
        points.push(`Premium (₹${policy.premium.toLocaleString('en-IN')}) is within your max budget of ₹${requirements.budget_max.toLocaleString('en-IN')}`);
      } else {
        budgetFit = 'warning';
        matchScore -= 20;
        points.push(`Premium (₹${policy.premium.toLocaleString('en-IN')}) exceeds your target budget of ₹${requirements.budget_max.toLocaleString('en-IN')}`);
      }
    }

    // 2. Coverage (Sum Insured) Fit Evaluation
    let coverageFit: boolean | 'warning' = true;
    if (requirements.sum_insured_target) {
      if (policy.sum_insured >= requirements.sum_insured_target) {
        points.push(`Coverage amount (₹${(policy.sum_insured / 100000).toFixed(1)}L) satisfies target coverage (₹${(requirements.sum_insured_target / 100000).toFixed(1)}L)`);
      } else {
        coverageFit = 'warning';
        matchScore -= 25;
        points.push(`Coverage (₹${(policy.sum_insured / 100000).toFixed(1)}L) is lower than requested ₹${(requirements.sum_insured_target / 100000).toFixed(1)}L`);
      }
    }

    // 3. Waiting Period Fit Evaluation
    let waitingPeriodFit: boolean | 'warning' = true;
    if (requirements.max_acceptable_waiting_months !== undefined) {
      if (policy.waiting_period_months.pre_existing <= requirements.max_acceptable_waiting_months) {
        points.push(`Pre-existing waiting period (${policy.waiting_period_months.pre_existing} months) meets your criteria`);
      } else {
        waitingPeriodFit = 'warning';
        matchScore -= 15;
        points.push(`Pre-existing waiting period (${policy.waiting_period_months.pre_existing} months) exceeds preferred maximum`);
      }
    }

    // 4. Co-Payment Fit
    let copayFit: boolean | 'warning' = true;
    if (requirements.preferences?.no_copay && policy.copayment_percentage > 0) {
      copayFit = 'warning';
      matchScore -= 15;
      points.push(`Has a mandatory ${policy.copayment_percentage}% co-payment clause`);
    } else {
      points.push(`Co-payment is ${policy.copayment_percentage}% (Zero out-of-pocket share)`);
    }

    // 5. Maternity Coverage Requirement
    let maternityFit: boolean | 'warning' = true;
    if (requirements.preferences?.maternity) {
      if (policy.maternity_covered) {
        points.push(`Maternity and newborn care is included`);
      } else {
        maternityFit = 'warning';
        matchScore -= 20;
        points.push(`Maternity is excluded under base cover`);
      }
    }

    return {
      plan_id: policy.id || policy.plan_name.toLowerCase().replace(/\s+/g, '-'),
      plan_name: policy.plan_name,
      provider: policy.provider,
      overall_fit_percentage: Math.max(0, matchScore),
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
