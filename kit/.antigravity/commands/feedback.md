# Command: /feedback

## Trigger

- `/feedback`
- "session feedback"
- "what did we learn"

## Purpose

Capture session learnings and surface framework gaps after a build session.

## Steps

### Step 1: Session Reflection

Ask yourself:

1. What patterns worked well this session?
2. What felt awkward or required workarounds?
3. Did any rule or workflow feel wrong for this context?
4. Was any documentation missing or unclear?

### Step 2: Update Learned Patterns

Append findings to `.antigravity/memory/learned-patterns.md`:

```markdown
## [DATE] — [Brief Title]

**Context:** [What were you building?]
**Pattern:** [What worked / what to do next time]
**Anti-pattern:** [What to avoid]
```

### Step 3: Surface Framework Gaps

If a workflow, rule, or template was missing or incorrect, report:

```markdown
## Framework Gap Identified

**Missing:** [What was missing]
**Impact:** [How it slowed you down]
**Suggested fix:** [What should be added]
```

Display to user:

```text
✅ Session feedback captured in learned-patterns.md

If a framework gap was identified, consider opening a GitHub issue:
https://github.com/eybersjp/buildflow-pro/issues
```
