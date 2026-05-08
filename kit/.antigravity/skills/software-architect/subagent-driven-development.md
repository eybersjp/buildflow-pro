---
name: subagent-driven-development
description: A multi-agent orchestration pattern for BuildFlow Pro that coordinates specialized subagents (PM, Architect, DB, Frontend, Backend, QA, Security, Release) in parallel and sequential workflows. Based on the great_cto 7-subagent model and everything-claude-code orchestration patterns. Activate for complex features requiring multiple skill domains simultaneously.
version: 1.0.0
triggers:
  - "orchestrate subagents"
  - "multi-agent build"
  - "parallel development"
  - "complex feature"
  - "coordinate agents"
lifecycle: build
---

# Subagent-Driven Development
# BuildFlow Pro — Orchestration Intelligence Layer
# Source: awesome-claude-skills / subagent-driven-development + great_cto pattern

## Overview

Subagent-Driven Development (SDD) is a build pattern where a **Coordinator Agent** breaks a large feature into parallel workstreams, assigns each workstream to a specialized subagent, and then integrates the results.

This is distinct from sequential skill activation (where one skill runs at a time). In SDD, multiple skills run concurrently on independent workstreams, and the coordinator stitches the outputs together.

---

## When to Use Subagent-Driven Development

**Use SDD when all of the following are true:**
- The feature touches more than 2 skill domains simultaneously
- The workstreams are clearly independent (frontend design can happen while backend schema is designed)
- The total build time would benefit from parallelism
- The coordinator agent has enough context to specify clear, isolated tasks for each subagent

**Do NOT use SDD when:**
- Workstreams are sequential and dependent (auth must exist before the feature that uses auth)
- The feature is small enough for one skill to own end-to-end
- Subagent outputs need to be deeply integrated before any of them can be validated

---

## The Coordinator + Subagent Model

### Roles

| Role | Responsibility |
|---|---|
| **Coordinator** | Decomposes the feature, assigns tasks, integrates outputs, resolves conflicts |
| **PM Subagent** | Writes acceptance criteria and user stories |
| **Architect Subagent** | Defines the technical design, API contract, and ADR |
| **DB Subagent** | Designs schema, writes migrations and RLS policies |
| **Frontend Subagent** | Builds page, components, forms, and state handlers |
| **Backend Subagent** | Builds service functions, API routes, validation, auth |
| **QA Subagent** | Writes test plan, unit tests, integration tests, E2E tests |
| **Security Subagent** | Reviews all governance gates and issues security report |
| **Release Subagent** | Compiles the release report and manages the ReleaseGate |

---

## SDD Workflow

### Phase 0 — Coordinator: Task Decomposition

The coordinator reads `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `task-plan.md`, then produces a **Task Decomposition Document**:

```markdown
## Task Decomposition: [Feature Name]

**Feature:** [Name]
**Complexity:** High / Multi-domain
**Subagent Strategy:** Parallel across [N] workstreams

### Workstream A — Data Layer (DB Subagent)
**Task:** Design the [feature_name] table schema
**Input:** [list of required columns from PRD]
**Output:** Migration file at `database/migrations/NNN_feature.sql`
**Dependency:** None — can run immediately
**Estimated tokens:** Medium

### Workstream B — Backend (Backend Subagent)
**Task:** Implement `create[Feature]` and `list[Feature]` service functions
**Input:** Schema from Workstream A (waits for A to complete)
**Output:** `src/services/feature.service.ts`, `src/app/api/feature/route.ts`
**Dependency:** Workstream A (needs schema)
**Estimated tokens:** High

### Workstream C — Frontend (Frontend Subagent)
**Task:** Build `FeaturePage`, `FeatureCard`, `CreateFeatureModal`
**Input:** Wireframe from PRD, API contract from Workstream B
**Output:** `src/app/(dashboard)/feature/page.tsx`, components
**Dependency:** Workstream B (needs API contract)
**Estimated tokens:** High

### Workstream D — Tests (QA Subagent)
**Task:** Write unit tests for Workstream B, E2E tests for Workstream C
**Input:** Service functions from B, page components from C
**Output:** `src/services/__tests__/feature.service.test.ts`, `tests/e2e/feature.spec.ts`
**Dependency:** Workstreams B + C
**Estimated tokens:** Medium

### Integration Checkpoint
When all workstreams complete:
- Coordinator reviews all outputs for consistency
- Runs full test suite
- Resolves any API contract mismatches between B and C
- Activates Security Subagent for governance gate review
```

### Phase 1 — Parallel Execution (Independent Workstreams)

The coordinator activates independent workstreams simultaneously. In Antigravity, this means:
- Using multiple tool calls in the same turn for independent file writes
- Clearly scoping each write to the files owned by that workstream

**Parallelism rules:**
- A subagent may only write files in its assigned scope
- A subagent must signal completion before the next dependent workstream begins
- If a subagent produces output that conflicts with another, the coordinator resolves the conflict before integration

### Phase 2 — Sequential Execution (Dependent Workstreams)

After parallel workstreams complete, execute dependent workstreams in order:

```
Workstream A (DB) ─────────────────────────────────┐
                                                    ▼
