# About Page

## Status

Completed. The bilingual mock-first UI passes the automated quality gates and
has received visual approval. No backend connection is required for this page.

## Page Job

Present Prime Estate as a real, trustworthy residential real-estate agency and
explain its local focus and working approach without repeating the property
search job of the home page.

## Positioning

- Prime Estate is presented as one real-estate agency, not as a marketplace or
  a generic software platform.
- The agency is based conceptually in Erfurt and focuses on Erfurt and
  Thuringia while remaining able to serve properties elsewhere in Germany.
- The tone is professional but warm, clear, local, and practical.
- Do not invent an agency history, staff profiles, client counts, sales
  figures, awards, ratings, testimonials, or performance claims.

## Route and Metadata Direction

- Route: `/about`
- Initial title direction: `About Prime Estate | Local Real Estate Guidance`
- Initial description direction: explain the agency's residential sale and
  rental focus in Erfurt and Thuringia without unsupported claims.

Metadata copy must support both German and English. Final wording may be
refined during implementation without changing the approved positioning.

## Page Structure

```text
+---------------------------------------------------------------+
| Marketing Header                                              |
+---------------------------------------------------------------+
| ABOUT HERO                                                    |
|                                                               |
|  Wide architectural image from Erfurt                         |
|                                                               |
|  Small location label: Erfurt & Thuringia                     |
|  A clear statement about local real-estate guidance           |
|  Short agency introduction                                    |
+---------------------------------------------------------------+
| OUR APPROACH                                                  |
|  Concise explanation of clear, personal property guidance     |
|                                      Supporting detail/image  |
+---------------------------------------------------------------+
| Clear information | Local perspective | Personal guidance     |
+---------------------------------------------------------------+
| LOCAL EXPERTISE                                               |
|  Erfurt and Thuringia first, with Germany-wide capability     |
+---------------------------------------------------------------+
| FINAL CTA                                                     |
|  Browse properties                  Contact Prime Estate      |
+---------------------------------------------------------------+
| Marketing Footer                                              |
+---------------------------------------------------------------+
```

## Hero Direction

The About hero must not repeat the home-page split hero. It contains no search
form, listing card, price, or property facts.

Use a wide exterior architectural image with a credible Erfurt character as
the page's visual anchor. The image may carry a restrained text treatment or
sit directly above the introductory statement, depending on final responsive
composition. Architectural survey lines from the design system may appear as a
subtle structural detail.

The image must not imply a specific office, property, or agency ownership
unless that information is real. Its alternative text must describe the image
rather than make a business claim.

## Content Sections

### Our Approach

Explain the agency's approach in a short, readable block:

- Make residential property information easier to understand.
- Help buyers and renters move from discovery to direct contact.
- Provide personal guidance without overstating expertise or results.

This is an agency introduction, not a detailed process duplicated from the
home page.

### Trust Principles

Use three concise items:

- Clear property information
- Local market perspective
- Personal guidance

These are service principles, not measurable claims. Do not add counters,
stars, logos, quotes, or invented proof.

### Local Expertise

State clearly that Prime Estate's primary focus is Erfurt and Thuringia while
the platform can present properties elsewhere in Germany. The section may use
location-aware supporting copy, but it must not imply offices or coverage that
have not been established.

### Final Actions

Provide two clear paths:

- Primary: browse available properties
- Secondary: contact Prime Estate

## Responsive Behavior

- The architectural hero remains visually dominant without forcing important
  copy below the initial mobile viewport.
- Content stacks into one column on mobile.
- The three trust principles become a calm vertical list on narrow screens.
- Do not use an automatically moving carousel or decorative scroll animation.
- Respect reduced-motion preferences for any small reveal or hover transition.

## Page States and Accessibility

The page is static in the mock-first and integrated MVP, so it does not need
artificial loading or empty states.

- A failed hero image uses a stable architectural-image fallback without
  hiding the page copy.
- Header, footer, language, theme, focus, and navigation behavior reuse the
  established marketing components.
- Heading hierarchy contains one page-level heading.
- German and English interface copy must be complete from the first
  implementation.

## Component Direction

The route file remains thin and renders an `AboutPage` composition. Page-only
sections stay under the marketing About page folder. Existing marketing
header, footer, container, button, image fallback, theme, and language
components should be reused rather than duplicated.

## Excluded from This Slice

- Backend calls or React Query
- Team biographies or staff cards
- Agency timeline or fabricated founding story
- Statistics, testimonials, ratings, awards, or partner logos
- Interactive maps
- CMS-managed About content
