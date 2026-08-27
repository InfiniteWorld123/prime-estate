# Admin Properties

## Status

**Collection, guided setup, and backend integration are completed.** The
`/admin/properties` collection is implemented with responsive Table, Grid, and
mobile-card representations, deterministic data, quick and advanced filters,
sorting, pagination, selection, local archive/restore/delete previews,
confirmation dialogs, loading, empty, and missing-image behavior. The
`/admin/properties/new` creation experience is also implemented with bilingual
TanStack Form validation, agency-owned and external-client sources, contact
selection and local contact creation, unsaved-change protection, mock submit
states, and direct success navigation to `/admin/properties/:id/images`.

The Image Setup implements local multi-file selection, format/size/capacity
validation, a three-item upload queue, real upload, cover selection, ordering,
alt-text editing, deletion, retry behavior, and navigation to Features. Feature
Setup implements catalog search, backend Feature creation, complete-set saving,
unsaved-change protection, and direct navigation to
`/admin/properties/:id/listings/new`. The setup routes are independent Admin
pages rather than nested render children of Property Details.

Property Details/Edit will be added to this document after its separate
discussion is approved.

Plain API transport, React Query queries and mutations, TanStack Router URL
ownership, loading, empty, retry, and server-error behavior are implemented.
Better Auth route protection and redirects remain a separate Stage 7 slice.

## Purpose

Give the single Prime Estate administrator a clear operational view of every
internal property record. The page supports finding, comparing, opening, and
selecting properties without confusing an internal Property with its public
sale or rental Listings.

Visitors never access this page or its Property records.

## Route and Entry

```text
/admin/properties
```

Until the final Overview is built, `/admin` redirects to this route. Properties
is the active Admin Shell navigation item.

## Page Structure

```text
+-----------------------------------------------------------------------+
| Administration / Properties                         DE  Theme  Account |
+-----------------------------------------------------------------------+
| Properties                                      [ Create property ]    |
| Manage the agency's internal property records.                        |
|                                                                       |
| [ Search........................ ] [Status] [Type] [More filters]      |
| [Sort...........................]                    [Table] [Grid]     |
|                                                                       |
| Result count or selection toolbar                                     |
|                                                                       |
| Table or Grid result collection                                       |
|                                                                       |
| Items per page             Previous  1  2  3  ...  12  Next           |
+-----------------------------------------------------------------------+
```

Do not add statistics, charts, global search, notifications, or decorative
controls to this page.

## Page Header

The header contains:

- Bilingual page title: `Immobilien` / `Properties`.
- One short functional description.
- One primary action: `Immobilie anlegen` / `Create property`.

The action starts the separately specified Create Property workflow.

## Collection Views

### Table

Table is the default desktop view and the primary operational representation.
Each row contains:

- Selection checkbox.
- Cover thumbnail or the approved missing-image fallback.
- Reference number and Property type.
- Complete internal address.
- Property source and primary contact when applicable.
- Living area and room count.
- Active or Archived status.
- Last-updated time.
- Three-dots actions menu.

The exact visible column balance may compact at narrower desktop and tablet
widths. Important values remain available through the row or its detail page.

### Grid

Grid is an optional desktop visual representation of the same result set. Each
card contains the same essential information and selection checkbox, with the
property image given more visual space. Grid does not change the query,
pagination, filters, sorting, or available actions.

### Mobile

Mobile uses one card collection. It does not show the Table/Grid toggle and
does not compress the desktop table. Each card remains selectable and exposes
the same three-dots actions menu.

### View Preference

Use an accessible labelled Toggle Group rather than semantic Tabs. Table is the
initial default. The selected desktop view may persist locally on the device.
It is visual preference state and does not belong in the URL or backend.

## Search

Search uses the backend-supported administrative search fields:

- Reference number
- Street name
- House number
- City
- Postal code
- Primary contact full name
- Primary contact company name

The search field applies after a short debounce rather than on every
keystroke. Trimming or clearing the value returns to the unsearched result set
and resets the page to 1.

## Quick Controls

Keep the most common controls visible:

- Archive status: Active, Archived, or All
- Property type: Apartment or House
- Sort
- More filters

