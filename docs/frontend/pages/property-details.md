# Public Property Details

## Status

Public Listing integration is completed. Listing Inquiry submission is
implemented in the current working tree and passes the automated quality gates;
final browser submission and stored-row verification remain.

The current page loads `GET /api/listings/:slug` through a plain frontend API
module and a focused React Query hook. It renders real Listing, Property,
Feature, and image data while retaining development-only state previews. The
inquiry dialog submits the current Listing slug through the shared Inquiry API.

## Page Job

Help a buyer or renter understand one property, trust the information, inspect
its images, and take the next useful action without the dense appearance of a
multi-agency marketplace.

The experience remains professional, warm, calm, local to Erfurt and Thuringia,
and usable throughout Germany.

## Route

The public route is `/properties/$slug`.

The route stays thin: it reads the slug and renders the page. The page hook owns
the current React Query orchestration, retry behavior, and not-found mapping.
Page markup remains outside the route. Server-aware metadata and optional route
preloading may be added in a later SEO-focused pass without changing the page
composition.

## Backend Detail Contract

The existing `GET /api/listings/:slug` response provides:

- Slug, title, description, SEO title, and SEO description
- Sale or rental listing type
- Price and EUR currency
- Availability and sold or rented archive outcome
- Public property reference number and property type
- Address fields permitted by the exact-address visibility rule
- Living area, optional plot area, rooms, optional bedrooms, bathrooms,
  optional construction year, optional floor number, and optional total floors
- Ordered images and cover-image metadata
- Features
- Published and optional archived timestamps

Withdrawn listings and unknown slugs return `404 Not Found`. Sold and rented
detail pages remain publicly accessible but cannot receive inquiries.

## Page Composition

```text
+---------------------------------------------------------------+
| Marketing Header                                              |
+---------------------------------------------------------------+
| Breadcrumb                                                    |
|                                                               |
| +--------------------------------+ +------------+ +-----------+|
| |                                | | thumbnail  | | thumbnail ||
| |       large cover image        | +------------+ +-----------+|
| |                                | | thumbnail  | | +N photos ||
| +--------------------------------+ +------------+ +-----------+|
|                                                               |
| Status · Title · Public location                    Price      |
| Rooms · Living area · Bathrooms · Property type               |
+------------------------------------------+--------------------+
| Description                              | Sticky contact     |
| Features                                 | card               |
| Property details                         |                    |
| Location                                 |                    |
+------------------------------------------+--------------------+
| Marketing Footer                                              |
+---------------------------------------------------------------+
```

## Gallery

### Desktop

- Show one large cover image and four smaller thumbnails in a two-by-two grid.
- Preserve the backend image order.
- When more images exist than visible slots, the last thumbnail shows the
  remaining count, for example `+4 photos`.
- Selecting any visible image opens the complete gallery in a lightbox.
- Do not add a long e-commerce-style thumbnail strip below the gallery.

### Lightbox

The lightbox covers the page with a darkened overlay and displays one image at
a useful large size. It includes:

- Previous and next controls
- Current image counter, for example `2 / 8`
- Close button
- Left and right arrow-key navigation
- Escape-to-close
- Focus containment and focus return to the trigger that opened it
- Image alt text and accessible control names

Clicking the remaining-image thumbnail opens the first image not already shown
in the static gallery.

### Mobile

- Show one image at a time rather than the desktop thumbnail grid.
- Support swipe navigation.
- Display a persistent image counter such as `1 / 8`.
- Tapping the image opens the same lightbox behavior.
- Avoid autoplay and decorative gallery animation.

### Image Failure

- A failed individual image uses the established property-image fallback.
- Other working images remain available.
- When every image fails, show one gallery-sized `Images unavailable`
  placeholder instead of multiple broken tiles.
- Skeleton geometry matches the final gallery.

## Listing Summary

Below the gallery, show:

- Listing intent and availability
- Listing title
- Public location
- Exact street, house number, and unit only when the API exposes them
- Otherwise city and postal code with `Exact address on request`
- Purchase price for sale or monthly base rent for rental

The first fact row contains the most useful available information:

- Rooms
- Living area
- Bathrooms
- Property type

Do not repeat the same value in decorative summary cards elsewhere.

## Main Content

### Description

Render the listing description as readable paragraphs with a comfortable line
length. Preserve meaningful line breaks without allowing arbitrary HTML from
the backend.

### Features

Render available features as a calm two-column checklist on wider screens and
one column on narrow screens. Feature labels come from the backend and must not
be inferred from unrelated property fields.

