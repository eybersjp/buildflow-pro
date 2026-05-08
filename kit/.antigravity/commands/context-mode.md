---
name: context-mode
description: Advanced context management for BuildFlow Pro sessions — selective context loading, context compression, session state snapshots, and context budget monitoring. Prevents context window exhaustion and ensures the most relevant information is always active. Activate at the start of any long session or when context budget is running low.
version: 1.0.0
triggers:
  - "/context-mode"
  - "/context load"
  - "/context compress"
  - "/context status"
  - "/context clear"
  - "context is running out"
  - "running out of context"
lifecycle: system
---

# Context Mode — Advanced Context Management
# BuildFlow Pro — System Command
# Source: mksglu/context-mode pattern

## Overview

Context Mode is the session intelligence layer for BuildFlow Pro. It manages what information is loaded into the agent's active context window and when, preventing context exhaustion and ensuring the right information is always present.

BuildFlow Pro projects accumulate significant documentation — PRDs, architecture docs, design systems, task plans, changelogs, and source files. Loading all of it into every session is wasteful and eventually impossible. Context Mode solves this by loading only what is needed for the current task.

---

## Commands

### `/context load [target]`
Load specific documents into context.

### `/context compress`
Compress the current context to its essential facts.

### `/context status`
Report on current context usage and what is loaded.

### `/context clear [target]`
Signal that a document or topic can be dropped from active context.

### `/context snapshot`
Write the current session state to `task-plan.md` for recovery.

---

## Selective Context Loading Protocol

### Priority Tiers

**Tier 0 — Always loaded at session start (mandatory):**
```
.antigravity/memory/task-plan.md        ← Current task and phase
.antigravity/memory/project-context.md  ← App name, stack, key facts
```

**Tier 1 — Load for planning and architecture tasks:**
```
.antigravity/memory/architecture-graph.md  ← Architecture knowledge graph
docs/ARCHITECTURE.md                        ← Full architecture document
docs/PRD.md                                 ← Product requirements
.antigravity/memory/decisions.md            ← Key decisions log
```

**Tier 2 — Load for feature build tasks:**
```
docs/UI_UX_SPEC.md                          ← Page and component specs
docs/API_SPEC.md                            ← API contract
docs/DESIGN_SYSTEM.md                       ← Design tokens and component inventory
.antigravity/memory/learned-patterns.md     ← Known patterns (scan, don't fully load)
```

**Tier 3 — Load for QA and security tasks:**
```
docs/SECURITY_AUDIT.md                      ← Security findings
.antigravity/memory/risks.md                ← Known risks
```

**Tier 4 — Load on-demand only:**
```
docs/CHANGELOG.md                           ← History (load only for release tasks)
docs/ADR/*                                  ← ADRs (load only the relevant ADR)
database/migrations/*                       ← Load only the specific migration being worked on
src/**/*.ts                                 ← Source files (load only what is directly needed)
```

---

## `/context load` — Implementation

When the user says `/context load [target]`, load the appropriate tier:

```
/context load planning
  → Load: task-plan.md, project-context.md, architecture-graph.md, docs/PRD.md

/context load feature [feature-name]
  → Load: task-plan.md, project-context.md, docs/UI_UX_SPEC.md, docs/API_SPEC.md
  → Scan: learned-patterns.md (extract only relevant patterns)

/context load security
  → Load: task-plan.md, docs/SECURITY_AUDIT.md, .antigravity/rules/security-rules.md

/context load release
  → Load: task-plan.md, CHANGELOG.md, docs/RELEASE_REPORT.md, .antigravity/rules/deployment-rules.md

/context load architecture
  → Load: task-plan.md, architecture-graph.md, docs/ARCHITECTURE.md, docs/ADR/[most recent]

/context load patterns
  → Scan learned-patterns.md, extract only entries relevant to current task
```

---

## `/context compress` — Implementation

When context is getting long or the user says "context is running out":

1. **Produce a compression snapshot:**

