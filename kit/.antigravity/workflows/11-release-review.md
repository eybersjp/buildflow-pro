# Workflow: Release Review
# BuildFlow Pro — Workflow 11
# Version: 2.0.0 — Phase 2 Integration (changelog-generator)

## Purpose

Conduct the final review before production deployment, generate the changelog, and produce an official GO / NO-GO decision.

## Trigger

- "release review"
- "GO / NO-GO"
- "ready to ship"
- "final review"
- "generate changelog"
- Called from `10-deployment.md`

---

## Steps

### 1. Activate Release Manager Skill
Use: `.antigravity/skills/release-manager/SKILL.md`

### 2. Gather Evidence

Check all of the following are complete:

| Item | Check |
|---|---|
| PRD approved | docs/PRD.md exists + approved |
| Architecture approved | docs/ARCHITECTURE.md exists |
| Design system complete | docs/DESIGN_SYSTEM.md exists (if frontend work done) |
| Tests passing | QA report shows GO |
| Security audit passing | docs/SECURITY_AUDIT.md shows GO |
| All 9 governance gates evaluated | Scores recorded in security audit |
| Build passing | `npm run build` succeeds |
| Rollback plan exists | docs/DEPLOYMENT_PLAN.md has rollback section |
| Env vars documented | .env.example is complete |
| Architecture graph current | .antigravity/memory/architecture-graph.md updated |

### 3. Generate Changelog (New in v2.0)

**Activate:** `.antigravity/skills/release-manager/changelog-generator.md`

#### Step 3.1 — Determine Version

Using the semantic version determination rules:
- Check for breaking API changes → Major bump
- Check for new features → Minor bump
- Check for only fixes/patches → Patch bump

Announce: `Version bump: [previous] → [new version]`

#### Step 3.2 — Classify Changes

Read and classify all changes from:
- `.antigravity/memory/task-plan.md` — completed tasks this phase
- `docs/BUILD_ROADMAP.md` — completed phases
- `docs/SECURITY_AUDIT.md` — security fixes

Classify into: Added / Changed / Fixed / Removed / Deprecated / Security

#### Step 3.3 — Write Changelog Entry

Write the formatted entry to: `CHANGELOG.md`
Write the internal notes to: `.antigravity/memory/changelog.md`

Include governance gate scores in the Security section.

```
✅ Changelog generated at CHANGELOG.md
   Version: [new version]
   Added: [N] items
   Changed: [N] items
   Fixed: [N] items
   Security: [N] items

   Git tag command: git tag v[version]
```

#### Step 3.4 — Write User-Facing Release Notes (if public app)

Write to: `docs/RELEASE_NOTES_v[version].md`

Focus on user-visible benefits, not implementation details.

### 4. Produce Release Report

Write to: `docs/RELEASE_REPORT.md`

Use the format from release-manager SKILL.md.

Include:
- Feature summary table
- All 9 governance gate scores
- Files changed
- Test results
- Rollback plan reference

### 5. Make GO / NO-GO Decision

Based on evidence only. Not based on optimism.

### 6. Communicate Decision

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               RELEASE DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version: v[VERSION]
Decision: ✅ GO / ⚠️ GO WITH RISKS / ❌ NO-GO

Changelog: CHANGELOG.md
Release Report: docs/RELEASE_REPORT.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 RELEASE GATE — HUMAN APPROVAL REQUIRED

To authorise deployment, respond with: "I approve this release"

This release will NOT proceed until explicit approval is recorded.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Post-Approval Actions (after user approves)

When the user says "I approve this release" or "GO":

1. Mark ReleaseGate as ✅ APPROVED in the release report
2. Create git tag: `git tag v[VERSION]`
3. Update `docs/BUILD_ROADMAP.md` — mark current phase as complete
4. Update `.antigravity/memory/task-plan.md` — governance gates all ✅
5. Proceed to deployment workflow

---

## Output

- `CHANGELOG.md` (updated with new version entry)
- `.antigravity/memory/changelog.md` (updated with internal notes)
- `docs/RELEASE_REPORT.md`
- `docs/RELEASE_NOTES_v[version].md` (if public app)
- GO / NO-GO decision displayed prominently
- Git tag command provided
