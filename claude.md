# JMI Placement Tracker — Project Documentation

> A placement management dashboard for the Student Placement Cell (SPC) of Jamia Millia Islamia. Built to bring transparency, real-time status tracking, and streamlined admin control to the campus placement process.

---

## 1. Product Overview

### Problem
The placement cell currently manages company drives, student lists, form links, and results through scattered WhatsApp groups, Google Sheets, and word-of-mouth. Students have no single source of truth to check placement status, upcoming companies, or final results. SPC members duplicate effort and lack accountability tracking.

### Solution
A web-based placement tracker with **two roles**:

| Role | Access | Auth Method |
|------|--------|-------------|
| **Student** | Read-only dashboard | Enter Name + Branch → Sign in with Google (OAuth) |
| **SPC Admin** | Full CRUD (add, edit, delete) | Email + Password (verified against DB) |

Students see everything but can't modify anything. Admins manage the entire pipeline.

---

## 2. Core Features & Sections

The dashboard has **three main sections** (tabs):

### 2.1 — Companies to Come (Upcoming)
Companies that are expected to visit campus but haven't started their process yet.

**Fields:**
- Company Name
- Tentative Date of visit
- Critical Info (text — eligibility, CGPA cutoff, branches, notes)
- Attachment (optional — link to PDF/document with detailed eligibility or JD)

**Student view:** Read-only, expandable cards.
**Admin view:** Can add new companies, edit existing ones, delete entries.

### 2.2 — Ongoing Drives (Active)
Companies currently in the middle of their placement process on campus.

**Fields:**
- Company Name
- Job Description (role, location, CTC, skills required)
- Status — one of two states:
  - **Google Form Created**: Shows GForm link + deadline with countdown timer. Students can click to fill the form directly.
  - **Rounds Ongoing**: Shows current round name (e.g., "Technical Interview Round 2"), round number, total rounds, and a visual progress bar.

**Student view:** Read-only. Can see JD, round status, and click GForm links.
**Admin view:** Can add drives, toggle between GForm/Round status, update round progress, edit all fields.

### 2.3 — Placement Completed
Companies whose entire placement process is finished.

**Fields:**
- Company Name
- Job Description (role, CTC, location — for reference)
- Final list of students given to company — **downloadable attachment** (Google Drive link)
- Selected students list — **downloadable attachment** (Google Drive link)
- Number of students selected
- SPC Member who compiled the list — **Name, Phone, Email** (for transparency and accountability)

**Student view:** Read-only. Can view JD, download both lists, see who compiled it.
**Admin view:** Full edit, add, delete.

---

## 3. Authentication

### 3.1 — Student Login
1. Student enters **Name** and selects **Branch/Department** from dropdown.
2. Clicks **"Sign in with Google"** button.
3. In production: triggers Google OAuth popup → authenticates → redirects to dashboard.
4. No email/password fields needed. Any student with a Google account can sign in.
5. Session stores: `{ name, branch, googleEmail (from OAuth) }`
6. All students get **read-only** access. No edit/add/delete buttons are visible.

### 3.2 — SPC Admin Login
1. Admin enters **Email** and **Password**.
2. Credentials are checked against the database (table: `spc_admins`).
3. If match → redirected to dashboard with full admin privileges.
4. If no match → error: "Invalid email or password."
5. No Google OAuth for admins — strictly email + password.
6. Admins see **edit (pencil), delete (trash), and add (+) buttons** on every card.

### Available Branches (Dropdown)
```
Computer Engineering, Electronics & Comm., Mechanical Engineering,
Civil Engineering, Electrical Engineering, MBA, MCA, B.Com (H), BBA
```

---

## 4. Frontend Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18+ |
| Styling | Inline styles / Tailwind CSS |
| State Management | React useState (local) — can migrate to Zustand/Context for scale |
| Auth | Google OAuth 2.0 (students) + custom email/password (admins) |
| Routing | Single-page — tab-based navigation (no React Router needed for MVP) |
| Hosting | Vercel / Netlify (free tier) |

### Component Tree
```
App
├── LoginScreen
│   ├── StudentLogin (Name + Branch + Google Sign-in)
│   └── AdminLogin (Email + Password)
│
└── Dashboard
    ├── TopBar (logo, user info, role badge, logout)
    ├── StatsStrip (4 stat cards: Upcoming, Active, Completed, Placed)
    ├── TabBar (Upcoming | Ongoing | Completed)
    │
    ├── UpcomingTab
    │   ├── AddButton (admin only)
    │   └── UpcomingCard[] (expandable, edit/delete for admin)
    │
    ├── OngoingTab
    │   ├── AddButton (admin only)
    │   └── OngoingCard[] (GForm or Round status, expandable)
    │
    ├── CompletedTab
    │   ├── AddButton (admin only)
    │   └── CompletedCard[] (JD, attachments, SPC info, expandable)
    │
    └── Modal (shared)
        ├── UpcomingForm
        ├── OngoingForm
        └── CompletedForm
```

