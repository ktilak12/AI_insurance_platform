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
  contract_excerpt?: Record<string, string>;
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  plan_name: string;
  version?: string;
  category: 'health' | 'motor' | 'travel' | 'home' | 'life';
  premium: number;
  sum_insured: number;
  policy_term_years: number;
  room_rent: RoomRentLimit;
  icu_limit?: {
    type: 'no_capping' | 'fixed_amount' | 'percentage_of_sum_insured';
    limit_amount?: number | null;
  };
  waiting_period_months: WaitingPeriods;
  copayment_percentage: number;
  deductible_amount: number;
  restoration_benefit: boolean;
  restoration_type?: string;
  no_claim_bonus_percentage: number;
  no_claim_bonus_max_multiplier?: number;
  maternity_covered: boolean;
  daycare_treatments_covered: boolean;
  pre_hospitalization_days: number;
  post_hospitalization_days: number;
  opd_benefit_included?: boolean;
  global_coverage_included?: boolean;
  cashless_hospitals_count?: number;
  claim_settlement_ratio?: number;
  exclusions: string[];
  sub_limits: SubLimit[];
  source_metadata: SourceMetadata;
}

export interface UserRequirementProfile {
  persona?: 'individual' | 'couple' | 'family' | 'senior';
  age?: number;
  eldest_member_age?: number;
  city?: string;
  city_tier?: 'tier_1' | 'tier_2' | 'tier_3';
  family_members_count?: number;
  budget_max?: number;
  sum_insured_target?: number;
  max_acceptable_waiting_months?: number;
  pre_existing_conditions?: string[];
  room_rent_preference?: 'no_capping' | 'single_private' | 'any';
  copay_tolerance?: 0 | 10 | 20;
  preferences?: {
    low_premium?: boolean;
    high_coverage?: boolean;
    low_waiting_period?: boolean;
    no_copay?: boolean;
    maternity?: boolean;
    restoration?: boolean;
    opd_cover?: boolean;
    global_cover?: boolean;
    ncb_booster?: boolean;
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
    room_rent_fit: boolean | 'warning';
    copay_fit: boolean | 'warning';
    maternity_fit: boolean | 'warning';
    restoration_fit: boolean | 'warning';
  };
  explanation_points: string[];
  positive_matches: string[];
  caveats_and_warnings: string[];
}

export interface GroundedCitation {
  page_number: number;
  section_name: string;
  supporting_quote: string;
  document_name?: string;
  document_hash?: string;
  confidence?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  plan_id?: string;
  plan_name?: string;
  is_grounded?: boolean;
  confidence?: number;
  citation?: GroundedCitation;
}

// --- Phase 3 Diff Engine & B2B Types ---

export type DiffImpact = 'FAVORABLE' | 'RESTRICTIVE' | 'NEUTRAL';

export interface ClauseDiff {
  clause_category: string;
  field_name: string;
  old_value: string;
  new_value: string;
  impact: DiffImpact;
  explanation: string;
  old_page?: number;
  new_page?: number;
}

export interface PolicyDiffSummary {
  favorable_count: number;
  restrictive_count: number;
  neutral_count: number;
  overall_sentiment: 'IMPROVED' | 'DETERIORATED' | 'UNCHANGED' | 'MIXED';
  executive_summary: string;
  claims_impact_score: number;
}

export interface PolicyVersionDiffResponse {
  base_plan_name: string;
  base_version: string;
  target_version: string;
  summary: PolicyDiffSummary;
  clause_diffs: ClauseDiff[];
}

export interface PolicyVersionSet {
  id: string;
  plan_name: string;
  provider: string;
  old_version: InsurancePolicy;
  new_version: InsurancePolicy;
}

export interface DocumentExtractionItemResult {
  document_url: string;
  document_name: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  policy?: InsurancePolicy;
  confidence_score: number;
  requires_human_review: boolean;
  review_reasons: string[];
  processing_time_ms: number;
  error_message?: string;
}

export interface BatchJobStatusResponse {
  job_id: string;
  client_id: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'PARTIALLY_FAILED' | 'FAILED';
  total_documents: number;
  completed_count: number;
  failed_count: number;
  created_at: string;
  completed_at?: string;
  results: DocumentExtractionItemResult[];
}
