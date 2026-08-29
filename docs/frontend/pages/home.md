# Marketing Home Page

## Status

Completed and integrated. The page loads the latest seven Public Listings from
the real API, uses the first result in the Hero, shows the remaining results in
the carousel, and sends searches to the URL-driven Property results page.

## Page Job

Help a visitor begin finding a residential property to buy or rent, then build
enough trust in Prime Estate to continue browsing or contact the agency.

## Audience and Positioning

Primary visitors:

- Residential buyers
- Residential renters

Secondary visitors:

- Property owners considering selling or renting through the agency

Prime Estate is presented as based in Erfurt, focused on Erfurt and Thuringia,
and capable of serving properties across Germany.

## Language and Market

- Interface languages: German and English
- Default language: German
- Language selection persists in the browser
- Market: Germany
- Currency: EUR
- Area: square metres
- Postal codes: German five-digit format
- Tone: professional but warm

## Route

The route is `/`, implemented by the `_marketing` route group. The route file
renders `HomePage` and does not contain the page markup.

## Metadata

Initial metadata direction:

- Title: `Prime Estate | Homes for Sale and Rent in Thuringia`
- Description: `Explore homes for sale and rent across Erfurt, Thuringia, and Germany with clear property information and personal local guidance.`

Do not add fake review schema, sales counts, office history, or other claims.

## Page Order

1. Marketing header
2. Hero with property search
3. Latest properties carousel
4. Why Prime Estate
5. How it works
6. Local expertise
7. Final contact call to action
8. Marketing footer

## Header

Desktop content:

```text
Prime Estate | Properties | About | Contact
```

`Properties` owns a menu with:

```text
Browse all
Properties for sale
Properties for rent
```

Mobile content uses a menu sheet rather than a small desktop dropdown.

The public header has no customer sign-in or registration action. Admin access
uses the dedicated `/admin/login` route and is not promoted as a visitor call
to action.

The header also contains a theme control that supports light, dark, and system
preference.

The header contains a German/English language control. All visible home-page
copy, property mock content, accessible names, metadata, and formatted prices
follow the selected language.

## Hero

### Layout

Desktop:

```text
+-------------------------------+-------------------------------+
| Location eyebrow             | Recently added listing image  |
| Main heading                 |                               |
| Supporting copy              | City, price, rooms, area      |
| Buy/Rent choice              |                               |
| Location field + Search      |                               |
+-------------------------------+-------------------------------+
```

Mobile order:

```text
Eyebrow
Heading
Supporting copy
Search controls
Listing image
Listing summary
```

### Copy Direction

- Eyebrow: `Erfurt & Thuringia`
- Heading: `Find a home that fits your next move.`
- Supporting copy: `Explore homes for sale and rent across Erfurt, Thuringia, and beyond.`

The copy may be refined during visual implementation, but it must remain
specific and avoid unsupported claims.

### Search Controls

The simple hero search contains:

```text
Buy | Rent
City or postal code
Search properties
```

Integrated behavior:

- `Buy` maps to `listing_type=SALE`.
- `Rent` maps to `listing_type=RENT`.
- An empty location sends neither `city` nor `postal_code`.
- Exactly five digits map to `postal_code` and remain a string.
- Other non-empty text maps to `city`.
- Numeric input that is not five digits receives a friendly validation error.

Examples:

```text
Buy + 99084 -> listing_type=SALE&postal_code=99084
Rent + Erfurt -> listing_type=RENT&city=Erfurt
Rent + empty -> listing_type=RENT
```

The form navigates to the public Properties route with the documented URL
criteria.

### Hero Listing

The integrated home page requests the seven newest published Listings. The
newest item appears in the Hero with the label `Recently added`.

This is not a featured-listing system. Do not add `is_featured`, featured
ordering, or related backend rules in this slice.

Development preview states may still use deterministic fixtures without
presenting them as real agency inventory.

## Latest Properties

Heading:

```text
Latest properties
```

Supporting action:

```text
Browse all properties
```

The section renders mock items two through seven in a `shadcn/ui` carousel
backed by Embla.

Carousel rules:

- Six cards total.
- One visible card on mobile.
- Two visible cards on tablet.
- Three visible cards on desktop.
- Swipe and pointer drag enabled.
- Keyboard navigation supported.
- Previous and next controls visible when useful.
- No autoplay.
- No infinite loop.
- Preserve reduced-motion preference.

The backend request uses `sort=newest` and `page_size=7`. The first item feeds
the Hero and the next six feed this carousel.

## Property Card

### Data

