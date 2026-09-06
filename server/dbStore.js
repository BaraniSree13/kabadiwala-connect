// dbStore.js - Database engine for Kabadiwala Connect
import fs from 'fs';
import path from 'path';

// Memory database preloaded with rich seed data
const store = {
  users: [
    { id: 'usr_col_1', name: 'Ravi Kumar', role: 'collector', phone: '9876543210', language: 'ta', location: 'Coimbatore South', avatar: '👨‍🌾' },
    { id: 'usr_col_2', name: 'Selvam M', role: 'collector', phone: '9876543211', language: 'ta', location: 'Gandhipuram, Coimbatore', avatar: '👨‍🌾' },
    { id: 'usr_col_3', name: 'Anitha Devi', role: 'collector', phone: '9876543212', language: 'hi', location: 'Peelamedu, Coimbatore', avatar: '👩‍🌾' },
    { id: 'usr_col_4', name: 'Rajesh Sharma', role: 'collector', phone: '9876543213', language: 'hi', location: 'R.S. Puram, Coimbatore', avatar: '👨‍🌾' },
    { id: 'usr_col_5', name: 'Suresh K', role: 'collector', phone: '9876543214', language: 'en', location: 'Singanallur, Coimbatore', avatar: '👨‍🌾' },
    { id: 'usr_rec_1', name: 'GreenCycle Recycling Pvt Ltd', role: 'recycler', phone: '9123456780', language: 'en', location: 'Peelamedu Industrial Zone', avatar: '🏭' },
    { id: 'usr_rec_2', name: 'EcoVolt E-Waste Solutions', role: 'recycler', phone: '9123456781', language: 'en', location: 'SIDCO Industrial Estate', avatar: '🏭' },
    { id: 'usr_rec_3', name: 'EarthMelt Metals & E-Recycling', role: 'recycler', phone: '9123456782', language: 'en', location: 'Kurichi Industrial Belt', avatar: '🏢' },
    { id: 'usr_adm_1', name: 'SIH Nodal Administrator', role: 'admin', phone: '9000000000', language: 'en', location: 'National E-Waste Oversight Board', avatar: '🛡️' }
  ],

  collectors: [
    { id: 'col_1', user_id: 'usr_col_1', name: 'Ravi Kumar', earnings: 14500, pending_pickups: 2, completed_transactions: 18, rating: 4.9, location_zone: 'Coimbatore South' },
    { id: 'col_2', user_id: 'usr_col_2', name: 'Selvam M', earnings: 9200, pending_pickups: 1, completed_transactions: 12, rating: 4.7, location_zone: 'Gandhipuram' },
    { id: 'col_3', user_id: 'usr_col_3', name: 'Anitha Devi', earnings: 18400, pending_pickups: 3, completed_transactions: 24, rating: 4.8, location_zone: 'Peelamedu' },
    { id: 'col_4', user_id: 'usr_col_4', name: 'Rajesh Sharma', earnings: 6300, pending_pickups: 0, completed_transactions: 8, rating: 4.6, location_zone: 'R.S. Puram' },
    { id: 'col_5', user_id: 'usr_col_5', name: 'Suresh K', earnings: 12100, pending_pickups: 1, completed_transactions: 15, rating: 4.9, location_zone: 'Singanallur' }
  ],

  recyclers: [
    { id: 'rec_1', user_id: 'usr_rec_1', company_name: 'GreenCycle Recycling Pvt Ltd', is_verified: true, capacity_kg: 10000, location_zone: 'Peelamedu Industrial Zone', price_multiplier: 1.08 },
    { id: 'rec_2', user_id: 'usr_rec_2', company_name: 'EcoVolt E-Waste Solutions', is_verified: true, capacity_kg: 7500, location_zone: 'SIDCO Industrial Estate', price_multiplier: 1.05 },
    { id: 'rec_3', user_id: 'usr_rec_3', company_name: 'EarthMelt Metals & E-Recycling', is_verified: true, capacity_kg: 12000, location_zone: 'Kurichi Industrial Belt', price_multiplier: 1.10 },
    { id: 'rec_4', user_id: 'usr_rec_4', company_name: 'CleanTech Recyclers India', is_verified: true, capacity_kg: 5000, location_zone: 'Thudiyalur E-Hub', price_multiplier: 1.04 },
    { id: 'rec_5', user_id: 'usr_rec_5', company_name: 'TamilNadu GreenCycle Hub', is_verified: false, capacity_kg: 8500, location_zone: 'Eachanari Zone', price_multiplier: 1.06 }
  ],

  materials: [
    { id: 'mat_1', name: 'Mobile Phone', category: 'Consumer Electronics', min_price_per_unit: 400, max_price_per_unit: 600, price_unit: 'piece', image_icon: '📱', description: 'Old smartphones, feature phones, touchscreens', factors: 'Working condition, Battery health, Screen damage, PCB grade' },
    { id: 'mat_2', name: 'Laptop', category: 'Computing', min_price_per_unit: 1500, max_price_per_unit: 3500, price_unit: 'piece', image_icon: '💻', description: 'Old & damaged laptops, notebooks', factors: 'Processor age, Motherboard condition, RAM/SSD intact, Battery status' },
    { id: 'mat_3', name: 'Desktop Tower', category: 'Computing', min_price_per_unit: 1200, max_price_per_unit: 2800, price_unit: 'piece', image_icon: '🖥️', description: 'CPU towers, PC cases, server boxes', factors: 'Power supply unit, SMPS weight, Motherboard copper content' },
    { id: 'mat_4', name: 'Television / Monitor', category: 'Displays', min_price_per_unit: 600, max_price_per_unit: 1800, price_unit: 'piece', image_icon: '📺', description: 'CRT, LCD, LED TVs and computer monitors', factors: 'Display panel status, Copper deflection yoke, Cabinet material' },
    { id: 'mat_5', name: 'Refrigerator', category: 'Home Appliances', min_price_per_unit: 1800, max_price_per_unit: 4200, price_unit: 'piece', image_icon: '🧊', description: 'Single/Double door refrigerators', factors: 'Compressor working state, Copper coil weight, Metal casing' },
    { id: 'mat_6', name: 'Battery (Li-ion/Lead)', category: 'Power Storage', min_price_per_unit: 80, max_price_per_unit: 150, price_unit: 'kg', image_icon: '🔋', description: 'UPS batteries, e-bike batteries, phone batteries', factors: 'Battery chemistry (Li-ion/Lead-acid), Weight, Terminal corrosion' },
    { id: 'mat_7', name: 'Circuit Board (PCB)', category: 'Components', min_price_per_unit: 250, max_price_per_unit: 650, price_unit: 'kg', image_icon: '🔌', description: 'Green/Blue motherboards, telecom boards', factors: 'Gold pin density, IC chip count, Board layer count' },
    { id: 'mat_8', name: 'Charger & Adapter', category: 'Accessories', min_price_per_unit: 30, max_price_per_unit: 80, price_unit: 'piece', image_icon: '🔌', description: 'Mobile chargers, laptop adapters, power bricks', factors: 'Copper wire length, Transformer weight, Working status' },
    { id: 'mat_9', name: 'Copper Wires & Cables', category: 'Wiring', min_price_per_unit: 300, max_price_per_unit: 550, price_unit: 'kg', image_icon: '🧵', description: 'Insulated electrical & network wires', factors: 'Purity grade (99.9% Cu), Wire thickness, Insulation type' },
    { id: 'mat_10', name: 'Printer / Scanner', category: 'Office Equipment', min_price_per_unit: 500, max_price_per_unit: 1200, price_unit: 'piece', image_icon: '🖨️', description: 'Inkjet, Laserjet printers, all-in-one scanners', factors: 'Motor weight, Cartridge presence, Circuit board status' }
  ],

  ewaste_items: [
    { id: 'item_1', collector_id: 'col_1', material_id: 'mat_1', name: '2 Mobile Phones', quantity: 2, est_weight_kg: 0.4, est_price_min: 800, est_price_max: 1200, status: 'in_mandi', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', created_at: '2026-09-05 10:00:00' },
    { id: 'item_2', collector_id: 'col_1', material_id: 'mat_2', name: '1 Laptop (Dell Inspiron)', quantity: 1, est_weight_kg: 2.2, est_price_min: 1500, est_price_max: 2500, status: 'in_mandi', image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300', created_at: '2026-09-05 10:15:00' },
    { id: 'item_3', collector_id: 'col_2', material_id: 'mat_9', name: '15 kg Copper Wires', quantity: 15, est_weight_kg: 15.0, est_price_min: 4500, est_price_max: 8250, status: 'matched', image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300', created_at: '2026-09-05 11:30:00' }
  ],

  mandi_lots: [
    { id: 'lot_1024', lot_code: 'DM1024', title: 'Coimbatore South E-Waste Micro-Lot', status: 'open', total_weight_kg: 126.5, total_value: 28500, recycler_interest: 'High', collector_count: 8, recycler_id: 'rec_1', location_zone: 'Peelamedu Hub', created_at: '2026-09-05 10:00:00' },
    { id: 'lot_1025', lot_code: 'DM1025', title: 'Gandhipuram PCB & Battery Bulk Lot', status: 'open', total_weight_kg: 210.0, total_value: 45200, recycler_interest: 'Very High', collector_count: 12, recycler_id: 'rec_2', location_zone: 'Gandhipuram Hub', created_at: '2026-09-05 11:30:00' },
    { id: 'lot_1026', lot_code: 'DM1026', title: 'Singanallur Appliance Scrap Pool', status: 'matched', total_weight_kg: 340.0, total_value: 68000, recycler_interest: 'High', collector_count: 6, recycler_id: 'rec_1', location_zone: 'Singanallur Industrial', created_at: '2026-09-04 14:15:00' },
    { id: 'lot_1027', lot_code: 'DM1027', title: 'RS Puram IT Hardware Consolidated Lot', status: 'open', total_weight_kg: 85.0, total_value: 22400, recycler_interest: 'Medium', collector_count: 5, recycler_id: 'rec_3', location_zone: 'RS Puram West', created_at: '2026-09-06 08:45:00' },
    { id: 'lot_1028', lot_code: 'DM1028', title: 'Podanur Mixed Wire & Charger Lot', status: 'open', total_weight_kg: 95.0, total_value: 14800, recycler_interest: 'High', collector_count: 7, recycler_id: 'rec_4', location_zone: 'Podanur Station Road', created_at: '2026-09-06 09:15:00' },
    { id: 'lot_1029', lot_code: 'DM1029', title: 'Saravanampatti Telecom & Mobiles Pool', status: 'matched', total_weight_kg: 140.0, total_value: 39500, recycler_interest: 'Very High', collector_count: 9, recycler_id: 'rec_3', location_zone: 'IT Corridor Hub', created_at: '2026-09-03 16:20:00' }
  ],

  transactions: [
    { id: 'tx_184', tx_code: 'KC-2026-000184', collector_id: 'col_1', collector_name: 'Ravi Kumar', recycler_id: 'rec_1', recycler_name: 'GreenCycle Recycling Pvt Ltd', mandi_lot_id: 'lot_1024', material_summary: '2 Mobile Phones, 1 Laptop', total_agreed_amount: 2500, partial_amount_paid: 1000, final_amount_paid: 0, status: 'picked_up', qr_code_data: 'KC-2026-000184|col_1|rec_1|2500', created_at: '2026-09-05 14:00:00' },
    { id: 'tx_185', tx_code: 'KC-2026-000185', collector_id: 'col_2', collector_name: 'Selvam M', recycler_id: 'rec_2', recycler_name: 'EcoVolt E-Waste Solutions', mandi_lot_id: 'lot_1025', material_summary: '15 kg Copper Wire, 5 PCBs', total_agreed_amount: 4800, partial_amount_paid: 2000, final_amount_paid: 2800, status: 'verified', qr_code_data: 'KC-2026-000185|col_2|rec_2|4800', created_at: '2026-09-05 15:30:00' },
    { id: 'tx_186', tx_code: 'KC-2026-000186', collector_id: 'col_3', collector_name: 'Anitha Devi', recycler_id: 'rec_1', recycler_name: 'GreenCycle Recycling Pvt Ltd', mandi_lot_id: 'lot_1026', material_summary: '1 Refrigerator, 2 CRT Monitors', total_agreed_amount: 5400, partial_amount_paid: 2500, final_amount_paid: 2900, status: 'recycled', qr_code_data: 'KC-2026-000186|col_3|rec_1|5400', created_at: '2026-09-04 16:00:00' }
  ],

  traceability: [
    { id: 'tr_1', transaction_id: 'tx_184', stage: 'COLLECTED', status: 'completed', updated_at: '2026-09-05 14:00:00', location: 'Coimbatore South', details: 'Registered via Voice Assistant by Ravi Kumar', co2_saved_kg: 4.2 },
    { id: 'tr_2', transaction_id: 'tx_184', stage: 'POOLED', status: 'completed', updated_at: '2026-09-05 14:30:00', location: 'Digital Mandi Hub #DM1024', details: 'Combined with 7 other local lots into 126.5 kg lot', co2_saved_kg: 12.8 },
    { id: 'tr_3', transaction_id: 'tx_184', stage: 'MATCHED', status: 'completed', updated_at: '2026-09-05 15:00:00', location: 'Peelamedu Recycler Hub', details: 'Matched with GreenCycle Recycling Pvt Ltd', co2_saved_kg: 15.0 },
    { id: 'tr_4', transaction_id: 'tx_184', stage: 'PICKED UP', status: 'completed', updated_at: '2026-09-06 10:15:00', location: 'Ravi Kumar Collection Point', details: 'Logistics agent arrived via EV van TN-37-AZ-1024', co2_saved_kg: 22.5 },
    { id: 'tr_5', transaction_id: 'tx_184', stage: 'VERIFIED', status: 'in_progress', updated_at: '2026-09-06 11:00:00', location: 'GreenCycle Weighment Facility', details: 'QR verified & instant partial payment of ₹1,000 released', co2_saved_kg: 28.0 },
    { id: 'tr_6', transaction_id: 'tx_184', stage: 'GRADED', status: 'pending', updated_at: '2026-09-06 14:00:00', location: 'GreenCycle Lab', details: 'XRF Spectrometer metal extraction analysis', co2_saved_kg: 0 },
    { id: 'tr_7', transaction_id: 'tx_184', stage: 'RECYCLED', status: 'pending', updated_at: '2026-09-07 09:00:00', location: 'Formal Recycling Plant', details: 'Smelted & copper/gold extracted safely without burning', co2_saved_kg: 0 }
  ]
};

export const getStore = () => store;
