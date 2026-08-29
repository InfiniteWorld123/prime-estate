# Prime Estate

## Purpose

Prime Estate is a full-stack residential real-estate platform for one agency.
It helps the agency organize properties, publish sale and rental listings,
present them to visitors, receive inquiries, and close listings as sold,
rented, or withdrawn.

The project is a serious portfolio project and learning project. It is built as
if it could support a real agency, without pretending that unimplemented legal,
operational, or business details already exist.

## Market and Positioning

Prime Estate is based conceptually in Erfurt and focuses on Erfurt and
Thuringia while allowing properties elsewhere in Germany.

The product assumptions are:

- Residential apartments and houses
- Sale and rental listings
- EUR prices
- Square-metre area measurements
- Five-digit German postal codes
- Europe/Berlin time
- German and English interfaces, with German as the default

The experience should feel trustworthy, clear, fast, local, and professional
but warm. It should not look like a luxury portal, futuristic concept, or dense
multi-agency marketplace.

## Users

### Visitor

A visitor can browse published listings, view property details, and send either
a property-specific or general inquiry. The agency coordinates any viewing
manually after contact.

### Admin

The single verified agency admin signs in through the protected Admin-only
authentication surface and manages contacts, properties, features, images,
listings, and inquiries. Visitors do not create accounts. The MVP does not
include multiple organizations or a staff permission hierarchy.

## Problem

The platform gives a small agency one coherent workflow instead of disconnected
property records, public listing pages, and incoming customer requests.
Visitors receive clear property information and a direct path to contact the
agency. The admin retains the internal property history, public listing
lifecycle, and inquiry inbox needed to respond to visitors and close a listing.

## Core Workflow

1. The admin creates or updates an internal property.
2. The admin prepares a sale or rental listing and its images.
3. The admin publishes the listing.
4. A visitor discovers it through public search and views its detail page.
5. The visitor sends a property-specific or general inquiry.
6. The admin processes the inquiry and coordinates any viewing outside the
   platform.
7. The Listing is sold, rented, or withdrawn.

## MVP Scope

- Authentication and protected single-admin access
- Contact management
- Property, feature, and image management
- Sale and rental listing drafting, publishing, and archiving
- Public property search and property detail pages
- Property inquiries, an administrative inbox, and minimal inquiry-status
  handling
- German and English presentation

German and English apply to application interface copy. Admin-authored listing
titles, descriptions, and SEO content currently remain in the single language
in which they were entered. A multilingual listing-content model is deferred.

Implemented and planned status belongs in
[`frontend/roadmap.md`](frontend/roadmap.md) and the relevant backend documents;
this file defines scope, not completion status.

## Project Exclusions

Prime Estate ends at the workflow documented above. The following are not later
phases of this portfolio project:

- Multiple agencies, organizations, or tenants
- Staff roles and fine-grained permissions
- Full owner or customer portals
- Contracts and payments
- Advanced ownership management
- Blogging and custom analytics
- A separate lead-management or CRM system
- Saved properties, ratings, reviews, and comments
- Lead notes, follow-up tasks, automated lead scoring, and SMS notifications
- Automated availability, appointment scheduling, and booking management
- Calendar and scheduling-provider integrations
- Marketplace capabilities
- Unspecified third-party business integrations

Cloudinary and required authentication email delivery are infrastructure, not
marketplace or business integrations. Inquiry email notifications are not
planned; stored inquiries and the Admin Inquiry screen are the notification
surface.

## Product Rules That Must Remain True

- Prime Estate represents one agency and never exposes competing agencies.
- An internal property and a public listing are different records.
- Visitors access listings, never an unrestricted public property API.
- Exact addresses are private by default.
- Published slugs are stable.
- Sold and rented detail pages may remain public but cannot accept new inquiries.
- Withdrawn listings are not publicly accessible.
- Public content must not use fabricated trust claims or business statistics.

Detailed property and listing rules live in
[`backend/property-listings.md`](backend/property-listings.md).

## Success

The MVP is successful when the single admin can publish and manage a property
listing, a visitor can discover and understand it and send an inquiry, and the
admin can process that inquiry and close the Listing.

## Release Decisions

The following must be resolved before deployment rather than becoming new
product modules:

- Inquiry retention limits
- Production agency identity, legal text, domain, and hosting provider

## Documentation Map

- [`architecture.md`](architecture.md): system-wide technical picture
- [`backend/api.md`](backend/api.md): implemented API phases and status
- [`backend/property-listings.md`](backend/property-listings.md): durable
  property and listing business rules
- [`backend/inquiries.md`](backend/inquiries.md): inquiry submission and inbox
  contract
- [`frontend/architecture.md`](frontend/architecture.md): frontend ownership,
  folders, hooks, and state boundaries
- [`frontend/design-system.md`](frontend/design-system.md): visual and component
  rules
- [`frontend/roadmap.md`](frontend/roadmap.md): delivery status and current focus
- [`release.md`](release.md): final quality and deployment-readiness checklist
- `frontend/pages/`: approved page-level UX specifications
