# Workflow: Database Design
# BuildFlow Pro — Workflow 04

## Purpose

Design the production-grade database schema with proper RLS, indexes, and migrations.

## Trigger

- `/design-database`
- "design the database"
- "database schema"
- "tables and RLS"
- Called from `00-start-production-app.md`

---

## Pre-Conditions

- Architecture must be approved
- If architecture not done → run `03-architecture-design.md` first

---

## Steps

### 1. Activate Database Engineer Skill
Use: `.antigravity/skills/database-engineer/SKILL.md`

### 2. Load Context
Read from: `docs/PRD.md`, `docs/ARCHITECTURE.md`

### 3. Generate Database Spec
Create:
- `docs/DATABASE_SPEC.md` — complete schema specification

Include:
- Entity Relationship Diagram (Mermaid)
- All table definitions with column types and constraints
- Foreign key relationships
- Index strategy
- RLS policies for each tenant-scoped table
- Audit log table
- Seed data for development

### 4. Generate Initial Migration
Create:
- `database/migrations/001_initial_schema.sql`

Include rollback script:
- `database/rollback/001_rollback.sql`

### 5. ✋ GATE — Migration Review
```
⚠️ DATABASE MIGRATION REQUIRES APPROVAL

The following migration has been created:
database/migrations/001_initial_schema.sql

I will NOT run this migration until you approve.

Review the migration file, then say:
- "approve migration" to continue
- "edit migration" to make changes first
```

### 6. Update State
Mark database as approved in `.antigravity/memory/project-state.md`

---

## Output

- `docs/DATABASE_SPEC.md`
- `database/migrations/001_initial_schema.sql`
- `database/rollback/001_rollback.sql`
