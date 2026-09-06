// App.jsx - Main Application Layout & Controller
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AIScannerModal } from './components/AIScannerModal';
import { FairPriceModal } from './components/FairPriceModal';
import { VerifiedHandoverModal } from './components/VerifiedHandoverModal';
import { DemoTour } from './components/DemoTour';

import { CollectorDashboard } from './pages/CollectorDashboard';
import { DigitalMandi } from './pages/DigitalMandi';
import { RecyclerDashboard } from './pages/RecyclerDashboard';
import { Traceability } from './pages/Traceability';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';

const MainContent = () => {
  const { role, isLoggedIn, setIsLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {activeTab === 'home' && (
          role === 'collector' ? (
            <CollectorDashboard setActiveTab={setActiveTab} />
          ) : role === 'recycler' ? (
            <RecyclerDashboard />
          ) : (
            <AdminDashboard />
          )
        )}

        {activeTab === 'mandi' && <DigitalMandi />}
        {activeTab === 'transactions' && (role === 'recycler' ? <RecyclerDashboard /> : <CollectorDashboard setActiveTab={setActiveTab} />)}
        {activeTab === 'traceability' && <Traceability />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Interactive Overlays */}
      <VoiceAssistantModal />
      <AIScannerModal />
      <FairPriceModal />
      <VerifiedHandoverModal />
      <DemoTour />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
