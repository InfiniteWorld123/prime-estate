# Prime Estate Agent Guide

This file defines the project rules that every AI or contributor must follow.
It is intentionally concise. Detailed product, backend, and frontend decisions
live under `docs/`.

## Read Before Working

Read documentation in this order:

1. `docs/project.md` for the product, users, MVP, and exclusions.
2. `docs/architecture.md` for the system-wide technical picture.
3. The relevant file under `docs/backend/` or `docs/frontend/`.
4. The current code, migrations, and tests for implemented behavior.

Do not read every feature specification when the task concerns only one slice.

## Source-of-Truth Rules

- `docs/project.md` owns product scope and boundaries.
- `docs/architecture.md` owns the high-level system shape.
- `src/backend/db/migrations/` is authoritative for the implemented database
  schema. Never rewrite an applied migration; add a new numbered migration.
- Backend route, validation, service, and shared-type code is authoritative for
  the currently implemented HTTP contract.
- Frontend page specifications own approved UX behavior for their page.
- `docs/frontend/roadmap.md` owns delivery status and current focus.
- When documentation and implementation disagree, do not silently choose one.
  Report the mismatch and determine whether the task changes the plan or fixes
  the implementation.

## Product Invariants

- Prime Estate serves one real-estate agency. It is not a marketplace.
- Do not add organizations, tenants, agency switching, or staff-role systems.
- The MVP has one administrative role and one agency-wide administration area.
- The residential property types are `APARTMENT` and `HOUSE`.
- The market assumptions are Germany, EUR, square metres, five-digit German
  postal codes, and Europe/Berlin time.
- The public interface supports German and English; German is the default.
- Internal properties are never exposed as a public resource. Visitors browse
  public listings.
- The full address is stored internally. Public routes reveal exact address
  fields only when the listing explicitly allows it.
- Listing lifecycle and archive rules must remain consistent with
  `docs/backend/property-listings.md`.
- Sold and rented detail pages remain accessible but cannot accept inquiries or
  bookings. Withdrawn listings return a public `404`.
- Do not fabricate listings, testimonials, reviews, ratings, sales numbers,
  urgency, staff biographies, legal details, or agency performance claims.

## MVP Boundary

The intended MVP includes:

- Authentication and protected admin access
- Contacts, properties, features, images, and listing lifecycle management
- Public listing search and property detail pages
- Property inquiries and basic lead management
- Viewing appointment requests and management once that slice is specified
- Closing and archiving listings as sold, rented, or withdrawn

The following are outside the current MVP unless the user explicitly changes
the scope:

- Multiple organizations or agencies
- Staff roles and permissions
- Full owner or customer portals
- Contracts, payments, and advanced ownership management
- Blogging and analytics
- Saved properties, reviews, comments, and marketplace functionality
- Automated lead scoring, SMS, and real-time notification infrastructure
- Unspecified third-party business integrations

Infrastructure providers may be used when already approved, including
Cloudinary for property images and email delivery where authentication requires
it. Inquiry email notifications remain deferred.

## Backend Rules

- Use TypeScript, Elysia, Valibot, `pg`, and parameterized raw PostgreSQL.
- Do not introduce an ORM without an explicit architecture decision.
- Application routes use `/api`; protected administrative routes use
  `/api/admin` and require a verified `ADMIN` session.
- Keep controllers thin, business rules in services, request contracts in
  shared validation/types, and expected failures in the central error flow.
- Database changes require a new migration and proportional service and HTTP
  verification.
- Public endpoints expose only selected public fields and never expose secrets,
  storage keys, internal ownership data, or hidden addresses.
- Persist business records before optional notification side effects. A failed
  email must not lose an inquiry.

## Frontend Rules

- Keep TanStack Router route files thin. Routes configure URL behavior,
  boundaries, and page rendering; they do not contain page markup.
- Page components compose sections. Reusable domain components live under
  `features/`; page-only sections stay with their page.
- Plain API modules perform transport and do not import React.
- React Query owns server state. TanStack Router owns shareable URL state.
- TanStack Form owns non-trivial form state and validation.
- Page hooks coordinate a page view model; they must not become general-purpose
  stores or contain reusable transport logic.
- Components do not call the backend client directly.
- Do not add a global client store until a real cross-page requirement exists.
- Use `shadcn/ui` as owned accessible primitives, not as the visual identity.
- Preserve the approved design system, bilingual behavior, accessibility,
  reduced motion, and loading, empty, error, success, and missing-image states.

## Delivery Rules

- Work in small documented vertical slices.
- A mock UI pass and its API integration pass may be delivered separately when
  the roadmap explicitly records that decision.
- Do not broaden one slice because a future feature sounds useful.
- Document a separate feature file only when an approved slice has enough
  durable decisions to justify it.
- Keep deferred ideas visible as deferred; do not implement them implicitly.
- Preserve existing user changes and avoid unrelated refactors.
- Before completing implementation, run the relevant subset of formatting,
  type checking, tests, build, and runtime checks described by the slice.

## Missing or Conflicting Information

When a necessary requirement is missing, state what is unknown and ask for a
decision. Do not invent product behavior. In particular, the detailed viewing
booking contract, full customer-account behavior, production legal identity,
and hosting choice are not yet specified.
