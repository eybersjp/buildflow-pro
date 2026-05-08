# Workflow: Product Discovery
# BuildFlow Pro — Workflow 01

## Purpose

Capture a clear understanding of the app idea before any planning begins.

## Trigger

Used internally by `00-start-production-app.md` or when the user says:
- "tell me about my app"
- "app discovery"
- "help me figure out what to build"

---

## Discovery Questions

Ask the user to fill out the following. They can answer all at once or one at a time:

```
BuildFlow Pro — App Discovery

Please answer the following questions about your app.
Type "skip" to use a default for any question.
Type "guide me" if you want a suggestion.

─────────────────────────────────────────────────

1. APP NAME
   What is your app called?

2. PURPOSE
   What does your app do in 1-2 sentences?

3. PROBLEM
   What problem does it solve?

4. TARGET USERS
   Who are the primary users?
   (e.g., "freelancers", "solar companies", "teachers")

5. USER ROLES
   List the roles your app will have.
   (e.g., Admin / Manager / Member / Viewer)

6. PLATFORM
   a) Web app (recommended for SaaS)
   b) Mobile app
   c) Desktop app
   d) API only

7. MUST-HAVE FEATURES (Version 1 only)
   List 3-5 core features the MVP must have.

8. OUT OF SCOPE (Version 1)
   What should NOT be in the first version?

9. TECH STACK
   Do you have a preferred stack, or use BuildFlow defaults?

10. DEPLOYMENT
    Where should the app run?
    a) Vercel (recommended)
    b) AWS
    c) Self-hosted
    d) Other

11. AUTHENTICATION
    Does the app need user login? (yes/no)

12. PAYMENTS
    Does the app need payments? (yes/no/maybe later)

13. MULTI-TENANT
    Will multiple companies/teams share one deployment? (yes/no)

14. COMPLIANCE
    Any special requirements? (GDPR, HIPAA, SOC2, etc.)
    (Type "none" if not applicable)

─────────────────────────────────────────────────
```

---

## Processing Discovery Answers

After receiving answers:

1. Summarize what was understood
2. Identify any gaps or ambiguities
3. Make reasonable defaults for missing answers, marked as `[DEFAULT]`
4. Ask 1-3 clarifying questions maximum if something critical is unclear

---

## Output

Produce `docs/DISCOVERY.md` with:

```markdown
# App Discovery: [App Name]

**Date:** [date]
**Status:** Discovery Complete

## Summary
[One paragraph summary]

## App Details
- **Name:** ...
- **Purpose:** ...
- **Platform:** ...
- **Target Users:** ...

## User Roles
| Role | Capabilities |
|---|---|

## MVP Features (In Scope)
1. ...
2. ...
3. ...

## Out of Scope (Version 1)
- ...

## Tech Stack
| Layer | Choice | Source |
|---|---|---|
| Frontend | Next.js | [USER] / [DEFAULT] |

## Assumptions
- [ASSUMPTION 1]
- [ASSUMPTION 2]

## Open Questions
- [question that needs a decision]
```

Update `.antigravity/memory/project-context.md` with all key details.
