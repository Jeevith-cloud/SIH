"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import IntakeForm, { IntakeData } from "@/components/IntakeForm";
import MatchingLoader from "@/components/MatchingLoader";
import Recommendations from "@/components/Recommendations";
import SchemeDetail from "@/components/SchemeDetail";
import DocumentChecklist from "@/components/DocumentChecklist";
import SchemeComparison from "@/components/SchemeComparison";
import { Scheme, schemes } from "@/data/schemes";
import { fetchSchemeRecommendations } from "@/services/api";
import { Cpu, X, Send, MessageSquare, Sprout, Landmark, AlertCircle } from "lucide-react";

type FlowState = "home" | "intake" | "loading" | "results" | "detail" | "checklist" | "compare";

export default function Home() {
  // Navigation / Flow state
  const [flowState, setFlowState] = useState<FlowState>("home");
  const [language, setLanguage] = useState("en");

  // User details collected
  const [intakeData, setIntakeData] = useState<IntakeData>({
    state: "Punjab",
    landAcres: 3,
    crop: "Rice/Paddy",
    irrigation: "Borewell & Tubewell",
    purpose: "Seed & Fertilizer Purchase",
    amount: 150000
  });

  // Recommended schemes from backend (or fallback)
  const [recommendedSchemes, setRecommendedSchemes] = useState<Scheme[]>(schemes);
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Selected details
  const [activeSchemeId, setActiveSchemeId] = useState<string>("kisan-credit-card");
  const [compareSchemeIds, setCompareSchemeIds] = useState<string[]>([]);

  // Floating Chatbot States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Namaste! I am Kisan Mitra, your AI crop credit helper. How can I assist you with loans or interest subsidies today?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const activeScheme = recommendedSchemes.find((s) => s.id === activeSchemeId) || recommendedSchemes[0] || schemes[0];
  const selectedCompareSchemes = recommendedSchemes.filter((s) => compareSchemeIds.includes(s.id));

  // Chat message handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    // Simulate smart farming answers
    setTimeout(() => {
      let reply = "I'm analyzing that. For specific details on crop loans, try running our 'Find My Loan Scheme' matching tool at the top of the page.";
      
      const textLower = userText.toLowerCase();
      if (textLower.includes("collateral") || textLower.includes("security") || textLower.includes("limit")) {
        reply = "Under RBI guidelines, crop loans up to ₹1.6 Lakhs are 100% exempt from collateral check. Banks will not require title searches or property mortgaging for KCC under this amount.";
      } else if (textLower.includes("kcc") || textLower.includes("kisan credit")) {
        reply = "The Kisan Credit Card (KCC) has a base interest of 7%. If you repay within 12 months, the government applies a 3% prompt repayment subvention, bringing your net interest to just 4%.";
      } else if (textLower.includes("solar") || textLower.includes("kusum") || textLower.includes("pump")) {
        reply = "The PM-KUSUM scheme offers up to 60% subsidy (30% Central + 30% State Gov) for solar pumps. You only pay 10% cash upfront, and the remaining 30% can be financed with bank credit.";
      } else if (textLower.includes("document") || textLower.includes("need") || textLower.includes("apply")) {
        reply = "Generally, you need: 1. Aadhaar Card, 2. Land ownership copy (7/12 Extract or Patta), and 3. Crop cultivation declaration certified by your local village patwari.";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 1000);
  };

  const handleStartIntake = () => {
    setFlowState("intake");
  };

  const handleIntakeSubmit = (data: IntakeData) => {
    setIntakeData(data);
    setFlowState("loading");
    setApiError(null);

    // Call real FastAPI backend in background while loader renders
    fetchSchemeRecommendations(data)
      .then((res) => {
        setRecommendedSchemes(res.schemes);
        setIsBackendLive(res.isLive);
        if (res.error) {
          setApiError(res.error);
        } else {
          setApiError(null);
        }
        if (res.schemes.length > 0) {
          setActiveSchemeId(res.schemes[0].id);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setApiError(err instanceof Error ? err.message : "Failed to load recommendations");
        setIsBackendLive(false);
        setRecommendedSchemes(schemes);
      });
  };

  const handleIntakeCancel = () => {
    setFlowState("home");
  };

  const handleLoadingComplete = () => {
    setFlowState("results");
  };

  const handleSelectScheme = (id: string) => {
    setActiveSchemeId(id);
    setFlowState("detail");
  };

  const handleCompareSchemes = (ids: string[]) => {
    setCompareSchemeIds(ids);
    setFlowState("compare");
  };

  const navigateToHome = () => {
    setFlowState("home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* Navigation Header */}
      <Navbar
        currentLanguage={language}
        setLanguage={setLanguage}
        onNavigateHome={navigateToHome}
      />

      {/* Main Flow Controller */}
      <main className="flex-1 py-6 sm:py-10">
        
        {flowState === "home" && (
          <HomeHero onStartIntake={handleStartIntake} />
        )}

        {flowState === "intake" && (
          <div className="px-4">
            <IntakeForm onSubmit={handleIntakeSubmit} onCancel={handleIntakeCancel} />
          </div>
        )}

        {flowState === "loading" && (
          <div className="px-4 py-12">
            <MatchingLoader onComplete={handleLoadingComplete} />
          </div>
        )}

        {flowState === "results" && (
          <Recommendations
            schemes={recommendedSchemes}
            intakeData={intakeData}
            onSelectScheme={handleSelectScheme}
            onNavigateBack={() => setFlowState("intake")}
            onCompareSchemes={handleCompareSchemes}
            isBackendLive={isBackendLive}
            apiError={apiError}
            onRetry={() => handleIntakeSubmit(intakeData)}
          />
        )}

        {flowState === "detail" && (
          <SchemeDetail
            scheme={activeScheme}
            initialAmount={intakeData.amount}
            onNavigateBack={() => setFlowState("results")}
            onGoToChecklist={() => setFlowState("checklist")}
          />
        )}

        {flowState === "checklist" && (
          <DocumentChecklist
            scheme={activeScheme}
            onNavigateBack={() => setFlowState("detail")}
          />
        )}

        {flowState === "compare" && (
          <SchemeComparison
            selectedSchemes={selectedCompareSchemes}
            intakeData={intakeData}
            onNavigateBack={() => setFlowState("results")}
            onSelectScheme={handleSelectScheme}
          />
        )}

      </main>

      {/* Trust Badge Band (shown on landing or results pages) */}
      {(flowState === "home" || flowState === "results") && (
        <div className="bg-emerald-900 text-emerald-100 py-8 px-4 border-t border-emerald-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Landmark className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">NABARD Aligned</h4>
                <p className="text-xs text-emerald-200">Matches guidelines for Rural Cooperative & Commercial banks.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Cpu className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">AI Credit Scoring</h4>
                <p className="text-xs text-emerald-200">Underwrites and filters loan limits dynamically using regional farming data.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <AlertCircle className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">No Broker Commissions</h4>
                <p className="text-xs text-emerald-200">100% direct application advice. Always free, unbiased & simple.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot Mascot (Kisan Mitra AI) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        {chatOpen ? (
          <div className="w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white border border-emerald-600">
                  <Sprout className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-none">Kisan Mitra AI</h4>
                  <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Online Advisory</span>
                </div>
              </div>
              
              <button 
                onClick={() => setChatOpen(false)}
                className="text-emerald-100 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="h-72 overflow-y-auto p-4 space-y-4 bg-slate-50 text-xs">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                      msg.sender === "user" 
                        ? "bg-emerald-800 text-white font-medium rounded-tr-none" 
                        : "bg-white text-slate-800 font-semibold border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-3 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about collateral limits, subventions..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none font-semibold text-slate-700 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm shrink-0 transition-transform active:scale-95"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-emerald-700"
            title="Ask Kisan Mitra AI"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
      </div>

    </div>
  );
}
