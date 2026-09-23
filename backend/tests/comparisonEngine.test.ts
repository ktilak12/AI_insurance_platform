import { ComparisonEngine } from '../src/services/comparisonEngine';
import { InsurancePolicy, UserRequirementProfile } from '../src/types/policy';

describe('ComparisonEngine Unit Tests', () => {
  const mockPolicy: InsurancePolicy = {
    provider: 'Test Insurer',
    plan_name: 'Test Plan A',
    category: 'health',
    premium: 15000,
    sum_insured: 1000000,
    policy_term_years: 1,
    room_rent: { type: 'no_capping', limit_amount: null, limit_percentage: null },
    waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 36 },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    no_claim_bonus_percentage: 50,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 60,
    post_hospitalization_days: 180,
    exclusions: [],
    sub_limits: [],
    source_metadata: {
      document_name: 'test.pdf',
      document_hash: 'abc',
      extracted_at: '2026-01-01',
      confidence_score: 0.99,
      page_provenance: {}
    }
  };

  it('evaluates budget and coverage matches accurately', () => {
    const requirements: UserRequirementProfile = {
      budget_max: 20000,
      sum_insured_target: 1000000
    };

    const fit = ComparisonEngine.calculateFit(mockPolicy, requirements);
    expect(fit.breakdown.budget_fit).toBe(true);
    expect(fit.breakdown.coverage_fit).toBe(true);
    expect(fit.overall_fit_percentage).toBe(100);
  });

  it('emits warning when premium exceeds budget', () => {
    const requirements: UserRequirementProfile = {
      budget_max: 10000
    };

    const fit = ComparisonEngine.calculateFit(mockPolicy, requirements);
    expect(fit.breakdown.budget_fit).toBe('warning');
    expect(fit.overall_fit_percentage).toBeLessThan(100);
  });
});
