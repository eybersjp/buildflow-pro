# Workflow: Start Production App

BuildFlow Pro — Workflow 00

## Purpose

Guide the user from a raw app idea to a production-ready build plan, with all documentation generated and phases approved before a single line of application code is written.

## Trigger

Run this workflow when the user says:

- `/start-production-app`
- "start production app"
- "build a new app"
- "build a SaaS"
- "I have an app idea"
- "build from scratch"
- "new project"

---

## Activation Message

Display this when the workflow starts:

```text
╔═══════════════════════════════════════════════════════╗
║          BuildFlow Pro — Production App Builder       ║
║                                                       ║
║  I will guide you from idea to deployed application.  ║
║  We will plan before we build. Every step of the way. ║
╚═══════════════════════════════════════════════════════╝

Welcome. Let's build something great.

---

## Step 0: Mode Selection

Before we start, choose your development mode:

1. **🏆 Production (Recommended):** Full documentation, 9-gate governance, TDD, and strict architecture specs. Use for real apps.
2. **🚀 Prototype:** Minimal documentation, skipped governance gates, fast scaffolding. Use for hackathons and proofs-of-concept.

**If user chooses Prototype:** Immediately switch to Workflow `00-prototype-build.md`.

---

## Step 1: Product Intake

**Activate:** `product-manager` skill

Ask the user the following questions. Allow them to answer all at once or one at a time:

```text
I need to understand your app idea. Please answer as many of these as you can:

1. What is the name of your app?
2. What does it do? (1-2 sentences)
3. Who uses it? (e.g., "solar installers", "small businesses", "teachers")
4. What is the main problem it solves?
5. What platform? Web app / Mobile / Desktop / API only
6. Do you have a preferred tech stack, or should I suggest one?
7. What are the 3-5 must-have features for the first version?
8. What should NOT be in version 1? (helps prevent overbuilding)
9. Where should it be deployed? (e.g., Vercel, AWS, self-hosted)
10. Does it need authentication? (signup/login)
11. Does it need payments? (Stripe, etc.)
12. Does it need multi-tenant support? (multiple companies sharing the app)

If unsure about any question, just say "guide me" for that one.
```

**If the user says "guide me":** Suggest the default stack and a reasonable MVP scope, clearly marking each suggestion as `[DEFAULT]`.

---

## Step 2: Suggest Defaults (if needed)

If the user is unsure about the tech stack, suggest:

```text
Based on your requirements, here are my recommended defaults:

[DEFAULT] Frontend:  Next.js + TypeScript
[DEFAULT] UI:        Tailwind CSS + shadcn/ui
[DEFAULT] Database:  Supabase PostgreSQL (with RLS)
[DEFAULT] Auth:      Supabase Auth
[DEFAULT] Storage:   Supabase Storage
[DEFAULT] Hosting:   Vercel
[DEFAULT] CI/CD:     GitHub Actions
[DEFAULT] Monitoring: Sentry + PostHog

