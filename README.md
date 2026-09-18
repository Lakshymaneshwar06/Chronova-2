# Chronova 2.0 — Dual Event Portal & Study Material Hub

Chronova is a modern, high-performance, single-page web application (SPA) that unifies campus event management, academic study resources, student club discovery, role-based authentication (Student & Admin), and an intelligent query AI assistant.

---

## 🌟 Key Features

### 1. Dual-Mode Architecture & Fluid Switching
- **Top-Level Mode Pill**: Effortlessly switch between **Event Mode** (neon cyan & electric amber), **Study Material Hub** (electric indigo & violet), and **Club Directory** (emerald & teal).
- **Smooth Layout Transitions**: Seamless zero-reload transitions, sliding active indicator pill, and reactive ambient background orbs.

### 2. Event Mode Portal
- **Discovery Grid & Dynamic Categorization**: Filter by Hackathons, Workshops, Cultural Fests, Guest Talks, and Gaming/E-Sports.
- **Live Ticking Countdowns**: Every event card features a real-time ticking countdown clock (Days, Hours, Minutes, Seconds).
- **Interactive Registration & Pass Generator**:
  - One-click instant registration.
  - Generates a boarding-pass style **Digital Event Pass** with a dynamic QR code, roll number, and entry token.
- **Campus Timeline & Schedule**: Interactive milestone tracker displaying upcoming dates and timings.

### 3. Study Material Hub
- **Multi-Level Categorized Resource Grid**: Filter by Department (*Computer Science, AI & Data Science, Mathematics, Electronics, IT*), Semester (*Sem 1 through Sem 8*), and Resource Format (*Lecture Notes, Cheat Sheets, 10-Year Question Banks, Lab Manuals, Video Masterclasses*).
- **Real-Time Fuzzy Search**: Filter across titles, course codes (e.g. `CS401`, `CS402`, `AI502`), topics, and professor names.
- **In-Browser Document Reader**:
  - Built-in reader simulation with Table of Contents and excerpts.
  - Simulated instant download with progress toasts.
- **Campus Locker & Bookmarks**: Star/bookmark any resource to quickly access it anytime.

### 4. Campus Clubs Showcase
- **Club Directory**: Explore campus guilds (*ChronoCode Developers, ChronoRobotics & IoT, AI Nexus, PixelForge UI/UX, CyberSec Syndicate, E-Sports Arena, Cultural Society*).
- **Member & Event Badges**: Active member counters, club leads, hosted events count, and requirement specs.
- **Instant Recruitment Flow**: Interactive application submission with instant confirmation.

### 5. Role-Based Authentication (Student & Admin)
- **Unified Login Modal**: Switch between Student and Admin tabs.
- **1-Click Auto-Fill Demo Credentials**:
  - **Student Account**: `student@chronova.edu` / `student123`
    - Personalized profile badge
    - Access to "My Campus Locker" (registered passes & bookmarked study notes)
  - **Admin Account**: `admin@chronova.edu` / `admin123`
    - Unlocks floating **Admin Console**
    - **+ Post Campus Event**: Publish new hackathons or workshops live to Chronova
    - **+ Upload Study Material**: Publish notes, codes, and syllabus directly to students

### 6. ChronoBot AI Query Chatbot
- **Interactive AI Assistant**: Docked floating glassmorphic widget with notification pulse.
- **Natural Language Search Engine**: Ask anything about upcoming hackathons, semester study notes, joining clubs, or admin access.
- **Quick-Action Chips**: One-tap query pills (`📅 Next Hackathon`, `📚 Sem 4 OS Notes`, `👥 Join Robotics Club`, `⚡ Today's Events`, `🔑 Admin Login`).
- **Interactive Deep-Links**: Direct action buttons within chat responses that scroll to and open modals automatically.

---

## 🚀 How to Run

Chronova is completely self-contained and requires **no build step** or package installation.

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari:
```
file:///d:/chronova 2.0/index.html
```

### Option 2: Local Python Server (Recommended)
Open PowerShell or Terminal in `d:\chronova 2.0` and run:
```powershell
python -m http.server 3000
```
Then visit:
```
http://localhost:3000
```

---

## 📁 File Structure

```
d:/chronova 2.0/
├── index.html            # Main Single-Page Application interface
├── README.md             # Documentation and quickstart guide
├── css/
│   └── style.css         # Glassmorphism, animations, orbs, ticket styling, custom scrollbars
└── js/
    ├── data.js           # Comprehensive dummy dataset (Events, Study Hub, Clubs, Bot FAQs)
    ├── state.js          # Centralized reactive store (Modes, Auth, Filters, Persistence)
    ├── components.js     # Card renderers, ticket generator, reader modal, toasts
    ├── chatbot.js        # ChronoBot conversational NLP assistant engine
    └── app.js            # Main coordinator, timers, shortcuts, search, event handlers
```

---

## 🔑 Demo Credentials
- **Student**: `student@chronova.edu` | `student123`
- **Admin**: `admin@chronova.edu` | `admin123`
*(Both can also be auto-filled via the 1-Click "Auto-Fill" button inside the Login Modal)*
