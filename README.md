# AssetFlow

<div align="center">

<img src="./client/public/logo.png" alt="AssetFlow Logo" width="180"/>

# Enterprise Asset & Resource Management System

### Track • Allocate • Maintain

A hackathon-stage asset and resource management platform with a Prisma-backed backend, JWT authentication, role-based access control, and a React/Vite dashboard shell.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)

</div>

---

## Overview

AssetFlow is an implementation-focused prototype for managing organizational assets, allocations, bookings, maintenance requests, and role-aware dashboards. The repository currently contains:

- A Node.js + Express backend with route/controller/service layers
- A Prisma schema targeting PostgreSQL
- JWT-based auth and role middleware
- A React + Vite client with a protected dashboard layout and multiple feature pages

This README reflects the state of the repository as currently checked in, not a future roadmap.

---

## Live Deployments

- **Frontend (Vercel):** [https://asset-flow-odoo-hackathon-nine.vercel.app/](https://asset-flow-odoo-hackathon-nine.vercel.app/)
- **Backend API (Render):** [https://assetflow-odoo-hackathon-usy2.onrender.com/](https://assetflow-odoo-hackathon-usy2.onrender.com/)

---

## What is implemented today

### Backend

The backend is organized as Router → Controller → Service → Prisma and exposes modules for:

- Authentication: signup, login, current-user lookup, logout, forgot-password stub
- Departments, employees, categories
- Assets: create/update/list/detail/history/QR endpoints
- Allocations: allocate, return, transfer
- Bookings: create, cancel, list, calendar view, update status
- Maintenance: create, list, detail, update status workflow
- Dashboard analytics: role-based summaries and recent activity data

The server entry point is [server/server.js](server/server.js), and the main API router is [server/src/routes/index.js](server/src/routes/index.js).

### Frontend

The client uses Vite + React Router and currently includes route-level pages for:

- Login
- Dashboard
- Organization / departments and employees
- Assets
- Allocation
- Audit
- Reports
- Maintenance
- Resource booking
- Notifications
- Settings

The shell layout is defined in [client/src/layouts/DashboardLayout.jsx](client/src/layouts/DashboardLayout.jsx), and the top-level routes are declared in [client/src/App.jsx](client/src/App.jsx).

### Database model

The Prisma schema in [server/src/prisma/schema.prisma](server/src/prisma/schema.prisma) defines the core models:

- Department
- User
- Category
- Asset
- Allocation
- TransferRequest
- Booking
- MaintenanceRequest
- AuditCycle
- AuditReport
- Notification
- ActivityLog

It also defines enums for user roles and status values such as AssetStatus, BookingStatus, MaintenanceStatus, TransferStatus, and AuditStatus.

---

## Supported roles

The auth and role middleware support the following roles from the Prisma enum:

- ADMIN
- ASSET_MANAGER
- DEPARTMENT_HEAD
- EMPLOYEE

Role-gated access is enforced on several routes through [server/src/middleware/role.middleware.js](server/src/middleware/role.middleware.js).

---

## Current feature status

### Functional in the codebase

- User registration and login with password hashing
- JWT authentication and current-user retrieval
- Department, employee, category, and asset CRUD-style services
- Asset allocation, return, and transfer workflows
- Booking creation with overlap checks and status transitions
- Maintenance request creation and workflow updates
- Dashboard summary queries for different roles
- Prisma-backed persistence with PostgreSQL

### Present but not fully wired yet

- The frontend contains multiple feature pages and a dashboard shell, but the client service files under [client/src/services](client/src/services) are still empty stubs in the current checkout.
- The forgot-password endpoint is implemented as a stub and returns a 501 response.
- Some route pages appear to be UI-first shells rather than fully connected to live API calls.

---

## Tech stack

### Frontend

- React 19
- Vite 8
- React Router
- Recharts
- lucide-react
- Axios (available in package manifest, but service files are not yet populated)

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL via Prisma adapter
- JWT + bcrypt + zod

---

## Project structure

```text
AssetFlow-Odoo_Hackathon/
├── client/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       └── services/
├── docs/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   └── services/
│   └── server.js
└── README.md
```

---

## Getting started

### 1. Clone the repository

```bash
git clone <your-fork-url>
cd AssetFlow-Odoo_Hackathon
```

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the server folder:

```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
JWT_SECRET="replace-with-a-secure-secret"
NODE_ENV=development
```

### 4. Prepare the database

From the server directory:

```bash
npm run db:generate
npm run db:migrate:dev
```

If you prefer to push the schema directly instead of migrating:

```bash
npm run db:push
```

### 5. Run the app

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

The backend will expose the API under `/api`, and the frontend will run from Vite's dev server.

---

## Available scripts

### Server

- `npm run dev` — start the backend with nodemon
- `npm start` — start the backend in normal Node mode
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate:dev` — create and apply migrations
- `npm run db:migrate:deploy` — apply existing migrations
- `npm run db:push` — sync schema without migrations
- `npm run db:seed` — run Prisma seed
- `npm run db:studio` — open Prisma Studio
- `npm run db:reset` — reset the database

### Client

- `npm run dev` — start Vite dev server
- `npm run build` — build the frontend bundle
- `npm run lint` — run ESLint
- `npm run preview` — preview the built app

---

## Notes for contributors

- The backend code is the most complete part of the repository and should be treated as the primary source of truth for implemented behavior.
- The frontend includes many route pages and a polished layout, but live API integration is still a follow-up task in the current state.
- The documentation in [docs](docs) may be useful for understanding the intended architecture, although the implementation should always be checked directly in the code.

---

## Contributors

Built during the hackathon by:

- Parnil Vyawahare
- Sasmit Narnaware
- Raina George
- Aayushman Shukla

---

## License

No dedicated LICENSE file is currently present in the repository root. The server package declares ISC in [server/package.json](server/package.json).