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
  Lock
} from 'lucide-react';
import { InsurancePolicy, UserRequirementProfile, FitAnalysisResult } from './types/policy';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<'compare' | 'chat' | 'provenance'>('compare');
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
        aiText = "Pre-existing diseases like Diabetes are covered after completing the continuous policy waiting period. No claim is payable during the initial waiting window.";
        citation = {
          page: 18,
          section: "Section 4.1: Pre-existing Conditions Clause",
          quote: "Covered after 36 months of continuous coverage without break."
        };
      } else if (q.includes('room rent') || q.includes('capping')) {
        aiText = "There is no room rent capping limit applied. You are eligible for single private AC room or standard room categories without proportionate deduction penalty.";
        citation = {
          page: 12,
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
                UNBIASED & COMPLIANT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'compare' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Fit Analysis
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'chat' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Policy AI Q&A
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Insurance Intelligence • Zero Marketing Bias</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Compare Insurance by <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Factual Policy Evidence</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We extract and normalize complicated policy wording PDFs into verifiable facts. No sponsored ratings, no artificial bestsellers—only transparent fit analysis.
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

        {activeTab === 'compare' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3. User Requirements Intake Form */}
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

            {/* 4. Policy Comparison Cards */}
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
        ) : (
          /* 5. Policy Grounded AI Assistant Screen */
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
