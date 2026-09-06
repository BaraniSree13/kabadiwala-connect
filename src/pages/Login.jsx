// Login.jsx - Authentication Page with Role-Based Login & Quick Demo Access
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Factory, UserCheck, Lock, Phone, Mail, ArrowRight, Sparkles, CheckCircle2, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Login = ({ onLoginSuccess }) => {
  const { switchRole, registerUser, loginUser, t } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('collector');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser({
          name: name || 'Test User',
          phone: identifier,
          email: identifier,
          password,
          role: selectedRole,
          location: location || 'Coimbatore Hub'
        });

        if (res.success) {
          setSuccessMsg(res.message);
          confetti({ particleCount: 50, spread: 60 });
          setIsRegister(false); // Switch to login tab, keep identifier and password for instant sign in
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await loginUser(identifier, password, selectedRole);

        if (res.success) {
          confetti({ particleCount: 50, spread: 60 });
          if (onLoginSuccess) onLoginSuccess();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleName) => {
    setErrorMsg('');
    setSuccessMsg('');
    switchRole(roleName);
    confetti({ particleCount: 50, spread: 60 });
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Eco Decor */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Leaf className="w-32 h-32 text-emerald-400" />
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 p-1 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <img src="/logo.svg" alt="Kabadiwala Connect Logo" className="w-12 h-12" />
          </div>

          <span className="bg-emerald-950 text-emerald-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-500/40">
            SIH 2026 • Problem SIH26229
          </span>

          <h1 className="text-2xl font-black text-white mt-2">
            Kabadiwala Connect
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bringing informal collectors into the formal recycling chain
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons for Hackathon Judges */}
        <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH Judge 1-Click Quick Demo Login:</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('collector')}
              className="bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">👨‍🌾</span>
              <span className="text-[11px] font-extrabold text-white">Collector</span>
              <span className="text-[9px] text-slate-400">Demo Collector</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('recycler')}
              className="bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏭</span>
              <span className="text-[11px] font-extrabold text-white">Recycler</span>
              <span className="text-[9px] text-slate-400">GreenCycle</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
              <span className="text-[11px] font-extrabold text-white">Admin</span>
              <span className="text-[9px] text-slate-400">Nodal Officer</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-slate-800 mb-5 text-xs font-bold">
          <button
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all ${
              !isRegister ? 'border-emerald-500 text-emerald-400 font-extrabold' : 'border-transparent text-slate-400'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
              setName('');
              setIdentifier('');
              setPassword('');
              setLocation('');
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all ${
              isRegister ? 'border-emerald-500 text-emerald-400 font-extrabold' : 'border-transparent text-slate-400'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Registration Successful!</p>
              <p className="text-[11px] text-emerald-200/90">{successMsg}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/80 rounded-xl text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authentication Notice</p>
              <p className="text-[11px] text-rose-200/90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Role Selection */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select User Role:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('collector')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedRole === 'collector' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Collector
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('recycler')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedRole === 'recycler' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Recycler
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedRole === 'admin' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Full Name field if registering */}
          {isRegister && (
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Name / Organization:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Test Collector"
              />
            </div>
          )}

          {/* Mobile / Email */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Mobile Number or Email:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 p-3 focus:outline-none focus:border-emerald-500"
                placeholder={isRegister ? "e.g. testcollector@example.com or 9876543210" : "e.g. 9876543210 or email"}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 p-3 focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Location field if registering */}
          {isRegister && (
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Location Zone:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                placeholder="Coimbatore South"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            <span>
              {loading
                ? 'PROCESSING...'
                : isRegister
                ? 'CREATE ACCOUNT'
                : 'SIGN IN TO DASHBOARD'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Footer */}
        <div className="mt-5 text-[10px] text-slate-400 text-center border-t border-slate-800 pt-3">
          <span>Demo Password: <code className="text-emerald-400">sih2026demo</code></span>
        </div>

      </div>
    </div>
  );
};
