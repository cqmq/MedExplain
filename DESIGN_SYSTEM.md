# DESIGN_SYSTEM.md — Muazaf Copilot

> Canonical design system for Muazaf (AI-powered workspace). Production-ready, token-driven, CSS-Module–based.
>
> **For AI IDEs (Claude Code, Cursor, Windsurf):** Read Section 4 before writing any component. Use token names verbatim; never hardcode hex values. Cross-reference `tokens.css` for authoritative values.

---

## Table of Contents

1. [How to Use This Document](#0-how-to-use-this-document)
2. [Design Philosophy](#1-design-philosophy)
3. [Token Reference](#2-token-reference)
4. [Typography](#3-typography)
5. [Component Specifications](#4-component-specifications)
6. [Layout Architecture](#5-layout-architecture)
7. [Page Patterns](#6-page-patterns)
8. [Motion & Animation](#7-motion--animation)
9. [Accessibility](#8-accessibility)
10. [Implementation Rules](#9-implementation-rules)

---

## 1. Design Philosophy

The visual language is built on five principles:

**Minimalism with purpose.** Every element earns its place. Empty space is treated as a design element, not a void to fill. Content breathes — generous padding, clean margins, no visual clutter.

**Monochromatic foundation, selective color.** The UI is fundamentally black, white, and gray. Color is reserved for brand accents (agent icons, status indicators, category badges) and interactive affordances. No gradients on body surfaces; gradients appear only on specific circular icons for workflows/agents.

**Soft geometry.** Rounded corners everywhere — pills for buttons and filters, generously rounded cards (12–16px), fully circular avatars and icon containers. Hard corners are avoided.

**Typographic hierarchy drives the layout.** Page titles are large and bold (30–40px). Section headings are medium weight. Body text is comfortable (14–15px). Meta text is muted (12–13px, low-contrast gray). Hierarchy is achieved through size and weight, not decoration.

**Calm, neutral, professional.** No neon, no heavy shadows, no glassmorphism. The product feels like a native desktop tool — closer to Linear, Notion, and Things than a consumer app.

---

## 2. Color System

The platform uses a strictly controlled palette. Define these as CSS custom properties at the `:root` level and override inside `[data-theme="dark"]`.

### 2.1 Light Theme Tokens

```css
:root {
  /* Surfaces */
  --color-bg-primary: #FFFFFF;          /* main content background */
  --color-bg-secondary: #F7F7F5;        /* sidebar, subtle surfaces */
  --color-bg-tertiary: #F0F0EE;         /* hover states, input fields, cards */
  --color-bg-elevated: #FFFFFF;         /* modals, popovers */
  --color-bg-overlay: rgba(0, 0, 0, 0.40); /* modal scrim */

  /* Text */
  --color-text-primary: #0A0A0A;        /* headings, primary body */
  --color-text-secondary: #6B6B6B;      /* descriptions, meta */
  --color-text-tertiary: #9B9B9B;       /* placeholders, disabled */
  --color-text-inverse: #FFFFFF;        /* text on dark buttons */

  /* Borders */
  --color-border-subtle: #ECECEA;       /* dividers, card borders */
  --color-border-default: #E0E0DC;      /* input borders */
  --color-border-strong: #C8C8C4;       /* focused inputs */

  /* Interactive - primary action */
  --color-action-primary-bg: #0A0A0A;
  --color-action-primary-bg-hover: #1F1F1F;
  --color-action-primary-text: #FFFFFF;

  /* Interactive - secondary action (pill buttons) */
  --color-action-secondary-bg: #F0F0EE;
  --color-action-secondary-bg-hover: #E6E6E3;
  --color-action-secondary-text: #0A0A0A;

  /* Interactive - ghost / tab */
  --color-action-ghost-bg: transparent;
  --color-action-ghost-bg-hover: #F0F0EE;

  /* Sidebar active item */
  --color-sidebar-item-active: #ECECEA;
  --color-sidebar-item-hover: #F0F0EE;

  /* Status / Accent */
  --color-accent-blue: #3B82F6;         /* "Doc" tag, info */
  --color-accent-blue-soft: #DBEAFE;    /* badge bg */
  --color-accent-green: #22C55E;        /* toggles ON, active state */
  --color-accent-purple: #8B5CF6;       /* workflow icon, avatar ring */
  --color-accent-red: #E11D48;          /* destructive, Legal agent icon */
  --color-accent-orange: #F97316;       /* Customer support agent icon */
  --color-accent-pink: #EC4899;         /* user avatar */

  /* Semantic gradient accents (used for icons) */
  --gradient-purple: linear-gradient(135deg, #A855F7 0%, #7C3AED 100%);
  --gradient-coral:  linear-gradient(135deg, #FB7185 0%, #F43F5E 100%);
  --gradient-avatar: linear-gradient(135deg, #F472B6 0%, #A855F7 100%);
}
```

### 2.2 Dark Theme Tokens

```css
[data-theme="dark"] {
  /* Surfaces */
  --color-bg-primary: #131314;
  --color-bg-secondary: #0E0E0E;
  --color-bg-tertiary: #1F1F1F;
  --color-bg-elevated: #1A1A1A;
  --color-bg-overlay: rgba(0, 0, 0, 0.60);

  /* Text */
  --color-text-primary: #F5F5F5;
  --color-text-secondary: #A0A0A0;
  --color-text-tertiary: #6B6B6B;
  --color-text-inverse: #0A0A0A;

  /* Borders */
  --color-border-subtle: #1F1F1F;
  --color-border-default: #2A2A2A;
  --color-border-strong: #3D3D3D;

  /* Interactive - primary action (inverts) */
  --color-action-primary-bg: #FFFFFF;
  --color-action-primary-bg-hover: #E5E5E5;
  --color-action-primary-text: #0A0A0A;

  /* Interactive - secondary */
  --color-action-secondary-bg: #1F1F1F;
  --color-action-secondary-bg-hover: #2A2A2A;
  --color-action-secondary-text: #F5F5F5;

  /* Ghost */
  --color-action-ghost-bg-hover: #1F1F1F;

  /* Sidebar */
  --color-sidebar-item-active: #1F1F1F;
  --color-sidebar-item-hover: #1A1A1A;
}
```

### 2.3 Color Usage Rules

- **Never use pure `#000000` or pure `#FFFFFF` for backgrounds** in dark mode text or borders — use the tokens above; pure black creates harsh contrast on OLED.
- **Accent colors are for icons and status only.** Buttons, cards, and text stay monochrome unless explicitly semantic (e.g., destructive red, success green).
- **The primary CTA button inverts between themes** — black-on-light, white-on-dark.
- **Badges** (e.g., "Beta") use soft backgrounds with accent-colored text: `background: var(--color-accent-blue-soft); color: var(--color-accent-blue)`.

---

## 3. Typography

### 3.1 Font Family

The platform uses a clean, modern sans-serif. Use Inter as the default with a robust fallback stack:

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
             "Helvetica Neue", Arial, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace;
```

Load Inter from Google Fonts or self-host. Enable variable font features:

```css
body {
  font-family: var(--font-sans);
  font-feature-settings: "cv11", "ss01", "ss03";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### 3.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | 40px / 2.5rem | 1.1 | 700 | Hero page titles (e.g., "Workflows", "Settings") |
| `--text-h1` | 30px / 1.875rem | 1.2 | 700 | Primary page titles |
| `--text-h2` | 24px / 1.5rem | 1.25 | 600 | Section titles ("Featured", "All workflows") |
| `--text-h3` | 18px / 1.125rem | 1.3 | 600 | Card titles, modal titles |
| `--text-h4` | 16px / 1rem | 1.4 | 600 | Subsection labels |
| `--text-body-lg` | 15px / 0.9375rem | 1.5 | 400 | Primary body |
| `--text-body` | 14px / 0.875rem | 1.5 | 400 | Default body, list items |
| `--text-body-sm` | 13px / 0.8125rem | 1.45 | 400 | Descriptions, meta |
| `--text-caption` | 12px / 0.75rem | 1.4 | 500 | Timestamps, labels, sidebar section headers |
| `--text-micro` | 11px / 0.6875rem | 1.3 | 500 | Badges, micro-labels |

### 3.3 Weight Usage

- **400 (Regular)** — default body text
- **500 (Medium)** — sidebar items, button labels, meta labels
- **600 (Semibold)** — section headings, card titles, navigation tabs
- **700 (Bold)** — page titles only

Avoid weight 300 (Light) — it reads as thin and low-contrast.

### 3.4 Text Color Hierarchy

```css
.text-primary   { color: var(--color-text-primary); }    /* default */
.text-secondary { color: var(--color-text-secondary); }  /* descriptions */
.text-tertiary  { color: var(--color-text-tertiary); }   /* placeholders, disabled */
```

---

## 4. Spacing & Layout Grid

### 4.1 Spacing Scale (4px base)

```css
--space-0: 0;
--space-1: 4px;    /* tight internal padding */
--space-2: 8px;    /* icon gaps, small paddings */
--space-3: 12px;   /* default gap */
--space-4: 16px;   /* standard padding inside cards */
--space-5: 20px;   /* medium section gap */
--space-6: 24px;   /* between major blocks */
--space-8: 32px;   /* section gap */
--space-10: 40px;  /* page vertical rhythm */
--space-12: 48px;  /* large page gaps */
--space-16: 64px;  /* hero sections */
--space-20: 80px;  /* page top offset */
```

### 4.2 Layout Grid

The app uses a **two-column fixed layout**:

```
┌─────────────────┬────────────────────────────────────────┐
│                 │                                         │
│    Sidebar      │          Main Content Area              │
│    260px fixed  │          flex: 1 (fluid)                │
│                 │          max-width: 1200px (content)    │
│                 │                                         │
└─────────────────┴────────────────────────────────────────┘
```

```css
.app-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-subtle);
  overflow-y: auto;
}

.main-content {
  overflow-y: auto;
  padding: var(--space-10) var(--space-12);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

When a right panel is present (e.g., Preview or Overview panels), the layout becomes three-column: `260px | 1fr | 360px`.

### 4.3 Responsive Breakpoints

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

Below 1024px, the sidebar collapses to an icon rail (60px) or hides behind a hamburger toggle.

---

## 5. Border Radius

```css
--radius-sm: 6px;    /* small tags, badges */
--radius-md: 8px;    /* inputs, small buttons */
--radius-lg: 12px;   /* cards, modals */
--radius-xl: 16px;   /* feature cards, large surfaces */
--radius-2xl: 20px;  /* hero cards */
--radius-pill: 9999px; /* pill buttons, chips, filter tabs */
--radius-circle: 50%;  /* avatars, icon circles */
```

**Rule of thumb:**
- Pills (`--radius-pill`) for any button containing a text label inline in the header (Browse, My workflows, All, General, Members).
- Rounded rectangles (`--radius-lg` to `--radius-xl`) for cards.
- Full circles for agent/workflow icons and user avatars.

---

## 6. Shadows & Elevation

Shadows are extremely subtle. The platform largely relies on borders and background contrast rather than shadows.

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.06),
             0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.08),
             0 4px 8px -2px rgba(0, 0, 0, 0.04);
--shadow-modal: 0 24px 48px -8px rgba(0, 0, 0, 0.15),
                0 8px 16px -4px rgba(0, 0, 0, 0.08);

/* In dark mode, shadows are barely visible; rely on borders */
[data-theme="dark"] {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.40);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.50);
  --shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.60);
  --shadow-modal: 0 24px 48px -8px rgba(0, 0, 0, 0.70);
}
```

**Usage:**
- Cards: no shadow, `1px solid var(--color-border-subtle)` instead.
- Dropdowns, popovers: `--shadow-md`.
- Modals: `--shadow-modal`.
- Chat input (the floating composer at bottom): `--shadow-md` to separate from background.

---

## 7. Iconography

### 7.1 Icon Library

Use **Lucide Icons** (React: `lucide-react`) as the primary icon set. It matches the clean, consistent 24×24 grid aesthetic of the platform.

```bash
npm install lucide-react
```

### 7.2 Icon Sizes

| Token | Size | Usage |
|---|---|---|
| `--icon-xs` | 14px | Inline with small text |
| `--icon-sm` | 16px | Sidebar items, buttons |
| `--icon-md` | 20px | Default UI icons |
| `--icon-lg` | 24px | Card icons, toolbar |
| `--icon-xl` | 32px | Feature icons |
| `--icon-2xl` | 48px | Hero icons, agent avatars |

### 7.3 Icon Containers

Agents, workflows, and featured cards use **colored rounded-square icon containers**:

```css
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-container--workflow-purple { background: var(--gradient-purple); }
.icon-container--workflow-coral  { background: var(--gradient-coral); }
.icon-container--agent-dark      { background: #0F172A; }
.icon-container--agent-blue      { background: #3B82F6; }
.icon-container--agent-red       { background: #E11D48; }
.icon-container--agent-burgundy  { background: #7F1D1D; }
```

Featured workflow icons are always **circular with a radial gradient**, larger (60–72px), and floated on card top-left.

### 7.4 Common Icons Map

| UI Element | Lucide Icon |
|---|---|
| New chat | `Plus` |
| Workflows | `Zap` |
| Search | `Search` |
| Meetings | `Calendar` |
| More | `MoreHorizontal` |
| Folder | `Folder` |
| Settings | `Settings` |
| Upload | `Upload` |
| Help | `HelpCircle` |
| Invite | `UserPlus` |
| Close | `X` |
| Chevron right | `ChevronRight` |
| Check | `Check` |
| Send | `ArrowUp` or `Send` |
| Doc tag | `Sparkles` |

---

## 8. Core Layout Architecture

### 8.1 Sidebar (260px, fixed)

Vertical stack with these sections from top to bottom:

1. **Workspace header** — workspace name + collapse toggle icon (`PanelLeftClose`).
2. **Primary nav** — `New chat`, `Workflows`, `Search`, `Meetings`, `More`.
3. **Folders section** — heading "Folders" (caption style), list of folders, "View all" link.
4. **Chat history groups** — "Today", "Yesterday", "Last week" — each is a caption heading followed by a list of chat titles.
5. **Upgrade card** (bottom) — subtle card with quota info and Upgrade CTA.
6. **Settings** (bottom-most) — gear icon + "Settings" label + overflow menu dots on hover.

**Sidebar item styles:**

```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.15s ease;
}

.sidebar-item:hover {
  background: var(--color-sidebar-item-hover);
}

.sidebar-item--active {
  background: var(--color-sidebar-item-active);
}

.sidebar-section-heading {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  text-transform: none;       /* no uppercase */
  letter-spacing: 0;
  margin-top: var(--space-4);
}
```

### 8.2 Main content area

- **Page header zone** — title + contextual actions on the right (e.g., "Create workflow", "Invite", "Help").
- **Filter/tab row** — pill-style tabs (Browse / My workflows) directly under the page title.
- **Content body** — cards, lists, or a centered composer depending on the page.
- **Footer disclaimer** (chat pages) — small centered gray text: *"Sana can make mistakes. Double check important info."*

### 8.3 Right panel (optional)

- Width: 360px.
- Background: `var(--color-bg-primary)`.
- Border-left: `1px solid var(--color-border-subtle)`.
- Close button (X) top-right.

Used for: agent Preview, chat Overview (knowledge sources + linked workflows).

---

## 9. Component Library

### 9.1 Buttons

#### Primary button (pill)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 40px;
  padding: 0 var(--space-5);
  background: var(--color-action-primary-bg);
  color: var(--color-action-primary-text);
  font-size: var(--text-body);
  font-weight: 500;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-primary:hover { background: var(--color-action-primary-bg-hover); }
```

#### Secondary button (pill, tinted)
```css
.btn-secondary {
  /* identical geometry to primary, but: */
  background: var(--color-action-secondary-bg);
  color: var(--color-action-secondary-text);
}
.btn-secondary:hover { background: var(--color-action-secondary-bg-hover); }
```

#### Ghost / tab button
```css
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
}
.btn-ghost:hover { background: var(--color-action-ghost-bg-hover); }
.btn-ghost--active { background: var(--color-action-secondary-bg); }
```

#### Icon button (circular)
```css
.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-circle);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
.btn-icon:hover { background: var(--color-action-ghost-bg-hover); }
```

**Button sizes:** `sm` = 32px height, `md` = 40px (default), `lg` = 48px. Padding scales proportionally.

### 9.2 Tabs (pill tabs)

Used under page titles for filtering (Browse / My workflows, General / Members / Integrations / Meetings).

```css
.tabs {
  display: inline-flex;
  gap: var(--space-2);
  padding: var(--space-1);
}

.tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-body);
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.15s ease;
}

.tab--active {
  background: var(--color-action-secondary-bg);
}
.tab:hover:not(.tab--active) {
  background: var(--color-action-ghost-bg-hover);
}
```

### 9.3 Input fields

```css
.input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-4);
  background: var(--color-bg-tertiary);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: var(--text-body);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:hover {
  background: var(--color-bg-tertiary);
}

.input:focus {
  outline: none;
  background: var(--color-bg-primary);
  border-color: var(--color-border-strong);
}

.input--with-icon {
  padding-left: 44px; /* leave room for icon */
}
```

#### Search input variant
Has a `Search` icon absolutely positioned at `left: 14px, top: 50%, transform: translateY(-50%)`.

### 9.4 Textarea

Same visual rules as input; set a `min-height` of 96px and allow vertical resize.

### 9.5 Chat composer

The distinctive rounded composer at the bottom of chat pages:

```css
.composer {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-2xl);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-md);
}

.composer__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--text-body-lg);
  color: var(--color-text-primary);
  resize: none;
  min-height: 28px;
  max-height: 200px;
}

.composer__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.composer__send-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  background: var(--color-action-primary-bg);
  color: var(--color-action-primary-text);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Beneath the input sits a row with two pill chips: a `Doc` chip (with blue accent when active) and a `+ Sources` chip. To the right: a `Default` model selector.

### 9.6 Chip / Tag

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 28px;
  padding: 0 var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-pill);
  font-size: var(--text-body-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.chip--accent-blue {
  background: var(--color-accent-blue-soft);
  color: var(--color-accent-blue);
  border-color: transparent;
}

.chip__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  opacity: 0.6;
  cursor: pointer;
}
.chip__close:hover { opacity: 1; }
```

### 9.7 Badge

Small inline labels (e.g., "Beta"):

```css
.badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-micro);
  font-weight: 500;
  line-height: 1;
}

