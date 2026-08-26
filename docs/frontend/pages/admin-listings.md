# Admin Listings

## Status

**Mock-first administrative Listings workflow implemented.** The Listings
collection, active-Property selection, direct Property-to-Listing creation,
Listing Details/Edit, protected Preview, publication, archive outcomes,
Archived record, and Draft deletion are implemented as local UI states.
The guided Property setup reaches
`/admin/properties/:propertyId/listings/new`, creates a local Draft, and
navigates to its administrative Listing route.

Real API calls, React Query, TanStack Router URL ownership, authorization, and
server mutations belong to the later integration stage.

## Domain Boundary

A Property is the agency's internal physical record. A Listing is a public sale
or rental offer associated with that Property.

One Property may have at the same time:

- One non-archived Sale Listing.
- One non-archived Rental Listing.

It may not have two non-archived Listings of the same type. Archived history
does not prevent a later Listing when the backend lifecycle permits it.

## Listings Collection

The administrative collection lives at `/admin/listings` and mirrors the
implemented backend query contract without adding decorative view modes.

- Search covers title, slug, Property reference, city, and street.
- Primary filters are Listing status and Sale/Rent type.
- Advanced filters are city, minimum and maximum price, and archive outcome.
- Sorting offers every order supported by the backend.
- Desktop uses a compact table; smaller screens use cards.
- Pagination supports 20, 50, or 100 records per page.
- Empty results preserve the filters and offer a reset path.

The mock-first pass owns this state locally. During integration, TanStack
Router will own shareable filter and pagination URL state, while React Query
will own the server collection and preserved-data loading behavior. A Grid
toggle, bulk lifecycle actions, and global search are not part of this slice.

## Create Listing

### Route and Entry

Creating from the Listings area begins at:

```text
/admin/listings/new
```

This route lets the admin search and select one active Property. Each result
shows its reference, type, internal address, preparation state, and whether a
Sale or Rental Listing is available. Archived Properties are excluded.

- A missing cover image is a warning, not a creation blocker.
- No selected Features is neutral information because Features are optional.
- An existing non-archived Sale Listing disables Sale for that Property.
- An existing non-archived Rental Listing disables Rent for that Property.
- A Property with neither Listing type available cannot continue.

After Property selection, Continue navigates to:

```text
/admin/properties/:propertyId/listings/new
```

When Create Listing begins from the final Property setup stage or the Property
Details workspace, the Property is already known and the selection route is
skipped. An archived Property cannot create a Listing.

The fourth setup stage displays:

```text
Property details: complete
Images: complete or skipped
Features: complete or skipped
Listing: current
```

Creating a Listing is optional. The administrator may finish Property setup
without creating one and return later.

### Creation Result

The backend always creates a Listing as `DRAFT`. This page never publishes
directly and must not show a Publish action.

After successful Draft creation:

1. Show concise Draft-created feedback.
2. Navigate to `/admin/listings/:listingId`.
3. Continue editing, readiness review, and publication in the separately
   specified Listing Details workspace.

### Page Structure

```text
+-----------------------------------------------------------------------+
| Administration / Properties / PE-000123 / Create listing              |
+-----------------------------------------------------------------------+
| Set up property                                                       |
| Property details  Images  Features  Listing                            |
|                                                                       |
| Create listing                              Property context           |
| [ Sale ] [ Rent ]                           [ Cover image ]             |
|                                             PE-000123                  |
| [ Price........................ EUR ]        Type and internal address  |
| [ Title............................ ]        Living area and rooms      |
| [ Description....................... ]                                  |
| [ Exact address visibility switch ]                                  |
| [ SEO settings disclosure ]                                          |
|                                                                       |
| [Finish later]                                   [Create draft]        |
+-----------------------------------------------------------------------+
```

Use a wide form column and a quieter sticky Property-context panel on desktop.
The panel confirms which internal Property will own the Listing and may show:

- Cover image or missing-image fallback.
- Property reference number.
- Property type.
- Complete internal address.
- Living area and rooms.
- Selected-Feature count.

