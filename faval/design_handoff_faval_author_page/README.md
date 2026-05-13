# Handoff: Faval.ai — Author Page

## Overview

Hi-fi design for the Faval.ai **Author detail page** — the per-author view where users see an author's metadata, a multi-trait rating scorecard, and a list of attributed quotes. Plus a low-fi wireframe of the same page as a structural reference.

The page is intended to render in three data states:
1. **Initial / loading** — trait scorecard and quote list shown as shimmering skeleton placeholders (this is what the prototype currently shows).
2. **Populated** — data arrives from the API, skeletons swap for real trait names + scores and real quote cards.
3. **Empty** — author exists but has no quotes / no ratings yet (not designed yet; flag with the team if needed).

## About the design files

The HTML/JSX files in this bundle are **design references**, not production code. They are React + Babel-in-the-browser prototypes wired up to show the visual treatment, typography, color usage, and skeleton-loading behaviour. They are **not** intended to be dropped into a production codebase as-is.

The handoff task is to **recreate these designs inside the Faval.ai application's existing environment** (React/Vue/Svelte/etc.) using its established component library, design tokens, routing, and data-fetching layer. If no app shell exists yet, the implementer should choose a stack appropriate for the project and rebuild from there.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, borders, shadows, and skeleton behaviour are all specified below. Recreate pixel-close using the codebase's existing components where possible — substitute equivalents (your `<Button>`, your `<Chip>`, etc.) but match the visual specs.

The wireframe (`Wireframes.html` + `wireframes.jsx`) is **low-fidelity** and only included as a structural reference / changelog of the early data-mapping conversation. The hi-fi (`Author Page.html`) supersedes it.

---

## Screens / Views

### 1. Author detail page (`/authors/:slug` — naming TBD)

**Purpose** — Show one author's identity, their multi-trait Faval rating, and a paginated/filtered list of their quotes.

**Layout** — Single-column page with a sticky header at the top. Max content width **1240px**, centered, with **40px** horizontal padding (`.shell`).

Vertical structure, top to bottom:
1. **Sticky header** — 76px tall, semi-transparent paper background with backdrop blur.
2. **Breadcrumb** — small monospace row, 22px top / 18px bottom padding.
3. **Hero** — two-column grid (`1.4fr 1fr`, `64px` gap), bottom-padded `48px`.
4. **Quotes section** — separated from hero by a top hairline border on the section head, bottom-padded `96px`.

#### Components

##### Site header (`<header class="site">`)
- Position: `sticky`, `top: 0`, `z-index: 10`.
- Background: `rgba(246, 242, 233, 0.92)` with `backdrop-filter: saturate(140%) blur(8px)`.
- Bottom border: `1px solid var(--line-soft)` (`#ece7d6`).
- Inner row: 76px tall flex row, `gap: 36px`.
- Contents, left to right:
  - **Brand lockup**: logo SVG (`logo.svg`, 46px tall) + wordmark SVG (`faval-wordmark.svg`, 28px tall), 12px gap.
  - **Primary nav**: 4 links, 28px gap. Font: IBM Plex Sans 14.5px / 500. Items: **Ranking** (active), **Quote Stream**, **Donate & Suggest**, **About**. Active state: 2px bottom border in `var(--green-500)`, color `var(--green-700)`. Hover: color shifts to `var(--green-700)`. 120ms ease.
  - **Actions** (`margin-left: auto`):
    - **Compare** button: pill, `1px solid var(--line)` border, white bg, with compare icon. Inline svg 16×16.
    - **Search** icon button: 40×40 circle, same border + white bg, search icon 18×18. Hover: border shifts to `var(--green-500)`.

##### Breadcrumb (`.breadcrumb`)
- Font: JetBrains Mono 12px, uppercase, letter-spacing `0.04em`, color `var(--ink-3)` (`#5a6e64`).
- Items separated by `/` in muted color.
- Current page is plain text (not a link).
- Example sequence: `Home / Ranking / Author`.

##### Hero (`.hero`)
Grid: `grid-template-columns: 1.4fr 1fr`, `gap: 64px`, `align-items: start`. Collapses to single column under 1000px.

