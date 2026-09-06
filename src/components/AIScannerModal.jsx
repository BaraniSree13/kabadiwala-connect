// AIScannerModal.jsx - AI-Assisted E-Waste Identification Feature
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, CheckCircle, RefreshCw, X, Sparkles, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIScannerModal = () => {
  const { aiScannerOpen, setAiScannerOpen, materials, addEwasteItem } = useApp();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample mock images for instant demo testing
  const sampleImages = [
    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', cat: 'mat_2' },
    { label: 'Mobile Phone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', cat: 'mat_1' },
    { label: 'Circuit Board', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', cat: 'mat_7' }
  ];

  // Trigger Mock AI Computer Vision Analysis Engine
  const runAiVisionScan = (imageSource, categoryId) => {
    setSelectedPhoto(imageSource);
    setIsAnalyzing(true);
    setAiResult(null);

    // Realistic API delay simulation
    setTimeout(() => {
      const defaultMat = { id: 'mat_2', name: 'Laptop', min_price_per_unit: 1500, max_price_per_unit: 3500, image_icon: '💻' };
      let mat = (materials && materials.length > 0) ? (materials.find(m => m.id === categoryId) || materials[0] || defaultMat) : defaultMat;
      
      setAiResult({
        materialId: mat.id,
        name: mat.name,
        confidence: '94%',
        estQuantity: 1,
        estWeightKg: mat.name === 'Laptop' ? 2.2 : mat.name === 'Mobile Phone' ? 0.3 : 3.5,
        priceMin: mat.min_price_per_unit || 1500,
        priceMax: mat.max_price_per_unit || 3500,
        icon: mat.image_icon || '💻',
        detectedParts: ['Motherboard Grade-A', 'Copper Heat Sink', 'Li-ion Cell Array']
      });

      setIsAnalyzing(false);
    }, 1800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        runAiVisionScan(event.target.result, selectedCategory || 'mat_2');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAdd = async () => {
    if (!aiResult) return;
    await addEwasteItem({
      collectorId: 'col_1',
      materialSummary: `1 ${aiResult.name} (AI Scanned)`,
      totalAmount: Math.round((aiResult.priceMin + aiResult.priceMax) / 2)
    });
    confetti({ particleCount: 40, spread: 50 });
    setAiScannerOpen(false);
  };

  if (!aiScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setAiScannerOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Computer Vision Scanner</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Identify E-Waste Material</h2>
          <p className="text-xs text-slate-400 mt-1">Take a photo or upload an image for automated valuation</p>
        </div>

        {/* Input Methods: Camera / File Upload / Sample Presets */}
        {!aiResult && !isAnalyzing && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Camera Trigger */}
              <button
                onClick={() => runAiVisionScan(sampleImages[0].url, 'mat_2')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-200">Take Photo</span>
              </button>

              {/* Upload Image */}
              <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="w-12 h-12 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-200">Upload Image</span>
              </label>
            </div>

            {/* Quick Demo Sample Photos */}
            <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 mb-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                📸 Or click a demo photo to scan:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => runAiVisionScan(sample.url, sample.cat)}
                    className="relative rounded-xl overflow-hidden border border-slate-700 group hover:border-emerald-400"
                  >
                    <img src={sample.url} alt={sample.label} className="w-full h-16 object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-center font-bold text-white py-0.5">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Category Selection Fallback */}
            <div className="border-t border-slate-800 pt-3">
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Or select material manually:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  runAiVisionScan(sampleImages[0].url, e.target.value);
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="">Select Category...</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.image_icon} {m.name} ({m.category})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Analyzing Animation */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl mb-4">
              <img src={selectedPhoto} alt="Scanning" className="w-full h-full object-cover" />
              {/* Scanning Laser Animation line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-green-300 shadow-[0_0_15px_#22c55e] animate-bounce top-1/3"></div>
            </div>
            <p className="text-emerald-400 font-extrabold text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Neural Network E-Waste Classifier...
            </p>
            <span className="text-xs text-slate-400 mt-1">Extracting copper density & component grading</span>
          </div>
        )}

        {/* AI Scan Result Card */}
        {aiResult && !isAnalyzing && (
          <div>
            <div className="bg-slate-800 border border-emerald-500/60 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                <span className="text-3xl">{aiResult.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-white">{aiResult.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <span>Confidence: {aiResult.confidence}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">Weight: ~{aiResult.estWeightKg} kg</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Value</span>
                  <span className="text-xs text-emerald-400 font-bold">Fair Market Rate</span>
                </div>
                <p className="text-2xl font-black text-amber-400">
                  ₹{aiResult.priceMin} – ₹{aiResult.priceMax}
                </p>
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block mb-1">Detected Components:</span>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.detectedParts.map((part, i) => (
                    <span key={i} className="bg-slate-900 text-emerald-300 border border-slate-700 px-2 py-0.5 rounded-md text-[10px]">
                      ✓ {part}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmAdd}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
              >
                <CheckCircle className="w-5 h-5" />
                <span>CONFIRM & ADD TO MANDI</span>
              </button>
              
              <button
                onClick={() => setAiResult(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl border border-slate-700 text-xs"
              >
                RE-SCAN
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
