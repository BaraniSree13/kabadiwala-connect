// VerifiedHandoverModal.jsx - Verified Handover & Partial Payment Trigger
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, CheckCircle2, ShieldCheck, IndianRupee, RefreshCw, X, ArrowRight, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VerifiedHandoverModal = () => {
  const { user, verifiedHandoverOpen, setVerifiedHandoverOpen, activeTxId, verifyHandover, t } = useApp();

  const [pin, setPin] = useState('1024');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [resultData, setResultData] = useState(null);

  const txCode = 'KC-2026-000184';

  const handleVerify = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      const res = await verifyHandover(activeTxId, pin);
      setIsVerifying(false);
      setVerificationDone(true);
      setResultData(res);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  if (!verifiedHandoverOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => { setVerifiedHandoverOpen(false); setVerificationDone(false); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Handover Verification</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Verified Handover & Payment</h2>
          <p className="text-xs text-slate-400 mt-1">Transaction ID: <span className="font-mono text-emerald-400 font-bold">{txCode}</span></p>
        </div>

        {!verificationDone && (
          <div>
            {/* Simulated QR Code Card */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center mb-4">
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl shadow-inner flex items-center justify-center mb-3">
                {/* SVG QR Code Simulation */}
                <div className="w-full h-full border-4 border-slate-900 grid grid-cols-4 gap-1 p-1">
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-emerald-600 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-emerald-600 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-emerald-600 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-emerald-600 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-sm"></div>
                  <div className="bg-emerald-600 rounded-sm"></div>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-300">
                Collector presents this QR code to logistics driver
              </p>
            </div>

            {/* Handover Verification Form */}
            <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 mb-4">
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Enter Handover Verification PIN:
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xl tracking-widest text-emerald-400 font-bold p-3 rounded-xl focus:outline-none"
              />
            </div>

            {/* Verification Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Weight & Release Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>VERIFY HANDOVER & RELEASE PAYMENT</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Verification Success & Instant Partial Payment Display */}
        {verificationDone && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-950/60 border border-emerald-500/80 rounded-2xl p-4 text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-2 font-black">
                ✓
              </div>
              <h3 className="font-extrabold text-lg text-white">Digital Handover Verified!</h3>
              <p className="text-xs text-emerald-300">Transaction ID: {txCode}</p>
            </div>

            {/* Handover Digital Checklist */}
            <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 space-y-2 text-xs mb-4">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Collector Verification</span>
                <span>{user?.name || 'Ravi Kumar'} ✓</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Recycler Verification</span>
                <span>GreenCycle Recycling ✓</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Material Inspection</span>
                <span>2 Mobiles + 1 Laptop ✓</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Weighment Verified</span>
                <span>12.5 kg ✓</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Digital Handover Status</span>
                <span>Confirmed ✓</span>
              </div>
            </div>

            {/* Instant Partial Payment Banner */}
            <div className="bg-gradient-to-r from-amber-950 to-emerald-950 border border-amber-500/60 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-sm text-amber-300">INSTANT PARTIAL PAYMENT RELEASED</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase block">Instant Partial</span>
                  <span className="text-xl font-black text-emerald-400">₹1,000 PAID</span>
                  <span className="text-[9px] text-slate-400 block">Transferred to UPI</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/40">
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase block">Pending Grading</span>
                  <span className="text-xl font-black text-amber-400">₹1,500 PENDING</span>
                  <span className="text-[9px] text-slate-400 block">After refinery XRF</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setVerifiedHandoverOpen(false); setVerificationDone(false); }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 text-xs"
            >
              Close Handover Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
