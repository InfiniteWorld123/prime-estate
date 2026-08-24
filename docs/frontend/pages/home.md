# Marketing Home Page

## Status

The mock-first frontend implementation is complete. Public listing queries,
working result-page navigation, and authentication remain separate integration
slices.

The current page uses mock data and does not connect to the backend.

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
Prime Estate | Properties | About | Contact | Sign in | Sign up
```

`Properties` owns a menu with:

```text
Browse all
Properties for sale
Properties for rent
```

Mobile content uses a menu sheet rather than a small desktop dropdown.

The static slice reserves the visual placement of `Sign in` and `Sign up` but
does not implement authentication. Unimplemented destinations must not be
presented as working links in a published build. During development they may be
represented as clearly disabled UI until their route slices exist.

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

Future integrated behavior:

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

The static slice builds the visual and form contract only. Backend calls and
working navigation are deliberately excluded until the public properties page
exists.

### Hero Listing

The integrated home page eventually requests the seven newest published
listings. The newest item appears in the hero with the label `Recently added`.

This is not a featured-listing system. Do not add `is_featured`, featured
ordering, or related backend rules in this slice.

The static implementation uses the first item in a deterministic seven-item
mock array.

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

The later backend request uses `sort=newest` and `page_size=7`. The first item
feeds the hero and the next six feed this carousel.

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

Do not show the exact street address unless public address rules later permit
it. Do not show features because the current public listing-card response does
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
- Account
- Legal

Planned legal links include `Imprint` and `Privacy`. Their final content must be
based on real project or agency details and must not be invented as legal
advice.

Do not show a Blog navigation link until the blogging slice exists. Do not ship
broken or unexplained disabled navigation in the portfolio presentation.

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

The static `useHomePage` hook may coordinate:

- Buy or rent selection
- Location input and client validation
- Deterministic mock listing selection
- View model passed to `HomePage`

It must not contain reusable carousel internals or future backend transport.
During API integration it will compose focused hooks such as
`useLatestListings` and `usePropertySearch`.

## Deferred Integration

Not part of the first implementation:

- Backend calls
- React Query listing query
- Public properties results page
- Public listing detail route
- Working account routes
- Working contact route
- Real Cloudinary image data
- Featured-listing backend rules
- Saved properties
- Inquiries and viewing bookings

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