.badge--info {
  background: var(--color-accent-blue-soft);
  color: var(--color-accent-blue);
}
```

### 9.8 Cards

#### Basic card
```css
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.card--interactive {
  cursor: pointer;
}
.card--interactive:hover {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}
```

#### Featured card (Workflows > Featured)
Uses a subtle tinted background, larger rounded corners, and a big circular gradient icon on the top-left.

```css
.featured-card {
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.featured-card__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.featured-card__title {
  font-size: var(--text-h3);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.featured-card__description {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
```

#### List card (workflow list items, agent cards)
Horizontally laid out: icon left, text body middle, meta right.

```css
.list-card {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: var(--space-4);
  align-items: start;
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  cursor: pointer;
}
.list-card:hover {
  background: var(--color-bg-secondary);
}
```

### 9.9 Pricing card

Three-column layout, center card is the highlighted one (uses primary black button).

```css
.pricing-card {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.pricing-card__tier {
  font-size: var(--text-h4);
  font-weight: 600;
}

.pricing-card__price {
  font-size: 32px;
  font-weight: 700;
  margin-top: var(--space-2);
}

.pricing-card__price-old {
  font-size: var(--text-h3);
  font-weight: 500;
  color: var(--color-text-tertiary);
  text-decoration: line-through;
  margin-left: var(--space-2);
}

.pricing-card__feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin-top: var(--space-6);
}

.pricing-card__feature {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--text-body-sm);
}
/* feature check icon uses color: var(--color-text-secondary); */
```

### 9.10 Modal / Dialog

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  max-width: 1100px;
  width: calc(100% - 64px);
  max-height: calc(100vh - 64px);
  overflow: auto;
  box-shadow: var(--shadow-modal);
  position: relative;
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal__header {
  padding: var(--space-6) var(--space-8) var(--space-4);
  font-size: var(--text-h3);
  font-weight: 600;
}

.modal__body {
  padding: 0 var(--space-8) var(--space-8);
}
```

### 9.11 Popover / Dropdown menu

Used extensively for Settings menu, Sources picker, theme picker, etc.

```css
.popover {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-2);
  min-width: 240px;
  animation: popoverIn 0.15s ease;
}

.popover__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  cursor: pointer;
}
.popover__item:hover { background: var(--color-action-ghost-bg-hover); }

.popover__item-kbd {
  margin-left: auto;
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}

.popover__separator {
  height: 1px;
  background: var(--color-border-subtle);
  margin: var(--space-2) 0;
}

.popover__section-heading {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  font-weight: 500;
}
```

### 9.12 Toggle switch

```css
.toggle {
  position: relative;
  width: 36px;
  height: 20px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.2s ease;
}

.toggle::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: var(--radius-circle);
  transition: transform 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.toggle--on {
  background: var(--color-accent-green);
}
.toggle--on::after {
  transform: translateX(16px);
}
```

### 9.13 Avatar

```css
.avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  background: var(--gradient-avatar);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-body-sm);
  font-weight: 600;
  text-transform: uppercase;
}

.avatar--sm { width: 24px; height: 24px; font-size: var(--text-micro); }
.avatar--lg { width: 48px; height: 48px; font-size: var(--text-body-lg); }
```

### 9.14 Process/step list

Used on the workflow detail page (numbered steps connected by a vertical line).

```css
.step-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-left: var(--space-8);
}

.step-list::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 20px;
  bottom: 20px;
  width: 1px;
  border-left: 1px dashed var(--color-border-default);
}

.step {
  position: relative;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
}

.step__number {
  position: absolute;
  left: -32px;
  top: 20px;
  width: 20px;
  text-align: center;
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-text-secondary);
}
```

### 9.15 Table (integrations, settings lists)

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
}

.table td {
  padding: var(--space-4);
  font-size: var(--text-body);
  border-bottom: 1px solid var(--color-border-subtle);
  vertical-align: middle;
}

.table tr:hover td {
  background: var(--color-bg-secondary);
}
```

### 9.16 Empty / centered state

Used for the new chat start screen: a centered composer with a vertical stack of suggested prompts below.

```css
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: var(--space-8);
}

