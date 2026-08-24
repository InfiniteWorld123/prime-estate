# Backend API Plan

## Goal

Build the Prime Estate backend as small vertical slices. Each slice includes
validation, database queries, business rules, HTTP routes, and tests before the
next slice begins.

The MVP serves one real-estate agency. Registered users may exist, but only the
single admin can access administrative routes. Properties are never exposed
directly through the public API.

Phases 1 through 6 are implemented. Phase 0 is implemented except for the
automatic first-account bootstrap described below. Property inquiries are the
next documented backend slice and remain planned rather than implemented.

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
- When the database has no accounts, the first registered account becomes
  `ADMIN`.
- Keep registration open and assign every later account the `USER` role.
- A `USER` account must not access administrative routes.
- Require a valid session, verified email, and `ADMIN` role for every
  `/api/admin/*` route.
- Test unauthenticated, unverified, non-admin, and admin access.

Current status: the role column, single-admin database index, admin guard, and
one existing admin account are present. Later accounts default to `USER`. The
automatic first-account bootstrap is not implemented yet and can be completed
as a separate authentication task.

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
- Publishing validates the complete property, listing content, slug, price,
  and cover image.
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
- Sold and rented detail pages remain accessible but cannot accept inquiries
  or bookings.
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

## Later Vertical Slices

After the property/listing slice is complete:

1. Inquiries and basic lead management, following
   [`inquiries.md`](inquiries.md).
2. Viewing availability and bookings.
3. Admin and public frontend screens for each completed backend capability.
4. Blogging.
5. Analytics selected from real product questions.

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

The next documented backend capability is property inquiries and basic lead
management. It is planned but not implemented; PostgreSQL and the Admin
Dashboard will be the primary notification surface, while Resend and real-time
transport remain deferred.

The current product work continues in the frontend roadmap. Runtime API smoke
tests must be repeated before deployment against the final production
configuration.
