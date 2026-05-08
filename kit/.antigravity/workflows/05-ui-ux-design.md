# Workflow: UI/UX Design
# BuildFlow Pro — Workflow 05
# Version: 2.0.0 — Phase 2 Integration (ui-ux-pro-max-skill)

## Purpose

Generate a complete design system AND plan the UI/UX structure before building any frontend components.

## Trigger

- `/design-ui`
- "design the UI"
- "plan the interface"
- "what pages do we need"
- "generate the design system"
- Called from `00-start-production-app.md`

---

## Pre-Conditions

- Database design approved
- If not done → run `04-database-design.md` first

---

## Steps

### 1. Activate Frontend Engineer Skill
Use: `.antigravity/skills/frontend-engineer/SKILL.md`

### 2. Load Context
Read from: `docs/PRD.md`, `docs/ARCHITECTURE.md`
Read from: `.antigravity/memory/learned-patterns.md` — check for known frontend/UI patterns

### 3. Generate Design System (New in v2.0)

**Activate:** `.antigravity/skills/frontend-engineer/ui-design-system.md`

The design system generation must complete BEFORE the page map. Every component built later must reference the design system.

#### Step 3.1 — Industry Analysis
From `docs/PRD.md`, extract:
- Industry / sector
- Primary user persona
- App personality (trusted, efficient, premium, energetic, etc.)
- Key user actions

#### Step 3.2 — Design System Production

Generate all of the following:

**Color System (HSL tokens):**
- Brand palette (50–900 scale)
- Semantic colors (primary, success, warning, danger, info)
- Neutral scale
- Surface colors (background, elevated, sunken)
- Text colors (primary, secondary, tertiary, disabled, inverse)
- Border colors

**Typography:**
- Industry-appropriate font pairing from the 57-pairing library
- Complete type scale (xs through 3xl using Major Third ratio)
- Font weights, line heights, letter spacing tokens

**Spacing & Layout:**
- 4px-base spacing scale (space-0 through space-24)
- Container widths
- Border radius scale
- Shadow scale
- Animation timing and easing tokens
- Z-index scale

**Component Inventory:**
- Core components (button, input, select, checkbox, badge, avatar, card, modal, toast, skeleton)
- App-specific components derived from PRD features

**UX Rules:**
- Apply all 20 mandatory UX rules to the design decisions
- Document industry-specific anti-patterns

**Pre-Delivery Checklist:**
- Include in `docs/DESIGN_SYSTEM.md` — frontend engineer checks this before marking any component complete

#### Step 3.3 — Write Design System Output

Write to: `docs/DESIGN_SYSTEM.md`
Write CSS tokens to: `src/styles/design-tokens.css`

```
✅ Design system generated at docs/DESIGN_SYSTEM.md
   Industry: [identified industry]
   Color system: [palette description]
   Typography: [font pairing]
   Component inventory: [N] components defined

   ⚠️ All future frontend components MUST reference this design system.
   ⚠️ Do NOT use hardcoded hex colors or pixel values in components.
```

### 4. Generate UI/UX Spec

Create: `docs/UI_UX_SPEC.md`

Include:

**Page Map:**
```
/ (landing page)
/login
/signup
/(dashboard)
  /dashboard
  /[feature-1]
  /[feature-2]
  /settings
  /settings/profile
  /settings/team
/admin (if admin role exists)
  /admin/users
  /admin/audit-log
```

**For Each Page:**
- Page purpose
- Who can access it (role-aware)
- Key components (reference design system component names)
- Primary action
- States (loading, empty, error, success, permission-denied)
- Navigation connections
- Design system tokens used

**Navigation Structure:**
- Sidebar items (with role visibility)
- Top bar items
- Mobile navigation approach

**Component Hierarchy:**
- Top-level layout
- Page-level components
- Feature components
- Shared components

### 5. Generate API Spec
Create: `docs/API_SPEC.md`

All API endpoints with:
- Method + path
- Auth required
- Role required
- Request body schema
- Response schema
- Error responses

### 6. Approval Gate
```
✅ Design system generated at docs/DESIGN_SYSTEM.md
✅ CSS tokens written to src/styles/design-tokens.css
✅ UI/UX Spec created at docs/UI_UX_SPEC.md
✅ API Spec created at docs/API_SPEC.md

Industry: [identified industry]
Color palette: [brief description]
Typography: [heading font] + [body font]
The app will have [N] pages across [N] main sections.
[N] components in the component inventory.

Say "approve UI plan" to continue to project scaffold.
```

### 7. Update State
Mark UI/UX design as approved in `.antigravity/memory/task-plan.md` — Phase 4 ✅ Complete

---

## Output

- `docs/DESIGN_SYSTEM.md` — complete design system (NEW in v2.0)
- `src/styles/design-tokens.css` — CSS custom properties (NEW in v2.0)
- `docs/UI_UX_SPEC.md`
- `docs/API_SPEC.md`

---

## Design System Usage Protocol

After this workflow completes, the design system governs ALL frontend work:

1. **Every color** must come from a CSS token, not a hardcoded value
2. **Every spacing value** must use the 4px grid tokens
3. **Every component** must reference the component inventory
4. **Pre-delivery checklist** must be run before any component is marked complete

The pre-delivery checklist is in `docs/DESIGN_SYSTEM.md`. The frontend-engineer skill pre-delivery verification section will reference it.
