-- Seed Data for Kabadiwala Connect (SIH 2026)

-- USERS
INSERT OR REPLACE INTO users (id, name, role, phone, language, location, avatar) VALUES
('usr_col_1', 'Ravi Kumar', 'collector', '9876543210', 'ta', 'Coimbatore South', '👨‍🌾'),
('usr_col_2', 'Selvam M', 'collector', '9876543211', 'ta', 'Gandhipuram, Coimbatore', '👨‍🌾'),
('usr_col_3', 'Anitha Devi', 'collector', '9876543212', 'hi', 'Peelamedu, Coimbatore', '👩‍🌾'),
('usr_col_4', 'Rajesh Sharma', 'collector', '9876543213', 'hi', 'R.S. Puram, Coimbatore', '👨‍🌾'),
('usr_col_5', 'Suresh K', 'collector', '9876543214', 'en', 'Singanallur, Coimbatore', '👨‍🌾'),
('usr_col_6', 'Priya Raman', 'collector', '9876543215', 'ta', 'Tukdev Nagar', '👩‍🌾'),
('usr_col_7', 'Murugan V', 'collector', '9876543216', 'ta', 'Podanur Hub', '👨‍🌾'),
('usr_col_8', 'Lakshmi B', 'collector', '9876543217', 'ta', 'Ukkadam Market', '👩‍🌾'),
('usr_col_9', 'Kumar S', 'collector', '9876543218', 'en', 'Saibaba Colony', '👨‍🌾'),
('usr_col_10', 'Vijay Narain', 'collector', '9876543219', 'hi', 'Saravanampatti', '👨‍🌾'),

('usr_rec_1', 'GreenCycle Recycling Pvt Ltd', 'recycler', '9123456780', 'en', 'Peelamedu Industrial Zone', '🏭'),
('usr_rec_2', 'EcoVolt E-Waste Solutions', 'recycler', '9123456781', 'en', 'SIDCO Industrial Estate', '🏭'),
('usr_rec_3', 'EarthMelt Metals & E-Recycling', 'recycler', '9123456782', 'en', 'Kurichi Industrial Belt', '🏢'),
('usr_rec_4', 'CleanTech Recyclers India', 'recycler', '9123456783', 'en', 'Thudiyalur E-Hub', '🏭'),
('usr_rec_5', 'TamilNadu GreenCycle Hub', 'recycler', '9123456784', 'ta', 'Eachanari Zone', '🏬'),

('usr_adm_1', 'SIH Nodal Administrator', 'admin', '9000000000', 'en', 'National E-Waste Oversight Board', '🛡️');

-- COLLECTORS
INSERT OR REPLACE INTO collectors (id, user_id, earnings, pending_pickups, completed_transactions, rating, location_zone) VALUES
('col_1', 'usr_col_1', 14500, 2, 18, 4.9, 'Coimbatore South'),
('col_2', 'usr_col_2', 9200, 1, 12, 4.7, 'Gandhipuram'),
('col_3', 'usr_col_3', 18400, 3, 24, 4.8, 'Peelamedu'),
('col_4', 'usr_col_4', 6300, 0, 8, 4.6, 'R.S. Puram'),
('col_5', 'usr_col_5', 12100, 1, 15, 4.9, 'Singanallur'),
('col_6', 'usr_col_6', 8900, 1, 10, 4.7, 'Tukdev Nagar'),
('col_7', 'usr_col_7', 15600, 2, 21, 4.8, 'Podanur Hub'),
('col_8', 'usr_col_8', 7400, 0, 9, 4.5, 'Ukkadam Market'),
('col_9', 'usr_col_9', 21000, 2, 28, 5.0, 'Saibaba Colony'),
('col_10', 'usr_col_10', 11300, 1, 14, 4.8, 'Saravanampatti');