On mobile, place a compact collapsible Property summary before the form rather
than keeping a sticky side panel.

### Listing Type

Listing type is the only field required to create an otherwise incomplete
Draft:

- `Verkauf` / `Sale`
- `Vermietung` / `Rent`

Before offering a type, use the Property's linked Listing context when
available:

- Disable Sale with a clear explanation when a non-archived Sale Listing
  already exists.
- Disable Rent with a clear explanation when a non-archived Rental Listing
  already exists.
- Allow the remaining type so one Sale and one Rent may coexist.
- Keep the backend conflict response authoritative during integration.

If both types are unavailable, do not show an unusable form. Explain that the
Property already has both active Listing types and link to its Listings.

### Price

The currency is always EUR. The label and helper copy change with Listing type:

- Sale: Purchase price.
- Rent: Monthly base rent, not total warm rent.

Price is optional in a Draft. If entered, it must be finite and greater than
zero. Display `EUR` as an input suffix without putting currency text into the
numeric value.

### Public Content

Draft creation may collect:

- Title, prefilled by the backend from Property data when omitted.
- Description, prefilled by the backend from Property data when omitted.
- Exact-address visibility, default Off.

The generated Title and Description are ordinary editable Draft values. The
admin may change or clear them while drafting, but both must contain a value
before publication. Generation does not translate the content or create a
second language version.

The complete address is always visible in the internal Property context. The
visibility switch controls only whether the eventual public Listing reveals
street, house number, and unit. City and postal code remain public according to
the existing public contract.

### URL Slug

The backend generates a Slug from the Listing Title without exposing the
internal Property reference. It adds a numeric suffix such as `-2` if the same
Slug already exists.

- Show the generated Slug in an editable Draft field so the admin may customize
  it.
- A valid custom Draft Slug is preserved during publication.
- A published Slug is immutable.

### SEO Settings

Keep SEO in a quiet disclosure so the main Draft form remains simple. The
section contains only backend-supported fields:

- SEO title, optional.
- SEO description, optional.

Draft creation may leave both blank. A blank field remains the automatic mode:
the public response uses the current Listing Title or Description without
persisting a generated SEO copy. A custom SEO value is stored and takes
precedence. Do not add keywords, canonical URL, Open Graph upload, FAQ,
structured-data controls, or unsupported SEO fields.

### Validation

Use TanStack Form with the same submit-first behavior as other Prime Estate
forms:

1. Do not show errors for untouched optional fields.
2. On Create Draft, validate Listing type and every provided value.
3. After a field fails, revalidate it while editing and clear the error when it
   becomes valid.
4. Preserve all values after client or server errors.

Creating a Draft does not apply publication readiness validation. Missing
Price, cover image, Title, or Description must not prevent Draft creation. SEO
is always optional because blank values use the automatic fallback.

### Actions and Unsaved Changes

Provide:

- `Finish later`, returning to the internal Property Details workspace without
  creating a Listing.
- `Create draft`, the single primary action.

If the form has entered values, Finish later, browser back, or another in-app
navigation asks before discarding them. Do not prompt for an untouched form.

Prevent duplicate creation while pending. If creation fails, preserve the form
and show the business or validation error without exposing technical internals.

### Create States

- Initial type choice
- Sale selected
- Rent selected with monthly-base-rent semantics
- One Listing type unavailable
- Both Listing types unavailable
- Incomplete but valid Draft
- Client validation error
- Create pending
- Server conflict or validation error with values preserved
- Draft-created success and navigation
- Unsaved-changes confirmation
- Property-context image missing

The mock-first UI demonstrates these states locally. Real linked-Listing
availability, Draft creation, cache updates, and server navigation belong to the
integration stage.

## Listing Details and Lifecycle

The approved lifecycle workspace below is implemented mock-first. Property
images and the cover remain Property-owned, matching the backend contract. The
Listing workspace displays them and links to the Property Image and Feature
setup routes; it does not create a conflicting Listing-specific image store.

### Route and State Ownership

```text
/admin/listings/:listingId
```

