# AssetFlow - High-Level Design (HLD)

## 1. Overview
AssetFlow follows a standard modern 3-tier architecture: a Client-Side Single Page Application (SPA), a RESTful API backend, and a relational database. This separation of concerns allows for independent scaling, distinct development lifecycles, and a clean delineation of business logic from presentation.

## 2. Architecture Diagram

```
[ Client (React SPA) ]
         │
         │ (HTTP / JSON + JWT)
         ▼
[ Express.js API ]
         │
         │ (Prisma ORM Queries)
         ▼
[ PostgreSQL Database ]
```

## 3. Technology Stack

### 3.1 Frontend (Client)
- **Framework:** React 18
- **Build Tool:** Vite 8
- **Routing:** React Router v6
- **Styling:** Vanilla CSS with custom CSS variables (no heavy UI frameworks)
- **Visualization:** Recharts for dashboard analytics
- **Icons:** Lucide React

### 3.2 Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing
- **Validation:** Zod (for request payload validation)

### 3.3 Database
- **Engine:** PostgreSQL 16+
- **Management:** Prisma Migrations

## 4. High-Level Components

### 4.1 The Client App
The React application acts as the presentation layer. It consumes the REST API to perform CRUD operations. It is responsible for:
- Managing client-side routing and protected routes.
- Persisting the JWT token.
- Enforcing layout consistency (Dashboard Shell, Sidebar, Header).
- Providing interactive forms, data tables, and visual dashboards.

### 4.2 The Express API Server
The Express backend is the core application server. It enforces business rules, handles authorization, and communicates with the database. It is structured in a layered pattern:
- **Routes:** Map HTTP endpoints to specific controllers.
- **Middleware:** Intercept requests for Auth validation, Role checking, and Error Handling.
- **Controllers:** Extract HTTP request data, call appropriate services, and format HTTP responses.
- **Services:** Contain pure business logic and interact with the database via Prisma.

### 4.3 The Database
PostgreSQL serves as the persistent data store. The database schema strictly enforces relational integrity through foreign keys, unique constraints, and enums (e.g., restricting statuses to known values like `AVAILABLE`, `ALLOCATED`).

## 5. Deployment Architecture
AssetFlow is designed to be deployed in a cloud-native environment:
- **Frontend Hosting:** Vercel (static file serving and edge caching).
- **Backend Hosting:** Render or similar PaaS (Node.js runtime environment).
- **Database Hosting:** Neon or AWS RDS (Managed PostgreSQL).