Archive status defaults to Active. Changing a quick filter or sorting applies
it immediately and resets pagination to page 1.

## More Filters

The expanded filter surface supports every filter exposed by the current
backend contract:

- Property source: Agency-owned or External client
- City
- Five-digit postal code
- Primary contact
- Minimum and maximum living area
- Minimum and maximum plot area
- Minimum and maximum rooms
- Minimum and maximum bedrooms
- Minimum and maximum bathrooms
- Minimum and maximum year built

Use a responsive Sheet on mobile and a spacious Popover, Sheet, or side panel
on larger screens. The exact primitive may be selected during implementation
according to content fit.

Advanced filter values remain draft values until the administrator selects
`Apply filters`. The surface also provides `Reset filters`. Invalid ranges,
such as a minimum greater than its maximum, are explained before a request is
made.

After applying, active advanced filters are summarized as removable chips near
the result count. Clearing a chip applies the remaining filters and resets the
page to 1.

## Sorting

Expose every sort supported by the administrative Properties backend:

- Newest
- Oldest
- Recently updated
- Reference ascending
- Reference descending
- Living area ascending
- Living area descending
- Rooms ascending
- Rooms descending
- Year built ascending
- Year built descending
- City ascending
- City descending

Newest is the default. Labels are translated for German and English, while the
API values remain stable internal identifiers.

## Result Count and Selection Toolbar

Without selection, show the total result count in plain language.

When one or more properties are selected, replace the normal result summary
with a selection toolbar containing:

- Selected count
- Clear selection
- Bulk archive

Selection applies only to the currently visible page. Navigating to another
page or changing search, filters, or sorting clears it so actions never include
hidden records unexpectedly.

`Select all` means all eligible properties on the current page, never all
matching properties across every page. There is no archive-everything action.

## Bulk Archive

- Accept between 1 and 100 unique Property IDs, matching the backend contract.
- Enable Bulk archive only when every selected property is active.
- Open a confirmation Dialog that states the selected count and consequence.
- The operation succeeds or fails as one transaction.
- Prevent repeated submission while the request is pending.
- On success, clear selection and refresh the affected result data.
- On failure, preserve selection and show a useful message without exposing
  technical internals.

Pending, success, and failure states use the backend bulk-archive mutation.

## Row and Card Actions

Use one consistent three-dots menu rather than displaying many inline buttons.
The menu may contain:

- View details
- Edit property
- Archive when active
- Restore when archived
- Delete property

Archive, Restore, and Delete require confirmation. The backend remains
authoritative for business eligibility:

- A Property cannot be archived while it has an open Listing.
- Permanent deletion is allowed only when no Listing has ever been published,
  no Inquiry or Viewing exists, and draft Listings are deleted first.

The current collection response does not expose a complete `can_delete` or
blocking-reason capability. Until an explicit capability is added, the UI must
handle the server conflict clearly rather than guessing that deletion is safe.

Clicking the non-interactive part of a row or card opens Property Details.
Checkboxes, menu controls, and links do not trigger the row navigation.

## Pagination

- Default page size: 20.
- Supported page-size choices: 20, 50, and 100.
- Show Previous and Next controls.
- Show nearby page numbers.
- When page counts are large, use ellipses such as `1 2 3 ... 12` rather than
  rendering every page.
- Disable unavailable navigation controls.
- Keep search, filters, sorting, and page size when navigating pages.
- Reset to page 1 when search, filters, sorting, or page size changes.

The real integration pass stores the shareable collection state in validated
TanStack Router search parameters. The Table/Grid preference remains local.

## Loading and Update Behavior

### Initial Loading

Render geometry-matching skeleton rows, cards, controls, and pagination. The
selected desktop view determines whether row or grid skeletons appear.

### Background Update

When results already exist, keep them visible while a new request runs. Reduce
their opacity slightly, show a compact progress indicator near the result
summary, and prevent duplicate destructive submissions. Do not replace useful
records with a full-page skeleton.

### Prefetch

During integration, React Query may prefetch an enabled adjacent pagination
destination when the administrator intentionally hovers or focuses it. Do not
prefetch every possible filter combination.