### Property Details

The details area may contain:

- Reference number
- Bedrooms
- Plot area
- Construction year
- Floor number
- Total floors

Optional information follows an omission rule: when a value is `null` or not
provided, hide the complete row, including its label. Never render `null`, an
empty label, an empty card, or a placeholder dash for absent optional data.

### Location

- Show the permitted textual address and location context.
- Do not render a map in the first version because the public API does not
  provide coordinates.
- Never derive or geocode a hidden exact address on the client.

## Contact Card

The contact card appears beside the main content on desktop and remains sticky
within its content column. It stops at the end of the page content rather than
covering the footer.

On mobile it becomes a normal block in the reading flow and never occupies a
fixed portion of the viewport.

The card shows:

- Public property reference
- `Prime Estate Team`
- A short response expectation without promising an unsupported response time
- Primary `Request information` action

There is no separate appointment-scheduling flow. Visitors who want a viewing
use `Request information`, and the agency coordinates the timing manually after
contact.

## Request Information Dialog

The primary contact action opens a dialog without requiring authentication.
The form uses TanStack Form and contains:

- Required full name
- Required email address
- Optional phone number
- Required editable message, prefilled with the listing reference
- Required privacy-consent checkbox with a Privacy Policy link

The listing slug and internal page context are submitted automatically and are
not editable form fields. The backend resolves the slug rather than trusting an
internal ID supplied by the browser.

### Validation Behavior

- Do not show validation errors merely because an untouched form opened.
- Validate every field on the first submit attempt.
- After an invalid field has been revealed, revalidate it while the visitor
  edits it.
- Remove its error as soon as the value becomes valid.
- Preserve every entered value after client validation or server failure.
- Place specific messages next to their fields and move focus to the first
  invalid field after an unsuccessful submit.

Initial validation rules:

- Trim all text input.
- Full name must be non-blank.
- Email must use a valid email shape.
- Phone remains optional and accepts common international formatting.
- Message must be non-blank and remain within the backend maximum.
- Privacy consent must be accepted.

The frontend follows the implemented Inquiry contract. Do not maintain
contradictory validation limits.

### Dialog States

#### Default

The editable form is ready and contains the prefilled inquiry message.

#### Submitting

- Keep the form visible.
- Disable duplicate submission.
- Show progress in the submit button.
- Do not clear values or close the dialog.

#### Server Error

- Preserve all entered values.
- Show a concise non-technical error near the form actions.
- Allow another submit attempt.

#### Success

- Replace the form with a confirmation message.
- Explain that the Prime Estate team will contact the visitor.
- Provide one clear close action.
- Closing and reopening after success starts a fresh form.

The current implementation maps these states to the real mutation documented in
[`../../backend/inquiries.md`](../../backend/inquiries.md).

## Availability States

### Available

Show the contact action normally.

### Sold or Rented

- Keep the complete public detail page accessible.
- Show a prominent textual status banner near the listing summary.
- Disable the inquiry action.
- Explain why the actions are unavailable; color alone is insufficient.
- Offer an active `Browse available properties` action.
- Use `Sold` only for sale listings and `Rented` only for rental listings.

### Withdrawn

Do not expose the detail page. Treat it as the same public `404` used for an
unknown slug.

## Page States

### Initial Loading

Render a page-shaped skeleton rather than a centered spinner:

- Large gallery and four thumbnail placeholders on desktop
- One gallery placeholder on mobile
- Title, location, and price lines
- Four primary fact placeholders
- Description, features, details, and contact-card placeholders

The final content must not produce a large layout shift.

### Full Error

Keep the marketing header and footer. Show:

- `We couldn't load this property`
- `Try again`
- `Back to properties`

Do not expose technical details or render partially invented property content.

### Not Found

Unknown and withdrawn slugs share one neutral public response:

- `Property not found`
- Explain that the property may have been removed or the link may be incorrect
- Primary `Browse available properties` action
- Secondary `Contact us` action when the contact destination exists

Do not reveal whether a hidden internal listing exists.

### Background Refresh Error

When useful detail data is already visible:

- Preserve the last successful data.
- Show a compact refresh-failed message and retry action.
- Do not replace the page with the full error state.

## Language and Formatting

- German and English interface copy is complete from the first implementation.
- German remains the default language.
- Listing-authored content is not translated by the frontend. The title,
  description, and SEO fields remain in the single language entered by the
  admin and are displayed unchanged in both interface languages.