These are battle-tested defaults for SaaS web apps.
You can change any of these — just say so.
```

---

## Step 3: Generate Product Brief

**Activate:** `product-manager` skill

From the intake answers, produce:

- Product summary (1 paragraph)
- Problem statement
- Target users
- User roles
- MVP feature list (IN scope)
- Out-of-scope items (explicitly excluded)
- Core user journeys
- Risks and assumptions

Display this to the user for review.

---

## Step 4: Generate PRD

**Activate:** `product-manager` skill

Create: `docs/PRD.md`

Use template: `.antigravity/skills/product-manager/templates/prd-template.md`

Notify the user:

```text
✅ PRD created at docs/PRD.md
Please review it before we continue.
```

---

## Step 5: Generate Architecture

**Activate:** `software-architect` skill

Create:

- `docs/ARCHITECTURE.md`
- `docs/ADR/0001-architecture-choice.md`

Include:

- System context diagram (Mermaid)
- Tech stack with justification
- Frontend architecture
- Backend architecture
- Database overview
- Auth flow
- Deployment model

Notify the user:

```text
✅ Architecture created at docs/ARCHITECTURE.md
```

---

## Step 6: Generate Database Plan

**Activate:** `database-engineer` skill

Create:

- `docs/DATABASE_SPEC.md`
- `database/migrations/001_initial_schema.sql`

Include:

- Entity relationship diagram (Mermaid)
- Table definitions
- RLS policies
- Index strategy
- Rollback plan

Notify the user:

```text
✅ Database spec created at docs/DATABASE_SPEC.md
✅ Initial migration at database/migrations/001_initial_schema.sql
```

---

## Step 7: Generate UI/UX Plan

**Activate:** `frontend-engineer` skill + `ui-design-system.md` sub-skill

Create:

- `docs/DESIGN_SYSTEM.md` — complete design system (colors, typography, spacing, component inventory, UX rules, anti-patterns)
- `src/styles/design-tokens.css` — CSS custom properties for all design tokens
- `docs/UI_UX_SPEC.md` — page map, navigation structure, and component hierarchy

The design system is generated first using the industry reasoning engine (8-industry pattern library). No frontend component is built without it.

---

## Step 8: Generate API Spec

**Activate:** `backend-engineer` skill

Create: `docs/API_SPEC.md`

Include:

- All API endpoints or server actions
- Request/response schemas
- Authorization rules per endpoint

---

## Step 9: Generate Build Roadmap

Create: `docs/BUILD_ROADMAP.md`

The roadmap must include these phases:

| Phase | Name | Goal |
| :--- | :--- | :--- |
| 0 | Discovery | App idea defined ✅ |
| 1 | PRD | Requirements documented ✅ |
| 2 | Architecture | Tech decisions made ✅ |
| 3 | Database | Schema designed ✅ |
| 4 | UI/UX Plan | Pages and flows planned ✅ |
| 5 | Project Scaffold | Repo set up, dev server running |
| 6 | Auth | Login, signup, roles working |
| 7 | Core Feature 1 | [First MVP feature] |
| 8 | Core Feature 2 | [Second MVP feature] |
| 9 | Core Feature 3 | [Third MVP feature] |
| 10 | Testing | Full test coverage |
| 11 | Security Audit | Security review complete |
| 12 | Preview Deploy | Staging deploy verified |
| 13 | Production Release | App is live |
| 14 | Monitoring | Error tracking active |

---

## Step 10: ✋ APPROVAL GATE

**Do not write any application code until the user approves.**

Display:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ✋ APPROVAL REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I've generated your complete production plan:

  📄 docs/PRD.md               — Product requirements
  🏗️  docs/ARCHITECTURE.md      — Technical architecture
  🗄️  docs/DATABASE_SPEC.md     — Database schema
  🎨 docs/UI_UX_SPEC.md        — UI/UX plan
  📡 docs/API_SPEC.md          — API design
  🗺️  docs/BUILD_ROADMAP.md     — Phase-by-phase plan

Please review these documents.

Then choose one:

  1. ✅ APPROVE — Start building Phase 5 (Project Scaffold)
  2. ✏️  EDIT    — I want to change something in the plan
  3. 🔄 REPLAN  — Start discovery again with different answers
  4. 📉 REDUCE  — Scope is too large, help me cut it down
```

---

## Step 11: Start Phase 5 (after approval)

After the user approves, run in sequence:

1. Workflow: `06-project-scaffold.md`
2. Skill: `.antigravity/skills/devops-engineer/dev-tooling-setup.md` — configure ESLint, Prettier, TypeScript strict, Husky, VSCode settings

Update:

- `.antigravity/memory/project-state.md` — set phase to "Phase 5: Scaffold"
- `.antigravity/memory/project-context.md` — fill in app details
- `.antigravity/memory/architecture-graph.md` — initialize from ARCHITECTURE.md

---

## Completion Artifacts

At the end of this workflow, the following must exist:

- [ ] `docs/PRD.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/ARCHITECTURE_DIAGRAM.md` (run `/visualize-architecture`)
- [ ] `docs/DATABASE_SPEC.md`
- [ ] `docs/DESIGN_SYSTEM.md` (generated by ui-design-system.md skill)
- [ ] `src/styles/design-tokens.css` (CSS custom properties)
- [ ] `docs/UI_UX_SPEC.md`
- [ ] `docs/API_SPEC.md`
- [ ] `docs/BUILD_ROADMAP.md`
- [ ] `docs/ADR/0001-architecture-choice.md`
- [ ] `database/migrations/001_initial_schema.sql`
- [ ] `.antigravity/memory/project-context.md` (updated)
- [ ] `.antigravity/memory/project-state.md` (updated)
- [ ] `.antigravity/memory/architecture-graph.md` (populated)
- [ ] `.antigravity/memory/task-plan.md` (initialized by `/plan`)
