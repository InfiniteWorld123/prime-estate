# Public Property Search

## Status

In progress. The mock-first UI implementation and its loading, empty, error,
background-error, and missing-image states are complete. Formatting, type
checking, the test command, the production build, and local HTTP rendering have
been verified. The final cross-browser visual sign-off and the separate
integration pass remain.

Backend integration belongs to a later implementation pass. The first pass is
UI-only: deterministic mock data, local interaction state, and no API requests,
React Query hooks, URL-owned filters, or prefetching. Component contracts must
still allow those concerns to replace the mock orchestration without a visual
rewrite.

## Page Job

Help a buyer or renter understand the available homes, narrow the results
without confusion, and continue to a property detail page.

The experience should feel professional, warm, local, and calm. It must avoid
the dense marketplace appearance of a portal serving many competing agencies.

## Route

The public route is `/properties`.

The route owns validated search parameters, route-level pending and error
boundaries, and the `PropertiesPage` component. It does not own page markup.

## Language and Market

- German and English are supported from the first implementation.
- German remains the default language.
- Currency is EUR and area is displayed in square metres.
- Postal codes remain five-character strings.
- Filter choices and accessible names follow the selected language.

## Desktop Layout

```text
+--------------------------------------------------------------+
| Marketing header                                             |
+--------------------------------------------------------------+
| Page introduction and location search                        |
| Active filter summary                                        |
+-------------------+------------------------------------------+
| Filter sidebar    | Result count             Sort control    |
|                   |                                          |
|                   | Property-card grid                        |
|                   |                                          |
|                   | Pagination                               |
+-------------------+------------------------------------------+
| Marketing footer                                             |
+--------------------------------------------------------------+
```

- The filter sidebar is visible on desktop.
- The results area shows three cards per row on wide screens and two on
  medium screens.
- The content uses the same maximum-width container as the home page.
- The sidebar may become sticky when the visual implementation proves that it
  remains comfortable on typical laptop heights.

## Mobile Layout

- One property card per row.
- Search remains visible near the top of the page.
- Filters open in a `Sheet` rather than consuming permanent horizontal space.
- The filter trigger shows the number of active filters.
- Sorting stays directly accessible without opening the filter sheet.
- Applying or clearing filters must return focus to a useful control.
- Filter sections are collapsible and closed by default. A section with applied
  values exposes a short selection summary.

## Search Behavior

The location field accepts a German city or postal code.

- Exactly five digits map to `postal_code`.
- Other non-empty text maps to `city`.
- Empty input removes both location parameters.
- Numeric input that is not exactly five digits shows a friendly validation
  message and does not submit.
- Leading and trailing whitespace is removed.

The page uses `All properties`, `Buy`, and `Rent` tabs. `All properties` is the
default general destination. The integrated version maps Buy and Rent to
`listing_type=SALE` and `listing_type=RENT`, and a visitor coming from the home
search lands on the matching tab.

## Filters

The initial filter set follows the existing public API contract:

- Listing type: sale or rent.
- Property type: apartment or house.
- City or five-digit postal code.
- Minimum and maximum price.
- Minimum and maximum living area.
- Minimum and maximum rooms.
- Minimum bedrooms.
- Property features using the public feature options endpoint.

Multiple selected features use AND semantics: a result must contain every
selected feature.

Desktop filter order:

1. Location.
2. Property type.
3. Price range.
4. Living-area range.
5. Rooms range.
6. Minimum bedrooms.
7. Features.

The desktop sidebar keeps these sections open rather than adding accordion
interaction. Features show the first five options with `Show more` and `Show
less`. Mobile presents the same sections as collapsible groups inside the
filter Sheet.

Location, property type, price, area, rooms, and bedrooms use precise fields or
choices rather than sliders. The price label follows the selected tab:
purchase price for Buy, monthly rent for Rent, and price for All properties.

Filter edits remain draft values until the visitor presses `Show results`.
Applied values produce removable chips above the results. Removing one chip or
choosing `Clear all` applies immediately. Tabs and sorting also apply
immediately.

Avoid adding bedrooms maximum, bathrooms, year built, radius search, map
search, or other unsupported filters in this slice.

## URL State

URL ownership is deliberately deferred during the mock-only UI pass. Local
state demonstrates the same draft-versus-applied behavior. The integration
pass moves applied criteria into TanStack Router search parameters.

Search, filters, sort, and page describe a shareable public view and therefore
belong in TanStack Router search parameters.

Supported parameter names mirror the backend:

```text
listing_type
property_type
city
postal_code
min_price
max_price
min_living_area
max_living_area
min_rooms
max_rooms
min_bedrooms
feature_ids
sort
page
```

- `feature_ids` is represented as comma-separated unique UUIDs when integrated.
- Changing any search or filter value resets `page` to `1`.
- Changing sort resets `page` to `1`.
- Default values should be omitted from a clean URL when possible.
- Invalid URL values fall back safely or display focused validation feedback;
  they must not crash the page.

## Sorting

Available choices:

- Newest first.
- Price: low to high.
- Price: high to low.
- Living area: low to high.
- Living area: high to low.

`newest` is the default.

## Results and Cards

Reuse the shared `PropertyCard` established by the home page. The search page
may add result-specific surrounding layout but must not fork the card into a
second visual implementation.

The results header contains:

- A truthful result count.
- The current high-level context when useful, such as homes for rent in Erfurt.
- The sort control.

The heading is dynamic but intentionally concise. Examples include `Properties
in Erfurt`, `Homes for sale in Erfurt`, and `Apartments for rent in Leipzig`.
When no location is selected, it defaults to Erfurt and Thuringia to reflect
the agency's local focus while still allowing searches across Germany.

