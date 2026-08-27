# Authentication UI

## Status

Completed. The bilingual authentication UI is connected to Better Auth for
email/password sign-up, verification OTP, sign-in, password recovery, session
queries, sign-out, session-aware navigation, and administrative route
protection. Google authentication and customer account tools remain deferred.

## Slice Job

Allow any visitor to create and verify an account, sign in, recover a forgotten
password, set a new password, and sign out through one coherent experience.

The current MVP does not include a customer dashboard. A signed-in customer
returns to the marketing home page. Appointments, favorite properties, profile
management, and other customer account tools are future capabilities and must
not be presented as working destinations.

## Approved Routes

- `/sign-in`
- `/sign-up`
- `/verify-email`
- `/forgot-password`
- `/reset-password`

Successful customer sign-in returns to `/` unless a safe same-origin relative
destination was supplied. A verified Admin defaults to `/admin/properties`,
and protected Admin routes preserve the requested local destination through
Sign In.

## Visual Direction

Authentication uses the Prime Estate design system and must feel current,
precise, and trustworthy rather than rustic, luxurious, or like a default
authentication template.

Desktop entry pages use an intentionally asymmetric split:

```text
+--------------------------------------+------------------------+
|                                      | Prime Estate           |
|  Architectural image from Erfurt     |                        |
|  with restrained deep-blue overlay   | Page heading           |
|  and subtle survey-plan lines         | Supporting copy        |
|                                      |                        |
|  One short location-aware statement  | Form fields            |
|                                      | Primary action         |
|                                      |                        |
|                                      | Google · Coming later  |
|                                      | Related auth link      |
+--------------------------------------+------------------------+
```

The image area is wider than the form area rather than a generic equal
half-and-half composition. It carries one short statement only; it does not
contain statistics, testimonials, a property search, or invented agency
claims.

On mobile, remove the large media panel and keep the Prime Estate identity,
form, and one restrained architectural detail. The form remains the first and
only task.

Verification, reset-password confirmation, and other focused transition states
use a centered card with enough surrounding space. They do not need the full
split layout when it distracts from entering a short code or reading a result.

## Shared Form Behavior

All non-trivial forms use TanStack Form and the shared validation contracts
where those contracts already exist.

- Untouched forms show no validation errors.
- The first submit validates every required field.
- Focus moves to the first invalid field.
- Revealed invalid fields revalidate while the visitor edits them.
- An error disappears as soon as its value becomes valid.
- Server errors preserve all entered values except passwords where retaining a
  value would be unsafe or misleading.
- Submitting disables duplicate submission and shows progress in the primary
  action.
- Labels remain visible; placeholders are examples, not replacements.
- Password fields provide show/hide controls with accessible names.
- Status and errors are announced accessibly and never rely on color alone.

Exact backend messages are mapped to concise user-facing German and English
copy. Do not display raw technical errors.

## Sign Up

Fields:

- Full name
- Email
- Password
- Confirm password
- Required acceptance of Terms and Privacy Policy

The current shared backend contract requires:

- A trimmed name of at least 3 characters
- A valid normalized email address
- A password of at least 12 characters
- At least one uppercase letter
- At least one number
- At least one special character
- Matching password confirmation

Show the password requirements near the password field and update their visual
state as the visitor types after interaction. Do not reduce them to a vague
strength meter.

The current backend sign-up schema does not persist Terms or Privacy acceptance.
The UI requires the visitor to accept the existing Terms and Privacy pages
before submission, but this is not a persisted legal-consent record. Production
legal compliance and any durable consent evidence require a separate approved
contract rather than an implicit authentication migration.

Successful sign-up does not imply a verified account. The next action requests
an email-verification OTP and opens `/verify-email`.

## Email Verification

The implemented backend uses a six-digit numeric OTP:

- Length: 6 digits
- Expiry: 5 minutes
- Allowed verification attempts: 3
- Verification email is not sent automatically by Better Auth on sign-up; the
  frontend integration requests it explicitly.

### Email Handoff

After sign-up, the frontend may store the normalized pending email in
`sessionStorage` and navigate to `/verify-email`. This storage is a UX
convenience only and is never proof of identity or verification.

The verification page:

- Reads and masks the remembered email for display.
- Submits the complete email and OTP to the backend.
- Allows the visitor to use a different email.
- Shows an email field when opened directly or when pending state is missing.
- Removes pending verification state after success.
- Supports resending the code with clear progress and cooldown feedback.

The backend remains the only source of truth for OTP validity, expiry,
attempts, and verified status.

