# Contact Page

## Status

Implemented, server-connected, and browser-verified. The bilingual form submits
a General Inquiry through the plain API module and React Query mutation using
the shared backend field limits. A real browser submission and its PostgreSQL
row were verified on 29 August 2026.

## Page Job

Give buyers, renters, and general visitors one clear, low-friction way to
contact Prime Estate without requiring an account or a specific property.

Property-specific questions continue to use the inquiry dialog on the property
detail page. The Contact page owns general agency contact.

## Route and Metadata Direction

- Route: `/contact`
- Initial title direction: `Contact Prime Estate | Erfurt & Thuringia`
- Initial description direction: invite visitors to contact the agency about
  buying, renting, or a general residential property question.

Metadata and visible interface copy support German and English. German remains
the default language.

## Page Structure

```text
+---------------------------------------------------------------+
| Marketing Header                                              |
+---------------------------------------------------------------+
| CONTACT INTRO                                                 |
|  Let's talk about your next property.                         |
|  Short professional and warm supporting copy                  |
+-----------------------------------+---------------------------+
| CONTACT FORM                      | CONTACT INFORMATION       |
|                                   |                           |
| Full name                         | Email                     |
| Email                             | Website                   |
| Phone (optional)                  | Location                  |
| Interested in                     | Working hours             |
| Message                           | Response expectation      |
| Privacy consent                   |                           |
| Send message                      |                           |
+-----------------------------------+---------------------------+
| FREQUENTLY ASKED QUESTIONS                                    |
|  Question disclosure                                             |
|  Question disclosure                                             |
|  Question disclosure                                             |
+---------------------------------------------------------------+
| QUICK PATHS                                                   |
|  Browse properties                         About Prime Estate |
+---------------------------------------------------------------+
| Marketing Footer                                              |
+---------------------------------------------------------------+
```

On mobile, the form appears before contact information because completing the
contact action is the page's primary job.

## Public Contact Information

Initial portfolio contact information:

- Email: `yamanwarda06@gmail.com`
- Website: `yamanwarda.dev`
- Location focus: Erfurt, Thuringia, Germany
- Street address: not yet supplied; omit it until confirmed rather than
  inventing one.
- Working hours: display a realistic schedule only after its exact days and
  times are confirmed. Until then, omit the row.

The final production agency identity, legal address, phone number, and working
hours remain replaceable content. Do not expose a private home address in the
public repository unless the user explicitly supplies and approves it for
publication.

## Contact Form

Use TanStack Form. Fields:

- Required full name
- Required email address
- Optional phone number
- Required interest selection:
  - Buying
  - Renting
  - General inquiry
- Required message
- Required privacy-consent checkbox with a Privacy Policy destination
- Invisible honeypot field

The form does not ask the visitor to sign in and does not present a customer
account concept.

## Validation Behavior

The form follows submit-first validation:

1. An untouched form shows no validation errors.
2. The first submit attempt validates every visible required field.
3. Focus moves to the first invalid field.
4. After a field's error has been revealed, that field revalidates while the
   visitor edits it.
5. Its message disappears as soon as its value becomes valid.
6. Fields that have not shown an error do not produce distracting validation
   while the visitor is still composing the form.

Initial validation direction:

- Trim text input before validation and submission.
- Full name must not be blank.
- Full name is limited to 120 characters.
- Email must have a valid shape and is limited to 254 characters.
- Optional phone accepts common international formatting and is limited to 40
  characters when present.
- Interest must be one of the three visible choices.
- Message must not be blank and is limited to 2,000 characters.
- Privacy consent must be accepted.

The request contract is finalized in
[`../../backend/inquiries.md`](../../backend/inquiries.md). Frontend and backend
rules must remain consistent.

## Form States

```text
Default -> First submit validation -> Submitting -> Success
                    |                    |
                    |                    +--------> Server error -> Retry
                    +-> Edit invalid fields -> Revalidate revealed errors
```

### Submitting

- Keep the form visible.
- Disable duplicate submission.
- Show progress in the `Send message` button.
- Preserve all values.

### Success

- Replace the form with a clear thank-you confirmation.
- Explain that the message was received and Prime Estate will respond using
  the supplied contact information.
- Do not promise an unapproved response time.
- Provide a clear action to send another message, which starts a fresh form.

### Server Error

- Preserve every entered value.
- Show a concise, non-technical message near the form actions.
- Keep a clear retry action.
- Do not expose backend details.

The integrated form uses the real mutation for submitting, success, and server
error states while preserving entered values on failure.

## Frequently Asked Questions

Include a small disclosure/accordion section with three practical questions.
The initial topics are:

- Which areas does Prime Estate serve?
- Can I contact the agency about buying or renting?
- Do I need an account to send a message?

Answers must stay concise and consistent with the approved product scope:
Erfurt and Thuringia are the focus, Germany-wide properties are possible, both
buying and renting are supported, and general contact does not require an
account.

## Responsive and Accessible Behavior

- Desktop uses a balanced form and information layout; mobile stacks the form
  first.
- Labels remain visible and are not replaced by placeholders.
- Errors are associated with their controls and are not communicated by color
  alone.
- Submit status is announced accessibly.
- FAQ disclosures support keyboard operation and meaningful expanded state.
- Touch targets remain comfortable on mobile.
- Language switching preserves entered form values where practical.
- Theme switching never resets the form.

## Component Direction

The route file remains thin and renders a `ContactPage` composition. Page-only
sections stay under the marketing Contact page folder. Reuse existing marketing
layout and `shadcn/ui` primitives for fields, selection, checkbox, disclosure,
and feedback where appropriate. The design must continue to use the Prime
Estate visual system rather than default component styling.

## Integration Boundary

The General Inquiry uses the shared implemented Inquiry endpoint, persistence,
honeypot, database-backed rate limit, duplicate suppression, privacy metadata,
and React Query mutation. Email notification remains outside the project.

## Excluded from This Slice

- Resend or other email notification
- Authentication requirement
- Interactive map
- Invented telephone number, office address, or response-time guarantee
- Live chat, WebSockets, or real-time presence
