# [Project Name]

> [One-line description of what the product does and who it is for.]

[![CI](https://github.com/[org]/[repo]/actions/workflows/ci.yml/badge.svg)](https://github.com/[org]/[repo]/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/[org]/[repo]/branch/main/graph/badge.svg)](https://codecov.io/gh/[org]/[repo])
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

[2-3 sentences. What does this project do? What problem does it solve? Who is it for? Be direct and concrete.]

### Key Features

- ✅ **[Feature 1]** — [One sentence explanation of the value it delivers]
- ✅ **[Feature 2]** — [One sentence explanation]
- ✅ **[Feature 3]** — [One sentence explanation]
- ✅ **[Feature 4]** — [One sentence explanation]

---

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| Node.js | 20.x | LTS recommended |
| npm | 10.x | Comes with Node.js |
| Git | 2.x | — |
| [Database] | [version] | [setup note] |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/[org]/[repo].git
cd [repo]

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up the database
npm run db:migrate

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Environment Variables

All required environment variables are listed in `.env.example`. The app validates them at startup.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Application URL (e.g., http://localhost:3000) |
| `SENTRY_DSN` | ⬜ | Sentry error monitoring DSN |

> ⚠️ Never commit `.env.local` or any file containing real values to source control.

---

## Project Structure

```
src/
  app/                    # Next.js App Router
    (auth)/               # Auth routes (login, signup)
    (dashboard)/          # Protected routes (require auth)
    api/                  # API routes
  components/             # Shared UI components
    ui/                   # Design system primitives
    layout/               # Layout components (Sidebar, Header)
    [feature]/            # Feature-specific components
  services/               # Business logic + data access
    *.service.ts          # Service functions (return Result<T>)
    __tests__/            # Unit tests for services
  lib/
    supabase/             # Supabase client instances
    auth/                 # Auth utilities
    errors.ts             # Typed error classes
    result.ts             # Result<T,E> type
    logger.ts             # Structured logger
  types/                  # TypeScript type definitions
  styles/
    design-tokens.css     # Design system CSS custom properties

database/
  migrations/             # SQL migration files
  rollback/               # SQL rollback scripts
  seeds/                  # Seed data for development

tests/
  e2e/                    # Playwright end-to-end tests
    fixtures/             # Auth fixtures
    helpers/              # Test utilities
    [feature].spec.ts     # Feature test suites

docs/
  PRD.md                  # Product Requirements Document
  ARCHITECTURE.md         # Technical architecture
  DESIGN_SYSTEM.md        # UI design system
  API_SPEC.md             # API contract
  SECURITY_AUDIT.md       # Security audit report
  ADR/                    # Architecture Decision Records
```

---

## Development

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (0 warnings allowed) |
| `npm run typecheck` | Run TypeScript type check |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:all` | Run typecheck + lint + test + e2e |
| `npm run db:migrate` | Apply pending database migrations |

### Quality Gates

All code must pass these checks before merging:

```bash
npm run test:all
# Must produce:
# ✓ typecheck  — 0 errors
# ✓ lint       — 0 errors, 0 warnings
# ✓ test       — all passing, ≥80% coverage on services
# ✓ e2e        — all passing
```

---

## Database

Migrations are in `database/migrations/`. Every migration has a corresponding rollback in `database/rollback/`.

**Applying migrations:**
```bash
# Review the migration first
cat database/migrations/[NNN]_[name].sql

# Apply to your Supabase project
npx supabase db push
# or
npx supabase migration up
```

**Never:**
- Modify a migration that has been applied to production
- Run migrations directly on production without staging validation
- Skip the rollback script review

---

## Testing

### Unit Tests

Unit tests cover service functions and validation schemas. Located in `src/services/__tests__/`.

```bash
npm run test                    # Run all unit tests
npm run test:coverage           # With coverage report
npm run test -- --reporter=verbose  # Verbose output
```

Coverage requirements:
- Service layer: ≥ 80%
- Validation schemas: ≥ 90%

### End-to-End Tests

E2E tests use Playwright. Located in `tests/e2e/`.

```bash
npm run test:e2e                # Headless
npm run test:e2e:ui             # With Playwright UI
npm run test:e2e:debug          # Debug mode
```

E2E tests require a running dev server and test environment variables (see `.env.test.example`).

---

## Architecture

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15 + TypeScript | App Router, Server Components |
| UI | Custom design system | CSS custom properties (no Tailwind defaults) |
| Database | Supabase PostgreSQL | Row Level Security on all tenant tables |
| Auth | Supabase Auth + SSR | Cookie-based sessions via @supabase/ssr |
| Hosting | Vercel | Edge runtime for middleware |
| Error Tracking | Sentry | Non-operational errors trigger alerts |
| Analytics | PostHog | Privacy-compliant event tracking |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architecture documentation.

Architecture diagrams: [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)

---

## Security

- All database queries are tenant-scoped and protected by Row Level Security
- No secrets are stored in source code
- All API routes validate the authenticated user server-side
- CORS is restricted to the application domain in production

Report security vulnerabilities to: [security@yourdomain.com] — do not open public issues for security bugs.

See [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) for the most recent security audit.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow
- Commit message format
- Code review process
- How to add new features

---

## License

[MIT](LICENSE) — [Year] [Organization Name]

---

*Built with [BuildFlow Pro](https://github.com/[your-org]/buildflow-pro) — Production discipline for AI-assisted development.*
