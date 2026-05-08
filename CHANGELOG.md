# Changelog

All notable changes to the BuildFlow Pro framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
