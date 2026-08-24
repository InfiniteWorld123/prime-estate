# Frontend and Release Roadmap

## Purpose

Deliver Prime Estate as small, complete vertical slices. A stage may have a
mock UI pass and a later integration pass when that separation is explicitly
recorded. Each pass includes its UX contract, implementation, responsive and
bilingual behavior, required states, and verification.

The roadmap records the major delivery order. Detailed decisions belong in the
document for the stage currently being built.

## Status Legend

- `Not started`: scope is named but deliberately not designed yet.
- `Draft`: the detailed specification is written and awaiting joint review.
- `Planned`: detailed specification is approved and ready to implement.
- `In progress`: implementation or verification is underway.
- `Completed`: completion criteria are verified.

## Stage 1: Public Property Search

**Status:** In progress

Build the bilingual public results experience with mock data first, including
search, filters, sorting, pagination, responsive layouts, and loading, empty,
and error states. Then move applied criteria into Router URL state and connect
the same UI contract to the public listings API through React Query.

Detailed specification: [`pages/properties.md`](pages/properties.md)

The mock-first UI implementation is complete. Router URL state, React Query,
the backend connection, and the final cross-browser visual sign-off remain in
this stage before it can be marked completed.

## Stage 2: Property Details

**Status:** In progress

Build the public listing detail page with its image gallery, property facts,
description, features, address-visibility rules, availability state, metadata,
and contact direction.

The mock-first bilingual UI is implemented with its responsive gallery and
lightbox, listing facts, optional-field omission, availability states, sticky
contact card, TanStack Form inquiry dialog, and page-state previews. Public API
integration, real inquiry submission, route-level server metadata, and final
cross-browser visual sign-off remain before this stage is completed.

Detailed specification: [`pages/property-details.md`](pages/property-details.md)

## Stage 3: Home Page Backend Integration

**Status:** Not started

Replace the seven deterministic home-page mock listings with the newest public
listings through a plain API module and focused React Query hooks. Activate hero
search and listing navigation without changing the established visual contract.

The detailed specification will be written after Stage 2 is complete.

## Stage 4: Authentication

**Status:** Not started

Design and implement sign-up, sign-in, verification, session handling, route
protection, and the different visitor, user, and admin experiences. Refactor
the temporary auth query structure as part of this stage.

The detailed specification will be written after Stage 3 is complete.

## Stage 5: Admin Dashboard

**Status:** Not started

Build the administrative shell and the UI required by the completed backend
property and listing scope: contacts, properties, features, images, listing
drafts, publishing, archiving, and lifecycle feedback. After the documented
inquiry backend slice is implemented, add unread inquiry counts and the basic
inquiry-management workflow without WebSockets.

Blogging, analytics, general user management, payments, and organizations stay
outside this stage unless the product scope is explicitly changed later.

## Stage 6: Visual and Quality Review

**Status:** Not started

Review the complete product in German and English across supported viewport
sizes, light and dark themes, keyboard navigation, accessibility, loading and
failure states, browser behavior, performance, and end-to-end workflows.

## Stage 7: Deployment

**Status:** Not started

Prepare and deploy the verified application to its selected hosting or VPS,
including production configuration, database migration, image storage, domain,
TLS, backups, monitoring, and post-deployment smoke tests.

The hosting provider and operational budget will be selected when this stage
begins rather than assumed now.

## Current Focus

Stage 2 integration planning: the Property Details mock UI is complete. Stage
1's URL state, React Query, and backend integration pass also remains
deliberately deferred.
