# Backend API Plan

## Goal

Build the Prime Estate backend as small vertical slices. Each slice includes
validation, database queries, business rules, HTTP routes, and tests before the
next slice begins.

The MVP serves one real-estate agency. Authentication is exposed only for the
single Admin, and Properties are never exposed directly through the public API.

Phases 0 through 7 are implemented. No additional Prime Estate backend feature
phase is planned.

Property and listing domain rules live in
[`property-listings.md`](property-listings.md).

## API Conventions

- All application routes use the `/api` prefix.
- Administrative routes use `/api/admin` and require a verified `ADMIN`
  session.
- Public routes expose listings, not internal properties.
- Request validation uses Valibot.
- Application queries use parameterized raw PostgreSQL queries through the
  shared pool.
- Successful responses use the shared response helpers.
- Expected failures use `AppError` and the centralized error handler.
- List endpoints use `page` and `page_size` offset pagination.
- Database migrations remain the schema source of truth.

## Phase 0: Admin Access

Before building business APIs:

- Keep exactly one `ADMIN` account for the MVP.
- Provision the one `ADMIN` account through a controlled deployment operation;
  never grant public sign-up requests administrative access automatically.
- Disable public registration in Better Auth and expose no customer-auth UI.
- Existing `USER` records must not sign in through the released Admin login or
  access administrative routes.
- Require a valid session, verified email, and `ADMIN` role for every
  `/api/admin/*` route.
- Test unauthenticated, unverified, non-admin, and admin access.

Current status: the role column, single-admin database index, Admin Guard,
Admin-only sign-in restriction, disabled registration, and one existing
development Admin account are present. Production Admin provisioning is an
operational release step, not a missing public API or automatic-bootstrap
feature.

## Phase 1: Contacts

Routes:

- `POST /api/admin/contacts`
- `GET /api/admin/contacts`
- `GET /api/admin/contacts/:id`
- `PATCH /api/admin/contacts/:id`
- `DELETE /api/admin/contacts/:id`

Rules:

- Normalize text before writing it.
- Require a non-blank full name.
- Require at least one of email or phone.
- Reject deletion when a property references the contact.
- Support admin search and pagination.

## Phase 2: Properties

Routes:

- `POST /api/admin/properties`
- `GET /api/admin/properties`
- `GET /api/admin/properties/:id`
- `PATCH /api/admin/properties/:id`
- `POST /api/admin/properties/:id/archive`
- `POST /api/admin/properties/bulk-archive`
- `POST /api/admin/properties/:id/restore`
- `DELETE /api/admin/properties/:id`

Rules:

- Properties are internal administrative records.
- External client properties require a primary contact.
- Archive only when no open listing exists.
- Bulk archive accepts 1 to 100 selected, unique property IDs and succeeds or
  fails as one transaction. It does not provide an archive-everything action.
- Permanently delete only when the property has no business history and its
  draft listings have already been deleted.
- Return features and image metadata in the property detail response.

## Phase 3: Features

Routes:

- `POST /api/admin/features`
- `GET /api/admin/features`
- `PATCH /api/admin/features/:id`
- `DELETE /api/admin/features/:id`
- `PUT /api/admin/properties/:id/features`

Rules:

- Feature codes are normalized uppercase identifiers.
- Replacing a property's features happens in one transaction.
- Do not expose unused administrative fields through the public API.

## Phase 4: Property Images

Routes:

- `GET /api/admin/properties/:id/images`
- `POST /api/admin/properties/:id/images`
- `PATCH /api/admin/properties/:id/images/:imageId`
- `DELETE /api/admin/properties/:id/images/:imageId`
- `PUT /api/admin/properties/:id/images/order`
- `POST /api/admin/properties/:id/images/:imageId/cover`

Rules:

- Use Cloudinary behind the shared image-storage abstraction.
- Send one image per multipart request through the backend.
- PostgreSQL stores only storage keys and image metadata.
- Allow JPEG, PNG, and WebP files up to 10 MB and at most 30 images per
  property.
- Make the first uploaded image the cover automatically.
- Preserve ordering and allow only one cover image per property.
- Changing the cover image must be transactional.
- If the cover is deleted, promote the first remaining image automatically.
- Do not allow deleting the last image while a published or historical public
  listing page depends on it.