.suggested-prompt {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: 720px;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background 0.15s ease;
}
.suggested-prompt:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
.suggested-prompt strong { color: var(--color-text-primary); font-weight: 500; }
```

### 9.17 Reasoning / processing panel

The scrollable "Processed" modal that shows the agent's reasoning steps (text blocks with small icons at the left margin for each reasoning stage).

```css
.reasoning-panel {
  padding: var(--space-6) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.reasoning-step {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: var(--space-4);
  align-items: start;
}

.reasoning-step__icon {
  margin-top: 2px;
  color: var(--color-text-secondary);
}

.reasoning-step__text {
  font-size: var(--text-body);
  color: var(--color-text-primary);
  line-height: 1.6;
}

.reasoning-step--thought .reasoning-step__text {
  color: var(--color-text-secondary);
  font-style: normal;
}
```

---

## 10. Page Patterns

### 10.1 Start / New chat screen

```
┌──────────────────────────────────────────────────┐
│  [sidebar]          [main]                        │
│                                                    │
│                     (empty above)                  │
│                                                    │
│                     ┌──────────────────┐           │
│                     │  What would...?  │  ← composer
│                     └──────────────────┘           │
│                     [Create] [+ Sources]   Default │
│                                                    │
│                     ┌ Create a financial...graphs │
│                     ├ Reply to an email in Outlook│
│                     ├ Cut through the noise Gmail │
│                     ├ Analyze our Notion docs     │
│                     ├ List my action points...    │
│                     └ ... Connect your apps →     │
│                                                    │
└──────────────────────────────────────────────────┘
```

### 10.2 Workflows page

- Page title: `Workflows` (display size).
- Tab row: `Browse` (active) / `My workflows`. Right-aligned: `+ Create workflow` primary button.
- Section heading: `Featured` + `Beta` badge.
- Grid: 2-column of featured cards (purple + coral gradient icons).
- Section heading: `All workflows` + search input + two filter dropdowns (`All categories`, `All agents`).
- Category blocks: `Customer success` etc., each with a 2-column grid of list cards.

### 10.3 Agent browse page

- Page title: `Browse agents`, with a subtitle paragraph.
- Primary CTA top-right: `+ Create` (pill button).
- Two sections: `My agents`, `All agents`.
- 2-column grid of agent cards. Each card: colored rounded-square icon (48×48), title, description, author avatar + 0 count.

### 10.4 Agent creation (wizard)

- Three-column layout: sidebar | form | live preview pane.
- Form has a horizontal step indicator at top: ① Persona, ② Knowledge, ③ Workflows, ④ Visibility.
- Fields: Name (with icon picker dropdown), Description (textarea), Instructions (textarea), Model (3-card selector: Default / Claude Opus 4.7 / Claude Opus 4.6).
- Bottom-right action: `Continue` primary button.
- Right pane: empty "Preview" with its own mini composer at the bottom.

### 10.5 Settings page

- Page title: `Settings` + subtitle "Manage your workspace".
- Top-right action: `Invite` + `Help` ghost buttons.
- Tab row: `General` (active) / `Members` / `Integrations` / `Meetings`.
- Content sections with H2 headings ("Workspace"), form rows (label + helper text + input), and a dashed upload area for workspace logo.

### 10.6 Integrations page

- Two sections: `Connected integrations` (table), `Available integrations` (card grid).
- Table columns: Name, Connection status, Assets, Access, Added by.
- Card grid: 4 columns, each card has an icon top-left, title, description, and a `View` text-link at the bottom.

### 10.7 Pricing modal

- Three equal columns (Free / Team / Enterprise).
- Top: centered title "Upgrade your workspace for unlimited value" + annual toggle chip.
- Center column is typically the recommended tier; its button uses the primary style.
- Each column ends with a vertical checkmark feature list.
- Footer line: compliance badge text (ISO 27001, GDPR, AES 256, TLS 1.2+).

---

## 11. Animation & Motion

Keep motion minimal, functional, and fast.

```css
--duration-instant: 100ms;
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
```

**Standard transitions:**
```css
* { transition-timing-function: var(--ease-default); }

.interactive {
  transition:
    background-color var(--duration-fast),
    border-color var(--duration-fast),
    color var(--duration-fast),
    transform var(--duration-fast);
}
```

**Modal entrance:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes popoverIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Respect reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Theme Implementation (Light/Dark)

The app supports three user-selectable modes: **Follow system settings**, **Dark**, **Light**.

```html
<html data-theme="light"> <!-- or "dark" -->
```

```js
// Pseudo-logic
const userPref = getStoredTheme(); // 'light' | 'dark' | 'system'
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const effective = userPref === 'system' ? (systemDark ? 'dark' : 'light') : userPref;
document.documentElement.dataset.theme = effective;

// Listen for system changes when in 'system' mode
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (getStoredTheme() === 'system') {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }
  });
