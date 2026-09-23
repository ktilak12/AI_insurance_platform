export type RoomRentType = 'no_capping' | 'percentage_of_sum_insured' | 'fixed_amount' | 'single_private_room';

export interface RoomRentLimit {
  type: RoomRentType;
  limit_amount: number | null;
  limit_percentage: number | null;
}

export interface WaitingPeriods {
  initial: number;
  specific_disease: number;
  pre_existing: number;
}

export interface SubLimit {
  treatment_name: string;
  limit_amount: number;
}

export interface SourceMetadata {
  document_name: string;
  document_hash: string;
  extracted_at: string;
  confidence_score: number;
  page_provenance: Record<string, number>;
}

export interface InsurancePolicy {
  id?: string;
  provider: string;
  plan_name: string;
  category: 'health' | 'motor' | 'travel' | 'home' | 'life';
  premium: number;
  sum_insured: number;
  policy_term_years: number;
  room_rent: RoomRentLimit;
  waiting_period_months: WaitingPeriods;
  copayment_percentage: number;
  deductible_amount: number;
  restoration_benefit: boolean;
  no_claim_bonus_percentage: number;
  maternity_covered: boolean;
  daycare_treatments_covered: boolean;
  pre_hospitalization_days: number;
  post_hospitalization_days: number;
  exclusions: string[];
  sub_limits: SubLimit[];
  source_metadata: SourceMetadata;
}

export interface UserRequirementProfile {
  age?: number;
  city?: string;
  family_members_count?: number;
  budget_max?: number;
  sum_insured_target?: number;
  max_acceptable_waiting_months?: number;
  pre_existing_conditions?: string[];
  preferences?: {
    low_premium?: boolean;
    high_coverage?: boolean;
    low_waiting_period?: boolean;
    no_copay?: boolean;
    maternity?: boolean;
    restoration?: boolean;
  };
}

export interface FitAnalysisResult {
  plan_id: string;
  plan_name: string;
  provider: string;
  overall_fit_percentage: number;
  breakdown: {
    budget_fit: boolean | 'warning';
    coverage_fit: boolean | 'warning';
    waiting_period_fit: boolean | 'warning';
    copay_fit: boolean | 'warning';
    maternity_fit: boolean | 'warning';
  };
  explanation_points: string[];
}
