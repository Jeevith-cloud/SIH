"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Sprout, ShieldAlert, Check } from "lucide-react";

export interface IntakeData {
  state: string;
  landAcres: number;
  crop: string;
  irrigation: string;
  purpose: string;
  amount: number;
}

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void;
  onCancel: () => void;
}

export default function IntakeForm({ onSubmit, onCancel }: IntakeFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeData>({
    state: "Punjab",
    landAcres: 3,
    crop: "Rice/Paddy",
    irrigation: "Borewell & Tubewell",
    purpose: "Seed & Fertilizer Purchase",
    amount: 150000
  });

  const states = [
    "Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka", "Andhra Pradesh", "Rajasthan", "Madhya Pradesh"
  ];

  const crops = [
    { id: "Rice/Paddy", label: "Paddy (Rice)", desc: "Requires heavy water & short term crop inputs" },
    { id: "Wheat", label: "Wheat", desc: "Rabi season crop, requires moderate inputs" },
    { id: "Sugarcane", label: "Sugarcane", desc: "Long term crop, high seed cost" },
    { id: "Vegetables", label: "Vegetables/Fruits", desc: "Short cycles, high fertilizer need" },
    { id: "Cotton", label: "Cotton", desc: "Cash crop, pesticide/labor inputs" },
    { id: "Agri-clinic Setup", label: "Agri-Clinic/None", desc: "Business, clinic, or custom hiring setup" }
  ];

  const irrigationSources = [
    { id: "Borewell & Tubewell", label: "Borewell / Tubewell", desc: "Electric or diesel pump setup" },
    { id: "Canal & Rainfed", label: "Canal & Rainfed", desc: "Depends on season or shared canal" },
    { id: "No Access", label: "No Access / Solar needed", desc: "Requires pump or well installation" }
  ];

  const purposes = [
    { id: "Seed & Fertilizer Purchase", label: "Crop Inputs", desc: "Seeds, fertilizers, and weeding expenses" },
    { id: "General Crop Cultivation", label: "General Farming", desc: "Post-harvest expenses & asset maintenance" },
    { id: "Solar Pump Installation", label: "Solar Pump / Irrigation", desc: "Installing clean irrigation pumps" },
    { id: "Farm Mechanization & Machinery", label: "Tractor & Implements", desc: "Buying tractors, harvesters, tillers" },
    { id: "Agri-Business Startup", label: "Agri-Business / Clinic", desc: "Setting up shop, testing lab, custom hiring" }
  ];

  const getLandCategory = (acres: number) => {
    if (acres <= 2.5) return "Marginal Farmer (Low limits, high subsidy)";
    if (acres <= 5.0) return "Small Farmer (Qualifies for interest subvention)";
    return "Medium/Large Farmer (Requires standard documents & collateral above threshold)";
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const selectCrop = (cropId: string) => {
    setFormData({ ...formData, crop: cropId });
    // Default purpose based on crop
    if (cropId === "Agri-clinic Setup") {
      setFormData(prev => ({
        ...prev,
        crop: cropId,
        purpose: "Agri-Business Startup",
        amount: Math.max(prev.amount, 500000) // ACABC is usually higher
      }));
    }
  };

  const selectPurpose = (purposeId: string) => {
    let amount = formData.amount;
    // Set realistic defaults for crop-related decisions
    if (purposeId === "Solar Pump Installation") amount = 250000;
    else if (purposeId === "Farm Mechanization & Machinery") amount = 600000;
    else if (purposeId === "Agri-Business Startup") amount = 800000;
    else amount = 150000;

    setFormData({ ...formData, purpose: purposeId, amount });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10">
      
      {/* Progress Bar & Indicators */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 uppercase tracking-wider">
            Step {step} of 3
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {step === 1 ? "Land & Location" : step === 2 ? "Cropping Profile" : "Loan & Purpose"}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Contents */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <h2 className="text-2xl font-bold text-slate-900">Tell us about your land and location</h2>
            <p className="text-slate-500 text-sm">
              We use these details to check regional schemes and interest subvention limits based on your land size.
            </p>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">State of Farming</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 font-medium focus:border-emerald-500 focus:bg-white focus:outline-none transition-all"
              >
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Land Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800">Total Cultivated Land</label>
                <span className="text-lg font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-0.5">
                  {formData.landAcres} Acres
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={formData.landAcres}
                onChange={(e) => setFormData({ ...formData, landAcres: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-semibold">
                <span>0 Acres (Landless)</span>
                <span>5 Acres</span>
                <span>10 Acres</span>
                <span>15+ Acres</span>
              </div>
            </div>

            {/* Land Classification Alert */}
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100/50 p-4 flex gap-3 text-emerald-800">
              <Sprout className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-0.5">FARMER CLASSIFICATION</p>
                <p className="text-sm font-medium">{getLandCategory(formData.landAcres)}</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <h2 className="text-2xl font-bold text-slate-900">What do you cultivate?</h2>
            <p className="text-slate-500 text-sm">
              Different crops qualify for different credit guidelines under the Scale of Finance (SoF). Select your primary crop.
            </p>

            {/* Crop Select Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {crops.map((cr) => {
                const isSelected = formData.crop === cr.id;
                return (
                  <button
                    key={cr.id}
                    type="button"
                    onClick={() => selectCrop(cr.id)}
                    className={`text-left rounded-2xl border p-4 transition-all relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-base font-bold ${isSelected ? "text-emerald-800" : "text-slate-800"}`}>
                        {cr.label}
                      </span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <span className="block text-xs text-slate-400 mt-1 font-medium">{cr.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Irrigation Source */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Primary Irrigation Source</label>
              <div className="flex flex-col gap-3">
                {irrigationSources.map((ir) => {
                  const isSelected = formData.irrigation === ir.id;
                  return (
                    <button
                      key={ir.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, irrigation: ir.id })}
                      className={`text-left rounded-xl border px-4 py-3 flex justify-between items-center transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-bold block ${isSelected ? "text-emerald-800" : "text-slate-800"}`}>
                          {ir.label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{ir.desc}</span>
                      </div>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <h2 className="text-2xl font-bold text-slate-900">Configure your requirement</h2>
            <p className="text-slate-500 text-sm">
              Select what you intend to spend the loan amount on and adjust the funding amount.
            </p>

            {/* Purpose Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">Purpose of Credit</label>
              <div className="grid grid-cols-1 gap-3">
                {purposes.map((p) => {
                  const isSelected = formData.purpose === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPurpose(p.id)}
                      className={`text-left rounded-2xl border p-4 flex justify-between items-center transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="pr-4">
                        <span className={`text-sm font-bold block ${isSelected ? "text-emerald-800" : "text-slate-800"}`}>
                          {p.label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{p.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loan Amount Input and Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-800">Desired Credit Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-emerald-800 text-lg">₹</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, amount: Math.min(val, 2500000) });
                    }}
                    className="w-40 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 pl-7 font-bold text-lg text-emerald-800 text-right focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max={formData.purpose === "Agri-Business Startup" ? "2000000" : "1000000"}
                step="10000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-semibold">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
                <span>{formData.purpose === "Agri-Business Startup" ? "₹20,00,000" : "₹10,00,000"}</span>
              </div>
            </div>

            {/* Collateral Limit Warning (Dynamic) */}
            {formData.amount > 160000 && formData.purpose !== "Agri-Business Startup" && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex gap-2.5 text-amber-800">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">
                  Notice: For credit amounts above ₹1.6 Lakhs, RBI guidelines generally require submitting agricultural land records as collateral or co-guarantee.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button footer */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{step === 1 ? "Cancel" : "Back"}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
        >
          <span>{step === 3 ? "Find Match" : "Next Step"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
