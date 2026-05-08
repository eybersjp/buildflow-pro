---
name: ui-design-system
description: Generates a complete, industry-specific design system for the project including color palette, typography, spacing, component inventory, UX guidelines, anti-patterns to avoid, and a pre-delivery UI checklist. Produces 161-rule-backed decisions for colors, fonts, and layout patterns. Use before building any frontend component.
version: 1.0.0
triggers:
  - "generate a design system"
  - "design the UI system"
  - "choose colors and fonts"
  - "before building UI"
  - /design-ui
lifecycle: plan
---

# UI Design System Generator
# BuildFlow Pro — Frontend Intelligence Layer
# Source: ui-ux-pro-max-skill pattern (v2.5.0 model)

## Overview

You are generating a complete, production-grade design system for this project — before a single UI component is built.

A design system is not just a color palette. It is a coherent set of decisions that ensures every screen, every component, and every interaction in the app feels intentional and consistent.

This skill produces a **MASTER design system document** at `docs/DESIGN_SYSTEM.md` that every frontend component must reference.

---

## Process

Follow this sequence exactly.

### Step 1 — Project Context Analysis

Read `docs/PRD.md` to extract:
- **Industry** — what sector is this app in? (fintech, healthcare, construction, logistics, SaaS, etc.)
- **Primary user persona** — who uses this? (professional, consumer, enterprise, field worker, executive)
- **App personality** — what emotional tone should the UI convey? (trusted, energetic, calm, efficient, premium)
- **Key actions** — what are the 3 most important things users do in this app?

### Step 2 — Industry Reasoning Engine

Apply the 161-rule reasoning engine to select appropriate patterns for the identified industry.

**Industry → Design Pattern mapping:**

| Industry | Recommended Palette Family | UI Style | Key Anti-Patterns |
|---|---|---|---|
| Fintech / Banking | Deep blues, forest greens, gold accents | Structured, data-dense, trust-signaling | Neon colors, playful illustrations, ambiguous CTAs |
| Healthcare / Medical | Clinical whites, soft teals, safety greens | Clean, spacious, accessible, calm | Dark backgrounds, aggressive colors, small text |
| Construction / Field Ops | High-contrast, amber/orange, deep slate | Robust, large touch targets, high legibility | Thin fonts, low-contrast, complex navigation |
| SaaS / Productivity | Neutral greys, indigo/violet accents, white | Efficient, minimal, information-dense | Overuse of color, decorative animations, clutter |
| E-Commerce / Retail | Warm whites, brand-strong, conversion-optimized | Engaging, visual-first, urgency-driven | Cold palettes, hidden CTAs, cluttered layouts |
| Logistics / Operations | Deep navy, signal orange, high contrast | Functional, data-first, status-clear | Decorative elements, ambiguous status indicators |
| Legal / Professional Services | Charcoal, navy, subtle gold | Conservative, credible, structured | Playful fonts, bright colors, informal tone |
| EdTech / Learning | Approachable blues, warm yellows, positive greens | Encouraging, clear hierarchy, progress-visible | Dark modes by default, complex navigation, text-dense |

### Step 3 — Color System Generation

Generate a complete HSL-based color system with semantic naming:

