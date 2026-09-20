# Qual.dev Frontend Client

> **AI-Based Interactive Quantum Algorithm Learning Platform**  
> Developed for **Egreen Quanta** | Category: **Software** | Theme: **Smart Education**

The `qual-frontend` client is a modern, responsive web application designed for students, researchers, and developers to learn, design, simulate, and visualize quantum algorithms. It provides an intuitive graphical quantum circuit studio, interactive mathematics modules, real-time simulation readouts, and AI pedagogical assistance.

---

## ✨ Features

- **Quantum Circuit Studio & Live Simulator:**
  - Interactive 2-qubit register wire canvas with clickable/draggable gates ($H$, $X$, $Z$, $CNOT$)
  - Instant statevector calculation: state probabilities ($P(|00\rangle), P(|01\rangle), P(|10\rangle), P(|11\rangle)$) with animated distribution meters
  - Real-time Bloch sphere angles ($\theta, \phi$) and Dirac ket notation ($|\psi\rangle = 0.707|00\rangle + 0.707|11\rangle$)
  - Multi-backend code generation for **Qiskit**, **Cirq**, **PennyLane**, and **OpenQASM 3.0** with one-click copy
- **AI Quantum Copilot:**
  - Context-aware pedagogical insights explaining physical phenomena (superposition, entanglement, phase shifts, collapse upon measurement)
- **Interactive Curriculum Explorer:**
  - Deep-dive interface into **Module 1: The Mathematics You Need**, covering all 12 foundation topics (Vectors, Matrices, Unitary Operators, Dirac Notation, and Mastery Quizzes)
- **Delivery Table (Expected Deliverables):**
  - Searchable, categorized deliverables matrix (DEL-01 to DEL-08) covering core systems, simulation, AI intelligence, and instructor analytics
- **Robust Authentication Dashboard:**
  - Secure registration, sign-in, and profile view managed via Redux Toolkit with automatic cookie session handling
- **Modern Quantum Design System:**
  - Designed with `@tailwindcss/vite` (Tailwind CSS v4), Space Grotesk / DM Sans typography, deep-space obsidian backgrounds, and quantum cyan/indigo accents

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Typography:** Space Grotesk, DM Sans, and JetBrains Mono (Google Fonts)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **HTTP Client:** [Axios](https://axios-http.com/) configured with `withCredentials: true` for secure HttpOnly cookie persistence
- **Icons:** Inline SVG iconography (clean, scalable, accessible)

---

## 📂 Project Structure

```
qual-frontend/
├── public/
│   ├── favicon.svg             # Platform quantum favicon
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── axios.ts            # Configured Axios instance with backend base URL
│   ├── assets/                 # SVGs and images
│   ├── components/
│   │   ├── auth/               # Authentication suite
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── UserProfile.tsx
│   │   └── home/               # Platform homepage sections
│   │       ├── Navbar.tsx
│   │       ├── Hero.tsx
│   │       ├── InteractiveCircuitDemo.tsx
│   │       ├── ProblemSolution.tsx
│   │       ├── ObjectivesSection.tsx
│   │       ├── DeliverablesTable.tsx
│   │       ├── CurriculumPreview.tsx
│   │       ├── MetaInfoSection.tsx
│   │       ├── Footer.tsx
│   │       └── HomePage.tsx
│   ├── store/
│   │   ├── index.ts            # Root Redux store & typed hooks
│   │   └── slices/
│   │       └── authSlice.ts    # User session, login, register, and logout thunks
│   ├── styles/
│   │   ├── auth.css            # Dark glassmorphic auth card styles
│   │   └── index.css           # Tailwind v4 import, CSS variables & typography tokens
│   ├── types/
│   │   └── auth.ts             # Auth data models & API responses
│   ├── App.tsx                 # Root application controller & view switcher
│   └── main.tsx                # React DOM mount & Redux Provider setup
├── index.html                  # HTML entry point with font preloading
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9 or higher)

### 2. Install Dependencies
```bash
cd qual-frontend
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
The application will launch at: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```
This performs full TypeScript verification (`tsc -b`) and generates optimized production assets in `dist/`.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Connecting to the Backend

By default, the Axios client connects to the FastAPI backend at `http://localhost:8000`.  
Ensure `qual-backend` is running to use registration, login, and user profile persistence features.
The Homepage and Interactive Circuit Studio function standalone in the browser using client-side quantum state math and code generation!

---

## 🎨 UI/UX Design Standards

The user interface follows strict design criteria from the `ui-ux-pro-max` intelligence system:
- **Contrast & Legibility:** Dark mode with high contrast (WCAG AAA compliant).
- **Typography:** Space Grotesk for commanding headings, DM Sans for reading flow, JetBrains Mono for quantum states and code.
- **Micro-Interactions:** 150–250ms transitions on hover states, active button elevation, and animated probability bars.
- **Touch & Mobile:** Responsive breakpoints at 375px, 768px, 1024px, and 1440px with touch-friendly button targets (≥44px).
