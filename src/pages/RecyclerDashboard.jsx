// RecyclerDashboard.jsx - Authorized Recycler Portal
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Factory, MapPin, Truck, CheckCircle2, Phone, ShieldCheck, Weight, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecyclerDashboard = () => {
  const { user, mandiLots, acceptMandiLot, setVerifiedHandoverOpen } = useApp();

  const [acceptedLots, setAcceptedLots] = useState(['lot_1026']);
  const [scheduledPickups, setScheduledPickups] = useState([]);

  const handleAcceptLot = (lotId) => {
    acceptMandiLot(lotId);
    setAcceptedLots(prev => [...prev, lotId]);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleSchedulePickup = (lotId) => {
    setScheduledPickups(prev => [...prev, lotId]);
  };

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-4 pt-4">
      {/* Recycler Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized Recycler
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-semibold">Capacity Allocation</span>
            <span className="text-sm font-extrabold text-emerald-400">10,000 kg / Month</span>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Matched with pooled Digital Mandi lots based on proximity ({user.location}), processing capability, and transparent bidding.
        </p>
      </div>

      {/* Recycler Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Available Mandi Lots</span>
          <span className="text-xl font-black text-amber-400">{mandiLots.length} Lots</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Accepted Pickups</span>
          <span className="text-xl font-black text-emerald-400">{acceptedLots.length} Active</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Total Weight Contracted</span>
          <span className="text-xl font-black text-white">466.5 kg</span>
        </div>
      </div>

      {/* Available Mandi Lots Matching Feed */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-3">
          Available Pooled E-Waste Micro-Lots
        </h3>

        <div className="space-y-4">
          {mandiLots.map((lot) => {
            const isAccepted = acceptedLots.includes(lot.id) || lot.status === 'matched';
            const isScheduled = scheduledPickups.includes(lot.id);

            return (
              <div
                key={lot.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-950 text-amber-300 font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg border border-amber-500/40">
                        #{lot.lot_code}
                      </span>
                      <h4 className="font-extrabold text-base text-white">{lot.title}</h4>
                    </div>

                    {/* Proximity Distance Simulation */}
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Location: <span className="text-slate-200 font-semibold">{lot.location_zone}</span> (Approx 3.4 km away)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Combined Lot Value</span>
                    <span className="text-lg font-black text-amber-400 flex items-center gap-0.5 justify-end">
                      <IndianRupee className="w-4 h-4" /> {lot.total_value.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-850 p-3 rounded-2xl mb-4 text-center">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase">Total Weight</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{lot.total_weight_kg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase">Collectors Pooled</span>
                    <span className="font-extrabold text-white text-sm">{lot.collector_count} Collectors</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase">Recycler Match</span>
                    <span className="font-extrabold text-amber-400 text-sm">98% Fit Score</span>
                  </div>
                </div>

                {/* Recycler Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {/* ACCEPT LOT */}
                  <button
                    onClick={() => handleAcceptLot(lot.id)}
                    disabled={isAccepted}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 shadow transition-all ${
                      isAccepted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAccepted ? 'ACCEPTED' : 'ACCEPT LOT'}</span>
                  </button>

                  {/* REQUEST PICKUP */}
                  <button
                    onClick={() => handleSchedulePickup(lot.id)}
                    disabled={!isAccepted || isScheduled}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 border transition-all ${
                      isScheduled
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>{isScheduled ? 'SCHEDULED' : 'SCHEDULE PICKUP'}</span>
                  </button>

                  {/* VERIFY HANDOVER */}
                  <button
                    onClick={() => setVerifiedHandoverOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFY QR</span>
                  </button>

                  {/* CONTACT COLLECTOR */}
                  <button
                    onClick={() => alert(`Calling aggregated logistics line for Lot #${lot.lot_code}: +91 9876543210`)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>CONTACT</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
