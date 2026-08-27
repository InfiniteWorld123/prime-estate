# Inquiries and Basic Lead Management

## Status

Implemented backend vertical slice. Public and Admin frontend integration remains
separate work.

## Purpose

Allow visitors to contact the agency either about a currently available public
listing or through the general contact form. PostgreSQL is the source of truth,
and the Admin Dashboard is the first notification surface.

Inquiry email notifications, WebSockets, server-sent events, staff assignment,
lead scoring, SMS, and viewing bookings are not part of this slice.

## Inquiry Types

All inquiries use one `inquiries` table and one lead workflow.

- `LISTING` inquiries reference one internal Listing. The public client sends a
  stable Listing Slug, which the backend resolves to the internal ID.
- `GENERAL` inquiries do not reference a Listing and require an `interest` of
  `BUYING`, `RENTING`, or `GENERAL`.

Database constraints enforce that `LISTING` has a Listing and no general
interest, while `GENERAL` has an interest and no Listing.

## Public Route

`POST /api/inquiries`

Shared request fields:

- `inquiry_type`
- `full_name`
- `email`
- Optional `phone`
- `message`
- Required `privacy_accepted: true`
- Optional invisible `website` honeypot, which must remain empty

A `LISTING` request also sends `listing_slug`. A `GENERAL` request instead sends
`interest`.

Rules:

- Authentication is not required.
- Text is trimmed and email is trimmed and lowercased before writing.
- The backend never accepts a client-supplied internal Listing ID.
- A Listing inquiry is accepted only while its Listing status is `PUBLISHED`.
- Missing, Draft, Sold, Rented, and Withdrawn Listings receive the same generic
  unavailable response without disclosing hidden state.
- A non-empty honeypot receives the normal generic success response but is not
  stored.
- One normalized email may save at most five inquiries in fifteen minutes.
- An identical email, inquiry type, target, interest, and message submitted
  within two minutes receives success without creating a duplicate row.
- The server records privacy-policy version `v1` and the acceptance timestamp;
  the client does not choose the recorded version.
- Success returns only `{ "received": true }` and no administrative fields.

## Lead and Inbox State

Lead status and inbox state are independent:

- Lead statuses: `NEW`, `CONTACTED`, `CLOSED`
- `read_at` records whether the admin has read the inquiry.
- `archived_at` removes an inquiry from the default active inbox without
  deleting its business history.

Allowed status transitions:

- `NEW` to `CONTACTED` or `CLOSED`
- `CONTACTED` to `CLOSED`
- `CLOSED` to `CONTACTED` to reopen the lead
- Sending the current status again is idempotent

An inquiry cannot transition from `CONTACTED` or `CLOSED` back to `NEW`.
Marking read, archiving, and unarchiving are idempotent operations.

There is no permanent delete route and no automatic retention deletion in the
MVP. A final production retention period remains a legal and product decision.

## Administrative Routes

All routes require a valid session, verified email, and `ADMIN` role.

- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/:id`
- `POST /api/admin/inquiries/:id/read`
- `PATCH /api/admin/inquiries/:id/status`
- `POST /api/admin/inquiries/:id/archive`
- `POST /api/admin/inquiries/:id/unarchive`

The list supports:

- `page` and `page_size`
- `sort=newest|oldest`, defaulting to newest
- `inquiry_type=GENERAL|LISTING`
- `interest=BUYING|RENTING|GENERAL`
- `lead_status=NEW|CONTACTED|CLOSED`
- `listing_id`
- `unread=true|false`
- `archive_status=active|archived|all`, defaulting to active

Listing inquiries return the current Listing ID, Title, Slug, Reference Number,
Listing Type, lifecycle Status, archive outcome, and derived availability.
General inquiries return `listing: null`.

## Frontend Integration

The public property dialog sends a `LISTING` inquiry. The Contact page sends a
`GENERAL` inquiry. Both should preserve form values after validation or server
errors, prevent duplicate clicks while submitting, and show the generic success
state after acceptance.

The future Admin screen may derive an unread count and use React Query
refetch-on-focus or periodic polling. It does not require real-time transport.
