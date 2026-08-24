# Frontend Design System

## Brand Direction

Prime Estate is a fictional, trustworthy residential real-estate agency based
in Erfurt. Its primary focus is Erfurt and Thuringia, while its service and
property model can extend across Germany.

The interface supports German and English. German is the default for the local
market presentation, while English remains available through the persisted
language control. The market assumptions remain German:

- EUR
- Square metres
- German five-digit postal codes
- Europe/Berlin time
- Apartment and house listings

The brand should feel:

- Trustworthy
- Clear
- Fast
- Local
- Professional but warm

It should not feel luxurious, futuristic, crowded, or decorative for its own
sake.

## Visual Signature

Use subtle architectural and survey-plan lines as the single visual signature.
They may appear in the hero background and selected section dividers. Keep the
rest of the interface quiet so the property imagery, typography, and actions
remain primary.

The pale yellow accent is a warm highlight inspired by survey markers and
annotations. It is not a gold luxury treatment and should be used sparingly.

## Theme Source

The authoritative initial theme is the latest `tweakcn` export supplied on
2026-08-23. Implementation should preserve semantic token names rather than
hard-coding raw values throughout components.

Light mode is the default visual design. The application also supports dark
mode and should initially respect the operating-system preference. A user
selection later overrides and persists that preference.

## Light Theme

| Token | Value |
| --- | --- |
| Background | `#f9fafb` |
| Foreground | `#0f1729` |
| Card | `#ffffff` |
| Card foreground | `#0f1729` |
| Popover | `#ffffff` |
| Popover foreground | `#0f1729` |
| Primary | `#0b2c75` |
| Primary foreground | `#f8fafc` |
| Secondary | `#f1f5f9` |
| Secondary foreground | `#0f172a` |
| Muted | `#f1f5f9` |
| Muted foreground | `#65758b` |
| Accent | `#fffaeb` |
| Accent foreground | `#614a05` |
| Destructive | `#ef4444` |
| Destructive foreground | `#f8fafc` |
| Border | `#e2e8f0` |
| Input | `#e2e8f0` |
| Ring | `#0b2c75` |

### Light Charts

| Token | Value |
| --- | --- |
| Chart 1 | `#0b2c75` |
| Chart 2 | `#52637a` |
| Chart 3 | `#e7b008` |
| Chart 4 | `#b8cce0` |
| Chart 5 | `#1147bb` |

### Light Sidebar

| Token | Value |
| --- | --- |
| Background | `#0f1729` |
| Foreground | `#f8fafc` |
| Primary | `#2463eb` |
| Primary foreground | `#ffffff` |
| Accent | `#141f38` |
| Accent foreground | `#f8fafc` |
| Border | `#1b294b` |
| Ring | `#2463eb` |

## Dark Theme

| Token | Value |
| --- | --- |
| Background | `#05080f` |
| Foreground | `#f8fafc` |
| Card | `#080c16` |
| Card foreground | `#f8fafc` |
| Popover | `#080c16` |
| Popover foreground | `#f8fafc` |
| Primary | `#3b82f6` |
| Primary foreground | `#0f172a` |
| Secondary | `#1e293b` |
| Secondary foreground | `#f8fafc` |
| Muted | `#1e293b` |
| Muted foreground | `#94a3b8` |
| Accent | `#332600` |
| Accent foreground | `#f5c73d` |
| Destructive | `#7f1d1d` |
| Destructive foreground | `#f8fafc` |
| Border | `#1e293b` |
| Input | `#1e293b` |
| Ring | `#1d4ed8` |

### Dark Charts

| Token | Value |
| --- | --- |
| Chart 1 | `#3c83f6` |
| Chart 2 | `#e7b008` |
| Chart 3 | `#52637a` |
| Chart 4 | `#b8cce0` |
| Chart 5 | `#1147bb` |

### Dark Sidebar

| Token | Value |
| --- | --- |
| Background | `#05080f` |
| Foreground | `#f8fafc` |
| Primary | `#3c83f6` |
| Primary foreground | `#05080f` |
| Accent | `#0e1525` |
| Accent foreground | `#f8fafc` |
| Border | `#1e293b` |
| Ring | `#1d4ed8` |

## Typography

| Role | Family | Usage |
| --- | --- | --- |
| Sans | `Inter` | Interface, headings, body, controls |
| Serif | `Georgia` | Rare editorial accent only |
| Mono | `JetBrains Mono` | References and technical identifiers |

Fallback stacks:

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-serif: "Georgia", serif;
--font-mono: "JetBrains Mono", monospace;
```

Declaring a family does not load its font files. The implementation must embed
or self-host required non-system fonts before visual verification.

Global tracking is `-0.015em`. Adjust large display headings locally when
needed instead of changing the global value.

## Shape and Spacing

- Base radius: `0.4rem`
- Base spacing unit: `0.25rem`
- Prefer precise borders and restrained shadows.
- Property images use a `4:3` aspect ratio.
- Property cards use the semantic card, foreground, border, and shadow tokens.
- Avoid excessive pills and fully rounded containers.

Spacing should follow the four-pixel base system:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

## Shadows

### Light

- X: `0px`
- Y: `2px`
- Blur: `8px`
- Spread: `0px`
- Opacity: `0.04`
- Color: `hsl(222 47% 11%)`

### Dark

- X: `0px`
- Y: `4px`
- Blur: `12px`
- Spread: `0px`
- Opacity: `0.25`
- Color: black

Use shadows primarily for popovers, dropdowns, dialogs, and temporary elevated
states. Static cards rely first on border and background separation.

## Responsive Layout

- Mobile-first implementation.
- Use one property card per carousel view on mobile.
- Use two cards per view at the tablet breakpoint.
- Use three cards per view at the desktop breakpoint.
- Marketing sections use a consistent centered container and responsive side
  padding.
- The desktop hero is a two-column layout; mobile stacks search content before
  the property visual.

## Motion

- No automatic carousel movement.
- No infinite carousel loop for the latest-listings section.
- Use short, purposeful transitions for hover, focus, menu, and disclosure
  feedback.
- Respect `prefers-reduced-motion`.
- Avoid scattered scroll animations. If a page-load reveal is later added, it
  must be one coordinated moment.

## Component States

Every interactive or data-driven component defines relevant states:

- Default
- Hover
- Focus visible
- Active
- Disabled
- Loading
- Empty
- Error
- Success

Skeletons must preserve the final component geometry to avoid layout shift.
Error messages state what happened and the next action. Empty states direct the
user to a useful next step.

## Accessibility

- Visible keyboard focus is mandatory.
- Interactive controls use semantic elements and accessible names.
- Color is not the only carrier of status.
- Touch targets remain comfortable on mobile.
- Images use meaningful alternative text or empty alternative text when purely
  decorative.
- Light and dark contrast must be verified during implementation.
- Carousel controls remain user-operated and keyboard accessible.

## Component Library Policy

Use `shadcn/ui` as an owned source of accessible primitives, not as the visual
identity. Install only required components. The initial home page may require:

- Button
- Input
- Tabs or toggle group
- Carousel, backed by Embla
- Dropdown menu
- Sheet for mobile navigation
- Skeleton

Build Prime Estate-specific components by hand, including:

- Property card
- Property search form
- Marketing hero
- Marketing sections
- Marketing header and footer compositions
