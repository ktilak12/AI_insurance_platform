import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileCheck, 
  HelpCircle, 
  SlidersHorizontal,
  Flame,
  Zap,
  TrendingUp,
  Heart,
  Car,
  Plane,
  Shield,
  Layers,
  FileText,
  BadgeAlert,
  ChevronRight
} from 'lucide-react';
import { InsurancePolicy } from '../types/policy';

interface LandingPageProps {
  onStartProfiling: () => void;
  onExplorePlans: () => void;
  onOpenChat: (policy?: InsurancePolicy) => void;
  onOpenProvenance: (policy: InsurancePolicy, category: string) => void;
  policies: InsurancePolicy[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartProfiling,
  onExplorePlans,
  onOpenChat,
  onOpenProvenance,
  policies
}) => {
  const [category, setCategory] = useState<'health' | 'motor' | 'travel' | 'super_topup'>('health');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideTab, setSelectedGuideTab] = useState<'room_rent' | 'ped' | 'copay' | 'restore'>('room_rent');

  const filteredPolicies = policies.filter(p => 
    p.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4">
        {/* Glow effect backdrop */}
        <div className="absolute inset-0 -top-12 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-indigo-500/30 text-xs text-indigo-300 mb-6 shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">Unbiased Insurance Intelligence • 100% Policy Document Provenance</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          We Turn 70-Page Policies into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Verifiable Facts & Pure Mathematical Fit
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Zero sponsored rankings. Zero affiliate bias. Discover exactly which health insurance plan matches your family’s medical needs, backed by verified page-by-page policy wording citations.
        </p>

        {/* Primary CTA Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onStartProfiling}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Start 10-Question Fit Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExplorePlans}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Browse All {policies.length} Health Plans</span>
          </button>
        </div>

        {/* Search & Instant Clause Lookup Bar */}
        <div className="max-w-xl mx-auto relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by insurer or plan (e.g. HDFC Optima Secure, Care Supreme, Star)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-30 text-left space-y-2 max-h-60 overflow-y-auto">
              {filteredPolicies.length === 0 ? (
                <p className="text-xs text-slate-400 p-2">No matching policies found.</p>
              ) : (
                filteredPolicies.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setSearchQuery('');
                      onOpenChat(p);
                    }}
                    className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-between border border-transparent hover:border-white/10 transition-all"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{p.plan_name}</span>
                      <span className="text-[11px] text-slate-400">{p.provider} • ₹{p.premium.toLocaleString('en-IN')}/yr</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                      <span>Ask AI</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xl font-extrabold text-white block">0%</span>
            <span className="text-[11px] text-slate-400 font-medium">Affiliate Bias / Ads</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xl font-extrabold text-emerald-400 block">100%</span>
            <span className="text-[11px] text-slate-400 font-medium">Page Citations Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xl font-extrabold text-cyan-400 block">14,000+</span>
            <span className="text-[11px] text-slate-400 font-medium">Standardized Clauses</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xl font-extrabold text-indigo-300 block">IRDAI</span>
            <span className="text-[11px] text-slate-400 font-medium">Master Circular Grounded</span>
          </div>
        </div>
      </section>

      {/* 2. Insurance Categories Section (5.1 Category Pages Entry) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Insurance Category Intelligence</h2>
            <p className="text-xs text-slate-400">Select a domain to inspect standardized extraction models and clause frameworks.</p>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[11px] font-semibold">
            Health (Active MVP)
          </span>
        </div>

        {/* Category Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setCategory('health')}
            className={`p-4 rounded-xl border text-left transition-all ${
              category === 'health'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Heart className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                LIVE
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">Health Insurance</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Room rent limits, PED waiting, restoration & copay analysis.
            </p>
          </button>

          <button
            onClick={() => setCategory('motor')}
            className={`p-4 rounded-xl border text-left transition-all ${
              category === 'motor'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Car className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-semibold">
                ROADMAP V2
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">Motor Insurance</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Zero-depreciation, engine protect, return to invoice & NCB.
            </p>
          </button>

          <button
            onClick={() => setCategory('travel')}
            className={`p-4 rounded-xl border text-left transition-all ${
              category === 'travel'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Plane className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-semibold">
                ROADMAP V3
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">Travel Insurance</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Overseas medical evacuation, flight delay, baggage loss clauses.
            </p>
          </button>

          <button
            onClick={() => setCategory('super_topup')}
            className={`p-4 rounded-xl border text-left transition-all ${
              category === 'super_topup'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-semibold">
                SUPPORTED
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">Super Top-Up</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Aggregate deductible matching for high-value ₹1 Crore shields.
            </p>
          </button>
        </div>

        {/* Health Insurance Deep-Dive Educational Knowledge Guide */}
        {category === 'health' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-1 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>Consumer Defense Knowledge Base</span>
                </div>
                <h3 className="text-xl font-bold text-white">The 4 Critical Health Insurance Traps</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Understand how insurers reject claims and how PolicyLens extracts exact contract wording to protect you.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGuideTab('room_rent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedGuideTab === 'room_rent'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  1. Room Rent Trap
                </button>
                <button
                  onClick={() => setSelectedGuideTab('ped')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedGuideTab === 'ped'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  2. PED Waiting Period
                </button>
                <button
                  onClick={() => setSelectedGuideTab('copay')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedGuideTab === 'copay'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  3. Mandatory Co-Pay
                </button>
                <button
                  onClick={() => setSelectedGuideTab('restore')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedGuideTab === 'restore'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  4. Restoration Benefit
                </button>
              </div>
            </div>

            {/* Guide Content Display */}
            {selectedGuideTab === 'room_rent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-rose-400 flex items-center gap-2">
                    <BadgeAlert className="w-5 h-5" />
                    <span>The Room Rent Proportionate Deduction Penalty</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If your policy caps room rent at 1% of Sum Insured (e.g. ₹5,000/day on ₹5 Lakhs cover) and you stay in a ₹10,000/day Single Private Room, the insurer does not merely deduct the ₹5,000 difference.
                  </p>
                  <p className="text-xs text-amber-300 leading-relaxed font-semibold bg-amber-950/40 p-3 rounded-xl border border-amber-800/40">
                    ⚠️ They deduct 50% proportionately across ALL ASSOCIATED EXPENSES — surgeon fees, OT charges, specialist consultations, and nursing charges!
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> How PolicyLens Protects You
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We automatically verify the exact wording of Section 2 of every policy. We flag any plan with percentage caps and highlight plans with <strong>"Single Private Room"</strong> or <strong>"No Capping"</strong> clauses.
                  </p>
                  <button
                    onClick={onExplorePlans}
                    className="mt-2 text-xs text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1"
                  >
                    <span>View Zero-Capping Health Plans</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {selectedGuideTab === 'ped' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Pre-Existing Disease (PED) Waiting Duration</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under revised 2024-2026 IRDAI Master Circulars, the maximum permissible waiting window for declared conditions like Diabetes, Hypertension, and Thyroid has been reduced from 48 months to 24-36 months.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Non-disclosure is the leading cause of claim rejections. Once declared, claims are 100% admissible after completing this continuous period.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 2026 Benchmark Standard
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Plans like <strong>HDFC Optima Secure</strong> and <strong>Care Supreme</strong> have updated their policy wordings to a <strong>24-month PED clock</strong>, reducing your waiting time by an entire year.
                  </p>
                </div>
              </div>
            )}

            {selectedGuideTab === 'copay' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Mandatory vs Zone Co-Payments</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A 20% co-pay on a ₹15,00,000 hospital bill means ₹3,00,000 must come directly from your savings. Watch out for hidden "Zone Co-pays" where undergoing treatment in Tier-1 Metro cities triggers a 20% penalty.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PolicyLens Strict Filter
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our 10-Question Profile lets you enforce a strict <strong>Zero Co-pay guarantee</strong>, automatically omitting policies with mandatory out-of-pocket clauses.
                  </p>
                </div>
              </div>
            )}

            {selectedGuideTab === 'restore' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span>Automatic Sum Insured Restoration</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If multiple hospitalizations occur in a single year, standard base coverage can get exhausted on the first event. Auto-Restoration reloads 100% of your sum insured for subsequent unrelated or related hospitalizations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Multi-Claim Safety
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Modern plans offer <strong>"Unlimited Auto Recharge"</strong> (Care Supreme) or <strong>"ReAssure Forever"</strong> (Niva Bupa) that triggers instantly from the first claim.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {category !== 'health' && (
          <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Standardized Canonical Extraction Pipeline</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              The canonical schema, semantic parser, and diff engine are pre-configured for {category.toUpperCase()}. Explore our active Health Insurance MVP or test document extraction via the B2B API Portal.
            </p>
            <button
              onClick={() => setCategory('health')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Back to Health Insurance
            </button>
          </div>
        )}
      </section>

      {/* 3. The Unbiased Transparency Manifesto (Why PolicyLens is Different) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0c1220] to-indigo-950/40 border border-indigo-500/20 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold uppercase tracking-wider">
              Our Transparency Pledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2">
              Why Aggregators Push Specific Plans vs How PolicyLens Works
            </h2>
            <p className="text-xs text-slate-400">
              Commercial comparison websites rely on distributor commission tiers and sponsored bidding. PolicyLens is engineered purely on mathematical contract compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-3">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Commercial Aggregators (The Dark Patterns)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span>
                  <span>Plans labeled "Best Seller" or "Most Popular" are often determined by highest distributor commissions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span>
                  <span>Room rent capping and proportionate deduction warnings are buried in unreadable 8pt font footnotes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span>
                  <span>No ability to verify whether a claim rule is true in the official insurer wording document.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PolicyLens AI (The Transparent Standard)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span>Match % is strictly calculated from your 10 profile constraints using deterministic math.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span>Every claim clause is linked directly to the PDF page number and cryptographic file hash.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span>Zero sponsored placements, zero affiliate ranking boosts, and zero data selling.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Standardized Policies Snapshot */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Standardized Health Policies Ready for Analysis</h2>
            <p className="text-xs text-slate-400">Extracted from 2026 master policy contracts with active provenance links.</p>
          </div>
          <button
            onClick={onExplorePlans}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View Comparison Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.slice(0, 3).map((policy) => (
            <div 
              key={policy.id} 
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{policy.provider}</span>
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{policy.plan_name}</h4>
                  </div>
                  <span className="text-base font-extrabold text-cyan-300">
                    ₹{policy.premium.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/yr</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-white/5 text-[11px] mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sum Insured</span>
                    <span className="font-semibold text-white">₹{(policy.sum_insured/100000).toFixed(0)} Lakhs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Room Rent</span>
                    <span className="font-semibold text-emerald-300 capitalize">{policy.room_rent.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PED Waiting</span>
                    <span className="font-semibold text-white">{policy.waiting_period_months.pre_existing} Months</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Co-Payment</span>
                    <span className="font-semibold text-white">{policy.copayment_percentage}% (Zero Co-Pay)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-4">
                  {policy.restoration_type || '100% Automatic Sum Insured Restoration included.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenProvenance(policy, 'room_rent')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-[11px] text-cyan-400 font-semibold flex items-center gap-1 transition-all"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Inspect PDF</span>
                </button>

                <button
                  onClick={() => onOpenChat(policy)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-[11px] text-indigo-200 hover:text-white font-semibold flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center pb-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-indigo-600/40 to-cyan-900/60 border border-indigo-400/30 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Find the Exact Health Plan Built for Your Medical Needs
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Complete the 10-question profiling questionnaire in under 2 minutes. Receive unbiased, mathematically ranked recommendations with zero sales pressure.
          </p>
          <button
            onClick={onStartProfiling}
            className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 mx-auto transition-all transform hover:scale-105"
          >
            <span>Launch 10-Question Profile Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
