# Release Readiness

## Purpose

This checklist defines when the implemented release candidate can be deployed
and frozen without adding another product module. Current local completion is
tracked in [`frontend/roadmap.md`](frontend/roadmap.md).

The hosting provider is intentionally not selected here. Provider-specific
commands are documented only after that decision is made.

## Required Release Decisions

- Select the production host, domain, and TLS/reverse-proxy setup.
- Supply the real public agency or portfolio identity, contact information, and
  approved Legal-page content. Do not publish invented legal or business data.
- Configure production PostgreSQL, Cloudinary, authentication email delivery,
  and every required environment value without committing secrets.
- Define persistent database backups and a basic restore procedure.
- Create and verify the one production `ADMIN` account through a controlled
  operation. Public sign-up remains disabled, and the public database must not
  be used to bootstrap an administrator.
- Decide the Inquiry retention policy. The shared field-length contract is
  already enforced in frontend validation, backend validation, and PostgreSQL.

## Pre-Deployment Gate

- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Apply every numbered migration to a fresh production-like database.
- Do not run development seed data in production.
- Verify that public APIs never expose hidden addresses, storage keys, secrets,
  or internal Property records.
- Verify that unauthenticated, unverified, and `USER` sessions cannot access
  `/api/admin/*`.

## Browser and Runtime Gate

Run the complete workflow against the release candidate:

1. Sign in as the verified Admin.
2. Create a Property, upload a cover image, and assign Features.
3. Create and publish a Listing.
4. Find the Listing through public search and open its detail page.
5. Submit one Listing Inquiry and one General Inquiry.
6. Confirm the stored records and process them in the Admin Inquiry Inbox.
7. Archive Listings through Sold, Rented, and Withdrawn test cases and confirm
   their documented public behavior.

Also inspect mobile, tablet, and desktop layouts; German and English; light and
dark themes; keyboard navigation; focus visibility; reduced motion; loading,
empty, error, retry, authorization, and missing-image states.

## Post-Deployment Gate

- Apply migrations before serving application traffic.
- Confirm the public home, search, Listing detail, Contact, Admin login, and
  Admin routes over HTTPS.
- Repeat the core Inquiry and Listing lifecycle smoke checks against production.
- Confirm uploaded images and database records survive an application restart.
- Confirm authentication and password-recovery email delivery.
- Confirm backups are running and record the restore instructions.

## Definition of Done

Prime Estate is finished when the frontend roadmap is complete, the production
URL passes this checklist, and the core workflow works without mock persistence
or fabricated content. Blogging, custom Analytics, a separate Lead/CRM system,
and Booking are not release blockers because they are outside the project.
