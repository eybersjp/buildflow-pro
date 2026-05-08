---
name: software-architecture
description: A structured framework for evaluating and selecting architectural patterns for production systems. Covers monolith vs. microservices decision tree, layered architecture patterns, event-driven design, CQRS, API gateway patterns, and architectural fitness functions. Use when designing complex or high-scale features.
version: 1.0.0
triggers:
  - "architecture pattern"
  - "should we use microservices"
  - "event-driven design"
  - "CQRS"
  - "architectural decision"
  - "system complexity is growing"
lifecycle: plan
---

# Software Architecture Patterns
# BuildFlow Pro — Architecture Intelligence Layer
# Source: awesome-claude-skills / software-architecture pattern

## Overview

This skill provides a structured decision framework for architectural choices in BuildFlow Pro projects. It prevents premature optimization, guides decisions with evidence-based criteria, and documents choices as Architecture Decision Records.

---

## The Architecture Decision Framework

Before selecting any pattern, answer three questions:

1. **What is the validated scale?** — How many users, transactions/second, data volume are expected in 6 months?
2. **What is the team size?** — How many engineers will maintain this system?
3. **What is the operational maturity?** — Does the team have the infrastructure skills to operate the chosen architecture?

> ⚠️ **Premature optimization is the root of all architectural evil.** Start simple. Add complexity only when you have evidence that simpler won't work.

---

## Pattern 1: Modular Monolith (Default for MVP)

**Use when:**
- Team size < 10 engineers
- < 10,000 daily active users (initial)
- No independently scalable components identified
- Time-to-market is critical

**Structure:**
```
src/
  modules/
    auth/
      auth.controller.ts     ← HTTP handling
      auth.service.ts        ← Business logic
      auth.repository.ts     ← Data access
      auth.types.ts          ← Domain types
    projects/
      projects.controller.ts
      projects.service.ts
      projects.repository.ts
      projects.types.ts
    billing/
      billing.controller.ts
      billing.service.ts
      billing.repository.ts
      billing.types.ts
  shared/
    database/
    middleware/
    utils/
```

**Module boundaries — hard rules:**
- Modules communicate only through their public service interface, never by importing another module's repository or internal files
- Shared database: modules own their tables, but a module must NEVER import another module's repository
- If module A needs data from module B: B exposes a public method on its service; A calls that method
- Cross-module circular dependencies = architectural violation → ADR required to resolve

**Fitness function:**
```typescript
// Architectural test: no module imports another module's internals
// Run with: ts-prune or eslint-plugin-import

// .eslintrc.cjs
module.exports = {
  rules: {
    'import/no-restricted-paths': ['error', {
      zones: [
        {
          target: './src/modules/projects',
          from: './src/modules/auth/auth.repository.ts', // internals
          message: 'Access auth data via auth.service.ts only',
        },
      ],
    }],
  },
};
```

---

## Pattern 2: Service Extraction (When the Monolith Shows Strain)

**Signals it's time to extract a service:**
- One module has 10× the traffic of others and needs independent scaling
- One module has a completely different technology requirement (e.g., a video processing service)
- One module is deployed on a different release cadence from everything else
- A clear, stable API boundary already exists between the module and the rest

**What to extract first:**
1. The module with the clearest, most stable API boundary
2. The module with the most independent data store needs
3. The module that causes the most unrelated failures in the monolith

**What NOT to extract:**
- Modules that share database transactions with the core
- Modules that have no independently scalable case yet
- Modules just because "microservices are better"

**Extraction protocol:**
1. Harden the module boundary in the monolith (no cross-module repo imports)
2. Deploy the module as a separate Vercel function / Cloud Run service
3. Replace internal imports with HTTP or gRPC calls
4. Maintain a contract test suite between the caller and the service
5. Write the ADR: "ADR-NNN: Extracting [module] as an independent service"

---

## Pattern 3: Event-Driven Architecture (When Decoupling Matters)

