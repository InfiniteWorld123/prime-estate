# System Architecture

## Purpose

This document explains the system-wide structure only. Detailed backend API
contracts live under `backend/`; frontend composition and page behavior live
under `frontend/`.

## System Overview

Prime Estate is one TypeScript application built with TanStack Start. The
browser-facing React application and the Elysia API are delivered through the
same application origin.

```text
Browser
  |
  | React pages, TanStack Router, React Query, TanStack Form
  v
TanStack Start / Nitro server
  |
  | /api/* requests
  v
Elysia application
  |
  | services and parameterized SQL through pg.Pool
  v
PostgreSQL
```

The shared origin avoids a separate public API host in the current deployment
shape. TanStack Start's `/api/$` route forwards supported HTTP methods to the
Elysia application. Eden Treaty provides a typed API client boundary.

## Main Components

### Frontend

The frontend uses:

- React and TanStack Start for rendering
- TanStack Router for routes and shareable URL state
- React Query for remote server state and mutations
- TanStack Form for non-trivial forms
- Tailwind CSS and owned `shadcn/ui` primitives
- A bilingual German/English language provider
- A light, dark, and system theme provider

Route files are thin. Page components compose sections. Shared business UI and
focused server hooks live under feature folders. Plain API modules perform
transport without importing React.

Detailed rules: [`frontend/architecture.md`](frontend/architecture.md).

### Backend

The backend is an Elysia application mounted under `/api`. It is organized by
business module, with controllers, routes, and services for authentication,
admin access, contacts, properties, features, property images, listings, and
public listings.

Backend requests follow this direction:

```text
HTTP request
  -> Elysia route and Valibot validation
  -> controller
  -> service and business rules
  -> parameterized PostgreSQL query
  -> shared response or centralized AppError handling
```

Detailed routes and implementation status: [`backend/api.md`](backend/api.md).

### Shared Contracts

`src/shared/` contains environment access, TypeScript request/response types,
and Valibot schemas used across the application boundary. Public responses are
explicit projections rather than unrestricted database records.

### Database

PostgreSQL stores authentication data and the business records for contacts,
properties, features, images, and listings. Future approved migrations will add
inquiries and viewing records.

The application uses `pg.Pool` and raw parameterized SQL. It does not use an
ORM. Numbered SQL migrations under `src/backend/db/migrations/` are the schema
source of truth and run in filename order through the migration command.

### Authentication and Authorization

Better Auth provides authentication and session infrastructure. Administrative
routes require a valid session, verified email, and `ADMIN` role. The MVP is a
single-agency system with one administrative role, not a multi-organization
authorization model.

### Property Images

Cloudinary is accessed behind the backend image-storage abstraction. PostgreSQL
stores storage keys and image metadata; public and administrative responses
receive the appropriate generated image URLs and selected metadata.

### Email

The backend contains an email abstraction used where authentication requires
email delivery. Inquiry email notification is not part of the first inquiry
slice: inquiries will first be stored in PostgreSQL and surfaced in the Admin
Dashboard. Optional email notification may be added later without becoming the
source of truth.

## Frontend-to-Backend Data Flow

The intended connected frontend flow is:

```text
Page component
  <- page orchestration hook
  <- focused React Query hook
  <- plain API module / typed API client
  <-> /api route
  <-> Elysia service
```

Components do not call Elysia, PostgreSQL, or the API client directly. React
Query owns server state; TanStack Router owns filters and other state that must
be shareable in the URL. Local visual state stays near the component that owns
it.

## Deployment Shape

The repository builds a Nitro server and public assets. Docker provides:

- A builder image for the application
- A migration image that runs SQL migrations
- A runtime image that serves the generated application on port 3000
- PostgreSQL through Docker Compose in the current environment

Production still requires an explicitly selected host, TLS/reverse-proxy
configuration, backups, monitoring, and final runtime smoke tests. Those
operational choices are not yet specified.

## Architectural Boundaries

- No ORM without an explicit decision.
- No separate public properties API; public discovery uses listings.
- No direct database access from frontend code.
- No secrets or storage keys in public responses.
- No multi-agency or staff-role architecture in the MVP.
- No WebSockets until a real requirement exceeds React Query refetching or
  polling.
- Mock UI and API integration may be separate roadmap passes, but their visual
  and data contracts should align to avoid rewrites.
