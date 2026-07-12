# AssetFlow Backend Architecture

## Overview

## Tech Stack

## Folder Structure

## Architecture Pattern

Client
↓
Routes
↓
Controllers
↓
Services
↓
Prisma
↓
PostgreSQL

## Request Lifecycle

## Authentication Flow

## Role Based Authorization

## Middleware

- Auth Middleware
- Role Middleware
- Error Handler
- Validation

## Modules

### Auth Module

Responsibilities

Folder Structure

Routes

Controllers

Services

JWT Flow

---

### Dashboard Module

Responsibilities

Endpoints

Business Logic

---

### Department Module

Responsibilities

Database Relations

Routes

Controllers

Validation

Business Rules

---

### Employee Module

...

---

### Asset Module

Asset Registration

Asset Lifecycle

QR Generation

Search

Filters

Business Rules

Conflict Rules

---

### Allocation Module

Allocation Flow

Transfer Flow

Return Flow

Conflict Detection

History

---

### Booking Module

Calendar

Overlap Validation

Booking Status

Conflict Rules

---

### Maintenance Module

Workflow

Approval Process

Asset Status Updates

---

### Audit Module

Audit Cycle

Reports

Verification

---

### Notifications Module

Notification Types

Creation Rules

Read Status

---

### Activity Logs

Logged Events

Automatic Logging

Database Design

---

## Error Handling

HTTP Status Codes

Validation Errors

Authorization Errors

Conflict Errors

---

## Environment Variables

DATABASE_URL

JWT_SECRET

PORT

NODE_ENV

---

## Deployment Architecture

Frontend

↓

Render API

↓

Neon
