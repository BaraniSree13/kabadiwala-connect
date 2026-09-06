// AdminDashboard.jsx - Government & Nodal Officer Admin Dashboard
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, Factory, Recycle, AlertTriangle, TrendingUp, DollarSign, CheckCircle2, XCircle, Sliders, BarChart3 } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, recyclers, materials } = useApp();

  const [stats, setStats] = useState({
    totalCollectors: 1420,
    verifiedRecyclers: 48,
    totalEwasteCollectedKg: 84250,
    totalRecycledKg: 76100,
    activeMandiLots: 8,
    pendingVerifications: 14,
    totalTransactionValueRupees: 4280000,
    co2ReductionTons: 198.4
  });

  const [recyclerList, setRecyclerList] = useState(recyclers);
  const [flaggedTxs, setFlaggedTxs] = useState([
    { id: 'tx_flag_1', tx_code: 'KC-2026-000912', reason: 'Unusually high weight reported (450 kg PCBs)', status: 'flagged' }
  ]);

  const toggleVerifyRecycler = (id) => {
    setRecyclerList(prev => prev.map(r => r.id === id ? { ...r, is_verified: !r.is_verified } : r));
  };

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-4 pt-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="bg-indigo-950 text-indigo-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-indigo-500/40">
              SIH Nodal Oversight Board
            </span>
            <h2 className="text-2xl font-black text-white">{user?.name || 'National E-Waste Oversight Admin'}</h2>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Real-time monitoring of informal sector integration, recycling compliance, price transparency, and environmental impact.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Total Collectors</span>
          <p className="text-2xl font-black text-emerald-400 flex items-center gap-1">
            <Users className="w-5 h-5 text-emerald-400" /> {stats.totalCollectors.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">+14% this month</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Verified Recyclers</span>
          <p className="text-2xl font-black text-amber-400 flex items-center gap-1">
            <Factory className="w-5 h-5 text-amber-400" /> {stats.verifiedRecyclers}
          </p>
          <span className="text-[10px] text-emerald-400 block mt-1">100% CPCB Approved</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">E-Waste Collected</span>
          <p className="text-2xl font-black text-white flex items-center gap-1">
            <Recycle className="w-5 h-5 text-emerald-400" /> {(stats.totalEwasteCollectedKg / 1000).toFixed(1)} Tons
          </p>
          <span className="text-[10px] text-emerald-400 block mt-1">90.3% Recycled</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Transaction Value</span>
          <p className="text-2xl font-black text-amber-400 flex items-center gap-1">
            ₹{(stats.totalTransactionValueRupees / 100000).toFixed(1)} Lakhs
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Direct to Kabadiwalas</span>
        </div>
      </div>

      {/* Visual Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>E-Waste Collected by Category (Kg)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Consumer Electronics (Mobiles/Laptops)</span>
                <span className="text-emerald-400 font-bold">34,200 kg (40%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Circuit Boards & Motherboards</span>
                <span className="text-amber-400 font-bold">22,100 kg (26%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[26%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Home Appliances (Fridges/TVs)</span>
                <span className="text-indigo-400 font-bold">18,500 kg (22%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[22%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Batteries & Copper Wiring</span>
                <span className="text-rose-400 font-bold">9,450 kg (12%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Suspicious Transaction Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Fraud Prevention & Suspicious Flags</span>
          </h3>

          {flaggedTxs.map(tx => (
            <div key={tx.id} className="bg-rose-950/40 border border-rose-500/50 p-3.5 rounded-2xl text-xs mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono font-bold text-rose-300">{tx.tx_code}</span>
                <span className="bg-rose-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px]">FLAGGED</span>
              </div>
              <p className="text-slate-300 font-medium mb-2">{tx.reason}</p>
              <div className="flex gap-2">
                <button onClick={() => alert('Investigation opened')} className="bg-rose-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]">
                  Investigate
                </button>
                <button onClick={() => setFlaggedTxs([])} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-semibold text-[11px]">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recycler Verification Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <h3 className="font-extrabold text-base text-white mb-3">Manage Recycler Verifications</h3>

        <div className="space-y-2 text-xs">
          {recyclerList.map(rec => (
            <div key={rec.id} className="bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏭</span>
                <div>
                  <h4 className="font-bold text-white text-sm">{rec.company_name}</h4>
                  <p className="text-slate-400 text-[11px]">{rec.location_zone}</p>
                </div>
              </div>

              <button
                onClick={() => toggleVerifyRecycler(rec.id)}
                className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1 transition-all ${
                  rec.is_verified
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                }`}
              >
                {rec.is_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{rec.is_verified ? 'VERIFIED' : 'NOT VERIFIED'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
