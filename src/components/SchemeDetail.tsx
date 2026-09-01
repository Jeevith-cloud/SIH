"use client";

import React, { useState, useEffect } from "react";
import { Scheme } from "../data/schemes";
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Calculator, FileText, HelpCircle, Landmark } from "lucide-react";

interface SchemeDetailProps {
  scheme: Scheme;
  initialAmount: number;
  onNavigateBack: () => void;
  onGoToChecklist: () => void;
}

export default function SchemeDetail({
  scheme,
  initialAmount,
  onNavigateBack,
  onGoToChecklist
}: SchemeDetailProps) {
  // Calculator States
  const [amount, setAmount] = useState(initialAmount > scheme.maxAmount ? scheme.maxAmount : initialAmount);
  const [tenureMonths, setTenureMonths] = useState(Math.min(12, scheme.maxTenureMonths));

  // Recalculate amount if initialAmount changes
  useEffect(() => {
    setAmount(initialAmount > scheme.maxAmount ? scheme.maxAmount : initialAmount);
  }, [initialAmount, scheme.maxAmount]);

  // Financial Calculations
  const calculateFinancials = () => {
    const principal = amount;
    const years = tenureMonths / 12;

    // Base interest calculation (Simple interest for agricultural loans)
    const baseInterest = principal * (scheme.baseInterestRate / 100) * years;
    
    // Subvention savings
    let subventionSavings = 0;
    if (scheme.interestSubvention) {
      subventionSavings = principal * (scheme.interestSubvention / 100) * years;
    } else if (scheme.subsidyPercentage) {
      // For asset subsidies like PM-KUSUM, the principal loan is reduced, but we calculate savings on asset cost
      subventionSavings = (principal / (1 - scheme.subsidyPercentage / 100)) * (scheme.subsidyPercentage / 100);
    }

    // Net interest payable
    const netInterestRate = scheme.effectiveInterestRate;
    const netInterest = principal * (netInterestRate / 100) * years;
    const totalRepayable = principal + netInterest;

    // Estimate seasonal payment (usually paid twice a year after harvest - Rabi and Kharif)
    const seasonalRepayment = totalRepayable / (years * 2 || 1);
    const monthlyEMI = totalRepayable / tenureMonths;

    return {
      baseInterest,
      subventionSavings,
      netInterest,
      totalRepayable,
      seasonalRepayment,
      monthlyEMI
    };
  };

  const {
    baseInterest,
    subventionSavings,
    netInterest,
    totalRepayable,
    seasonalRepayment,
    monthlyEMI
  } = calculateFinancials();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Matches</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Detailed Info & Benefits (2/3 columns on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Block */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 uppercase tracking-wider">
                {scheme.category}
              </span>
              
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Landmark className="h-4 w-4 text-slate-400" />
                Ref: NABARD-2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{scheme.name}</h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">{scheme.provider}</p>

            <p className="text-sm text-slate-600 leading-relaxed mt-6 border-l-4 border-emerald-600 pl-4 py-1 italic bg-emerald-50/20 rounded-r-xl">
              {scheme.description}
            </p>

            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-800 mb-3">Scheme Overview</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {scheme.detailedDescription}
              </p>
            </div>
          </div>

          {/* Benefits Block */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 mb-4">Key Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scheme.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2.5 items-start">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Requirements */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 mb-3">Who Can Apply?</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {scheme.eligibilityDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                Tenure: up to {scheme.maxTenureMonths / 12} years
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                Collateral Threshold: {scheme.collateralThreshold ? `Exempt up to ₹${scheme.collateralThreshold / 100000} Lakh` : "Standard rules apply"}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Repayment Calculator */}
        <div className="space-y-6">
          
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-950 mb-5 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-700" />
              <span>Credit Calculator</span>
            </h3>

            {/* Slider 1: Loan Amount */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Borrowing Amount</span>
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max={scheme.maxAmount}
                step="10000"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹10,000</span>
                <span>₹{(scheme.maxAmount / 2).toLocaleString()}</span>
                <span>₹{scheme.maxAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Slider 2: Tenure Months */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Repayment Period</span>
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                  {tenureMonths} Months ({Math.round(tenureMonths / 12 * 10) / 10} yrs)
                </span>
              </div>
              <input
                type="range"
                min="3"
                max={scheme.maxTenureMonths}
                step="3"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>3 Months</span>
                <span>{Math.round(scheme.maxTenureMonths / 2)} Months</span>
                <span>{scheme.maxTenureMonths} Months</span>
              </div>
            </div>

            {/* Repayment Breakdown */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-3.5 text-xs">
              
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Base Interest Rate</span>
                <span className="font-semibold text-slate-700">{scheme.baseInterestRate}% p.a.</span>
              </div>

              {scheme.effectiveInterestRate !== scheme.baseInterestRate && (
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Interest Subvention (Savings)</span>
                  <span className="font-bold text-emerald-600">
                    -{scheme.interestSubvention || 0}% p.a.
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Net Interest Rate</span>
                <span className="font-extrabold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                  {scheme.effectiveInterestRate}% p.a.
                </span>
              </div>

              <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center text-slate-500 font-medium">
                <span>Net Interest Cost</span>
                <span className="font-extrabold text-slate-800">
                  ₹{Math.round(netInterest).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Total Repayment</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{Math.round(totalRepayable).toLocaleString()}
                </span>
              </div>

              <div className="border-t border-slate-200/60 pt-3 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>Estimated EMI (Monthly)</span>
                  <span>₹{Math.round(monthlyEMI).toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-900 font-bold">Estimated Seasonal Cost</span>
                  <span className="font-extrabold text-emerald-800 text-sm bg-emerald-50 rounded px-1.5 py-0.5">
                    ₹{Math.round(seasonalRepayment).toLocaleString()}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-medium leading-normal text-right mt-1">
                  *Agricultural payments are matched with Kharif and Rabi harvesting sales (2 payments/year).
                </p>
              </div>

            </div>

            {/* Checklist trigger button */}
            <button
              onClick={onGoToChecklist}
              className="mt-6 w-full group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <FileText className="h-4 w-4" />
              <span>Get Required Documents</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

          </div>

          {/* Customer Advisory Box */}
          <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-slate-400 text-xs space-y-3 leading-relaxed">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1 text-[10px]">
              <Landmark className="h-3.5 w-3.5 text-emerald-400" />
              Official Bank Disbursal
            </h4>
            <p>
              Advisory rates are based on the standard RBI prompt-repayment calendar. Actual disbursals must be executed directly at cooperative banks, RRBs, or commercial lenders.
            </p>
            <p className="text-[10px] text-slate-500 font-medium border-t border-slate-800 pt-2.5">
              Disclaimer: Interest calculations are estimates. Subsidy disbursement is subject to physical verification of land and water source details by the local patwari.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
