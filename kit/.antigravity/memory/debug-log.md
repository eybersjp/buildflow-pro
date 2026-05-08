# Debug Log
# BuildFlow Pro — Session Debug Memory
# Source: devtoolsd/awesome-devtools pattern
# Last Updated: [DATE]

> This file captures significant errors, unexpected behaviours, and their resolutions encountered during development sessions.
> Read this before debugging any recurring issue — the solution may already be here.
> Written by the agent after resolving a non-trivial debugging session.

---

## How to Use This File

**Reading:** At the start of any debugging session, scan this file for similar past issues.
**Writing:** After resolving a bug that took more than 15 minutes to identify, add an entry.

**Entry format:**
```markdown
### [Short Title — What Was Broken]
**Date:** [DATE]
**Session:** [brief description of what was being built]
**Symptom:** [what the user/developer saw — the observable effect]
**Root Cause:** [the actual cause — not the symptom]
**Resolution:** [exactly what was changed to fix it]
**Regression Test Added:** YES / NO — [path to test if YES]
**Recurrence Risk:** Low / Medium / High
**Notes:** [anything else useful]
```

---

## Category: Build & Compilation

### [Example Entry — Replace with real entries]
**Date:** [initial]
**Session:** Project scaffold verification
**Symptom:** `npm run build` fails with "Module not found" for `@/lib/supabase/server`
**Root Cause:** The path alias `@/*` was defined in `tsconfig.json` but the actual file was created at `src/lib/supabase/server.ts` — the import was resolving from root, not `src/`
**Resolution:** Verify `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`. Also add the same paths config to `next.config.ts` for webpack resolution.
**Regression Test Added:** NO
**Recurrence Risk:** Medium — check this whenever a new `@/` import fails
**Notes:** This is a common Next.js + TypeScript path alias gotcha. The paths in tsconfig and next.config.ts must match.

---

## Category: Database & Migrations

*[Add entries as they are encountered]*

---

## Category: Authentication & Sessions

*[Add entries as they are encountered]*

---

## Category: API & Network

*[Add entries as they are encountered]*

---

## Category: Frontend & Rendering

*[Add entries as they are encountered]*

---

## Category: Testing

*[Add entries as they are encountered]*

---

## Category: Deployment & CI/CD

*[Add entries as they are encountered]*

---

## Category: Performance

*[Add entries as they are encountered]*

---

## Recurring Issue Tracker

Issues that have appeared more than once — highest priority for root cause elimination:

| Issue | Times Seen | Status | Permanent Fix |
|---|---|---|---|
| [issue description] | [N] | Active / Resolved | [fix description or "none yet"] |

---

## Debug Session Protocol

When starting a debugging session, follow this order:

1. **Check this file first** — has this been seen before?
2. **Check `learned-patterns.md`** — is there a known pattern that explains this?
3. **Check `architecture-graph.md` Surprising Connections** — is this caused by a non-obvious dependency?
4. **Root cause trace** — follow the `backend-engineer/SKILL.md` Root-Cause Tracing Protocol
5. **Write a regression test** — before fixing, write a failing test that reproduces the issue
6. **Fix and verify** — make the test pass, run the full suite
7. **Document here** — if the debug session took > 15 minutes, add an entry to this file

---

*The debug log compounds in value over time. Every entry saved is a future debugging session avoided.*
