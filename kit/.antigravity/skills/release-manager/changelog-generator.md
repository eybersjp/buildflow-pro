---
name: changelog-generator
description: Automatically generates a structured, human-readable changelog from git commits, pull requests, and completed task plan entries. Produces a changelog following Keep a Changelog format with semantic versioning. Activate as part of the release review workflow.
version: 1.0.0
triggers:
  - "generate changelog"
  - "write release notes"
  - "what changed in this release"
  - "update CHANGELOG.md"
  - /production-release
lifecycle: review
---

# Changelog Generator
# BuildFlow Pro — Release Intelligence Layer
# Source: awesome-claude-skills / changelog-generator pattern

## Overview

This skill automatically generates a structured changelog for each BuildFlow Pro release. It synthesises information from:
1. Git commit history (if available)
2. Completed task plan entries (`task-plan.md`)
3. Feature briefs from `docs/BUILD_ROADMAP.md`
4. Security audit report (`docs/SECURITY_AUDIT.md`)

The output follows the **Keep a Changelog** format (keepachangelog.com) and uses **Semantic Versioning** (semver.org).

---

## When to Activate

- Activate as part of the `11-release-review.md` workflow
- Activate before any production deployment
- Activate when the user says "generate changelog" or "write release notes"

---

## Semantic Version Determination

Before generating the changelog, determine the version bump:

| Type of Change | Version Bump | Example |
|---|---|---|
| Breaking API change, major feature set | Major (X.0.0) | 1.0.0 → 2.0.0 |
| New feature (backward compatible) | Minor (0.X.0) | 1.2.0 → 1.3.0 |
| Bug fix, security patch, dependency update | Patch (0.0.X) | 1.2.3 → 1.2.4 |

**Version bump decision protocol:**
1. If any APIContractGate flag was raised for a breaking change → **Major**
2. If any new user-facing feature was added → **Minor**
3. If only bugs, security patches, or internal improvements → **Patch**

---

## Changelog Section Categories

| Section | What Goes Here |
|---|---|
| `### Added` | New features, new pages, new API endpoints |
| `### Changed` | Updates to existing features, improved UX |
| `### Deprecated` | Features that will be removed in a future release |
| `### Removed` | Features, endpoints, or fields removed in this release |
| `### Fixed` | Bug fixes |
| `### Security` | Security patches, RLS changes, auth improvements |

---

## Generation Protocol

### Step 1 — Gather Inputs

```markdown
**Sources to read:**
1. `task-plan.md` → Completed This Phase + Completed Sessions
2. `docs/BUILD_ROADMAP.md` → Phase completion status
3. `docs/SECURITY_AUDIT.md` → Security findings and fixes
4. `.antigravity/memory/changelog.md` → Previous entries (avoid duplicates)
5. `.antigravity/memory/decisions.md` → Architectural changes
```

### Step 2 — Classify Changes

For each change found in the input sources, classify it:

```
[Feature: "User can now export projects as CSV"]     → Added
[Change: "Dashboard redesigned with new sidebar"]    → Changed
[Fix: "Fixed tenant isolation bug in project list"]  → Fixed
[Security: "RLS policy hardened for audit_log"]      → Security
[Remove: "Removed deprecated /api/v1/projects"]      → Removed
```

### Step 3 — Write Changelog Entry

```markdown
## [VERSION] — YYYY-MM-DD

### Added
- **Project Export** — Users can export their project list as CSV from the Projects page. [by: frontend-engineer + backend-engineer]
- **Dark Mode** — Full dark mode support added across all pages using system preference detection.
- **Audit Log Viewer** — Admins can now view the complete audit trail from the Mission Control page.

### Changed
- **Dashboard Performance** — Dashboard KPI queries reduced from 6 separate queries to 1 aggregated view, improving load time by 68%.
- **Project Status Filtering** — Filter dropdown now shows project counts per status for better at-a-glance visibility.

### Fixed
- **Tenant Isolation** — Fixed a bug where projects from another tenant were visible when using the search feature on accounts with specific email patterns.
- **Form Validation** — Fixed project name validation not triggering correctly when the field was left empty and submitted immediately.
- **Mobile Layout** — Fixed sidebar overflow on mobile screens narrower than 375px.

### Security
- **RLS Hardening** — Added explicit `deleted_at IS NULL` filter to all RLS policies to prevent soft-deleted records from being visible via direct API calls.
- **Rate Limiting** — Added rate limiting (10 req/min) to `/api/auth/sign-in` endpoint to prevent brute-force attacks.
- **CORS** — Tightened CORS policy to only allow requests from the production domain.

### Security — Governance Gates
| Gate | Result | Risk Score |
|---|---|---|
| ScopeGate | ✅ PASS | 8 |
| ArchitectureGate | ✅ PASS | 5 |
| SecurityGate | ✅ PASS | 22 |
| DataIntegrityGate | ✅ PASS | 15 |
| APIContractGate | ✅ PASS | 10 |
| PerformanceGate | ✅ PASS | 18 |
| TestCoverageGate | ✅ PASS | 12 |
| ComplianceGate | ✅ PASS | 8 |
| ReleaseGate | ✅ APPROVED | N/A |
```

