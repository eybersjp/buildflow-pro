# Workflow: Security Audit
# BuildFlow Pro — Workflow 09

## Purpose

Perform a thorough security review before any deployment.

## Trigger

- `/security-audit`
- "security review"
- "audit the app"
- "check my auth"
- "review RLS"
- Called before deployment

---

## Steps

### 1. Activate Security Engineer Skill
Use: `.antigravity/skills/security-engineer/SKILL.md`

### 2. Scope the Audit
What changed since the last audit? Focus on:
- New or changed authentication logic
- New or changed authorization / RLS policies
- New API endpoints
- New file upload functionality
- New payment integration
- New external integrations
- Any changed environment variable handling

### 3. Run OWASP Checklist
Go through all 10 OWASP Top 10 items.

### 4. Review Auth
- All protected routes require auth?
- Sessions managed correctly?
- Token expiry configured?
- Password reset secure?

### 5. Review RLS
- Every tenant table has RLS enabled?
- Policies are restrictive by default?
- No cross-tenant data access possible?

### 6. Review Secrets
- Scan codebase for exposed secrets
- Check `.env.example` has no real values
- Verify `.gitignore` includes `.env*`

### 7. Review Input Validation
- All API inputs validated server-side?
- No SQL injection vectors?
- File uploads restricted?

### 8. Produce Security Report

Write to: `docs/SECURITY_AUDIT.md`

Use format from security-engineer SKILL.md.

### 9. Security Gate

If result is **NO-GO:**
```
❌ SECURITY GATE: NO-GO

Critical issues found:
- [issue 1]
- [issue 2]

These must be fixed before deployment.
Do not continue until these are resolved.
```

If result is **GO:**
```
✅ SECURITY GATE: GO

Security audit passed.
No blocking issues found.

Proceed to: Release Review (/production-release)
```

---

## Output

- `docs/SECURITY_AUDIT.md`
- Security gate decision (GO / GO WITH RISKS / NO-GO)