```text
+---------------------------------------------+
| Prime Estate                                |
|                                             |
| Verify your email                           |
| We sent a code to ya***@gmail.com           |
|                                             |
| [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]       |
|                                             |
| Verify email                                |
| Resend code             Use another email  |
+---------------------------------------------+
```

On success, show a short confirmation and a clear path to sign in. Email
verification does not claim a signed-in session; the visitor continues through
the explicit Sign In flow.

## Sign In

Fields and controls:

- Email
- Password
- Remember me
- Forgot password link
- Primary `Sign in` action
- Disabled Google action labeled `Coming later`
- Link to create an account

Email and password are the only active sign-in method. The Google control is
clearly unavailable, remains keyboard-understandable as unavailable, and does
not begin an OAuth flow.

An unverified account receives a clear message and a direct path to send a new
verification code. Avoid revealing whether arbitrary email addresses exist in
password-recovery responses.

## Forgot Password

The page asks only for the account email. A successful request shows a generic
confirmation that a reset code will be sent when the address is eligible.

The implemented backend sends a six-digit `forget-password` OTP. The frontend
uses the same pending-email handoff principle as verification, with a separate
session-storage key so the two flows cannot overwrite one another.

The success action navigates to `/reset-password`. Direct access without
remembered state shows an email field rather than blocking the visitor.

## Reset Password

Fields:

- Email when pending recovery state is unavailable or changed
- Six-digit reset code
- New password
- Confirm new password

The new password follows the same current 12-character, uppercase, number, and
special-character contract as sign-up. Successful reset replaces the form with
a confirmation and a single `Sign in` action.

Expired or invalid codes preserve the email, display a clear correction path,
and allow requesting a new code. Duplicate submission is disabled.

## Header and Session-Aware Navigation

### Signed Out

Show `Sign in` and `Sign up` in the marketing header using the established
desktop and mobile navigation patterns.

### Signed In Customer

Replace those actions with a circular account trigger:

- Use a profile image when a valid one exists.
- Otherwise use safe initials derived from the display name.
- The current dropdown shows the signed-in identity and `Sign out`.
- Favorites, bookings, and profile settings are future customer capabilities;
  do not render active destinations until their slices exist.

### Signed In Admin

The integrated dropdown exposes Administration to a verified `ADMIN`.
Authorization is enforced by the backend and protected route behavior, never
by merely hiding or showing a menu item.

### Sign Out

- Show progress and prevent duplicate requests.
- On success, clear session-aware frontend state and return to the marketing
  home page.
- On failure, keep the user-visible session state and allow retry rather than
  pretending sign-out succeeded.

## Page and Request States

Every flow defines the relevant states:

- Default
- First-submit validation
- Submitting
- Server error with preserved recoverable input
- Success or next-step confirmation
- Expired OTP
- Invalid OTP
- Resend pending, sent, and cooldown
- Missing pending email
- Already authenticated visitor

An already authenticated customer visiting a sign-in or sign-up route is
redirected home. An authenticated Admin is redirected to `/admin/properties`.

## Language, Theme, and Accessibility

- German and English copy is complete from the first UI implementation.
- German remains the default language.
- Language and theme controls remain available without overwhelming the form.
- Switching language or theme preserves safe non-password form values where
  practical.
- OTP entry supports paste and mobile numeric input.
- Keyboard order follows the visual task order.
- Focus is deliberately placed after route transitions and unsuccessful
  submissions.
- Reduced-motion preferences are respected.
- Light and dark contrast must be verified.

## Component and Folder Direction

Route files remain thin and render page components. Reusable authentication
form fields and state feedback live under the authentication feature; page-only
compositions stay under the authentication pages. Page hooks coordinate their
forms and consume plain auth API/React Query operations rather than calling the
backend directly from UI components.

The existing auth transport and validation code must be reviewed rather than
duplicated when integration begins.

## Connected Boundary

- Better Auth owns session cookies and email/password authentication.
- The email OTP plugin owns verification and password-reset codes.
- Plain frontend auth transport is consumed through focused React Query hooks.
- Only same-origin relative callback destinations are accepted.
- `/admin` validates the session, verified email, and `ADMIN` role before
  rendering. The backend Admin Guard remains the actual data-security boundary.
- Header account state and sign-out use the real session rather than local
  preview storage.
- The disabled Google action remains presentation-only and never starts OAuth.

## Deferred

- Working Google OAuth
- Customer dashboard
- Favorite properties
- Viewing and appointment management for customer accounts
- Profile editing and customer settings
- Additional social providers
- Multi-factor authentication beyond the existing email OTP flows
