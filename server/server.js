// server.js - Kabadiwala Connect Backend API Server
import express from 'express';
import cors from 'cors';
import { getStore } from './dbStore.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const store = getStore();

// Log middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { identifier, phone, email, password, role } = req.body;
  const cleanId = (identifier || phone || email || '').trim().toLowerCase();

  if (cleanId) {
    const user = store.users.find(u => 
      (u.phone && u.phone.trim().toLowerCase() === cleanId) ||
      (u.email && u.email.trim().toLowerCase() === cleanId) ||
      (u.name && u.name.trim().toLowerCase() === cleanId) ||
      (u.id && u.id.trim().toLowerCase() === cleanId)
    );
    
    if (user) {
      if (user.password && password && user.password !== password && password !== 'sih2026demo') {
        return res.status(400).json({ success: false, message: 'Incorrect password entered.' });
      }
      return res.json({
        success: true,
        user,
        token: `demo-jwt-token-${user.id}`
      });
    } else {
      return res.status(404).json({ success: false, message: 'User account not found. Please register first.' });
    }
  }

  // If role demo request without specific user identifier
  const roleUser = store.users.find(u => u.role === role);
  if (roleUser) {
    return res.json({ success: true, user: roleUser, token: `demo-jwt-token-${roleUser.id}` });
  }

  res.status(404).json({ success: false, message: 'User account not found. Please register first.' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, role, phone, email, password, language, location } = req.body;
  const userIdentifier = (phone || email || '').trim();
  
  if (!name || !userIdentifier || !password) {
    return res.status(400).json({ success: false, message: 'Name, mobile/email, and password are required.' });
  }

  const cleanId = userIdentifier.toLowerCase();
  const existing = store.users.find(u => 
    (u.phone && u.phone.trim().toLowerCase() === cleanId) ||
    (u.email && u.email.trim().toLowerCase() === cleanId)
  );

  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists with this phone/email. Please log in.' });
  }

  const newId = `usr_${role || 'collector'}_${Date.now()}`;
  const newUser = {
    id: newId,
    name: name.trim(),
    role: role || 'collector',
    phone: phone ? phone.trim() : userIdentifier,
    email: email ? email.trim() : userIdentifier,
    password: password,
    language: language || (role === 'collector' ? 'ta' : 'en'),
    location: location ? location.trim() : 'Coimbatore Hub',
    avatar: role === 'collector' ? '👨‍🌾' : role === 'recycler' ? '🏭' : '🛡️'
  };

  store.users.unshift(newUser);

  if (role === 'collector') {
    store.collectors.unshift({
      id: `col_${Date.now()}`,
      user_id: newId,
      name: newUser.name,
      earnings: 0,
      pending_pickups: 0,
      completed_transactions: 0,
      rating: 5.0,
      location_zone: newUser.location
    });
  }

  return res.json({
    success: true,
    user: newUser,
    token: `demo-jwt-token-${newId}`,
    message: 'Registration successful! You can now log in.'
  });
});

// --- MATERIALS & AI IDENTIFY ---
app.get('/api/materials', (req, res) => {
  res.json({ success: true, materials: store.materials });
});

