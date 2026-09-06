// AppContext.jsx - React Context for global app state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../utils/i18n';
import { getOfflineQueue, enqueueAction, syncOfflineQueue } from '../utils/offlineQueue';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Current Active Persona
  const [role, setRole] = useState('collector'); // 'collector' | 'recycler' | 'admin'
  const [user, setUser] = useState({
    id: 'usr_col_1',
    name: 'Ravi Kumar',
    role: 'collector',
    phone: '9876543210',
    language: 'ta',
    location: 'Coimbatore South',
    avatar: '👨‍🌾'
  });

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Language
  const [language, setLanguage] = useState('ta'); // 'en' | 'ta' | 'hi'

  // Network Offline Simulation State
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Modals Overlay Visibility
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [aiScannerOpen, setAiScannerOpen] = useState(false);
  const [fairPriceOpen, setFairPriceOpen] = useState(false);
  const [verifiedHandoverOpen, setVerifiedHandoverOpen] = useState(false);
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [activeTxId, setActiveTxId] = useState('tx_184');

  // Application Data States (preloaded with default data for instant zero-latency render)
  const [materials, setMaterials] = useState([
    { id: 'mat_1', name: 'Mobile Phone', category: 'Consumer Electronics', min_price_per_unit: 400, max_price_per_unit: 600, price_unit: 'piece', image_icon: '📱', description: 'Old smartphones, feature phones', factors: 'Working condition, Battery health, Screen damage' },
    { id: 'mat_2', name: 'Laptop', category: 'Computing', min_price_per_unit: 1500, max_price_per_unit: 3500, price_unit: 'piece', image_icon: '💻', description: 'Old & damaged laptops', factors: 'Processor age, Motherboard condition, RAM/SSD intact' },
    { id: 'mat_3', name: 'Desktop Tower', category: 'Computing', min_price_per_unit: 1200, max_price_per_unit: 2800, price_unit: 'piece', image_icon: '🖥️', description: 'CPU towers, PC cases', factors: 'Power supply unit, SMPS weight' },
    { id: 'mat_4', name: 'Television / Monitor', category: 'Displays', min_price_per_unit: 600, max_price_per_unit: 1800, price_unit: 'piece', image_icon: '📺', description: 'CRT, LCD, LED TVs', factors: 'Display panel status' },
    { id: 'mat_5', name: 'Refrigerator', category: 'Home Appliances', min_price_per_unit: 1800, max_price_per_unit: 4200, price_unit: 'piece', image_icon: '🧊', description: 'Refrigerators', factors: 'Compressor working state' }
  ]);
  const [mandiLots, setMandiLots] = useState([
    { id: 'lot_1024', lot_code: 'DM1024', title: 'Coimbatore South E-Waste Micro-Lot', status: 'open', total_weight_kg: 126.5, total_value: 28500, recycler_interest: 'High', collector_count: 8, recycler_id: 'rec_1', location_zone: 'Peelamedu Hub' },
    { id: 'lot_1025', lot_code: 'DM1025', title: 'Gandhipuram PCB & Battery Bulk Lot', status: 'open', total_weight_kg: 210.0, total_value: 45200, recycler_interest: 'Very High', collector_count: 12, recycler_id: 'rec_2', location_zone: 'Gandhipuram Hub' }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 'tx_184', tx_code: 'KC-2026-000184', collector_id: 'col_1', collector_name: 'Ravi Kumar', recycler_id: 'rec_1', recycler_name: 'GreenCycle Recycling Pvt Ltd', mandi_lot_id: 'lot_1024', material_summary: '2 Mobile Phones, 1 Laptop', total_agreed_amount: 2500, partial_amount_paid: 1000, final_amount_paid: 0, status: 'picked_up', qr_code_data: 'KC-2026-000184|col_1|rec_1|2500' }
  ]);
  const [recyclers, setRecyclers] = useState([
    { id: 'rec_1', user_id: 'usr_rec_1', company_name: 'GreenCycle Recycling Pvt Ltd', is_verified: true, capacity_kg: 10000, location_zone: 'Peelamedu Industrial Zone' },
    { id: 'rec_2', user_id: 'usr_rec_2', company_name: 'EcoVolt E-Waste Solutions', is_verified: true, capacity_kg: 7500, location_zone: 'SIDCO Industrial Estate' }
  ]);
  const [earnings, setEarnings] = useState(14500);

  // Translation helper
  const t = (key) => getTranslation(language, key);

  // Fetch initial data
  const refreshData = async () => {
    try {
      const matRes = await fetch('/api/materials');
      const matData = await matRes.json();
      if (matData.success) setMaterials(matData.materials);

      const mandiRes = await fetch('/api/mandi');
      const mandiData = await mandiRes.json();
      if (mandiData.success) setMandiLots(mandiData.lots);

      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();
      if (txData.success) setTransactions(txData.transactions);

      const recRes = await fetch('/api/recyclers');
      const recData = await recRes.json();
      if (recData.success) setRecyclers(recData.recyclers);
    } catch (err) {
      console.warn('API offline fallback active');
    }
  };

  useEffect(() => {
    refreshData();
    setOfflineQueueCount(getOfflineQueue().length);
  }, []);

  // Quick Persona Role Switcher for Hackathon Demonstrations
  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'collector') {
      setUser({
        id: 'usr_col_1',
        name: 'Ravi Kumar',
        role: 'collector',
        phone: '9876543210',
        language: 'ta',
        location: 'Coimbatore South',
        avatar: '👨‍🌾'
      });
      setLanguage('ta');
    } else if (newRole === 'recycler') {
      setUser({
        id: 'usr_rec_1',
        name: 'GreenCycle Recycling Pvt Ltd',
        role: 'recycler',
        phone: '9123456780',
        language: 'en',
        location: 'Peelamedu Industrial Zone',
        avatar: '🏭'
      });
      setLanguage('en');
    } else {
      setUser({
        id: 'usr_adm_1',
        name: 'SIH Nodal Administrator',
        role: 'admin',
        phone: '9000000000',
        language: 'en',
        location: 'National E-Waste Oversight Board',
        avatar: '🛡️'
      });
      setLanguage('en');
    }
  };

  // Toggle Offline Mode Simulation
  const toggleOffline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      // Auto-sync when coming back online
      syncOfflineQueue().then(({ syncedCount }) => {
        setOfflineQueueCount(0);
        refreshData();
      });
    }
  };

  // Add items with offline support
  const addEwasteItem = async (itemData) => {
    if (!isOnline) {
      enqueueAction('ADD_EWASTE', itemData);
      setOfflineQueueCount(getOfflineQueue().length);
      return { offlineQueued: true };
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      refreshData();
      return data;
    } catch (err) {
      enqueueAction('ADD_EWASTE', itemData);
      setOfflineQueueCount(getOfflineQueue().length);
      return { offlineQueued: true };
    }
  };

  // Join Mandi Lot
  const joinMandiLot = async (lotId, weight = 10, estValue = 2500) => {
    if (!isOnline) {
      enqueueAction('JOIN_MANDI', { lotId, weight, estValue });
      setOfflineQueueCount(getOfflineQueue().length);
      // Optimistic state update
      setMandiLots(prev => prev.map(l => l.id === lotId || l.lot_code === lotId ? { ...l, collector_count: l.collector_count + 1, total_weight_kg: l.total_weight_kg + weight } : l));
      return { offlineQueued: true };
    }

    try {
      const res = await fetch('/api/mandi/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId, collectorId: 'col_1', weight, estValue })
      });
      const data = await res.json();
      refreshData();
      return data;
    } catch (err) {
      enqueueAction('JOIN_MANDI', { lotId, weight, estValue });
      setOfflineQueueCount(getOfflineQueue().length);
      return { offlineQueued: true };
    }
  };

  // Accept Mandi Lot (Recycler action)
  const acceptMandiLot = async (lotId) => {
    setMandiLots(prev => prev.map(l => l.id === lotId || l.lot_code === lotId ? { ...l, status: 'matched', recycler_id: 'rec_1' } : l));
    refreshData();
  };

  // Verify Handover
  const verifyHandover = async (transactionId, pin = '1024') => {
    try {
      const res = await fetch('/api/transactions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, pin, weightVerified: '14.2' })
      });
      const data = await res.json();
      if (data.success) {
        setEarnings(prev => prev + data.partialPaid);
        refreshData();
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Server offline' };
    }
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn, logout,
      role, setRole, switchRole,
      user, setUser,
      language, setLanguage,
      t,
      isOnline, toggleOffline, offlineQueueCount,
      voiceModalOpen, setVoiceModalOpen,
      aiScannerOpen, setAiScannerOpen,
      fairPriceOpen, setFairPriceOpen,
      verifiedHandoverOpen, setVerifiedHandoverOpen,
      demoTourOpen, setDemoTourOpen,
      activeTxId, setActiveTxId,
      materials, mandiLots, transactions, recyclers, earnings,
      addEwasteItem, joinMandiLot, acceptMandiLot, verifyHandover, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
