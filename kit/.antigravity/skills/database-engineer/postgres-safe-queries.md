---
name: postgres-safe-queries
description: A set of production-safe PostgreSQL query patterns for Supabase projects — covering safe read-only queries, safe aggregations, pagination, full-text search, and query performance analysis. All patterns enforce tenant isolation and prevent common performance traps.
version: 1.0.0
triggers:
  - "write a database query"
  - "query the database"
  - "Postgres query"
  - "Supabase query"
  - "database performance"
lifecycle: build
---

# PostgreSQL Safe Query Patterns
# BuildFlow Pro — Database Intelligence Layer
# Source: awesome-claude-skills / postgres pattern

## Overview

This skill provides production-safe PostgreSQL query patterns for Supabase projects. Every pattern enforces:
- **Tenant isolation** — `tenant_id` filter is always present
- **Safe reads** — no unbounded queries, always paginated
- **Performance** — only indexed columns in `WHERE` clauses
- **Security** — parameterized queries only, never string interpolation

---

## Core Rules for Every Query

1. **Every tenant-scoped query MUST include `.eq('tenant_id', tenantId)`**
2. **Every list query MUST include `.limit(n)` — maximum 200 unless paginated**
3. **Never use `select('*')` on tables with sensitive columns** — always name columns explicitly
4. **Only filter on indexed columns** — `tenant_id`, `id`, `status`, `created_at`
5. **Use `.single()` only when you are certain the record exists** — prefer `.maybeSingle()` for optional fetches
6. **Never run aggregation queries in loops** — batch aggregate outside the loop

---

## Pattern Library

### P-001: Safe Single Record Fetch

```typescript
// Safe: explicit column selection, tenant-scoped, handles not-found gracefully
async function getProjectById(
  id: string,
  tenantId: string
): Promise<{ data: Project | null; error: string | null }> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, description, status, created_at, updated_at, created_by')
    .eq('id', id)
    .eq('tenant_id', tenantId)   // ← ALWAYS present for tenant tables
    .maybeSingle();               // ← maybeSingle returns null if not found, single() throws

  if (error) {
    logger.error('Failed to fetch project', { error, id, tenantId });
    return { data: null, error: 'Failed to load project.' };
  }

  return { data, error: null };
}
```

**Anti-pattern to avoid:**
```typescript
// ❌ NEVER do this — no tenant filter, no error handling
const { data } = await supabase.from('projects').select('*').eq('id', id).single();
```

---

### P-002: Safe Paginated List

```typescript
// Safe: tenant-scoped, paginated, sorted, explicit columns
async function listProjects(
  tenantId: string,
  options: {
    page?: number;
    pageSize?: number;
    status?: string;
    searchTerm?: string;
  } = {}
): Promise<{ data: Project[]; total: number; hasMore: boolean; error: string | null }> {
  const { page = 1, pageSize = 20, status, searchTerm } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('projects')
    .select('id, name, description, status, created_at', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .range(from, to);

  // Optional filters
  if (status) {
    query = query.eq('status', status);
  }

  if (searchTerm) {
    // Full-text search using PostgreSQL's plainto_tsquery
    query = query.textSearch('fts', searchTerm, { type: 'plain' });
  }

  const { data, count, error } = await query;

  if (error) {
    logger.error('Failed to list projects', { error, tenantId });
    return { data: [], total: 0, hasMore: false, error: 'Failed to load projects.' };
  }

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (count ?? 0) > to + 1,
    error: null,
  };
}
```

---

### P-003: Safe Joined Query (with Related Data)

```typescript
// Safe: explicit join columns, tenant-scoped parent and child
async function getProjectWithMembers(
  projectId: string,
  tenantId: string
): Promise<{ data: ProjectWithMembers | null; error: string | null }> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      status,
      created_at,
      created_by:users!created_by(id, full_name, email),
      members:project_members(
        id,
        role,
        user:users(id, full_name, email)
      )
    `)
    .eq('id', projectId)
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (error) {
    logger.error('Failed to fetch project with members', { error, projectId });
    return { data: null, error: 'Failed to load project.' };
  }

  return { data, error: null };
}
```

**Note on joins:** Only join to tables that also have RLS enabled with the same tenant isolation. A join that bypasses tenant isolation is a security vulnerability.

---

### P-004: Safe Aggregation Query

```typescript
// Safe: aggregation with tenant scope, never across tenant boundaries
async function getProjectStats(
  tenantId: string
): Promise<{ data: ProjectStats | null; error: string | null }> {
  // Use a Supabase RPC (PostgreSQL function) for complex aggregations
  const { data, error } = await supabase.rpc('get_project_stats', {
    p_tenant_id: tenantId,
  });

  if (error) {
    logger.error('Failed to fetch project stats', { error, tenantId });
    return { data: null, error: 'Failed to load stats.' };
  }

  return { data, error: null };
}