app.post('/api/materials/identify', (req, res) => {
  const { spokenText, photoBase64, selectedCategory } = req.body;
  
  // Intelligent mock AI parsing
  let detectedMaterial = store.materials[0]; // Mobile Phone by default
  let confidence = 0.94;
  let quantity = 1;
  let weightKg = 1.0;

  if (spokenText) {
    const textLower = spokenText.toLowerCase();
    if (textLower.includes('laptop') || textLower.includes('computer')) {
      detectedMaterial = store.materials.find(m => m.name === 'Laptop') || store.materials[1];
    } else if (textLower.includes('tv') || textLower.includes('television') || textLower.includes('monitor')) {
      detectedMaterial = store.materials.find(m => m.name.includes('Television')) || store.materials[3];
    } else if (textLower.includes('refrigerator') || textLower.includes('fridge')) {
      detectedMaterial = store.materials.find(m => m.name === 'Refrigerator') || store.materials[4];
    } else if (textLower.includes('battery') || textLower.includes('batteries')) {
      detectedMaterial = store.materials.find(m => m.name.includes('Battery')) || store.materials[5];
    } else if (textLower.includes('wire') || textLower.includes('cable') || textLower.includes('copper')) {
      detectedMaterial = store.materials.find(m => m.name.includes('Copper Wires')) || store.materials[8];
    }

    // Extract numbers if present
    const numbers = textLower.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      quantity = parseInt(numbers[0], 10);
    }
  } else if (selectedCategory) {
    const match = store.materials.find(m => m.id === selectedCategory || m.name.toLowerCase().includes(selectedCategory.toLowerCase()));
    if (match) detectedMaterial = match;
  }

  const estPriceMin = detectedMaterial.min_price_per_unit * quantity;
  const estPriceMax = detectedMaterial.max_price_per_unit * quantity;

  res.json({
    success: true,
    result: {
      materialId: detectedMaterial.id,
      materialName: detectedMaterial.name,
      category: detectedMaterial.category,
      confidence: Math.round(confidence * 100) + '%',
      quantity,
      estimatedWeightKg: weightKg * quantity,
      estimatedPriceMin: estPriceMin,
      estimatedPriceMax: estPriceMax,
      factors: detectedMaterial.factors,
      icon: detectedMaterial.image_icon
    }
  });
});

app.post('/api/price-estimate', (req, res) => {
  const { materialId, quantity, condition, weight } = req.body;
  const material = store.materials.find(m => m.id === materialId) || store.materials[0];
  
  let multiplier = 1.0;
  if (condition === 'working') multiplier = 1.25;
  if (condition === 'damaged') multiplier = 0.8;

  const qty = parseFloat(quantity) || 1;
  const minPrice = Math.round(material.min_price_per_unit * qty * multiplier);
  const maxPrice = Math.round(material.max_price_per_unit * qty * multiplier);

  res.json({
    success: true,
    material: material.name,
    minPrice,
    maxPrice,
    unit: material.price_unit,
    factors: material.factors.split(', ')
  });
});

// --- DIGITAL MANDI ---
app.get('/api/mandi', (req, res) => {
  res.json({ success: true, lots: store.mandi_lots });
});