Left column:
- **Eyebrow** (`.eyebrow`): JetBrains Mono 11px / 500, uppercase, letter-spacing `0.14em`, color `var(--green-700)`. Example: `Author · Ranked #—`. Margin-bottom 18px.
- **H1** (author name): Source Serif 4 600, `clamp(48px, 5.4vw, 76px)`, line-height 1.04, letter-spacing `-0.015em`, color `var(--green-900)` (`#04342C`). `text-wrap: balance`. Margin-bottom 18px.
- **Epithet** (`p.epithet`): Source Serif 4 italic, 22px, line-height 1.4, color `var(--ink-2)` (`#2c3e36`). Max-width 580px. Margin-bottom 28px.
- **Meta row** (`.meta`): inline flex, `gap: 8px 22px`, wraps. Font: IBM Plex Sans 13.5px, color `var(--ink-3)`. Items pair `<strong>` label (color `var(--ink)`, weight 500) with a value. Items separated by a 4×4 `var(--green-500)` dot. Current labels: **Born**, **Era**, **Language**, **Quotes**.

Right column (`<TraitScorecard>`):
- Card: white bg, `1px solid var(--line)`, `border-radius: 14px`, shadow `0 1px 0 rgba(15,110,86,0.04), 0 8px 24px -16px rgba(4,52,44,0.18)`.
- Card header: 18/22/14 padding, bottom hairline. Title "Trait scores" in Source Serif 4 600 18px / `var(--green-900)`. Right side: a "Loading" status with an animated `.pulse` dot (7×7, green-500, pulsing box-shadow).
- Rows (`.trait-row`): grid `30px 1fr 38px`, 14px gap, 14/22 padding, bottom hairline (none on last).
  - **Numeric badge**: 28×28 circle, `var(--green-700)` bg, white text, JetBrains Mono 12 / 600. Tiers 1–5 render as filled badges. The "NR" tier uses an outlined variant: transparent bg, `var(--ink-3)` text, `1px solid var(--line)`, font-size 10px.
  - **Trait label**: in the live design this is a **skeleton bar** (see Skeleton spec). When data arrives this becomes a trait name in IBM Plex Sans 14.5px / 500 / `var(--ink)`.
  - **Score**: skeleton in loading state. When populated: Source Serif 4 600, 18px, `var(--green-900)`, `font-variant-numeric: tabular-nums`.

##### Quotes section (`section.quotes`)
- **Section head** (`.section-head`): top hairline `1px solid var(--line)`, padding `24px 0 22px`, flex space-between baseline.
  - **H2**: Source Serif 4 600, 32px, letter-spacing `-0.01em`, color `var(--green-900)`. Text: "Quotes".
  - **Count** (`.count`): JetBrains Mono 12px uppercase, letter-spacing `0.06em`, color `var(--ink-3)`. Currently shows `<pulse> Loading from source`. When populated: e.g. `148 attributed · 5 shown`.
- **Filter strip** (`.filter-strip`): flex row, `gap: 10px`, wraps, `margin-bottom: 28px`.
  - Three **chips** (`.chip`): pill, 7/14 padding, `1px solid var(--line)`, white bg, IBM Plex Sans 13 / `var(--ink-2)`. Each ends with a 4px down-caret in `currentColor` at 0.6 opacity.
  - **Active** state (currently on "Top rated"): `var(--green-900)` bg, white text, matching border.
  - Hover: border + text shift to `var(--green-500/700)`.
  - Current chips, left to right: **Top rated** (active), **By trait**, **Sorted by time**.
- **Quote list** (`.quote-list`): flex column, `gap: 18px`.

##### Quote card (`.quote` / `<QuoteSkeleton>`)
Grid: `grid-template-columns: 56px 1fr 120px`, `gap: 24px`. Background white, `1px solid var(--line)`, `border-radius: 14px`, padding `28px 32px`. Hover: border shifts to `var(--green-300)`, `translateY(-1px)`, 160ms ease.

Collapses to single column under 1000px; vote panel moves below and gets a top hairline instead of left.

Columns:
1. **Rank** (`.rank`): JetBrains Mono 13px, color `var(--ink-3)`, letter-spacing `0.04em`, top-padding 4px. Format `№01`, zero-padded.
2. **Body**:
   - **Quote text** (`blockquote`): Source Serif 4 500, 22px, line-height 1.34, color `var(--ink)`, letter-spacing `-0.005em`, `text-wrap: pretty`. Starts with a large `"` opening quote in `var(--green-300)` at 44px font-size, vertically nudged with `vertical-align: -0.4em`. Margin-bottom 14px.
   - **Source row** (`.source`): flex wrap, `gap: 14px`, font IBM Plex Sans 13px / `var(--ink-3)`.
     - **Work title** (`.work`): italic, color `var(--ink-2)`.
     - **Year tag** (`.year`): JetBrains Mono 12px, letter-spacing `0.04em`, bg `var(--surface-tint)` (`#e8f3ed`), color `var(--green-700)`, padding `2px 8px`, border-radius 4px.
