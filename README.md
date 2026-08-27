# AccessFlow AI

> **Tagline:** *From Confusion to Completion. From Dependency to Independence.*

**AccessFlow AI** is an AI-powered Accessibility Workflow Copilot designed to help applicants understand, prepare, track, and complete complex applications (scholarships, government welfare schemes, university admissions, healthcare forms) completely independently.

---

## 🌟 1. Product Mission & The Problem

Millions of citizens have technical access to digital portals, yet remain excluded because of:
- Dense bureaucratic language and legalistic terms (e.g. *"attested"*, *"bonafide"*, *"DBT NPCI mapping"*).
- Complex, scattered instructions and unclear eligibility thresholds.
- Language barriers (English-only portals when applicants speak regional languages like Telugu).
- Cognitive overload and lack of confidence.
- Difficulty tracking which certificates are satisfied vs. missing.

As a result, applicants are forced into **digital dependency** on cyber cafes, middlemen, agents, or relatives.

### The Transformation
$$\text{CONFUSION} \longrightarrow \text{UNDERSTANDING} \longrightarrow \text{PERSONALIZED GUIDANCE} \longrightarrow \text{INDEPENDENT ACTION} \longrightarrow \text{COMPLETION}$$

---

## 🏛️ 2. Critical Architectural Principle

```
+--------------------------------------------------------------------------------+
|                        CRITICAL ARCHITECTURAL PRINCIPLE                        |
|                                                                                |
|                        AI DOES INTELLIGENCE.                                   |
|                        BACKEND DOES TRUTH AND STATE.                           |
+--------------------------------------------------------------------------------+
```

The system strictly separates three distinct layers:
1. **Document Facts:** What the official uploaded document says (source of truth).
2. **Accessibility Adaptation:** How those facts are translated and simplified for the user (English/Telugu, Simple/Detailed).
3. **Application State:** What steps and requirements the user has actually completed.

> **Absolute Rule:** The AI is **NEVER** responsible for computing runtime step status, workflow progress percentage, or readiness status. Progress (`completed_steps / total_steps * 100`) and readiness (`READY_FOR_FINAL_REVIEW` vs `NOT_READY`) are calculated deterministically by relational backend logic in Express & PostgreSQL.

---

## 🏗️ 3. Architecture Diagram

```
                 React + Vite Frontend (Tailwind CSS, React Router, Axios)
                                      |
                                      | HTTPS / REST / JWT Bearer
                                      v
                               Express Backend
            +---------------------------------------------------+
            |  Middleware: JWT Auth, Rate Limiter, Zod, Multer  |
            +---------------------------------------------------+
                                      |
                                      v
                           Thin Controllers Layer
                                      |
                                      v
                           Business Service Layer
            +---------------------------------------------------+
            | - AuthService          - DocumentService          |
            | - ProfileService       - WorkflowService          |
            | - TextExtraction       - AIOrchestrationService   |
            +---------------------------------------------------+
                     |                                   |
                     v                                   v
          Supabase PostgreSQL / Storage      Google Gemini Form Intelligence
           (Single Source of Truth)                      |
                                                Structured JSON Output
                                                         |
                                                   Zod Validation
                                                         |
                                                Safe DB Persistence
```

---

## 💻 4. Tech Stack

- **Frontend:** React 18, Vite, React Router DOM 7, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js, JWT, bcryptjs, Zod, Multer, pdf-parse, express-rate-limit, cors.
- **Database:** Supabase PostgreSQL (with automatic local fallback store for seamless offline testing).
- **Storage:** Supabase Storage (private bucket for uploaded documents).
- **AI Engine:** Google Gemini API (`gemini-1.5-flash`) with strict JSON schema validation.

---

## 📁 5. Repository Folder Structure

```
BTS-HT-P/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── postman_collection.json
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   └── seed.sql
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       │   ├── env.js
│       │   ├── supabase.js
│       │   └── seedData.js
│       ├── constants/
│       │   └── enums.js
│       ├── utils/
│       │   ├── AppError.js
│       │   ├── asyncHandler.js
│       │   ├── jwt.js
│       │   └── response.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   ├── notFound.middleware.js
│       │   ├── rateLimit.middleware.js
│       │   ├── upload.middleware.js
│       │   └── validate.middleware.js
│       ├── validators/
│       │   ├── auth.validator.js
│       │   ├── profile.validator.js
│       │   ├── document.validator.js
│       │   ├── workflow.validator.js
│       │   └── ai.validator.js
│       ├── ai/
│       │   ├── prompts/
│       │   │   ├── formIntelligence.prompt.js
│       │   │   ├── adaptation.prompt.js
│       │   │   └── contextualAssistance.prompt.js
│       │   └── schemas/
│       │       ├── formIntelligence.schema.js
│       │       ├── adaptation.schema.js
│       │       └── contextualAssistance.schema.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── profile.service.js
│       │   ├── document.service.js
│       │   ├── textExtraction.service.js
│       │   ├── workflow.service.js
│       │   └── ai/
│       │       ├── formIntelligence.service.js
│       │       ├── accessibilityAdaptation.service.js
│       │       ├── contextualAssistance.service.js
│       │       └── aiOrchestration.service.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── profile.controller.js
│       │   ├── document.controller.js
│       │   ├── workflow.controller.js
│       │   └── ai.controller.js
│       └── routes/
│           ├── auth.routes.js
│           ├── profile.routes.js
│           ├── document.routes.js
│           ├── workflow.routes.js
│           └── ai.routes.js
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/
│       │   └── index.css
│       ├── routes/
│       │   └── AppRoutes.jsx
│       ├── layouts/
│       │   └── AuthenticatedLayout.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── AccessibilityContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useWorkflow.js
│       ├── services/
│       │   ├── api.js
│       │   ├── authApi.js
│       │   ├── profileApi.js
│       │   ├── documentApi.js
│       │   ├── workflowApi.js
│       │   └── aiApi.js
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx
│       │   │   └── Footer.jsx
│       │   ├── workflow/
│       │   │   ├── StepCard.jsx
│       │   │   ├── ProgressBar.jsx
│       │   │   ├── RequirementChecklist.jsx
│       │   │   ├── FieldExplainer.jsx
│       │   │   └── WorkflowSidebar.jsx
│       │   └── ai/
│       │       ├── AIAssistPanel.jsx
│       │       ├── ConfidenceBadge.jsx
│       │       └── TermTooltip.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── SignupPage.jsx
│           ├── DashboardPage.jsx
│           ├── UploadPage.jsx
│           ├── ProcessingPage.jsx
│           ├── PreferencesPage.jsx
│           ├── WorkflowWizardPage.jsx
│           └── CompletionPage.jsx
│
└── README.md
```

