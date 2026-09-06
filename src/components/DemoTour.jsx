// DemoTour.jsx - Hackathon 3-Minute Guided Interactive Demo Tour
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, X, Shield, Factory, UserCheck } from 'lucide-react';

export const DemoTour = () => {
  const { demoTourOpen, setDemoTourOpen, switchRole, setVoiceModalOpen, setAiScannerOpen, setFairPriceOpen, setVerifiedHandoverOpen } = useApp();

  const [stepIndex, setStepIndex] = useState(0);

  const demoSteps = [
    {
      title: "1. Collector Persona Login",
      role: "collector",
      desc: "Logged in as Ravi Kumar (Informal Collector / Kabadiwala from Coimbatore South). Language set to Tamil.",
      actionLabel: "Next: Test Voice Assistant",
      action: () => switchRole('collector')
    },
    {
      title: "2. Voice-First Experience",
      role: "collector",
      desc: "Tap the Mic button or select spoken audio prompt: 'I have two old mobile phones and one laptop'. AI parses speech and extracts material & pricing.",
      actionLabel: "Open Voice Assistant",
      action: () => { switchRole('collector'); setVoiceModalOpen(true); }
    },
    {
      title: "3. AI Material Scanner",
      role: "collector",
      desc: "Upload e-waste photo or take camera picture. AI Vision classifier returns 94% confidence, weight, and valuation.",
      actionLabel: "Open AI Scanner",
      action: () => { switchRole('collector'); setVoiceModalOpen(false); setAiScannerOpen(true); }
    },
    {
      title: "4. Fair-Value Price Engine",
      role: "collector",
      desc: "Transparent price estimation based on copper index, component working state, and local recycler demand.",
      actionLabel: "Open Price Calculator",
      action: () => { switchRole('collector'); setAiScannerOpen(false); setFairPriceOpen(true); }
    },
    {
      title: "5. Digital Mandi Micro-Lot Pooling",
      role: "collector",
      desc: "Small e-waste items pooled into consolidated Mandi Lot #DM1024 (126.5 kg, ₹28,500 total value). Reduces pickup cost for collectors.",
      actionLabel: "View Mandi Page",
      action: () => { setFairPriceOpen(false); }
    },
    {
      title: "6. Recycler Persona Switch",
      role: "recycler",
      desc: "Switch to GreenCycle Recycling Pvt Ltd (Authorized Recycler). View nearby pooled e-waste lots and accept lots for pickup.",
      actionLabel: "Switch to Recycler Dashboard",
      action: () => switchRole('recycler')
    },
    {
      title: "7. Verified Handover & QR Code",
      role: "recycler",
      desc: "Scan QR code KC-2026-000184 and verify weight at pickup location.",
      actionLabel: "Open Handover Modal",
      action: () => setVerifiedHandoverOpen(true)
    },
    {
      title: "8. Instant Partial Payment",
      role: "collector",
      desc: "Triggers instant ₹1,000 partial payment to collector bank account/UPI, with ₹1,500 pending final refinery grading.",
      actionLabel: "View Payment Release",
      action: () => setVerifiedHandoverOpen(true)
    },
    {
      title: "9. E-Waste Traceability Lifecycle",
      role: "admin",
      desc: "7-Stage timeline: COLLECTED → POOLED → MATCHED → PICKED UP → VERIFIED → GRADED → RECYCLED.",
      actionLabel: "View Traceability Timeline",
      action: () => switchRole('admin')
    },
    {
      title: "10. Admin Impact Dashboard",
      role: "admin",
      desc: "Oversight dashboard for SIH Nodal Officer showing total collectors, recyclers, total recycled e-waste (kg), and carbon savings.",
      actionLabel: "Finish Demo Tour",
      action: () => setDemoTourOpen(false)
    }
  ];

  if (!demoTourOpen) return null;

  const current = demoSteps[stepIndex];

  const handleNext = () => {
    if (current.action) current.action();
    if (stepIndex < demoSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setDemoTourOpen(false);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      if (demoSteps[stepIndex - 1].action) demoSteps[stepIndex - 1].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-white animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setDemoTourOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">SIH 2026 Interactive Demo Tour</h2>
            <p className="text-[11px] text-amber-400 font-semibold">
              Step {stepIndex + 1} of {demoSteps.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / demoSteps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-5">
          <h3 className="font-extrabold text-lg text-emerald-300 mb-1">
            {current.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {current.desc}
          </p>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
            <span>🎭 Active Role:</span>
            <span className="font-bold text-amber-400 uppercase tracking-wide">
              {current.role}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1 border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-transform"
          >
            <span>{current.actionLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
