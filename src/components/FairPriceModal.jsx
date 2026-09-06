// FairPriceModal.jsx - Fair Price Valuation & Recycler Match
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IndianRupee, TrendingUp, Sliders, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const FairPriceModal = () => {
  const { fairPriceOpen, setFairPriceOpen, materials = [], setVoiceModalOpen } = useApp();

  const [selectedMaterial, setSelectedMaterial] = useState('mat_2'); // Laptop
  const [condition, setCondition] = useState('working');
  const [quantity, setQuantity] = useState(1);

  if (!fairPriceOpen) return null;

  const defaultMat = { id: 'mat_2', name: 'Laptop', min_price_per_unit: 1500, max_price_per_unit: 3500, price_unit: 'piece', image_icon: '💻', category: 'Computing', factors: 'Processor age, Motherboard condition, RAM/SSD intact, Battery status' };
  const mat = (materials && materials.length > 0)
    ? (materials.find(m => m.id === selectedMaterial) || materials[0] || defaultMat)
    : defaultMat;

  let conditionMultiplier = condition === 'working' ? 1.25 : condition === 'damaged' ? 0.75 : 1.0;
  const minPrice = Math.round((mat.min_price_per_unit || 1500) * quantity * conditionMultiplier);
  const maxPrice = Math.round((mat.max_price_per_unit || 3500) * quantity * conditionMultiplier);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setFairPriceOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real-Time Market Rate Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Fair Price Calculator</h2>
          <p className="text-xs text-slate-400 mt-1">Transparent pricing algorithm based on metal index & recyclers</p>
        </div>

        {/* Form Controls */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Select E-Waste Category:</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.image_icon} {m.name} ({m.category})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Quantity / Weight:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Working State:</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none"
              >
                <option value="working">Working / Intact (+25%)</option>
                <option value="scrap">Non-Working Scrap (Base)</option>
                <option value="damaged">Severely Damaged (-25%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Valuation Result Box */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-850 border border-amber-500/60 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Estimated Market Range</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-semibold">
              Live Mandi Price
            </span>
          </div>

          <div className="text-3xl font-black text-amber-400 mb-2 flex items-center gap-1">
            <IndianRupee className="w-7 h-7" />
            <span>{minPrice.toLocaleString('en-IN')} – {maxPrice.toLocaleString('en-IN')}</span>
          </div>

          {/* Pricing Factors */}
          <div className="bg-slate-900/80 p-3 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Key Price Impact Factors:
            </span>
            <ul className="text-xs text-slate-400 space-y-1">
              {mat.factors.split(', ').map((factor, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best Match Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFairPriceOpen(false);
              setVoiceModalOpen(true);
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <span>GET BEST MATCH RECYCLER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
