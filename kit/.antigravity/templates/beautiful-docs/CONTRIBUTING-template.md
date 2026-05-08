# Contributing to [Project Name]

Thank you for taking the time to contribute. This guide explains everything you need to know to make a contribution that will be reviewed, accepted, and merged efficiently.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Commit Message Format](#commit-message-format)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Architecture Decisions](#architecture-decisions)
- [Security Issues](#security-issues)

---

## Code of Conduct

Be respectful and professional. All contributions are subject to this project's Code of Conduct. Maintainers reserve the right to remove contributions that violate these standards.

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/[repo].git
cd [repo]
git remote add upstream https://github.com/[org]/[repo].git
```

### 2. Install

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env.local
# Fill in values — see README.md for descriptions
```

### 4. Verify Setup

```bash
npm run test:all
# All checks must pass before you start coding
```

---

## Development Workflow

1. **Sync with upstream** before starting any work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feat/my-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Develop** following the [code standards](#code-standards) below.

4. **Run quality checks** before committing:
   ```bash
   npm run test:all   # Must all pass
   ```

5. **Commit** using the [commit message format](#commit-message-format).

6. **Push and open a PR.**

---

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/). This is enforced by commitlint pre-commit hook.

**Format:**
```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `security` | A security fix or improvement |
| `perf` | A performance improvement |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation-only changes |
| `chore` | Maintenance tasks, dependency updates |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |

**Examples:**
```
feat(projects): add CSV export for project list
fix(auth): resolve session not persisting after page refresh
security(rls): harden audit_log RLS to prevent cross-tenant reads
perf(dashboard): replace 6 KPI queries with single aggregated view
docs(api): add missing response schema for POST /api/projects
```

**Breaking changes:**
```
feat(api)!: change project response shape to include nested members

BREAKING CHANGE: The `members` field is now an array of objects
instead of an array of strings. Update all consumers of GET /api/projects.
```

---

## Code Standards

All code must comply with the project's coding rules. The key constraints:

### TypeScript
- No `any` types — use `unknown` and narrow it
- No non-null assertions (`!`) without a comment explaining why it's safe
- Use `type` imports for type-only imports
- All service functions must return `Result<T>` (never throw)

### React / Next.js
- Server components fetch data; client components handle interaction
- Every interactive element has a `data-testid` attribute
- No component exceeds 200 lines
- All five UI states must be handled: loading, empty, error, success, permission-denied

### Service Layer
- All service functions validate input with Zod before any database access
- All service functions authorize the user before any database access
- All mutations write an audit log entry
- All database errors are caught and wrapped in `DatabaseError`

### Database
- Every query includes `.eq('tenant_id', tenantId)` for tenant-scoped tables
- Every list query includes `.limit(n)`
- Never use `select('*')` — name columns explicitly

---

## Testing Requirements

Every code change requires tests. The thresholds are enforced in CI:

### Unit Tests (Vitest)

- All new service functions must have unit tests
- Coverage ≥ 80% on all service files
- Tests must cover: happy path, validation errors, auth errors, tenant isolation, DB errors

### End-to-End Tests (Playwright)

- All new user-facing features must have an E2E test
- E2E tests must cover: happy path, empty state, error state, permission-denied

**Running tests:**
```bash
npm run test              # Unit tests
npm run test:coverage     # Unit tests + coverage report
npm run test:e2e          # E2E tests (requires running dev server)
npm run test:all          # All checks
```

---

## Pull Request Process

### Before Opening a PR

Verify ALL of the following:
- [ ] `npm run test:all` passes
- [ ] Feature is covered by unit tests (service layer ≥ 80% coverage)
- [ ] Feature is covered by E2E tests (happy path + error states)
- [ ] No secrets or environment values in code
- [ ] `.env.example` updated if new variables were added

### PR Title Format

Use the same format as commit messages:
```
feat(projects): add CSV export
fix(auth): resolve session persistence on iOS Safari
```

### PR Description Template

```markdown
## What

[What was changed or added?]

## Why

[Why was this change needed?]

## How

[Brief description of the approach taken]

## Tests

- Unit tests: [describe what was tested]
- E2E tests: [describe what was tested]

## Screenshots (if UI change)

[Before] [After]

## Checklist

- [ ] `npm run test:all` passes
- [ ] Unit tests added / updated
- [ ] E2E tests added / updated
- [ ] No `any` types introduced
- [ ] All five UI states handled (if frontend change)
- [ ] Tenant isolation maintained (if database change)
```

### Review Process

1. A maintainer will review within 2 business days
2. All review comments must be addressed or responded to
3. Do not merge your own PRs
4. Squash merge is preferred for feature branches

---

## Architecture Decisions

If your change involves a significant architectural decision (new dependency, new pattern, changed service boundary), you must:

1. Read the existing Architecture Decision Records in `docs/ADR/`
2. Write a new ADR in `docs/ADR/NNN-your-decision.md`
3. Include the ADR in your PR

Use the ADR template at `.antigravity/skills/software-architect/templates/adr-template.md`.

---

## Security Issues

**Do NOT open a public issue for security vulnerabilities.**

Report security issues directly to: `[security@yourdomain.com]`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested remediation

Maintainers will acknowledge within 24 hours and provide a fix timeline within 72 hours.

---

## Questions

- Open a [Discussion](https://github.com/[org]/[repo]/discussions) for general questions
- Open an [Issue](https://github.com/[org]/[repo]/issues) for bug reports
- Do NOT open issues for support questions

---

*Thank you for contributing to [Project Name].*
