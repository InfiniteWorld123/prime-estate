# Frontend Architecture

## Goal

Build the Prime Estate frontend as small, understandable vertical slices while
keeping route files thin, page composition explicit, and server interaction
separate from visual components.

Frontend work is delivered in mock-first and integration passes when useful.
The administrative Property, Listing, Inquiry, Overview, and Admin
Authentication slices and the public Listing and Inquiry experiences are
server-connected. Current release-verification status lives in
[`roadmap.md`](roadmap.md).

## Core Principles

- Route files configure routing and render a page component.
- Page components compose meaningful sections instead of containing the whole
  page as one large JSX tree.
- Page hooks coordinate page behavior but do not become "god hooks."
- Domain hooks own focused behavior that may be reused by more than one page.
- API modules perform transport only and do not import React.
- React Query owns server state, not every kind of application state.
- TanStack Form owns non-trivial form state and validation.
- Search, filters, sorting, and pagination belong in the URL when they describe
  a shareable public view.
- Local visual state stays close to the component that owns it.
- A global client store is added only when a real cross-page requirement
  appears.
- Components never call the backend client directly.
- Accessibility, responsive behavior, loading, empty, and error states are part
  of the component contract rather than later polish.

## Layer Responsibilities

### Routes

Routes define URL behavior and route-level boundaries:

- Route path and layout relationship.
- Page component.
- Route loaders or query preloading when later required.
- Pending, error, and not-found components when the route owns them.
- Search parameter validation.
- Redirects and access checks.

Routes do not contain page sections or domain UI.

### Pages

Pages compose the screen:

- Call one page-level orchestration hook when behavior requires it.
- Arrange page sections in reading order.
- Pass view data and actions down through props.
- Avoid direct API calls and low-level transport error handling.

### Sections

Sections are meaningful page regions such as `HeroSection` or
`LatestPropertiesSection`. A section may compose shared and domain components,
but it should remain understandable without opening many tiny wrapper files.

Create a section component when it has a clear semantic purpose, layout,
behavior, or responsive contract. Do not extract one-off markup solely to make
files smaller.

### Features

Features contain reusable domain concepts such as authentication, properties,
and listings. Examples include:

- `PropertyCard`
- `PropertySearchForm`
- `ListingStatusBadge`
- `useLatestListings`
- `usePropertySearch`

A feature may be used by marketing, public application, and admin pages without
being owned by any one of those pages.

### UI Components

`components/ui` contains owned primitives, primarily installed from
`shadcn/ui` and then adapted to the Prime Estate design system. Examples:

- Button
- Input
- Tabs
- Carousel
- Dialog
- Dropdown menu
- Skeleton

Use these primitives selectively. Brand and domain components remain custom.

### Layout and Shared Components

- `components/layout` contains application shells, headers, footers, and
  navigation.
- `components/shared` contains reusable application-level feedback and utility
  components that are not domain-specific.

## State Ownership

| State kind | Owner | Examples |
| --- | --- | --- |
| Server state | React Query hooks | Listings, session, mutations |
| Form state | TanStack Form or a focused form hook | Admin sign in, property search |
| URL state | TanStack Router search params | Filters, sort, page, search |
| Local UI state | Nearest owning component | Mobile menu, disclosure |
| Theme preference | Theme provider and persisted preference | Light, dark, system |
| Language preference | Language provider and persisted preference | German, English |
| Cross-page client state | Add only when required | No global store currently |

## API and Hook Data Flow

The server-connected flow is:

```text
Backend API
    -> api/*.api.ts
    -> focused React Query hook
    -> page orchestration hook
    -> page component
    -> section and domain components
```

Example names:

```text
api/inquiries.api.ts
features/inquiries/hooks/useAdminInquiriesQuery.ts
hooks/pages/useAdminInquiriesPage.ts
pages/admin/inquiries/AdminInquiriesPage.tsx
```

The API function is plain asynchronous TypeScript. The focused hook adds React
Query behavior. The page hook coordinates the form, mutation, navigation, and
page-specific presentation state.

Administrative transport uses a same-origin Eden client from
`api/client.ts`. Browser modules never import `shared/env.ts` or server secrets.
The `/api/$` route owns only request forwarding to the backend application.
This boundary prevents values such as `BETTER_AUTH_SECRET` and `DATABASE_URL`
from entering the client bundle.

## Hook Rules

- Every React hook name starts with `use`.
- Page hooks use the page name: `useHomePage`, `usePropertiesPage`,
  `useAdminInquiriesPage`.
