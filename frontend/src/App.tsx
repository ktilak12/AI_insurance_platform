import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ConversationalForm } from './components/ConversationalForm';
import { ComparisonView } from './components/ComparisonView';
import { AIChatAssistant } from './components/AIChatAssistant';
import { PolicyDiffView } from './components/PolicyDiffView';
import { B2BPortalView } from './components/B2BPortalView';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { SideBySideModal } from './components/SideBySideModal';
import { initialSamplePolicies, sampleVersionSets } from './data/samplePolicies';
import { InsurancePolicy, UserRequirementProfile, GroundedCitation } from './types/policy';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [policies, setPolicies] = useState<InsurancePolicy[]>(initialSamplePolicies);
  
  // User Requirements Questionnaire State
  const [requirements, setRequirements] = useState<UserRequirementProfile>({
    persona: 'individual',
    age: 32,
    city: 'Bengaluru',
    city_tier: 'tier_1',
    budget_max: 20000,
    sum_insured_target: 1000000,
    max_acceptable_waiting_months: 24,
    pre_existing_conditions: ['none'],
    room_rent_preference: 'no_capping',
    copay_tolerance: 0,
    preferences: {
      no_copay: true,
      restoration: true,
      maternity: false,
      ncb_booster: true,
      opd_cover: false,
      global_cover: false
    }
  });

  // Target Policy for AI Chat Context
  const [chatTargetPolicy, setChatTargetPolicy] = useState<InsurancePolicy | null>(policies[0]);

  // Document Provenance Inspector Modal State
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false);
  const [inspectingPolicy, setInspectingPolicy] = useState<InsurancePolicy | null>(null);
  const [inspectingCitation, setInspectingCitation] = useState<GroundedCitation | null>(null);
  const [inspectingCategory, setInspectingCategory] = useState<string>('room_rent');

  // Side-by-Side Comparison Matrix Modal State
  const [isSideBySideModalOpen, setIsSideBySideModalOpen] = useState(false);
  const [sideBySidePolicies, setSideBySidePolicies] = useState<InsurancePolicy[]>([]);

  // Navigation handlers
  const handleStartProfiling = () => {
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileSubmit = (updatedProfile: UserRequirementProfile) => {
    setRequirements(updatedProfile);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePlans = () => {
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatWithPolicy = (policy?: InsurancePolicy) => {
    if (policy) {
      setChatTargetPolicy(policy);
    }
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProvenance = (policy: InsurancePolicy, category: string) => {
    setInspectingPolicy(policy);
    setInspectingCitation(null);
    setInspectingCategory(category);
    setIsProvenanceModalOpen(true);
  };

  const handleOpenCitationProvenance = (policy: InsurancePolicy | undefined, citation: GroundedCitation) => {
    setInspectingPolicy(policy || null);
    setInspectingCitation(citation);
    setInspectingCategory('citation');
    setIsProvenanceModalOpen(true);
  };

  const handleOpenSideBySide = (selected: InsurancePolicy[]) => {
    setSideBySidePolicies(selected);
    setIsSideBySideModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-16 bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedCompareCount={0}
      />

      {/* 2. Main Module Views */}
      <main className="transition-all duration-300">
        {/* Phase 5.1: Landing & Category Pages */}
        {activeTab === 'landing' && (
          <LandingPage
            onStartProfiling={handleStartProfiling}
            onExplorePlans={handleExplorePlans}
            onOpenChat={handleOpenChatWithPolicy}
            onOpenProvenance={handleOpenProvenance}
            policies={policies}
          />
        )}

        {/* Phase 5.2: 10-Question Conversational Requirement Profiling */}
        {activeTab === 'profile' && (
          <ConversationalForm
            initialProfile={requirements}
            onSubmitProfile={handleProfileSubmit}
            onCancel={() => setActiveTab('landing')}
          />
        )}

        {/* Phase 5.3: Explainable Recommendation & Comparison UI */}
        {activeTab === 'compare' && (
          <ComparisonView
            policies={policies}
            requirements={requirements}
            onModifyRequirements={() => setActiveTab('profile')}
            onOpenProvenance={handleOpenProvenance}
            onOpenChatWithPolicy={handleOpenChatWithPolicy}
            onOpenSideBySide={handleOpenSideBySide}
          />
        )}

        {/* Phase 5.4: Grounded Policy AI Assistant Chat UI */}
        {activeTab === 'chat' && (
          <AIChatAssistant
            policies={policies}
            initialPolicy={chatTargetPolicy}
            onOpenProvenanceModal={handleOpenCitationProvenance}
          />
        )}

        {/* Phase 3: Semantic Policy Version Diff Engine */}
        {activeTab === 'diff' && (
          <PolicyDiffView
            versionSets={sampleVersionSets}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {/* Phase 3: B2B Enterprise API Portal */}
        {activeTab === 'b2b' && (
          <B2BPortalView />
        )}
      </main>

      {/* 3. Global Ground-Truth Document Provenance Modal */}
      <DocumentViewerModal
        isOpen={isProvenanceModalOpen}
        onClose={() => setIsProvenanceModalOpen(false)}
        policy={inspectingPolicy}
        citation={inspectingCitation}
        highlightCategory={inspectingCategory}
      />

      {/* 4. Global Side-by-Side Policy Matrix Modal */}
      <SideBySideModal
        isOpen={isSideBySideModalOpen}
        onClose={() => setIsSideBySideModalOpen(false)}
        policies={sideBySidePolicies}
        requirements={requirements}
        onSelectPolicyForChat={handleOpenChatWithPolicy}
        onOpenProvenance={handleOpenProvenance}
      />

      {/* 5. Footer */}
      <footer className="mt-20 border-t border-white/10 pt-8 pb-12 text-center text-xs text-slate-500 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <span className="font-semibold text-slate-400">
            PolicyLens AI — AI Insurance Intelligence Platform
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>IRDAI Web Aggregator Norms Compliant</span>
            <span>•</span>
            <span>Zero Affiliate Ranking</span>
            <span>•</span>
            <span>SHA-256 Verified Provenance</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Disclaimer: PolicyLens AI provides factual extraction and mathematical clause matching against publicly filed insurance policy wordings. Always refer to official insurer policy documents and consult licensed insurance advisors for individualized legal or financial advice.
        </p>
      </footer>
    </div>
  );
}
