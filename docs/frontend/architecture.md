# Frontend Architecture

## Goal

Build the Prime Estate frontend as small, understandable vertical slices while
keeping route files thin, page composition explicit, and server interaction
separate from visual components.

Frontend work is delivered in mock-first and integration passes when useful.
The public marketing and property experiences currently use mock presentation
data. About, Contact, and the authentication UI are completed as a combined
mock-first batch. Public API integration, real
authentication behavior, and administrative screens remain separate roadmap
work. Current status lives in [`roadmap.md`](roadmap.md).

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
| Form state | TanStack Form or a focused form hook | Sign up, property search |
| URL state | TanStack Router search params | Filters, sort, page, search |
| Local UI state | Nearest owning component | Mobile menu, disclosure |
| Theme preference | Theme provider and persisted preference | Light, dark, system |
| Language preference | Language provider and persisted preference | German, English |
| Cross-page client state | Add only when required | No global store currently |

## API and Hook Data Flow

The eventual server-connected flow is:

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
api/auth.api.ts
hooks/auth/useSignUp.ts
hooks/pages/useSignUpPage.ts
pages/auth/sign-up/SignUpPage.tsx
```

The API function is plain asynchronous TypeScript. The focused hook adds React
Query behavior. The page hook coordinates the form, mutation, navigation, and
page-specific presentation state.

## Hook Rules

- Every React hook name starts with `use`.
- Page hooks use the page name: `useHomePage`, `usePropertiesPage`,
  `useBlogPage`.
- A page hook composes focused hooks instead of reimplementing all behavior.
- Reusable domain behavior uses domain names: `useLatestListings`,
  `usePropertySearch`, `useSignUp`.
- Hooks return a small view model with explicit values and actions.
- Components destructure that view model and remain focused on rendering.
- React Query hooks do not live in `api/`; API modules remain React-free.

The existing `src/frontend/api/queries/auth.query.ts` is a temporary starting
point. Its future refactor will separate plain auth requests from hooks such as
`useSignUp` and `useSignIn`. That refactor belongs to the authentication slice,
not the static home-page slice.

## Directory Structure

```text
src/frontend/
|-- api/
|   |-- auth.api.ts                     # later
|   `-- public-listing.api.ts           # later
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
|   `-- listings/
|       |-- components/
|       |   |-- PropertyCard.tsx
|       |   `-- PropertyCardSkeleton.tsx
|       `-- hooks/                      # added during API integration
|-- hooks/
|   `-- pages/
|       |-- useHomePage.ts
|       |-- usePropertiesPage.ts
|       `-- usePropertyDetailsPage.ts       # planned
|-- pages/
|   |-- auth/
|   |   |-- sign-in/
|   |   |-- sign-up/
|   |   |-- verify-email/
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
pages/admin/inquiries/      # after its backend slice
pages/admin/overview/       # deferred until the operational UI is complete
pages/admin/blogging/       # deferred
pages/admin/analytics/      # deferred
pages/admin/users/          # deferred
```

The shell direction and route model are defined in
[`admin-shell.md`](admin-shell.md). Until the final Overview is specified,
`/admin` redirects to `/admin/properties`; there is no redundant
`/admin/dashboard` URL.

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

Authentication will be designed and implemented as its own slice. It will
eventually include:

- Sign up
- Email verification
- Sign in
- Forgot password
- Reset password
- Sign out
- Session-aware navigation
- Administrative access protection
- Future customer account capabilities such as appointments and inquiries

The marketing header reserves visual placement for `Sign in` and `Sign up`, but
the static home-page slice does not implement authentication or create backend
connections.

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
