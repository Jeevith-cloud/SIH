import React from "react";
import { Coins, Sun, Tractor, ArrowRight, ShieldCheck, Star } from "lucide-react";

interface HomeHeroProps {
  onStartIntake: () => void;
}

export default function HomeHero({ onStartIntake }: HomeHeroProps) {
  return (
    <section className="relative w-full bg-slate-50 overflow-hidden">
      
      {/* Background decoration to match agri-theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Centered Top Badge */}
        <div className="mx-auto mb-6 flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100/80 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-800 uppercase shadow-sm">
          <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600 animate-pulse" />
          <span>Simple, Honest & Free</span>
        </div>

        {/* Hero Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
          Compare <span className="text-emerald-700">Crop Loans</span>, 
          <br className="hidden sm:block" /> 
          Farm Subsidies & Agri-Credit.
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
          Answer a few quick questions about your land and crops to find the lowest-interest schemes. We translate bank terms into plain farmer language so you can borrow with confidence.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartIntake}
            className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-800/20 hover:bg-emerald-700 hover:shadow-emerald-800/30 transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            Find My Loan Scheme
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href="#categories"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto"
          >
            Browse Categories
          </a>
        </div>

        {/* Subtext info */}
        <p className="mt-4 text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          No registration required. Zero bank spam. Aligned with RBI policy.
        </p>

        {/* Three Category Cards (Directly inspired by FinanceMacha categories) */}
        <div id="categories" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Card 1: Crop Loans */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-6 group-hover:scale-105 transition-transform">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Crop Cultivation Loans</h3>
              <p className="text-sm leading-relaxed text-slate-500 mb-6">
                Short-term credit for seeds, fertilizers, weeding, harvesting, and post-harvest maintenance. Underwritten at highly subsidized rates.
              </p>
            </div>
            <button
              onClick={onStartIntake}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
            >
              Check Cultivation Rates
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Card 2: Solar & Subsidies */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-6 group-hover:scale-105 transition-transform">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Solar & Irrigation Subsidies</h3>
              <p className="text-sm leading-relaxed text-slate-500 mb-6">
                Get up to 60% government support for solar pump sets, tube wells, drip irrigation, and environment-friendly farm upgrades.
              </p>
            </div>
            <button
              onClick={onStartIntake}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
            >
              Explore Solar Subsidies
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Card 3: Machinery Loans */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 mb-6 group-hover:scale-105 transition-transform">
                <Tractor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Machinery & Agri-Ventures</h3>
              <p className="text-sm leading-relaxed text-slate-500 mb-6">
                Long-term loans for purchasing tractors, tillers, custom hiring setup, and setting up agricultural clinics or cold chains.
              </p>
            </div>
            <button
              onClick={onStartIntake}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
            >
              Calculate Machinery Loans
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