### Key UI Patterns
- **Cards are expandable** — tap/click to reveal full details (JD, info, attachments)
- **Color-coded borders** — Amber (upcoming), Blue (ongoing), Green (completed)
- **Role-based rendering** — `isAdmin` prop controls visibility of all edit/delete/add buttons
- **Modal forms** — all CRUD operations happen in overlay modals, not inline
- **Progress bar** — visual indicator for ongoing rounds (Round 2/4 = 50% filled)
- **Deadline countdown** — real-time "3 days left" / "5 hours left" / "Expired" for GForms
- **Responsive** — works on mobile (students will mostly check on phones)

---

## 5. Backend Architecture

### Tech Stack (Recommended)
| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js + Express **or** Python + FastAPI | Quick to build REST APIs |
| Auth | Google OAuth 2.0 + bcrypt for admin passwords | Industry standard |
| ORM | Prisma (Node) or SQLAlchemy (Python) | Type-safe DB queries |
| File Storage | Google Drive links (no self-hosting needed) | Students already use GDrive |
| Hosting | Railway / Render / Supabase (free tier) | Easy deployment |

### API Endpoints

```
AUTH
POST   /api/auth/google          → Google OAuth callback (student login)
POST   /api/auth/admin/login     → { email, password } → JWT token
POST   /api/auth/logout          → Invalidate session
GET    /api/auth/me              → Current user info + role

UPCOMING COMPANIES
GET    /api/upcoming             → List all upcoming companies
POST   /api/upcoming             → [Admin] Create new upcoming company
PUT    /api/upcoming/:id         → [Admin] Update upcoming company
DELETE /api/upcoming/:id         → [Admin] Delete upcoming company

ONGOING DRIVES
GET    /api/ongoing              → List all ongoing drives
POST   /api/ongoing              → [Admin] Create new ongoing drive
PUT    /api/ongoing/:id          → [Admin] Update ongoing drive (status, round, gform)
DELETE /api/ongoing/:id          → [Admin] Delete ongoing drive

COMPLETED DRIVES
GET    /api/completed            → List all completed drives
POST   /api/completed            → [Admin] Create new completed drive
PUT    /api/completed/:id        → [Admin] Update completed drive
DELETE /api/completed/:id        → [Admin] Delete completed drive
```

### Middleware
```
authMiddleware     → Verifies JWT token on every request
adminOnly          → Blocks non-admin users from POST/PUT/DELETE routes
rateLimiter        → Prevents abuse (100 req/min per IP)
```

---

## 6. Database Schema

### Recommended: PostgreSQL (via Supabase or Railway)

```sql
-- ═══════════════════════════════════════
--  ADMIN USERS (SPC Members)
-- ═══════════════════════════════════════
CREATE TABLE spc_admins (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,        -- bcrypt hashed
    phone         VARCHAR(20),
    created_at    TIMESTAMP DEFAULT NOW(),
    is_active     BOOLEAN DEFAULT TRUE
);

-- ═══════════════════════════════════════
--  STUDENT SESSIONS (logged via Google OAuth)
-- ═══════════════════════════════════════
CREATE TABLE student_sessions (
    id            SERIAL PRIMARY KEY,
    google_email  VARCHAR(150) NOT NULL,
    name          VARCHAR(100) NOT NULL,
    branch        VARCHAR(100) NOT NULL,
    logged_in_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
--  UPCOMING COMPANIES
-- ═══════════════════════════════════════
CREATE TABLE upcoming_companies (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    tentative_date  DATE NOT NULL,
    info            TEXT,                        -- critical info / eligibility
    attachment_name VARCHAR(200),                -- e.g. "Eligibility.pdf"
    attachment_url  TEXT,                        -- Google Drive link
    created_by      INTEGER REFERENCES spc_admins(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
--  ONGOING DRIVES
-- ═══════════════════════════════════════
CREATE TABLE ongoing_drives (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,       -- company name
    jd              TEXT NOT NULL,                -- job description
    status          VARCHAR(20) NOT NULL          -- 'gform' or 'round'
                    CHECK (status IN ('gform', 'round')),

    -- Fields used when status = 'round'
    current_round   VARCHAR(200),                -- e.g. "Technical Interview Round 2"
    round_number    INTEGER DEFAULT 0,
    total_rounds    INTEGER DEFAULT 0,

    -- Fields used when status = 'gform'
    gform_link      TEXT,                        -- Google Form URL
    gform_deadline  TIMESTAMP,                   -- deadline with time

    created_by      INTEGER REFERENCES spc_admins(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
--  COMPLETED DRIVES
-- ═══════════════════════════════════════
CREATE TABLE completed_drives (
    id                        SERIAL PRIMARY KEY,
    name                      VARCHAR(200) NOT NULL,     -- company name
    jd                        TEXT NOT NULL,              -- job description

    -- Attachments (Google Drive links)
    final_list_name           VARCHAR(200),               -- e.g. "Flipkart_Shortlisted.pdf"
    final_list_url            TEXT,                        -- link to final list given to company
    selected_list_name        VARCHAR(200),               -- e.g. "Flipkart_Selected.pdf"
    selected_list_url         TEXT,                        -- link to selected students list

    selected_count            INTEGER DEFAULT 0,          -- number of students selected

    -- SPC member who compiled the list (for transparency)
    spc_member_name           VARCHAR(100) NOT NULL,
    spc_member_phone          VARCHAR(20),
    spc_member_email          VARCHAR(150),

    created_by                INTEGER REFERENCES spc_admins(id),
    created_at                TIMESTAMP DEFAULT NOW(),
    updated_at                TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
--  AUDIT LOG (track all admin actions)
-- ═══════════════════════════════════════
CREATE TABLE audit_log (
    id            SERIAL PRIMARY KEY,
    admin_id      INTEGER REFERENCES spc_admins(id),
    action        VARCHAR(50) NOT NULL,          -- 'CREATE', 'UPDATE', 'DELETE'
    table_name    VARCHAR(50) NOT NULL,          -- 'upcoming_companies', etc.
    record_id     INTEGER NOT NULL,
    old_data      JSONB,                         -- snapshot before change
    new_data      JSONB,                         -- snapshot after change
    performed_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
--  INDEXES
-- ═══════════════════════════════════════
CREATE INDEX idx_upcoming_date ON upcoming_companies(tentative_date);
CREATE INDEX idx_ongoing_status ON ongoing_drives(status);
CREATE INDEX idx_completed_name ON completed_drives(name);
CREATE INDEX idx_audit_admin ON audit_log(admin_id);
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_student_sessions_email ON student_sessions(google_email);
```

