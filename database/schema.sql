-- Database Schema for Kabadiwala Connect (SIH 2026)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('collector', 'recycler', 'admin')) NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  location TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collectors (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  earnings REAL DEFAULT 0,
  pending_pickups INTEGER DEFAULT 0,
  completed_transactions INTEGER DEFAULT 0,
  rating REAL DEFAULT 4.8,
  location_zone TEXT DEFAULT 'Coimbatore South'
);

CREATE TABLE IF NOT EXISTS recyclers (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  company_name TEXT NOT NULL,
  is_verified INTEGER DEFAULT 1,
  capacity_kg REAL DEFAULT 5000,
  location_zone TEXT DEFAULT 'Peelamedu Industrial Zone',
  price_multiplier REAL DEFAULT 1.05
);

CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  min_price_per_unit REAL NOT NULL,
  max_price_per_unit REAL NOT NULL,
  price_unit TEXT DEFAULT 'piece',
  image_icon TEXT,
  description TEXT,
  factors TEXT
);

CREATE TABLE IF NOT EXISTS ewaste_items (
  id TEXT PRIMARY KEY,
  collector_id TEXT REFERENCES collectors(id),
  material_id TEXT REFERENCES materials(id),
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  est_weight_kg REAL DEFAULT 1.0,
  est_price_min REAL NOT NULL,
  est_price_max REAL NOT NULL,
  status TEXT DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mandi_lots (
  id TEXT PRIMARY KEY,
  lot_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  total_weight_kg REAL DEFAULT 0,
  total_value REAL DEFAULT 0,
  recycler_interest TEXT DEFAULT 'High',
  collector_count INTEGER DEFAULT 1,
  recycler_id TEXT REFERENCES recyclers(id),
  location_zone TEXT DEFAULT 'Coimbatore Hub',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mandi_lot_items (
  id TEXT PRIMARY KEY,
  mandi_lot_id TEXT REFERENCES mandi_lots(id),
  item_id TEXT REFERENCES ewaste_items(id),
  collector_id TEXT REFERENCES collectors(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  tx_code TEXT UNIQUE NOT NULL,
  collector_id TEXT REFERENCES collectors(id),
  recycler_id TEXT REFERENCES recyclers(id),
  mandi_lot_id TEXT REFERENCES mandi_lots(id),
  material_summary TEXT NOT NULL,
  total_agreed_amount REAL NOT NULL,
  partial_amount_paid REAL DEFAULT 0,
  final_amount_paid REAL DEFAULT 0,
  status TEXT DEFAULT 'matched',
  qr_code_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pickups (
  id TEXT PRIMARY KEY,
  transaction_id TEXT REFERENCES transactions(id),
  recycler_id TEXT REFERENCES recyclers(id),
  pickup_date TEXT,
  status TEXT DEFAULT 'scheduled',
  vehicle_num TEXT,
  agent_phone TEXT,
  est_arrival TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  transaction_id TEXT REFERENCES transactions(id),
  amount REAL NOT NULL,
  payment_type TEXT CHECK(payment_type IN ('instant_partial', 'final_settlement')) NOT NULL,
  status TEXT DEFAULT 'completed',
  tx_hash TEXT,
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traceability (
  id TEXT PRIMARY KEY,
  transaction_id TEXT REFERENCES transactions(id),
  stage TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location TEXT,
  details TEXT,
  co2_saved_kg REAL DEFAULT 0
);
