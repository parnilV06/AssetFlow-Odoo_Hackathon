# Frontend Architecture

> **Project:** AssetFlow -- Enterprise Asset & Resource Management System

## Overview
AssetFlow's frontend is a modern Single Page Application (SPA) built using React.js. It follows a modular, component-based architecture designed for scalability, maintainability, and enterprise-grade user experiences.

## Technology Stack
- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Vanilla CSS with CSS Variables (Custom Properties) for theming
- **Icons:** Lucide React
- **Charting:** Recharts
- **Build Tool:** Vite

## Directory Structure
The `client/src` directory is organized into logical feature and architectural domains:

```text
client/src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable, stateless UI components
│   ├── Button/     # Button variants
│   ├── Charts/     # Recharts wrappers (BarChart, DonutChart, etc.)
│   ├── Common/     # Header, Sidebar, Layout wrappers
│   ├── Input/      # SearchInput, Forms
│   ├── Status/     # StatusBadge, PriorityBadge
│   └── Table/      # Table, TableRow, Pagination
├── layouts/        # Page layout wrappers (e.g., DashboardLayout)
├── pages/          # Stateful, route-level components
│   ├── Allocation/ # Asset allocation screens
│   ├── Assets/     # Asset directory and management
│   ├── Audit/      # Audit cycle management
│   ├── Dashboard/  # Main KPI dashboard
│   ├── Login/      # Authentication screens
│   ├── Maintenance/# Maintenance ticketing
│   ├── Notifications/# Notification center
│   ├── Organization/# Employees, Departments
│   ├── Reports/    # Reporting and analytics
│   └── Settings/   # User and system settings
├── App.jsx         # Root component and Route definitions
├── index.css       # Global styles, variables, and utility classes
└── main.jsx        # React DOM entry point
```

## Design System & Styling
The application uses a strict Vanilla CSS design system powered by CSS variables in `index.css`. This ensures consistency and makes dark mode or theming trivial.

### Core CSS Variables
- **Colors:** `--primary` (`#0052cc`), `--bg-main` (`#f8f9fc`), `--bg-surface` (`#ffffff`)
- **Text:** `--text-main`, `--text-secondary`, `--text-tertiary`
- **Spacing:** `--spacing-xs` (4px) to `--spacing-xl` (32px)
- **Border Radius:** `--radius-sm`, `--radius-md`, `--radius-lg`

### Global Utility Classes
- `.card`: Provides a standard white surface with borders and a soft shadow.
- `.page-container`: Defines the standard layout boundaries for full pages.
- `.page-header`: Standardized margin and flex layouts for page titles.
- `.page-title`: Standardized `h1` typography for page headers.

## Component Architecture
We strictly follow a "Smart vs. Dumb" (Container vs. Presentational) component pattern:
- **Pages (`src/pages/`)**: "Smart" components. They hold state, manage API interactions, and pass data down as props.
- **Components (`src/components/`)**: "Dumb" components. They receive props and emit events via callbacks. They are entirely stateless regarding business logic.

## Routing
Routing is handled by `React Router DOM` in `App.jsx`. 
We use a persistent `DashboardLayout` that wraps most internal routes, ensuring the Sidebar and Header are never unmounted or re-rendered during navigation, resulting in instantaneous page transitions.