One route owns all three lifecycle presentations. Do not add a separate
`/edit` route.

- `DRAFT` renders an editor, readiness panel, preview, publish, and delete.
- `PUBLISHED` renders an editor, live-publication information, public link, and
  archive action.
- `ARCHIVED` renders an immutable administrative record.

Publishing or archiving updates the same Listing and keeps the same route and
ID. The page presentation changes from the returned server status. The public
route remains separate at `/properties/:slug`.

### Shared Desktop and Mobile Layout

Desktop uses a wide content column and a narrow status panel. The status panel
is sticky below the Admin top bar: it stays visible while the longer content
column scrolls, then stops at the end of its container.

Mobile uses one column. The status panel participates in normal document flow
and is never sticky. The page preserves the same information and action order
without reducing content to a different workflow.

### Draft Editor

The Draft editor contains:

- Listing type, read-only after creation.
- Price, editable.
- Title, editable.
- Description, editable.
- Exact-address visibility, editable.
- SEO title and description in a quiet disclosure, editable and optional.
- Slug, editable until publication.

Use explicit Save changes rather than autosave. The Save action is enabled only
when the form is dirty. While saving, prevent duplicate submission. Success
shows concise saved feedback; failure preserves every value. Leaving with
unsaved changes asks before discarding them.

### Publication Readiness

The Draft status panel shows only real publication blockers:

- Price exists.
- Title exists.
- Description exists.
- A cover image exists.

Features and custom SEO are optional and do not appear as blockers. Slug is not
a blocker because the backend can generate it.

Each missing requirement directs the admin to its field or setup surface. The
Publish action remains visually and behaviorally disabled until all
requirements pass, but its explanation remains available on pointer hover and
keyboard focus. The explanation lists the current blockers rather than using a
generic disabled message.

### Draft Preview

```text
/admin/listings/:listingId/preview
```

Preview is a protected administrative route that reuses the public Property
Details presentation with a clear Draft-preview banner. It opens in a new tab,
uses the most recently saved Listing data, and disables inquiry and viewing
actions.

If the editor has unsaved changes, Preview is disabled with guidance to save
first. The preview is never indexed or exposed as a public Listing.

### Publish Confirmation

Publish never happens on the first click. The confirmation Dialog summarizes:

- Listing Title.
- Price.
- Effective public address visibility.
- Final public URL.

It explains that the Listing becomes searchable immediately, content and Price
remain editable, and Slug becomes immutable. One clear confirmation is enough;
do not require a checkbox or typed phrase.

While publication is pending, keep the Dialog open and prevent closing or
duplicate requests. On success, close the Dialog, announce success, and render
the `PUBLISHED` state on the same route. On failure, keep the Dialog open and
show a useful recoverable error.

### Published Editor

Published mode preserves the page structure but replaces readiness with a
sticky publication-information panel. It shows:

- Public visibility.
- Published timestamp.
- Effective public address visibility.
- Public URL with copy support.
- Open public Listing action.
- Archive Listing action.

Price, Title, Description, SEO overrides, and exact-address visibility remain
editable. Listing type and Slug are read-only. There is no return-to-Draft
action and no Delete action. Saved changes become public only after successful
Save changes; a failed update leaves the previously saved public version
intact.

### Archive Confirmation

Only `PUBLISHED` Listings may be archived. The Dialog requires one valid
outcome and no free-text reason, checkbox, or typed confirmation.

For Sale:

- `SOLD`: the public page stays accessible and is marked Sold.
- `WITHDRAWN`: the public page becomes unavailable and returns `404`.

For Rent:

- `RENTED`: the public page stays accessible and is marked Rented.
- `WITHDRAWN`: the public page becomes unavailable and returns `404`.

Sold and Rented public pages cannot accept inquiries or viewing requests.
Archiving is irreversible in the current lifecycle.

When a Sale is archived as Sold, explain any backend cascade before
confirmation: a published Rental Listing for the same Property is archived as
Withdrawn and a Rental Draft is deleted. Show this contextual warning only when
linked Rental work is affected.