3. **Vote panel** (`.vote`): left border `1px solid var(--line-soft)`, padding-left 24px, flex column.
   - **Score row** (`.vote-row`): flex space-between, 6px vertical padding. Label: JetBrains Mono 10.5px uppercase, letter-spacing `0.06em`, `var(--ink-3)`. Score value: Source Serif 4 600, 18px, `var(--green-900)`, tabular numerals.
   - **Votes row**: same structure, value shrinks to 14px and recolors to `var(--ink-3)`.
   - **Vote actions** (`.vote-actions`): flex row, 6px gap, 8px top margin.
     - Two equal-width buttons (`flex: 1`): "▲ For" and "▼ Against". 6px vertical padding, 6px border-radius, `1px solid var(--line)`, white bg, JetBrains Mono 11px / `var(--ink-2)`.
     - Hover: border `var(--green-500)`, text `var(--green-700)`, bg `var(--green-50)`.
     - In loading state these are `disabled`.

---

## Interactions & behaviour

- **Sticky header**: persists at top of viewport on scroll, blur applied to the paper bg underneath.
- **Nav links**: client-side navigation to the four primary surfaces. Active item gets the green underline.
- **Compare**: opens the compare flow (not designed yet — flag for follow-up).
- **Search**: opens search overlay/modal (not designed yet).
- **Filter chips**: clicking sets the active filter — only one chip can be active at a time (single-select). The "Sorted by time" chip is a sort selector (separate from the filter, both shown inline).
- **Quote card hover**: 1px lift + green border, 160ms ease.
- **For / Against buttons**: per-quote voting. Behavior: optimistic increment of `votes`, recompute `score` server-side; show toast on error. Auth-gated — unauth users see a sign-in prompt instead.
- **Loading transitions**: when data arrives, swap each skeleton for its real value with a 200ms cross-fade (optional but recommended).

### Skeleton specification

A reusable shimmering bar (`.skel`):
- Background: `linear-gradient(90deg, var(--line-soft) 0%, #f3eedb 50%, var(--line-soft) 100%)`, `background-size: 200% 100%`.
- Animation: `shimmer 1.6s ease-in-out infinite` — keyframes shift `background-position` from `200% 0` to `-200% 0`.
- Height 12px / `border-radius: 6px` by default. Width variants `.w-90 / .w-75 / .w-60 / .w-50` correspond to 90/75/60/50% widths.
- Score variant: 28×14px.

In a quote skeleton, the blockquote area shows 2–3 stacked `.skel` lines at 22px height with varying widths; the source row uses 14px-tall skeletons (140×14 for work, 56×14 for year).

### Responsive

- ≥1000px: layout as specced.
- <1000px: hero collapses to single column (`grid-template-columns: 1fr`, `gap: 36px`); quote cards collapse to single column with the vote panel below the body and a top hairline replacing the left hairline.

---

## State management

State variables the implementing component needs:

| State | Type | Purpose |
| --- | --- | --- |
| `author` | `Author \| null` | The authoritative author record (name, era, language, epithet, etc.) |
| `traits` | `TraitScore[] \| null` | Array of trait rows (rank, label, score). `null` ⇒ skeleton state. |
| `quotes` | `Quote[] \| null` | Quote list. `null` ⇒ skeleton state. |
| `quotesStatus` | `'idle' \| 'loading' \| 'error'` | Drives the "Loading from source" indicator and error banner. |
| `activeFilter` | `'top-rated' \| 'by-trait'` | Which filter chip is active. |
| `sort` | `'time' \| 'score'` | Sort selector value. |
| `userVote` | `Record<quoteId, 'for' \| 'against' \| null>` | Optimistic vote tracking for the For/Against buttons. |

Data fetching: load `author`, `traits`, and the first page of `quotes` in parallel on mount, keyed by the route slug. Re-fetch quotes when `activeFilter` or `sort` change.

---

## Design tokens

All CSS custom properties are declared on `:root` in `Author Page.html`. Mirror them as design tokens in the target codebase.

### Colors

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#f6f2e9` | Page background (warm cream) |
| `--paper-soft` | `#efe9d9` | Alt surface |
| `--surface` | `#ffffff` | Card / button bg |
| `--surface-tint` | `#e8f3ed` | Year tag bg, subtle green wash |
| `--ink` | `#0a1f17` | Primary text |
| `--ink-2` | `#2c3e36` | Secondary text |
| `--ink-3` | `#5a6e64` | Tertiary / muted text |
| `--muted` | `#8a988f` | Hairline accents |
| `--green-50` | `#e6f3ec` | Hover tint |
| `--green-200` | `#9FE1CB` | Soft accent |
| `--green-300` | `#5DCAA5` | Hover border, decorative quote glyph |
| `--green-500` | `#1D9E75` | Primary green (brand) |
| `--green-700` | `#0F6E56` | Deep green — primary CTAs, links |
| `--green-900` | `#04342C` | Headlines, active chip bg |
| `--gold` | `#BA7517` | From logo chips (reserved, not yet used) |
| `--gold-soft` | `#EF9F27` | From logo chips (reserved) |
| `--blue` | `#185FA5` | From logo chips (reserved) |
| `--line` | `#d8d3c4` | Default border |
| `--line-soft` | `#ece7d6` | Soft border / divider |

