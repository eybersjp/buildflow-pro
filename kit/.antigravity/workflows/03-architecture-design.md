# Workflow: Architecture Design
# BuildFlow Pro — Workflow 03
# Version: 2.0.0 — Phase 2 Integration (graphify knowledge graph)

## Purpose

Design the production-grade technical architecture for the app and populate the persistent architecture knowledge graph.

## Trigger

- `/design-architecture`
- "design the architecture"
- "tech stack decision"
- Called from `00-start-production-app.md`

---

## Pre-Conditions

- PRD must be approved
- If PRD not done → run `02-prd-generation.md` first

---

## Steps

### 1. Activate Software Architect Skill
Use: `.antigravity/skills/software-architect/SKILL.md`

For complex systems or when multiple patterns need evaluation:
Use: `.antigravity/skills/software-architect/software-architecture.md`

For multi-agent coordination decisions:
Use: `.antigravity/skills/software-architect/subagent-driven-development.md`

### 2. Read PRD
Load context from `docs/PRD.md`

Also read:
- `.antigravity/memory/learned-patterns.md` — check for known patterns relevant to this stack
- `.antigravity/memory/architecture-graph.md` — check if a previous graph exists (resuming project)

### 3. Generate Architecture
Create:
- `docs/ARCHITECTURE.md` — full architecture document
- `docs/ADR/0001-architecture-choice.md` — initial ADR

Include:
- System context diagram (Mermaid)
- Tech stack recommendation with justification
- Frontend architecture
- Backend architecture
- Database overview
- Auth flow diagram
- Deployment model
- Security model
- Observability plan

### 4. Approval Gate
```
✅ Architecture designed at docs/ARCHITECTURE.md

Tech stack selected:
- Frontend: [choice]
- Database: [choice]
- Auth: [choice]
- Hosting: [choice]

Say "approve architecture" to continue, or request changes.
```

### 5. Populate Architecture Knowledge Graph

After architecture is approved, populate the knowledge graph.

Create or update: `.antigravity/memory/architecture-graph.md`

Populate ALL sections:

**God Nodes** — identify the highest-centrality components. Ask:
- If this component changes, how many other files are affected?
- Components with 5+ dependents are God Nodes.

**Component Map** — fill in:
- All major frontend components (layout, pages, auth guards)
- All backend services planned
- All API routes planned
- All database tables planned

**Data Flow Diagrams** — adapt the generic flows to this specific project:
- Primary user request flow
- Authentication flow
- Multi-tenant isolation flow

**External Integrations** — list every third-party service in the tech stack

**Surprising Connections** — document any non-obvious dependencies the team might miss

**ADR Index** — add ADR-001 and any subsequent ADRs

**Architecture Decision Records** — write to `docs/ADR/` for every major decision

```
✅ Architecture knowledge graph populated at:
   .antigravity/memory/architecture-graph.md

   God Nodes identified: [N]
   Components mapped: [N]
   External integrations: [N]
   Surprising connections documented: [N]
   ADRs written: [N]
```

### 6. Update State
Mark architecture as approved in `.antigravity/memory/project-state.md`
Update `.antigravity/memory/task-plan.md` — mark Phase 2 (Architecture) as ✅ Complete

---

## Output

- `docs/ARCHITECTURE.md`
- `docs/ADR/0001-architecture-choice.md`
- `.antigravity/memory/architecture-graph.md` (populated)

---

## Architecture Graph Maintenance Protocol

The architecture graph must be kept current. Update it whenever:
- A new major component is added (new service, new external integration)
- A service boundary changes
- A new surprising connection is discovered
- A new ADR is written

**Stale graph = Wrong answers when the agent reads it**

---

## Notes on Pattern Selection

For simple CRUD SaaS applications (< 10k DAU, < 5 engineers):
→ **Modular Monolith** is the correct default. Do not over-engineer.

For event-driven or high-complexity features:
→ Consult `software-architecture.md` pattern library before deciding.

For features requiring multiple skill domains simultaneously:
→ Consult `subagent-driven-development.md` before beginning implementation.