Workstream B (Backend) ── waits for A ─────────────┐
                                                    ▼
Workstream C (Frontend) ── waits for B ────────────┐
                                                    ▼
Workstream D (Tests) ── waits for B + C ───────────┐
                                                    ▼
                         Security Review ───────────┤
                                                    ▼
                         Release Report + Gate ─────┘
```

### Phase 3 — Integration & Verification

After all workstreams complete, the coordinator:

1. **Cross-references** — confirms the API route from Backend matches what the Frontend is calling
2. **Type-checks** — runs `tsc --noEmit` to confirm types are consistent
3. **Tests** — runs `npm run test` to confirm all unit tests pass
4. **Reviews** — activates Security Subagent with all output files as context
5. **Documents** — updates `task-plan.md` with the feature as complete
6. **Reports** — produces the Feature Complete report

---

## Great CTO Orchestration Pattern (7-Subagent Reference)

The `great_cto` pattern from the community provides a battle-tested 7-subagent coordination model:

```markdown
## CTO Orchestration Session — [Feature]

**Directive:** Build [feature] to production standards.

**Subagent 1 — Requirements Lead (PM)**
Produce: Acceptance criteria, edge cases, risks
Scope: `docs/PRD.md` update

**Subagent 2 — Architecture Lead**
Produce: Technical design, API contract, ADR
Scope: `docs/ARCHITECTURE.md`, `docs/ADR/NNN.md`

**Subagent 3 — Database Lead**
Produce: Schema, migration, RLS, indexes
Scope: `database/migrations/`

**Subagent 4 — Backend Lead**
Produce: Service, API route, validation
Scope: `src/services/`, `src/app/api/`

**Subagent 5 — Frontend Lead**
Produce: Page, components, forms
Scope: `src/app/(dashboard)/`, `src/components/`

**Subagent 6 — QA Lead**
Produce: Test plan, unit tests, E2E tests
Scope: `src/services/__tests__/`, `tests/e2e/`

**Subagent 7 — Security + Release Lead**
Produce: Security audit, governance gate scores, release report
Scope: `docs/SECURITY_AUDIT.md`, `docs/RELEASE_REPORT.md`

**Integration checkpoint after each agent:** confirm outputs are consistent
**Final integration:** coordinator runs full test suite
```

---

## Subagent Task Card Format

Each subagent receives a Task Card specifying exactly what to do:

```markdown
## Task Card: [Subagent Role] — [Feature Name]

**Subagent:** [role]
**Feature:** [name]
**Session:** [session identifier]

### Context Files (read these first)
- `docs/PRD.md` — acceptance criteria for this feature
- `docs/ARCHITECTURE.md` — tech stack and patterns
- `.antigravity/memory/task-plan.md` — current build state

### Your Task
[Precise description of exactly what to build or produce]

### Files to Create
- `[path]` — [purpose]

### Files to Modify
- `[path]` — [what to change]

### Files NOT to Touch (owned by other subagents)
- `[path]` — owned by [other subagent]

### Completion Signal
When complete, produce:
> "✅ [Subagent Role] COMPLETE — [brief summary of what was produced]"
```

---

## Context Budget Management

Each subagent has a limited context window. Manage token budget:

| Subagent | Estimated Context Budget | Strategy |
|---|---|---|
| PM | Low | Read PRD sections only |
| Architect | Medium | Read PRD + existing ARCHITECTURE.md |
| DB | Medium | Read ARCHITECTURE.md + existing schema |
| Backend | High | Read schema + existing service patterns |
| Frontend | High | Read API contract + design system |
| QA | High | Read all output files |
| Security | Medium | Read all output files (summary only) |

**Context economy rules for subagents:**
1. Read only the files listed in the Task Card
2. Use the architecture-graph.md for structural context instead of scanning code
3. Use learned-patterns.md for implementation patterns instead of re-deriving them
4. Write outputs tightly — no prose, only code and concise documentation

---

## Verification

Before marking SDD complete for a feature:

- [ ] Task Decomposition Document was produced before any subagent was activated
- [ ] Dependency chain was identified before starting parallel workstreams
- [ ] Each subagent received a Task Card with explicit scope and file ownership
- [ ] Integration checkpoint was performed after all workstreams completed
- [ ] API contracts were verified to match between Backend and Frontend
- [ ] Full test suite passes after integration
- [ ] Security subagent reviewed all governance gates
- [ ] Feature is marked complete in `task-plan.md`

---

## Red Flags

- Subagents are writing to the same files without coordination — causes conflicts
- Dependent workstreams start before their dependency is confirmed complete — causes integration failures
- No Task Cards defined — subagents without scope creep into each other's work
- Coordinator is not checking for API contract consistency after integration — silent mismatches

---

## Anti-Rationalisations

- ❌ "Parallel is always faster" — Parallel without coordination is chaos. Coordination overhead must be accounted for.
- ❌ "We can figure out the API contract later" — API contracts must be defined before Frontend starts. Retrofitting is expensive.
- ❌ "Each subagent knows the full system" — Subagents have limited context. Task Cards exist to give them exactly what they need.
- ❌ "SDD for every feature" — SDD overhead is only justified for multi-domain features. Small features should use sequential skill activation.