```

Theme is picked from the user Settings popover, nested inside the `Interface theme →` item with sub-options: Follow system settings / Dark / Light.

---

## 13. Accessibility

- **Color contrast.** All body text meets WCAG AA (4.5:1). Secondary text meets AA for 16px+ (3:1).
- **Focus states.** Every interactive element must have a visible focus ring:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-action-primary-bg);
    outline-offset: 2px;
    border-radius: inherit;
  }
  ```
- **Keyboard navigation.** Sidebar items are `<a>` or `<button>`; popovers trap focus; modals close on `Esc`.
- **Aria labels.** All icon-only buttons require an accessible name (`aria-label="Close"`, etc.).
- **Semantic HTML.** Use `<nav>`, `<main>`, `<aside>`, `<section>`, headings in order.
- **Skip link** at the top of `<body>` pointing to `#main`.
- **Prefers-reduced-motion** honored (see §11).
- **Form labels.** Never rely on placeholder as the only label; use a real `<label>` above the input.

---

## 14. Implementation Stack Recommendations

### 14.1 Recommended stack

- **Framework:** Next.js 14+ (App Router) or Vite + React 18+.
- **Language:** TypeScript, strict mode.
- **Styling:** Tailwind CSS 3.4+ with a custom config mapping the tokens above, OR vanilla CSS with the custom properties defined here.
- **Component primitives:** Radix UI or shadcn/ui for accessible, unstyled primitives (Dialog, DropdownMenu, Popover, Tabs, Switch, Tooltip).
- **Icons:** `lucide-react`.
- **Animations:** Framer Motion for entrance/exit animations on modals and popovers; keep everything else pure CSS transitions.
- **State:** Zustand or Redux Toolkit for global UI state (sidebar, theme, modals). TanStack Query for server state.