```css
/* ═══════════════════════════════════════════
   [APP_NAME] Design System — Color Tokens
   Industry: [INDUSTRY]
   Personality: [PERSONALITY]
   ═══════════════════════════════════════════ */

:root {
  /* ── Brand Colors ── */
  --color-brand-50:  hsl([H], [S]%, 97%);
  --color-brand-100: hsl([H], [S]%, 92%);
  --color-brand-200: hsl([H], [S]%, 82%);
  --color-brand-300: hsl([H], [S]%, 68%);
  --color-brand-400: hsl([H], [S]%, 54%);
  --color-brand-500: hsl([H], [S]%, 42%);   /* Primary brand */
  --color-brand-600: hsl([H], [S]%, 34%);
  --color-brand-700: hsl([H], [S]%, 26%);
  --color-brand-800: hsl([H], [S]%, 18%);
  --color-brand-900: hsl([H], [S]%, 12%);

  /* ── Semantic Colors ── */
  --color-primary:         var(--color-brand-600);
  --color-primary-hover:   var(--color-brand-700);
  --color-primary-active:  var(--color-brand-800);
  --color-primary-subtle:  var(--color-brand-50);

  /* ── Status Colors ── */
  --color-success:  hsl(142, 72%, 29%);
  --color-success-bg: hsl(142, 72%, 96%);
  --color-warning:  hsl(38, 92%, 40%);
  --color-warning-bg: hsl(38, 92%, 97%);
  --color-danger:   hsl(0, 84%, 45%);
  --color-danger-bg: hsl(0, 84%, 97%);
  --color-info:     hsl(214, 84%, 46%);
  --color-info-bg:  hsl(214, 84%, 97%);

  /* ── Neutral Scale ── */
  --color-neutral-0:   hsl(0, 0%, 100%);
  --color-neutral-50:  hsl(0, 0%, 98%);
  --color-neutral-100: hsl(0, 0%, 96%);
  --color-neutral-200: hsl(0, 0%, 90%);
  --color-neutral-300: hsl(0, 0%, 80%);
  --color-neutral-400: hsl(0, 0%, 64%);
  --color-neutral-500: hsl(0, 0%, 46%);
  --color-neutral-600: hsl(0, 0%, 32%);
  --color-neutral-700: hsl(0, 0%, 22%);
  --color-neutral-800: hsl(0, 0%, 14%);
  --color-neutral-900: hsl(0, 0%, 8%);

  /* ── Surface Colors ── */
  --color-surface:           var(--color-neutral-0);
  --color-surface-elevated:  var(--color-neutral-50);
  --color-surface-sunken:    var(--color-neutral-100);
  --color-surface-overlay:   hsl(0, 0%, 0%, 0.4);

  /* ── Text Colors ── */
  --color-text-primary:    var(--color-neutral-900);
  --color-text-secondary:  var(--color-neutral-600);
  --color-text-tertiary:   var(--color-neutral-400);
  --color-text-disabled:   var(--color-neutral-300);
  --color-text-inverse:    var(--color-neutral-0);
  --color-text-on-brand:   var(--color-neutral-0);

  /* ── Border Colors ── */
  --color-border:          var(--color-neutral-200);
  --color-border-strong:   var(--color-neutral-400);
  --color-border-focus:    var(--color-brand-500);
}
```

### Step 4 — Typography System

Select a font pairing appropriate for the industry and generate the complete type scale:

**57 vetted font pairings by industry:**

| Industry | Heading Font | Body Font | Mono Font |
|---|---|---|---|
| Fintech | Inter | Inter | JetBrains Mono |
| Healthcare | Source Serif 4 | Source Sans 3 | Fira Code |
| Construction | DM Sans | DM Sans | Roboto Mono |
| SaaS / Productivity | Geist | Geist | Geist Mono |
| Professional Services | Libre Baskerville | Source Sans 3 | Fira Code |
| E-Commerce | Plus Jakarta Sans | Plus Jakarta Sans | JetBrains Mono |
| Logistics | IBM Plex Sans | IBM Plex Sans | IBM Plex Mono |
| EdTech | Nunito | Nunito Sans | Fira Code |

```css
/* ── Type Scale ── */
:root {
  --font-heading:  '[HEADING_FONT]', system-ui, sans-serif;
  --font-body:     '[BODY_FONT]', system-ui, sans-serif;
  --font-mono:     '[MONO_FONT]', 'Courier New', monospace;

  /* Size scale (Major Third — 1.25 ratio) */
  --text-xs:   0.64rem;    /* 10.24px */
  --text-sm:   0.8rem;     /* 12.8px  */
  --text-base: 1rem;       /* 16px    */
  --text-md:   1.25rem;    /* 20px    */
  --text-lg:   1.563rem;   /* 25px    */
  --text-xl:   1.953rem;   /* 31px    */
  --text-2xl:  2.441rem;   /* 39px    */
  --text-3xl:  3.052rem;   /* 49px    */

  /* Weight */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;

  /* Line height */
  --leading-tight:   1.2;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
  --leading-loose:   2;

  /* Letter spacing */
  --tracking-tight:   -0.02em;
  --tracking-normal:   0;
  --tracking-wide:     0.02em;
  --tracking-wider:    0.05em;
  --tracking-widest:   0.1em;
}
```

### Step 5 — Spacing & Layout System