**Use when:**
- An action in module A should trigger work in modules B, C, D — but A shouldn't know about B, C, D
- You need reliable async processing (emails, notifications, webhooks)
- Module B's unavailability should not fail module A's core action

**Event publishing pattern (Supabase Realtime + pg_notify):**
```typescript
// services/events.service.ts

export type DomainEvent =
  | { type: 'project.created'; projectId: string; tenantId: string }
  | { type: 'project.deleted'; projectId: string; tenantId: string }
  | { type: 'payment.completed'; paymentId: string; tenantId: string };

// Publish event via database trigger (durable — survives service restarts)
export async function publishEvent(event: DomainEvent): Promise<void> {
  await supabase.from('domain_events').insert({
    type: event.type,
    payload: event,
    tenant_id: (event as { tenantId: string }).tenantId,
    published_at: new Date().toISOString(),
  });
}

// domain_events table (add to migration):
/*
CREATE TABLE domain_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL,
  payload       JSONB NOT NULL,
  tenant_id     UUID NOT NULL,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at  TIMESTAMPTZ,
  error         TEXT
);

CREATE INDEX idx_domain_events_unprocessed ON domain_events(published_at)
  WHERE processed_at IS NULL;
*/
```

**Event consuming pattern (Vercel Cron as simple poller):**
```typescript
// app/api/cron/process-events/route.ts
export async function GET() {
  const { data: events } = await supabase
    .from('domain_events')
    .select('*')
    .is('processed_at', null)
    .order('published_at', { ascending: true })
    .limit(50);

  for (const event of events ?? []) {
    try {
      await handleEvent(event);
      await supabase
        .from('domain_events')
        .update({ processed_at: new Date().toISOString() })
        .eq('id', event.id);
    } catch (err) {
      await supabase
        .from('domain_events')
        .update({ error: String(err) })
        .eq('id', event.id);
    }
  }

  return Response.json({ processed: events?.length ?? 0 });
}
```

**When NOT to use event-driven:**
- When you need the result of the handler synchronously (use direct function call instead)
- When debugging complexity outweighs the decoupling benefit
- When team is not operationally ready for eventual consistency

---

## Pattern 4: CQRS (Command Query Responsibility Segregation)

**Use when:**
- Read models and write models have fundamentally different shapes
- Dashboard queries are too slow because the domain model is not optimised for reading
- You need different performance characteristics for reads vs. writes

**Simple CQRS (same database, different query shapes):**
```typescript
// WRITE side: domain model
async function createProject(input: CreateProjectInput): Promise<Project> {
  // Validates, authorises, writes to domain table
  return projectRepository.save(new Project(input));
}

// READ side: denormalised read model (view or materialised view)
async function getDashboardProjects(tenantId: string): Promise<DashboardProjectSummary[]> {
  // Reads from a view or materialised view optimised for display
  const { data } = await supabase
    .from('v_dashboard_projects') // ← denormalised view, not the domain table
    .select('id, name, status, member_count, task_count, last_activity_at')
    .eq('tenant_id', tenantId)
    .limit(20);
  return data ?? [];
}

/* View definition (in migration):
CREATE OR REPLACE VIEW v_dashboard_projects AS
SELECT
  p.id,
  p.tenant_id,
  p.name,
  p.status,
  COUNT(DISTINCT pm.user_id) AS member_count,
  COUNT(DISTINCT t.id) AS task_count,
  MAX(t.updated_at) AS last_activity_at
FROM projects p
LEFT JOIN project_members pm ON pm.project_id = p.id
LEFT JOIN tasks t ON t.project_id = p.id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.tenant_id, p.name, p.status;
*/
```

**When NOT to use CQRS:**
- Simple CRUD applications with no complex read models
- When the overhead of maintaining two models exceeds the benefit
- When team doesn't have experience with eventual consistency

---

## Pattern 5: Architectural Fitness Functions