-- RECYCLERS
INSERT OR REPLACE INTO recyclers (id, user_id, company_name, is_verified, capacity_kg, location_zone, price_multiplier) VALUES
('rec_1', 'usr_rec_1', 'GreenCycle Recycling Pvt Ltd', 1, 10000, 'Peelamedu Industrial Zone', 1.08),
('rec_2', 'usr_rec_2', 'EcoVolt E-Waste Solutions', 1, 7500, 'SIDCO Industrial Estate', 1.05),
('rec_3', 'usr_rec_3', 'EarthMelt Metals & E-Recycling', 1, 12000, 'Kurichi Industrial Belt', 1.10),
('rec_4', 'usr_rec_4', 'CleanTech Recyclers India', 1, 5000, 'Thudiyalur E-Hub', 1.04),
('rec_5', 'usr_rec_5', 'TamilNadu GreenCycle Hub', 1, 8500, 'Eachanari Zone', 1.06);

-- MATERIALS
INSERT OR REPLACE INTO materials (id, name, category, min_price_per_unit, max_price_per_unit, price_unit, image_icon, description, factors) VALUES
('mat_1', 'Mobile Phone', 'Consumer Electronics', 400, 600, 'piece', '📱', 'Old smartphones, feature phones, touchscreens', 'Working condition, Battery health, Screen damage, PCB grade'),
('mat_2', 'Laptop', 'Computing', 1500, 3500, 'piece', '💻', 'Old & damaged laptops, notebooks', 'Processor age, Motherboard condition, RAM/SSD intact, Battery status'),
('mat_3', 'Desktop Tower', 'Computing', 1200, 2800, 'piece', '🖥️', 'CPU towers, PC cases, server boxes', 'Power supply unit, SMPS weight, Motherboard copper content'),
('mat_4', 'Television / Monitor', 'Displays', 600, 1800, 'piece', '📺', 'CRT, LCD, LED TVs and computer monitors', 'Display panel status, Copper deflection yoke, Cabinet material'),
('mat_5', 'Refrigerator', 'Home Appliances', 1800, 4200, 'piece', '🧊', 'Single/Double door refrigerators', 'Compressor working state, Copper coil weight, Metal casing'),
('mat_6', 'Battery (Li-ion/Lead)', 'Power Storage', 80, 150, 'kg', '🔋', 'UPS batteries, e-bike batteries, phone batteries', 'Battery chemistry (Li-ion/Lead-acid), Weight, Terminal corrosion'),
('mat_7', 'Circuit Board (PCB)', 'Components', 250, 650, 'kg', '🔌', 'Green/Blue motherboards, telecom boards', 'Gold pin density, IC chip count, Board layer count'),
('mat_8', 'Charger & Adapter', 'Accessories', 30, 80, 'piece', '🔌', 'Mobile chargers, laptop adapters, power bricks', 'Copper wire length, Transformer weight, Working status'),
('mat_9', 'Copper Wires & Cables', 'Wiring', 300, 550, 'kg', '🧵', 'Insulated electrical & network wires', 'Purity grade (99.9% Cu), Wire thickness, Insulation type'),
('mat_10', 'Printer / Scanner', 'Office Equipment', 500, 1200, 'piece', '🖨️', 'Inkjet, Laserjet printers, all-in-one scanners', 'Motor weight, Cartridge presence, Circuit board status');

-- MANDI LOTS
INSERT OR REPLACE INTO mandi_lots (id, lot_code, title, status, total_weight_kg, total_value, recycler_interest, collector_count, recycler_id, location_zone, created_at) VALUES
('lot_1024', 'DM1024', 'Coimbatore South E-Waste Micro-Lot', 'open', 126.5, 28500, 'High', 8, 'rec_1', 'Peelamedu Hub', '2026-09-05 10:00:00'),
('lot_1025', 'DM1025', 'Gandhipuram PCB & Battery Bulk Lot', 'open', 210.0, 45200, 'Very High', 12, 'rec_2', 'Gandhipuram Hub', '2026-09-05 11:30:00'),
('lot_1026', 'DM1026', 'Singanallur Appliance Scrap Pool', 'matched', 340.0, 68000, 'High', 6, 'rec_1', 'Singanallur Industrial', '2026-09-04 14:15:00'),
('lot_1027', 'DM1027', 'RS Puram IT Hardware Consolidated Lot', 'open', 85.0, 22400, 'Medium', 5, 'rec_3', 'RS Puram West', '2026-09-06 08:45:00'),
('lot_1028', 'DM1028', 'Podanur Mixed Wire & Charger Lot', 'open', 95.0, 14800, 'High', 7, 'rec_4', 'Podanur Station Road', '2026-09-06 09:15:00'),
('lot_1029', 'DM1029', 'Saravanampatti Telecom & Mobiles Pool', 'matched', 140.0, 39500, 'Very High', 9, 'rec_3', 'IT Corridor Hub', '2026-09-03 16:20:00'),
('lot_1030', 'DM1030', 'Ukkadam Heavy Appliance Lot', 'closed', 520.0, 92000, 'High', 15, 'rec_5', 'Ukkadam Junction', '2026-09-02 12:00:00'),
('lot_1031', 'DM1031', 'Saibaba Colony Display Panels Lot', 'open', 110.0, 24600, 'Medium', 4, 'rec_2', 'Saibaba Hub', '2026-09-06 10:00:00');

