# Design System

**Project:** TaskFlow
**Version:** 1.0 (MVP)
**Status:** Approved
**Date:** 2026-05-13
**Author:** Frontend Engineer (BuildFlow Pro)
**Industry Pattern:** B2B Productivity SaaS

---

## 1. Design Philosophy

TaskFlow targets **remote team managers and developers**. The design must communicate:

- **Speed** — Fast interfaces reduce cognitive load
- **Clarity** — Every element has a clear purpose
- **Trust** — Clean, professional UI signals reliability

**Anti-patterns to avoid:**

- Decorative animations that slow down task workflows
- Bright, attention-grabbing colors that aren't status indicators
- Dense information without enough whitespace to breathe
- Modals for every action (prefer inline editing)

---

## 2. Color Palette

### Primary (Action)

| Token | Value | Use |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | Hover backgrounds |
| `--color-primary-100` | `#dbeafe` | Selected state |
| `--color-primary-500` | `#3b82f6` | Primary buttons, links, active states |
| `--color-primary-600` | `#2563eb` | Button hover |
| `--color-primary-700` | `#1d4ed8` | Button active/pressed |

### Neutrals (UI Shell)

| Token | Value | Use |
|---|---|---|
| `--color-gray-50` | `#f9fafb` | Page background |
| `--color-gray-100` | `#f3f4f6` | Sidebar, card backgrounds |
| `--color-gray-200` | `#e5e7eb` | Borders, dividers |
| `--color-gray-400` | `#9ca3af` | Placeholder text |
| `--color-gray-600` | `#4b5563` | Secondary text |
| `--color-gray-900` | `#111827` | Primary text |

### Semantic Colors (Status / Alerts)

| Token | Value | Use |
|---|---|---|
| `--color-success-500` | `#22c55e` | Task done, success states |
| `--color-warning-500` | `#f59e0b` | Due soon, warnings |
| `--color-danger-500` | `#ef4444` | Overdue, destructive actions |
| `--color-info-500` | `#06b6d4` | Info banners, notifications |

### Priority Colors

| Priority | Token | Value |
|---|---|---|
| `low` | `--color-priority-low` | `#9ca3af` |
| `medium` | `--color-priority-medium` | `#3b82f6` |
| `high` | `--color-priority-high` | `#f59e0b` |
| `urgent` | `--color-priority-urgent` | `#ef4444` |

### Dark Mode

All color tokens have a `[data-theme="dark"]` variant using CSS custom properties.
Dark mode is toggled via `<html data-theme="dark">`.

---

## 3. Typography

**Font:** Inter (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

| Token | Size | Weight | Use |
|---|---|---|---|
| `--text-xs` | 11px | 400 | Labels, badges |
| `--text-sm` | 13px | 400 | Secondary body, table cells |
| `--text-base` | 15px | 400 | Primary body text |
| `--text-md` | 16px | 500 | Form labels, nav items |
| `--text-lg` | 18px | 600 | Card titles, section headers |
| `--text-xl` | 22px | 700 | Page titles |
| `--text-2xl` | 28px | 700 | Hero headings (auth pages) |

**Line heights:** `--leading-tight: 1.25` / `--leading-normal: 1.5` / `--leading-relaxed: 1.75`

---

## 4. Spacing System

Base unit: **4px**

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Micro gaps (badge padding) |
| `--space-2` | 8px | Small gaps (icon + label) |
| `--space-3` | 12px | Inner component padding |
| `--space-4` | 16px | Standard card padding |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Page section spacing |
| `--space-12` | 48px | Large section breaks |
| `--space-16` | 64px | Page top padding |

---

## 5. Elevation (Shadows)

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Input fields |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.10)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.12)` | Command palette |

---

## 6. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Input fields, small badges |
| `--radius-md` | 6px | Buttons, cards |
| `--radius-lg` | 8px | Modals, panels |
| `--radius-full` | 9999px | Avatar circles, pill badges |

---

## 7. Component Inventory

| Component | States | Notes |
|---|---|---|
| `Button` | default, hover, active, disabled, loading | Primary, secondary, ghost, danger variants |
| `Input` | default, focused, error, disabled | With icon support |
| `TaskCard` | loading, empty, error, success, denied | Drag-handle on hover |
| `TaskStatusBadge` | todo, in-progress, done, archived | Color-coded |
| `PriorityBadge` | low, medium, high, urgent | Icon + label |
| `Avatar` | default, loading, fallback (initials) | 24px, 32px, 40px sizes |
| `NotificationBell` | unread count badge, empty | Pulse animation on new |
| `KanbanColumn` | loading, empty, has-tasks | Drop target highlight |
| `Sidebar` | expanded, collapsed | Persisted to localStorage |
| `CommandPalette` | open, loading, empty, results | `⌘K` shortcut |

---

## 8. Motion & Animation

**Principle:** Animations communicate state changes, not decoration.

| Interaction | Duration | Easing |
|---|---|---|
| Task status change (badge swap) | 150ms | `ease-out` |
| Sidebar collapse/expand | 200ms | `ease-in-out` |
| Dropdown open | 100ms | `ease-out` |
| Page transition (RSC) | Native (Suspense) | — |
| Notification bell pulse | 1s | `ease-in-out`, loop 3x |
| Drag-and-drop card lift | 80ms | `ease-out` |
| Toast appear/dismiss | 200ms / 300ms | `spring(1, 80, 20)` |

---

## 9. Accessibility Rules

- All interactive elements: `focus-visible` outline (`2px solid --color-primary-500`)
- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text
- All icons: `aria-hidden="true"` with adjacent visible label or `aria-label`
- All form fields: associated `<label>` element
- Keyboard navigation: Tab order follows visual reading order
- Status updates: `role="status"` + `aria-live="polite"` for dynamic content

---

*Generated by BuildFlow Pro — Frontend Engineer skill (ui-design-system.md)*
*Industry pattern: B2B Productivity SaaS*
