# Workflow: Deployment
# BuildFlow Pro — Workflow 10

## Purpose

Prepare and safely deploy the application to preview, then production — with gates at every step.

## Trigger

Run this workflow when the user says:
- `/deploy-preview`
- `/production-release`
- "deploy app"
- "deploy to production"
- "deploy preview"
- "go live"
- "release"

---

## Step 1: Identify Deployment Target

Ask the user:
```
Which environment are we deploying to?

1. Preview / Staging — safe to run without full approval
2. Production — requires full review + your explicit approval

Type 1 or 2:
```

---

## Step 2: Deployment Readiness Check

**Activate:** `devops-engineer` skill

Run through the full checklist:

```
Checking deployment readiness...

Code Quality:
  [ ] npm run lint        — checking...
  [ ] npm run typecheck   — checking...
  [ ] npm run test        — checking...
  [ ] npm run build       — checking...

Security:
  [ ] No secrets in source code
  [ ] RLS enabled on all tenant tables
  [ ] Auth middleware confirmed
  [ ] Security audit complete

Environment:
  [ ] All required env vars documented
  [ ] Env vars set in deployment platform
  [ ] Database migrations ready

Monitoring:
  [ ] Sentry configured
  [ ] Health endpoint exists (/api/health)

Rollback:
  [ ] Rollback plan documented
  [ ] Database rollback script exists
```

**If ANY check fails → STOP and show:**
```
❌ DEPLOYMENT BLOCKED

The following issues must be resolved before deployment:
- [issue 1]
- [issue 2]

Run the appropriate workflow to fix these issues first.
```

---

## Step 3: Security Gate

**Activate:** `security-engineer` skill

Full security review before any deployment.

If security result is **NO-GO:**
```
❌ SECURITY GATE: NO-GO

The security review has found blocking issues:
- [critical issue 1]
- [critical issue 2]

These must be fixed before deployment continues.
```

If security result is **GO WITH RISKS:**
```
⚠️ SECURITY GATE: GO WITH RISKS

The security review found non-blocking risks:
- [medium risk 1]
- [low risk 1]

These are documented and must be resolved within 1 sprint.

Do you accept these risks and want to continue? (yes/no)
```

---

## Step 4: Release Review

**Activate:** `release-manager` skill

Produce the full Release Report.

Final decision:
- ✅ **GO** → Continue to deployment
- ⚠️ **GO WITH RISKS** → Ask user to accept risks
- ❌ **NO-GO** → Block deployment, list blockers

---

## Step 5: Preview Deployment

Deploy to preview/staging environment.

For Vercel:
```
Preview deployment is triggered automatically when you push to a branch.

Steps:
1. Commit and push your changes
2. Open the PR in GitHub
3. Wait for Vercel preview URL to appear
4. Share the URL with me to verify
```

**Do not run deployment commands autonomously.**
**Guide the user to run them.**

---

## Step 6: Verify Preview

After preview is deployed, verify:

```markdown
## Preview Verification Checklist

**Preview URL:** [URL]

- [ ] App loads without errors
- [ ] Login page works
- [ ] User can sign up
- [ ] Dashboard loads after login
- [ ] Core feature 1 works end-to-end
- [ ] Database writes persist correctly
- [ ] Permissions are enforced (try as different roles)
- [ ] Mobile layout works (375px viewport)
- [ ] No JavaScript console errors
- [ ] Error monitoring receiving events (check Sentry)
```

If preview verification fails:
```
❌ PREVIEW FAILED

The preview environment has issues:
- [issue description]

Fix the issues and redeploy to preview before continuing.
```

---

## Step 7: ✋ PRODUCTION APPROVAL GATE

**This gate is mandatory. Do not skip it.**

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ✋ PRODUCTION DEPLOYMENT GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before deploying to PRODUCTION, confirm:

  ✅ Release Review: GO
  ✅ Security Audit: GO
  ✅ Preview verified: All checks passed
  ✅ Rollback plan: Documented
  ✅ Database migrations: Tested on staging

PRODUCTION DEPLOYMENT IS AN IRREVERSIBLE ACTION.

Type "I APPROVE PRODUCTION DEPLOYMENT" to continue,
or "cancel" to stop.
```

**Do not proceed until the user types the exact approval phrase.**

---

## Step 8: Production Deploy

Guide the user to deploy production.

For Vercel:
```
To deploy to production:

1. Merge your PR to the main branch
2. Vercel will automatically deploy to production
3. Your production URL: [configured domain]

While deploying:
- Monitor Sentry for errors in real time
- Keep this session open to verify the deployment
```

---

## Step 9: Post-Deployment Monitoring

After production deployment, monitor for 30 minutes:

```markdown
## Post-Deployment Monitoring

Deployment completed at: [timestamp]

Monitor these for 30 minutes:

- [ ] Error rate in Sentry — normal (< 0.1%)
- [ ] Login flow working on production
- [ ] Core feature working on production
- [ ] Database queries succeeding
- [ ] Page load times acceptable (< 3s)
- [ ] No alerts firing

Status: ✅ STABLE / ⚠️ DEGRADED / ❌ DOWN
```

If issues are detected:
```
⚠️ POST-DEPLOY ISSUE DETECTED

Issue: [description]
Severity: [critical/high/medium]

Recommended Action:
- CRITICAL: Execute rollback now
- HIGH: Investigate immediately
- MEDIUM: Log and fix in next release

Rollback command:
[instructions for rollback]
```

---

## Step 10: Deployment Report

```markdown
## Deployment Report

**Date:** [date/time]
**Environment:** Production
**Version:** [git commit SHA]
**Deployment URL:** [url]

**Release:** ✅ GO
**Security:** ✅ GO
**Tests:** [n] passing
**Monitoring:** ✅ Active

**What Was Deployed:**
- [Feature 1]
- [Feature 2]

**Known Risks:**
- [any accepted risks]

**Rollback Plan:**
- Code: Revert to [previous deployment ID] in Vercel
- Database: Run `database/rollback/[file].sql`

**Post-Deploy Status:** ✅ STABLE
```

Update:
- `.antigravity/memory/changelog.md`
- `.antigravity/memory/project-state.md`
- `docs/BUILD_ROADMAP.md`
