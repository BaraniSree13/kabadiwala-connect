// CollectorDashboard.jsx - Main Dashboard for Informal Collector / Kabadiwala
import React from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Camera, TrendingUp, Truck, FileText, Store, PlusCircle, ArrowUpRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const CollectorDashboard = ({ setActiveTab }) => {
  const { user, earnings, mandiLots, transactions, setVoiceModalOpen, setAiScannerOpen, setFairPriceOpen, setVerifiedHandoverOpen, t } = useApp();

  const openMandiLot = mandiLots.find(l => l.status === 'open') || mandiLots[0];

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-4 pt-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-3 top-3 text-7xl opacity-15 pointer-events-none">
          👨‍🌾
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/40 mb-2">
            <span>Verified Collector</span>
            <span className="text-amber-400">★ 4.9</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            வணக்கம், {user.name} 👋
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Coimbatore South Zone • Informal Recycling Hub #842
          </p>
        </div>
      </div>

      {/* Earnings & Pickups Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Earnings Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
            {t('currentEarnings')}
          </span>
          <p className="text-lg sm:text-2xl font-black text-amber-400">
            ₹{earnings.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18% this month
          </span>
        </div>

        {/* Pending Pickups */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
            {t('pendingPickups')}
          </span>
          <p className="text-lg sm:text-2xl font-black text-emerald-400">
            2 Pickups
          </p>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-amber-400" /> Today 2:30 PM
          </span>
        </div>

        {/* Completed Sales */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
            {t('completedTx')}
          </span>
          <p className="text-lg sm:text-2xl font-black text-white">
            18 Sales
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
            100% Verified
          </span>
        </div>
      </div>

      {/* Digital Mandi Status Quick Card */}
      {openMandiLot && (
        <div className="bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300">
                ACTIVE DIGITAL MANDI LOT #{openMandiLot.lot_code}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {openMandiLot.title} ({openMandiLot.total_weight_kg} kg pooled • {openMandiLot.collector_count} collectors)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('mandi')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shrink-0 shadow-md transition-transform active:scale-95"
          >
            VIEW MANDI
          </button>
        </div>
      )}

      {/* Section Title */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-3">
          Collector Main Actions
        </h3>

        {/* 6 LARGE ICON BUTTONS (Mandatory Spec) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          
          {/* 1. VOICE ASSISTANT */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-slate-950 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-xl border border-emerald-400/50 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-950/30 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="font-black text-sm text-white block uppercase tracking-tight">
                {t('voiceAssistant')}
              </span>
              <span className="text-[10px] text-emerald-100 font-medium">
                Speak instead of typing
              </span>
            </div>
          </button>

          {/* 2. SELL E-WASTE */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-md border border-slate-800 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block uppercase">
                {t('sellEwaste')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Add item & get offers
              </span>
            </div>
          </button>

          {/* 3. IDENTIFY MATERIAL */}
          <button
            onClick={() => setAiScannerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-md border border-slate-800 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block uppercase">
                {t('identifyMaterial')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                AI Vision scanner
              </span>
            </div>
          </button>

          {/* 4. CHECK PRICE */}
          <button
            onClick={() => setFairPriceOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-md border border-slate-800 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block uppercase">
                {t('checkPrice')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Fair market rate
              </span>
            </div>
          </button>

          {/* 5. REQUEST PICKUP */}
          <button
            onClick={() => setVerifiedHandoverOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-md border border-slate-800 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block uppercase">
                {t('requestPickup')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Verify handover QR
              </span>
            </div>
          </button>

          {/* 6. MY TRANSACTIONS */}
          <button
            onClick={() => setActiveTab('transactions')}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-md border border-slate-800 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block uppercase">
                {t('myTransactions')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                History & traceability
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Recent E-Waste Sales List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-white">Recent Sales & Mandi Items</h3>
          <button onClick={() => setActiveTab('transactions')} className="text-xs text-emerald-400 font-bold hover:underline">
            View All →
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-xl flex items-center justify-center shrink-0">
                  📦
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{tx.material_summary}</h4>
                  <p className="text-slate-400 text-[11px]">
                    ID: <span className="font-mono text-emerald-400">{tx.tx_code}</span> • {tx.recycler_name}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-amber-400 block">
                  ₹{tx.total_agreed_amount}
                </span>
                <span className="inline-block bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