- Full multilingual listing content is a deferred backend and database feature;
  do not model mock-only translations that the current API cannot provide.
- Prices use EUR locale formatting.
- Rental prices clearly communicate their monthly basis.
- Areas use square metres.
- All status, gallery, contact, validation, success, and failure copy is
  translated.
- Switching language does not reset the gallery or an open form unnecessarily.

## SEO and Metadata

During API integration:

- Use backend `seo_title` and `seo_description` with documented fallbacks.
- Keep the canonical route based on the immutable published slug.
- Return not-found metadata and HTTP behavior for unknown and withdrawn slugs.
- Preserve accessible sold and rented pages with accurate status content.
- Use meaningful image alt text from the response; do not stuff location or
  keywords into alt text.

Structured data and broader SEO enhancements belong to the later SEO review
rather than the mock UI pass.

## Component and Folder Direction

```text
src/frontend/
|-- features/
|   |-- inquiries/components/
|   |   `-- InquiryDialog.tsx
|   `-- listings/components/
|       |-- PropertyGallery.tsx
|       `-- PropertyDetailSkeleton.tsx
|-- hooks/pages/
|   `-- usePropertyDetailsPage.ts
|-- pages/marketing/property-details/
|   |-- PropertyDetailsPage.tsx
|   |-- property-details.mock.ts
|   `-- sections/
|       |-- PropertyGallerySection.tsx
|       |-- PropertySummarySection.tsx
|       |-- PropertyContentSection.tsx
|       `-- PropertyContactSection.tsx
`-- routes/_marketing/
    `-- properties.$slug.tsx
```

Gallery and inquiry-dialog behavior are domain concepts and may live under
their feature folders. Page-only composition stays under the property-details
page. The route contains no page markup.

During integration, add plain API and focused React Query modules without
moving visual markup into hooks:

```text
api/public-listing.api.ts
features/listings/hooks/usePublicListing.ts
api/inquiry.api.ts
features/inquiries/hooks/useCreateInquiry.ts
```

## Mock UI Implementation Sequence

1. **Foundation:** add only required UI primitives, detail types, one complete
   deterministic mock listing, the thin slug route, page composition, and local
   state-preview support.
2. **Gallery and summary:** build responsive gallery, thumbnail overflow,
   lightbox, listing header, price, public address, and primary facts.
3. **Content and contact:** build description, features, optional detail rows,
   location treatment, sticky desktop contact card, and mobile reading order.
4. **Inquiry dialog:** build TanStack Form behavior and default, validation,
   submitting, server-error, and success previews without an API request.
5. **Page states and language:** build loading, full error, not found,
   background error, missing images, sold, and rented states in German and
   English.
6. **Wiring and verification:** connect the page hook and sections, activate
   card navigation, then run formatting, type checking, build, responsive,
   keyboard, theme, reduced-motion, and bilingual checks.

## Accessibility

- Gallery controls use buttons with meaningful names and visible focus.
- The lightbox traps focus, supports Escape, and returns focus to its trigger.
- Images use useful alt text or empty alt text when decorative.
- Status and errors are communicated with text, not color alone.
- Dialog labels and validation messages are programmatically associated with
  their fields.
- Submit progress is announced without repeatedly interrupting screen readers.
- Disabled actions include a nearby explanation.
- Motion respects reduced-motion preference.

## Completion Criteria

### Mock UI Pass

- `/properties/$slug` renders through a thin route and composed page.
- The approved desktop and mobile structure is implemented.
- Gallery, remaining-image count, lightbox, swipe direction, and fallbacks work.
- Available, sold, rented, loading, error, not-found, refresh-error, and
  missing-image states are previewable.
- Optional absent information hides its complete row.
- TanStack Form reproduces the approved validation and dialog states.
- German and English, light and dark themes, supported viewports, keyboard
  navigation, and reduced motion are verified.
- Formatting, type checking, focused tests, and production build pass.

### Integration Pass

- **Completed:** The page reads `GET /api/listings/:slug` through a plain API
  function and focused React Query hook.
- **Completed:** Pending, not-found, error, client metadata, and background
  refresh behavior use the real response contract.
- **Completed:** Property cards navigate to their real slug routes.
- **Implemented, verification pending:** The inquiry dialog submits through the
  documented backend Inquiry endpoint.
- **Completed:** Sold, rented, withdrawn, and address-visibility behavior
  matches the backend contract.
- **Completed:** Focused mapping tests, formatting, type checking, production
  build, API smoke tests, and browser-level verification pass.
