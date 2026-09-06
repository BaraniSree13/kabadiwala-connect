// BottomNav.jsx - Mobile Bottom Navigation Bar
import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, PlusCircle, Store, FileText, UserCheck, ShieldCheck, Activity } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { role, t, setVoiceModalOpen } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 px-2 py-1.5 shadow-2xl flex items-center justify-around text-slate-400">
      {/* Home Tab */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'home' ? 'text-emerald-400 bg-emerald-950/60 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Sell / Mic Quick Action (Collector) */}
      {role === 'collector' && (
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 -mt-4 bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 rounded-full shadow-lg border-4 border-slate-900 active:scale-95 transition-transform"
        >
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          <span className="text-[9px] font-black uppercase">Sell</span>
        </button>
      )}

      {/* Mandi Tab */}
      <button
        onClick={() => setActiveTab('mandi')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'mandi' ? 'text-amber-400 bg-amber-950/60 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px]">Mandi</span>
      </button>

      {/* Transactions / Pickup Queue */}
      <button
        onClick={() => setActiveTab('transactions')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'transactions' ? 'text-emerald-400 bg-emerald-950/60 font-bold' : 'hover:text-slate-200'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px]">Sales</span>
      </button>

      {/* Traceability / Admin Dashboard */}
      <button
        onClick={() => setActiveTab(role === 'admin' ? 'admin' : 'traceability')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'traceability' || activeTab === 'admin' ? 'text-emerald-400 bg-emerald-950/60 font-bold' : 'hover:text-slate-200'
        }`}
      >
        {role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        <span className="text-[10px]">{role === 'admin' ? 'Admin' : 'Trace'}</span>
      </button>
    </nav>
  );
};
