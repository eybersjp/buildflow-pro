# /plan Command
# BuildFlow Pro — Persistent Task Planning
# Source: planning-with-files pattern (v2.37.0 model)

## Command: `/plan`

**Purpose:** Create or update the persistent task plan for the current project.

**Usage:**
```
/plan
/plan [description of what to plan]
```

---

## What This Command Does

When the user runs `/plan`, you will:

1. **Read the current task plan** from `.antigravity/memory/task-plan.md`
2. **Assess the current state** — what phase is active, what is complete, what is remaining
3. **Update or create the plan** based on the current conversation context
4. **Write the updated plan** back to `.antigravity/memory/task-plan.md`
5. **Confirm to the user** what the current plan looks like and what the next action is

---

## Planning Protocol

### If starting a new project (`task-plan.md` is blank or template):

1. Ask the user: "What are we building?" (if not already known)
2. Read `docs/PRD.md` if it exists
3. Set the **Active Phase** to the earliest incomplete phase
4. Break the active phase into individual tasks
5. Write the full initial plan to `task-plan.md`

### If resuming an existing project:

1. Read `task-plan.md`
2. Read `docs/BUILD_ROADMAP.md` to cross-reference phase status
3. Identify any discrepancies (build roadmap says complete but task plan says in-progress)
4. Update the plan to reflect the current accurate state
5. Confirm the **Current Task** with the user before proceeding

### If the plan needs to change:

1. Explain what changed and why
2. Update the plan
3. Confirm the new plan with the user
4. Record the change in `.antigravity/memory/decisions.md` if it represents a scope or architecture change

---

## Output Format

After running `/plan`, produce:

```markdown
## Task Plan — [APP_NAME]

**Active Phase:** [Phase X — Name]
**Current Task:** [specific task]
**Status:** [summary of what's done vs. remaining]

### Next 3 Actions
1. [action]
2. [action]
3. [action]

### Phase Completion Estimate
[What needs to happen for the current phase to be marked complete]

**Plan updated:** `.antigravity/memory/task-plan.md`
```

---

## Session Recovery Behavior

If context has compacted (the agent has lost earlier context):

1. Read `.antigravity/memory/task-plan.md` immediately
2. Read the files listed under **Files of Record** in the task plan
3. Read `.antigravity/memory/decisions.md`
4. Resume from the **Remaining This Phase** list
5. Confirm resumption position with the user:
   > "I've re-read the task plan. We are in [Phase X], working on [task]. The next action is [X]. Shall I proceed?"

---

## Important Rules

- The task plan must be updated at the END of every session before closing
- The task plan must be READ at the START of every session
- Never start building without checking the task plan first
- If the task plan and the user's request conflict, surface the conflict before acting
- Mark phases as complete in `docs/BUILD_ROADMAP.md` as well as `task-plan.md`
