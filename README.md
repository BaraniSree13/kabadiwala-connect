# ♻️ Kabadiwala Connect

**Bringing the Informal Collector into the Formal Recycling Chain**

**SIH Problem Statement ID:** SIH26229  
**Theme:** Clean & Green Technology  
**Category:** Software  

---

## 📝 About the Project

**Kabadiwala Connect** is a voice-first, offline-friendly Progressive Web Application (PWA) designed to connect informal e-waste collectors (*kabadiwalas*) directly with CPCB-authorized recyclers. 

The application solves key informal sector challenges—low digital literacy, language barriers, volatile scrap pricing, and fragmented transport logistics—through voice assistance, AI material identification, fair price estimation, Digital Mandi micro-lot pooling, verified handover with instant partial payments, and end-to-end e-waste traceability.

---

## ✨ Key Features

1. **🎙️ Voice-First & Multilingual UI**:
   - Voice assistant supporting **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)** with speech-to-text NLP material and quantity extraction.
2. **🤖 AI-Assisted E-Waste Identification**:
   - Computer vision camera/upload scanner providing confidence score (94%), weight estimate, component breakdown, and price ranges.
3. **📊 Fair-Value Price Estimation**:
   - Transparent pricing engine factoring component working state (+25% working / -25% scrap), metal indices, and recycler demand.
4. **🏪 Digital Mandi Micro-Lot Pooling**:
   - Aggregates small individual e-waste lots (e.g. 2 phones + 1 laptop) into bulk Mandi Lots (#DM1024) to command higher prices and reduce logistics carbon emissions.
5. **🛡️ Verified Handover & Instant Partial Payment Release**:
   - Cryptographic QR code verification releasing instant partial payments (**₹1,000 PAID** / **₹1,500 PENDING FINAL GRADING**).
6. **📈 7-Stage E-Waste Traceability**:
   - Complete chain-of-custody tracking: `COLLECTED` → `POOLED` → `MATCHED` → `PICKED UP` → `VERIFIED` → `GRADED` → `RECYCLED` with carbon offset metrics.
7. **📶 Offline-First PWA Support**:
   - LocalStorage/IndexedDB offline queue auto-syncing when network connectivity returns. Includes a 🟢 **ONLINE** / 🟠 **OFFLINE** toggle for hackathon testing.
8. **⏱️ 3-Minute Hackathon Demo Tour**:
   - Built-in interactive 14-step guided tour for hackathon presentation.

---

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Canvas-Confetti, Web Speech API.
- **Backend**: Node.js, Express.js REST API.
- **Database**: SQLite schema & in-memory/file persistent database engine.
- **PWA & Offline**: Web App Manifest, Service Worker (`sw.js`), LocalStorage Offline Queue Store.

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/kabadiwala-connect.git
cd kabadiwala-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

---

## 🚀 How to Run

### Option A: Run Both Frontend & Backend Together (Recommended)
```bash
npm run start
```

### Option B: Run Services Separately

**Start Backend REST API Server (Port 5000):**
```bash
npm run server
```

**Start Frontend Vite App (Port 3000):**
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Demo Login Information

The app features an interactive **1-Click Quick Demo Login** on the login page as well as standard login support:

| User Role | Demo Name | Phone / Email | Password | Default Language |
| :--- | :--- | :--- | :--- | :--- |
| **👨‍🌾 Collector** | Ravi Kumar | `9876543210` | `sih2026demo` | Tamil (தமிழ்) |
| **🏭 Recycler** | GreenCycle Recycling Pvt Ltd | `9123456780` | `sih2026demo` | English |
| **🛡️ Admin** | SIH Nodal Officer | `9000000000` | `sih2026demo` | English |

---

## 📁 Project Structure

```
kabadiwala-connect/
├── database/
│   ├── schema.sql         # Database tables & relationships
│   └── seed.sql           # Realistic hackathon demo seed data
├── public/
│   ├── logo.svg           # Brand logo icon
│   ├── manifest.json      # PWA Web App Manifest
│   └── sw.js              # Service worker for offline caching
├── server/
│   ├── dbStore.js         # Database helper engine
│   └── server.js          # Express.js REST API server
├── src/
│   ├── components/        # Modals, Navbar, BottomNav, DemoTour
│   ├── context/           # AppContext state management & auth
│   ├── pages/             # Collector, Recycler, Admin, Mandi, Traceability, Login
│   ├── utils/             # i18n translations & offline queue
│   ├── App.jsx            # Layout controller
│   ├── main.jsx           # Vite React entrypoint
│   └── index.css          # Tailwind CSS directives
├── .env.example           # Safe environment variables template
├── .gitignore             # Git ignore configuration
├── package.json           # Node scripts & dependencies
├── README.md              # Project documentation
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration & API proxy
```

---

## 📜 License
This project is developed for **Smart India Hackathon 2026**.
