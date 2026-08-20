# Backend API Plan

## Goal

Build the Prime Estate backend as small vertical slices. Each slice includes
validation, database queries, business rules, HTTP routes, and tests before the
next slice begins.

The MVP serves one real-estate agency. Registered users may exist, but only the
single admin can access administrative routes. Properties are never exposed
directly through the public API.

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
- `POST /api/admin/properties/:id/restore`
- `DELETE /api/admin/properties/:id`

Rules:

- Properties are internal administrative records.
- External client properties require a primary contact.
- Archive only when no open listing exists.
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

- `POST /api/admin/properties/:id/images`
- `PATCH /api/admin/properties/:id/images/:imageId`
- `DELETE /api/admin/properties/:id/images/:imageId`

Rules:

- Choose the object-storage provider and upload flow before implementing file
  uploads.
- PostgreSQL stores only storage keys and image metadata.
- Preserve ordering and allow only one cover image per property.
- Changing the cover image must be transactional.

## Phase 5: Listings

Routes:

- `POST /api/admin/properties/:propertyId/listings`
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

## Later Vertical Slices

After the property/listing slice is complete:

1. Inquiries and basic lead management.
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

## Immediate Next Step

Implement only:

`POST /api/admin/contacts`

Do not build the remaining Contacts routes until this first endpoint works from
validation through PostgreSQL and its tests pass.
