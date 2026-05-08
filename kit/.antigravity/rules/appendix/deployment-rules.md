# Deployment Rules
# BuildFlow Pro — Production Deployment Standards

Deployment is the most dangerous phase. These rules protect production.

---

## 1. Deployment Order (Non-Negotiable)

```
Build passes
  → Lint passes
    → Type check passes
      → Tests pass
        → Security audit passes
          → Rollback plan documented
            → Preview deployed
              → Preview verified
                → User approves
                  → Production deployed
                    → Post-deploy monitoring confirmed
```

**If any step fails, stop. Do not proceed.**

---

## 2. Pre-Deployment Checklist

Before any deployment, verify:

**Code Quality**
- [ ] `npm run lint` — 0 errors
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run test` — all tests pass
- [ ] `npm run build` — builds successfully

**Security**
- [ ] No secrets in source code
- [ ] RLS enabled on all tenant tables
- [ ] Auth middleware protecting all sensitive routes
- [ ] Security audit complete (use security-engineer skill)

**Environment**
- [ ] All required environment variables documented
- [ ] All required env vars set in deployment platform
- [ ] Database migrations are ready and tested

**Rollback**
- [ ] Rollback plan documented in `docs/DEPLOYMENT_PLAN.md`
- [ ] Previous version still accessible if needed
- [ ] Database migration has a rollback script

**Monitoring**
- [ ] Error monitoring configured (e.g., Sentry)
- [ ] Alerting configured for critical errors
- [ ] Deployment notification sent to team

---

## 3. Environment Variable Rules

- **Development:** `.env.local`
- **Preview:** set in hosting platform (e.g., Vercel preview env)
- **Production:** set in hosting platform (e.g., Vercel production env)
- Never commit `.env` files to source control
- Always maintain `.env.example` with all variable names (no values)
- Validate all required env vars at app startup:

```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY', // server only
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

---

## 4. Database Migration Rules

- Migrations must be applied in order
- Every migration must have a rollback plan
- Test migrations on a staging database before production
- Never run migrations manually on production — use CI/CD
- Keep migrations small and atomic
- Never modify a migration that has already been applied to production — create a new one

---

## 5. Preview Deployment Rules

- Every change should be deployed to preview first
- Preview URL must be verified before production deployment
- Test critical user flows on preview:
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] Core feature works end-to-end
  - [ ] Database writes persist correctly
  - [ ] Permissions are enforced

---

## 6. Production Deployment Rules

**NEVER deploy to production without:**

1. Passing preview deployment
2. Verified preview testing
3. GO / NO-GO sign-off from Release Manager
4. Explicit user approval

**During production deployment:**
- Monitor error rates in real time
- Have rollback command ready
- Notify team (Slack, email, etc.)

---

## 7. Rollback Protocol

If production is broken after deployment:

```
1. Immediately assess the issue
2. If user-impacting → execute rollback NOW
3. Rollback options:
   - Vercel: redeploy previous deployment
   - Database: run rollback migration
   - Feature flags: disable the broken feature
4. Communicate status to stakeholders
5. Post-incident review within 24 hours
6. Document in .antigravity/memory/changelog.md
```

---

## 8. Post-Deployment Monitoring

After every production deployment, monitor for 30 minutes:

- [ ] Error rate in Sentry — is it normal?
- [ ] Auth errors — are users able to log in?
- [ ] Database errors — are queries succeeding?
- [ ] Core user flows — are they working?
- [ ] Performance — is page load acceptable?

If any metric spikes → investigate immediately.

---

*Production deployments require discipline. When in doubt, don't deploy.*