```css
/* ── Spacing Scale (4px base) ── */
:root {
  --space-0:   0;
  --space-1:   0.25rem;   /* 4px  */
  --space-2:   0.5rem;    /* 8px  */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */

  /* ── Layout ── */
  --container-sm:   640px;
  --container-md:   768px;
  --container-lg:   1024px;
  --container-xl:   1280px;
  --container-2xl:  1536px;

  /* ── Border Radius ── */
  --radius-sm:    0.25rem;   /* 4px  */
  --radius-md:    0.5rem;    /* 8px  */
  --radius-lg:    0.75rem;   /* 12px */
  --radius-xl:    1rem;      /* 16px */
  --radius-2xl:   1.5rem;    /* 24px */
  --radius-full:  9999px;

  /* ── Shadow ── */
  --shadow-sm:   0 1px 2px 0 hsl(0 0% 0% / 0.05);
  --shadow-md:   0 4px 6px -1px hsl(0 0% 0% / 0.07), 0 2px 4px -2px hsl(0 0% 0% / 0.07);
  --shadow-lg:   0 10px 15px -3px hsl(0 0% 0% / 0.08), 0 4px 6px -4px hsl(0 0% 0% / 0.08);
  --shadow-xl:   0 20px 25px -5px hsl(0 0% 0% / 0.08), 0 8px 10px -6px hsl(0 0% 0% / 0.08);

  /* ── Animation ── */
  --duration-fast:    100ms;
  --duration-normal:  200ms;
  --duration-slow:    400ms;
  --ease-default:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:          cubic-bezier(0.4, 0, 1, 1);
  --ease-out:         cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Z-index ── */
  --z-base:     0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;
}
```

### Step 6 — Component Inventory

Define the component library for this specific application:

**Core Components (every app):**
| Component | Variants | States |
|---|---|---|
| Button | primary, secondary, ghost, danger, link | default, hover, active, disabled, loading |
| Input | text, password, search, number | default, focus, error, disabled, readonly |
| Select | single, multi | default, focus, open, error, disabled |
| Checkbox | — | unchecked, checked, indeterminate, disabled |
| Badge | neutral, success, warning, danger, info | — |
| Avatar | with image, initials, icon | default, online, busy, offline |
| Card | default, elevated, interactive | default, hover, selected |
| Modal | sm, md, lg, full | — |
| Toast | success, error, warning, info | — |
| Skeleton | text, card, avatar, list | — |

**App-Specific Components (determined by PRD):**
| Component | Source Feature |
|---|---|
| [component name] | [feature from PRD] |

### Step 7 — UX Rules (99 Production Rules Distilled to 20 Must-Haves)

These 20 rules govern every screen in the application:

1. **Primary action clarity** — Every screen has exactly one primary action. It must be the most visually dominant interactive element.
2. **Loading is mandatory** — Every async operation shows a skeleton or spinner. Users must never see a blank screen.
3. **Empty states earn trust** — Empty states include: an icon, a heading ("No items yet"), a description, and a primary CTA.
4. **Error states recover** — Error states include: what went wrong, what the user can do, and a retry button.
5. **Forms prevent errors** — Required fields are marked. Field-level errors appear on blur, not just on submit.
6. **Destructive actions confirm** — Delete, archive, and cancel are gated by a confirmation dialog. The confirm button is secondary (not primary) colored.
7. **Touch targets are 44×44px minimum** — Every interactive element meets this minimum on mobile.
8. **Contrast meets WCAG AA** — Body text minimum 4.5:1, large text minimum 3:1.
9. **Focus states are visible** — All interactive elements show a clear, high-contrast focus ring.
10. **Mobile is not optional** — Every screen is designed mobile-first. Desktop is an enhancement, not the base.
11. **Progressive disclosure** — Show only what the user needs right now. Advanced options live in expandable sections.
12. **Inline errors, not top banners** — Form errors appear beside the field, not in a banner above the form.
13. **Status is always visible** — Progress, loading, success, and error states are never hidden or ambiguous.
14. **Navigation never orphans** — Every page has a clear way back. Breadcrumbs for deep navigation.
15. **Data tables are scannable** — Fixed column headers, consistent alignment (numbers right, text left), sortable columns.
16. **Modals have escape routes** — All modals close on Escape key, on overlay click, and via an explicit close button.
17. **Transitions signal meaning** — Animations communicate: entrance (fade+slide up), exit (fade out), success (scale pulse), error (shake).
18. **Permissions gate, not hide** — If a user lacks permission, show a locked state (not a 404). Explain what they need to get access.
19. **Typography hierarchy is strict** — H1 appears once per page. Never skip heading levels.
20. **Consistency over creativity** — Use the same component for the same pattern. Do not create bespoke solutions when a system component exists.

