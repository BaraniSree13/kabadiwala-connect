// Navbar.jsx - Top Header with Hackathon Role Switcher & Offline Indicator
import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Globe, Wifi, WifiOff, Shield, Factory, UserCheck, PlayCircle, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { role, switchRole, user, language, setLanguage, t, isOnline, toggleOffline, offlineQueueCount, setDemoTourOpen, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-emerald-800/40 shadow-lg backdrop-blur-md bg-opacity-95">
      {/* Top Banner - Hackathon Role Quick Selector */}
      <div className="bg-emerald-950/80 px-3 py-1.5 border-b border-emerald-800/30 flex items-center justify-between text-xs overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="bg-emerald-500 text-emerald-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
            SIH26229
          </span>
          <span className="text-emerald-300 font-medium">Quick Demo Role Switcher:</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => switchRole('collector')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
              role === 'collector'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>👨‍🌾</span> Collector ({role === 'collector' && user?.name ? user.name : 'Demo'})
          </button>

          <button
            onClick={() => switchRole('recycler')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
              role === 'recycler'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🏭</span> Recycler (GreenCycle)
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🛡️</span> Admin (SIH Board)
          </button>
        </div>

        <button
          onClick={() => setDemoTourOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm shrink-0 transition-transform active:scale-95 text-xs"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Demo Tour (3m)</span>
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 p-0.5 shadow-md flex items-center justify-center">
            <img src="/logo.svg" alt="Kabadiwala Connect Logo" className="w-9 h-9" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-green-200 bg-clip-text text-transparent flex items-center gap-1.5">
              Kabadiwala Connect
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Informal Collector Digital Recycling Chain
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Toggle Badge */}
          <button
            onClick={toggleOffline}
            title="Click to toggle simulated Offline Mode for hackathon testing"
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                : 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFLINE {offlineQueueCount > 0 && `(${offlineQueueCount} queued)`}</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-800 rounded-lg px-2 py-1 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* User Profile Avatar & Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-700 text-xs">
            <span className="text-lg">{user.avatar}</span>
            <div className="hidden md:block text-left">
              <p className="font-semibold text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-emerald-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out / Change User"
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg border border-slate-700 transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
