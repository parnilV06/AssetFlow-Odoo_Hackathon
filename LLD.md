# AssetFlow - Low-Level Design (LLD)

## 1. Frontend Design

### 1.1 Component Architecture
The React frontend strictly follows a "Smart vs. Dumb" (Container vs. Presentational) component pattern.
- **Pages (`src/pages/`)**: Smart components. Hold state, manage API interactions, and handle side-effects. Examples: `Dashboard`, `Assets`, `Allocation`.
- **Components (`src/components/`)**: Dumb components. Pure functions of their props. They emit events via callbacks. Examples: `Button`, `Table`, `StatusBadge`, `Charts`.
- **Layouts (`src/layouts/`)**: Structural components like `DashboardLayout` that provide consistent framing (Sidebar, Header) across routes without remounting during navigation.

### 1.2 State Management
- **Local State:** Managed via `useState` and `useReducer` for form inputs and UI toggles.
- **Global State/Auth:** Managed via React Context API to provide the current user session globally.
- **Server State:** Handled via custom API service wrappers (or tools like React Query) to fetch, cache, and synchronize data from the Express API.

### 1.3 Styling & Design System
Vanilla CSS is used with CSS Custom Properties defined in `index.css`.
- **Variables:** Define `--primary`, `--bg-main`, `--text-main`, `--spacing-*`, and `--radius-*`.
- **Utility Classes:** Global classes like `.card`, `.page-container`, `.page-header` ensure UI consistency.

## 2. Backend Design

### 2.1 Request Lifecycle
`Client Request` -> `Express Router` -> `Auth/Role Middleware` -> `Controller` -> `Service` -> `Prisma Client` -> `Database`

### 2.2 Directory Structure
- `server/src/routes/`: Define API endpoints and attach middleware.
- `server/src/controllers/`: Handle req/res objects, invoke services, and return standard JSON formats (`{ "status": "success", "data": ... }`).
- `server/src/services/`: Pure JavaScript functions containing business logic, validation rules, and Prisma calls.
- `server/src/middleware/`: Reusable request interceptors (e.g., `role.middleware.js` to check if a user has `ADMIN` or `ASSET_MANAGER` privileges).
- `server/src/prisma/`: Contains `schema.prisma` defining database models.

### 2.3 Authentication & Authorization Flow
- **Login:** The `/auth/login` endpoint validates credentials and signs a JWT containing the user's `id` and `role`.
- **Authorization:** `AuthMiddleware` verifies the JWT on protected routes. `RoleMiddleware` checks the user's role against a required list (e.g., `['ADMIN', 'ASSET_MANAGER']`).

## 3. Database Schema Design (Prisma)

### 3.1 Core Models & Relationships
- **User:** Belongs to a `Department`. Has many `Allocations`, `Bookings`, and `MaintenanceRequests`.
- **Department:** Hierarchical (can have parent/child). Has many `Users` and `Assets`.
- **Category:** Logical grouping for `Assets`.
- **Asset:** Core entity. Has a `Category`, optional `Department`, and tracks its `status` (Enum). Has many `Allocations`, `Bookings`, `MaintenanceRequests`.
- **Allocation:** Junction table with history. Links `User` and `Asset` with `allocatedAt` and `returnedAt` timestamps.
- **Booking:** Time-bound link between `User` and `Asset`. Contains `startTime`, `endTime`, and overlap prevention logic.
- **MaintenanceRequest:** Links `User` (requester), `Asset`, and optionally a technician `User`. Tracks resolution workflow.
- **ActivityLog:** Append-only table capturing `userId`, `action`, `entityType`, and `metadata`.

### 3.2 Enums
To enforce data integrity, PostgreSQL enums are used heavily:
- `UserRole`: ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE
- `AssetStatus`: AVAILABLE, ALLOCATED, RESERVED, UNDER_MAINTENANCE, LOST, RETIRED, DISPOSED
- `BookingStatus`: UPCOMING, ONGOING, COMPLETED, CANCELLED
- `MaintenanceStatus`: PENDING, APPROVED, REJECTED, ASSIGNED, IN_PROGRESS, RESOLVED

## 4. API Specification Snippets
APIs follow RESTful conventions. Example endpoints:
- `POST /api/auth/login`: Authenticate and get JWT.
- `GET /api/assets`: Fetch paginated assets (supports query params: search, category, status).
- `POST /api/allocate`: Allocate an asset. Business logic prevents allocation if asset status is not `AVAILABLE`.
- `POST /api/bookings`: Create a reservation. Business logic throws `409 Conflict` if time ranges overlap for the same asset.
