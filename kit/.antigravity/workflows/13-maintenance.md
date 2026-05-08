# Workflow: Maintenance
# BuildFlow Pro — Workflow 13

## Purpose

Handle ongoing maintenance: bug fixes, dependency updates, hotfixes, and iterative improvements.

## Trigger

- `/fix-bugs`
- "fix this bug"
- "hotfix"
- "update dependency"
- "maintenance"

---

## Bug Fix Loop

For every bug or maintenance task:

1. **Understand** — reproduce the bug, confirm impact
2. **Diagnose** — identify root cause
3. **Plan** — what files change, what tests needed
4. **Fix** — minimal change targeting only the bug
5. **Test** — unit + regression test added
6. **Review** — security check if fix touches auth/payments
7. **Report** — what changed, what was tested

---

## Dependency Updates

```
⚠️ DEPENDENCY UPDATE REQUIRES APPROVAL

Packages to update:
- package@old → package@new
- package@old → package@new

Breaking changes? [yes/no]
Risk level: [low/medium/high]

Approve? (yes/no)
```

Always run full test suite after dependency updates.

---

## Hotfix Protocol

For production emergencies:

1. Assess severity: Is it user-impacting?
2. If critical → consider rollback first
3. Create minimal fix
4. Emergency test (unit + smoke test)
5. Emergency security review if needed
6. Deploy with approval
7. Post-incident report within 24 hours
