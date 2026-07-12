# API Blueprint

> **Project:** AssetFlow -- Enterprise Asset & Resource Management
> System

## API Conventions

**Base URL**

``` text
/api
```

**Authentication** - JWT Bearer Token - `Authorization: Bearer <token>`

**Content Type**

``` http
Content-Type: application/json
```

------------------------------------------------------------------------

# Authentication

## POST `/auth/signup`

### Description

Create a new employee account. Every signup is created with the
**EMPLOYEE** role.

### Access

Public

### Request

``` json
{
  "name":"John Doe",
  "email":"john@example.com",
  "password":"password123"
}
```

### Success

`201 Created`

``` json
{
  "message":"Account created successfully"
}
```

### Errors

-   400 Invalid data
-   409 Email already exists

### Business Rules

-   Password hashed with bcrypt.
-   Role is always `EMPLOYEE`.
-   Users cannot self-promote.

------------------------------------------------------------------------

## POST `/auth/login`

Authenticate user and return JWT.

Request

``` json
{
  "email":"john@example.com",
  "password":"password123"
}
```

Success

``` json
{
  "token":"jwt_token",
  "user":{
    "id":1,
    "name":"John",
    "role":"EMPLOYEE"
  }
}
```

Errors - 401 Invalid credentials

------------------------------------------------------------------------

## GET `/auth/me`

Returns currently logged in user.

Access Authenticated

------------------------------------------------------------------------

# Departments

## GET `/departments`

Returns all departments.

## POST `/departments`

Admin only.

Request

``` json
{
  "name":"IT",
  "parentDepartmentId":null
}
```

Rules - Department names should be unique.

## PATCH `/departments/:id`

Update department.

## DELETE `/departments/:id`

Soft delete (Inactive).

------------------------------------------------------------------------

# Categories

## GET `/categories`

Returns asset categories.

## POST `/categories`

Create category.

``` json
{
  "name":"Electronics",
  "description":"Electronic assets"
}
```

------------------------------------------------------------------------

# Employees

## GET `/employees`

List employees.

Supports

-   search
-   role
-   department
-   status

## PATCH `/employees/:id/role`

Promote employee.

Roles

-   ADMIN
-   ASSET_MANAGER
-   DEPARTMENT_HEAD
-   EMPLOYEE

Admin only.

------------------------------------------------------------------------

# Assets

## GET `/assets`

Returns paginated asset list.

Query Parameters

-   search
-   category
-   status
-   department
-   location

------------------------------------------------------------------------

## GET `/assets/:id`

Returns complete asset details.

Includes

-   Category
-   Allocation history
-   Maintenance history

------------------------------------------------------------------------

## POST `/assets`

Registers a new asset.

``` json
{
  "name":"Dell Latitude",
  "serialNumber":"ABC123",
  "categoryId":1,
  "location":"Floor 2",
  "condition":"Good",
  "isBookable":false
}
```

Business Rules

-   Asset Tag auto-generated.
-   Asset Tag unique.
-   Serial Number unique.
-   Initial status = AVAILABLE.

------------------------------------------------------------------------

## PATCH `/assets/:id`

Update asset.

------------------------------------------------------------------------

## DELETE `/assets/:id`

Soft delete.

Status becomes DISPOSED.

------------------------------------------------------------------------

## GET `/assets/:id/history`

Returns

-   Allocation history
-   Maintenance history

------------------------------------------------------------------------

# Asset Allocation

## POST `/allocate`

Allocate an asset.

``` json
{
  "assetId":1,
  "employeeId":8,
  "expectedReturn":"2026-08-20"
}
```

Rules

-   Asset must be AVAILABLE.
-   If already allocated return

`409 Conflict`

Response

``` json
{
  "message":"Asset already allocated"
}
```

------------------------------------------------------------------------

## POST `/return`

Mark asset returned.

``` json
{
  "assetId":1,
  "conditionNotes":"Minor scratches"
}
```

Rules

-   Allocation closed.
-   Asset becomes AVAILABLE.
-   History preserved.

------------------------------------------------------------------------

## POST `/transfer`

Transfer asset ownership.

Workflow

Requested

↓

Approved

↓

Completed

------------------------------------------------------------------------

# Resource Booking

## GET `/bookings`

Returns bookings.

Supports

-   resource
-   employee
-   status

------------------------------------------------------------------------

## POST `/bookings`

Create booking.

``` json
{
  "assetId":5,
  "startTime":"2026-08-10T09:00",
  "endTime":"2026-08-10T11:00"
}
```

Conflict Rule

    existing.start < new.end
    AND
    existing.end > new.start

If overlap

`409 Conflict`

Statuses

-   Upcoming
-   Ongoing
-   Completed
-   Cancelled

------------------------------------------------------------------------

# Maintenance

## GET `/maintenance`

Returns maintenance requests.

## POST `/maintenance`

Raise maintenance request.

``` json
{
  "assetId":5,
  "priority":"HIGH",
  "description":"Battery issue"
}
```

Workflow

Pending

↓

Approved

↓

Assigned

↓

In Progress

↓

Resolved

Rules

-   Approval changes asset to UNDER_MAINTENANCE.
-   Resolution changes asset to AVAILABLE.

------------------------------------------------------------------------

## PATCH `/maintenance/:id`

Update workflow stage.

------------------------------------------------------------------------

# Dashboard

## GET `/dashboard`

Returns

``` json
{
  "assetsAvailable":50,
  "assetsAllocated":20,
  "activeBookings":8,
  "maintenanceToday":2,
  "overdueReturns":3
}
```

------------------------------------------------------------------------

# Notifications

## GET `/notifications`

Returns notifications.

## PATCH `/notifications/:id/read`

Mark notification as read.

------------------------------------------------------------------------

# Activity Logs

## GET `/logs`

Returns audit trail.

Each log contains

-   User
-   Action
-   Entity
-   Entity Id
-   Timestamp

Examples

-   Created Asset
-   Allocated Asset
-   Approved Booking
-   Completed Maintenance

------------------------------------------------------------------------

# Reports

## GET `/reports/assets`

Asset utilization.

## GET `/reports/bookings`

Booking statistics.

## GET `/reports/maintenance`

Maintenance statistics.

------------------------------------------------------------------------

# Common Status Codes

  Code   Meaning
  ------ -----------------------
  200    Success
  201    Created
  400    Validation Error
  401    Unauthorized
  403    Forbidden
  404    Not Found
  409    Conflict
  500    Internal Server Error

------------------------------------------------------------------------

# Role Permissions

  Module        Admin   Asset Manager   Dept Head   Employee
  ------------- ------- --------------- ----------- ----------
  Departments   ✓                                   
  Employees     ✓                                   
  Assets        ✓       ✓                           
  Allocation    ✓       ✓                           
  Booking       ✓       ✓               ✓           ✓
  Maintenance   ✓       ✓                           ✓
  Reports       ✓       ✓               ✓           
  Dashboard     ✓       ✓               ✓           ✓

------------------------------------------------------------------------

# Core Business Rules

1.  Users always register as EMPLOYEE.
2.  Asset Tags are auto-generated.
3.  Serial Numbers are unique.
4.  Asset ownership is derived from Allocation records.
5.  Never overwrite allocation history.
6.  Prevent double allocation.
7.  Prevent booking overlap.
8.  Maintenance updates asset status automatically.
9.  Notifications are stored in the database.
10. Every important action creates an Activity Log.
