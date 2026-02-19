# JMI Placement Tracker

A placement management dashboard for the Student Placement Cell (SPC) of Jamia Millia Islamia.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running

### 1. Database Setup

```bash
# Create the database
createdb placement_tracker
```

### 2. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run prisma:seed    # creates admin user + sample data
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jmi.ac.in | admin123 |
| Student | (any name + branch) | — |

## Project Structure

```
placement-tracker/
├── backend/
│   ├── prisma/          # Schema + seed
│   ├── routes/          # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── pages/       # Login, Dashboard
│   │   └── components/  # Cards, Forms, Modal
│   └── index.html
└── claude.md            # Full project docs
```