-- TRANSACTIONS
INSERT OR REPLACE INTO transactions (id, tx_code, collector_id, recycler_id, mandi_lot_id, material_summary, total_agreed_amount, partial_amount_paid, final_amount_paid, status, qr_code_data, created_at) VALUES
('tx_184', 'KC-2026-000184', 'col_1', 'rec_1', 'lot_1024', '2 Mobile Phones, 1 Laptop', 2500, 1000, 0, 'picked_up', 'KC-2026-000184|col_1|rec_1|2500', '2026-09-05 14:00:00'),
('tx_185', 'KC-2026-000185', 'col_2', 'rec_2', 'lot_1025', '15 kg Copper Wire, 5 PCBs', 4800, 2000, 2800, 'verified', 'KC-2026-000185|col_2|rec_2|4800', '2026-09-05 15:30:00'),
('tx_186', 'KC-2026-000186', 'col_3', 'rec_1', 'lot_1026', '1 Refrigerator, 2 CRT Monitors', 5400, 2500, 2900, 'recycled', 'KC-2026-000186|col_3|rec_1|5400', '2026-09-04 16:00:00'),
('tx_187', 'KC-2026-000187', 'col_4', 'rec_3', 'lot_1027', '3 Laptops, 2 Printers', 8200, 3000, 0, 'matched', 'KC-2026-000187|col_4|rec_3|8200', '2026-09-06 09:00:00'),
('tx_188', 'KC-2026-000188', 'col_5', 'rec_4', 'lot_1028', '20 kg Li-ion Batteries', 2400, 1000, 1400, 'recycled', 'KC-2026-000188|col_5|rec_4|2400', '2026-09-03 11:00:00');

-- TRACEABILITY
INSERT OR REPLACE INTO traceability (id, transaction_id, stage, status, updated_at, location, details, co2_saved_kg) VALUES
('tr_1', 'tx_184', 'COLLECTED', 'completed', '2026-09-05 14:00:00', 'Coimbatore South', 'Registered via Voice Assistant by Ravi Kumar', 4.2),
('tr_2', 'tx_184', 'POOLED', 'completed', '2026-09-05 14:30:00', 'Digital Mandi Hub #DM1024', 'Combined with 7 other local lots into 126.5 kg lot', 12.8),
('tr_3', 'tx_184', 'MATCHED', 'completed', '2026-09-05 15:00:00', 'Peelamedu Recycler Hub', 'Matched with GreenCycle Recycling Pvt Ltd', 15.0),
('tr_4', 'tx_184', 'PICKED UP', 'completed', '2026-09-06 10:15:00', 'Ravi Kumar Collection Point', 'Logistics agent arrived via EV van TN-37-AZ-1024', 22.5),
('tr_5', 'tx_184', 'VERIFIED', 'in_progress', '2026-09-06 11:00:00', 'GreenCycle Weighment Facility', 'QR verified & instant partial payment of ₹1,000 released', 28.0),
('tr_6', 'tx_184', 'GRADED', 'pending', '2026-09-06 14:00:00', 'GreenCycle Lab', 'XRF Spectrometer metal extraction analysis', 0),
('tr_7', 'tx_184', 'RECYCLED', 'pending', '2026-09-07 09:00:00', 'Formal Recycling Plant', 'Smelted & copper/gold extracted safely without burning', 0);
