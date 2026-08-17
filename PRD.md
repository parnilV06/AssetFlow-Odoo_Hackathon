# AssetFlow - Product Requirements Document (PRD)

## 1. Overview
AssetFlow is an Enterprise Asset & Resource Management System designed to track, allocate, and maintain organizational assets efficiently. It provides a comprehensive solution for managing the complete lifecycle of physical and digital resources within an organization, from procurement to disposal.

## 2. Target Audience
- **IT & Asset Managers:** Need to track hardware/software, manage maintenance, and conduct audits.
- **Department Heads:** Need visibility into their team's assets and resource utilization.
- **Employees:** Need to request assets, book shared resources, and raise maintenance tickets.
- **System Administrators:** Need to manage users, roles, and organizational structures.

## 3. Key Features

### 3.1 Authentication & Authorization
- **JWT-based Authentication:** Secure login using email and password.
- **Role-Based Access Control (RBAC):** Distinct roles with specific permissions:
  - `ADMIN`: Full system access, department and user management.
  - `ASSET_MANAGER`: Asset lifecycle, allocations, maintenance oversight.
  - `DEPARTMENT_HEAD`: Visibility into departmental assets and bookings.
  - `EMPLOYEE`: View own allocations, book resources, raise maintenance requests.

### 3.2 Asset Management
- **Asset Directory:** Centralized registry of all assets with auto-generated asset tags and serial numbers.
- **Categories:** Logical grouping of assets (e.g., Laptops, Projectors).
- **Asset Status Tracking:** Real-time status updates (`AVAILABLE`, `ALLOCATED`, `UNDER_MAINTENANCE`, `RETIRED`, etc.).
- **History Tracking:** Immutable audit trail of an asset's allocation and maintenance history.

### 3.3 Allocations & Transfers
- **Asset Allocation:** Assigning assets to specific employees with expected return dates.
- **Asset Return:** Logging the return of assets and updating conditions.
- **Transfer Workflow:** A multi-step approval workflow (`Requested` -> `Approved` -> `Completed`) for transferring assets between users or departments.

### 3.4 Resource Booking
- **Time-bound Reservations:** Employees can book shared assets for specific time slots.
- **Conflict Resolution:** System prevents double-booking and overlapping reservations.
- **Status Management:** Bookings progress through statuses (`UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`).

### 3.5 Maintenance Ticketing
- **Issue Reporting:** Users can raise maintenance requests with priority levels.
- **Workflow Management:** Requests move through a defined pipeline (`PENDING`, `APPROVED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`).
- **Automatic Status Sync:** Approving a maintenance ticket automatically sets the asset status to `UNDER_MAINTENANCE`.

### 3.6 Audits
- **Audit Cycles:** Scheduled company-wide or department-wide asset audits.
- **Verification:** Field for auditors to confirm physical presence and condition of assets.

### 3.7 Dashboard & Analytics
- **Role-Specific Dashboards:** Summaries tailored to the user's role.
- **Key Metrics:** Assets available vs. allocated, active bookings, overdue returns, and maintenance loads.

### 3.8 Notifications & Activity Logs
- **In-App Notifications:** Alerts for workflow approvals, upcoming returns, etc.
- **Activity Logging:** Append-only logs for all critical system actions for compliance.

## 4. Non-Functional Requirements
- **Performance:** Single Page Application (SPA) architecture for instantaneous page transitions.
- **Security:** Passwords hashed via bcrypt, route protection via middleware, and stateless JWT authentication.
- **Usability:** A consistent, responsive "Vanilla CSS" design system with clear typography and soft shadows, optimizing for enterprise user experience.
- **Reliability:** PostgreSQL database with Prisma ORM ensuring data integrity and transactional safety.
