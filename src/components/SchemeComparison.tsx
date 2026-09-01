"use client";

import React from "react";
import { Scheme } from "../data/schemes";
import { ArrowLeft, Landmark, Check, X, ShieldAlert, Sparkles } from "lucide-react";
import { IntakeData } from "./IntakeForm";

interface SchemeComparisonProps {
  selectedSchemes: Scheme[];
  intakeData: IntakeData;
  onNavigateBack: () => void;
  onSelectScheme: (id: string) => void;
}

export default function SchemeComparison({
  selectedSchemes,
  intakeData,
  onNavigateBack,
  onSelectScheme
}: SchemeComparisonProps) {
  
  if (selectedSchemes.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-4">
        <p className="text-slate-500 font-semibold mb-4">No schemes selected for comparison.</p>
        <button onClick={onNavigateBack} className="rounded-full bg-emerald-800 text-white px-6 py-2.5 text-sm font-bold">
          Go back
        </button>
      </div>
    );
  }

  // Row definition helpers
  const rows = [
    {
      label: "Scheme Category",
      getValue: (s: Scheme) => s.category
    },
    {
      label: "Effective Rate (p.a.)",
      getValue: (s: Scheme) => (
        <span className="font-extrabold text-emerald-800 text-base">
          {s.effectiveInterestRate}% p.a.
        </span>
      ),
      highlight: true
    },
    {
      label: "Base Rate (p.a.)",
      getValue: (s: Scheme) => `${s.baseInterestRate}%`
    },
    {
      label: "Maximum Loan Limit",
      getValue: (s: Scheme) => `₹${s.maxAmount >= 100000 ? `${s.maxAmount / 100000} Lakh` : s.maxAmount.toLocaleString()}`
    },
    {
      label: "Max Repayment Tenure",
      getValue: (s: Scheme) => `${s.maxTenureMonths / 12} Years (${s.maxTenureMonths} Months)`
    },
    {
      label: "Collateral Required",
      getValue: (s: Scheme) => (
        <span className={`font-semibold ${s.collateralRequired ? "text-slate-700" : "text-emerald-700"}`}>
          {s.collateralRequired ? "Yes" : "No (Exempt)"}
        </span>
      )
    },
    {
      label: "Govt Subsidy",
      getValue: (s: Scheme) => s.subsidyPercentage ? `${s.subsidyPercentage}% on Capital Cost` : "Interest subvention only"
    },
    {
      label: "Unique Value",
      getValue: (s: Scheme) => s.keyBenefits[0],
      isLongText: true
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* Navigation header */}
      <div className="mb-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recommendations</span>
        </button>
      </div>

      <div className="mb-8">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 uppercase tracking-wider">
          Side-by-Side Comparison
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Compare Agricultural Schemes</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review interest rates, subsidies, and security guidelines to pick the best credit path for your farm.
        </p>
      </div>

      {/* Comparison Grid Board */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          
          {/* Header Row */}
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              
              {/* Feature label spacing */}
              <th className="w-1/4 p-6 text-sm font-bold text-slate-400">Scheme terms</th>
              
              {/* Dynamic columns */}
              {selectedSchemes.map((scheme) => (
                <th key={scheme.id} className="p-6 w-[250px] border-l border-slate-100/60 align-top">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {scheme.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{scheme.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{scheme.provider}</p>
                  </div>
                </th>
              ))}

            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100/80 text-sm">
            {rows.map((row, rIndex) => (
              <tr 
                key={rIndex} 
                className={`${row.highlight ? "bg-emerald-50/15" : "hover:bg-slate-50/30"}`}
              >
                {/* Metric Label Column */}
                <td className="p-6 font-bold text-slate-800 align-middle">
                  {row.label}
                </td>

                {/* Values columns */}
                {selectedSchemes.map((scheme) => (
                  <td 
                    key={scheme.id} 
                    className={`p-6 border-l border-slate-100/60 align-middle font-semibold text-slate-600 ${
                      row.isLongText ? "text-xs font-medium leading-relaxed max-w-[200px]" : ""
                    }`}
                  >
                    {row.getValue(scheme)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Action Bottom Row */}
            <tr className="bg-slate-50/30">
              <td className="p-6"></td>
              {selectedSchemes.map((scheme) => (
                <td key={scheme.id} className="p-6 border-l border-slate-100/60">
                  <button
                    onClick={() => onSelectScheme(scheme.id)}
                    className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-700 py-3.5 text-xs font-bold text-white text-center shadow-md shadow-emerald-800/5 hover:shadow-emerald-800/10 transition-all active:scale-95"
                  >
                    Select & Calculate
                  </button>
                </td>
              ))}
            </tr>

          </tbody>

        </table>
      </div>

      {/* Trust Advisory footer */}
      <div className="mt-8 rounded-2xl bg-emerald-50/40 border border-emerald-100/40 p-4 flex gap-3 text-emerald-800">
        <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed font-semibold">
          <p className="text-emerald-950 font-bold uppercase tracking-wider mb-0.5">Kisan Mitra AI Advice</p>
          <p className="font-medium text-emerald-900">
            For short-term cash flow and simple seeds/fertilizers purchase, <strong>KCC</strong> remains the cheapest option at a 4% effective interest rate. If you seek long-term capital support to install irrigation or tools, leverage <strong>PM-KUSUM</strong> or <strong>NABARD ACABC</strong> to maximize capital subsidy.
          </p>
        </div>
      </div>

    </div>
  );
}
