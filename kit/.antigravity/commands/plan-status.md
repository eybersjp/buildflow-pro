# /plan:status Command
# BuildFlow Pro — Real-Time Task Plan Status Report
# Source: planning-with-files pattern (v2.37.0 model)

## Command: `/plan:status`

**Purpose:** Display the current status of the task plan without modifying it.

**Usage:**
```
/plan:status
```

---

## What This Command Does

When the user runs `/plan:status`, you will:

1. **Read** `.antigravity/memory/task-plan.md`
2. **Read** `docs/BUILD_ROADMAP.md`
3. **Read** `.antigravity/memory/changelog.md` (last 5 entries)
4. **Produce a concise status report** showing: current phase, task progress, blockers, governance gate status, and next recommended action
5. **Do not modify** any files

This command is read-only. It reports state; it does not change it.

---

## Output Format

```markdown
## 📋 Task Plan Status — [APP_NAME]

**Last Updated:** [date from task-plan.md]
**Current Session:** [summary of what's happening right now]

---

### Phase Progress

| Phase | Name | Status |
|---|---|---|
| 0 | Discovery | ✅ Complete |
| 1 | PRD | ✅ Complete |
| 2 | Architecture | 🔄 In Progress |
| 3 | Database Design | ⏳ Not Started |
| ... | ... | ... |

---

### Active Phase: [Phase X — Name]

**Current Task:** [description]
**Completed This Phase:**
- ✅ [item]
- ✅ [item]

**Remaining This Phase:**
- ⏳ [item]
- ⏳ [item]

---

### Blockers
[None / list of active blockers]

### Open Questions
[None / list of unanswered questions]

---

### Governance Gates (Latest)

| Gate | Status | Risk Score |
|---|---|---|
| ScopeGate | ⏳ | — |
| ArchitectureGate | ⏳ | — |
| SecurityGate | ⏳ | — |
| DataIntegrityGate | ⏳ | — |
| APIContractGate | ⏳ | — |
| PerformanceGate | ⏳ | — |
| TestCoverageGate | ⏳ | — |
| ComplianceGate | ⏳ | — |
| ReleaseGate | ⏳ Pending | N/A |

---

### Next Recommended Action

> [One clear action the user or AI should take next to advance the plan]
```

---

## When to Use This Command

The user should run `/plan:status`:
- At the start of a session to orient before beginning work
- When they are unsure what phase they are in
- After a long gap between sessions
- When they want to check progress without starting new work
- Before a deployment to confirm all phases are complete

---

## Important Rules

- This command never modifies files. It is always safe to run.
- If `task-plan.md` does not exist, respond:
  > "No task plan found. Run `/plan` to create one."
- If the plan is out of date (last updated more than 3 days ago), add a warning:
  > ⚠️ Task plan was last updated [X] days ago. Run `/plan` to refresh it before proceeding.
