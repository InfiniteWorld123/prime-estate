# Admin Shell

## Status

**Completed and integrated.** The responsive shared shell, typed Overview,
Properties, Listings, and Inquiries navigation, persisted desktop collapse
preference, mobile Sheet, language and theme controls, real session identity,
protected access, and sign-out behavior are implemented.

## Purpose

The Admin Shell is the shared workspace for Prime Estate's single-agency
administration area. It provides stable navigation, page context, responsive
behavior, and account controls without owning the business logic of any admin
page.

The shell must be able to accept additional approved modules later without
redesigning its layout. This architectural capacity does not promote deferred
features into the MVP.

## Design Direction

The approved direction is **Architectural Operations Console**, not a fully
floating or glass dashboard and not a generic statistics-first SaaS dashboard.

Prime Estate must remain serious, trustworthy, and appropriate for a real
German property agency. Modernity comes from precise spacing, strong hierarchy,
quiet surfaces, responsive behavior, and restrained details rather than large
rounded containers or decorative effects.

- Keep the existing small base radius of `0.4rem`.
- Use the existing design-system colors and typography.
- Use an integrated, quiet sidebar on desktop. It may use a light neutral
  surface with a precise navy active indicator instead of relying on a familiar
  full-height dark SaaS sidebar.
- Use a slim top bar with the same restrained translucency and backdrop blur as
  the public marketing header.
- Keep forms, tables, summary cards, and content panels opaque.
- Prefer fine borders over shadows for static surfaces.
- Keep the architectural survey-line motif subtle and local to selected page
  headings or empty space.
- Do not use irregular blobs, floating islands, heavy glassmorphism, gradients,
  luxury-gold styling, excessive pills, or decorative animation.

## Desktop Structure

```text
+----------------------+-----------------------------------------------+
| Prime Estate         | Administration / Current page     DE Theme User|
| Erfurt - Thueringen  +-----------------------------------------------+
|                      |                                               |
| Properties           | Page title                   Context action   |
| Listings             | Short functional description                  |
|                      |                                               |
|                      | Main page workspace                           |
|                      |                                               |
|                      | Tables, forms, cards, or page states          |
|                      | remain owned by the current admin page        |
|                      |                                               |
| Collapse             |                                               |
| Account / Sign out   |                                               |
+----------------------+-----------------------------------------------+
```

The sidebar is visually distinct but belongs to the page frame; it does not
float above the canvas. The top bar may remain sticky. The main workspace owns
its scrolling behavior without duplicating global navigation.

## Mobile Structure

```text
+------------------------------------------------+
| Menu  Prime Estate / Page title       DE  User |
+------------------------------------------------+
| Page title                                     |
| Short functional description                  |
| Context action                                 |
|                                                |
| Responsive page workspace                     |
+------------------------------------------------+
```

- Replace the desktop sidebar with an accessible Sheet or Drawer opened by the
  menu button.
- Keep the mobile header compact and sticky.
- Do not add bottom navigation.
- Page actions may move below the page description or become full-width when
  that improves clarity.
- Tables must adapt to the page's content rather than forcing the desktop table
  into a narrow viewport.

## Route Model

The administrative area uses `/admin` as its shared route prefix:

```text
/admin                 -> small operational Overview
/admin/properties      -> Property management
/admin/listings        -> Listing management
/admin/inquiries       -> Inquiry Inbox
```

The Overview and Inquiry Inbox behavior is specified in
[`pages/admin-overview-inquiries.md`](pages/admin-overview-inquiries.md).

There is no separate `/admin/dashboard` route. The Overview composes existing
list endpoints and owns no analytics or event-tracking system.

The Admin layout route owns the shell and access boundary. Child route files
remain thin and render their page components. Backend authorization remains the
authoritative security boundary.

## Navigation

The navigation must be driven by a typed configuration rather than repeated,
hard-coded markup. Each entry may define its label, icon, destination, group,
and active-match behavior. Desktop and mobile navigation render the same
configuration.

Navigation is intentionally small:

- Overview
- Properties
- Listings
- Inquiries

Settings appears only when a real settings surface exists. Excluded modules are
not displayed as disabled or `Coming soon` links merely to make the application
look larger.

The following are excluded from Prime Estate:

- Custom Analytics
- Blogging
- Separate Lead/CRM management
- Appointment Booking
- General user management

The sidebar is expanded by default on desktop and may collapse to an icon rail.
Its preference may be persisted locally. Collapsing navigation is local visual
state and must not require server state.

## Top Bar

The top bar contains only stable global controls:

- Breadcrumb or current admin context
- Persisted language control, with German as the default
- Theme control
- Account menu and sign out

Do not add a global search until a real cross-domain search contract exists.
Do not add a notification bell until the product has a defined notification
model. Inquiries displayed in their own workflow are not automatically a
general notification system.

## Page Header Contract

Each admin page owns a compact header inside the main workspace:

- Page title, such as `Properties` or `Listings`
- One short functional description
- At most one visually primary contextual action when required

Examples of contextual actions are `Create property` on property management or
`Create listing` on listing management. Labels must describe the actual domain
action. Do not use ambiguous global actions such as `New` when the object is not
clear.

The shell does not permanently display `Create property` or `Create listing`;
the active page supplies its own action.

## Collection View Preference

Administrative property and listing collections may offer two representations
of the same result set:

- `Table`, the default operational view for scanning structured records.
- `Grid`, an optional visual view for scanning property imagery.

Use a labelled Toggle Group or equivalent view selector, not semantic Tabs.
Changing the view does not fetch different records, alter filters, or create a
different route. The preference is local visual state and may be persisted on
the device; it does not belong in the URL or backend.

Do not add a third `List` representation. It substantially overlaps with the
table while adding another responsive and accessibility contract.

On mobile, use one mobile-appropriate card collection and hide the desktop view
selector. Do not compress the desktop table into the viewport. The same filters,
sorting, pagination, actions, loading, empty, and error behavior apply to both
desktop representations.

## Account Behavior

The account area displays the signed-in administrator and opens a concise menu.
Only implemented destinations appear. Sign out remains available. Profile,
settings, and other account links must not be invented before their pages and
behavior are approved.

The released shell uses real Admin session data, authorization redirects, and
sign-out behavior.

## Scalability Rules

- Scalability means stable layout and configuration boundaries, not showing
  future functionality early.
- New modules become sibling admin routes under the shared shell.
- Domain pages and their state remain outside the shell.
- The shell must not fetch dashboard metrics or domain records.
- Page-specific search, filtering, tables, empty states, and actions remain
  inside their page slice.
- Desktop and mobile navigation must derive from the same approved entries.

## Accessibility and Responsive Behavior

- Navigation uses semantic landmarks and an accessible current-page state.
- Icon-only controls have accessible names and visible tooltips where needed.
- Keyboard focus remains visible against both the navy sidebar and light
  workspace.
- Collapsing the sidebar does not remove keyboard access to navigation.
- The mobile Sheet traps focus, has a clear accessible title, and returns focus
  to its trigger when closed.
- Translucency must preserve readable contrast in light and dark themes.
- Motion is short, functional, and respects `prefers-reduced-motion`.

## Explicit Non-Goals

The shell itself does not own:

- Overview metrics or Inquiry records
- Property, Listing, or Inquiry workflows
- Global search
- A notification system
- Analytics or blogging functionality
- General user administration
- Charts, event tracking, or analytics

## Remaining Shell Work

No additional Admin destination or product module is planned.
