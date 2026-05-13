# Threat Model

BuildFlow Pro — Security Threat Model

**Project:** [App Name]
**Date:** [Date]
**Author:** Security Engineer (BuildFlow Pro)
**Status:** Draft | Under Review | Approved

---

## 1. System Overview

Brief description of what the system does and what assets it protects.

**Assets to protect:**

| Asset | Sensitivity | Notes |
|---|---|---|
| User PII (email, name) | 🔴 High | GDPR scope |
| Session tokens | 🔴 High | Auth boundary |
| Payment data | 🔴 High | PCI scope — never stored |
| Application secrets | 🔴 High | Env vars only |
| Tenant data | 🟠 Medium | RLS enforced |
| Audit logs | 🟡 Medium | Immutable by design |

---

## 2. Trust Boundaries

```
[Browser / Client]
    │
    ▼ HTTPS
[Edge / CDN]
    │
    ▼
[Application Server / Next.js API Routes]
    │              │
    ▼              ▼
[Supabase DB]   [External APIs]
(RLS enforced)  (Stripe, S3, etc.)
```

---

## 3. STRIDE Threat Analysis

| Threat | Category | Component | Risk | Mitigation | Status |
|---|---|---|---|---|---|
| Session hijacking | Spoofing | Auth | 🔴 High | httpOnly cookies, short TTL | ✅ Mitigated |
| SQL injection | Tampering | DB queries | 🔴 High | Parameterized queries only | ✅ Mitigated |
| Cross-tenant data leak | Information Disclosure | DB | 🔴 High | RLS on all tenant tables | ✅ Mitigated |
| JWT forgery | Spoofing | Auth | 🔴 High | Supabase-managed signing | ✅ Mitigated |
| Privilege escalation | Elevation | RBAC | 🟠 High | Role checks at service layer | 🔲 Verify |
| XSS via user content | Tampering | Frontend | 🟠 High | Output encoding, CSP headers | 🔲 Verify |
| Secrets in code | Information Disclosure | Config | 🔴 High | Env vars + startup validation | ✅ Mitigated |
| [Add threat] | [Category] | [Component] | — | — | 🔲 Open |

**STRIDE categories:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege

---

## 4. Attack Surface

| Entry Point | Method | Auth Required | Notes |
|---|---|---|---|
| `/api/*` routes | HTTP | Yes (JWT) | All routes auth-gated |
| `/api/public/*` | HTTP | No | Intentionally public — reviewed |
| Supabase direct | PostgreSQL | RLS | No direct public access |
| Admin dashboard | HTTP | SuperAdmin role | Extra MFA recommended |
| Webhooks (Stripe) | HTTP | Signature verify | HMAC validated |

---

## 5. Compliance Notes

| Requirement | Status | Evidence |
|---|---|---|
| GDPR — data minimization | 🔲 Review | Collect only required fields |
| GDPR — right to erasure | 🔲 Implement | Soft delete + data purge workflow |
| GDPR — data residency | 🔲 Confirm | Supabase region: [region] |
| PCI — no card storage | ✅ | Stripe handles all card data |
| Audit log integrity | ✅ | Append-only audit_log table |

---

## 6. Open Security Items

| ID | Issue | Severity | Owner | Due |
|---|---|---|---|---|
| SEC-001 | [Describe open item] | 🟠 High | Security Engineer | [Date] |

---

## 7. Security Review Sign-off

| Gate | Status | Reviewer | Date |
|---|---|---|---|
| SecurityGate | 🔲 Pending | Security Engineer | — |
| ComplianceGate | 🔲 Pending | Security Engineer | — |
| Final Approval | 🔲 Pending | Project Owner | — |
