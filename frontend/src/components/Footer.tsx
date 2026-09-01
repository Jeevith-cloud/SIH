import React from "react";
import { Sprout, PhoneCall, HelpCircle, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sprout className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                कृषिऋण <span className="text-emerald-400">Sahayak</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Empowering Indian farmers with clear, unbiased credit recommendations. We process land and cropping profiles to match you with low-interest government schemes and bank subventions.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-800/50 w-fit rounded-lg p-2 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Updated with 2026 NABARD & KCC interest subvention guidelines.</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Official Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  PM-Kisan Portal
                </a>
              </li>
              <li>
                <a href="https://www.nabard.org/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  NABARD Official
                </a>
              </li>
              <li>
                <a href="https://agricoop.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  Ministry of Agriculture
                </a>
              </li>
              <li>
                <a href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  Digital India
                </a>
              </li>
            </ul>
          </div>

          {/* Support / Helpdesk */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Farmer Support</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <PhoneCall className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Kisan Call Centre (Toll-Free)</p>
                  <p className="text-sm font-semibold text-white">1800-180-1551</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">KrishiRin Helpline</p>
                  <p className="text-sm font-semibold text-white">rin-sahayak@gov.in.in</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} KrishiRin Sahayak. All rights under CC-BY-SA 4.0. Designed for Farmer Financial Inclusivity.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Advisory</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
