# Integration Guide

> **Project:** AssetFlow -- Enterprise Asset & Resource Management System

## Overview
This document outlines how the React Frontend interfaces with the Node.js/Express Backend. It covers authentication flows, standard request/response patterns, error handling, and state synchronization.

## 1. Authentication Flow
AssetFlow uses a stateless JWT (JSON Web Token) authentication mechanism.

### Login Sequence
1. **Frontend:** User submits credentials via the `/login` page.
2. **Backend:** Validates credentials against the database.
3. **Backend:** Returns a signed JWT and user metadata (role, id, name).
4. **Frontend:** Stores the JWT in `localStorage` (or HTTP-only cookies).
5. **Frontend:** Sets the default `Authorization` header for all subsequent Axios/Fetch requests:
   ```javascript
   Authorization: Bearer <TOKEN>
   ```

### Logout Sequence
1. **Frontend:** Clears the token from `localStorage`.
2. **Frontend:** Redirects the user to `/login`.

## 2. API Communication
All frontend API calls should route through a centralized API service layer (or Axios instance) to ensure headers, tokens, and error handling are universally applied.

### Axios Instance Configuration
```javascript
import axios from 'react';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (Inject Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 3. Standard Request/Response Patterns

### Request Format
All POST/PUT/PATCH requests must send `application/json` payloads matching the Prisma schema constraints documented in `APIBlueprint.md`.

### Success Response Format
The backend wraps all success responses in a standard JSON structure:
```json
{
  "status": "success",
  "data": { ... } // Payload (Asset, Employee, etc.)
}
```

### Error Response Format
If a request fails (4xx, 5xx), the backend returns a standardized error format. The frontend should capture this and display appropriate toast notifications or form errors.
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

## 4. Frontend State Management
Currently, the frontend relies on React local state (`useState`, `useEffect`) and prop-drilling for localized components. 

For global state (e.g., current user session, organization details):
- Use React Context API.
- For complex data-fetching and caching, it is highly recommended to integrate **React Query (TanStack Query)**. React Query will handle loading states, error states, and cache invalidation automatically.

## 5. Environment Variables
To connect the frontend to the backend, ensure you have a `.env` file in your `client` directory:

```env
# client/.env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 6. End-to-End Testing (Connecting the Dots)
To run the full stack locally:
1. **Database:** Ensure Postgres is running and the database is seeded (`npm run seed` in `/server`).
2. **Backend:** Start the Express server (`npm run dev` in `/server`). It runs on `localhost:5000`.
3. **Frontend:** Start the Vite dev server (`npm run dev` in `/client`). It runs on `localhost:5173`.
4. **Test:** Navigate to `localhost:5173/login`, authenticate, and observe the Network tab to verify successful 200 OK responses matching the `APIBlueprint.md`.
