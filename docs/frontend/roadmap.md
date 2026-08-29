# Frontend Completion Roadmap

## Purpose

This file is the source of truth for release completion. Prime Estate's product
scope is closed: no additional product module is planned.

Blogging, custom Analytics, appointment Booking, and a separate Lead/CRM system
are permanent exclusions. The Inquiry module remains a public contact flow and
a small administrative inbox with `NEW`, `CONTACTED`, and `CLOSED` processing
states.

## Implementation Status

**Feature implementation: Completed.**

The released frontend contains:

- Public home, Listing search/detail, About, Contact, and Legal pages in German
  and English.
- Admin-only email/password authentication, password recovery, protected Admin
  access, and session-aware sign-out. Public registration and customer-account
  presentation are disabled.
- Server-connected General and Listing Inquiry forms with shared limits,
  privacy consent, honeypot handling, duplicate-submit prevention, preserved
  values, and unavailable-Listing handling.
- Property, image, Feature, and Listing administration.
- `/admin/inquiries` with pagination, filters, sorting, detail, read state,
  `NEW`/`CONTACTED`/`CLOSED`, archive, and unarchive.
- `/admin` with Active Properties, Published Listings, Draft Listings, unread
  active Inquiries, and the five most recent active Inquiries. It uses existing
  list APIs and introduces no analytics endpoint.

The backend feature scope is also complete. Numbered migrations through
`0006_inquiry_field_limits.sql` define the current database contract.

## Release Verification

**Local release verification: Completed on 29 August 2026.**

- Formatting/check, type checking, tests, and the production build pass.
- The local Docker stack is healthy and migrations through `0006` are applied.
- The browser workflow passed from Admin sign-in through Property, image,
  Feature, Listing publication, public search/detail, both Inquiry forms,
  Inbox processing, and closing the Listing as Sold.
- The submitted Inquiry rows were confirmed in PostgreSQL before the exact
  synthetic browser-test records and uploaded test image were removed.
- Hidden street, house, and unit fields stayed absent from the public response
  and page when exact-address visibility was disabled.

Production hosting, TLS, environment provisioning, backups, real legal/business
identity, and post-deployment smoke checks are deferred to the VPS deployment
next month and tracked in [`../release.md`](../release.md).

## Explicit Project Exclusions

These are not backlog items and must not appear as disabled navigation or
`Coming soon` features:

- Blogging
- Custom analytics or event tracking
- A separate Lead/CRM system
- Appointment availability, scheduling, or Booking
- Customer, owner, or staff portals
- Staff roles and permissions
- Payments, contracts, saved properties, reviews, comments, or marketplace
  behavior

## Current Focus

The local release candidate is complete. Only the VPS deployment decisions and
post-deployment checks documented in [`../release.md`](../release.md) remain for
next month.
