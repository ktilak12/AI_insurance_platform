import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  SlidersHorizontal,
  FileCheck,
  Send,
  Building2,
  Lock,
  GitCompare,
  Layers,
  Code2,
  Terminal,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  FileDiff,
  Cpu,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  InsurancePolicy, 
  UserRequirementProfile, 
  PolicyVersionSet, 
  PolicyVersionDiffResponse,
  DiffImpact 
} from './types/policy';

const initialSamplePolicies: InsurancePolicy[] = [
  {
    id: 'hdfc-optima-secure',
    provider: 'HDFC ERGO',
    plan_name: 'Optima Secure',
    category: 'health',
    premium: 14500,
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
    exclusions: ['Cosmetic surgery', 'Self-inflicted injury', 'Adventure sports accidents'],
    sub_limits: [],
    source_metadata: {
      document_name: 'hdfc_ergo_optima_secure_wording.pdf',
      document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      extracted_at: '2026-09-23T12:00:00Z',
      confidence_score: 0.98,
      page_provenance: { room_rent: 12, waiting_period: 18, exclusions: 25 }
    }
  },
  {
    id: 'care-supreme',
    provider: 'Care Health Insurance',
    plan_name: 'Care Supreme',
    category: 'health',
    premium: 17200,
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
    exclusions: ['Unproven treatments', 'Weight loss therapies', 'Routine dental exams'],
    sub_limits: [{ treatment_name: 'Cataract surgery', limit_amount: 40000 }],
    source_metadata: {
      document_name: 'care_supreme_wording.pdf',
      document_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      extracted_at: '2026-09-23T12:30:00Z',
      confidence_score: 0.95,
      page_provenance: { room_rent: 8, waiting_period: 14, sub_limits: 22 }
    }
  }
];

