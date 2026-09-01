"use client";

import React, { useState } from "react";
import { Sprout, Globe, Menu, X, ShieldCheck } from "lucide-react";

interface NavbarProps {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  onNavigateHome: () => void;
}

export default function Navbar({ currentLanguage, setLanguage, onNavigateHome }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" }
  ];

  const currentLangLabel = languages.find(l => l.code === currentLanguage)?.name || "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm transition-transform hover:scale-105">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>कृषिऋण</span>
              <span className="text-emerald-600 font-semibold">Sahayak</span>
            </h1>
            <p className="hidden xs:block text-[10px] text-slate-500 font-medium tracking-wider uppercase">
              AI Agricultural Credit Advisory
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Inspired by FinanceMacha structure) */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={onNavigateHome} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            Find Schemes
          </button>
          <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            How It Works
          </a>
          <a href="#resources" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            Agri Resources
          </a>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100/60 rounded-full px-2.5 py-0.5 shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Govt Scheme Aligned
          </span>
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Globe className="h-4 w-4 text-slate-500" />
              <span>{currentLangLabel}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 text-sm transition-colors ${
                      currentLanguage === lang.code
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onNavigateHome}
            className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700 transition-all active:scale-95"
          >
            Start Intake
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Button */}
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 bg-slate-50/50"
            title="Switch Language"
          >
            <Globe className="h-4 w-4" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-16 top-14 z-50 w-44 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2 text-sm ${
                    currentLanguage === lang.code ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigateHome();
                setIsOpen(false);
              }}
              className="text-left w-full rounded-xl px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
            >
              Find Schemes
            </button>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
            >
              How It Works
            </a>
            <a
              href="#resources"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
            >
              Agri Resources
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigateHome();
                setIsOpen(false);
              }}
              className="w-full text-center rounded-xl bg-emerald-800 py-3 text-base font-semibold text-white shadow-md shadow-emerald-800/10 hover:bg-emerald-700 transition-all"
            >
              Start Intake
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
