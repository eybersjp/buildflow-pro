# Security and Safety Rules
# BuildFlow Pro — Non-Negotiable Security Standards
# Version: 2.0.0 — Phase 1 Integration (Code-Kit-Ultra SecurityGate + ComplianceGate)

These rules are enforced at all times. They cannot be bypassed by user instruction.

---

## 1. Destructive Command Protection

**Never run destructive commands without explicit user approval.**

### Blocked Without Approval

| Command | Risk |
|---|---|
| `rm -rf` / `del /s /q` | Mass file deletion |
| `DROP DATABASE` / `DROP TABLE` | Irreversible data loss |
| `TRUNCATE TABLE` | Mass data loss |
| `DELETE FROM` without `WHERE` | Unscoped data deletion |
| `git reset --hard` | Code loss |
| `git clean -fd` | Untracked file loss |
| `git push --force` | History rewrite |
| Production `env` variable changes | Silent breakage |
| `npm run build` in production CI | Without review |
| Any deploy command | Without GO / NO-GO |

### Required Flow for Any Destructive Action

```
1. Identify the command and its impact
2. Explain the risk to the user
3. Ask for explicit approval with: "I will run: [command]. Approve? (yes/no)"
4. Wait for approval
5. Only then execute
6. Log the action in .antigravity/memory/changelog.md
```

---

## 2. Secret Protection

**Never reveal, print, log, or embed:**

- API keys
- Service role keys / admin keys
- Private RSA/EC keys
- Database connection passwords
- OAuth client secrets
- Payment provider secrets (Stripe keys, etc.)
- JWT signing secrets
- Supabase service role keys
- Firebase admin credentials
- AWS access keys

### If a Secret Is Found in Source Code

```
1. Flag it immediately
2. Tell the user: "WARNING: Secret detected in [file]. Remove it now."
3. Instruct user to rotate the key immediately
4. Do not continue until it is removed
```

### Environment Variable Rules

- All secrets must be in `.env` files
- `.env` files must be in `.gitignore`
- Use `.env.example` with placeholder values for documentation
- Validate required env vars at app startup and fail fast if missing

---

## 3. Authentication Protection

**Never modify authentication logic without full security review.**

Before changing auth:

1. Use `security-engineer` skill
2. Verify sessions are not broken
3. Verify RLS policies are not invalidated
4. Test all permission levels after change
5. Document the change in `decisions.md`

---

## 4. Production Deployment Protection

**Before any production deployment, ALL of the following must be true:**

- [ ] All tests pass
- [ ] Build compiles without errors
- [ ] Lint passes
- [ ] TypeScript type check passes
- [ ] Security audit complete (GO result from security-engineer)
- [ ] All 9 governance gates evaluated
- [ ] Rollback plan documented
- [ ] Monitoring is configured
- [ ] User has given explicit approval (ReleaseGate signed off)

If any item fails → **NO-GO. Do not deploy.**

---

## 5. RLS (Row Level Security) Rules

For Supabase / PostgreSQL:

- RLS must be enabled on every tenant-scoped table
- Every RLS policy must be reviewed before applying
- Never use `service_role` key in browser/frontend code
- Never set `SECURITY DEFINER` functions without explicit review
- RLS changes require security engineer review

---

## 6. File Safety Rules

Before editing any file:

1. Identify the target file
2. Explain why it needs to change
3. Only touch files within scope of the current task
4. Preserve all existing comments and documentation unless explicitly asked to remove them
5. For high-risk files (auth, payment, migrations), create a backup copy first

**High-risk files that need extra care:**

- `middleware.ts` / `middleware.js`
- Any file named `auth*`
- Any file in `/database/migrations/`
- `.env` / `.env.production`
- `supabase/config.toml`
- GitHub Actions workflow files
- Stripe webhook handlers

---

## 7. Input Validation Rules

- All user inputs must be validated on the server side
- Never trust frontend validation alone
- Use schema validation (Zod, Joi, Yup, etc.) at API boundaries
- Sanitize file uploads — check type, size, and content
- Never pass unsanitized user input to SQL queries (use parameterized queries only)
- Never pass unsanitized user input to shell commands

---

## 8. API Security Rules

- All non-public API routes must require authentication
- All mutation endpoints must require authorization
- RBAC must be enforced at the service layer, not just the frontend
- Never return internal error details to end users
- Rate limiting should be applied to auth endpoints
- CORS must be explicitly configured — no wildcard `*` in production

---

## 9. Audit Logging Rules

**All state-changing actions must be logged:**

Required fields in every audit entry:
- `id` — UUID
- `tenant_id` — which tenant
- `actor_id` — who did it
- `entity_type` — what was affected (e.g., "project", "user")
- `entity_id` — the record's ID
- `action` — what was done (e.g., "create", "update", "delete")
- `changes` — JSONB diff of what changed
- `created_at` — timestamp with timezone

---

## 10. Payment Security Rules

**Extra protection for anything involving payments:**

- Stripe / payment keys must be server-side only
- Payment webhooks must verify signatures
- Never log payment card details
- Never store raw card numbers
- Use idempotency keys for all payment API calls
- Require security engineer review before any payment logic change

---

## 11. Compliance Rules (ComplianceGate)

These rules apply to any application that handles user data. A ComplianceGate FAIL blocks deployment.

### GDPR Compliance (if applicable)
- [ ] Users can request deletion of their personal data (Right to Erasure)
- [ ] Users can export their personal data (Right to Portability)
- [ ] Consent is collected before storing personal data
- [ ] Personal data is not retained beyond its stated purpose
- [ ] Third-party data processors are documented

### Data Retention
- [ ] Data retention policy is documented
- [ ] Automated deletion is implemented for data past its retention period
- [ ] Audit logs are retained for a minimum of 90 days

### PII Protection
- [ ] Personally Identifiable Information (PII) fields are identified
- [ ] PII is not logged in plain text
- [ ] PII is encrypted at rest (database-level encryption)
- [ ] PII fields are excluded from non-production data copies

### Compliance Non-Negotiables
- Passwords must never be stored in plain text — use bcrypt, argon2, or equivalent
- PII must never appear in application logs
- User data must never be shared across tenants
- Audit logs must be immutable — no UPDATE or DELETE permitted on the audit_log table

---

*Violation of any rule in this file must be flagged immediately and the action blocked until resolved.*