### Step 4 — Update CHANGELOG.md

```markdown
# Changelog

All notable changes to this project are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

[Changes not yet released go here during development]

---

## [1.3.0] — 2026-05-08

[Generated content from Step 3]

---

## [1.2.1] — 2026-04-22

[Previous release content]

---

## [1.2.0] — 2026-04-10

[Previous release content]
```

### Step 5 — Update Memory Files

After writing the changelog, update:

```
.antigravity/memory/changelog.md     ← Project-internal changelog (dev-focused)
CHANGELOG.md                         ← Public-facing changelog (user-focused)
```

**Difference:**
- `CHANGELOG.md` (public): Focus on user-visible changes. Omit implementation details.
- `memory/changelog.md` (internal): Include technical details, file changes, ADR references.

---

## Git Commit Classification Rules

If git is available, classify commits by prefix:

| Commit Prefix | Changelog Section |
|---|---|
| `feat:` or `feature:` | Added |
| `fix:` or `bugfix:` | Fixed |
| `perf:` | Changed (with performance note) |
| `refactor:` | Changed |
| `security:` or `sec:` | Security |
| `chore:` | Omit (infrastructure, not user-visible) |
| `docs:` | Omit (unless docs are a user-facing feature) |
| `test:` | Omit |
| `breaking:` | Changed with ⚠️ BREAKING tag |

**Extracting from git:**
```bash
# Get commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges

# Get commits with author and date
git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h %s (%an, %ar)"
```

---

## Release Notes vs. Changelog

Generate two outputs per release:

### CHANGELOG.md (Technical — for developers)
- Every change, every fix, every security patch
- Governance gate scores
- File references where significant
- ADR references for architectural changes

### Release Notes (User-Facing — for end users)
```markdown
## What's New in v1.3.0

### New Features 🚀
- **Export Projects** — Download your projects as a spreadsheet
- **Dark Mode** — Switch between light and dark themes in Settings

### Improvements ✨
- Dashboard loads significantly faster
- Project filters now show record counts

### Bug Fixes 🐛
- Fixed search returning results from incorrect context
- Fixed form not showing validation message on first submit attempt
```

---

## Verification

Before marking this skill complete:

- [ ] Semantic version number has been determined using the version bump rules
- [ ] All changes in `task-plan.md` Completed sections have been classified
- [ ] Changelog entry has been written in Keep a Changelog format
- [ ] Governance gate summary table is included in the Security section
- [ ] CHANGELOG.md has been updated with the new version at the top
- [ ] `.antigravity/memory/changelog.md` has been updated with internal notes
- [ ] User-facing release notes have been produced separately (if public-facing app)
- [ ] Git tag command has been provided: `git tag v[VERSION]`

---

## Red Flags

- Changelog entry omits security fixes — security changes must always be documented
- Version number was not formally determined before writing the changelog
- Changes reference files that don't exist — changelog must reflect actual code changes
- "Unreleased" section still has items that were shipped in this release

---

## Anti-Rationalisations

- ❌ "The commit history is the changelog" — Raw git commits are not human-readable release notes.
- ❌ "We'll write the changelog next release" — A changelog written from memory 6 weeks later is inaccurate and incomplete.
- ❌ "Only major features go in the changelog" — Bug fixes, security patches, and performance improvements also belong in the changelog.
- ❌ "We don't need semantic versioning" — SemVer communicates intent (breaking vs. compatible) to API consumers. It is not optional for any API-exposed service.