### Entity Relationship Summary

```
spc_admins ──┬──< upcoming_companies
             ├──< ongoing_drives
             ├──< completed_drives
             └──< audit_log

student_sessions (standalone — just logs who visited)
```

---

## 7. Deployment Plan

### Phase 1 — MVP (Current: Frontend Prototype)
- [x] React single-file app with mock data
- [x] Student login (Name + Branch + Google button)
- [x] Admin login (Email + Password)
- [x] Three sections: Upcoming, Ongoing, Completed
- [x] Full CRUD for admin via modal forms
- [x] Read-only for students
- [x] Stats dashboard

### Phase 2 — Backend + DB
- [ ] Set up PostgreSQL (Supabase recommended — free, has built-in auth)
- [ ] Build REST API (Node/Express or FastAPI)
- [ ] Wire up Google OAuth for student login
- [ ] Implement bcrypt password hashing for admin credentials
- [ ] Connect frontend to API (replace mock data with fetch calls)
- [ ] Deploy backend (Railway/Render)

### Phase 3 — Enhancements
- [ ] Move companies between sections (Upcoming → Ongoing → Completed) with one click
- [ ] Email/WhatsApp notifications when new drive is added or student is shortlisted
- [ ] Student-specific view: "My Applications" — see status across all companies
- [ ] Analytics dashboard: branch-wise placement %, package distribution, year-over-year
- [ ] Calendar view for upcoming drives
- [ ] File upload (instead of only Google Drive links)

### Phase 4 — Scale
- [ ] Resume bank with filters
- [ ] Company feedback forms
- [ ] Historical data (past years)
- [ ] Mobile app (React Native)

---

## 8. File Structure (Recommended for Production)

```
jmi-placement-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── StatsStrip.jsx
│   │   │   ├── TabBar.jsx
│   │   │   ├── cards/
│   │   │   │   ├── UpcomingCard.jsx
│   │   │   │   ├── OngoingCard.jsx
│   │   │   │   └── CompletedCard.jsx
│   │   │   ├── forms/
│   │   │   │   ├── UpcomingForm.jsx
│   │   │   │   ├── OngoingForm.jsx
│   │   │   │   └── CompletedForm.jsx
│   │   │   └── Modal.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── upcoming.js
│   │   ├── ongoing.js
│   │   └── completed.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminOnly.js
│   ├── models/
│   │   └── schema.prisma (or SQLAlchemy models)
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql          ← the SQL from Section 6
│
├── claude.md               ← this file
└── README.md
```

---

## 9. Key Design Decisions

| Decision | Reasoning |
|----------|-----------|
| No email for students | Reduces friction — students just want to check status quickly |
| Google OAuth for students | Familiar, secure, no passwords to manage |
| Email + Password for admins | SPC needs controlled access — only specific people should edit |
| Attachments as links (not uploads) | Simpler infrastructure, students already use Google Drive |
| Audit log table | Placements can have disputes — "who changed the list?" needs to be traceable |
| SPC member info on completed drives | Accountability and transparency — students know who compiled each list |
| Single-page tabs (not routing) | Simpler for MVP, can add React Router later if needed |

---

## 10. Security Considerations

- **Admin passwords**: Never stored in plaintext. Always use bcrypt with salt rounds ≥ 12.
- **JWT tokens**: Short expiry (24h), stored in httpOnly cookies (not localStorage).
- **CORS**: Restrict to your frontend domain only.
- **Rate limiting**: 100 requests/min per IP to prevent abuse.
- **Input sanitization**: Escape all user inputs before DB queries (Prisma/SQLAlchemy handle this).
- **Admin credential rotation**: Change passwords at the start of each placement season.
- **HTTPS only**: Force SSL in production.

---

*Last updated: February 2026*
*Built for Student Placement Cell, Jamia Millia Islamia*
