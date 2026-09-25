export interface ProfilingQuestionOption {
  value: any;
  label: string;
  description?: string;
  badge?: string;
  icon?: string;
}

export interface ProfilingQuestion {
  id: number;
  key: string;
  category: string;
  title: string;
  subtitle: string;
  inputType: 'card-select' | 'slider' | 'multi-select' | 'select' | 'toggle-group';
  options?: ProfilingQuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  whyItMatters: {
    actuarialReason: string;
    claimRiskWarning: string;
    regulationContext?: string;
  };
}

export const profilingQuestions: ProfilingQuestion[] = [
  {
    id: 1,
    key: 'persona',
    category: 'Protection Scope',
    title: 'Who are you securing insurance protection for?',
    subtitle: 'Family composition directly determines floater vs individual pricing structure and maternity eligibility.',
    inputType: 'card-select',
    options: [
      {
        value: 'individual',
        label: 'Just Myself',
        description: 'Single individual coverage with tailored individual sum insured',
        icon: 'User'
      },
      {
        value: 'couple',
        label: 'Myself & Spouse',
        description: 'Joint floater cover with optional maternity riders',
        icon: 'Users'
      },
      {
        value: 'family',
        label: 'Nuclear Family (2 Adults + Kids)',
        description: 'Shared floater sum insured across parents and dependent children',
        icon: 'Home'
      },
      {
        value: 'senior',
        label: 'Senior Parents / Elderly (60+)',
        description: 'Plans optimized for senior citizen pre-existing disease waivers and low copay',
        icon: 'HeartHandshake'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Family floater plans calculate base premium based on the eldest member age. Separate policies are mathematically superior when parent age difference exceeds 15 years.',
      claimRiskWarning: 'In floater policies, a single large claim exhausts the sum insured pool for all members in that policy year unless auto-restoration is enabled.',
      regulationContext: 'IRDAI allows dependent children coverage up to age 25 under family floaters.'
    }
  },
  {
    id: 2,
    key: 'age',
    category: 'Demographics',
    title: 'What is the age of the eldest family member to be insured?',
    subtitle: 'Underwriting risk tiers, medical check-up requirements, and premium pricing index on the eldest insured age.',
    inputType: 'slider',
    min: 18,
    max: 85,
    step: 1,
    unit: 'Years',
    whyItMatters: {
      actuarialReason: 'Mortality and hospitalization morbidity curves step upward sharply at age bands 35, 45, and 60.',
      claimRiskWarning: 'Entering a health policy before age 45 locks in claim-free waiting periods before age-related chronic conditions develop.',
      regulationContext: 'IRDAI removed maximum entry age barriers in 2024, enabling senior citizens to purchase health coverage without arbitrary age ceilings.'
    }
  },
  {
    id: 3,
    key: 'city_tier',
    category: 'Location & Network',
    title: 'Which city tier is your primary residence located in?',
    subtitle: 'Hospitalization room costs vary 3x between Metro Tier-1 and Tier-3 cities, affecting zone copay rules.',
    inputType: 'card-select',
    options: [
      {
        value: 'tier_1',
        label: 'Tier 1 Metro',
        description: 'Delhi NCR, Mumbai MMR, Bengaluru, Hyderabad, Chennai, Kolkata',
        badge: 'High Medical Inflation',
        icon: 'Building2'
      },
      {
        value: 'tier_2',
        label: 'Tier 2 Cities',
        description: 'Pune, Ahmedabad, Jaipur, Kochi, Chandigarh, Lucknow, Indore',
        badge: 'Moderate Tariffs',
        icon: 'Building'
      },
      {
        value: 'tier_3',
        label: 'Tier 3 & Regional Towns',
        description: 'All other district headquarters, towns, and rural areas',
        badge: 'Zone Discount Eligible',
        icon: 'MapPin'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Some insurers enforce Zone-Based pricing. If you buy a Tier-3 discounted policy and get hospitalized in a Tier-1 Metro, you may face an unexpected 15-20% co-payment.',
      claimRiskWarning: 'Always choose National Zone 1 coverage if there is any chance you will seek specialized surgery in a Metro tertiary hospital.',
      regulationContext: 'National cashless network mandates ensure any empanelled hospital can offer cashless admission irrespective of geography.'
    }
  },
  {
    id: 4,
    key: 'sum_insured_target',
    category: 'Financial Shield',
    title: 'What is your target Sum Insured (Coverage Amount)?',
    subtitle: 'Medical inflation in India runs at 14% annually; tertiary cardiac or oncology treatments average ₹12L-₹20L.',
    inputType: 'slider',
    min: 500000,
    max: 5000000,
    step: 250000,
    unit: 'INR',
    whyItMatters: {
      actuarialReason: 'A ₹10 Lakh sum insured is the modern baseline for urban couples. ₹25 Lakhs+ provides safe buffer against complex ICU admissions and robotic surgeries.',
      claimRiskWarning: 'Under-insuring leads to out-of-pocket debt when ICU room rents and specialty drugs breach policy caps.',
      regulationContext: 'Super Top-Up policies can cost-effectively enhance a ₹10L base cover to ₹1 Crore.'
    }
  },
  {
    id: 5,
    key: 'budget_max',
    category: 'Financial Shield',
    title: 'What is your maximum comfortable annual premium budget?',
    subtitle: 'We filter plans mathematically within your budget without artificially boosting costly corporate affiliate plans.',
    inputType: 'slider',
    min: 8000,
    max: 45000,
    step: 1000,
    unit: 'INR / year',
    whyItMatters: {
      actuarialReason: 'Health insurance premiums are recurring lifelong commitments. A sustainable budget ensures you never let policies lapse, protecting accrued waiting period credits.',
      claimRiskWarning: 'Do not compromise on essential clauses (like room rent capping or zero co-pay) merely to save ₹1,500/year.',
      regulationContext: 'Section 80D of the Income Tax Act grants tax deductions up to ₹25,000 for self/family and ₹50,000 for senior citizen parents.'
    }
  },
  {
    id: 6,
    key: 'pre_existing_conditions',
    category: 'Medical History',
    title: 'Do any insured members have pre-existing health conditions (PED)?',
    subtitle: 'Declaring past medical history ensures 100% claim admissibility after completing the mandatory waiting period.',
    inputType: 'multi-select',
    options: [
      {
        value: 'none',
        label: 'None / Fully Healthy',
        description: 'No chronic conditions diagnosed or on daily maintenance medications',
        icon: 'ShieldCheck'
      },
      {
        value: 'diabetes',
        label: 'Diabetes (Type 1 or 2)',
        description: 'Elevated blood sugar, on oral hypoglycemics or insulin',
        icon: 'Activity'
      },
      {
        value: 'hypertension',
        label: 'Hypertension (High Blood Pressure)',
        description: 'On regular anti-hypertensive medication',
        icon: 'HeartPulse'
      },
      {
        value: 'thyroid',
        label: 'Thyroid Disorder',
        description: 'Hypo/Hyperthyroidism on regular thyroxine dosage',
        icon: 'Pill'
      },
      {
        value: 'asthma',
        label: 'Asthma / Respiratory Conditions',
        description: 'Chronic bronchitis or regular inhaler usage',
        icon: 'Wind'
      },
      {
        value: 'cardiac',
        label: 'Cardiac / Heart Conditions',
        description: 'Past stent, angioplasty, or lipid management medication',
        icon: 'Heart'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Insurers apply waiting periods (24 to 36 months) before claims linked directly to declared conditions become admissible.',
      claimRiskWarning: 'Non-disclosure of pre-existing diseases is the #1 cause of claim rejections in India under Section 45 fraud clauses.',
      regulationContext: 'Under IRDAI Master Circular 2024, after 60 continuous months of premium payments, insurers cannot contest or reject claims on grounds of pre-existing non-disclosure except proven intentional fraud.'
    }
  },
  {
    id: 7,
    key: 'room_rent_preference',
    category: 'Hospitalization Comfort',
    title: 'What room category standard do you expect during hospital stays?',
    subtitle: 'Crucial: Room Rent limits trigger proportionate deductions on your ENTIRE hospital bill if breached!',
    inputType: 'card-select',
    options: [
      {
        value: 'no_capping',
        label: 'No Capping / Any Room Category',
        description: 'Stay in Single Private, Deluxe, or Suite with ZERO proportionate bill deduction penalty',
        badge: 'Safest • Recommended',
        icon: 'Sparkles'
      },
      {
        value: 'single_private',
        label: 'Single Private AC Room',
        description: 'Standard single private room with dedicated washroom, no tariff percentage ceiling',
        badge: 'Optimal Value',
        icon: 'CheckCircle2'
      },
      {
        value: 'any',
        label: 'Shared / Fixed Cap (Economy)',
        description: 'Accept fixed limits (e.g. 1% of Sum Insured / ₹5,000/day) in exchange for lowest premium',
        badge: 'Proportionate Risk',
        icon: 'AlertTriangle'
      }
    ],
    whyItMatters: {
      actuarialReason: 'If a policy caps room rent at 1% of ₹5L (₹5,000/day) and you occupy a ₹10,000/day room, the insurer deducts 50% from the surgeon fees, OT charges, and nursing fees as well (proportionate deduction trap).',
      claimRiskWarning: 'Never buy a health policy with percentage room rent capping unless you understand and accept the proportionate deduction penalty.',
      regulationContext: 'Modern 2026 standardized contracts favor Single Private Room clauses as the consumer benchmark.'
    }
  },
  {
    id: 8,
    key: 'max_acceptable_waiting_months',
    category: 'Waiting Durations',
    title: 'What is your maximum acceptable waiting period for pre-existing diseases?',
    subtitle: 'How long are you willing to wait before chronic disease claims become fully claimable?',
    inputType: 'card-select',
    options: [
      {
        value: 12,
        label: '12 Months (1 Year)',
        description: 'Expedited waiting period via premium add-on or fast-track underwriter rider',
        badge: 'Fastest Cover',
        icon: 'Zap'
      },
      {
        value: 24,
        label: '24 Months (2 Years)',
        description: 'Standard updated 2026 IRDAI recommended consumer benchmark',
        badge: 'IRDAI Standard',
        icon: 'Shield'
      },
      {
        value: 36,
        label: '36 Months (3 Years)',
        description: 'Traditional waiting window, available with lower base premiums',
        badge: 'Economy',
        icon: 'Clock'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Waiting periods protect insurer solvency against adverse selection (people buying insurance only when surgery is imminent).',
      claimRiskWarning: 'Emergency accidents are covered from Day 1 (after 30-day initial waiting window), but elective and pre-existing conditions strictly observe this clock.',
      regulationContext: 'IRDAI reduced maximum pre-existing waiting periods from 48 months to a strict 36-month ceiling in recent master directives.'
    }
  },
  {
    id: 9,
    key: 'copay_tolerance',
    category: 'Out-of-Pocket Terms',
    title: 'Are you willing to pay a Co-Payment on admissible claims?',
    subtitle: 'Co-pay is the percentage of every approved hospital invoice you agree to pay from your own pocket.',
    inputType: 'card-select',
    options: [
      {
        value: 0,
        label: '0% Mandatory Co-Pay (Zero Co-Pay)',
        description: 'Insurer covers 100% of approved hospital bill items. Zero out-of-pocket deduction.',
        badge: '100% Insurer Paid',
        icon: 'ShieldCheck'
      },
      {
        value: 10,
        label: 'Up to 10% Co-Pay',
        description: 'You pay 10% of hospital invoice, insurer pays 90%. Reduces annual premium by ~12%.',
        badge: 'Moderate Discount',
        icon: 'Percent'
      },
      {
        value: 20,
        label: 'Up to 20% Co-Pay',
        description: 'You pay 20% of every claim. Recommended only for senior citizens over 70 where zero copay is unavailable.',
        badge: 'Heavy Discount',
        icon: 'AlertCircle'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Co-payments lower insurer claims exposure and moral hazard, which allows discounts on high-risk age groups.',
      claimRiskWarning: 'On a ₹10,00,000 cancer therapy bill, a 20% copay forces an immediate ₹2,00,000 cash outlay from your personal savings.',
      regulationContext: 'Look out for hidden "Zone Co-payments" or "Age-based Co-payments" disguised in policy footnotes.'
    }
  },
  {
    id: 10,
    key: 'preferences',
    category: 'High-Value Benefits',
    title: 'Which specialized benefits and modern policy riders do you require?',
    subtitle: 'Select essential policy features to match against verified contract clauses.',
    inputType: 'toggle-group',
    options: [
      {
        value: 'restoration',
        label: '100% Automatic Sum Insured Restoration',
        description: 'Instantly restores 100% coverage if exhausted by a previous claim during the same policy year',
        icon: 'RefreshCw'
      },
      {
        value: 'ncb_booster',
        label: 'No Claim Bonus Booster (50% - 100% / yr)',
        description: 'Doubles your sum insured after 2 claim-free renewal years without increasing base premium',
        icon: 'TrendingUp'
      },
      {
        value: 'no_copay',
        label: 'Strict Zero Co-payment Guarantee',
        description: 'Filters out any plan that imposes mandatory hospital claim co-payments',
        icon: 'Lock'
      },
      {
        value: 'maternity',
        label: 'Maternity & Newborn Delivery Cover',
        description: 'Includes normal/C-section delivery expenses, vaccinations, and infant cover',
        icon: 'Baby'
      },
      {
        value: 'opd_cover',
        label: 'OPD Doctor Consultations & Diagnostics',
        description: 'Reimburses routine clinic doctor fees, blood tests, and pharmacy bills',
        icon: 'Stethoscope'
      },
      {
        value: 'global_cover',
        label: 'Global Emergency Overseas Hospitalization',
        description: 'Emergency medical treatment covered during international business and leisure travel',
        icon: 'Globe'
      }
    ],
    whyItMatters: {
      actuarialReason: 'Auto-restoration gives you double the effective coverage during catastrophic medical years without paying double premium.',
      claimRiskWarning: 'Maternity coverage typically has a 24-36 month waiting window and specific sub-limits (e.g. ₹50k normal, ₹1L C-section).',
      regulationContext: 'All modern policies now cover Day Care procedures (surgeries completed under 24 hours like dialysis, chemotherapy, and cataract).'
    }
  }
];
