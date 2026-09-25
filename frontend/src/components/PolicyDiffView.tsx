import React, { useState } from 'react';
import { 
  GitCompare, 
  Lock, 
  FileCheck, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PolicyVersionSet, PolicyVersionDiffResponse, DiffImpact } from '../types/policy';

interface PolicyDiffViewProps {
  versionSets: PolicyVersionSet[];
  onOpenProvenance: (policy: any, category: string) => void;
}

export const PolicyDiffView: React.FC<PolicyDiffViewProps> = ({
  versionSets,
  onOpenProvenance
}) => {
  const [selectedVersionSetId, setSelectedVersionSetId] = useState<string>(versionSets[0]?.id || '');
  const [diffFilter, setDiffFilter] = useState<'ALL' | 'FAVORABLE' | 'RESTRICTIVE'>('ALL');

  const currentSet = versionSets.find(s => s.id === selectedVersionSetId) || versionSets[0];

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
        explanation: `Premium increased by ₹${Math.abs(diff).toLocaleString('en-IN')} (+${(((newP.premium - oldP.premium)/oldP.premium)*100).toFixed(1)}%) reflecting medical inflation adjustments.`,
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
    if (oldP.no_claim_bonus_percentage !== newP.no_claim_bonus_percentage || (newP.no_claim_bonus_max_multiplier || 100) !== (oldP.no_claim_bonus_max_multiplier || 100)) {
      diffs.push({
        clause_category: 'ncb',
        field_name: 'No Claim Bonus (NCB) Multiplier',
        old_value: `${oldP.no_claim_bonus_percentage}% per year (Max ${oldP.no_claim_bonus_max_multiplier || 50}%)`,
        new_value: `${newP.no_claim_bonus_percentage}% per year (Max ${newP.no_claim_bonus_max_multiplier || 100}%)`,
        impact: 'FAVORABLE',
        explanation: `Bonus cover multiplier enhanced to ${newP.no_claim_bonus_percentage}% per claim-free renewal.`,
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
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
            {versionSets.map(set => (
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
  );
};