const sampleVersionSets: PolicyVersionSet[] = [
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'compare' | 'diff' | 'b2b' | 'chat'>('compare');
  const [selectedCategory, setSelectedCategory] = useState<'health' | 'motor' | 'travel'>('health');
  
  // User Requirements Questionnaire State
  const [requirements, setRequirements] = useState<UserRequirementProfile>({
    age: 32,
    city: 'Bengaluru',
    budget_max: 20000,
    sum_insured_target: 1000000,
    max_acceptable_waiting_months: 36,
    preferences: {
      no_copay: true,
      maternity: false,
      restoration: true
    }
  });

  // Phase 3 Diff Engine State
  const [selectedVersionSetId, setSelectedVersionSetId] = useState<string>(sampleVersionSets[0].id);
  const [diffFilter, setDiffFilter] = useState<'ALL' | 'FAVORABLE' | 'RESTRICTIVE'>('ALL');

  // Phase 3 B2B API Demo State
  const [b2bClientId, setB2bClientId] = useState('broker_nexus_corp');
  const [b2bApiKey, setB2bApiKey] = useState('pl_live_9f83a2e18d42c90e');
  const [b2bDocsInput, setB2bDocsInput] = useState(
    'https://storage.policylens.ai/partners/hdfc_optima_wording.pdf\nhttps://storage.policylens.ai/partners/care_supreme_2026.pdf'
  );
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchJobResult, setBatchJobResult] = useState<any>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'python' | 'node'>('curl');
  const [copiedKey, setCopiedKey] = useState(false);

  // AI Grounded Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    citation?: { page: number; section: string; quote: string };
  }>>([
    {
      sender: 'ai',
      text: 'Ask any specific coverage question. I provide answers strictly backed by verified policy document wording with page citations.'
    }
  ]);

  const [isAsking, setIsAsking] = useState(false);

  // Calculate current diff
  const currentSet = sampleVersionSets.find(s => s.id === selectedVersionSetId) || sampleVersionSets[0];
  
  const calculateLocalDiff = (set: PolicyVersionSet): PolicyVersionDiffResponse => {
    const oldP = set.old_version;
    const newP = set.new_version;
    const diffs: any[] = [];

    // Premium
    if (oldP.premium !== newP.premium) {
      const diff = newP.premium - oldP.premium;
      diffs.push({
        clause_category: 'financials',
        field_name: 'Annual Base Premium',
        old_value: `₹${oldP.premium.toLocaleString('en-IN')}`,
        new_value: `₹${newP.premium.toLocaleString('en-IN')}`,
        impact: diff > 0 ? 'RESTRICTIVE' : 'FAVORABLE',
        explanation: `Premium increased by ₹${Math.abs(diff).toLocaleString('en-IN')} (+${(((newP.premium - oldP.premium)/oldP.premium)*100).toFixed(1)}%) reflecting inflation adjustment.`,
        old_page: 2,
        new_page: 2
      });
    }

    // Room Rent
    if (oldP.room_rent.type !== newP.room_rent.type) {
      diffs.push({
        clause_category: 'room_rent',
        field_name: 'Room Rent Capping Clause',
        old_value: oldP.room_rent.type.replace(/_/g, ' ').toUpperCase(),
        new_value: newP.room_rent.type.replace(/_/g, ' ').toUpperCase(),
        impact: 'FAVORABLE',
        explanation: 'Room rent restriction lifted to no capping / single private room. Proportionate deductions on doctor visits and surgery fees are now 100% waived.',
        old_page: oldP.source_metadata.page_provenance?.room_rent || 8,
        new_page: newP.source_metadata.page_provenance?.room_rent || 6
      });
    }

    // Pre-Existing Disease
    if (oldP.waiting_period_months.pre_existing !== newP.waiting_period_months.pre_existing) {
      diffs.push({
        clause_category: 'waiting_period',
        field_name: 'Pre-Existing Disease (PED) Waiting Window',
        old_value: `${oldP.waiting_period_months.pre_existing} Months (3 Yrs)`,
        new_value: `${newP.waiting_period_months.pre_existing} Months (2 Yrs)`,
        impact: 'FAVORABLE',
        explanation: 'PED waiting period reduced from 36 to 24 months, aligning with revised IRDAI consumer protection master circulars.',
        old_page: oldP.source_metadata.page_provenance?.waiting_period || 14,
        new_page: newP.source_metadata.page_provenance?.waiting_period || 12
      });
    }

    // Co-Payment
    if (oldP.copayment_percentage !== newP.copayment_percentage) {
      diffs.push({
        clause_category: 'copay',
        field_name: 'Mandatory Co-Payment',
        old_value: `${oldP.copayment_percentage}% Co-Pay`,
        new_value: `${newP.copayment_percentage}% (Zero Co-Pay)`,
        impact: 'FAVORABLE',
        explanation: 'Mandatory co-payment clause removed. Insurer covers 100% of approved hospital claim invoices.',
        old_page: 4,
        new_page: 4
      });
    }

    // NCB
    if (oldP.no_claim_bonus_percentage !== newP.no_claim_bonus_percentage) {
      diffs.push({
        clause_category: 'ncb',
        field_name: 'No Claim Bonus (NCB) Multiplier',
        old_value: `${oldP.no_claim_bonus_percentage}% per claim-free year`,
        new_value: `${newP.no_claim_bonus_percentage}% per claim-free year`,
        impact: 'FAVORABLE',
        explanation: `Bonus cover doubling speed enhanced to ${newP.no_claim_bonus_percentage}% per claim-free renewal.`,
        old_page: 6,
        new_page: 5
      });
    }

    // Restoration
    if (oldP.restoration_benefit !== newP.restoration_benefit) {
      diffs.push({
        clause_category: 'restoration',
        field_name: 'Automatic Sum Insured Restoration',
        old_value: oldP.restoration_benefit ? 'Included' : 'Not Available',
        new_value: newP.restoration_benefit ? 'Included (100% Auto-Recharge)' : 'Not Available',
        impact: newP.restoration_benefit ? 'FAVORABLE' : 'RESTRICTIVE',
        explanation: '100% automatic sum insured reload upon exhaustion for unrelated illnesses now built into base contract.',
        old_page: 9,
        new_page: 7
      });
    }

    // Exclusions
    const removedExc = oldP.exclusions.filter(e => !newP.exclusions.includes(e));
    for (const exc of removedExc) {
      diffs.push({
        clause_category: 'exclusions',
        field_name: 'Exclusion Removed (Coverage Expanded)',
        old_value: `Excluded: ${exc}`,
        new_value: 'Included & Covered',
        impact: 'FAVORABLE',
        explanation: `"${exc}" restriction is lifted in the revised 2026 policy terms.`,
        old_page: 25,
        new_page: 22
      });
    }

    const fav = diffs.filter(d => d.impact === 'FAVORABLE').length;
    const res = diffs.filter(d => d.impact === 'RESTRICTIVE').length;
    const neu = diffs.filter(d => d.impact === 'NEUTRAL').length;

    return {
      base_plan_name: set.plan_name,
      base_version: oldP.version || '2024 Edition',
      target_version: newP.version || '2026 Edition (Current)',
      summary: {
        favorable_count: fav,
        restrictive_count: res,
        neutral_count: neu,
        overall_sentiment: fav > res ? 'IMPROVED' : 'MIXED',
        claims_impact_score: 87.5,
        executive_summary: `The 2026 update to ${set.plan_name} significantly strengthens policyholder claim rights with ${fav} favorable enhancement(s) and only ${res} restrictive change (premium adjustment).`
      },
      clause_diffs: diffs
    };
  };

  const currentDiff = calculateLocalDiff(currentSet);

  const filteredClauseDiffs = currentDiff.clause_diffs.filter(d => {
    if (diffFilter === 'ALL') return true;
    return d.impact === diffFilter;
  });

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const userText = chatQuestion;
    setChatQuestion('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAsking(true);

    setTimeout(() => {
      let aiText = '';
      let citation = undefined;

      const q = userText.toLowerCase();
      if (q.includes('diabetes') || q.includes('pre-existing') || q.includes('waiting')) {
        aiText = "Pre-existing diseases like Diabetes are covered after completing the continuous policy waiting period. Under 2026 IRDAI norms, waiting periods are capped at 24-36 months.";
        citation = {
          page: 16,
          section: "Section 4.1: Pre-existing Conditions Clause",
          quote: "Covered after 24 months of continuous coverage without break."
        };
      } else if (q.includes('room rent') || q.includes('capping')) {
        aiText = "There is no room rent capping limit applied. You are eligible for single private AC room or standard room categories without proportionate deduction penalty.";
        citation = {
          page: 10,
          section: "Section 2.3: Inpatient Hospitalization Benefits",
          quote: "Room rent restriction: No capping. Proportionate deduction waived."
        };
      } else {
        aiText = "Coverage applies subject to standard policy terms and verifiable medical necessity.";
        citation = {
          page: 6,
          section: "Section 1: General Policy Terms",
          quote: "In-patient treatment covered up to the Sum Insured."
        };
      }

      setChatHistory(prev => [
        ...prev, 
        { sender: 'ai', text: aiText, citation }
      ]);
      setIsAsking(false);
    }, 600);
  };

  const handleRunBatchExtraction = () => {
    setIsProcessingBatch(true);
    setBatchJobResult(null);

    const urls = b2bDocsInput.split('\n').filter(u => u.trim().length > 0);

    setTimeout(() => {
      setBatchJobResult({
        job_id: `job_${Math.random().toString(36).substring(2, 11)}`,
        client_id: b2bClientId,
        status: 'COMPLETED',
        total_documents: urls.length,
        completed_count: urls.length,
        failed_count: 0,
        processing_time_total_ms: 1420,
        created_at: new Date().toISOString(),
        results: urls.map((url, idx) => ({
          document_url: url,
          document_name: url.split('/').pop() || `policy_${idx + 1}.pdf`,
          status: 'COMPLETED',
          confidence_score: 0.98 - idx * 0.02,
          requires_human_review: false,
          processing_time_ms: 680 + idx * 120,
          extracted_plan: idx === 0 ? 'HDFC ERGO Optima Secure' : 'Care Supreme Health Shield',
          sum_insured: idx === 0 ? 1000000 : 1500000,
          room_rent_type: 'No Capping'
        }))
      });
      setIsProcessingBatch(false);
    }, 1200);
  };

  const getCodeSnippet = () => {
    if (codeLanguage === 'curl') {
      return `curl -X POST https://api.policylens.ai/v1/b2b/extract-batch \\
  -H "Authorization: Bearer ${b2bApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "${b2bClientId}",
    "document_urls": [
      "https://storage.yourdomain.com/policies/hdfc_optima.pdf",
      "https://storage.yourdomain.com/policies/care_supreme.pdf"
    ],
    "webhook_url": "https://api.yourdomain.com/webhooks/policy-ready"
  }'`;
    }
    if (codeLanguage === 'python') {
      return `import requests

url = "https://api.policylens.ai/v1/b2b/extract-batch"
headers = {
    "Authorization": "Bearer ${b2bApiKey}",
    "Content-Type": "application/json"
}
payload = {
    "client_id": "${b2bClientId}",
    "document_urls": [
        "https://storage.yourdomain.com/policies/hdfc_optima.pdf"
    ],
    "webhook_url": "https://api.yourdomain.com/webhooks/policy-ready"
}

response = requests.post(url, json=payload, headers=headers)
print("Job ID:", response.json().get("job_id"))`;
    }
    return `import axios from 'axios';

const response = await axios.post(
  'https://api.policylens.ai/v1/b2b/extract-batch',
  {
    client_id: '${b2bClientId}',
    document_urls: ['https://storage.yourdomain.com/policies/hdfc_optima.pdf'],
    webhook_url: 'https://api.yourdomain.com/webhooks/policy-ready'
  },
  {
    headers: {
      Authorization: 'Bearer ${b2bApiKey}',
      'Content-Type': 'application/json'
    }
  }
);
console.log('Batch Job Queued:', response.data);`;
  };

  return (
    <div className="min-h-screen pb-16">
      {/* 1. Header & Compliance Navigation */}
      <header className="border-b border-white/10 bg-[#0c1220]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                PolicyLens AI
              </span>
              <span className="hidden sm:inline-block ml-2.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded-full">
                ENTERPRISE READY • IRDAI COMPLIANT
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'compare' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Fit Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'diff' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileDiff className="w-3.5 h-3.5 text-cyan-400" />
              <span>Policy Diff Engine</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">NEW</span>
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'b2b' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>B2B API Portal</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">API</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'chat' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Policy AI Q&A</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Insurance Intelligence • Zero Marketing Bias</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Compare & Diff Insurance with <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Factual Policy Provenance</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Extract, normalize, and diff 70-page insurance PDF contracts into actionable semantic clauses and enterprise APIs.
          </p>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex justify-center gap-3 mb-8">
          <button 
            onClick={() => setSelectedCategory('health')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === 'health'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>🏥</span> Health Insurance (Active MVP)
          </button>
          <button 
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed"
          >
            <span>🚗</span> Motor (Roadmap V2)
          </button>
          <button 
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed"
          >
            <span>✈️</span> Travel (Roadmap V3)
          </button>
        </div>

        {/* TAB 1: FIT ANALYSIS */}
        {activeTab === 'compare' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* User Requirements Intake Form */}
            <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/10">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Requirements</h2>
                  <p className="text-xs text-slate-400">Personalize transparent fit analysis</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Target Coverage (Sum Insured): ₹{(requirements.sum_insured_target! / 100000).toFixed(0)} Lakhs
                  </label>
                  <input 
                    type="range" 
                    min="500000" 
                    max="5000000" 
                    step="500000"
                    value={requirements.sum_insured_target}
                    onChange={(e) => setRequirements({ ...requirements, sum_insured_target: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Max Annual Budget: ₹{requirements.budget_max?.toLocaleString('en-IN')}
                  </label>
                  <input 
                    type="range" 
                    min="10000" 
                    max="40000" 
                    step="1000"
                    value={requirements.budget_max}
                    onChange={(e) => setRequirements({ ...requirements, budget_max: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Max Acceptable Pre-Existing Waiting: {requirements.max_acceptable_waiting_months} Months
                  </label>
                  <select
                    value={requirements.max_acceptable_waiting_months}
                    onChange={(e) => setRequirements({ ...requirements, max_acceptable_waiting_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={48}>48 Months (4 Years)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs font-medium text-slate-300 block mb-2">Preferences</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={requirements.preferences?.no_copay}
                        onChange={(e) => setRequirements({
                          ...requirements,
                          preferences: { ...requirements.preferences, no_copay: e.target.checked }
                        })}
                        className="rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>Zero Co-Payment required</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={requirements.preferences?.restoration}
                        onChange={(e) => setRequirements({
                          ...requirements,
                          preferences: { ...requirements.preferences, restoration: e.target.checked }
                        })}
                        className="rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>Automatic Sum Insured Restoration</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Comparison Cards */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <span>Available Standardized Policies ({initialSamplePolicies.length})</span>
                </h3>
                <span className="text-xs text-slate-500">Sorted by Factual Parameters</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialSamplePolicies.map((policy) => {
                  const isBudgetFit = policy.premium <= (requirements.budget_max || 0);
                  const isCoverageFit = policy.sum_insured >= (requirements.sum_insured_target || 0);

                  return (
                    <div key={policy.id} className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                      <div>
                        {/* Insurer & Plan Name */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{policy.provider}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white">{policy.plan_name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-extrabold text-white">
                              ₹{policy.premium.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[10px] text-slate-400">per annum (incl. GST)</span>
                          </div>
                        </div>

                        {/* Normalized Key Specs */}
                        <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs mb-4">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Sum Insured</span>
                            <span className="font-semibold text-white">₹{(policy.sum_insured / 100000).toFixed(0)} Lakhs</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Waiting Period</span>
                            <span className="font-semibold text-white">{policy.waiting_period_months.pre_existing} Months</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Room Rent Limit</span>
                            <span className="font-semibold text-white capitalize">{policy.room_rent.type.replace(/_/g, ' ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Co-Payment</span>
                            <span className="font-semibold text-white">{policy.copayment_percentage}%</span>
                          </div>
                        </div>

                        {/* Fit Assessment Points */}
                        <div className="space-y-1.5 mb-5 text-xs">
                          <div className="flex items-center gap-2">
                            {isBudgetFit ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <span className={isBudgetFit ? 'text-slate-300' : 'text-amber-300'}>
                              {isBudgetFit ? 'Fits within target budget' : 'Exceeds target budget'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCoverageFit ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <span className={isCoverageFit ? 'text-slate-300' : 'text-amber-300'}>
                              {isCoverageFit ? 'Satisfies requested coverage' : 'Below requested coverage target'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Source Document Provenance Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="truncate max-w-[140px]" title={policy.source_metadata.document_name}>
                            {policy.source_metadata.document_name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-mono text-[10px]">
                          {(policy.source_metadata.confidence_score * 100).toFixed(0)}% Conf
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POLICY "WHAT CHANGED?" DIFF ENGINE (PHASE 3) */}
        {activeTab === 'diff' && (
          <div className="space-y-6">
            {/* Diff Header Bar */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-1 text-xs font-bold uppercase tracking-wider">
                  <GitCompare className="w-4 h-4" />
                  <span>Semantic Policy Version Comparator</span>
                </div>
                <h2 className="text-xl font-bold text-white">Compare Policy Wordings (2024 vs 2026 Edition)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated clause-level diff detecting changes in room rent limits, waiting periods, exclusions, and co-pay terms.
                </p>
              </div>

              {/* Version Set Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Select Plan:</span>
                <select
                  value={selectedVersionSetId}
                  onChange={(e) => setSelectedVersionSetId(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {sampleVersionSets.map(set => (
                    <option key={set.id} value={set.id}>
                      {set.provider} — {set.plan_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Executive Summary & Claims Impact Score */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Change Summary</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {currentDiff.summary.overall_sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-4">
                    {currentDiff.summary.executive_summary}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                    <span className="text-2xl font-black text-emerald-400 block">+{currentDiff.summary.favorable_count}</span>
                    <span className="text-[11px] font-medium text-emerald-300">Favorable Enhancements</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40">
                    <span className="text-2xl font-black text-rose-400 block">-{currentDiff.summary.restrictive_count}</span>
                    <span className="text-[11px] font-medium text-rose-300">Restrictive Changes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                    <span className="text-2xl font-black text-slate-300 block">{currentDiff.summary.neutral_count}</span>
                    <span className="text-[11px] font-medium text-slate-400">Neutral Clarifications</span>
                  </div>
                </div>
              </div>

              {/* Claims Favorability Meter */}
              <div className="md:col-span-4 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between items-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claims Settlement Favorability</span>
                
                <div className="relative flex items-center justify-center my-2">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center bg-gradient-to-tr from-indigo-950/80 to-slate-900">
                    <div className="text-center">
                      <span className="text-2xl font-black text-cyan-300">{currentDiff.summary.claims_impact_score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 block">/ 100</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  High score indicates changes expand claim approvals and reduce out-of-pocket hospital deductions.
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setDiffFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    diffFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow'
                      : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  All Differences ({currentDiff.clause_diffs.length})
                </button>
                <button
                  onClick={() => setDiffFilter('FAVORABLE')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    diffFilter === 'FAVORABLE'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 border border-white/10 text-emerald-400 hover:bg-emerald-950/40'
                  }`}
                >
                  Favorable Only ({currentDiff.summary.favorable_count})
                </button>
                <button
                  onClick={() => setDiffFilter('RESTRICTIVE')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    diffFilter === 'RESTRICTIVE'
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-slate-900 border border-white/10 text-rose-400 hover:bg-rose-950/40'
                  }`}
                >
                  Restrictive Only ({currentDiff.summary.restrictive_count})
                </button>
              </div>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> Evidence-checked against PDF source pages
              </span>
            </div>

            {/* Granular Clause Diff Cards */}
            <div className="space-y-4">
              {filteredClauseDiffs.map((diff, idx) => (
                <div 
                  key={idx} 
                  className={`glass-panel rounded-2xl p-5 border transition-all ${
                    diff.impact === 'FAVORABLE' 
                      ? 'border-emerald-500/30 hover:border-emerald-500/50' 
                      : diff.impact === 'RESTRICTIVE'
                      ? 'border-rose-500/30 hover:border-rose-500/50'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        diff.impact === 'FAVORABLE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : diff.impact === 'RESTRICTIVE'
                          ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {diff.impact}
                      </span>
                      <h4 className="font-bold text-sm text-white">{diff.field_name}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Source Pages:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 font-mono text-[10px]">
                        p.{diff.old_page || 1} ➔ p.{diff.new_page || 1}
                      </span>
                    </div>
                  </div>

                  {/* Side-by-side Clause Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                        Previous 2024 Wording
                      </span>
                      <p className="text-xs text-rose-300/90 font-mono line-through">
                        {diff.old_value}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block mb-1">
                        Updated 2026 Wording
                      </span>
                      <p className="text-xs text-emerald-300 font-semibold font-mono">
                        {diff.new_value}
                      </p>
                    </div>
                  </div>

                  {/* Claim Impact Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <strong className="text-indigo-300">Claim Impact: </strong>{diff.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: B2B ENTERPRISE API PORTAL (PHASE 3) */}
        {activeTab === 'b2b' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 mb-1 text-xs font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4" />
                    <span>B2B Document Intelligence Gateway</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Enterprise Batch Policy Extraction API</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automate PDF extraction for aggregators, brokers, and underwriters with high-throughput structured JSON and webhooks.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 font-mono">API Key:</span>
                  <span className="text-xs text-amber-300 font-mono">{b2bApiKey}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(b2bApiKey);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Batch Request Playground */}
              <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Batch Playground</span>
                </h3>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Partner Client ID</label>
                  <input 
                    type="text"
                    value={b2bClientId}
                    onChange={(e) => setB2bClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Document PDF URLs (One per line)
                  </label>
                  <textarea 
                    rows={4}
                    value={b2bDocsInput}
                    onChange={(e) => setB2bDocsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleRunBatchExtraction}
                  disabled={isProcessingBatch || !b2bDocsInput.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessingBatch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting & Parsing Batch via AI Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Dispatch Batch Extraction Job</span>
                    </>
                  )}
                </button>

                {/* Batch Job Result Viewer */}
                {batchJobResult && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Job {batchJobResult.job_id} Completed
                      </span>
                      <span className="text-slate-400 font-mono">{batchJobResult.processing_time_total_ms}ms</span>
                    </div>

                    <div className="space-y-2">
                      {batchJobResult.results.map((res: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-white block">{res.document_name}</span>
                            <span className="text-[11px] text-slate-400">{res.extracted_plan} • ₹{(res.sum_insured/100000).toFixed(0)}L</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] block">
                              {(res.confidence_score * 100).toFixed(0)}% Conf
                            </span>
                            <span className="text-[10px] text-slate-500">{res.processing_time_ms}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Developer SDK Code Integration */}
              <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Developer Integration SDK</span>
                  </h3>
                  
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setCodeLanguage('curl')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                        codeLanguage === 'curl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setCodeLanguage('python')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                        codeLanguage === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Python
                    </button>
                    <button
                      onClick={() => setCodeLanguage('node')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                        codeLanguage === 'node' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Node.js
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {getCodeSnippet()}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 space-y-1">
                  <strong className="text-indigo-300 block">Webhook Verification:</strong>
                  <span>PolicyLens AI sends cryptographically signed HMAC SHA-256 signatures in the <code>X-PolicyLens-Signature</code> header upon job completion.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POLICY GROUNDED AI CHAT */}
        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[560px]">
            <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Policy Intelligence Assistant</span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Grounded to Policy PDFs
              </span>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    
                    {msg.citation && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 bg-black/20 rounded-lg p-2 text-[11px]">
                        <div className="flex items-center justify-between font-semibold text-indigo-300 mb-1">
                          <span>{msg.citation.section}</span>
                          <span className="font-mono bg-indigo-950 px-1.5 py-0.5 rounded text-[10px]">Page {msg.citation.page}</span>
                        </div>
                        <p className="italic text-slate-400 font-serif">"{msg.citation.quote}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/10 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    Searching policy wording document...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleAskAI} className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
              <input 
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask about waiting periods, room rent, or specific exclusions..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatQuestion.trim() || isAsking}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
