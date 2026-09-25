import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  SlidersHorizontal, 
  FileCheck, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Lock, 
  Filter, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { InsurancePolicy, UserRequirementProfile, FitAnalysisResult } from '../types/policy';
import { MatchingEngine } from '../utils/matchingEngine';

interface ComparisonViewProps {
  policies: InsurancePolicy[];
  requirements: UserRequirementProfile;
  onModifyRequirements: () => void;
  onOpenProvenance: (policy: InsurancePolicy, category: string) => void;
  onOpenChatWithPolicy: (policy: InsurancePolicy) => void;
  onOpenSideBySide: (selectedPolicies: InsurancePolicy[]) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  policies,
  requirements,
  onModifyRequirements,
  onOpenProvenance,
  onOpenChatWithPolicy,
  onOpenSideBySide
}) => {
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'fit' | 'premium_asc' | 'premium_desc' | 'sum_insured_desc' | 'waiting_asc'>('fit');
  const [filterNoCappingOnly, setFilterNoCappingOnly] = useState(false);
  const [filterZeroCopayOnly, setFilterZeroCopayOnly] = useState(false);
  const [filterRestorationOnly, setFilterRestorationOnly] = useState(false);
  const [filterMaxWaiting24m, setFilterMaxWaiting24m] = useState(false);
  const [expandedBreakdownPlanId, setExpandedBreakdownPlanId] = useState<string | null>(null);

  // Compute fit for each policy
  const scoredPolicies = policies.map(policy => ({
    policy,
    fit: MatchingEngine.calculateFit(policy, requirements)
  }));

  // Filter policies
  const filtered = scoredPolicies.filter(({ policy }) => {
    if (filterNoCappingOnly && !['no_capping', 'single_private_room'].includes(policy.room_rent.type)) {
      return false;
    }
    if (filterZeroCopayOnly && policy.copayment_percentage > 0) {
      return false;
    }
    if (filterRestorationOnly && !policy.restoration_benefit) {
      return false;
    }
    if (filterMaxWaiting24m && policy.waiting_period_months.pre_existing > 24) {
      return false;
    }
    return true;
  });

  // Sort policies
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'fit') {
      return b.fit.overall_fit_percentage - a.fit.overall_fit_percentage;
    }
    if (sortBy === 'premium_asc') {
      return a.policy.premium - b.policy.premium;
    }
    if (sortBy === 'premium_desc') {
      return b.policy.premium - a.policy.premium;
    }
    if (sortBy === 'sum_insured_desc') {
      return b.policy.sum_insured - a.policy.sum_insured;
    }
    if (sortBy === 'waiting_asc') {
      return a.policy.waiting_period_months.pre_existing - b.policy.waiting_period_months.pre_existing;
    }
    return 0;
  });

  const handleToggleSelectPlan = (id: string) => {
    if (selectedPlanIds.includes(id)) {
      setSelectedPlanIds(selectedPlanIds.filter(pId => pId !== id));
    } else {
      if (selectedPlanIds.length >= 4) {
        alert('You can select up to 4 policies for simultaneous side-by-side comparison.');
        return;
      }
      setSelectedPlanIds([...selectedPlanIds, id]);
    }
  };

  const handleTriggerSideBySide = () => {
    const chosen = policies.filter(p => selectedPlanIds.includes(p.id));
    onOpenSideBySide(chosen);
  };

  const selectedPolicies = policies.filter(p => selectedPlanIds.includes(p.id));

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header Banner: Unbiased Transparency Affirmation */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Mathematical Match Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Unbiased Policy Fit Analysis ({sorted.length} Available Plans)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Ranked strictly by contract compatibility with your budget (₹{(requirements.budget_max || 20000).toLocaleString('en-IN')}), coverage target (₹{((requirements.sum_insured_target || 1000000)/100000).toFixed(0)}L), and declared medical history. Zero affiliate commission bias.
          </p>
        </div>

        <button
          onClick={onModifyRequirements}
          className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 rounded-xl flex items-center gap-1.5 transition-all shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Edit 10-Q Profile</span>
        </button>
      </div>

      {/* 2. Controls Bar: Sort, Filter & Side-by-Side Floating Trigger */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          <button
            onClick={() => setFilterNoCappingOnly(!filterNoCappingOnly)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              filterNoCappingOnly
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            No Room Rent Capping
          </button>

          <button
            onClick={() => setFilterZeroCopayOnly(!filterZeroCopayOnly)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              filterZeroCopayOnly
                ? 'bg-indigo-950 text-indigo-300 border-indigo-500 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Zero Co-Pay Only
          </button>

          <button
            onClick={() => setFilterMaxWaiting24m(!filterMaxWaiting24m)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              filterMaxWaiting24m
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            ≤ 24m PED Waiting (IRDAI 2026)
          </button>

          <button
            onClick={() => setFilterRestorationOnly(!filterRestorationOnly)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              filterRestorationOnly
                ? 'bg-purple-950 text-purple-300 border-purple-500 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Auto Restoration Included
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-900 border border-white/15 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="fit">Mathematical Match % (Highest)</option>
            <option value="premium_asc">Annual Premium (Lowest First)</option>
            <option value="premium_desc">Annual Premium (Highest First)</option>
            <option value="sum_insured_desc">Sum Insured (Highest First)</option>
            <option value="waiting_asc">PED Waiting (Shortest First)</option>
          </select>
        </div>
      </div>

      {/* Floating Side-by-Side Comparison Action Bar */}
      {selectedPlanIds.length > 0 && (
        <div className="sticky top-20 z-30 p-4 rounded-2xl bg-indigo-950/95 border-2 border-indigo-500/80 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                {selectedPlanIds.length} Policies Selected for Side-by-Side Matrix
              </span>
              <span className="text-xs text-indigo-200">
                {selectedPolicies.map(p => p.plan_name).join(' vs ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedPlanIds([])}
              className="px-3 py-2 text-xs font-semibold text-indigo-300 hover:text-white"
            >
              Clear Selection
            </button>
            <button
              onClick={handleTriggerSideBySide}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <span>Launch Comparison Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Policy Recommendation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sorted.map(({ policy, fit }) => {
          const isSelected = selectedPlanIds.includes(policy.id);
          const isExpanded = expandedBreakdownPlanId === policy.id;
          const isRoomRentSafe = ['no_capping', 'single_private_room'].includes(policy.room_rent.type);

          return (
            <div
              key={policy.id}
              className={`glass-panel glass-panel-hover rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-500'
                  : 'border-white/10'
              }`}
            >
              <div>
                {/* Card Top: Provider, Plan Name, Match Score & Select Checkbox */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{policy.provider}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400 font-mono">{policy.version || '2026 Edition'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{policy.plan_name}</h3>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex flex-col items-end">
                    <div className={`px-3 py-1 rounded-xl font-mono font-extrabold text-sm border flex items-center gap-1.5 ${
                      fit.overall_fit_percentage >= 85
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                        : fit.overall_fit_percentage >= 70
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50'
                        : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{fit.overall_fit_percentage}% Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">Deterministic Fit</span>
                  </div>
                </div>

                {/* Premium & Core Financials Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-white/5 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Base Premium</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">
                        ₹{policy.premium.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">/ yr (incl. GST)</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sum Insured</span>
                    <span className="text-base font-extrabold text-cyan-300">
                      ₹{(policy.sum_insured / 100000).toFixed(0)} Lakhs
                    </span>
                  </div>
                </div>

                {/* Key Policy Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-white/5 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Room Rent Category</span>
                    <span className={`font-semibold capitalize flex items-center gap-1 ${
                      isRoomRentSafe ? 'text-emerald-300' : 'text-amber-300'
                    }`}>
                      {isRoomRentSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{policy.room_rent.type.replace(/_/g, ' ')}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Pre-Existing Waiting</span>
                    <span className="font-semibold text-white">
                      {policy.waiting_period_months.pre_existing} Months ({policy.waiting_period_months.pre_existing / 12} Yrs)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Mandatory Co-Pay</span>
                    <span className="font-semibold text-white">
                      {policy.copayment_percentage === 0 ? '0% (Zero Co-Pay)' : `${policy.copayment_percentage}%`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Auto Restoration</span>
                    <span className="font-semibold text-cyan-300">
                      {policy.restoration_benefit ? '100% Reload Included' : 'No Restoration'}
                    </span>
                  </div>
                </div>

                {/* Room Rent Safety Callout Warning */}
                {!isRoomRentSafe && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-200 mb-4 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Proportionate Deduction Risk:</strong> Room rent is capped. Upgrading room category will reduce claim payout across all hospital invoice lines.
                    </span>
                  </div>
                )}

                {/* "Why This Matched Your Profile" Accordion */}
                <div className="mb-4">
                  <button
                    onClick={() => setExpandedBreakdownPlanId(isExpanded ? null : policy.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-white/5 text-xs text-indigo-300 font-semibold transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Why this plan scored {fit.overall_fit_percentage}% for you</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-white/10 text-xs space-y-2 animate-in fade-in duration-150">
                      <div className="space-y-1.5">
                        {fit.positive_matches.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>

                      {fit.caveats_and_warnings.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Caveats to Note:
                          </span>
                          {fit.caveats_and_warnings.map((warn, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-relaxed">{warn}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Action Buttons & Provenance Proof */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {/* Provenance Document Verification Pill */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate max-w-[170px]" title={policy.source_metadata.document_name}>
                      {policy.source_metadata.document_name}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenProvenance(policy, 'room_rent')}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-semibold"
                  >
                    <span>Verify PDF</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Actions: Compare Checkbox, Ask AI, and Inspect */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleSelectPlan(policy.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Selected' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => onOpenChatWithPolicy(policy)}
                    className="py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ask Policy AI</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