---

## 🗄️ 6. Database Schema

The database consists of 7 normalized PostgreSQL entities:
1. `users` &bull; User credentials and authentication hashes.
2. `user_accessibility_profiles` &bull; User preferences: language (`en`/`te`), explanation level (`simple`/`detailed`), and guidance mode.
3. `documents` &bull; Uploaded file metadata, raw text, storage paths, status (`uploaded`, `processing`, `analyzing`, `ready`, `failed`), and structured AI analysis.
4. `workflows` &bull; Authoritative workflow entity storing `total_steps`, `completed_steps`, `progress_percentage`, and `readiness_status`.
5. `workflow_steps` &bull; Individual steps with official instruction, simplified guidance, confidence, and status (`pending`, `completed`, `skipped`).
6. `workflow_requirements` &bull; Mandatory checklist items (attested marks memo, MeeSeva income certificate, bank passbook) with satisfaction state (`is_satisfied`).
7. `ai_interactions` &bull; Audit log of grounded Q&A queries and answers.

---

## 🔌 7. Complete API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server uptime & status check | No |
| `POST` | `/api/auth/register` | Register user & accessibility profile | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user & profile | Yes |
| `GET` | `/api/profile` | Get accessibility profile preferences | Yes |
| `PATCH` | `/api/profile` | Update language / explanation level | Yes |
| `POST` | `/api/documents/upload` | Upload & process PDF/image document | Yes |
| `GET` | `/api/documents` | List user uploaded documents | Yes |
| `GET` | `/api/documents/:id` | Get document details & status | Yes |
| `GET` | `/api/workflows` | List user workflows | Yes |
| `GET` | `/api/workflows/:id` | Get full workflow with steps & requirements | Yes |
| `GET` | `/api/workflows/:id/progress` | Deterministic progress recalculation | Yes |
| `GET` | `/api/workflows/:id/checklist` | Compile final review readiness checklist | Yes |
| `PATCH` | `/api/workflows/:id/steps/:stepId` | Update step completion status | Yes |
| `PATCH` | `/api/workflows/:id/requirements/:reqId` | Toggle requirement satisfaction | Yes |
| `POST` | `/api/ai/ask` | Contextual Q&A grounded in document | Yes |
| `POST` | `/api/ai/adapt` | Translate & simplify official text | Yes |

---

## ⚡ 8. Quick Start / Running Locally

### Step 1: Clone the repository & Install Backend
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:3001
```

### Step 2: Install and Run Frontend
```bash
cd ../frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🔑 9. Environment Variables Configuration

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase (Optional for local testing; backend automatically falls back to memory store if omitted)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_STORAGE_BUCKET=documents

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## 🎯 10. Guaranteed Hackathon Demo Walkthrough

1. Open [http://localhost:5173](http://localhost:5173).
2. Click **"Explore Live Scholarship Demo"** or log in using the 1-click button:
   - **Email:** `demo@accessflow.ai`
   - **Password:** `Password123!`
3. Inspect the **Merit-cum-Means Scholarship 2026 Preparation** workflow:
   - Notice the **Deterministic Progress Bar** (4 of 6 steps completed = 66.67%).
   - Switch language to **తెలుగు (Telugu)** in the top bar to view live translation of guidance.
   - Click on the **"Attested"** or **"MeeSeva"** term tooltips.
   - Use the **AI Assistant Panel** on the right and ask: *"What does attested mean and how do I get it?"*
   - Advance to Step 5, upload/enter your details, and click **"Mark Step Complete"**.
   - Navigate to the **Final Review Checklist** (`/workflow/:id/complete`) to view the readiness status (`READY FOR FINAL REVIEW` or `NOT READY`).
4. Upload any new PDF/image on the `/upload` page to test the automated pipeline!

---

## 🛡️ 11. Security & Compliance

- Passwords hashed using `bcrypt` (10 rounds).
- JWT tokens with scoped authorization and per-user ownership verification.
- Multer file size caps (10MB) with strict MIME and extension validation.
- Centralized error handler preventing stack trace leakage in production.
- Rate limiting on authentication (`/api/auth/*`) and AI endpoints (`/api/ai/*`).
- Clear non-affiliation notice: AccessFlow AI prepares applicants and never falsely claims official acceptance.
