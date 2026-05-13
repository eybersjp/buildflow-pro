# Security Audit Report

BuildFlow Pro — Security Audit Report

**Project:** [App Name]
**Version:** [v0.0.0]
**Date:** [Date]
**Auditor:** Security Engineer (BuildFlow Pro)
**Status:** Draft | GO | NO-GO

---

## Executive Summary

[1-2 sentence summary of overall security posture and GO/NO-GO recommendation]

---

## 9-Gate Governance Results

| Gate | Result | Notes |
|---|---|---|
| ✅/❌ ScopeGate | | Feature matches PRD acceptance criteria |
| ✅/❌ ArchitectureGate | | No architecture invariants violated |
| ✅/❌ SecurityGate | | OWASP risk score, auth/RLS verified |
| ✅/❌ DataIntegrityGate | | Schema changes have migrations and rollbacks |
| ✅/❌ APIContractGate | | No breaking changes without versioning |
| ✅/❌ PerformanceGate | | LCP < 2.5s, TTFB < 200ms, query < 100ms |
| ✅/❌ TestCoverageGate | | Service layer ≥ 80%, E2E covers happy + error paths |
| ✅/❌ ComplianceGate | | GDPR, data retention, PII protection |
| ✅/❌ ReleaseGate | | Human approval obtained |

**Overall: GO ✅ / NO-GO ❌**

---

## OWASP Top 10 Review

| Risk | Status | Finding |
|---|---|---|
| A01 Broken Access Control | ✅/❌ | [Notes] |
| A02 Cryptographic Failures | ✅/❌ | [Notes] |
| A03 Injection | ✅/❌ | [Notes] |
| A04 Insecure Design | ✅/❌ | [Notes] |
| A05 Security Misconfiguration | ✅/❌ | [Notes] |
| A06 Vulnerable Components | ✅/❌ | [Notes] |
| A07 Auth & Session Management | ✅/❌ | [Notes] |
| A08 Data Integrity Failures | ✅/❌ | [Notes] |
| A09 Logging & Monitoring Failures | ✅/❌ | [Notes] |
| A10 Server-Side Request Forgery | ✅/❌ | [Notes] |

---

## Findings

### 🔴 Critical (Block Release)

| ID | Finding | Location | Remediation |
|---|---|---|---|
| — | None | — | — |

### 🟠 High (Fix Before Release)

| ID | Finding | Location | Remediation |
|---|---|---|---|
| — | None | — | — |

### 🟡 Medium (Fix This Sprint)

| ID | Finding | Location | Remediation |
|---|---|---|---|
| — | None | — | — |

### 🟢 Low (Backlog)

| ID | Finding | Location | Remediation |
|---|---|---|---|
| — | None | — | — |

---

## Infrastructure Review

| Item | Status | Notes |
|---|---|---|
| Environment variables validated at startup | ✅/❌ | |
| No secrets hardcoded | ✅/❌ | |
| HTTPS enforced everywhere | ✅/❌ | |
| CSP headers configured | ✅/❌ | |
| Rate limiting in place | ✅/❌ | |
| Dependency audit clean (`npm audit`) | ✅/❌ | |
| RLS enabled on all tables | ✅/❌ | |
| Audit log active | ✅/❌ | |

---

## Recommendation

```
GO ✅   — All critical/high findings resolved. Approved for production release.
NO-GO ❌ — [n] unresolved findings block release. See Critical/High sections above.
```

---

## Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Security Engineer | — | — | — |
| Project Owner | — | `I approve this release` | — |
