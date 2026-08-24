# Prime Estate

## Purpose

Prime Estate is a full-stack residential real-estate platform for one agency.
It helps the agency organize properties, publish sale and rental listings,
present them to visitors, and manage potential customers until a listing is
sold, rented, or withdrawn.

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

A visitor can browse published listings, view property details, send an
inquiry, and eventually request a viewing appointment without first creating an
account.

### Registered User

Authentication and normal user accounts exist in the technical foundation.
The complete customer portal and its account-management capabilities are not
part of the current MVP. Future approved slices may let a user manage their
appointments or inquiries.

### Admin

The single agency admin manages contacts, properties, features, images,
listings, inquiries, and eventually viewing appointments. The MVP does not
include multiple organizations or a staff permission hierarchy.

## Problem

The platform gives a small agency one coherent workflow instead of disconnected
property records, public listing pages, and incoming customer requests.
Visitors receive clear property information and a direct path to contact the
agency. The admin retains the internal property history and public listing
lifecycle needed to follow a lead and close a listing.

## Core Workflow

1. The admin creates or updates an internal property.
2. The admin prepares a sale or rental listing and its images.
3. The admin publishes the listing.
4. A visitor discovers it through public search and views its detail page.
5. The visitor sends an inquiry or eventually requests a viewing.
6. The admin follows the lead.
7. The listing is sold, rented, or withdrawn and is archived accordingly.

## MVP Scope

- Authentication and protected single-admin access
- Contact management
- Property, feature, and image management
- Sale and rental listing drafting, publishing, and archiving
- Public property search and property detail pages
- Property inquiries and basic lead management
- Viewing appointment requests and management after that slice is specified
- Public availability and address-visibility rules
- German and English presentation

German and English apply to application interface copy. Admin-authored listing
titles, descriptions, and SEO content currently remain in the single language
in which they were entered. A multilingual listing-content model is deferred.

Implemented and planned status belongs in
[`frontend/roadmap.md`](frontend/roadmap.md) and the relevant backend documents;
this file defines scope, not completion status.

## Not in the Current MVP

- Multiple agencies, organizations, or tenants
- Staff roles and fine-grained permissions
- Full owner or customer portals
- Contracts and payments
- Advanced ownership management
- Blogging and analytics
- Saved properties, ratings, reviews, and comments
- Automated lead scoring and SMS notifications
- Marketplace capabilities
- Unspecified third-party business integrations

Cloudinary and required authentication email delivery are infrastructure, not
marketplace or business integrations. Inquiry email notification is optional
and currently deferred; stored inquiries and the Admin Dashboard are the first
notification surface.

## Product Rules That Must Remain True

- Prime Estate represents one agency and never exposes competing agencies.
- An internal property and a public listing are different records.
- Visitors access listings, never an unrestricted public property API.
- Exact addresses are private by default.
- Published slugs are stable.
- Sold and rented detail pages may remain public but cannot accept new inquiries
  or bookings.
- Withdrawn listings are not publicly accessible.
- Public content must not use fabricated trust claims or business statistics.

Detailed property and listing rules live in
[`backend/property-listings.md`](backend/property-listings.md).

## Success

The MVP is successful when the single admin can publish and manage a property
listing, a visitor can discover and understand it, the visitor can send an
inquiry or request a viewing, and the admin can follow the lead until the
listing is closed and archived.

## Not Yet Specified

The following require future product decisions rather than assumptions:

- Detailed viewing availability and booking rules
- The final scope of customer account capabilities
- Inquiry retention limits and final field-length contracts
- Production agency identity, legal text, domain, and hosting provider
- Blogging and analytics scope if they are promoted from deferred ideas

## Documentation Map

- [`architecture.md`](architecture.md): system-wide technical picture
- [`backend/api.md`](backend/api.md): implemented API phases and status
- [`backend/property-listings.md`](backend/property-listings.md): durable
  property and listing business rules
- [`backend/inquiries.md`](backend/inquiries.md): planned inquiry and basic lead
  contract
- [`frontend/architecture.md`](frontend/architecture.md): frontend ownership,
  folders, hooks, and state boundaries
- [`frontend/design-system.md`](frontend/design-system.md): visual and component
  rules
- [`frontend/roadmap.md`](frontend/roadmap.md): delivery status and current focus
- `frontend/pages/`: approved page-level UX specifications
