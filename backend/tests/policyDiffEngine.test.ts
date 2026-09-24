import { PolicyDiffEngine } from '../src/services/policyDiffEngine';
import { InsurancePolicy } from '../src/types/policy';

describe('PolicyDiffEngine Service', () => {
  const baseOld: InsurancePolicy = {
    provider: 'Test Insurer',
    plan_name: 'Standard Health 2024',
    category: 'health',
    premium: 12000,
    sum_insured: 1000000,
    policy_term_years: 1,
    room_rent: { type: 'fixed_amount', limit_amount: 5000, limit_percentage: null },
    waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 36 },
    copayment_percentage: 10,
    deductible_amount: 0,
    restoration_benefit: false,
    no_claim_bonus_percentage: 50,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 30,
    post_hospitalization_days: 60,
    exclusions: ['Cosmetic surgery', 'Obesity treatment'],
    sub_limits: [],
    source_metadata: {
      document_name: 'standard_2024.pdf',
      document_hash: 'hash1',
      extracted_at: '2024-01-01',
      confidence_score: 0.96,
      page_provenance: {}
    }
  };

  const baseNew: InsurancePolicy = {
    ...baseOld,
    plan_name: 'Standard Health 2026',
    premium: 13500,
    room_rent: { type: 'single_private_room', limit_amount: null, limit_percentage: null },
    waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 24 },
    copayment_percentage: 0,
    restoration_benefit: true,
    exclusions: ['Cosmetic surgery'] // Obesity treatment removed from exclusions (now covered)
  };

  test('should detect favorable upgrades across room rent, PED waiting period, copay, and restoration', () => {
    const diff = PolicyDiffEngine.compare(baseOld, baseNew);

    expect(diff.summary.favorable_count).toBeGreaterThanOrEqual(4);
    expect(diff.summary.restrictive_count).toBeGreaterThanOrEqual(1); // Premium increased
    expect(diff.summary.overall_sentiment).toBe('IMPROVED');
    expect(diff.summary.claims_impact_score).toBeGreaterThan(50);
  });
});
