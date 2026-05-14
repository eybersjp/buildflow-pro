# BuildFlow Pro — Core Rules (Dense)

⚠️ READ THIS FILE INSTEAD OF INDIVIDUAL RULE FILES TO SAVE TOKENS

## 0. Development Modes

- **Production (Default):** All rules below are STRICTLY enforced. 9-Gate governance is mandatory.
- **Prototype:** Rules for TDD, 5-state components, and full documentation are RECOMMENDED but NOT ENFORCED. Speed is the priority.
- **Persistence:** Current mode is stored in `project-context.md`. Do not change unless user runs `/mode`.

## 1. Global & Governance

- **Think in Code:** Always format logic, plans, and output as code blocks (markdown, JSON, Mermaid). Do not use conversational fluff.
- **9-Gate Model:** Scope, Architecture, Security, DataIntegrity, APIContract, Performance, TestCoverage, Compliance, Release. All must pass before deploy.
- **No Autonomous Deploy:** You MUST get explicit human approval ("I approve this release") before production deployment.

## 2. The Karpathy Discipline

- **Think Before Coding:** State assumptions explicitly. Surface tradeoffs. Push back on complexity.
- **Simplicity First:** Minimum code. No speculation. No abstractions for single-use code.
- **Surgical Changes:** Touch only what you must. Match existing style. No scope creep in adjacent code.
- **Goal-Driven:** Transform tasks into verifiable goals. State success criteria for every step.

## 3. Coding Standards

- **Component States:** All frontend components MUST handle 5 states: Loading, Empty, Error, Success, Permission-Denied.
- **Error Handling:** Backend functions MUST use `Result<T, E>` and `ok()`/`err()`. NEVER `throw` in a service function.
- **Design System:** Use CSS custom properties (tokens) for all styling. NO hardcoded hex colors or pixels.
- **Size Limits:** No file > 300 lines. No function > 50 lines. Extract to sub-components/hooks.

## 3. Database & Security

- **Tenant Isolation:** Every query to a tenant-scoped table MUST include `.eq('tenant_id', tenantId)`.
- **Row Level Security (RLS):** RLS MUST be enabled on all tables.
- **Mutations:** All state-changing actions MUST write to the `audit_log`.
- **Secrets:** NEVER hardcode secrets. Use environment variables and validate them at startup with Zod.

## 4. Testing & Quality

- **TDD:** Write the test spec and failing test BEFORE implementation (Red-Green-Refactor).
- **Coverage:** Service layer MUST have >= 80% unit test coverage.
- **E2E:** All user journeys MUST have Playwright E2E coverage including error/empty paths.

## 5. API Contracts

- **No Breaking Changes:** Do not remove fields, change types, or delete endpoints in v1. Use `/api/v2/` for breaking changes.
- **Response Shape:** All APIs return `{ data, error, code }`. Internal DB errors must be masked as 500s.

## 6. Context & Memory Management

- **Keep it small:** Keep `task-plan.md` under 100 lines. Move completed tasks to `task-archive.md`.
- **Lazy Load:** Do NOT load full `SKILL.md` or `appendix/` rule files unless explicitly needed for deep context.
- **Update Logs:** After file writes, update `changelog.md` and `learned-patterns.md` concisely.