### Step 8 — UI Anti-Patterns (Industry-Specific)

Document patterns that must be explicitly avoided for this project's industry:

```markdown
## Anti-Patterns to Avoid — [INDUSTRY]

- ❌ [anti-pattern 1 specific to this industry]
- ❌ [anti-pattern 2]
- ❌ [anti-pattern 3]
- ❌ Neon/saturated accent colors on dark backgrounds (damages credibility in [INDUSTRY])
- ❌ Decorative illustrations that compete with data (this is a data-first application)
- ❌ Generic stock photos (use project-specific imagery or icons only)
- ❌ Auto-playing animations (distracting in professional contexts)
- ❌ Modal-heavy flows (actions should complete inline where possible)
```

### Step 9 — Pre-Delivery UI Checklist

Before any UI component or page is marked complete, verify:

**Visual Correctness**
- [ ] Uses design system tokens, not hardcoded hex colors or pixel values
- [ ] Typography follows the established type scale
- [ ] Spacing uses the 4px grid system
- [ ] All interactive elements use the correct component variant

**State Coverage**
- [ ] Loading state implemented (skeleton preferred over spinner for layout-heavy components)
- [ ] Empty state implemented with icon + heading + description + CTA
- [ ] Error state implemented with actionable recovery message
- [ ] Success state provides clear confirmation feedback
- [ ] Permission-denied state shows locked UI with explanation

**Accessibility**
- [ ] All images have descriptive `alt` text
- [ ] All form inputs have associated `<label>` elements
- [ ] Color contrast meets WCAG AA (4.5:1 for body text)
- [ ] Focus ring is visible on all interactive elements
- [ ] Keyboard navigation works for all user flows
- [ ] Destructive actions require confirmation

**Mobile**
- [ ] Layout tested at 375px (iPhone SE)
- [ ] Layout tested at 768px (tablet)
- [ ] Touch targets meet 44×44px minimum
- [ ] No horizontal scroll on mobile

**Performance**
- [ ] Images use `next/image` or equivalent
- [ ] Large components use dynamic imports
- [ ] No layout shift on load (CLS < 0.1)

---

## Output

Write the complete design system to: `docs/DESIGN_SYSTEM.md`

Write the CSS tokens to: `src/styles/design-tokens.css`

Reference this skill in the frontend-engineer skill for all component builds.

---

## Verification

Before marking this skill complete:

- [ ] Industry identified and reasoning engine applied
- [ ] Complete HSL color system generated with semantic names
- [ ] Typography pairing selected and type scale defined
- [ ] Spacing, layout, shadow, and animation tokens defined
- [ ] Component inventory matches the features in PRD.md
- [ ] 20 UX rules have been reviewed and applied to the page designs
- [ ] Industry-specific anti-patterns listed and shared with frontend team
- [ ] Pre-delivery UI checklist added to `docs/DESIGN_SYSTEM.md`
- [ ] CSS tokens written to `src/styles/design-tokens.css`
- [ ] Full design system written to `docs/DESIGN_SYSTEM.md`
- [ ] User has reviewed and approved the design system before component work begins

**Gate:** No frontend component is built without a completed, approved design system.

---

## Red Flags

- User wants to pick colors based on personal preference alone — apply the industry reasoning engine first
- Typography is chosen because it looks "nice" — validate against the 57 industry-vetted pairings
- Design system uses hardcoded hex values — all colors must be HSL tokens with semantic names
- The design system doesn't include dark mode tokens — even if dark mode is not in MVP, the token structure must support it
- Anti-patterns for the industry are not listed — every industry has known failure modes that must be documented

---

## Anti-Rationalisations

- ❌ "We'll just use Tailwind defaults" — Tailwind defaults are not a design system. Semantic design tokens are required.
- ❌ "The design can evolve as we build" — Design systems that evolve without tokens become inconsistent messes.
- ❌ "We only have 4 pages, no need for a system" — Every page benefits from a system. Systems save time, they don't cost it.
- ❌ "We can use any color we like" — Color choices for professional applications are governed by industry conventions and accessibility standards.