### 14.2 Tailwind config snippet

```js
// tailwind.config.js
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          elevated: 'var(--color-bg-elevated)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
      },
      borderRadius: {
        sm: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        modal: 'var(--shadow-modal)',
      },
    },
  },
};
```

### 14.3 File structure suggestion

```
src/
├── app/                      # Next.js routes (or pages/)
├── components/
│   ├── ui/                   # primitives: Button, Input, Card, Modal, Popover, Toggle, Avatar, Badge, Chip, Tabs
│   ├── layout/               # Sidebar, TopBar, AppShell, RightPanel
│   ├── chat/                 # Composer, MessageList, SuggestedPrompts, ReasoningPanel
│   ├── agents/               # AgentCard, AgentWizard, AgentIconPicker
│   ├── workflows/            # WorkflowCard, FeaturedCard, StepList
│   └── settings/             # SettingsTabs, MemberTable, IntegrationCard
├── styles/
│   ├── tokens.css            # all :root and [data-theme="dark"] vars
│   └── globals.css           # resets + base typography
├── hooks/
├── lib/
└── stores/
```

### 14.4 Prompt for AI IDEs

When handing this document to an AI IDE, pair it with a directive like:

> Build a React + TypeScript + Tailwind app that follows the attached `DESIGN_SYSTEM.md` exactly. Use the token names verbatim as CSS custom properties. Use `lucide-react` for all icons and `shadcn/ui` or Radix for primitives (Dialog, DropdownMenu, Popover, Tabs, Switch). The shell is a fixed 260px left sidebar + fluid main content. Support light and dark themes driven by `data-theme` on `<html>`. Every page must use the exact spacing, typography, and component patterns defined in the Pages section of the design system. Do not introduce colors, radii, or shadows outside the tokens.

---

## Appendix A — Quick Reference Cheat Sheet

| Need | Token / Component |
|---|---|
| A primary action | `.btn-primary` (black pill in light, white pill in dark) |
| A secondary action | `.btn-secondary` (tinted pill) |
| A filter tab | `.tab` with `.tab--active` |
| An agent/workflow icon | 48×48 or 56×56 rounded square, brand color bg, white icon |
| A featured card | `.featured-card` with circular gradient icon |
| A list card | `.list-card` (icon + text + meta, horizontal) |
| A page title | `--text-display` or `--text-h1`, weight 700 |
| A section heading | `--text-h2`, weight 600 |
| A card description | `--text-body-sm`, color `--color-text-secondary` |
| Spacing between sections | `--space-8` to `--space-12` |
| Card border | `1px solid var(--color-border-subtle)`, no shadow |
| A modal | `.modal` with `--shadow-modal`, scrim with `backdrop-filter: blur(4px)` |
| A popover menu | `.popover` with `--shadow-md` |

---

*End of Design System Specification.*
