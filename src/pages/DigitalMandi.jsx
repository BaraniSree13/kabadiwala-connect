// DigitalMandi.jsx - Digital Mandi Micro-Lot Aggregation Engine
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Users, Weight, IndianRupee, ShieldCheck, Plus, CheckCircle, TrendingUp, Truck, Layers } from 'lucide-react';
import { MandiLotDetailModal } from '../components/MandiLotDetailModal';
import confetti from 'canvas-confetti';

export const DigitalMandi = () => {
  const { mandiLots, joinMandiLot, isOnline } = useApp();

  const [joinedLotIds, setJoinedLotIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedLot, setSelectedLot] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleJoinLot = async (lotId) => {
    await joinMandiLot(lotId, 12, 2800);
    setJoinedLotIds(prev => [...prev, lotId]);
    confetti({ particleCount: 45, spread: 60 });
  };

  const filteredLots = filter === 'open' ? mandiLots.filter(l => l.status === 'open') : mandiLots;

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-4 pt-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-amber-500/40">
              SIH Differentiator #4
            </span>
            <h2 className="text-2xl font-black text-white">Digital Mandi Micro-Lot Pooling</h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Aggregating small e-waste quantities from local kabadiwalas into bulk lots to attract top authorized recyclers, command higher prices, and reduce pickup logistics emissions.
        </p>
      </div>

      {/* Impact Counter Bar */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Pooled E-Waste</span>
          <span className="text-xl font-black text-amber-400">1,626 kg</span>
          <span className="text-[9px] text-emerald-400 block mt-0.5"> Across 8 Mandi Hubs</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Logistics Cost Saved</span>
          <span className="text-xl font-black text-emerald-400">₹42,500</span>
          <span className="text-[9px] text-emerald-400 block mt-0.5"> Shared pickup routes</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Active Collectors</span>
          <span className="text-xl font-black text-white">68 Pooled</span>
          <span className="text-[9px] text-amber-400 block mt-0.5"> High Recycler Bidding</span>
        </div>
      </div>

      {/* Active Mandi Micro-Lots Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
            Active Digital Mandi Micro-Lots
          </h3>
          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold ${filter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              All Lots
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1 rounded-lg font-bold ${filter === 'open' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              Open for Joining
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLots.map((lot) => {
            const isJoined = joinedLotIds.includes(lot.id);

            return (
              <div
                key={lot.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="bg-amber-950 text-amber-300 font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg border border-amber-500/40">
                      LOT #{lot.lot_code}
                    </span>
                    <h4 className="font-extrabold text-base text-white mt-1.5">{lot.title}</h4>
                    <p className="text-[11px] text-slate-400">{lot.location_zone}</p>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    lot.status === 'open' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lot.status}
                  </span>
                </div>

                {/* Mandi Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-850 p-3 rounded-2xl mb-4 border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase">Total Collectors</span>
                    <span className="text-sm font-extrabold text-white flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> {lot.collector_count} Collectors
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase">Total Weight</span>
                    <span className="text-sm font-extrabold text-white flex items-center gap-1">
                      <Weight className="w-3.5 h-3.5 text-emerald-400" /> {lot.total_weight_kg} kg
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase">Estimated Lot Value</span>
                    <span className="text-sm font-extrabold text-amber-400 flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" /> {lot.total_value.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase">Recycler Interest</span>
                    <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {lot.recycler_interest}
                    </span>
                  </div>
                </div>

                {/* Simulated Pooled Breakdown */}
                <div className="text-[11px] text-slate-300 mb-4 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 block mb-1">📦 Current Pooled Items in this Lot:</span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">Collector A: 2 Mobiles</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">Collector B: 1 Laptop</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">Collector C: 5kg PCBs</span>
                  </div>
                </div>

                {/* Action Buttons: JOIN LOT & VIEW LOT */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinLot(lot.id)}
                    disabled={isJoined || lot.status !== 'open'}
                    className={`flex-1 font-black py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-lg active:scale-95 transition-transform ${
                      isJoined
                        ? 'bg-emerald-950 border border-emerald-500/80 text-emerald-300'
                        : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>JOINED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>JOIN LOT</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => { setSelectedLot(lot); setDetailOpen(true); }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold px-3 py-3 rounded-xl border border-slate-700 text-xs"
                  >
                    VIEW LOT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MandiLotDetailModal
        lot={selectedLot}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};