## Empty and Error States

### No Properties Yet

Explain that no internal Property record exists and offer `Create property` as
the primary next action.

### No Filtered Results

State that no Properties match the current search or filters. Preserve the
entered controls and offer `Reset filters`.

### Initial Error

Show a contained error state with `Try again`. Do not discard the current URL
state or expose backend implementation details.

### Background Error

Keep the previous result set and show a compact update-error message with a
retry action. Do not replace existing records with a full error page.

### Missing Image

Use the shared missing-image treatment with a Property-type cue. The failure of
one image must not remove the record or shift its layout.

## Backend Alignment and Integration Gap

The existing administrative Properties API supports creation, collection,
detail, update, archive, bulk archive, restore, and deletion. Its collection
query supports all search, filter, sorting, and pagination behavior documented
above.

The current collection response does not include Property image metadata.
Because the approved Table and Grid views require a thumbnail, the later
integration contract needs one of these explicitly approved solutions:

1. Add a nullable cover-image summary to each administrative Property
   collection item; this is the preferred solution.
2. Keep the missing-image/Property-type fallback for records without a cover.

Do not issue one image request per result item. That would create an N+1 HTTP
pattern. The integrated collection keeps the missing-image fallback until its
backend response receives an approved nullable cover-image summary.

## Bilingual Behavior

- German is the default.
- English remains available through the shared persisted language control.
- Translate labels, descriptions, statuses, filters, sorts, confirmations,
  empty states, and errors.
- Reference numbers, addresses, user-entered contact names, and server data are
  displayed as stored rather than translated.

## Accessibility

- Provide an accessible name for the collection and view selector.
- Associate the select-all checkbox with the current page collection.
- Announce selection-count and result-count changes appropriately.
- Keep row navigation, selection, and the actions menu independently keyboard
  operable.
- Menus and confirmations return focus predictably.
- Status is communicated through text as well as color.
- Touch targets remain comfortable on mobile.
- Loading indicators and transitions respect reduced motion.

## Mock-First Boundary

The first implementation uses deterministic mock Properties and local preview
state. It may demonstrate Table, Grid, mobile cards, selection, dialogs, and
loading, empty, error, and image-failure states.

It does not call the backend, protect the route with a real session, mutate
PostgreSQL, upload images, or own URL state. Those behaviors remain in the
integration stage.

## Create Property

### Route and Purpose

```text
/admin/properties/new
```

Create the complete internal Property record required by the current backend.
Do not collect images, features, Listing content, SEO, price, or publication
data before the Property has an ID.

### Staged Setup Model

Property onboarding is a staged setup journey:

```text
1. Property record  ->  2. Images  ->  3. Features  ->  4. Listing
```

The Property record is one grouped form rather than several artificial form
pages. After successful creation, the backend-generated Property ID and
reference number allow the administrator to continue directly to Property
Image Setup. Images, Features, and Listing creation remain separate pages in
one visible setup journey and are not faked before the Property record exists.

This progress model communicates where the administrator is in the setup
journey. It must not imply that images, features, or a Listing are required to
store the internal Property itself.

### Page Structure

```text
+-----------------------------------------------------------------------+
| Administration / Properties / Create property                         |
+-----------------------------------------------------------------------+
| Create property                                                       |
| Add the internal details first. Images and Listings follow after save.|
|                                                                       |
| 1 Property record  ----  2 Images  ----  3 Features  ----  4 Listing  |
|                                                                       |
| Property source and owner                                             |
| [ Agency-owned ] [ External client ]                                  |
| [ Search owner........................ ] [ Create new contact ]         |
|                                                                       |
| Property type and address                                             |
| [ Apartment / House ]                                                 |
| [ Street ] [ House number ] [ Unit ]                                  |
| [ Postal code ] [ City ]                                              |
|                                                                       |
| Property details                                                      |
| [ Living area ] [ Rooms ] [ Bedrooms ] [ Bathrooms ]                  |
| [ Conditional fields ] [ Year built ] [ Total floors ]                |
|                                                                       |
|                                              [Cancel] [Create property]|
+-----------------------------------------------------------------------+
```

