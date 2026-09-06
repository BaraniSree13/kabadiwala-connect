// Traceability.jsx - End-to-End E-Waste Lifecycle Traceability Portal
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, CheckCircle2, Clock, QrCode, ShieldCheck, Leaf, Truck, Factory, UserCheck, Layers, FileText } from 'lucide-react';

export const Traceability = () => {
  const { activeTxId, transactions } = useApp();

  const [timeline, setTimeline] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchTraceability(activeTxId);
  }, [activeTxId]);

  const fetchTraceability = async (txId) => {
    try {
      const res = await fetch(`/api/traceability/${txId}`);
      const data = await res.json();
      if (data.success) {
        setTimeline(data.timeline);
      }
    } catch (err) {
      console.warn('Traceability fallback active');
    }
  };

  const stages = [
    { key: 'COLLECTED', label: '1. COLLECTED', desc: 'Registered by Informal Collector', icon: '👨‍🌾' },
    { key: 'POOLED', label: '2. POOLED', desc: 'Aggregated in Digital Mandi Lot', icon: '🏪' },
    { key: 'MATCHED', label: '3. MATCHED', desc: 'Matched with Authorized Recycler', icon: '🤝' },
    { key: 'PICKED UP', label: '4. PICKED UP', desc: 'Logistics Van Dispatch', icon: '🚚' },
    { key: 'VERIFIED', label: '5. VERIFIED', desc: 'QR Verification & Instant Payment', icon: '🛡️' },
    { key: 'GRADED', label: '6. GRADED', desc: 'XRF Metal Purity Spectrometry', icon: '🔬' },
    { key: 'RECYCLED', label: '7. RECYCLED', desc: 'Formal Smelting & Gold Extraction', icon: '♻️' }
  ];

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-4 pt-4">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-500/40">
              SIH Differentiator #5
            </span>
            <h2 className="text-2xl font-black text-white">E-Waste Traceability Portal</h2>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Complete chain of custody tracking from informal kabadiwala collection to formal smelter recycling plant.
        </p>
      </div>

      {/* Transaction Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Transaction Code</span>
            <h3 className="font-mono text-xl font-extrabold text-emerald-400">KC-2026-000184</h3>
            <p className="text-xs text-slate-300 mt-0.5">Material: <span className="font-bold text-white">2 Mobile Phones, 1 Laptop</span></p>
          </div>

          <div className="flex items-center gap-3">
            {/* QR Code Container */}
            <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-md shrink-0">
              <div className="w-full h-full border-2 border-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
                <div className="bg-slate-900"></div>
                <div className="bg-emerald-600"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-emerald-600"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-emerald-600"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-emerald-600"></div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block font-semibold">CO2 Emissions Saved</span>
              <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1 justify-end">
                <Leaf className="w-4 h-4 text-emerald-400" /> 62.5 kg CO2e
              </span>
            </div>
          </div>
        </div>

        {/* 7-Stage Visual Lifecycle Stepper */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-4">
            7-Stage Recycling Lifecycle Progress
          </h4>

          <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-6">
            {stages.map((stage, idx) => {
              const matchedEntry = timeline.find(t => t.stage === stage.key);
              const isDone = matchedEntry && matchedEntry.status === 'completed';
              const isInProgress = matchedEntry && matchedEntry.status === 'in_progress';

              return (
                <div key={stage.key} className="relative group">
                  {/* Circle Icon Badge on Line */}
                  <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-400 text-slate-950 shadow-[0_0_10px_#22c55e]'
                      : isInProgress
                      ? 'bg-amber-500 border-amber-300 text-slate-950 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {stage.icon}
                  </div>

                  {/* Stage Card */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-slate-850 border-emerald-500/40 text-slate-200'
                      : isInProgress
                      ? 'bg-slate-850 border-amber-500/60 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>{stage.label}</span>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isInProgress && <Clock className="w-4 h-4 text-amber-400 animate-spin" />}
                      </h5>

                      <span className="text-[10px] font-mono text-slate-400">
                        {matchedEntry?.updated_at || 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {matchedEntry?.details || stage.desc}
                    </p>

                    {matchedEntry?.location && (
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                        📍 Location: {matchedEntry.location}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
