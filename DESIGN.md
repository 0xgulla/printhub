# Design Brief

## Direction

PrintHub — a cloud print service that turns "I need this printed" into a four-step, no-PC-required flow: upload, choose a nearby printer, set options, track to completion.

## Tone

Refined utilitarian — a crisp, trustworthy utility surface that stays out of the way, borrowing the calm of Linear and the clarity of Stripe rather than the noise of a consumer marketplace.

## Differentiation

A "paper & highlighter" system: cool blue-white paper surfaces carry dense, precise mono-set job data, while a single amber highlighter accent is reserved exclusively for AI document analysis (blank-page detection, paper-saving suggestions) — making the intelligence layer instantly legible and unmistakably PrintHub.

## Color Palette

| Token      | OKLCH          | Role                                                       |
| ---------- | -------------- | ---------------------------------------------------------- |
| background | 0.985 0.007 250 | Cool paper canvas (very light blue-white)                  |
| foreground | 0.22 0.035 262  | Near-black ink with a blue undertone                       |
| card       | 1.0 0.002 250   | Elevated white surfaces for cards, modals, sidebar         |
| primary    | 0.55 0.215 262  | PrintHub blue (#2563EB) — CTAs, active steps, links        |
| accent     | 0.78 0.155 78   | Highlighter amber — AI analysis, blank-page marks only     |
| muted      | 0.96 0.014 250  | Section alternation, disabled fills, skeleton base         |
| success    | 0.63 0.17 148   | Online printers, completed steps, print-success states     |
| destructive| 0.58 0.215 27   | Offline printers, upload failures, validation errors       |

## Typography

- Display: Space Grotesk — hero headline, section headings, stat values; tight tracking, bold weights
- Body: DM Sans — paragraphs, nav, labels, form controls, body copy
- Mono: JetBrains Mono — Job IDs, page counters, file sizes, price amounts (tabular, technical precision)
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Three-tier surface hierarchy: paper canvas → white card with `shadow-card` → hover/active card with `shadow-card-hover`; shadows are always blue-tinted (never neutral grey) so elevation reads as part of the brand, and modals sit on a `bg-foreground/40` scrim with backdrop blur.

## Structural Zones

| Zone    | Background              | Border                      | Notes                                                              |
| ------- | ----------------------- | --------------------------- | ------------------------------------------------------------------ |
| Header  | `bg-card` + backdrop blur | `border-b border-border`  | Sticky; nav links muted, active link primary; mobile hamburger      |
| Content | `bg-background`         | —                           | Alternate sections with `bg-muted/40`; hero uses `bg-gradient-subtle` |
| Footer  | `bg-muted/40`           | `border-t border-border`    | Brand mark, nav columns, muted small print                          |
| Sidebar | `bg-sidebar`            | `border-r border-border`    | Admin only; active item uses `bg-sidebar-accent` + primary text     |

## Spacing & Rhythm

Sections breathe at `py-16 md:py-24` with `gap-6` card grids; content maxes at `max-w-7xl` with `px-4 sm:px-6 lg:px-8`; micro-spacing is a consistent 4/8/12px ladder inside cards (`p-5 md:p-6`).

## Component Patterns

- Buttons: `rounded-xl`, solid primary for the single dominant action, outlined/ghost for secondary; hover = `bg-primary/90` + `-translate-y-0.5` + `shadow-card-hover`; disabled = `opacity-50 cursor-not-allowed`, no lift
- Cards: `rounded-2xl bg-card border border-border shadow-card`, hover lift `-translate-y-1 shadow-card-hover` only when the card is interactive; printer cards are clickable, stat cards are not
- Badges: `rounded-full` pills — status badges tint at `/10` opacity with solid token text (green Online, red Offline); capability chips are outlined `border-border text-muted-foreground`
- Stepper: numbered circles joined by a 2px connector; completed = filled `bg-success` with check, current = filled `bg-primary` with ring, upcoming = `border-border` with muted text

## Motion

- Entrance: `fade-in` + 8px `slide-up` on section reveal, 300ms ease-out; staggered 60ms per child in card grids
- Hover: 200ms `transition-quick` on color/transform; cards lift 4px, buttons lift 2px; focus rings via `shadow-ring-primary`
- Decorative: `float` (6s) on hero file icons, `pulse-soft` (2s) on live printing status, `draw-check` (500ms) for the completion checkmark, progress bars animate `width` at 400ms ease-out
- Budget: nothing exceeds 500ms; transforms and opacity only (no layout-animating properties) for low-end device smoothness

## Constraints

- Light mode is the primary and only shipped theme; `.dark` tokens exist but must stay tuned, not inverted
- Never use raw hex/rgb or arbitrary Tailwind color values — semantic tokens only (`bg-primary`, `text-muted-foreground`)
- Payment is a UI placeholder: disabled, clearly labelled, no real money and no live payment SDK
- No real map tiles, no printer hardware integration, no email receipts, no wallet/balance — do not design zones for them
- Respect `prefers-reduced-motion`: decorative float/pulse animations must be suppressible

## Signature Detail

The amber highlighter AI banner — a pale amber bar with a marker-stroke left edge that surfaces "2 blank pages detected" and lets users exclude pages inline, turning invisible document analysis into the product's most memorable, money-saving moment.
