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

**Status:** Not started

Discuss and document the About page before implementation. Its job, content,
trust signals, layout, bilingual copy, responsive behavior, and page states
must be approved without fabricating agency history, staff, statistics,
testimonials, or unsupported claims.

A detailed page file will be created only after the planning discussion.

## Stage 4: Contact Page

**Status:** Not started

Discuss and document the Contact page before implementation. Planning will
cover its relationship to property inquiries, the information visitors need,
form behavior, bilingual copy, privacy expectations, and mock success and
failure states.

Real submission and backend persistence remain Stage 7 work. A detailed page
file will be created only after the planning discussion.

## Stage 5: Authentication UI

**Status:** Not started

Discuss and document the authentication experience before implementation. The
UI plan will identify the required screens and user-visible states without yet
connecting Better Auth, React Query mutations, sessions, or protected routes.

After Stages 3, 4, and 5 are jointly approved, their mock-first UI
implementations may be delivered together as one focused frontend batch.

## Stage 6: Administrative UI

**Status:** Not started

Plan and implement the administrative shell and the UI required by the
approved MVP property and listing workflow. Mock data and local preview states
remain acceptable during this stage.

The dashboard shell and property/listing management may become separate slices
if their detailed planning shows that this is clearer. That decision is
deliberately deferred until Stage 6 begins.

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

Plan and document Stages 3, 4, and 5 in order: About, Contact, then
Authentication UI. Do not implement them until all three plans have been
approved for the combined frontend batch.
