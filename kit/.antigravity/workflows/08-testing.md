# Workflow: Testing
# BuildFlow Pro — Workflow 08

## Purpose

Systematically test all features and produce a GO / NO-GO quality gate decision.

## Trigger

- `/test-feature`
- "run tests"
- "QA this feature"
- "verify this works"

---

## Steps

### 1. Activate QA Engineer Skill
Use: `.antigravity/skills/qa-engineer/SKILL.md`

### 2. Load Feature Context
What feature is being tested? Read from project state if not specified.

### 3. Review Acceptance Criteria
Load from `docs/PRD.md` — confirm which acceptance criteria apply.

### 4. Write Test Plan
Document in `docs/TEST_PLAN.md`

### 5. Write Automated Tests

For each test category:
- Unit tests → `src/**/__tests__/`
- Integration tests → `tests/integration/`
- E2E tests → `tests/e2e/`

### 6. Run Test Suite

Guide user to run (do NOT auto-run in production environments):
```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e  # if configured
```

Report results:
```
Test Results:

Lint:         ✅ 0 errors
TypeCheck:    ✅ 0 errors
Unit Tests:   ✅ 48 passing, 0 failing
Integration:  ✅ 12 passing, 0 failing
E2E:          ✅ 6 passing, 0 failing

Coverage:     84%
```

### 7. Manual QA Checklist
Walk through each item in the QA checklist.

### 8. Produce QA Report

```markdown
## QA Report: [Feature]

**Result:** ✅ GO / ⚠️ GO WITH RISKS / ❌ NO-GO

**Tests:** [n] passing
**Acceptance criteria:** [n/n] met
**Issues found:** [list]
```

---

## Output

- `docs/TEST_PLAN.md`
- Updated test files
- QA report in the conversation