Each card shows only lightweight public information:

- Cover image
- Sale or rent label
- City and postal code
- Title, limited to two lines
- Formatted price
- Rooms
- Living area in square metres
- Property type

Do not show the exact street address unless the current public address contract
permits it. Do not show Features because the public Listing-card response does
not include them.

Sale price example:

```text
EUR 420,000
```

Rent price example:

```text
EUR 1,250 / month
```

### Visual Contract

- Image ratio: `4:3`
- Precise, restrained radius from the design system
- Light border as the primary separator
- Restrained hover elevation
- Entire card becomes a link when the detail route exists
- Clear keyboard focus
- No save button in the first slice
- No fake status or feature badges

### States

- Default
- Hover
- Focus visible
- Loading skeleton with identical geometry
- Missing-image fallback
- Empty collection state at the section level
- Error state with a later retry action

## Why Prime Estate

Purpose: explain the agency's value without invented numbers, testimonials, or
history.

Initial themes:

- `Clear property information`
- `Local market perspective`
- `Personal guidance`

Use three concise items. Avoid generic metrics, rating stars, and fake customer
quotes.

## How It Works

This section is a real sequence and may use numbered steps:

1. Search
2. Explore details
3. Contact the agency
4. Arrange a viewing

The wording is from the visitor's perspective and uses direct verbs.

## Local Expertise

Present Prime Estate as focused on Erfurt and Thuringia while available for
properties elsewhere in Germany. Use honest regional language without claiming
years of experience, market share, or results that do not exist.

The pale-yellow accent and restrained architectural-line motif may be most
visible in this section.

## Contact Call to Action

Initial direction:

- Heading: `Planning your next move?`
- Copy: `Tell us what you are looking for and let Prime Estate help you take the next step.`
- Action: `Contact Prime Estate`

The static slice may show this action as development-only disabled UI until the
contact destination exists.

## Footer

Planned groups:

- Properties
- Agency
- Legal

Planned legal links include `Imprint` and `Privacy`. Their final content must be
based on real project or agency details and must not be invented as legal
advice.

Do not show a Blog navigation link. Blogging is outside the Prime Estate
project, and the released portfolio must not contain broken or unexplained
disabled navigation.

## Mock Data Contract

The static home page uses seven deterministic mock listings. The mock shape
should match the visual subset of the eventual public API response so that
integration does not require redesigning components.

Required mock fields:

```text
slug
title
listing_type
price_amount
currency_code
property.reference_number
property.property_type
property.address.postal_code
property.address.city
property.living_area_m2
property.rooms
cover_image.url
cover_image.alt_text
```

Mock content should concentrate on Erfurt and Thuringia and include both sale
and rent, apartment and house examples. It must not be presented as real agency
inventory.

## Static Component Plan

```text
HomePage
|-- MarketingHeader
|-- HeroSection
|   `-- PropertySearchForm
|-- LatestPropertiesSection
|   |-- Carousel
|   `-- PropertyCard x 6
|-- WhyPrimeEstateSection
|-- HowItWorksSection
|-- LocalExpertiseSection
|-- ContactCtaSection
`-- MarketingFooter
```

`PropertyCard` belongs to the listings feature because the public properties
page will reuse it. Marketing sections remain local to the home page.

## Page Hook Contract

The integrated `useHomePage` hook coordinates:

- Buy or rent selection
- Location input and client validation
- The latest Public Listings query
- Search navigation to `/properties`
- View model passed to `HomePage`

It does not contain reusable carousel internals or plain backend transport. The
focused React Query hook and public API module own server interaction.

## Current Integration

- Public Listing queries, result navigation, detail routes, Admin
  authentication routes, Contact navigation, and Inquiry persistence are
  implemented.
- `is_featured`, saved properties, and Blogging are not part of the project.
- Final browser/runtime verification is tracked in
  [`../roadmap.md`](../roadmap.md).

## Acceptance Criteria for the Static Slice

- The route file remains thin.
- The page uses the documented component structure.
- The latest carousel shows six mock property cards.
- The hero uses the first mock listing.
- Responsive behavior matches one, two, and three visible cards.
- Light and dark themes render correctly.
- Header and mobile navigation are keyboard usable.
- Carousel is keyboard usable and does not autoplay.
- Search controls validate the documented local input contract without calling
  the backend.
- Property cards have visible hover and focus states.
- Skeleton, empty, and error presentation components exist for later data use.
- No `is_featured` backend or frontend concept is introduced.
- No application component calls the backend directly.
- Formatting, type checking, tests, and production build pass.