While archiving is pending, keep the Dialog open and prevent closing or
duplicate requests. Success renders `ARCHIVED` on the same route; failure keeps
the Dialog and current Published data available.

### Archived Record

Archived mode is a calm read-only record, not a disabled form. It displays
content as labelled values plus:

- Archived status and outcome.
- Published timestamp.
- Archived timestamp.
- Effective public-page state.
- Link to the internal Property.

Sold and Rented outcomes retain Open public Listing. Withdrawn shows that the
public page is unavailable and does not render a public action. Do not render
Save, Publish, Archive, Delete, Restore, or editable controls.

When an SEO override is `NULL`, display that it automatically follows the
Title or Description rather than presenting an unexplained empty value.

### Delete Draft

Only a Draft may be permanently deleted. The confirmation Dialog identifies
the Listing type, Title, and linked Property and explains that deletion removes
only this Listing Draft. The Property, its images, and its Features remain.

No typed phrase or checkbox is required. Use a clear destructive action. While
deletion is pending, keep the Dialog open and prevent duplicate requests. On
success, navigate to `/admin/listings` and show deletion feedback. On failure,
keep the Dialog open with a retryable error.

## Page and Mutation States

### Initial Loading

Keep the Admin shell visible and use a content-shaped Skeleton matching the
editor and side panel. Do not replace the page with a blank screen or a lone
spinner.

### Load Error and Not Found

A full load error keeps the shell visible and offers Retry and Return to
Listings without technical details. A `404` uses a separate Not Found message
that explains the Listing may have been deleted or the URL may be incorrect.

### Form Validation

Use submit-first TanStack Form validation. After a field fails, revalidate it
while editing and clear its error when valid. Preserve all values after client
or server failures.

### Pending Mutations

Save, Publish, Archive, and Delete show progress inside their initiating
action and prevent duplicate work. Do not replace existing content with a
Skeleton during a mutation. Publish, Archive, and Delete Dialogs remain visible
until their request settles.

### Mutation Error

Keep current form values and saved page content visible. Show a useful message
near the affected action or inside its Dialog and allow Retry. If the server
reports that lifecycle state changed elsewhere, refetch authoritative Listing
data rather than continuing to present stale actions.

### Success

- Save announces that changes were saved without replacing the page.
- Publish announces success and renders Published mode.
- Archive announces success and renders Archived mode.
- Delete announces success after navigation to the Listings collection.

Feedback must be announced to assistive technology and must not rely only on
color.

### Background Refetch

Keep current content visible and use a subtle update indicator. A background
refetch failure must not replace usable Listing data with a full-page error.

## Publication Content Contract

- Draft creation supplies editable Title and Description defaults when they are
  omitted.
- Publication rejects a missing Title or Description.
- The Slug is generated automatically, remains editable during Draft, and is
  immutable after publication.
- Blank SEO values dynamically fall back to the current Title and Description;
  custom SEO values remain unchanged.

## Bilingual Behavior

- German is the default and uses `Inserat`, `Verkauf`, and `Vermietung`.
- English uses `Listing`, `Sale`, and `Rent`.
- Translate labels, descriptions, validation, availability explanations, and
  state feedback.
- Do not translate Property references, addresses, or administrator-entered
  Listing content.

## Accessibility

- Listing type is an accessible single-choice control with visible selected,
  focus, and disabled states.
- Every input has a persistent label and useful error association.
- The Property summary does not replace form labels or instructions.
- The SEO disclosure is keyboard operable and exposes its expanded state.
- The exact-address switch has a clear accessible name and explanation.
- Loading and navigation feedback is announced appropriately and respects
  reduced motion.

## Deferred Return Paths

When Property setup uses Finish later, the later entry points for returning to
Property images, Features, and Create Listing require a focused Property
Details navigation decision. They are deliberately not invented by this
Listing page specification.

## Next Slice

Real Listing queries, mutations, cache invalidation, protected sessions, and
server-aware navigation remain part of Stage 7 integration. Administrative
Inquiries begin only after their backend slice and final API contract are
implemented and verified.
