import React from 'react';
import { 
  ShieldCheck, 
  SlidersHorizontal, 
  GitCompare, 
  Code2, 
  Sparkles, 
  FileText,
  Home,
  Layers,
  ArrowRight,
  Lock
} from 'lucide-react';

export type NavTab = 'landing' | 'profile' | 'compare' | 'chat' | 'diff' | 'b2b';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCompareCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCompareCount = 0
}) => {
  return (
    <header className="border-b border-white/10 bg-[#0c1220]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Transparency Badge */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:border-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                PolicyLens AI
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 bg-emerald-950/70 border border-emerald-800/50 rounded-full">
                ZERO SPONSORED BIAS • IRDAI GROUNDED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Explainable Insurance Intelligence with Contract Provenance
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'landing'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>10-Q Profile</span>
            <span className="hidden lg:inline px-1 py-0.2 rounded bg-indigo-500/30 text-indigo-200 text-[9px] font-bold">WIZARD</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compare Plans</span>
            {selectedCompareCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                {selectedCompareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Q&A</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1 hidden md:block" />

          <button
            onClick={() => setActiveTab('diff')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'diff'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Diff Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('b2b')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'b2b'
                ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>B2B API</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