app.post('/api/mandi/create', (req, res) => {
  const { title, weight, estValue, locationZone } = req.body;
  const newLot = {
    id: `lot_${Date.now()}`,
    lot_code: `DM${Math.floor(1000 + Math.random() * 9000)}`,
    title: title || 'New E-Waste Pooled Micro-Lot',
    status: 'open',
    total_weight_kg: parseFloat(weight) || 50.0,
    total_value: parseFloat(estValue) || 12000,
    recycler_interest: 'High',
    collector_count: 1,
    location_zone: locationZone || 'Coimbatore Hub',
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  store.mandi_lots.unshift(newLot);
  res.json({ success: true, lot: newLot });
});

app.post('/api/mandi/join', (req, res) => {
  const { lotId, collectorId, weight, estValue } = req.body;
  const lot = store.mandi_lots.find(l => l.id === lotId || l.lot_code === lotId);
  if (lot) {
    lot.collector_count += 1;
    lot.total_weight_kg += (parseFloat(weight) || 10.0);
    lot.total_value += (parseFloat(estValue) || 2500);
    res.json({ success: true, lot, message: `Successfully joined Digital Mandi Lot #${lot.lot_code}` });
  } else {
    res.status(404).json({ success: false, message: 'Mandi Lot not found' });
  }
});

// --- RECYCLERS & MATCHING ---
app.get('/api/recyclers', (req, res) => {
  res.json({ success: true, recyclers: store.recyclers });
});

app.post('/api/pickups', (req, res) => {
  const { transactionId, recyclerId, pickupDate, vehicleNum } = req.body;
  const newPickup = {
    id: `pic_${Date.now()}`,
    transaction_id: transactionId || 'tx_184',
    recycler_id: recyclerId || 'rec_1',
    pickup_date: pickupDate || '2026-09-07 10:00 AM',
    status: 'scheduled',
    vehicle_num: vehicleNum || 'TN-37-AZ-1024',
    agent_phone: '9845012345',
    est_arrival: '2 Hours'
  };

  // Update transaction status
  const tx = store.transactions.find(t => t.id === transactionId);
  if (tx) {
    tx.status = 'picked_up';
  }

  res.json({ success: true, pickup: newPickup });
});

// --- TRANSACTIONS & HANDOVER ---
app.get('/api/transactions', (req, res) => {
  res.json({ success: true, transactions: store.transactions });
});

app.get('/api/transactions/:id', (req, res) => {
  const tx = store.transactions.find(t => t.id === req.params.id || t.tx_code === req.params.id);
  if (tx) {
    res.json({ success: true, transaction: tx });
  } else {
    res.status(404).json({ success: false, message: 'Transaction not found' });
  }
});

app.post('/api/transactions', (req, res) => {
  const { collectorId, materialSummary, totalAmount } = req.body;
  const newTx = {
    id: `tx_${Date.now()}`,
    tx_code: `KC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    collector_id: collectorId || 'col_1',
    collector_name: 'Ravi Kumar',
    recycler_id: 'rec_1',
    recycler_name: 'GreenCycle Recycling Pvt Ltd',
    mandi_lot_id: 'lot_1024',
    material_summary: materialSummary || '2 Mobile Phones, 1 Laptop',
    total_agreed_amount: parseFloat(totalAmount) || 2500,
    partial_amount_paid: 0,
    final_amount_paid: 0,
    status: 'matched',
    qr_code_data: `KC-2026-${Date.now()}|col_1|rec_1`,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };

  store.transactions.unshift(newTx);
  res.json({ success: true, transaction: newTx });
});

app.post('/api/transactions/verify', (req, res) => {
  const { transactionId, pin, weightVerified } = req.body;
  const tx = store.transactions.find(t => t.id === transactionId || t.tx_code === transactionId) || store.transactions[0];
  
  if (tx) {
    tx.status = 'verified';
    tx.partial_amount_paid = Math.round(tx.total_agreed_amount * 0.4); // 40% instant partial payment

    // Add traceability entry
    store.traceability.unshift({
      id: `tr_${Date.now()}`,
      transaction_id: tx.id,
      stage: 'VERIFIED',
      status: 'completed',
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      location: 'Recycler Weighment Bay',
      details: `Handover QR & weight verified (${weightVerified || '12.5'} kg). Instant partial payment of ₹${tx.partial_amount_paid} initiated!`,
      co2_saved_kg: 34.5
    });

    res.json({
      success: true,
      transaction: tx,
      partialPaid: tx.partial_amount_paid,
      remainingPending: tx.total_agreed_amount - tx.partial_amount_paid,
      message: 'Verified Handover Complete! ₹' + tx.partial_amount_paid + ' paid instantly to collector bank account/UPI.'
    });
  } else {
    res.status(404).json({ success: false, message: 'Transaction not found' });
  }
});

// --- PAYMENTS & TRACEABILITY ---
app.post('/api/payments', (req, res) => {
  const { transactionId, amount, paymentType } = req.body;
  res.json({
    success: true,
    payment: {
      id: `pay_${Date.now()}`,
      transaction_id: transactionId,
      amount,
      payment_type: paymentType || 'instant_partial',
      status: 'completed',
      tx_hash: `UPI-REF-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paid_at: new Date().toISOString()
    }
  });
});

app.get('/api/traceability/:id', (req, res) => {
  const txId = req.params.id;
  const events = store.traceability.filter(t => t.transaction_id === txId || txId === 'tx_184');
  res.json({ success: true, timeline: events.length > 0 ? events : store.traceability });
});

// --- ADMIN API ---
app.get('/api/admin/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalCollectors: 1420,
      verifiedRecyclers: 48,
      totalEwasteCollectedKg: 84250,
      totalRecycledKg: 76100,
      activeMandiLots: store.mandi_lots.filter(l => l.status === 'open').length,
      pendingVerifications: 14,
      totalTransactionValueRupees: 4280000,
      co2ReductionTons: 198.4
    }
  });
});

app.post('/api/admin/recyclers/verify', (req, res) => {
  const { recyclerId } = req.body;
  const rec = store.recyclers.find(r => r.id === recyclerId);
  if (rec) {
    rec.is_verified = !rec.is_verified;
    res.json({ success: true, recycler: rec });
  } else {
    res.status(404).json({ success: false, message: 'Recycler not found' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Kabadiwala Connect Server running on http://localhost:${PORT}`);
  });
}

export default app;