Fitness functions are automated tests that verify the architecture is obeying its own rules. They run in CI.

```typescript
// tests/architecture/fitness-functions.test.ts

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

describe('Architectural Fitness Functions', () => {
  
  it('services must not import from components or app directory', async () => {
    const serviceFiles = await glob('src/services/**/*.ts');
    
    for (const file of serviceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const hasComponentImport = /from ['"].*\/components\//.test(content);
      const hasAppImport = /from ['"].*\/app\//.test(content);
      
      expect(hasComponentImport, `${file} imports from components`).toBe(false);
      expect(hasAppImport, `${file} imports from app directory`).toBe(false);
    }
  });

  it('API routes must not contain business logic', async () => {
    const routeFiles = await glob('src/app/api/**/*.ts');
    
    for (const file of routeFiles) {
      const content = fs.readFileSync(file, 'utf8');
      // Routes should not contain direct DB calls (they should call services)
      const hasDirectSupabaseQuery = /\.from\(['"]/.test(content) && 
        !content.includes('import { createServiceClient }');
      
      expect(hasDirectSupabaseQuery, `${file} contains direct DB calls outside service layer`).toBe(false);
    }
  });

  it('no any types in service layer', async () => {
    const serviceFiles = await glob('src/services/**/*.ts');
    
    for (const file of serviceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const hasAnyType = /:\s*any[^]|\bas\s+any\b/.test(content);
      expect(hasAnyType, `${file} uses 'any' type`).toBe(false);
    }
  });
});
```

---

## ADR Template for Architecture Decisions

```markdown
## ADR-[NUMBER]: [Decision Title]

**Date:** [DATE]
**Status:** Accepted | Proposed | Deprecated | Superseded by ADR-[NUMBER]
**Deciders:** [names or roles]

### Context

[What situation or problem forced this decision?]
[What constraints or requirements apply?]

### Decision

[What was decided?]
[Why was this option chosen over alternatives?]

### Consequences

**Positive:**
- [benefit 1]
- [benefit 2]

**Negative:**
- [trade-off 1]
- [trade-off 2]

**Neutral:**
- [consequence that is neither good nor bad]

### Alternatives Considered

| Option | Pros | Cons | Reason Rejected |
|---|---|---|---|
| [alt 1] | ... | ... | ... |
| [alt 2] | ... | ... | ... |

### Fitness Function

[How will we verify this decision is being followed?]
[What automated test enforces the rule this decision creates?]
```

---

## When to Write an ADR

Write an ADR when:
- You choose a tech stack component (framework, library, database)
- You establish a new architectural pattern (event-driven, CQRS, etc.)
- You decide to extract a module into a service
- You choose to NOT use a pattern (e.g., "We will not use microservices for MVP")
- You make a security boundary decision (e.g., "All auth happens in middleware, not in service functions")
- You resolve a disagreement about the right approach

---

## Verification

Before marking an architectural decision complete:

- [ ] Architecture decision is documented in an ADR in `docs/ADR/`
- [ ] Alternatives were considered and documented in the ADR
- [ ] A fitness function exists to enforce the decision automatically
- [ ] The architecture-graph.md has been updated with new components
- [ ] The decision is reflected in the tech stack table in `docs/ARCHITECTURE.md`
- [ ] User has reviewed and approved the ADR

---

## Anti-Rationalisations

- ❌ "Microservices are industry standard, so we should use them" — Netflix-scale problems require Netflix-scale solutions. You are not Netflix.
- ❌ "We might need to scale this module later" — Premature extraction creates distributed monolith complexity without the scale benefit.
- ❌ "Event-driven is cleaner" — Event-driven is more complex. Complexity is not cleaner.
- ❌ "We don't need an ADR for this, everyone agreed" — Agreement in a meeting is not durable. ADRs are durable.
- ❌ "We'll refactor the architecture once we hit scale" — Refactoring a system under load is far more expensive than designing it right initially.