```markdown
## Context Compression Snapshot — [TIMESTAMP]

### Current Task
[Exact current task from task-plan.md]

### Critical State (must not lose)
- Phase: [current phase]
- Active file(s): [files being edited]
- Last action: [what was just done]
- Next action: [what needs to happen next]

### Key Decisions (non-reversible)
- [decision 1]
- [decision 2]

### Open Questions (not yet resolved)
- [question 1]

### Files of Record (must read before continuing)
- [file]: [why it's critical]

### DO NOT RESTART without reading these files:
1. .antigravity/memory/task-plan.md
2. .antigravity/memory/architecture-graph.md
3. [any file being actively edited]
```

2. **Write the snapshot to task-plan.md** under "Session Recovery Protocol"

3. **Signal what can be dropped:**
```
Context compressed. Safe to drop from active context:
  - docs/ARCHITECTURE.md (key facts extracted to architecture-graph.md)
  - Full PRD content (key requirements extracted to task-plan.md)
  - Earlier conversation history

Essential state preserved in task-plan.md.
If context compacts, read task-plan.md first.
```

---

## `/context status` — Implementation

Report the current context state:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CONTEXT STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Documents:
  ✅ task-plan.md          [always loaded]
  ✅ project-context.md    [always loaded]
  ✅ architecture-graph.md [loaded]
  ⬜ PRD.md                [not loaded]
  ⬜ UI_UX_SPEC.md         [not loaded]

Current Task: [task from task-plan.md]
Current Phase: [phase]

Context Budget Advisory:
  📊 Estimated usage: [Low / Medium / High / Critical]
  
  [if High or Critical]:
  ⚠️ Context budget is high. Consider running /context compress
     before continuing to prevent loss of state on compaction.

Recommendation: [what to load next based on current task]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## `/context snapshot` — Implementation

Write the full current session state to disk so it survives compaction:

1. Update `task-plan.md` with:
   - Current task (exact state)
   - Files modified this session
   - Files read this session
   - Decisions made this session
   - Open questions identified

2. Update `architecture-graph.md` if any new components or connections were discovered

3. Update `learned-patterns.md` if any new patterns were discovered

4. Announce:
```
✅ Session snapshot written to:
   .antigravity/memory/task-plan.md
   .antigravity/memory/architecture-graph.md (if updated)
   .antigravity/memory/learned-patterns.md (if updated)

If this session ends or context compacts, read task-plan.md
at the start of the next session to resume without loss.
```

---

## Auto-Context Rules

These rules apply automatically without the user invoking a command:

**Rule 1 — Session Start Auto-Load:**
At the start of every session, automatically read:
- `.antigravity/memory/task-plan.md`
- `.antigravity/memory/project-context.md`

If neither exists, prompt the user to run `/plan` first.

**Rule 2 — Pre-Build Auto-Scan:**
Before building any feature, automatically scan `learned-patterns.md` for patterns relevant to:
- The current tech stack
- The current feature type (auth, CRUD, form, dashboard, etc.)

Announce what was found: "Found 3 relevant patterns in learned-patterns.md"

**Rule 3 — Post-Write Auto-Signal:**
After writing any file, add a compressed record to the internal context:
- File written: `[path]`
- Purpose: `[one sentence]`
- Related task: `[task ID from task-plan.md]`

**Rule 4 — Compaction Recovery:**
If context appears to have been truncated (agent has no memory of earlier conversation):
1. Read `task-plan.md` immediately
2. Read `architecture-graph.md`
3. Report: "Context recovery complete. Resuming task: [task from task-plan.md]"
4. Do NOT ask the user to re-explain what was being built

---

## Context Loading for Learned Patterns

When scanning `learned-patterns.md`, use this filter to avoid loading everything:

```
Relevant patterns for current task = match(
  current_tech_stack ∩ learned_patterns.categories
  + current_feature_type ∩ learned_patterns.apply_when
)

Load only: matching patterns
Skip: unrelated categories
```

Example: Building a database service function for a Next.js + Supabase project:
- Load: "Database & RLS" category, "TypeScript & Type Safety" category
- Skip: "Deployment & CI/CD", "Authentication & Sessions" (unless auth is part of the feature)

---

## Verification

- [ ] task-plan.md is read at every session start
- [ ] learned-patterns.md is scanned before every feature build
- [ ] Context compression snapshot is written before any long session ends
- [ ] Tier 4 documents are loaded on-demand only (never preloaded)
- [ ] After context compaction, recovery reads task-plan.md before taking any action
