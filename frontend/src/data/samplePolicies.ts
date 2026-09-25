import { InsurancePolicy, PolicyVersionSet } from '../types/policy';

export const initialSamplePolicies: InsurancePolicy[] = [
  {
    id: 'hdfc-optima-secure',
    provider: 'HDFC ERGO',
    plan_name: 'Optima Secure',
    version: '2026 Revised Master Wording',
    category: 'health',
    premium: 14500,
    sum_insured: 1000000,
    policy_term_years: 1,
    room_rent: {
      type: 'no_capping',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 24
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: '100% Automatic Restore (Unlimited times for any illness)',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 100,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 60,
    post_hospitalization_days: 180,
    opd_benefit_included: false,
    global_coverage_included: false,
    cashless_hospitals_count: 12000,
    claim_settlement_ratio: 97.4,
    exclusions: [
      'Cosmetic and aesthetic treatments',
      'Self-inflicted injuries and hazardous adventure sports',
      'Non-allopathic alternative therapies unless in AYUSH accredited hospital',
      'Stem cell therapy and experimental unproven procedures'
    ],
    sub_limits: [],
    source_metadata: {
      document_name: 'hdfc_ergo_optima_secure_policy_wording.pdf',
      document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      extracted_at: '2026-06-15T12:00:00Z',
      confidence_score: 0.98,
      page_provenance: {
        room_rent: 12,
        waiting_period: 16,
        restoration: 19,
        exclusions: 25,
        copay: 8
      },
      contract_excerpt: {
        room_rent: "Section 2.1 (Room Rent & Nursing Charges): The Insured person is eligible for any room category including Single Private Room or Deluxe Suite with NO CAPPING. Proportionate deduction penalty is permanently waived.",
        waiting_period: "Section 4.1 (Pre-Existing Diseases): A waiting period of 24 continuous months shall apply to all pre-existing medical conditions disclosed during proposal submission.",
        restoration: "Section 3.4 (Secure Benefit & Restore): Sum Insured automatically reloads by 100% instantly upon first claim exhaustion, applicable even for same illness in subsequent hospitalizations."
      }
    }
  },
  {
    id: 'care-supreme',
    provider: 'Care Health Insurance',
    plan_name: 'Care Supreme Health Shield',
    version: '2026 Edition',
    category: 'health',
    premium: 17200,
    sum_insured: 1500000,
    policy_term_years: 1,
    room_rent: {
      type: 'single_private_room',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 24
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: 'Cumulative 500% NCB Multiplier + Unlimited Auto Recharge',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 500,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 60,
    post_hospitalization_days: 180,
    opd_benefit_included: true,
    global_coverage_included: false,
    cashless_hospitals_count: 11400,
    claim_settlement_ratio: 95.8,
    exclusions: [
      'Unproven medical procedures and dietary supplements',
      'Weight loss or bariatric surgery unless life-threatening BMI > 40',
      'Dental consultations and surgeries unless resulting from accidental trauma'
    ],
    sub_limits: [
      {
        treatment_name: 'Cataract surgery',
        limit_amount: 60000
      }
    ],
    source_metadata: {
      document_name: 'care_supreme_policy_wording_2026.pdf',
      document_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      extracted_at: '2026-07-01T09:15:00Z',
      confidence_score: 0.97,
      page_provenance: {
        room_rent: 8,
        waiting_period: 14,
        restoration: 17,
        exclusions: 22,
        sub_limits: 24
      },
      contract_excerpt: {
        room_rent: "Section B.1: Up to Single Private AC Room category. No proportionate billing deduction applied if upgraded room is not chosen.",
        waiting_period: "Section C.3: Pre-existing condition waiting duration is 24 months from policy inception date.",
        restoration: "Section B.9: Unlimited Auto Recharge triggers whenever base sum insured plus accumulated bonus is insufficient."
      }
    }
  },
  {
    id: 'niva-bupa-reassure-2',
    provider: 'Niva Bupa',
    plan_name: 'ReAssure 2.0 Titanium',
    version: '2026 Platinum Series',
    category: 'health',
    premium: 15800,
    sum_insured: 1000000,
    policy_term_years: 1,
    room_rent: {
      type: 'single_private_room',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 36
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: 'ReAssure Forever (Active from 1st claim, unexhaustible)',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 100,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 60,
    post_hospitalization_days: 180,
    opd_benefit_included: false,
    global_coverage_included: false,
    cashless_hospitals_count: 10000,
    claim_settlement_ratio: 96.1,
    exclusions: [
      'Infertility and assisted conception procedures',
      'Correction of refractive error below 7.5 dioptres',
      'Circumcision unless medically necessary due to infection'
    ],
    sub_limits: [],
    source_metadata: {
      document_name: 'niva_bupa_reassure_2_wording.pdf',
      document_hash: '2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
      extracted_at: '2026-05-10T14:20:00Z',
      confidence_score: 0.96,
      page_provenance: {
        room_rent: 7,
        waiting_period: 15,
        restoration: 11,
        exclusions: 28
      },
      contract_excerpt: {
        room_rent: "Clause 3.1: Single Private Room entitlement. No sub-limit or percentage capping on room tariff.",
        waiting_period: "Clause 5.2: Pre-existing diseases covered after 36 months of continuous renewals with the company.",
        restoration: "Clause 2.4 (ReAssure Forever): Triggers on 1st claim itself and stays active for lifetime policy continuity."
      }
    }
  },
  {
    id: 'star-comprehensive',
    provider: 'Star Health',
    plan_name: 'Star Comprehensive Health Insurance',
    version: '2025 Wording',
    category: 'health',
    premium: 16400,
    sum_insured: 1000000,
    policy_term_years: 1,
    room_rent: {
      type: 'single_private_room',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 36
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: '100% Sum Insured Restoration once per policy year',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 100,
    maternity_covered: true,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 60,
    post_hospitalization_days: 90,
    opd_benefit_included: true,
    global_coverage_included: false,
    cashless_hospitals_count: 14000,
    claim_settlement_ratio: 92.5,
    exclusions: [
      'Cosmetic surgery and laser eye surgery for vision enhancement',
      'Self-inflicted harm or alcohol-induced trauma',
      'Genetic disorders and experimental medicine trials'
    ],
    sub_limits: [
      {
        treatment_name: 'Maternity normal delivery',
        limit_amount: 50000
      },
      {
        treatment_name: 'Maternity caesarean section',
        limit_amount: 100000
      },
      {
        treatment_name: 'Cataract surgery per eye',
        limit_amount: 40000
      }
    ],
    source_metadata: {
      document_name: 'star_comprehensive_policy_spec.pdf',
      document_hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      extracted_at: '2025-11-20T16:00:00Z',
      confidence_score: 0.94,
      page_provenance: {
        room_rent: 5,
        waiting_period: 12,
        restoration: 14,
        maternity: 18,
        exclusions: 21,
        sub_limits: 23
      },
      contract_excerpt: {
        room_rent: "Clause 1.A: Room, boarding and nursing expenses up to Single Standard AC room.",
        maternity: "Clause 2.G (Maternity Cover): Delivery expenses covered up to specified sub-limits with a 24-month waiting period.",
        waiting_period: "Clause 4.1: PED waiting period of 36 months applies before admissible hospitalization."
      }
    }
  },
  {
    id: 'icici-elevate',
    provider: 'ICICI Lombard',
    plan_name: 'Elevate Comprehensive Shield',
    version: '2026 Smart Edition',
    category: 'health',
    premium: 19500,
    sum_insured: 2500000,
    policy_term_years: 1,
    room_rent: {
      type: 'no_capping',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 24
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: 'Infinite Sum Insured Reset (Unlimited reloads)',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 100,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 90,
    post_hospitalization_days: 180,
    opd_benefit_included: true,
    global_coverage_included: true,
    cashless_hospitals_count: 13200,
    claim_settlement_ratio: 97.8,
    exclusions: [
      'Pure wellness retreats and rejuvenation spas',
      'Unproven stem-cell transplants',
      'Injuries arising from war, nuclear hazard or illegal activity'
    ],
    sub_limits: [],
    source_metadata: {
      document_name: 'icici_lombard_elevate_wording_2026.pdf',
      document_hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      extracted_at: '2026-08-01T11:45:00Z',
      confidence_score: 0.99,
      page_provenance: {
        room_rent: 4,
        waiting_period: 9,
        restoration: 13,
        exclusions: 19
      },
      contract_excerpt: {
        room_rent: "Section 2.1: Any Room Category without limit or capping. All proportionate room deduction clauses strictly removed.",
        waiting_period: "Section 3.2: 24 months pre-existing condition waiting period, expedited by 12 months with claim-free history.",
        restoration: "Section 2.7 (Infinite Reload): Resets base cover instantly an unlimited number of times within the same policy year."
      }
    }
  },
  {
    id: 'aditya-birla-activ-one',
    provider: 'Aditya Birla Health',
    plan_name: 'Activ One Max',
    version: '2026 Super Elite',
    category: 'health',
    premium: 18200,
    sum_insured: 2000000,
    policy_term_years: 1,
    room_rent: {
      type: 'no_capping',
      limit_amount: null,
      limit_percentage: null
    },
    icu_limit: {
      type: 'no_capping',
      limit_amount: null
    },
    waiting_period_months: {
      initial: 30,
      specific_disease: 24,
      pre_existing: 24
    },
    copayment_percentage: 0,
    deductible_amount: 0,
    restoration_benefit: true,
    restoration_type: '100% Reload with HealthReturns (up to 100% premium cashback)',
    no_claim_bonus_percentage: 50,
    no_claim_bonus_max_multiplier: 100,
    maternity_covered: false,
    daycare_treatments_covered: true,
    pre_hospitalization_days: 90,
    post_hospitalization_days: 180,
    opd_benefit_included: true,
    global_coverage_included: false,
    cashless_hospitals_count: 10800,
    claim_settlement_ratio: 96.7,
    exclusions: [
      'Cosmetic surgery and beauty interventions',
      'Self-inflicted harm or substance misuse',
      'Unproven alternative experimental procedures'
    ],
    sub_limits: [],
    source_metadata: {
      document_name: 'aditya_birla_activ_one_terms.pdf',
      document_hash: '5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      extracted_at: '2026-06-28T10:30:00Z',
      confidence_score: 0.97,
      page_provenance: {
        room_rent: 6,
        waiting_period: 11,
        restoration: 15,
        exclusions: 24
      },
      contract_excerpt: {
        room_rent: "Clause 2.1: No room rent restrictions. Single Private Room up to Suite is eligible.",
        waiting_period: "Clause 4.1: Pre-existing condition waiting is strictly 24 months.",
        restoration: "Clause 3.2: 100% Sum Insured Restoration activates on partial or complete exhaustion of base coverage."
      }
    }
  }
];

export const sampleVersionSets: PolicyVersionSet[] = [
  {
    id: 'hdfc-optima-diff-set',
    plan_name: 'HDFC ERGO Optima Secure',
    provider: 'HDFC ERGO',
    old_version: {
      id: 'hdfc-optima-2024',
      provider: 'HDFC ERGO',
      plan_name: 'Optima Secure (2024 Wording)',
      version: '2024 Edition',
      category: 'health',
      premium: 13800,
      sum_insured: 1000000,
      policy_term_years: 1,
      room_rent: { type: 'single_private_room', limit_amount: null, limit_percentage: null },
      waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 36 },
      copayment_percentage: 0,
      deductible_amount: 0,
      restoration_benefit: true,
      no_claim_bonus_percentage: 50,
      maternity_covered: false,
      daycare_treatments_covered: true,
      pre_hospitalization_days: 60,
      post_hospitalization_days: 180,
      exclusions: ['Cosmetic surgery', 'Self-inflicted injury', 'Robotic surgeries sub-limit applied'],
      sub_limits: [{ treatment_name: 'Robotic surgery', limit_amount: 100000 }],
      source_metadata: {
        document_name: 'hdfc_optima_secure_2024.pdf',
        document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        extracted_at: '2024-04-01T10:00:00Z',
        confidence_score: 0.98,
        page_provenance: { premium: 2, room_rent: 12, waiting_period: 18, exclusions: 25 }
      }
    },
    new_version: {
      id: 'hdfc-optima-2026',
      provider: 'HDFC ERGO',
      plan_name: 'Optima Secure (2026 Updated Wording)',
      version: '2026 Edition (Current)',
      category: 'health',
      premium: 14900,
      sum_insured: 1000000,
      policy_term_years: 1,
      room_rent: { type: 'no_capping', limit_amount: null, limit_percentage: null },
      waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 24 },
      copayment_percentage: 0,
      deductible_amount: 0,
      restoration_benefit: true,
      no_claim_bonus_percentage: 100,
      maternity_covered: false,
      daycare_treatments_covered: true,
      pre_hospitalization_days: 60,
      post_hospitalization_days: 180,
      exclusions: ['Cosmetic surgery', 'Self-inflicted injury'],
      sub_limits: [],
      source_metadata: {
        document_name: 'hdfc_optima_secure_2026_revised.pdf',
        document_hash: '9c8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
        extracted_at: '2026-06-15T14:30:00Z',
        confidence_score: 0.99,
        page_provenance: { premium: 2, room_rent: 10, waiting_period: 16, exclusions: 22 }
      }
    }
  },
  {
    id: 'care-supreme-diff-set',
    plan_name: 'Care Supreme Health Shield',
    provider: 'Care Health Insurance',
    old_version: {
      id: 'care-supreme-2024',
      provider: 'Care Health Insurance',
      plan_name: 'Care Supreme (2024 Wording)',
      version: '2024 Edition',
      category: 'health',
      premium: 16200,
      sum_insured: 1500000,
      policy_term_years: 1,
      room_rent: { type: 'fixed_amount', limit_amount: 7500, limit_percentage: null },
      waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 36 },
      copayment_percentage: 10,
      deductible_amount: 0,
      restoration_benefit: false,
      no_claim_bonus_percentage: 50,
      maternity_covered: false,
      daycare_treatments_covered: true,
      pre_hospitalization_days: 30,
      post_hospitalization_days: 90,
      exclusions: ['Unproven treatments', 'Weight loss treatments', 'Mental healthcare treatments'],
      sub_limits: [{ treatment_name: 'Cataract surgery', limit_amount: 40000 }],
      source_metadata: {
        document_name: 'care_supreme_2024.pdf',
        document_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        extracted_at: '2024-03-20T11:00:00Z',
        confidence_score: 0.94,
        page_provenance: { premium: 1, room_rent: 7, waiting_period: 14 }
      }
    },
    new_version: {
      id: 'care-supreme-2026',
      provider: 'Care Health Insurance',
      plan_name: 'Care Supreme (2026 Updated Wording)',
      version: '2026 Edition (Current)',
      category: 'health',
      premium: 17800,
      sum_insured: 1500000,
      policy_term_years: 1,
      room_rent: { type: 'single_private_room', limit_amount: null, limit_percentage: null },
      waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 24 },
      copayment_percentage: 0,
      deductible_amount: 0,
      restoration_benefit: true,
      no_claim_bonus_percentage: 50,
      maternity_covered: false,
      daycare_treatments_covered: true,
      pre_hospitalization_days: 60,
      post_hospitalization_days: 180,
      exclusions: ['Unproven treatments', 'Weight loss treatments'],
      sub_limits: [{ treatment_name: 'Cataract surgery', limit_amount: 60000 }],
      source_metadata: {
        document_name: 'care_supreme_2026_wording.pdf',
        document_hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        extracted_at: '2026-07-01T09:15:00Z',
        confidence_score: 0.97,
        page_provenance: { premium: 1, room_rent: 6, waiting_period: 12 }
      }
    }
  }
];
