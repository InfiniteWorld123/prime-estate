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

The remaining local work is verification and release packaging, not feature
development:

- Run formatting/check, type checking, tests, and the production build.
- Apply all migrations to the local Docker PostgreSQL stack.
- Run the core Admin-to-public workflow in a browser and confirm the resulting
  Inquiry rows in PostgreSQL.
- Recheck hidden-address and internal-field protection.
- Review the final diff, create logical commits, and push the current branch.

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

Complete the local release verification, commit and push the release candidate,
then defer only VPS deployment work to next month.
