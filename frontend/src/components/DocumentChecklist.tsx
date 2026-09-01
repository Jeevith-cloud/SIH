"use client";

import React, { useState } from "react";
import { Scheme } from "../data/schemes";
import { ArrowLeft, CheckCircle2, Circle, FileText, Upload, Printer, Check, Cpu, AlertCircle } from "lucide-react";

interface DocumentChecklistProps {
  scheme: Scheme;
  onNavigateBack: () => void;
}

export default function DocumentChecklist({ scheme, onNavigateBack }: DocumentChecklistProps) {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  
  // AI upload simulation states
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [aiVerifiedDocs, setAiVerifiedDocs] = useState<Record<string, { number: string; status: string }>>({});

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredCount = scheme.requiredDocuments.filter(d => d.isRequired).length;
  const readyRequiredCount = scheme.requiredDocuments.filter(
    (d) => d.isRequired && (checkedDocs[d.id] || !!aiVerifiedDocs[d.id])
  ).length;

  const progressPercentage = Math.round((readyRequiredCount / (requiredCount || 1)) * 100);

  const simulateAIUpload = (docId: string) => {
    setUploadingDocId(docId);
    
    // Simulate OCR and AI verification lag
    setTimeout(() => {
      setUploadingDocId(null);
      
      let mockNumber = "XX-XXXX-XXXX";
      if (docId === "aadhaar") mockNumber = "XXXX-XXXX-8923";
      else if (docId === "land-record") mockNumber = "Khasra No: 14/2 // Khatoni Ref: 45A";
      else if (docId === "agri-degree") mockNumber = "Reg-No: ACABC-2025-891";

      setAiVerifiedDocs((prev) => ({
        ...prev,
        [docId]: {
          number: mockNumber,
          status: "Verified & Verified: Name & Address Match Land Registry"
        }
      }));

      // Automatically check the item
      setCheckedDocs((prev) => ({ ...prev, [docId]: true }));
    }, 1800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 print:p-0">
      
      {/* Back button (Hidden when printing) */}
      <div className="mb-6 print:hidden">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scheme Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Checklist (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm print:border-none print:shadow-none">
            <div className="flex justify-between items-start mb-4 print:hidden">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 uppercase tracking-wider">
                Application Checklist
              </span>
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-full transition-all active:scale-95"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Paper Copy</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              Required Documents for {scheme.name}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 print:block hidden">
              Official application document verification report
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 font-medium">
              Check off the items below to prepare for your application. You can use our mock AI Scan to test document validity, extract registration numbers, and verify address details against land registry databases.
            </p>
          </div>

          {/* Interactive Checklist Cards */}
          <div className="space-y-4">
            {scheme.requiredDocuments.map((doc) => {
              const isChecked = checkedDocs[doc.id] || !!aiVerifiedDocs[doc.id];
              const aiData = aiVerifiedDocs[doc.id];
              const isUploading = uploadingDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-4 ${
                    isChecked ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    
                    {/* Tick Checkbox Column */}
                    <button
                      onClick={() => toggleDoc(doc.id)}
                      className="mt-1 text-slate-400 hover:text-emerald-700 transition-colors shrink-0 print:text-slate-800"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-300" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 leading-none">{doc.name}</h3>
                        {doc.isRequired ? (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                            Required
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{doc.description}</p>

                      {/* AI Verification Success Note */}
                      {aiData && (
                        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100/50 px-3 py-2 flex items-start gap-2 text-emerald-800 text-xs font-semibold animate-in slide-in-from-top-1">
                          <Cpu className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-emerald-950 font-bold uppercase tracking-wider">Kisan Mitra AI OCR Success</p>
                            <p className="text-emerald-900 font-medium mt-0.5">ID Ref: {aiData.number}</p>
                            <p className="text-[10px] text-emerald-600 mt-0.5">{aiData.status}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Upload Scan Button (Hidden when printing) */}
                  <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 print:hidden">
                    {isUploading ? (
                      <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 w-full">
                        <svg className="animate-spin h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>OCR Scanning...</span>
                      </div>
                    ) : aiData ? (
                      <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 w-full">
                        <Check className="h-4.5 w-4.5 text-emerald-600" />
                        <span>OCR Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => simulateAIUpload(doc.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all active:scale-95 w-full"
                      >
                        <Upload className="h-3.5 w-3.5 text-slate-400" />
                        <span>AI Verify</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right column: Progress & Print Summary (1/3 column) */}
        <div className="space-y-6 print:hidden">
          
          {/* Progress Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-emerald-700" />
              <span>Completion Status</span>
            </h3>

            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
                <span>Core Requirements</span>
                <span className="text-emerald-800">{readyRequiredCount} of {requiredCount} Ready</span>
              </div>
              
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-center py-2">
              <span className="text-2xl font-extrabold text-slate-900">{progressPercentage}%</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">Ready for Application</p>
            </div>

            {progressPercentage === 100 ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex gap-2.5 text-emerald-800 text-xs">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-medium">
                  <strong>Ready!</strong> You have verified all necessary documents. You can print the paper guide and visit your nearest Rural Bank Branch with confidence.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-amber-50/60 border border-amber-100/50 p-4 flex gap-2.5 text-amber-800 text-xs">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-medium">
                  Some required documents are not checked. Press the <strong>AI Verify</strong> button to test verification using sample documents.
                </p>
              </div>
            )}
          </div>

          {/* Quick Bank Visit Tips */}
          <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-slate-400 text-xs space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              AI Pre-Screening Guide
            </h4>
            
            <div className="space-y-3 leading-relaxed">
              <p>
                <strong>Tip 1: Match Names.</strong> Ensure the name on your Aadhaar card exactly matches the name on your Land Record (7/12 extract or Patta). Minor spelling mismatches are the primary reason for bank delay.
              </p>
              <p>
                <strong>Tip 2: Active Account.</strong> Ensure your bank passbook reflects your crop selling receipts or PM-Kisan payouts to fast-track credit approval.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
