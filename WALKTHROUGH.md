# BuildFlow Pro: Start-to-Finish Walkthrough

This guide demonstrates how to build a production-grade application (a "Task Management SaaS" called **TaskFlow**) from scratch using BuildFlow Pro.

---

## 1. Installation & Setup

Start with an empty directory. Install BuildFlow Pro via npm:

```bash
mkdir TaskFlow && cd TaskFlow
npx buildflow-pro@latest init
```

This installs the full kit into `.antigravity/` and configures Antigravity session hooks
automatically. Open the project in Antigravity. The `SessionStart` hook fires, confirming
the framework is active.

**Verify the install:**

```bash
npx buildflow-pro --version
# buildflow-pro v1.3.0
```

---

## 2. Choose Your Mode

BuildFlow Pro supports two modes:

- **🏆 Production (default):** Full 9-Gate governance, TDD, mandatory docs. For real apps.
- **🚀 Prototype:** Skips heavy planning, relaxed rules. For hackathons and proofs-of-concept.

To switch modes at any time:

```
/mode prototype
/mode production
```

For this walkthrough we use **Production mode**.

---

## 3. Initiation (`/start-production-app`)

You type:

> `/start-production-app`

The agent activates the **Product Manager** skill and asks you 12 discovery questions.

You provide your answers:

> 1. App name: TaskFlow
> 2. Purpose: Simple task management for remote teams
> 3. Users: Managers and team members
> 4. Tech stack: Next.js, Supabase, Tailwind (Defaults)
> 5. Must-haves: Auth, Task CRUD, Team Dashboard
> ...

The agent generates the foundation documents:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md` (and initial `architecture-graph.md`)
- `docs/DATABASE_SPEC.md`
- `docs/DESIGN_SYSTEM.md` (Industry colors, typography, UX rules)
- `docs/UI_UX_SPEC.md`
- `docs/API_SPEC.md`
- `docs/BUILD_ROADMAP.md`

You review the documents and type:
> `APPROVE`

---

## 4. Project Scaffold & Dev Tooling

The agent automatically proceeds to Phase 5. It runs:

1. Next.js initialization (`npx create-next-app@latest`)
2. Dev Tooling Setup (`skills/devops-engineer/dev-tooling-setup.md`)

The agent configures strict TypeScript, ESLint (with type-aware rules), Prettier, and Husky pre-commit hooks. It runs `npm run test:all` to ensure the scaffold is green.

---

## 5. Building the Database & Auth

You type:
> `/build-feature authentication and user tables`

**Database Engineer** activates:

1. Writes `database/migrations/001_users_and_auth.sql` using Safe Query Patterns.
2. Implements Row Level Security (RLS) to ensure users only see their own tenant's data.

**Backend Engineer** activates:

1. Writes the auth service functions using the `Result<T>` pattern.
2. Adds structured `logger.error()` for any backend failures.

**Frontend Engineer** activates:

1. Uses `docs/DESIGN_SYSTEM.md` to style the Login and Signup pages.
2. Ensures all 5 UI states (Loading, Empty, Error, Success, Denied) are covered.

---

## 6. Building the Core Feature (Task CRUD)

You type:
> `/build-feature Task Management Dashboard`

**QA Engineer** (TDD Loop) activates first:

1. Writes the Test Specification table.
2. Writes failing unit tests for `task.service.ts` and failing E2E Playwright tests for the dashboard.

**Backend Engineer** activates:

1. Implements `createTask`, `listTasks`, etc., using Zod validation.
2. Returns `ok(data)` or `err(new ValidationError(...))`. The tests go **Green**.

**Frontend Engineer** activates:

1. Chooses the `DataTable` pattern from `component-patterns.md`.
2. Implements the Dashboard page with `data-testid` attributes.
3. Connects the UI to the API routes.

---

## 7. Code Review & Security Audit

Before deployment, you type:
> `/security-audit`

The **Security Engineer** evaluates all 9 Governance Gates:

- ✅ **ScopeGate:** Matches PRD.
- ✅ **ArchitectureGate:** Invariants respected.
- ✅ **SecurityGate:** RLS is active; no secrets in code.
- ✅ **TestCoverageGate:** Service layer is at 85% coverage; E2E tests pass.
- ✅ **PerformanceGate:** Lighthouse / query times are within limits.

---

## 8. Deployment & Release

You type:
> `/deploy-preview`

The **DevOps Engineer** pushes the code to Vercel (Staging) and runs DB migrations against the staging database. You verify the staging URL.

You type:
> `/production-release`

The **Release Manager** activates:

1. Generates `CHANGELOG.md` (e.g., v1.0.0).
2. Presents the GO / NO-GO decision.

You type:
> `I approve this release`

The agent tags the git commit `v1.0.0`, updates `docs/BUILD_ROADMAP.md`, and the app goes live. You have successfully shipped a production-grade app using BuildFlow Pro!