## Phase 5: Listings

Routes:

- `POST /api/admin/properties/:id/listings`
- `GET /api/admin/listings`
- `GET /api/admin/listings/:id`
- `PATCH /api/admin/listings/:id`
- `POST /api/admin/listings/:id/publish`
- `POST /api/admin/listings/:id/archive`
- `DELETE /api/admin/listings/:id`

Rules:

- Drafts may be incomplete.
- Draft creation supplies editable Title and Description defaults from the
  Property when they are omitted.
- Publishing validates the complete Property, Price, Title, Description, and
  cover image. A missing Slug is generated from the final Title and receives a
  numeric suffix when necessary for uniqueness.
- Empty SEO fields remain automatic fallbacks to the current Listing Title and
  Description; custom SEO values take precedence.
- A published slug cannot change.
- Only never-published drafts may be deleted.
- Archiving requires a valid outcome for the listing type.
- Selling a property archives its open rental listing as `WITHDRAWN` in the
  same database transaction.
- When a sale closes as `SOLD`, a published rental is archived as `WITHDRAWN`
  and an unpublished rental draft is deleted in the same transaction.

Current status: the administrative Listings routes are implemented.

## Phase 6: Public Listings

Routes:

- `GET /api/listings`
- `GET /api/listings/:slug`
- `GET /api/features`

Rules:

- Return only explicitly selected public fields.
- Never add a public `/api/properties` endpoint.
- Hide the exact address unless the listing allows it.
- Search results contain only currently published listings.
- Sold and rented detail pages remain accessible but cannot accept inquiries.
- Withdrawn listing detail pages return `404 Not Found`.
- Support the agreed filters, sorting, feature matching, and pagination.
- Multiple selected feature IDs use AND semantics: a property must have every
  selected feature.
- Public feature options include only features used by currently published
  listings.
- Public responses always expose city and postal code, but expose street,
  house number, and unit only when the listing allows the exact address.

Current status: the Public Listings and public Feature options routes are
implemented. The first backend vertical slice is complete.

## Phase 7: Inquiries

Public route:

- `POST /api/inquiries`

Administrative routes:

- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/:id`
- `POST /api/admin/inquiries/:id/read`
- `PATCH /api/admin/inquiries/:id/status`
- `POST /api/admin/inquiries/:id/archive`
- `POST /api/admin/inquiries/:id/unarchive`

Rules:

- Support both general contact inquiries and inquiries linked to a currently
  published Listing.
- Resolve public Listing Slugs on the server and do not expose hidden Listing
  state.
- Keep read state, the implemented `lead_status` processing marker, and archive
  state independent.
- Do not permanently delete inquiries.
- Apply the documented honeypot, duplicate-submit, privacy-consent, and
  database-backed rate-limit rules.
- Require verified `ADMIN` access for all management routes.

Detailed contract: [`inquiries.md`](inquiries.md).

Current status: the complete backend Inquiry slice and its public and Admin
frontend integrations are implemented. Browser/database verification belongs
to the release gate.

## Backend Scope Closure

The Prime Estate backend feature scope is closed after Phase 7. Blogging,
custom analytics, appointment booking, and a separate Lead or CRM module are
project exclusions. The small Admin Overview must compose existing list
endpoints and their pagination totals; it does not justify a new analytics
backend.

## Implementation Order Inside Each Phase

For one capability at a time:

1. Define the request and response contract.
2. Add shared types and Valibot validation.
3. Implement parameterized SQL and business rules in the service layer.
4. Add the controller and route.
5. Add focused service and HTTP tests.
6. Run formatting, type checking, tests, and a manual API smoke test.
7. Update this document if an API decision changes.

## Current Handoff

The property and listing backend vertical slice is complete, including
Cloudinary-backed property images, bulk property archiving, administrative
listing lifecycle routes, and public listing discovery.

The Inquiry submission and Admin inbox slice is complete. PostgreSQL is the
source of truth, and the implemented Admin Inquiry Inbox is the notification
surface. Inquiry email and real-time transport are project exclusions.

The current product work continues in the frontend roadmap. Runtime API smoke
tests must be repeated before deployment against the final production
configuration.
