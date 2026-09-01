"use client";

import React, { useState } from "react";
import { Scheme } from "../data/schemes";
import { ArrowLeft, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Scale, AlertCircle, Info } from "lucide-react";
import { IntakeData } from "./IntakeForm";

interface RecommendationsProps {
  schemes: Scheme[];
  intakeData: IntakeData;
  onSelectScheme: (id: string) => void;
  onNavigateBack: () => void;
  onCompareSchemes: (selectedIds: string[]) => void;
  isBackendLive?: boolean;
  apiError?: string | null;
  onRetry?: () => void;
}

export default function Recommendations({
  schemes,
  intakeData,
  onSelectScheme,
  onNavigateBack,
  onCompareSchemes,
  isBackendLive,
  apiError,
  onRetry,
}: RecommendationsProps) {
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleWhy = (id: string) => {
    setExpandedWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate dynamic, realistic AI rationale based on intake data
  const generateAIRationale = (scheme: Scheme) => {
    const isMarginal = intakeData.landAcres <= 2.5;
    const isSmall = intakeData.landAcres <= 5.0 && intakeData.landAcres > 2.5;
    
    if (scheme.id === "kisan-credit-card") {
      let notes = `Matched because you grow ${intakeData.crop} in ${intakeData.state}. `;
      if (intakeData.amount <= 160000) {
        notes += `Under RBI guidelines, your request of ₹${intakeData.amount.toLocaleString()} is below the ₹1.6 Lakh limit, meaning ZERO collateral is required. `;
      } else {
        notes += `Your request exceeds ₹1.6 Lakh, so a standard land hypothecation will apply. `;
      }
      if (isMarginal || isSmall) {
        notes += `As a smallholder farmer, you are fully eligible for the 3% interest subvention, reducing your interest rate from 7% to a net 4% on prompt repayment.`;
      } else {
        notes += `You qualify for the base 2% interest subvention from the central government.`;
      }
      return notes;
    }

    if (scheme.id === "pm-kusum-solar-pump") {
      let notes = `Excellent match for your irrigation needs. `;
      if (intakeData.irrigation === "No Access / Solar needed" || intakeData.purpose === "Solar Pump Installation") {
        notes += `Since you indicated you need solar/irrigation pumping, this provides a massive 60% direct cost subsidy. `;
      } else {
        notes += `Ideal for reducing your diesel pump costs by moving to solar power. `;
      }
      notes += `You will only need to pay 10% of the cost upfront (approx ₹${(intakeData.amount * 0.1).toLocaleString()}), with the bank financing 30% and the government covering the remaining 60%.`;
      return notes;
    }

    if (scheme.id === "nabard-acabc-scheme") {
      let notes = `Matched for Agri-Startup activities. `;
      if (intakeData.crop === "Agri-clinic Setup" || intakeData.purpose === "Agri-Business Startup") {
        notes += `Since you are setting up an agribusiness venture, this scheme provides a 36% capital subsidy (44% if woman, SC/ST, or from hill states). `;
      }
      notes += `Includes a free 45-day entrepreneurship training course backed by MANAGE. Repayment tenure is extended up to 10 years with a 2-year grace period.`;
      return notes;
    }

    if (scheme.id === "agri-gold-loan") {
      return `Recommended for speed. Since you requested ₹${intakeData.amount.toLocaleString()} and need quick credit for ${intakeData.crop}, pledging gold jewelry delivers cash in under 2 hours without waiting for land possession verifications or crop cycle inspections.`;
    }

    if (scheme.id === "tractor-mechanization-loan") {
      let notes = `Machinery finance match. `;
      if (intakeData.landAcres < 2.0) {
        notes += `Warning: Banks typically look for a minimum of 2-3 acres of land holding to justify tractor utility, so approval may require supplementary income proofs. `;
      } else {
        notes += `Since you own ${intakeData.landAcres} acres, you meet the land requirement. `;
      }
      notes += `Funding covers up to 90% of the tractor price, with seasonal repayment terms matching your harvesting calendar.`;
      return notes;
    }

    return `Matched based on your farming profile in ${intakeData.state} for ${intakeData.crop} cultivation.`;
  };

  // Sort schemes: prioritize backend confidence if present, otherwise sort by purpose match and rate
  const hasBackendScores = schemes.some((s) => s.confidence !== undefined);
  const sortedSchemes = hasBackendScores
    ? [...schemes].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    : [...schemes].sort((a, b) => {
        const aMatchesPurpose = a.whyThisSchemeRules?.preferredPurpose?.includes(intakeData.purpose);
        const bMatchesPurpose = b.whyThisSchemeRules?.preferredPurpose?.includes(intakeData.purpose);
        if (aMatchesPurpose && !bMatchesPurpose) return -1;
        if (!aMatchesPurpose && bMatchesPurpose) return 1;
        return a.effectiveInterestRate - b.effectiveInterestRate;
      });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* Top Navigation Row */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Change Inputs</span>
        </button>

        <div className="flex items-center gap-2">
          {isBackendLive && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 rounded-full px-3.5 py-1 flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              FastAPI Engine Live
            </span>
          )}
          <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-3.5 py-1">
            {sortedSchemes.length} Schemes Matched
          </span>
        </div>
      </div>

      {/* API Error / Offline Fallback Notice */}
      {apiError && (
        <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold">
              Note: Backend service was unreachable ({apiError}). Displaying verified offline advisory schemes.
            </span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs font-bold text-amber-800 underline hover:text-amber-950 shrink-0 self-end sm:self-auto cursor-pointer"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Input Summary Banner */}
      <div className="rounded-3xl border border-slate-200 bg-emerald-800 text-white p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Active Profile</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            {intakeData.crop} in {intakeData.state}
          </h2>
          <p className="text-sm font-medium text-emerald-100/90 mt-1.5">
            Land: {intakeData.landAcres} Acres • Purpose: {intakeData.purpose} • Budget: ₹{intakeData.amount.toLocaleString()}
          </p>
        </div>
        <div className="flex h-fit items-center gap-2 bg-emerald-900/60 border border-emerald-700 rounded-2xl p-3 shrink-0">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div className="text-left">
            <p className="text-xs font-bold text-white">{isBackendLive ? "AI Match Active" : "Advisory Active"}</p>
            <p className="text-[10px] text-emerald-300 font-medium">Interest calculations verified</p>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid (FinanceMacha inspired) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSchemes.map((scheme) => {
          const isExpanded = !!expandedWhy[scheme.id];
          const isSelected = selectedForCompare.includes(scheme.id);
          const aiAdvice = generateAIRationale(scheme);
          const showWarning = scheme.id === "tractor-mechanization-loan" && intakeData.landAcres < 2.0;

          return (
            <div
              key={scheme.id}
              className={`rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${
                isSelected ? "border-emerald-600 ring-2 ring-emerald-50" : "border-slate-200/80"
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {scheme.category}
                    </span>
                    {scheme.confidence !== undefined && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {Math.round(scheme.confidence * 100)}% Match
                      </span>
                    )}
                  </div>
                  
                  {scheme.subsidyPercentage ? (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 animate-pulse">
                      {scheme.subsidyPercentage}% Subsidy
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                      {scheme.effectiveInterestRate}% p.a.
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{scheme.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{scheme.provider}</p>

                {/* Main Metrics Matrix */}
                <div className="my-5 py-4 border-y border-slate-100 space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Interest Rate</span>
                    <div className="text-right">
                      {scheme.effectiveInterestRate !== scheme.baseInterestRate ? (
                        <p className="text-xs text-slate-400 line-through font-semibold leading-none mb-0.5">
                          {scheme.baseInterestRate}% base
                        </p>
                      ) : null}
                      <p className="font-extrabold text-slate-900 leading-none">
                        {scheme.effectiveInterestRate}% p.a.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Max Limit</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{scheme.maxAmount >= 100000 ? `${scheme.maxAmount / 100000} Lakh` : scheme.maxAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Collateral</span>
                    <span className={`font-bold ${scheme.collateralRequired ? "text-slate-700" : "text-emerald-700"}`}>
                      {scheme.collateralRequired ? "Required" : "Not Required"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {scheme.description}
                </p>

                {/* AI Advice Button (Toggles expander) */}
                <button
                  type="button"
                  onClick={() => toggleWhy(scheme.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all mb-4 ${
                    isExpanded 
                      ? "bg-emerald-50 text-emerald-800" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Why This Scheme?</span>
                  </span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {/* Expanded AI Advice */}
                {isExpanded && (
                  <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/20 p-3.5 text-xs text-emerald-950 font-medium mb-4 leading-relaxed animate-in slide-in-from-top-1 duration-200 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase mb-1 flex items-center gap-1">
                        <span>Kisan Mitra AI Analysis</span>
                      </p>
                      <p>{aiAdvice}</p>
                    </div>

                    {scheme.reasons && scheme.reasons.length > 0 && (
                      <div className="pt-2 border-t border-emerald-200/50">
                        <p className="text-[10px] font-bold tracking-wider text-emerald-900 uppercase mb-1">
                          Verified Eligibility Criteria:
                        </p>
                        <ul className="space-y-0.5 text-[11px] text-emerald-900/80">
                          {scheme.reasons.map((r, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-emerald-600 font-bold">✓</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {showWarning && (
                      <div className="mt-2 text-amber-800 bg-amber-50 border border-amber-100/50 rounded-lg p-2 flex gap-1.5 font-semibold text-[10px]">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>Low land holdings may lead to credit checks or require supplementary co-guarantees.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Bottom: Selection and Navigate Details */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                
                {/* Comparison Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCompareToggle(scheme.id)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 accent-emerald-800 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-500">Compare</span>
                </label>

                {/* View Details CTA */}
                <button
                  onClick={() => onSelectScheme(scheme.id)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 hover:text-emerald-700 transition-colors group/view"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/view:translate-x-0.5" />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Comparison Drawer / Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <div className="rounded-full bg-slate-900 border border-slate-800 px-6 py-4 shadow-xl flex items-center justify-between text-white animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold">{selectedForCompare.length} selected for comparison</p>
                <p className="text-[10px] text-slate-400 font-medium">Compare rates, limits, and rules</p>
              </div>
            </div>
            
            <button
              onClick={() => onCompareSchemes(selectedForCompare)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all active:scale-95 shrink-0"
            >
              Compare Now
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
