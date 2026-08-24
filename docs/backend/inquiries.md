# Property Inquiries

## Status

Planned backend vertical slice. It is documented now so the public property
detail UI can keep a stable contract, but implementation is deferred until the
team returns to backend work.

## Purpose

Allow any visitor to ask about an available public listing without creating an
account. Preserve the inquiry in PostgreSQL and surface it as an unread lead in
the Admin Dashboard.

The inquiry record is the source of truth. It must not exist only as a temporary
notification or email.

## Notification Decision

- Do not use WebSockets in the MVP.
- Do not send email through Resend in the first implementation.
- The Admin Dashboard uses React Query refetch-on-focus and optional one-minute
  polling while the dashboard is open.
- Email notification may be added later as an optional side effect after the
  inquiry is safely stored. Email failure must never lose the inquiry.

## Public Route

`POST /api/inquiries`

The request contains:

- Public listing slug
- Full name
- Email address
- Optional phone number
- Message
- Required privacy-consent acknowledgement
- An invisible honeypot field for basic bot detection

Rules:

- Authentication is not required.
- Normalize text and email before writing.
- Validate the request with Valibot.
- Resolve the public slug on the server; never trust a client-supplied internal
  listing ID.
- Accept inquiries only for currently published and available listings.
- Sold, rented, withdrawn, missing, and draft listings cannot receive an
  inquiry.
- Apply focused rate limiting without exposing whether a hidden listing exists.
- The backend records the submission time and the accepted privacy-policy
  version or equivalent consent metadata.
- Return a generic success response and do not expose administrative fields.

## Inquiry Record

The planned record contains at least:

- Generated inquiry ID
- Internal listing ID
- Full name
- Normalized email
- Optional normalized phone number
- Message
- Lead status
- `read_at`
- Privacy consent metadata
- Creation and update timestamps

Initial lead statuses:

- `NEW`
- `CONTACTED`
- `CLOSED`

Read state and lead status remain separate. Reading a message does not mean the
agency contacted the visitor.

## Administrative Routes

- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/:id`
- `POST /api/admin/inquiries/:id/read`
- `PATCH /api/admin/inquiries/:id/status`

Rules:

- Require a verified `ADMIN` session.
- List inquiries with pagination, newest first by default.
- Support filtering by unread state, lead status, and listing.
- Return the linked listing title, slug, reference number, and availability
  context needed by the dashboard.
- Marking an inquiry as read sets `read_at` once and is idempotent.
- Status changes accept only the defined transitions for the first version.
- Do not permanently delete inquiries in the first version.

## Frontend Contract

The public property detail page opens `Request information` in a dialog. The
form uses TanStack Form with validation on the first submit and revalidation
while editing invalid fields. It preserves entered values after validation or
server errors, prevents duplicate submission, and replaces the form with a
success state after a successful request.

The future Admin Dashboard treats unread inquiries as a derived notification
count and provides a dedicated inquiry-management screen. It does not require
WebSockets.

## Implementation Order

1. Finalize request, response, status, and retention contracts.
2. Add the authoritative SQL migration.
3. Add shared types and Valibot validation.
4. Implement the public create service, controller, route, and rate limit.
5. Implement protected admin list, detail, read, and status operations.
6. Add service, HTTP, authorization, validation, and duplicate-submit tests.
7. Run formatting, type checking, tests, and runtime API smoke tests.
8. Connect the public dialog and Admin Dashboard with React Query.

## Deferred

- Resend or other email delivery
- WebSockets or server-sent events
- Automated lead scoring
- Staff assignment and staff roles
- SMS notifications
- Viewing appointment booking, which remains its own later vertical slice