/* Corresponding PostgreSQL function (in a migration):
CREATE OR REPLACE FUNCTION get_project_stats(p_tenant_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'active', COUNT(*) FILTER (WHERE status = 'active'),
    'completed', COUNT(*) FILTER (WHERE status = 'completed'),
    'draft', COUNT(*) FILTER (WHERE status = 'draft')
  )
  INTO result
  FROM projects
  WHERE tenant_id = p_tenant_id
    AND deleted_at IS NULL;

  RETURN result;
END;
$$;
*/
```

---

### P-005: Safe Full-Text Search

```typescript
// Full-text search setup (in migration):
/*
-- Add FTS column (generate in migration)
ALTER TABLE projects ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX idx_projects_fts ON projects USING GIN(fts);
*/

// Safe FTS query
async function searchProjects(
  tenantId: string,
  searchTerm: string,
  limit = 20
): Promise<{ data: Project[]; error: string | null }> {
  if (!searchTerm.trim()) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, description, status')
    .eq('tenant_id', tenantId)
    .textSearch('fts', searchTerm, { type: 'plain', config: 'english' })
    .limit(Math.min(limit, 50)) // Cap at 50 regardless of caller
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Project search failed', { error, tenantId, searchTerm });
    return { data: [], error: 'Search failed. Please try again.' };
  }

  return { data: data ?? [], error: null };
}
```

---

### P-006: Safe Upsert

```typescript
// Safe upsert: explicit conflict target, tenant-scoped
async function upsertProjectSettings(
  projectId: string,
  tenantId: string,
  settings: Partial<ProjectSettings>
): Promise<{ data: ProjectSettings | null; error: string | null }> {
  const { data, error } = await supabase
    .from('project_settings')
    .upsert(
      {
        project_id: projectId,
        tenant_id: tenantId,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'project_id',        // ← explicit conflict column
        ignoreDuplicates: false,          // ← update on conflict
      }
    )
    .select('id, project_id, settings_json, updated_at')
    .single();

  if (error) {
    logger.error('Failed to upsert project settings', { error, projectId });
    return { data: null, error: 'Failed to save settings.' };
  }

  return { data, error: null };
}
```

---

### P-007: Safe Soft Delete

```typescript
// Safe soft delete: tenant-scoped, records deleted_by and deleted_at
async function softDeleteProject(
  projectId: string,
  tenantId: string,
  deletedBy: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('projects')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: deletedBy,
    })
    .eq('id', projectId)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null); // Only delete if not already deleted (idempotent)

  if (error) {
    logger.error('Failed to soft delete project', { error, projectId, tenantId });
    return { success: false, error: 'Failed to delete project.' };
  }

  return { success: true, error: null };
}

// Corresponding list query that excludes soft-deleted records:
const { data } = await supabase
  .from('projects')
  .select('id, name')
  .eq('tenant_id', tenantId)
  .is('deleted_at', null)  // ← Always filter out soft-deleted records
  .order('created_at', { ascending: false })
  .limit(20);
```

---

### P-008: Query Performance Analysis

When a query is slow, follow this diagnostic protocol:

```sql
-- Step 1: EXPLAIN ANALYZE (run in Supabase SQL editor)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT id, name, status
FROM projects
WHERE tenant_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  AND status = 'active'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- What to look for:
-- "Seq Scan" on a large table = MISSING INDEX
-- "Rows Removed by Filter" > 1000 = POOR SELECTIVITY (wrong index order)
-- Actual time > 100ms = optimization needed
-- Shared hit blocks >> Shared read blocks = data is in memory (good)
-- Shared read blocks >> 0 = data is on disk (cache miss)
```

```sql
-- Step 2: Check existing indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'projects'
ORDER BY indexname;

-- Step 3: Create missing composite index
-- For the query above, the optimal index is:
CREATE INDEX CONCURRENTLY idx_projects_tenant_status_created
  ON projects (tenant_id, status, created_at DESC)
  WHERE deleted_at IS NULL;
-- Note: CONCURRENTLY avoids locking the table during index creation
```

---

## Common Anti-Patterns Reference

| Anti-Pattern | Problem | Correct Pattern |
|---|---|---|
| `select('*')` on large tables | Fetches sensitive columns, huge payloads | Name columns explicitly |
| No `.limit()` on list queries | Unbounded results, memory exhaustion | Always `.limit(n)` max 200 |
| `.single()` on optional fetch | Throws if not found | Use `.maybeSingle()` |
| Filter on non-indexed column | Full table scan | Index first, then filter |
| N+1: fetching related data in a loop | O(n) queries | Use join or batch RPC |
| Mutation without `tenant_id` | Data in wrong tenant | Always include `tenant_id` |
| `DELETE FROM` without `WHERE deleted_at IS NULL` | Double-delete confusion | Filter soft-deletes explicitly |
| `ALTER COLUMN TYPE` on large table | Table lock, downtime | Add new column, backfill, rename |

---

## Verification

Before shipping any database query:

- [ ] Query includes `.eq('tenant_id', tenantId)` on all tenant-scoped tables
- [ ] List queries have `.limit(n)` — maximum 200
- [ ] `select()` names columns explicitly (not `select('*')` in production code)
- [ ] Optional fetches use `.maybeSingle()` not `.single()`
- [ ] Filters target indexed columns only
- [ ] EXPLAIN ANALYZE confirms no full table scans on tables > 10,000 rows
- [ ] Soft-deleted records are excluded with `.is('deleted_at', null)`
- [ ] Mutations include `tenant_id` in the inserted/updated data
