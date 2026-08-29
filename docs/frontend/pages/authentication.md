# Admin Authentication UI

## Status

Completed and connected. Prime Estate authentication is an administrative
access surface only. Better Auth, verified sessions, email/password sign-in,
password recovery, real sign-out, safe redirects, and the backend Admin Guard
remain in place.

## Product Boundary

Visitors do not create accounts or sign in. Public browsing and Inquiry
submission require no account. Prime Estate does not present customer profiles,
favorites, dashboards, account menus, or future customer-account promises.

Public email/password registration is disabled in Better Auth. No request may
automatically create or promote an Admin. The one verified `ADMIN` account is
created through a controlled local or deployment operation and remains subject
to the single-Admin database constraint.

## Routes

- `/admin/login`
- `/admin/forgot-password`
- `/admin/reset-password`

The removed `/sign-in`, `/sign-up`, and `/verify-email` customer routes are not
part of the released interface. The marketing header and footer do not expose
authentication calls to action. A signed-in Admin may still see an
Administration entry and sign out while viewing public pages.

## Admin Sign In

Fields:

- Admin email address
- Password
- Keep me signed in
- Password-recovery link

The page uses the existing Prime Estate authentication layout but clearly
labels the surface as protected administration access. There is no Google
button, social-provider placeholder, registration link, or customer-account
copy.

Successful sign-in follows a safe same-origin relative `redirect` supplied by a
protected Admin route, otherwise it opens `/admin`. Invalid credentials,
non-Admin accounts, and unknown accounts receive the same concise failure
presentation. Backend authorization remains authoritative.

## Password Recovery

Password recovery is retained for the Admin account only:

1. `/admin/forgot-password` requests the six-digit Better Auth email OTP.
2. `/admin/reset-password` accepts the Admin email, OTP, and new password.
3. A successful reset returns to `/admin/login`.

Responses do not reveal whether an arbitrary address exists. The password
continues to require 12 characters, an uppercase letter, a number, and a
special character. Duplicate submission is disabled and recoverable values are
preserved.

## Route Protection and Redirects

- `/admin/*` checks for a session, verified email, and `ADMIN` role before
  rendering the shared shell.
- A missing or expired session redirects to `/admin/login` while preserving the
  requested local destination.
- An authenticated non-Admin is returned to the public home page and cannot
  access `/api/admin/*`.
- The backend Admin Guard remains the data-security boundary even when frontend
  navigation is hidden.

## Language, Theme, and Accessibility

- German and English copy is complete; German remains the default.
- Language and theme controls remain available on the three Admin-auth pages.
- Labels stay visible, focus moves to the first invalid field, errors are
  announced without relying on color, and pending requests prevent duplicates.
- Password show/hide controls have accessible names and reduced motion is
  respected.
