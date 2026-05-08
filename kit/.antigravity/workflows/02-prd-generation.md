# Workflow: PRD Generation
# BuildFlow Pro — Workflow 02

## Purpose

Generate a complete, production-ready Product Requirements Document from discovery answers.

## Trigger

- `/create-prd`
- "write the PRD"
- "product requirements"
- Called from `00-start-production-app.md`

---

## Pre-Conditions

Before running this workflow:
- Discovery must be complete (`docs/DISCOVERY.md` exists)
- If discovery not done → run `01-product-discovery.md` first

---

## Steps

### 1. Load Discovery Context
Read from: `docs/DISCOVERY.md` and `.antigravity/memory/project-context.md`

### 2. Activate Product Manager Skill
Use: `.antigravity/skills/product-manager/SKILL.md`

### 3. Generate PRD
Write to: `docs/PRD.md`

Use template: `.antigravity/skills/product-manager/templates/prd-template.md`

### 4. Approval Gate
Display:
```
✅ PRD has been generated at docs/PRD.md

Please review it. Key decisions made:
- MVP Scope: [N] features
- Out of scope: [N] items
- User roles: [list]

When ready, say "approve PRD" to continue to Architecture Design.
```

### 5. Update State
Update `.antigravity/memory/project-state.md`:
- Set "PRD: ✅ Approved" after user confirms

---

## Output

`docs/PRD.md` — complete product requirements document
