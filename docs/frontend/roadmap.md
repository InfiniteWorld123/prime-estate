# Frontend and Integration Roadmap

## Purpose

Deliver Prime Estate through an interface-first track followed by a separate
integration track. Public and administrative experiences are designed,
documented, and implemented with deterministic mock data before backend
connections are introduced.

This separation keeps visual and UX decisions focused while leaving React
Query, URL state, authentication sessions, and API contracts for deliberate
integration slices. Detailed requirements are documented only after they have
been discussed and approved.

## Status Legend

- `Not started`: the slice is named but its detailed UX is not approved.
- `Draft`: detailed planning is being discussed or documented.
- `Planned`: the specification is approved and ready to implement.
- `In progress`: implementation or verification is underway.
- `Completed`: the scope assigned to this roadmap stage is verified.

## Stage 1: Public Property Search UI

**Status:** Completed

The bilingual mock-first public property search UI includes listing intent,
filters, applied-filter chips, sorting, pagination, responsive layouts, and
loading, empty, full-error, background-error, and missing-image states.

URL-owned search state, React Query, and the public listings API are assigned to
Stage 7 rather than keeping this UI stage open.

Detailed specification: [`pages/properties.md`](pages/properties.md)

## Stage 2: Public Property Details UI

**Status:** Completed

The bilingual mock-first property detail UI includes the responsive gallery
and lightbox, listing summary, optional-field omission, property information,
availability behavior, sticky contact card, TanStack Form inquiry dialog, and
page-state previews.

Public detail API loading, real inquiry submission, and server-aware metadata
are assigned to Stage 7.

Detailed specification: [`pages/property-details.md`](pages/property-details.md)

## Stage 3: About Page

**Status:** Completed

The bilingual About page presents Prime Estate as a real agency centered on
Erfurt and Thuringia, using an architectural hero and concise service
principles without fabricated history, staff, statistics, testimonials, or
unsupported claims.

Detailed specification: [`pages/about.md`](pages/about.md)

## Stage 4: Contact Page

**Status:** Completed

The bilingual Contact page provides general agency contact, portfolio contact
information, a TanStack Form with submit-first validation, mock submission
states, and a concise FAQ. It remains separate from property-specific
inquiries.

Real submission and backend persistence remain Stage 7 work.

Detailed specification: [`pages/contact.md`](pages/contact.md)

## Stage 5: Authentication UI

**Status:** Completed

The bilingual authentication UI covers sign-up, six-digit email verification,
sign-in, forgot password, reset password, sign-out, and session-aware header
previews. Email and password are active; Google is visibly deferred. The mock
slice does not connect Better Auth, React Query mutations, sessions, or
protected routes.

After Stages 3, 4, and 5 are jointly approved, their mock-first UI
implementations may be delivered together as one focused frontend batch.

Detailed specification: [`pages/authentication.md`](pages/authentication.md)

## Stage 6: Administrative UI

**Status:** In progress

Plan and implement the administrative shell and the UI required by the
approved MVP property and listing workflow. Mock data and local preview states
remain acceptable during this stage.

The dashboard shell and property/listing management may become separate slices
if their detailed planning shows that this is clearer. That decision is
deliberately deferred until Stage 6 begins.

The shared shell direction is now documented separately and intentionally does
not define the Overview content or domain workflows:
[`admin-shell.md`](admin-shell.md)

### Approved Administrative Sequence

This sequence is the durable Stage 6 checklist. Each item receives detailed
planning before implementation; its position here does not invent missing UX
or backend behavior.

1. **Completed:** Build the shared Admin Shell using the approved Architectural
   Operations Console direction.
2. **Completed:** Build the administrative Properties collection with Table
   and Grid desktop views and a responsive mobile collection. Detailed specification:
   [`pages/admin-properties.md`](pages/admin-properties.md)
3. **Completed:** Build the Create Property workflow. Detailed specification:
   [`pages/admin-properties.md#create-property`](pages/admin-properties.md#create-property)
4. **Completed:** Build Property Image Setup after creation or from an existing Property.
   Detailed specification:
   [`pages/admin-properties.md#property-image-setup`](pages/admin-properties.md#property-image-setup)
5. **Completed:** Build Property Feature Setup after images or from an existing Property.
   Detailed specification:
   [`pages/admin-properties.md#property-feature-setup`](pages/admin-properties.md#property-feature-setup)
6. **Completed:** Build the internal Property Details/Edit workspace for the backend-supported
   property, contact, feature, image, archive, restore, and deletion behavior.
7. **Completed:** Build the administrative Listings collection.
8. **Completed:** Build Create Listing from an existing Property. Detailed specification:
   [`pages/admin-listings.md#create-listing`](pages/admin-listings.md#create-listing)
9. **Completed:** Build Listing Details/Edit, including content, price, SEO, address
   visibility, publication, archive outcome, deletion rules, and public preview.
   Detailed specification:
   [`pages/admin-listings.md#listing-details-and-lifecycle`](pages/admin-listings.md#listing-details-and-lifecycle)
10. Build administrative Inquiries only after its backend slice and final API
   contract are implemented and verified.
11. Design and build the Overview and any justified analytics after the
   operational workflows are complete.

Contacts, inquiries, and other approved administrative surfaces are added only
when their documented workflow requires them. Blogging, analytics, general
user management, payments, staff roles, and organizations remain outside the
current MVP.

## Stage 7: Application Integration

**Status:** Not started

Replace mock orchestration with real application behavior through small,
independently verified integration slices. This stage includes, where required
by the completed UI:

- TanStack Router URL state for shareable public search views
- Plain frontend API transport modules
- React Query queries, mutations, caching, and invalidation
- Home, public search, and property detail API integration
- Inquiry persistence and administrative inquiry visibility
- Better Auth flows, sessions, and protected routes
- Administrative property and listing API integration
- Loading, error, retry, authorization, and stale-data behavior against real
  backend responses

The first integration slice is implemented as a learning pass: the file and
data flow are explained, the user applies the initial changes, and the result
is reviewed. Later repetitive integration work may then be implemented
directly after its scope and contract are approved.

Deployment, production legal identity, monitoring, backups, and hosting remain
later release work and are not silently included in Stage 7.

## Current Focus

Stages 3, 4, and 5 are completed: their combined mock-first implementation
passes the code, type-check, build, route-smoke-test, and user visual-review
gates. Stage 6 planning has begun with the shared Admin Shell direction. The
Properties collection, creation, image setup, Feature setup, Property selection
for Listing creation, Create Listing, and the complete Listing lifecycle are
planned. The Listing lifecycle specification covers Draft, Preview, Publish,
Published editing, Archive, Archived display, Draft deletion, and page states.
The shared Admin Shell, mock-first administrative Properties collection,
Create Property, Property Image Setup, and Property Feature Setup are
implemented and verified. A successful mock creation now hands off directly to
`/admin/properties/:id/images`, then advances to
`/admin/properties/:id/features`. The internal Property Details/Edit workspace
at `/admin/properties/:id` is also implemented and linked from the collection.
The independent Image and Feature setup routes are repaired, and the guided
journey now continues through a mock-first Property-bound Create Listing page.
The administrative Listings collection, active-Property selection route,
Create Listing flow, and complete mock-first Listing lifecycle workspace are
implemented and verified with focused model tests and browser checks. The next
administrative slice is Inquiries after its backend contract is complete, or
Stage 7 integration if that backend slice remains deferred. The Overview and
analytics are deferred until the operational admin workflows are complete. Keep all real
submissions, sessions, authorization redirects, Cloudinary uploads, and
backend connections in Stage 7.
