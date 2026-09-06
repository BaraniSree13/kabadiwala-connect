// MandiLotDetailModal.jsx - Detail View Modal for Digital Mandi Micro-Lots
import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Users, Weight, IndianRupee, ShieldCheck, CheckCircle, Truck, X, ArrowRight, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MandiLotDetailModal = ({ lot, isOpen, onClose }) => {
  const { role, user, joinMandiLot, acceptMandiLot, setVerifiedHandoverOpen } = useApp();

  if (!isOpen || !lot) return null;

  const handleJoin = async () => {
    await joinMandiLot(lot.id, 15, 3200);
    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  const handleAccept = () => {
    acceptMandiLot(lot.id);
    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-950 text-amber-300 font-mono font-extrabold text-xs px-2 py-0.5 rounded border border-amber-500/40">
                #{lot.lot_code}
              </span>
              <span className="text-xs text-emerald-400 font-bold uppercase">{lot.status}</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5">{lot.title}</h2>
          </div>
        </div>

        {/* Location & Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-850 p-3.5 rounded-2xl mb-4 border border-slate-800">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Aggregated Collectors</span>
            <span className="text-base font-extrabold text-white flex items-center gap-1">
              <Users className="w-4 h-4 text-amber-400" /> {lot.collector_count} Kabadiwalas
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Weight</span>
            <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1">
              <Weight className="w-4 h-4 text-emerald-400" /> {lot.total_weight_kg} kg
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Lot Value</span>
            <span className="text-base font-extrabold text-amber-400 flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" /> {lot.total_value.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Hub Location</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {lot.location_zone}
            </span>
          </div>
        </div>

        {/* Pooled Items Breakdown */}
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 mb-4 text-xs">
          <h4 className="font-extrabold text-slate-300 mb-2">📦 Aggregated Micro-Lot Breakdown:</h4>
          <div className="space-y-1.5 text-slate-200">
            <div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
              <span>👨‍🌾 Collector {role === 'collector' ? user?.name : 'Ravi Kumar'}:</span>
              <span className="font-bold text-emerald-400">2 Mobile Phones (0.4 kg)</span>
            </div>
            <div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
              <span>👨‍🌾 Collector Selvam M:</span>
              <span className="font-bold text-emerald-400">1 Laptop Dell Inspiron (2.2 kg)</span>
            </div>
            <div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
              <span>👩‍🌾 Collector Anitha Devi:</span>
              <span className="font-bold text-emerald-400">15 kg Copper Wires & PCBs</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-xs font-extrabold">
          {role === 'collector' && (
            <button
              onClick={handleJoin}
              className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <span>JOIN THIS MANDI LOT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {role === 'recycler' && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ACCEPT MANDI LOT</span>
              </button>

              <button
                onClick={() => { onClose(); setVerifiedHandoverOpen(true); }}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 py-3 px-3 rounded-xl border border-slate-700 flex items-center gap-1"
              >
                <Truck className="w-4 h-4" />
                <span>PICKUP</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl border border-slate-700"
            >
              CLOSE DETAILS
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
