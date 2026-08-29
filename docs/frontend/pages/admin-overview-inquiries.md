# Admin Overview and Inquiry Inbox

## Status

Implemented and server-connected inside the protected Admin shell.

## Routes

- `/admin` renders the small operational Overview.
- `/admin/inquiries` renders the Inquiry Inbox.

Both routes require a verified `ADMIN` session. The backend Admin guard remains
the authoritative authorization boundary.

## Overview

The Overview composes existing list endpoints and displays only:

- Active Property total
- Published Listing total
- Draft Listing total
- Unread active Inquiry total
- Five most recent active Inquiries with links into the Inbox

It owns no backend endpoint, chart, event tracking, conversion metric, or custom
analytics system. Loading, partial-error retry, empty recent activity, German,
English, responsive layout, and keyboard focus are represented.

## Inquiry Inbox

The Inbox uses the existing Admin Inquiry APIs for:

- Active, archived, or all records
- Pagination with 20, 50, or 100 records per page
- Newest or oldest sorting
- Type, interest, processing-status, Listing ID, and read-state filters
- Detail with contact information, message, Listing context, privacy record,
  and timestamps
- Automatic idempotent mark-read when opening detail
- Allowed `NEW`, `CONTACTED`, and `CLOSED` transitions
- Archive and unarchive without permanent deletion

Collection and detail loading, empty, error, retry, mutation-pending,
authorization, mobile card, desktop table, German, English, and accessible
dialog/control states are included.

## Scope Boundary

This is an Inquiry inbox, not a Lead or CRM module. It has no notes, tasks,
assignment, scoring, pipeline, reminders, email notifications, appointment
scheduling, or permanent delete action.