Use a focused content width rather than stretching form fields across the full
admin workspace. Related short fields may share a row on desktop. The mobile
form uses one column and keeps labels visible.

### Form Sections

#### Source and Owner

Property source is required:

- Agency-owned
- External client

Agency-owned hides the owner control and submits no primary Contact. If the
administrator changes from External client after selecting an owner, clear the
unsubmitted Contact selection because agency-owned Properties cannot have a
primary Contact.

External client reveals a required owner field with:

- A searchable selector for an existing Contact.
- A secondary `Create new contact` action.

The existing-Contact search displays enough identifying information to
distinguish people with similar names, such as company and available email or
phone. The real integration uses the existing paginated Contact search rather
than loading every Contact into the browser.

#### Create Contact Dialog

The Dialog contains only the fields supported by the current Contact backend:

- Full name, required
- Company name, optional
- Email, conditionally required
- Phone, conditionally required

At least one of email or phone is required.

On successful Contact creation:

1. Close the Dialog.
2. Add the returned Contact to the available choices.
3. Select that Contact automatically as the Property owner.
4. Preserve every value already entered in the Property form.
5. Provide concise success feedback such as `Contact created and selected`.

Do not force the administrator to search for the Contact they just created.

If Contact creation fails, keep the Dialog open, preserve its values, show the
actionable error, and leave the Property form untouched. Cancelling the Dialog
also preserves the Property form.

#### Property Type and Address

Property type is required:

- Apartment
- House

The complete internal German address contains:

- Street name, required
- House number, required
- Unit number, optional
- Five-digit postal code, required
- City, required

The exact-address public visibility decision belongs to a Listing, not the
internal Property creation form.

#### Property Details

Collect the backend-supported physical details:

- Living area in square metres, required and greater than zero
- Rooms, required and greater than zero; decimal values are allowed
- Bedrooms, optional non-negative integer
- Bathrooms, required positive integer
- Year built, optional four-digit year from 1000 through 9999
- Total floors, optional positive integer

Conditional fields:

- House shows optional Plot area and hides Apartment floor number.
- Apartment shows optional Floor number and hides Plot area.

When Property type changes, clear the now-invalid hidden field so Apartments do
not submit Plot area and Houses do not submit Apartment floor number.

Inputs display units such as `m²` visually while sending numeric values in the
backend contract. Do not put units into the editable numeric value.

### Validation

Use TanStack Form with the approved submit-first behavior:

1. Before the first submit, do not show errors merely because an untouched
   field is empty.
2. On submit, validate the entire form and move focus to the first invalid
   field or its section summary.
3. After a field has failed validation, revalidate it while the administrator
   edits it and remove its error as soon as it becomes valid.
4. Preserve all valid values after client or server errors.

Validation must cover the backend rules, including the required External-client
Contact and the Property type conditional fields. Server validation remains
authoritative during integration and maps useful field errors where possible.

### Actions and Unsaved Changes

The form provides:

- `Cancel`, returning to `/admin/properties`.
- `Create property`, the single primary action.

If the form is dirty, Cancel, browser back, or an in-app navigation attempt asks
for confirmation before discarding changes. Do not show this confirmation for
an untouched form.

Prevent duplicate submission and show a loading indicator in the primary
button while Property creation is pending. Creating a Contact disables only the
Dialog submission that owns that request; it must not erase or submit the
Property form.

There is no autosave or Property Draft status in the current backend contract.

### Success

After successful Property creation:

1. Show concise feedback containing the generated reference number when
   available.
2. Navigate directly to `/admin/properties/:id/images`.
3. Present Image Setup as the current stage, with Features and Listing as later
   stages and a `Finish later` route back to Property Details.

Do not redirect directly to public Property or Listing routes. Internal
Properties are never publicly exposed.

### Create States

- Initial form
- Client validation errors
- Contact-search loading, empty, and error states
- Contact creation pending, validation error, server error, and success
- Property creation pending
- Property creation server error with entered values preserved
- Successful creation and navigation
- Unsaved-changes confirmation

Contact search, Contact creation, Property creation, cache invalidation, and
navigation from the returned Property ID are implemented.

