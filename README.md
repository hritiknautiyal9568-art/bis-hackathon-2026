# BIS Smart Portal — AI-Powered Compliance Platform

> **BIS Hackathon 2026** | India's first AI-powered Bureau of Indian Standards compliance platform

Built with **Next.js 16** + **Gemini 2.5 Flash AI** + **TypeScript** + **Tailwind CSS v4**

---

## Features

- **14 AI Functions** — Scan, Chat, Verify ISI marks, Analyze quality, Compare products, Describe products, Safety risk, Ingredients check, HUID extraction, Compliance check, Simulate approval, Checklist generator, Standards lookup, Document review
- **Dual Portals** — Consumer dashboard & Seller dashboard
- **Live Camera Scanner** — Scan product labels with your phone/webcam camera
- **Multi-Model AI** — Gemini 2.5 Flash → Flash Lite → Gemini 3 Flash → Gemma 3 fallback chain
- **SQLite Database** — Persistent storage with JWT + bcrypt authentication
- **53+ Routes** — Full API endpoints + UI pages
- **Demo Fallback** — Graceful fallback when AI is rate-limited

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 18+ (recommended 20+) | https://nodejs.org |
| **npm** | 9+ (comes with Node) | — |

> No separate backend server needed — Next.js handles both frontend and API routes!

---

## Quick Start (New PC)

### Option A: One-Click Setup (Recommended)

**Windows:**
```bash
git clone https://github.com/hritiknautiyal9568-art/bis-hackathon-2026.git
cd bis-hackathon-2026
setup.bat
```

**Mac/Linux:**
```bash
git clone https://github.com/hritiknautiyal9568-art/bis-hackathon-2026.git
cd bis-hackathon-2026
chmod +x setup.sh
./setup.sh
```

> The script installs all dependencies, asks for your API key, creates the config file, and starts the server automatically!

---

### Option B: Manual Setup

#### 1. Clone the repo

```bash
git clone https://github.com/hritiknautiyal9568-art/bis-hackathon-2026.git
cd bis-hackathon-2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_google_ai_api_key_here
JWT_SECRET=bis-portal-secret-key-2026
```

> Get a free Gemini API key at https://aistudio.google.com/apikey

### 4. Start the development server

```bash
npm run dev
```

### 5. Open in browser

Go to **http://localhost:3000**

That's it! Both frontend and backend run together on port 3000.

---

## Project Structure

```
bis-portal/
├── src/
│   ├── app/                    # Pages & API routes (App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Auth page
│   │   ├── customer/           # Consumer portal (10+ pages)
│   │   │   ├── scan/           # AI product scanner
│   │   │   ├── verify/         # ISI mark verification
│   │   │   ├── compare/        # Product comparison
│   │   │   ├── ingredients/    # Ingredient analysis
│   │   │   ├── safety/         # Safety risk assessment
│   │   │   └── ...
│   │   ├── seller/             # Seller portal (8+ pages)
│   │   │   ├── compliance/     # Compliance checker
│   │   │   ├── simulate/       # Approval simulator
│   │   │   ├── documents/      # Document review
│   │   │   └── ...
│   │   └── api/                # Backend API routes
│   │       ├── chat/           # AI chat assistant
│   │       ├── scan/           # Product scan API
│   │       ├── verify/         # Mark verification API
│   │       └── ... (17 endpoints)
│   ├── components/             # UI components (Navbar, Scanner, Chat, etc.)
│   ├── lib/                    # Core logic
│   │   ├── gemini.ts           # AI functions (14 Gemini functions)
│   │   ├── demo-data.ts        # Fallback demo responses
│   │   ├── db.ts               # SQLite database
│   │   └── auth.ts             # JWT authentication
│   └── context/                # React context (Auth)
├── public/                     # Static assets (BIS logo, etc.)
├── .env.local                  # API keys (not in git)
└── package.json
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Full-stack React framework (App Router) |
| TypeScript | Type-safe code |
| Tailwind CSS v4 | Styling |
| Gemini 2.5 Flash | AI (text + vision) |
| SQLite (better-sqlite3) | Database |
| JWT + bcrypt | Authentication |

---

## Notes

- The **database** (`bis-portal.db`) is auto-created on first run
- The **.env.local** file is git-ignored — you must create it manually
- All AI features gracefully fallback to **demo mode** if the API key is invalid or rate-limited
- Both frontend and backend run on the **same port** (3000) — no separate server needed
