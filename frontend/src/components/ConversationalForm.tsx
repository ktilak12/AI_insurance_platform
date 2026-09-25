import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Home, 
  HeartHandshake, 
  Building2, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  HeartPulse, 
  Pill, 
  Wind, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Shield, 
  Clock, 
  Percent, 
  AlertCircle, 
  RefreshCw, 
  TrendingUp, 
  Lock, 
  Baby, 
  Stethoscope, 
  Globe,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  HelpCircle,
  Check,
  Edit3
} from 'lucide-react';
import { UserRequirementProfile } from '../types/policy';
import { profilingQuestions, ProfilingQuestion } from '../data/profilingQuestions';

interface ConversationalFormProps {
  initialProfile: UserRequirementProfile;
  onSubmitProfile: (profile: UserRequirementProfile) => void;
  onCancel?: () => void;
}

export const ConversationalForm: React.FC<ConversationalFormProps> = ({
  initialProfile,
  onSubmitProfile,
  onCancel
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [profile, setProfile] = useState<UserRequirementProfile>(initialProfile);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const currentQ: ProfilingQuestion = profilingQuestions[currentStepIndex];
  const totalQuestions = profilingQuestions.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);

  // Icon mapping helper
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'User': return <User className="w-5 h-5 text-indigo-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'Home': return <Home className="w-5 h-5 text-indigo-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-indigo-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'Building': return <Building className="w-5 h-5 text-cyan-400" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-amber-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Pill': return <Pill className="w-5 h-5 text-purple-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-blue-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-indigo-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-indigo-400" />;
      case 'Percent': return <Percent className="w-5 h-5 text-indigo-400" />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-cyan-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Lock': return <Lock className="w-5 h-5 text-indigo-400" />;
      case 'Baby': return <Baby className="w-5 h-5 text-rose-400" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsReviewMode(true);
    }
  };

  const handlePrev = () => {
    if (isReviewMode) {
      setIsReviewMode(false);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSelectOption = (key: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleMultiSelect = (val: string) => {
    setProfile(prev => {
      const current = prev.pre_existing_conditions || [];
      if (val === 'none') {
        return { ...prev, pre_existing_conditions: ['none'] };
      }
      let updated = current.filter(c => c !== 'none');
      if (updated.includes(val)) {
        updated = updated.filter(c => c !== val);
      } else {
        updated.push(val);
      }
      if (updated.length === 0) updated = ['none'];
      return { ...prev, pre_existing_conditions: updated };
    });
  };

  const handleTogglePreference = (prefKey: string) => {
    setProfile(prev => {
      const currentPrefs = prev.preferences || {};
      return {
        ...prev,
        preferences: {
          ...currentPrefs,
          [prefKey]: !(currentPrefs as any)[prefKey]
        }
      };
    });
  };

  const handleSubmit = () => {
    onSubmitProfile(profile);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header & Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                10-Question Requirement Profiling
              </span>
              <span className="text-slate-400 text-xs ml-2">
                {!isReviewMode ? `Step ${currentStepIndex + 1} of ${totalQuestions}` : 'Final Profile Review'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-300">
              {!isReviewMode ? `${progressPercent}%` : '100%'}
            </span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${!isReviewMode ? progressPercent : 100}%` }}
          />
        </div>

        {/* Step dots for quick navigation */}
        <div className="hidden sm:flex justify-between mt-3 px-1">
          {profilingQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                setIsReviewMode(false);
                setCurrentStepIndex(idx);
              }}
              title={q.title}
              className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                idx === currentStepIndex && !isReviewMode
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#070b14]'
                  : idx < currentStepIndex
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      {!isReviewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question & Input Controls (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 text-[10px] font-bold uppercase tracking-wider mb-2">
                <span>{currentQ.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 leading-snug">
                {currentQ.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Dynamic Inputs based on question type */}
            <div className="pt-2">
              {/* Type 1: Card Select */}
              {currentQ.inputType === 'card-select' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = (profile as any)[currentQ.key] === opt.value;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(currentQ.key, opt.value)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-slate-900 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                            {renderIcon(opt.icon)}
                          </div>
                          {opt.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white mb-1">{opt.label}</h4>
                        {opt.description && (
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 2: Slider */}
              {currentQ.inputType === 'slider' && (
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Selected Value</span>
                    <span className="text-2xl font-extrabold text-cyan-300 font-mono">
                      {currentQ.key === 'age'
                        ? `${profile.age || 32} Years`
                        : currentQ.key === 'sum_insured_target'
                        ? `₹${((profile.sum_insured_target || 1000000) / 100000).toFixed(0)} Lakhs`
                        : `₹${(profile.budget_max || 20000).toLocaleString('en-IN')} / year`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={currentQ.min}
                    max={currentQ.max}
                    step={currentQ.step}
                    value={(profile as any)[currentQ.key] || currentQ.min}
                    onChange={(e) => handleSelectOption(currentQ.key, Number(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Min: {currentQ.key === 'age' ? `${currentQ.min}y` : `₹${(currentQ.min! / 1000).toFixed(0)}k`}</span>
                    <span>Max: {currentQ.key === 'age' ? `${currentQ.max}y` : `₹${(currentQ.max! / 100000).toFixed(0)}L`}</span>
                  </div>
                </div>
              )}

              {/* Type 3: Multi-Select (Pre-existing diseases) */}
              {currentQ.inputType === 'multi-select' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isChecked = (profile.pre_existing_conditions || []).includes(opt.value);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleMultiSelect(opt.value)}
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/20 bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-xs text-white block">{opt.label}</span>
                          {opt.description && (
                            <span className="text-[10px] text-slate-400 block leading-tight">{opt.description}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 4: Toggle Group (Preferences & Riders) */}
              {currentQ.inputType === 'toggle-group' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isChecked = !!(profile.preferences as any)?.[opt.value];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleTogglePreference(opt.value)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                            {renderIcon(opt.icon)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">{opt.label}</span>
                            <span className="text-[11px] text-slate-400 block">{opt.description}</span>
                          </div>
                        </div>

                        <div className={`w-11 h-6 rounded-full p-1 transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Button Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
              >
                <span>{currentStepIndex === totalQuestions - 1 ? 'Review Profile' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Educational "Why This Matters" Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Actuarial Contract Insight</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1">Why We Ask This:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.whyItMatters.actuarialReason}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 space-y-1">
                <strong className="block text-[11px] text-amber-300 font-bold">⚠️ Claim Risk Warning:</strong>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {currentQ.whyItMatters.claimRiskWarning}
                </p>
              </div>

              {currentQ.whyItMatters.regulationContext && (
                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">IRDAI Directive: </span>
                  {currentQ.whyItMatters.regulationContext}
                </div>
              )}
            </div>

            {/* Quick Profile Summary Badge */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Profile Highlights
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Insured Scope:</span>
                  <span className="font-semibold text-white capitalize">{profile.persona || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage Target:</span>
                  <span className="font-semibold text-white">₹{((profile.sum_insured_target || 1000000)/100000).toFixed(0)} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Budget:</span>
                  <span className="font-semibold text-white">₹{(profile.budget_max || 20000).toLocaleString('en-IN')}/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pre-Existing Conditions:</span>
                  <span className="font-semibold text-emerald-400">
                    {(profile.pre_existing_conditions || []).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Final Profile Review Mode */
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/15 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Your 10-Point Insurance Profile is Ready
            </h2>
            <p className="text-xs text-slate-400">
              Review your declared requirements below before generating neutral, mathematically computed recommendations.
            </p>
          </div>

          {/* 10-Point Profile Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                1. Protection Scope & Demographics
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Insured Persona:</span>
                  <span className="font-bold text-white capitalize">{profile.persona || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eldest Member Age:</span>
                  <span className="font-bold text-white">{profile.age || 32} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location Tier:</span>
                  <span className="font-bold text-white capitalize">{profile.city_tier?.replace(/_/g, ' ') || 'Tier 1 Metro'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                2. Financial Limits & Coverage Target
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sum Insured Target:</span>
                  <span className="font-bold text-emerald-300">₹{((profile.sum_insured_target || 1000000)/100000).toFixed(0)} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Annual Budget:</span>
                  <span className="font-bold text-white">₹{(profile.budget_max || 20000).toLocaleString('en-IN')} / year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Co-Payment Tolerance:</span>
                  <span className="font-bold text-white">{profile.copay_tolerance === 0 ? 'Strict 0% (Zero Co-Pay)' : `${profile.copay_tolerance}% Co-Pay`}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                3. Health History & Waiting Windows
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Declared Conditions:</span>
                  <span className="font-bold text-amber-300 capitalize">
                    {(profile.pre_existing_conditions || []).join(', ') || 'None (Healthy)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Waiting Period:</span>
                  <span className="font-bold text-white">{profile.max_acceptable_waiting_months || 24} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Room Rent Standard:</span>
                  <span className="font-bold text-white capitalize">{profile.room_rent_preference?.replace(/_/g, ' ') || 'No Capping'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                4. Selected Essential Riders
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.preferences?.restoration && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                    ✔ Auto Restoration
                  </span>
                )}
                {profile.preferences?.ncb_booster && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-semibold">
                    ✔ NCB Booster
                  </span>
                )}
                {profile.preferences?.no_copay && (
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-semibold">
                    ✔ Zero Co-pay
                  </span>
                )}
                {profile.preferences?.maternity && (
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold">
                    ✔ Maternity
                  </span>
                )}
                {profile.preferences?.opd_cover && (
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-semibold">
                    ✔ OPD Cover
                  </span>
                )}
                {profile.preferences?.global_cover && (
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-semibold">
                    ✔ Global Cover
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsReviewMode(false);
                setCurrentStepIndex(0);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Responses</span>
            </button>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Unbiased Policy Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