## Property Image Setup

### Route and Setup Position

```text
/admin/properties/:id/images
```

After successful Property creation, navigate directly to this stage and show
concise success feedback containing the generated reference number. Do not
interrupt the journey with a separate full-page success screen.

The setup progress displays:

```text
Property details: complete
Images: current
Features: upcoming
Listing: upcoming
```

Images remain optional for the internal Property record but a cover image is
required before a Listing can be published. The administrator may skip this
stage and return later.

### Upload Surface

Provide one prominent dropzone with:

- Drag and drop.
- A file-picker action.
- Multi-file selection.
- Clear JPEG, PNG, and WebP guidance.
- A 10 MB maximum per file.
- The remaining capacity out of the maximum 30 Property images.

Reject unsupported or oversized files before uploading and explain the reason
beside the affected file. Selecting too many files must not silently discard
the excess.

### Upload Queue

The frontend accepts several files at once while respecting the backend's
one-image-per-request contract. It manages a visible upload queue and limits
concurrent requests to a small number, initially two or three, rather than
starting every request simultaneously.

Each queued image shows its own state:

- Waiting
- Uploading with progress
- Uploaded
- Failed with Retry
- Cancelled before its request begins

Successfully uploaded images remain stored when another file fails. Retrying a
failed file does not repeat successful uploads. Prevent the same queue item from
being submitted twice.

There is no `Save all` button for uploads. Each successful upload is already a
persisted image mutation.

### Image Grid

After or during upload, render a responsive image grid. Each item preserves a
stable aspect ratio and contains:

- Image preview.
- Drag handle.
- Cover badge when applicable.
- Upload or error state when relevant.
- Three-dots actions menu.

The menu exposes only supported image actions:

- Edit alt text
- Make cover
- Delete image
- Retry when the upload item failed before persistence

The first successfully uploaded image becomes Cover automatically. Changing
Cover is explicit and transactional. Only one image displays the Cover badge.

### Reordering

Allow pointer and keyboard-accessible reordering. The visual order is the
public gallery order. Persist the complete ordered set through the backend
reorder operation after a deliberate drop or keyboard move.

While reorder persistence is pending, prevent another conflicting reorder.
If it fails, restore the last confirmed order and explain that the change was
not saved.

### Alt Text

Edit one image's optional alt text in a small Dialog or focused editing
surface. Preserve the image grid and ordering behind it. Empty input saves a
null alt text according to the backend contract.

Do not generate or fabricate alt text automatically in the MVP. The interface
may provide a concise example explaining that useful alt text describes the
property image rather than repeating a filename.

### Deletion

Image deletion requires confirmation because it removes a persisted asset.
When deleting the Cover, the confirmation explains that the first remaining
image will become Cover automatically.

The backend remains authoritative when the last image cannot be deleted because
a published or historical public Listing depends on it. Preserve the image and
show the business explanation if deletion is rejected.

### Navigation

Provide:

- `Finish later`, which opens the internal Property Details workspace.
- `Continue to features`, which advances to the Feature setup stage.

These actions do not cancel uploads already persisted. If uploads are still
active, navigation asks whether to remain until they finish or cancel only the
not-yet-persisted queue items.

### Image States

- Empty image collection
- Drag-active dropzone
- Queue waiting and uploading
- Individual upload success and failure
- Retry
- Full 30-image capacity
- Unsupported, oversized, and excess-file validation
- Cover change pending, success, and error
- Reorder pending and rollback on error
- Alt-text update pending and error
- Delete confirmation, pending, success, and rejected deletion
- Entire image collection loading and error

Cloudinary-backed upload, React Query mutations, cache updates, retry, and
server business errors are implemented. The visible queue progress remains a
coarse waiting/uploading/completed indicator because the current transport does
not expose byte-level progress.

## Property Feature Setup

### Route and Setup Position

```text
/admin/properties/:id/features
```

This is the third guided setup stage after Property details and Images. Features
are optional for the internal Property, and the administrator may finish later
without selecting any.

The setup progress displays:

```text
Property details: complete
Images: complete or skipped
Features: current
Listing: upcoming
```

### Feature Selection

