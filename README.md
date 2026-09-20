# LIVIQ: Three Layers of Offline Health Intelligence

> **TAGLINE:** One Phone. Three Layers of Health Intelligence.  
> **CORE PIPELINE:** POINT → SENSE → UNDERSTAND → DECIDE → ACT

---

## 🌟 Overview

**LIVIQ** is an offline-first AI health intelligence platform designed for mobile devices. Powered by phone-first optical sensing, 38 TOPS local NPU processing, and a multi-lingual voice intelligence engine, LIVIQ organizes real-world health sensing into three continuous layers:

1. **INSIGHT (Layer 1 - Emergency Response Intelligence):**
   - Evaluates acute physical trauma, injury severity, and tissue inflammation using camera vision and thermal color framing.
   - Outputs immediate emergency triage protocols.
2. **MEDSURE (Layer 2 - Medicine Understanding & Safety):**
   - Screens blister packaging micro-printing, anti-tamper seals, dosage schedules, and allergen conflict warnings using macro strobe lens and OCR micro-kerning.
3. **HEALTRACE (Layer 3 - Everyday Health Intelligence):**
   - Transforms medical lab report prints, clinical summaries, and routine vital checks into a continuous health trajectory. Includes dedicated sub-modules for Food, Gym, Yoga, Sleep, Activity, Hydration, Health Replay, and Personal Baseline tracing.

---

## 📁 Repository Architecture

Strict separation between `/frontend` and `/backend`:

```
LIVIQ-OFFLINE-APP/
├── frontend/             # React + Vite + TypeScript + Tailwind CSS
│   ├── public/           # Static video assets (INSIGHT-VIDEO.mp4, MEDSURE-VIDEO.mp4, HEALTRACE-VIDEO.mp4)
│   ├── src/
│   │   ├── components/   # Reusable UI (GlassCard, AIStatus, Sidebar, Header, MobileNav, ScanAnimation, etc.)
│   │   ├── context/      # AuthContext for session management
│   │   ├── features/     # Global LIVIQ Voice Agent (Speech Recognition & TTS)
│   │   ├── layouts/      # AppLayout shell with Desktop Sidebar & Mobile Drawer
│   │   ├── pages/        # Landing Page (/), Auth (/signin, /signup), Dashboard (/home), How It Works (/how-it-works), 3 Health Modules, Sub-Traces, Demo Tour (/demo)
│   │   └── services/     # REST API client & local NPU fallback engines
│   └── vite.config.ts
└── backend/              # Node.js + Express + TypeScript REST API
    ├── src/
    │   ├── config/       # Environment variables & CORS settings
    │   ├── controllers/  # API request controllers
    │   ├── middleware/   # JWT authentication & error handling
    │   ├── repository/   # InMemory / DB abstraction layer
    │   ├── routes/       # Express API routes (/api/*)
    │   ├── services/     # LIVIQ Intelligence Core domain logic
    │   └── types/        # TypeScript interfaces
    └── tsconfig.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Install Dependencies

In Backend:
```bash
cd backend
npm install
```

In Frontend:
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` or configure root `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=liviq_health_intelligence_secret_key_2026
CORS_ORIGIN=http://localhost:5173
```

### 3. Run Development Servers

**Run Backend API Server (Port 5000):**
```bash
cd backend
npm run dev
```

**Run Frontend Development Server (Port 5173):**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Demo Credentials

Pre-seeded Demo User:
- **Email:** `demo@liviq.ai`
- **Password:** `password123`

Or register a new account on the `/signup` page!

---

## 🛰 REST API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user account
- `POST /api/auth/signin` - Authenticate user session & receive JWT token
- `GET  /api/auth/me` - Retrieve authenticated user profile

### Universal Intelligence Core
- `POST /api/scan/classify` - Auto-classify physical scan category and route to optimum capability

### Core Health Modules
- `POST /api/inspection/analyze` - INSIGHT emergency trauma and acute symptom triage
- `POST /api/medicine/analyze` - MEDSURE blister packaging & allergen conflict screening
- `POST /api/auralens/analyze` - HEALTRACE lab report OCR & biomarker trajectory ingestion

### Platform Services
- `GET    /api/history` - Fetch user activity audit log
- `DELETE /api/history/:id` - Delete specific history record
- `DELETE /api/history` - Clear user history log
- `GET    /api/hardware` - Fetch smartphone sensor telemetry health status (38 TOPS NPU status)

---

## 🛡 Trust, Safety & Medical Disclaimer

LIVIQ is designed as an offline-first health triage and intelligence assistant:
- **INSIGHT**: First-level emergency screening tool. Does **not** replace professional emergency medical responders.
- **MEDSURE**: Visual packaging & allergen indicator screening. Always verify prescriptions with certified pharmacists.
- **HEALTRACE**: Continuous trend tracing based on uploaded reports and vitals. Consult physicians for formal medical diagnosis.

---

## 🏆 Hackathon Guided Demo Mode (`/demo`)

Navigate to `/demo` inside the logged-in platform to access the 6-step guided presentation tour designed specifically for hackathon evaluators.