- A page hook composes focused hooks instead of reimplementing all behavior.
- Reusable domain behavior uses domain names such as `useLatestListings` and
  `useAdminInquiriesQuery`.
- Hooks return a small view model with explicit values and actions.
- Components destructure that view model and remain focused on rendering.
- React Query hooks do not live in `api/`; API modules remain React-free.

Authentication follows the same boundary: `api/auth.api.ts` owns Better Auth
transport, focused hooks under `features/auth/hooks/` own React Query, and page
hooks coordinate TanStack Form and navigation. Route access checks use a
server function so server rendering receives the incoming session cookie;
backend guards remain authoritative for private data.

## Directory Structure

```text
src/frontend/
|-- api/
|   |-- client.ts                       # same-origin typed Eden client
|   |-- contacts.api.ts
|   |-- features.api.ts
|   |-- listings.api.ts
|   |-- properties.api.ts
|   |-- property-images.api.ts
|   |-- auth.api.ts                     # Better Auth browser transport
|   |-- public-listings.api.ts
|   `-- inquiries.api.ts
|-- components/
|   |-- layout/
|   |   |-- MarketingHeader.tsx
|   |   `-- MarketingFooter.tsx
|   |-- shared/
|   `-- ui/
|       |-- button.tsx
|       |-- carousel.tsx
|       `-- ...
|-- features/
|   |-- auth/
|   |   |-- hooks/                      # session and auth mutations
|   |   `-- server/                     # route-session server function
|   |-- contacts/
|   |-- inquiries/
|   |-- properties/
|   `-- listings/
|       |-- components/
|       |   |-- PropertyCard.tsx
|       |   `-- PropertyCardSkeleton.tsx
|       `-- hooks/
|-- hooks/
|   `-- pages/
|       |-- useHomePage.ts
|       |-- usePropertiesPage.ts
|       `-- usePropertyDetailsPage.ts       # planned
|-- pages/
|   |-- auth/
|   |   |-- sign-in/
|   |   |-- forgot-password/
|   |   `-- reset-password/
|   `-- marketing/
|       |-- about/
|       |-- contact/
|       |-- home/
|       |-- legal/
|       |-- properties/
|       `-- property-details/
`-- routes/
    |-- __root.tsx
    `-- _marketing/
        |-- index.tsx
        |-- properties.tsx
        `-- properties_.$slug.tsx           # non-nested detail route
```

Admin domain pages are siblings under one shared `/admin` layout rather than
children of an additional dashboard page:

```text
pages/admin/properties/
pages/admin/listings/
pages/admin/inquiries/
pages/admin/overview/
```

The shell direction and route model are defined in
[`admin-shell.md`](admin-shell.md). `/admin` renders the small operational
Overview; there is no redundant `/admin/dashboard` URL.

## Naming Conventions

- React components: `PascalCase.tsx`
- Hooks: `useName.ts`
- API transport modules: `domain.api.ts`
- Mock data: `page.mock.ts` or `domain.mock.ts`
- Generated files retain the generator's naming.
- One component or primary hook per file unless small types/helpers are tightly
  coupled to it.
- Use `Page` suffix for page components and `Section` suffix for page sections.

## Mock-First Workflow

For a mock-first public slice:

1. Install and configure the design-system foundation.
2. Add required `shadcn/ui` primitives.
3. Build the page with deterministic mock data matching the visual subset of
   the eventual API contract.
4. Verify responsive behavior and UI states.
5. Keep search and unavailable navigation explicitly non-production until their
   destination slices exist.
6. Add the plain API module and focused React Query hooks in the documented
   integration pass.
7. Replace mock orchestration without changing the visual component contract.

## Authentication Boundary

The connected Authentication slice includes Admin sign-in, Admin password
recovery, sign-out, Admin session presentation, and administrative access
protection. Public registration and customer-account presentation are disabled.

The backend validates every administrative request independently. Router
protection improves navigation and prevents unusable screens from rendering;
it is not treated as the security boundary. The marketing header may show the
authenticated Admin identity and sign-out action, but it exposes no public
sign-in or registration call to action.

## Quality Gate Per Slice

- Formatting and linting pass.
- Type checking passes.
- Focused tests pass.
- Production build passes.
- Mobile, tablet, and desktop layouts are inspected.
- Keyboard navigation and focus visibility are inspected.
- Light and dark themes are inspected.
- Loading, empty, error, and reduced-motion behavior are verified where the
  slice owns those states.