The grid is the only result view in this stage: three columns on wide screens,
two on medium screens, and one on mobile. Do not add a list/table toggle, map
view, infinite scroll, or favourites.

The entire property card becomes a keyboard-accessible link when the detail
route exists. Detail-page prefetching is deferred to integration.

Do not fabricate urgency, view counts, popularity, or availability badges.

## Pagination

- Use numbered pagination with previous and next controls.
- The current page is clearly indicated and announced accessibly.
- Unavailable previous or next actions are disabled.
- Keep the current search, filters, and sort while changing pages.
- Move focus to the results heading after navigation when appropriate.
- Use 12 results per page without a visitor-facing page-size selector.
- Long page ranges use a non-interactive ellipsis around the current range.
- Mobile may use the compact form `Previous - Page 3 of 10 - Next`.
- Pagination prefetch on pointer hover or keyboard focus is deferred to the
  React Query integration pass.

## Page States

### Loading

- Initial loading preserves the result layout with 12 property-card skeletons.
- Avoid replacing the whole application shell.
- When existing results are refreshed, keep them visible with slightly reduced
  opacity and show a small progress indicator near the result count.
- Disable repeated `Show results` submission while a refresh is pending.
- Do not replace existing results with skeletons during a background refresh.

### Empty

- Explain that no properties match the current search.
- Offer a clear action to reset all filters.
- Do not imply that the agency has no listings globally when filters are active.
- Use a restrained icon or small illustration rather than a large decorative
  image.

### Error

- Show a concise bilingual message.
- Provide a retry action.
- Preserve the visitor's URL-owned criteria.
- Never expose raw database, stack, or infrastructure details. A backend message
  may be shown only when it is explicitly safe and written for visitors.

### Background Error

- Keep the last successful results visible.
- Show a compact update-failed message and retry action.
- Do not replace useful existing content with the full error state.

### Missing Image

- Use the established property-image fallback with the same card geometry.

### Invalid Criteria

- Invalid criteria never crash the page or trigger a knowingly invalid request.
- Numeric postal-code input that is not five digits receives focused feedback.
- Unknown integrated sort values fall back safely to `newest`.

## Component and Folder Direction

```text
src/frontend/
|-- features/listings/components/
|   |-- PropertyCard.tsx
|   |-- PropertyCardSkeleton.tsx
|   `-- PropertyFilters.tsx
|-- hooks/pages/usePropertiesPage.ts
|-- pages/marketing/properties/
|   |-- PropertiesPage.tsx
|   |-- properties.mock.ts
|   `-- sections/
|       |-- PropertiesSearchSection.tsx
|       `-- PropertiesResultsSection.tsx
`-- routes/_marketing/properties.tsx
```

The exact set of small supporting files may evolve during implementation. Keep
route files thin, reusable listing concepts under `features/listings`, and
page-only composition under the properties page.

## Mock-First Boundary

The first implementation uses deterministic mock listings and mock feature
options. It demonstrates local filtering, sorting, pagination, responsive
layout, and all page states without making backend requests. The route exists
only to render the page; it does not yet validate or persist filter search
parameters.

The integration step then adds:

```text
public-listing.api.ts
usePublicListings.ts
usePublicFeatures.ts
```

React Query owns remote results and feature options. TanStack Router continues
to own the public criteria. The page hook composes them into a small view model,
and visual components do not call the API directly.

## Mock UI Implementation Sequence

1. **Foundation:** add only the required UI primitives, define page-specific
   types, expand deterministic mock listings and feature options, and create the
   thin `/properties` route plus empty page composition.
2. **Local page model:** implement `usePropertiesPage` with separate draft and
   applied filters, local filtering, sorting, 12-item pagination, reset actions,
   dynamic headings, and development state selection.
3. **Filters:** build the All/Buy/Rent tabs, desktop sidebar, mobile filter
   Sheet, feature expansion, validation, Show results, Clear all, and applied
   filter chips.
4. **Results:** build the result toolbar, responsive shared-card grid, sorting,
   numbered and compact pagination, and local card navigation boundary.
5. **States and language:** add skeletons, initial loading, background refresh,
   empty, full error, background error, missing-image fallback, and complete
   German and English copy.
6. **Page wiring and verification:** connect the sections to `PropertiesPage`,
   activate relevant marketing navigation, then run formatting, type checking,
   build, and responsive/light/dark/bilingual review.

Each group is implemented and verified before the next group starts.

## Accessibility and Interaction

- Every input has a visible label or an equivalent accessible name.
- Keyboard users can reach search, filters, sorting, cards, and pagination in
  logical order.
- Focus indicators use the design-system ring.
- Color is not the only way active filters or errors are communicated.
- Motion respects reduced-motion preference.
- Mobile Sheet controls have meaningful close and apply behavior.

## Completion Criteria

### UI Pass

The mock-first UI pass is complete when:

- `/properties` renders through a thin route and composed page.
- German and English copy is complete.
- Search interpretation and validation match the documented behavior.
- Draft and applied filters, tabs, sorting, pagination, chips, and reset behavior
  work locally against deterministic mock data.
- Desktop, tablet, and mobile layouts are verified.
- Light and dark themes are verified.
- Loading, empty, error, and missing-image states are implemented.
- Shared cards are reused and skeleton geometry matches them.
- Formatting, type checking, and build pass.

### Integration Pass

The complete Public Property Search stage is complete when:

- Filters, sorting, pagination, and reset behavior are URL-driven.
- Public listings and feature options are connected through plain API modules
  and focused React Query hooks.
- Hero search and header property navigation reach the correct results URL.
- Relevant card and pagination destinations are prefetched without speculative
  filter-hover requests.
- Tests and browser-level behavior pass with the real backend contract.