Display the existing Feature catalog as a responsive grid of accessible
checkbox rows. Do not invent categories because the current backend Feature
model contains only ID, generated code, name, and timestamps.

The selection surface includes:

- Search by Feature name or code.
- Selected count.
- Multi-selection.
- Clear selected Features when useful.
- A secondary `Create new feature` action.

Selected items use a restrained navy checkbox and border. Avoid colorful tiles,
large icons, and pill-heavy presentation. Mobile uses one column and comfortable
touch targets.

Search filters the available catalog without clearing hidden selections. A
plain selected-count summary makes that behavior visible. The implementation
uses the existing backend Feature options contract.

### Draft and Save Behavior

Feature checkbox changes remain local draft selection until the administrator
chooses `Save features and continue`. Saving sends the complete unique array of
selected Feature IDs through the backend replace operation.

- An empty array is a valid saved Feature set.
- Prevent duplicate IDs before submission.
- Prevent duplicate save submission while pending.
- On success, use the returned Feature set as the confirmed state and continue
  to the Listing setup choice.
- On failure, preserve the draft selection and show an actionable error.

Leaving with selection changes that differ from the last confirmed set prompts
before discarding them. Merely searching the catalog does not make the form
dirty.

### Create Feature Dialog

The Dialog contains one required field:

- Feature name

The backend generates the stable uppercase Feature code from this name. The UI
may explain this in helper text but does not ask the administrator to enter or
edit the code.

On successful creation:

1. Close the Dialog.
2. Add the returned Feature to the catalog.
3. Select the new Feature automatically.
4. Preserve all existing Feature selections and the Property setup state.
5. Provide concise success feedback.

If creation fails, keep the Dialog open, preserve its name, and show the useful
validation or conflict message. Cancelling returns to the unchanged Feature
selection.

Editing and deleting the global Feature catalog do not belong to this Property
setup screen. A separate catalog-management surface remains deferred until a
real need is approved.

### Navigation

Provide:

- `Finish later`, which opens the internal Property Details workspace without
  silently saving unsaved Feature changes.
- `Save features and continue`, which persists the complete selection and moves
  directly to `/admin/properties/:id/listings/new` with the Property already
  selected.

The next screen may offer Sale Listing, Rental Listing, or Finish for now. A
Listing is optional and is always created as a Draft first.

### Feature States

- Catalog loading
- Catalog error with Retry
- Empty catalog with Create Feature direction
- Search with no matching options
- No Features selected
- Several Features selected
- Save pending, success, and error
- Create Feature validation, pending, success, and conflict error
- Unsaved-change confirmation

Catalog queries, Feature creation, complete replacement mutation, cache
updates, and server validation are implemented.

## Property Details and Edit

### Route and Purpose

```text
/admin/properties/:id
```

This internal workspace is the durable return point for one Property after its
guided setup. It displays the reference, archive status, complete internal
address, physical details, source, primary Contact when applicable, and last
update time. It never becomes a public Property route.

The page links to the Property's Image Setup, Feature Setup, and administrative
Listings workspace. It does not claim that a Listing exists when the Listing
contract has not supplied one.

### Editing

`Edit property` changes the detail surface into one TanStack Form containing
only fields supported by the backend update contract. Apartment and House
conditional fields remain mutually valid, External client requires a primary
Contact, and submit-first validation preserves entered values after errors.

Detail loading, Contact search, PATCH mutation, cache invalidation, server
conflict messages, and authorization-error presentation are implemented.
Better Auth route protection remains separate Stage 7 work.

### Lifecycle Actions

Archive, Restore, and permanent Delete each require a clear confirmation
Dialog. The UI explains the relevant consequence but does not guess business
eligibility. During integration the backend remains authoritative for open
Listing, Inquiry, Viewing, and historical-publication conflicts.

Unknown mock IDs render a contained not-found state with a return action.

## Next Decision

The next administrative implementation slice is the Listings collection,
followed by Create Listing as specified in
[`admin-listings.md`](admin-listings.md).
Details/Edit and publication, followed by the remaining Property Details/Edit,
linked Listings, archive, restore, and deletion decisions.