The page background also has a faint PCB-style dot grid:
`background-image: radial-gradient(circle, rgba(15,110,86,0.06) 1px, transparent 1.5px); background-size: 28px 28px;`.

### Typography

| Family | Source | Use |
| --- | --- | --- |
| **Source Serif 4** | Google Fonts (weights 400, 500, 600, 700; optical sizing 8..60) | All editorial type — H1, H2, blockquote, scorecard title, scores |
| **IBM Plex Sans** | Google Fonts (weights 300, 400, 500, 600) | Body text, nav, buttons |
| **JetBrains Mono** | Google Fonts (weights 400, 500, 600) | Labels, eyebrows, breadcrumb, rank, year tag, vote button text |

Recommended replacements for the logo's Georgia: use **Source Serif 4** (the wordmark itself stays as Georgia inside its SVG).

### Spacing & radii

| Value | Use |
| --- | --- |
| `4px` | Tight inline gaps |
| `6px` | Vote-button radius, year tag radius |
| `10–14px` | Default component padding |
| `14px` | Card border-radius |
| `18px` | Default gap between quote cards |
| `24px` | Standard gap |
| `28px / 32px` | Quote card padding (vertical / horizontal) |
| `36–64px` | Section / hero gaps |
| `96px` | Bottom padding of last section |

### Shadows

- Card shadow: `0 1px 0 rgba(15,110,86,0.04), 0 8px 24px -16px rgba(4,52,44,0.18)`.

### Animations

- `shimmer` — see Skeleton spec.
- `pulse` — 7×7 dot with expanding shadow ring, 1.4s infinite ease-out, from `rgba(29,158,117,0.45)` to transparent at 8px radius.
- Hover transitions: 120–160ms `ease`.

---

## Assets

| File | Source | Notes |
| --- | --- | --- |
| `logo.svg` | Provided by user; the original "logo_balanță cu circuite" SVG with the embedded "CIRCUITLEX" wordmark removed via viewBox crop and the right-pan circuit board shifted +48px so it sits centered under its hanging line. | Use as-is. Aspect ~ 500×340. |
| `faval-wordmark.svg` | Generated for Faval.ai. Georgia 700 64px, "Faval" in `#0B5942`, "`.ai`" in italic 400 `#0F6E56`. | Use as-is or convert to an inline SVG component to make color tweakable. |

Both are vector and should be served directly. If you need responsive sizing, set CSS height/width on the `<img>` and let `object-fit: contain` handle the rest.

---

## Files in this bundle

| File | Purpose |
| --- | --- |
| `Author Page.html` | Hi-fi page shell — all tokens (`:root` vars), typography imports, layout CSS, animations. Open in a browser to see the page. |
| `author-page.jsx` | React component tree for the hi-fi page (Header, Breadcrumb, Hero, TraitScorecard, Quotes, QuoteSkeleton, App). Babel-in-the-browser, not built. |
| `logo.svg` | Brand mark (balance + circuits). |
| `faval-wordmark.svg` | "Faval.ai" wordmark. |
| `Wireframes.html` | Low-fi sketchy wireframe of the same page — structural reference only. |
| `wireframes.jsx` | React components for the wireframe canvas (sketchy slot vocabulary). |
| `design-canvas.jsx` | Pan/zoom canvas shell used by the wireframe file. |

---

## Open questions for follow-up

These were not designed in this round — flag with the team:

- **Populated state** of the trait scorecard (how trait names render, whether scores are 0–100 or another scale, whether the user can click a trait to filter quotes).
- **Compare** flow — both the trigger in the header and what the compare surface looks like.
- **Search** overlay / surface.
- **Quote Stream**, **Donate & Suggest**, and **About** pages.
- **Empty states** — author with zero quotes, zero ratings, or 404.
- **Error states** — API failure for trait scorecard or quote list.
- **Auth-gated voting** — sign-in prompt for unauth users hitting the For/Against buttons.
- **Pagination / infinite scroll** for long quote lists.
