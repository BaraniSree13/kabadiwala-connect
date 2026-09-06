// AppContext.jsx - React Context for global app state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../utils/i18n';
import { getOfflineQueue, enqueueAction, syncOfflineQueue } from '../utils/offlineQueue';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Registered Users Storage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('kc_registered_users_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'usr_col_1',
        name: 'Ravi Kumar',
        role: 'collector',
        phone: '9876543210',
        email: 'ravi@kabadiwala.com',
        password: 'sih2026demo',
        language: 'ta',
        location: 'Coimbatore South',
        avatar: '👨‍🌾'
      },
      {
        id: 'usr_rec_1',
        name: 'GreenCycle Recycling Pvt Ltd',
        role: 'recycler',
        phone: '9123456780',
        email: 'greencycle@recycling.com',
        password: 'sih2026demo',
        language: 'en',
        location: 'Peelamedu Industrial Zone',
        avatar: '🏭'
      },
      {
        id: 'usr_adm_1',
        name: 'SIH Nodal Administrator',
        role: 'admin',
        phone: '9000000000',
        email: 'admin@kabadiwala.com',
        password: 'sih2026demo',
        language: 'en',
        location: 'National E-Waste Oversight Board',
        avatar: '🛡️'
      }
    ];
  });

  // Active Auth Session State
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('kc_auth_session_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn && parsed.user) return parsed;
      } catch (e) {}
    }
    return {
      isLoggedIn: false,
      user: null,
      role: 'collector'
    };
  });

  const isLoggedIn = session.isLoggedIn;
  const role = session.role || (session.user ? session.user.role : 'collector');
  const user = session.user || (registeredUsers.length > 0 ? registeredUsers[0] : {
    id: 'usr_col_1',
    name: 'Ravi Kumar',
    role: 'collector',
    location: 'Coimbatore South',
    avatar: '👨‍🌾'
  });

  const setRole = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    const newSession = { isLoggedIn: true, user: updatedUser, role: newRole };
    setSession(newSession);
    localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
  };

  const setUser = (newUser) => {
    const newSession = { isLoggedIn: true, user: newUser, role: newUser.role || role };
    setSession(newSession);
    localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
  };

  const setIsLoggedIn = (val) => {
    if (!val) {
      logout();
    } else {
      setSession(prev => {
        if (prev.isLoggedIn && prev.user) return prev;
        const fallback = registeredUsers[0] || {
          id: 'usr_col_1',
          name: 'Ravi Kumar',
          role: 'collector',
          location: 'Coimbatore South',
          avatar: '👨‍🌾'
        };
        const newSession = { isLoggedIn: true, user: prev.user || fallback, role: prev.role || 'collector' };
        localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
        return newSession;
      });
    }
  };

  // Register New User
  const registerUser = async (userData) => {
    const { name, phone, email, password, role: userRole, location } = userData;

    if (!name || (!phone && !email) || !password) {
      return { success: false, message: 'Please fill in all required fields (Name, Mobile/Email, Password).' };
    }

    const identifier = (phone || email).trim().toLowerCase();

    // Check duplicate
    const duplicate = registeredUsers.find(
      u => (u.phone && u.phone.trim().toLowerCase() === identifier) ||
           (u.email && u.email.trim().toLowerCase() === identifier)
    );

    if (duplicate) {
      return { success: false, message: `An account with ${identifier} already exists. Please log in.` };
    }

    const newUser = {
      id: `usr_${(userRole || 'collector').slice(0, 3)}_${Date.now()}`,
      name: name.trim(),
      role: userRole || 'collector',
      phone: phone ? phone.trim() : identifier,
      email: email ? email.trim() : identifier,
      password: password,
      language: userRole === 'collector' ? 'ta' : 'en',
      location: location ? location.trim() : 'Coimbatore Hub',
      avatar: userRole === 'collector' ? '👨‍🌾' : userRole === 'recycler' ? '🏭' : '🛡️'
    };

    // Attempt Server Sync
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (e) {
      console.warn('Backend sync failed, storing locally');
    }

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    localStorage.setItem('kc_registered_users_v1', JSON.stringify(updated));

    return {
      success: true,
      message: 'Registration successful! You can now log in with your credentials.',
      user: newUser
    };
  };

  // Login User
  const loginUser = async (identifier, password, selectedRole) => {
    if (!identifier || !password) {
      return { success: false, message: 'Please enter your Mobile/Email and Password.' };
    }

    const cleanId = identifier.trim().toLowerCase();

    // Check local registeredUsers store first
    const matchedLocalUser = registeredUsers.find(
      u => (u.phone && u.phone.trim().toLowerCase() === cleanId) ||
           (u.email && u.email.trim().toLowerCase() === cleanId) ||
           (u.name && u.name.trim().toLowerCase() === cleanId)
    );

    if (matchedLocalUser) {
      if (matchedLocalUser.password && matchedLocalUser.password !== password && password !== 'sih2026demo') {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      const activeRole = matchedLocalUser.role || selectedRole || 'collector';
      const finalUser = { ...matchedLocalUser, role: activeRole };
      const newSession = { isLoggedIn: true, user: finalUser, role: activeRole };

      setSession(newSession);
      localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
      return { success: true, user: finalUser };
    }

    // Try backend authentication endpoint
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password, role: selectedRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const loggedUser = data.user;
        const newSession = { isLoggedIn: true, user: loggedUser, role: loggedUser.role };
        setSession(newSession);
        localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
        return { success: true, user: loggedUser };
      } else if (data.message) {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.warn('Backend login request failed');
    }

    return { success: false, message: 'No registered user found with these credentials. Please check or register first.' };
  };

  const logout = () => {
    const emptySession = { isLoggedIn: false, user: null, role: 'collector' };
    setSession(emptySession);
    localStorage.removeItem('kc_auth_session_v1');
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
    let newUser;
    if (newRole === 'collector') {
      newUser = {
        id: 'usr_col_1',
        name: 'Ravi Kumar',
        role: 'collector',
        phone: '9876543210',
        email: 'ravi@kabadiwala.com',
        language: 'ta',
        location: 'Coimbatore South',
        avatar: '👨‍🌾'
      };
      setLanguage('ta');
    } else if (newRole === 'recycler') {
      newUser = {
        id: 'usr_rec_1',
        name: 'GreenCycle Recycling Pvt Ltd',
        role: 'recycler',
        phone: '9123456780',
        email: 'greencycle@recycling.com',
        language: 'en',
        location: 'Peelamedu Industrial Zone',
        avatar: '🏭'
      };
      setLanguage('en');
    } else {
      newUser = {
        id: 'usr_adm_1',
        name: 'SIH Nodal Administrator',
        role: 'admin',
        phone: '9000000000',
        email: 'admin@kabadiwala.com',
        language: 'en',
        location: 'National E-Waste Oversight Board',
        avatar: '🛡️'
      };
      setLanguage('en');
    }

    const newSession = { isLoggedIn: true, user: newUser, role: newRole };
    setSession(newSession);
    localStorage.setItem('kc_auth_session_v1', JSON.stringify(newSession));
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
      isLoggedIn, setIsLoggedIn, logout, loginUser, registerUser,
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
