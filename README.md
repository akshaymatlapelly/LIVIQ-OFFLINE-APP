# SENTRIX: The Real-World Intelligence Platform

> **TAGLINE:** Sense. Understand. Act.  
> **CORE PHILOSOPHY:** POINT → SENSE → UNDERSTAND → DECIDE → ACT

---

## 🌟 Overview

**SENTRIX** is an AI-powered smartphone intelligence platform that extends smartphone capabilities beyond conventional apps. It unifies camera, microphone, IMU, GPS, NPU/AI processing, speaker, flash, display, haptics, and connectivity through one central intelligence layer for the physical world.

This repository contains **ONE unified platform** with six major capabilities:
1. **SENTRIX Inspection**: Real-world visual inspection assistant for structural, electrical, and hazard analysis.
2. **Medicine Investigator**: Visual packaging screening for suspicious counter-feit indicators and anti-tamper seals.
3. **AuraLens**: Multimodal physical-world input conversion into structured data (receipts, documents, appliance error codes).
4. **Ultrasonic Radar**: High-frequency acoustic sensing concepts for zero-visibility spatial environment mapping.
5. **Haptic Language**: Tactile communication system using structured linear resonant vibration code patterns.
6. **Optical Air-Gap**: Secure device-to-device optical communication via screen strobe and camera pulses without RF radios.

---

## 📁 Repository Architecture

Strict separation between `/frontend` and `/backend`:

```
iQOO/
├── frontend/             # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable UI (GlassCard, AIStatus, ConfidenceMeter, RiskBadge, SafetyDisclaimer, etc.)
│   │   ├── context/      # AuthContext for session management
│   │   ├── font/ & types/ # Domain models & API types
│   │   ├── layouts/      # AppLayout shell with Desktop Sidebar & Mobile Nav
│   │   ├── pages/        # Landing Page (/), Auth (/signin, /signup), Dashboard (/home), 6 Capabilities, Demo Tour (/demo)
│   │   └── services/     # REST API client
│   └── vite.config.ts
└── backend/              # Node.js + Express + TypeScript REST API
    ├── src/
    │   ├── config/       # Environment variables & CORS settings
    │   ├── controllers/  # API request controllers
    │   ├── middleware/   # JWT authentication & error handling
    │   ├── repository/   # Repository abstraction (InMemory / Postgres ready)
    │   ├── routes/       # Express API routes (/api/*)
    │   ├── services/     # SENTRIX Intelligence Core domain logic
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
Copy `.env.example` to `backend/.env` or configure root `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=sentrix_deep_tech_secret_key_2026_x99
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
- **Email:** `demo@sentrix.ai`
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

### Capabilities
- `POST /api/inspection/analyze` - Structural wall, pothole, electrical, and leak analysis
- `POST /api/medicine/analyze` - Packaging micro-print & tamper seal visual indicator screening
- `POST /api/auralens/analyze` - Extract receipt totals, document summaries, or appliance error codes
- `POST /api/radar/simulate` - Execute ultrasonic acoustic echo spatial sweep
- `GET  /api/haptic/codebook` - Retrieve haptic vibration pattern dictionary
- `POST /api/haptic/encode` - Encode text message into vibration pulse timing sequence
- `POST /api/haptic/decode` - Decode haptic hex transmission payload back into text
- `POST /api/optical/transfer` - Simulate optical light pulse air-gap payload transfer

### Platform Services
- `GET    /api/history` - Fetch user activity audit log
- `DELETE /api/history/:id` - Delete specific history record
- `DELETE /api/history` - Clear user history log
- `GET    /api/hardware` - Fetch smartphone sensor telemetry health status

---

## 🛡 Trust, Safety & Hardware Disclaimer

Every capability in SENTRIX clearly distinguishes prototype/simulation modes from raw hardware access:
- **SENTRIX Inspection**: First-level visual screening assistant. Does **not** replace certified civil engineers or electrical inspectors.
- **Medicine Investigator**: Visual packaging indicator screening. Does **not** guarantee chemical pharmaceutical authenticity.
- **Ultrasonic Radar**: Prototype acoustic spatial visualization. Depends on speaker transducer and microphone hardware frequency response.
- **Optical Air-Gap**: Demonstrates optical device-to-device light framing without requiring OS flash driver overrides.

---

## 🏆 Hackathon Guided Demo Mode (`/demo`)

Navigate to `/demo` inside the logged-in platform to access a 6-step guided presentation tour designed specifically for hackathon judges and evaluators.
