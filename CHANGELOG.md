# Changelog

All notable changes to the BuildFlow Pro framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-05-13

### Added

- **Demo Project:** Full `examples/todo-saas/` example showing complete BuildFlow Pro output:
  - `docs/PRD.md` — Full product requirements with user journeys and acceptance criteria
  - `docs/ARCHITECTURE.md` — C4 context diagram, Mermaid flow diagrams, ADR index
  - `docs/DATABASE_SPEC.md` — ERD, RLS policies, index strategy, rollback plan
  - `docs/DESIGN_SYSTEM.md` — Color palette, typography, component inventory, motion rules
  - `docs/API_SPEC.md` — All endpoints, auth matrix, error codes, contract rules
  - `docs/BUILD_ROADMAP.md` — Mid-project state with gates cleared and active tasks
  - `.antigravity/memory/project-context.md` — Realistic populated context file
  - `.antigravity/memory/task-plan.md` — Realistic mid-Phase 6 task state
- **`SUPPORT.md`:** Support escalation paths, known limitations, contributing links.

## [1.3.0] - 2026-05-13

### Added

- **CLI Hardening:** Added `--version` / `-v` and `--help` / `-h` flags to the CLI.
- **Upgrade Command:** `npx buildflow-pro upgrade` updates kit files without overwriting user-owned memory.
- **Unknown Command Guard:** CLI now exits with code 1 and a clear error message for unknown commands.
- **`/generate-docs` Command:** Created missing command file that backs the `/generate-docs` workflow in the README.
- **Security Templates:** Added `threat-model.md` and `security-audit-report.md` to `security-engineer/templates/`.
- **`task-archive.md`:** Added missing memory file referenced by `core-rules-dense.md` Rule 6.
- **`SECURITY.md`:** Vulnerability disclosure policy for the framework repository.
- **GitHub Actions CI:** `.github/workflows/ci.yml` — auto-runs tests on push/PR across Node 18/20/22.
- **`docs/CLIENT_ONBOARDING.md`:** Step-by-step onboarding checklist for first clients.
- **WALKTHROUGH.md update:** Added Prototype Mode section and corrected install instructions to use `npx`.

### Fixed

- CLI version string now reads from `package.json` — no more manual version sync.
- `init` banner now displays current version dynamically.

### Tests

- Expanded test suite from 2 to **11 tests** (100% pass).
- Added coverage for: `--version`, `--help`, `upgrade`, idempotent `init`, `BUILD_ROADMAP.md` preservation, unknown command exit code.

## [1.2.1] - 2026-05-08

### Fixed
- **Documentation Polish:** Fixed 100+ markdown linting warnings across the repository (MD009, MD012, MD022, MD025, MD026, MD030, MD031, MD032, MD033, MD040, MD041, MD058, MD060).
- Standardized list marker spacing and blank line requirements in all kit workflows and rules.
- Replaced inline HTML with standard markdown in README for better linter compatibility.

## [1.2.0] - 2026-05-08

### Added
- **Speed & Scale Update:** Added **Prototype Mode** for rapid prototyping (hackathon mode).
- `/mode [production|prototype]` command to toggle governance strictness.
- Specialized `00-prototype-build.md` workflow.
- Updated `project-context.md` to persist development mode.

## [1.1.0] - 2026-05-08

### Added
- **Token Diet Update:** Minified 6 core rule files into a single `core-rules-dense.md`.
- Reduced context usage by ~90% for governance-heavy sessions.
- Added support for "Dense Rules" in the initialization CLI.

## [1.0.3] - 2026-05-08

### Added
- **Public NPM Package:** Published the `buildflow-pro` package to the NPM registry.
- `npx buildflow-pro init` CLI command to easily bootstrap the framework into any repository.

### Fixed
- Fixed CLI shebang missing issue causing NPM to strip the executable binary.
- Fixed line-ending (CRLF to LF) compatibility for the CLI tool on Windows.

## [1.0.0] - 2026-05-08

### Added
- **Phase 3 Completion:** The framework is now fully polished for production.
- `dev-tooling-setup.md` skill for ESLint, Prettier, TypeScript strict mode, and Husky configuration.
- `component-patterns.md` detailing 6 advanced React component patterns.
- `error-handling-patterns.md` for backend `Result<T,E>` and AppError structures.
- `/context-mode` command for managing LLM context exhaustion.
- `/visualize-architecture` command generating Mermaid dependency maps.
- Beautiful Docs templates: `README-template.md`, `CONTRIBUTING-template.md`, and `API-docs-template.md`.
- `debug-log.md` added to the persistent memory layer for tracking complex debugging sessions.

## [0.2.0] - 2026-05-07

### Added
- **Phase 2 Completion:** Intelligence and Automation layer active.
- Automated UI/UX design system generator based on an 8-industry token mapping.
- Red/Green/Refactor Test-Driven Development (TDD) workflow enforced for backend code.
- Playwright End-to-End (E2E) testing skill template.
- Multi-agent orchestration rules for complex domain builds (`great_cto` pattern).
- Semantic versioning and changelog generator.

## [0.1.0] - 2026-05-06

### Added
- **Phase 1 Completion:** Core framework and governance gates.
- 10 Specialized AI Roles including Product Manager, Architect, and Release Manager.
- 15 step-by-step sequential workflows guiding the build from idea to production.
- 6 immutable rule files enforcing the 9-Gate Governance Model.
- Persistent memory layer (`task-plan.md`, `project-context.md`) to survive context window limits.
