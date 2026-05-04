# MCQ Platform — Complete Architecture & Documentation

> A full-stack, AI-powered assessment platform for conducting **MCQ Tests**, **Coding Challenges**, and **UI Cloning Challenges** with real-time proctoring, automated evaluation, and detailed reporting.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Architecture Diagram](#4-architecture-diagram)
5. [User Roles & Access Flow](#5-user-roles--access-flow)
6. [Feature Flows](#6-feature-flows)
   - [Authentication Flow](#61-authentication-flow)
   - [MCQ Test Flow](#62-mcq-test-flow)
   - [UI Challenge Flow](#63-ui-challenge-flow)
   - [Admin Workflow](#64-admin-workflow)
7. [Database Schema](#7-database-schema)
8. [Backend API Reference](#8-backend-api-reference)
9. [Frontend Routing](#9-frontend-routing)
10. [AI Evaluation Pipeline](#10-ai-evaluation-pipeline)
11. [Proctoring & Security](#11-proctoring--security)
12. [Getting Started](#12-getting-started)

---

## 1. System Overview

The MCQ Platform is a **monorepo** containing two main applications:

| Application | Directory | Port | Purpose |
|---|---|---|---|
| **Frontend** | `mcq_front_next/` | `3000` | Student & Admin React SPA |
| **Backend** | `backend/` | `5000` | Express REST API + AI Evaluation Engine |

**External Dependencies:**
- **MySQL** — Primary relational database (via Sequelize ORM)
- **Ollama (Local LLM)** — `gemma:2b` model for AI design critique
- **Puppeteer** — Headless Chrome for rendering & screenshotting student submissions
- **Google OAuth** — Single-Sign-On for student login

---

## 2. Tech Stack

### Frontend (`mcq_front_next/`)

| Layer | Technology |
|---|---|
| Framework | **React 18** + **TypeScript** |
| Build Tool | **Vite** |
| Routing | **React Router DOM v6** |
| Styling | **Tailwind CSS** + **Glassmorphism** |
| UI Components | **shadcn/ui** + **Radix UI** |
| Animations | **Framer Motion** |
| Icons | **Lucide React** |
| Code Editor | **Monaco Editor** (`@monaco-editor/react`) |
| HTTP Client | **Axios** |
| Auth | **Google OAuth** (`@react-oauth/google`) |
| State | **React Query** + React `useState`/`useContext` |
| Typography | **Outfit** (Google Fonts) |

### Backend (`backend/`)

| Layer | Technology |
|---|---|
| Runtime | **Node.js** |
| Framework | **Express.js** |
| ORM | **Sequelize** (MySQL) |
| Database | **MySQL** (`test_platform` DB) |
| AI Service | **Ollama** (local LLM, `gemma:2b`) |
| Screenshot Engine | **Puppeteer** (headless Chrome) |
| Image Comparison | **pixelmatch** + **pngjs** |
| File Uploads | **Multer** |
| Auth | **JWT** + **bcrypt** |
| Process Management | **dotenv** |

---

## 3. Repository Structure

```
mcq2.o-main/
├── mcq_front_next/          # React + Vite frontend
│   └── src/
│       ├── App.tsx          # Root router
│       ├── index.css        # Global styles (Outfit font, CSS vars)
│       ├── pages/           # Page components (Student + Admin)
│       │   ├── StudentUIChallenge.tsx   # UI Challenge workspace
│       │   ├── MCQTest.tsx              # MCQ test environment
│       │   ├── AdminCreateUIQuestion.tsx
│       │   ├── UiAssessmentCenter.tsx   # Student UI assessment list
│       │   ├── StudentDashboard.tsx
│       │   ├── StudentReports.tsx
│       │   └── ...
│       ├── components/
│       │   ├── StudentLayout.tsx   # Sidebar + Header layout
│       │   └── ui/                 # shadcn/ui primitives
│       ├── contexts/
│       │   └── AuthContext.tsx     # Auth state provider
│       └── utils/
│           └── testResultCleanup.ts
│
└── backend/
    └── src/
        ├── index.js             # Express entry point, route registration
        ├── models/              # Sequelize models
        │   ├── User.js
        │   ├── UIQuestion.js
        │   ├── UIQuestionImage.js
        │   ├── UIAttempt.js
        │   ├── TestSession.js
        │   ├── StudentViolation.js
        │   └── ...
        ├── routes/              # Express routers
        │   ├── uiChallengeRoutes.js
        │   ├── authRoutes.js
        │   ├── testRoutes.js
        │   ├── violationRoutes.js
        │   └── ...
        ├── controllers/         # Business logic
        ├── services/
        │   └── uiEvaluationService.js   # Puppeteer + pixelmatch AI pipeline
        ├── middlewares/         # Auth, error handling
        ├── migrations/          # DB schema migrations
        └── uploads/             # Uploaded reference images
```

---

## 4. Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Browser (Port 3000)"]
        FE["React SPA<br/>(Vite + TypeScript)"]
        AUTH_CTX["AuthContext<br/>(JWT + Google OAuth)"]
        ROUTER["React Router v6<br/>(BrowserRouter)"]
        MONACO["Monaco Editor<br/>(HTML/CSS)"]
        PREVIEW["Live Preview<br/>(iframe srcdoc)"]
    end

    subgraph Backend["⚙️ Express API Server (Port 5000)"]
        API["Express.js<br/>REST API"]

        subgraph Routes["Route Handlers"]
            R_AUTH["/api/auth"]
            R_TEST["/api/test"]
            R_CODING["/api/coding"]
            R_UI["/api/ui-challenge"]
            R_ADMIN["/api/admin"]
            R_REPORTS["/api/reports"]
            R_VIOLA["/api/violations"]
        end

        subgraph Services["Services Layer"]
            UI_SVC["UIEvaluationService<br/>(Singleton)"]
            AI_SVC["Ollama AI Service<br/>(gemma:2b)"]
        end

        subgraph Engines["Evaluation Engines"]
            PUPPETEER["Puppeteer<br/>(Headless Chrome)"]
            PIXELMATCH["pixelmatch<br/>(Pixel Comparison)"]
        end
    end

    subgraph Database["🗄️ MySQL Database"]
        DB[("test_platform DB")]
        TBL_USERS["Users"]
        TBL_UI_Q["UIQuestions +<br/>UIQuestionImages"]
        TBL_UI_ATT["UIAttempts"]
        TBL_TESTS["Tests + Sections +<br/>MCQs"]
        TBL_RESULTS["StudentTestResults +<br/>SectionScores"]
        TBL_VIOLA["StudentViolations"]
        TBL_SESSION["TestSessions"]
    end

    subgraph External["🌐 External Services"]
        GOOGLE["Google OAuth<br/>(SSO)"]
        OLLAMA["Ollama LLM<br/>(Local, Port 11434)"]
    end

    FE -->|"Axios HTTP"| API
    AUTH_CTX -->|"OAuth Token"| GOOGLE
    MONACO -->|"HTML + CSS State"| PREVIEW
    
    API --> Routes
    R_UI --> UI_SVC
    UI_SVC --> PUPPETEER
    UI_SVC --> PIXELMATCH
    R_UI --> AI_SVC
    AI_SVC --> OLLAMA

    Routes --> DB
    DB --- TBL_USERS
    DB --- TBL_UI_Q
    DB --- TBL_UI_ATT
    DB --- TBL_TESTS
    DB --- TBL_RESULTS
    DB --- TBL_VIOLA
    DB --- TBL_SESSION
```

---

## 5. User Roles & Access Flow

```mermaid
graph LR
    START(["User visits root"]) --> LOGIN["/login"]
    LOGIN -->|Google OAuth| GOOGLE_AUTH[(Google)]
    LOGIN -->|Email + Password| JWT_AUTH[(JWT)]

    GOOGLE_AUTH -->|Token| AUTH_CTX{"AuthContext<br/>Role Check"}
    JWT_AUTH -->|Token| AUTH_CTX

    AUTH_CTX -->|"role = admin"| ADMIN_DASH["/admin/dashboard"]
    AUTH_CTX -->|"role = student"| STUDENT_DASH["/student/dashboard"]

    ADMIN_DASH --> ADMIN_ASSESS[Assessment Center]
    ADMIN_DASH --> ADMIN_UI[UI Question Creator]
    ADMIN_DASH --> ADMIN_REPORTS[Reports and Analytics]
    ADMIN_DASH --> ADMIN_VIOLA[Violation Monitor]
    ADMIN_DASH --> ADMIN_PASSCODE[Passcode Manager]

    STUDENT_DASH --> STUDENT_ASSESS["/student/assessment"]
    STUDENT_DASH --> STUDENT_UI["/student/ui-assessment"]
    STUDENT_DASH --> STUDENT_REPORTS[My Reports]
    STUDENT_DASH --> STUDENT_LEADERBOARD[Leaderboard]
```

---

## 6. Feature Flows

### 6.1 Authentication Flow

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant Google
    participant MySQL

    Student->>Frontend: Visit /login
    alt Google SSO
        Student->>Frontend: Click "Sign in with Google"
        Frontend->>Google: OAuth Request
        Google-->>Frontend: id_token
        Frontend->>Backend: POST /api/auth/google { token }
        Backend->>Google: Verify token
        Google-->>Backend: User profile
        Backend->>MySQL: Find or Create User
        MySQL-->>Backend: User record
        Backend-->>Frontend: { jwt, role, name }
    else Email/Password
        Student->>Frontend: Enter credentials
        Frontend->>Backend: POST /api/auth/login
        Backend->>MySQL: Find User by email
        MySQL-->>Backend: Hashed password
        Backend->>Backend: bcrypt.compare()
        Backend-->>Frontend: { jwt, role, name }
    end
    Frontend->>Frontend: Store JWT in localStorage
    Frontend->>Frontend: Update AuthContext
    Frontend-->>Student: Redirect by role
```

### 6.2 MCQ Test Flow

```mermaid
sequenceDiagram
    participant Student
    participant FE as Frontend
    participant BE as Backend
    participant DB as MySQL

    Student->>FE: Navigate to /student/assessment
    FE->>BE: GET /api/student/tests
    BE->>DB: Fetch assigned tests
    DB-->>BE: Test list
    BE-->>FE: Tests[]

    Student->>FE: Click "Start Test"
    FE->>FE: Request Fullscreen (document.requestFullscreen)
    FE->>BE: GET /api/test/:testId
    BE->>DB: Fetch test + sections + MCQs
    DB-->>BE: Test data
    BE-->>FE: Test JSON

    loop Test in Progress
        FE->>FE: Countdown Timer (per section)
        Student->>FE: Select Answer
        FE->>BE: POST /api/auto-save (debounced)
        BE->>DB: Upsert answer record
    end

    Note over FE: Proctoring Active
    FE->>FE: Monitor fullscreenchange
    FE->>FE: Monitor visibilitychange
    FE->>BE: POST /api/violations (on violation)

    Student->>FE: Click "Submit"
    FE->>FE: Validate supervisor passcode
    FE->>BE: POST /api/test-results { answers, timeTaken }
    BE->>DB: Save StudentTestResult
    BE->>DB: Save SectionScores
    BE-->>FE: { score, percentage }
    FE-->>Student: Show Results Page
```

### 6.3 UI Challenge Flow

```mermaid
sequenceDiagram
    participant Student
    participant FE as "Frontend (StudentUIChallenge)"
    participant BE as Backend
    participant DB as MySQL
    participant Puppeteer
    participant Pixelmatch
    participant Ollama

    Student->>FE: Navigate to /student/ui-challenge/:id
    FE->>BE: GET /api/ui-challenge/:id
    BE->>DB: Fetch UIQuestion (title, difficulty, timeLimit)
    DB-->>BE: Question data
    BE-->>FE: Question JSON

    FE->>BE: POST /api/ui-challenge/:id/assign-image { studentId }
    BE->>DB: Find student's existing assignment OR random image
    DB-->>BE: UIQuestionImage record
    BE->>DB: Create UIAttempt { studentId, imageId, status: 'in_progress' }
    BE-->>FE: { assignedImage, attemptId }

    FE->>FE: Show "Start Fullscreen Challenge" overlay
    Student->>FE: Click "Start"
    FE->>FE: document.requestFullscreen()
    FE->>FE: Hide Sidebar + Header (proctored mode)

    loop Coding Session
        Student->>FE: Edit HTML/CSS in Monaco Editor
        FE->>FE: Debounced (300ms) live preview update
        Student->>FE: Tap reference image
        FE->>FE: Show ZoomOverlay (drag + zoom up to 300%)
    end

    Note over FE: Timer reaches 0 OR Student clicks Submit

    Student->>FE: Click "Submit Solution"
    FE->>BE: POST /api/ui-challenge/:id/submit { attemptId, htmlCode, cssCode }
    
    BE->>Puppeteer: generateScreenshot(html, css)
    Puppeteer-->>BE: student_submission.png

    BE->>Puppeteer: normalizeImageToPNG(referenceImagePath)
    Puppeteer-->>BE: ref_normalised.png

    BE->>Pixelmatch: compareImages(ref.png, submission.png)
    Pixelmatch-->>BE: { matchPercent, pixelDifference, diffPath }

    BE->>Ollama: POST /api/generate (design critique prompt)
    Ollama-->>BE: { layout_score, spacing_score, color_score, typography_score, feedback }

    BE->>DB: Update UIAttempt { score, matchPercent, aiFeedback, status: 'completed' }
    DB-->>BE: Updated attempt
    BE-->>FE: { score, matchPercent, pixelDifference, aiFeedback }

    FE->>FE: document.exitFullscreen()
    FE->>FE: Show Results Dashboard (AI feedback + scores)
    FE->>FE: Start 30-second countdown
    FE-->>Student: Auto-redirect to /student/ui-assessment
```

### 6.4 Admin Workflow

```mermaid
flowchart TD
    ADMIN([Admin Login]) --> DASH[Admin Dashboard]

    DASH --> CREATE_UI["/admin/ui_test<br/>Create UI Question"]
    CREATE_UI --> UPLOAD_IMG["Upload Reference Images<br/>JPEG / PNG / WebP"]
    UPLOAD_IMG --> SET_META["Set Title, Difficulty,<br/>Time Limit and Points"]
    SET_META --> PUBLISH[Publish to Students]

    DASH --> CREATE_MCQ["/admin/create-test<br/>Create MCQ Test"]
    CREATE_MCQ --> ADD_SEC[Add Sections and MCQs]
    ADD_SEC --> ASSIGN[Assign to Students]

    DASH --> REPORTS["/admin/reports<br/>View Reports"]
    REPORTS --> RELEASE["Release Results<br/>controlled visibility"]

    DASH --> VIOLATIONS["/admin/violations<br/>Monitor Violations"]
    VIOLATIONS --> VIEW_PROOF[View Screenshot Evidence]

    DASH --> PASSCODE["/admin/passcode<br/>Manage Passcodes"]
    PASSCODE --> SET_CODE["Set Supervisor Passcode<br/>for Test Submission"]
```

---

## 7. Database Schema

```mermaid
erDiagram
    Users {
        int id PK
        string name
        string email
        string password
        string role
        string department
        string sinNumber
    }

    UIQuestions {
        int id PK
        string title
        text description
        string difficulty
        int timeLimit
        int marks
        bool isActive
    }

    UIQuestionImages {
        int id PK
        int questionId FK
        string imageUrl
        string imageName
    }

    UIAttempts {
        int id PK
        int questionId FK
        int studentId FK
        int imageId FK
        text htmlCode
        text cssCode
        float matchPercent
        float score
        int pixelDifference
        json aiFeedback
        string status
        int timeTaken
    }

    TestSessions {
        int id PK
        int userId FK
        int testId FK
        json answers
        int currentQuestion
        datetime startedAt
        datetime lastActivity
    }

    StudentViolations {
        int id PK
        int userId FK
        int testId FK
        string violationType
        string description
        string screenshotPath
        datetime timestamp
    }

    StudentTestResults {
        int id PK
        int userId FK
        int testId FK
        int totalScore
        int maxScore
        float percentage
        string status
        bool resultsReleased
    }

    Users ||--o{ UIAttempts : "attempts"
    Users ||--o{ TestSessions : "has"
    Users ||--o{ StudentViolations : "commits"
    Users ||--o{ StudentTestResults : "earns"
    UIQuestions ||--o{ UIQuestionImages : "has images"
    UIQuestions ||--o{ UIAttempts : "attempted via"
    UIQuestionImages ||--o{ UIAttempts : "assigned to"
```

---

## 8. Backend API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/google` | Google OAuth login |
| `GET` | `/api/auth/me` | Get current user |

### UI Challenge
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ui-challenge/:id` | Fetch challenge question |
| `POST` | `/api/ui-challenge/:id/assign-image` | Assign random reference image to student |
| `POST` | `/api/ui-challenge/:id/submit` | Submit HTML/CSS, triggers full evaluation pipeline |
| `GET` | `/api/ui-challenge/:id/results` | Get attempt results |

### MCQ Tests
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test/:testId` | Fetch test with sections and questions |
| `POST` | `/api/test-results` | Submit final test answers |
| `POST` | `/api/auto-save` | Auto-save in-progress answers |
| `GET` | `/api/student/tests` | List tests assigned to student |

### Violations / Proctoring
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/violations` | Log a proctoring violation event |
| `GET` | `/api/violations/:testId` | Admin: get violations for a test |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/student/:id` | Student performance summary |
| `GET` | `/api/admin/reports` | Admin full reports |
| `GET` | `/api/pdf-report/:testId` | Download PDF report |
| `GET` | `/api/excel-report/:testId` | Download Excel export |

### Result Release (Admin)
| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/admin/results/release/:testId` | Release results to students |
| `PUT` | `/api/admin/results/hide/:testId` | Hide results from students |

---

## 9. Frontend Routing

### Student Routes
| Path | Component | Description |
|---|---|---|
| `/student/dashboard` | `StudentDashboard` | Main student home |
| `/student/assessment` | `StudentAssessment` | MCQ test list |
| `/student/ui-assessment` | `UiAssessmentCenter` | UI challenge list |
| `/student/ui-challenge/:questionId` | `StudentUIChallenge` | **Active workspace (3-panel IDE)** |
| `/student/test/:testId` | `MCQTest` | MCQ test environment (fullscreen) |
| `/student/test/:testId/result` | `TestResult` | Post-MCQ results |
| `/student/reports` | `StudentReports` | Historical results |
| `/student/leaderboard` | `StudentLeaderboard` | Rankings |

### Admin Routes
| Path | Component | Description |
|---|---|---|
| `/admin/dashboard` | `AdminDashboard` | Admin home |
| `/admin/ui_test` | `AdminCreateUIQuestion` | Create UI challenges |
| `/admin/assessment-center` | `AdminAssessmentCenter` | Manage MCQ tests |
| `/admin/reports` | `AdminReports` | Student performance reports |
| `/admin/test-reports` | `AdminTestReports` | Per-test reports |
| `/admin/violations` | `AdminViolations` | Proctoring violations |
| `/admin/passcode` | `AdminPasscode` | Set supervisor passcodes |

---

## 10. AI Evaluation Pipeline

The UI challenge submission triggers a **4-stage automated pipeline**:

```mermaid
flowchart LR
    A["📥 Student Submits<br/>HTML + CSS"] --> B

    subgraph Stage1["Stage 1 — Screenshot"]
        B["Puppeteer<br/>launches headless Chrome"]
        B --> C["Renders student<br/>HTML+CSS at 1200×800"]
        D["📸 Saves submission.png"]
        C --> D
    end

    D --> E

    subgraph Stage2["Stage 2 — Reference Normalize"]
        E["Load teacher's<br/>reference image<br/>(any format)"]
        E --> F["Puppeteer renders<br/>as base64 data-URL"]
        G["📸 Saves ref_normalised.png<br/>(same 1200×800 viewport)"]
        F --> G
    end

    G --> H

    subgraph Stage3["Stage 3 — Pixel Compare"]
        H["pixelmatch compares<br/>2 PNG files<br/>(threshold: 0.1)"]
        H --> I["Counts differing<br/>pixels"]
        I --> J["💯 matchPercent<br/>pixelDifference"]
        I --> K["Saves diff.png<br/>(red highlight)"]
    end

    J --> L

    subgraph Stage4["Stage 4 — AI Critique"]
        L["POST to Ollama<br/>(gemma:2b model)"]
        L --> M["Structured prompt:<br/>rate layout, spacing,<br/>color, typography"]
        M --> N["JSON response:<br/>layout_score,<br/>spacing_score,<br/>color_score,<br/>typography_score,<br/>feedback_text,<br/>priority_fixes[]"]
    end

    N --> O["💾 Save to UIAttempts<br/>in MySQL"]
    O --> P["📊 Send to Student<br/>Results Dashboard"]
```

### Scoring Formula

| Metric | Source | Weight |
|---|---|---|
| **Match Percent** | Pixelmatch (pixel-level) | Primary score |
| **Layout Score** | Ollama LLM (0–100) | AI critique |
| **Spacing Score** | Ollama LLM (0–100) | AI critique |
| **Color Score** | Ollama LLM (0–100) | AI critique |
| **Typography Score** | Ollama LLM (0–100) | AI critique |
| **Final Score** | `matchPercent / 10` → `/maxMarks` | Stored in DB |

---

## 11. Proctoring & Security

The platform implements multi-layer proctoring for both MCQ and UI challenges:

```mermaid
flowchart TD
    START[Student starts test] --> FS["Request Fullscreen<br/>document.requestFullscreen"]
    FS --> MODAL{"Overlay dismissed<br/>by student click?"}
    MODAL -->|No| WAIT[Wait - workspace blocked]
    MODAL -->|Yes| ACTIVE[Challenge Active]

    ACTIVE --> MONITOR{Event Listeners}
    MONITOR --> FS_CHANGE[fullscreenchange event]
    MONITOR --> VIS_CHANGE[visibilitychange event]
    MONITOR --> UNLOAD[beforeunload event]

    FS_CHANGE -->|Exited fullscreen| PAUSE["Show Challenge Paused Overlay"]
    PAUSE --> RESUME[Student clicks Resume Fullscreen]
    RESUME --> ACTIVE

    VIS_CHANGE -->|Tab switched| WARN["Log Warning - Optional auto-submit"]
    UNLOAD -->|Page close| SAVE[Auto-save answers to localStorage]

    ACTIVE --> SUBMIT[Submit]
    SUBMIT --> EXIT_FS[Exit Fullscreen automatically]
    EXIT_FS --> RESULTS[Show Results]
    RESULTS --> REDIRECT["30s countdown - Redirect to assessment"]
```

**Key Proctoring Features:**
- 🔒 **Mandatory Fullscreen** — Challenge cannot start without entering fullscreen
- 🔒 **Fullscreen Enforcement** — If student exits, workspace is immediately paused
- 🔒 **Tab Switch Detection** — `visibilitychange` API monitors focus loss  
- 🔒 **Sidebar/Header Hidden** — During fullscreen, navigation is removed from DOM
- 🔒 **Supervisor Passcode** — MCQ test submission requires admin approval
- 🔒 **Violation Logging** — All proctoring events stored in `StudentViolations` table

---

## 12. Getting Started

### Prerequisites

```bash
# Required
node >= 18.x
npm >= 9.x
MySQL >= 8.0

# For AI evaluation (optional)
ollama  # https://ollama.com/
ollama pull gemma:2b
```

### Environment Setup

**Backend** — Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_platform
JWT_SECRET=your_jwt_secret
```

**Frontend** — Create `mcq_front_next/.env`:
```env
VITE_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Database Setup

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE test_platform;"

# Run migrations (from backend/)
cd backend
node src/scripts/migrate.js
```

### Running the Application

```bash
# Terminal 1 — Start Backend
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000

# Terminal 2 — Start Frontend
cd mcq_front_next
npm install
npm run dev
# App starts at http://localhost:3000
```

### Quick Start Script

```bash
# From root (Windows)
start-dev.bat
```

### Health Check

```bash
curl http://localhost:5000/api/health
# Expected: {"status":"API is working","database":"connected"}
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Puppeteer for screenshots** | Ensures 100% faithful rendering of HTML/CSS — browser engine guarantees layout accuracy |
| **Pixelmatch for comparison** | Pixel-level diff with configurable threshold; format-agnostic after normalization |
| **Local Ollama LLM** | Zero cost, zero latency, no external data sharing — privacy-first AI |
| **Framer Motion** | Declarative animations that degrade gracefully without JS |
| **Monaco Editor** | Industry-standard editor (VS Code engine) with syntax highlighting and IntelliSense |
| **Fullscreen enforcement** | Browser security requires a deliberate user gesture; overlay pattern satisfies this |
| **Singleton UIEvaluationService** | Reuses Puppeteer browser instance to avoid costly startup per submission |
| **30s post-result redirect** | Gives students time to read feedback without leaving navigation control to them |

---

*Platform built with ❤️ — Student UI Premium v2.0*