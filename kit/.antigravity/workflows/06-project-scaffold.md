# Workflow: Project Scaffold
# BuildFlow Pro — Workflow 06

## Purpose

Set up the project repository, development environment, and core folder structure so the team can start building immediately.

## Trigger

- `/scaffold-project`
- "set up the project"
- "initialize the repo"
- Called from `00-start-production-app.md` after plan approval

---

## Pre-Conditions

- PRD, Architecture, Database, and UI plans all approved
- User has a GitHub account
- User has deployment target account (e.g., Vercel)

---

## ✋ GATE — Scaffold Approval

Before running any commands:

```
I'm ready to scaffold the project.

Here's what will be created:
- Next.js 14 app (App Router + TypeScript)
- Tailwind CSS + shadcn/ui configured
- Supabase client configured
- ESLint + Prettier configured
- Vitest configured for testing
- GitHub Actions CI workflow
- .env.example with all required variables

Directory: [current directory or specified path]

Approve? (yes/no)
```

**Do not run any commands until the user says yes.**

---

## Steps

### 1. Create Next.js App

Guide the user to run (do NOT auto-run):
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Install Core Dependencies

Guide the user to run:
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

### 3. Install shadcn/ui

Guide the user to run:
```bash
npx shadcn@latest init
```

### 4. Create Folder Structure

Create the following directories and placeholder files:
```
src/
  app/
    (auth)/
      login/
        page.tsx
      signup/
        page.tsx
    (dashboard)/
      dashboard/
        page.tsx
      layout.tsx
    api/
      health/
        route.ts
    layout.tsx
    page.tsx
  components/
    ui/          (shadcn components go here)
    layout/
      Sidebar.tsx
      TopBar.tsx
    shared/
      LoadingSpinner.tsx
      EmptyState.tsx
      ErrorState.tsx
  lib/
    supabase/
      client.ts
      server.ts
    validations/
    utils.ts
    env.ts
  services/
  types/
    index.d.ts
  hooks/
```

### 5. Create Core Config Files

Create `.env.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server only, never expose)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your App Name

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 6. Create GitHub Actions CI

Create `.github/workflows/ci.yml` with lint, typecheck, test, and build steps.

### 7. Verify Dev Server

Guide the user to run:
```bash
npm run dev
```

Verify: app loads at http://localhost:3000

### 8. Completion Report

```markdown
## Scaffold Complete

**Status:** ✅ Complete

**Dev Server:** http://localhost:3000

**Files Created:**
- [list key files]

**Next Steps:**
1. Copy .env.example to .env.local
2. Fill in your Supabase credentials
3. Run: /build-feature auth — to build authentication

**Current Phase:** Phase 5 complete → Starting Phase 6 (Auth)
```

Update `.antigravity/memory/project-state.md` — set phase to "Phase 6: Auth"
