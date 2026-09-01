"use client";

import React, { useState, useEffect } from "react";
import { Sprout, Search, Cpu, Database } from "lucide-react";

interface MatchingLoaderProps {
  onComplete: () => void;
}

export default function MatchingLoader({ onComplete }: MatchingLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "Reading farmer profile & land size...",
    "Scanning Scale of Finance (SoF) rules for selected crops...",
    "Checking NABARD subsidy guidelines & interest subventions...",
    "Evaluating collateral limits (exemptions up to ₹1.6L)...",
    "Ranking recommendations based on lowest effective rate...",
    "Done! Fetching recommended schemes..."
  ];

  useEffect(() => {
    // Progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // 4 seconds total

    // Rotate status updates
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 500); // Small pause for UX satisfaction
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md p-10 text-center flex flex-col items-center">
      
      {/* Animated AI Brain/Sprout Outer Rings */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping duration-1000 w-24 h-24 m-auto"></div>
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse w-20 h-20 m-auto"></div>
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg">
          <Sprout className="h-8 w-8 animate-bounce duration-1000" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">Kisan Mitra AI Matchmaking</h3>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-1.5 justify-center">
        <Database className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
        Connecting to Credit Server
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full mb-3 overflow-hidden">
        <div 
          className="h-full bg-emerald-600 rounded-full transition-all ease-out duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-lg font-extrabold text-emerald-800 mb-6">{progress}%</span>

      {/* Dynamic Status Lines */}
      <div className="min-h-[50px] flex items-center justify-center border border-slate-100 rounded-2xl p-4 bg-slate-50/50 w-full">
        <p className="text-sm font-semibold text-slate-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {statuses[statusIndex]}
        </p>
      </div>

      {/* Help Note */}
      <p className="text-[11px] text-slate-400 font-medium mt-8 leading-relaxed">
        Our system compares rates across public sector banks, cooperative societies, and regional rural banks using live NABARD API rules.
      </p>

    </div>
  );
}
