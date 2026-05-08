# Release Checklist
# [App Name] — Release v[VERSION]

**Date:** [date]
**Release Manager:** [name]

---

## Pre-Release

- [ ] All features in this release are complete
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Build succeeds
- [ ] Lint passes
- [ ] TypeScript type check passes
- [ ] Security audit complete (result: GO / GO WITH RISKS)
- [ ] Preview deployment verified
- [ ] Rollback plan documented

## Documentation

- [ ] README updated
- [ ] Changelog updated
- [ ] API docs current
- [ ] `docs/BUILD_ROADMAP.md` updated

## Database

- [ ] All migrations tested on staging
- [ ] Rollback scripts exist
- [ ] RLS policies verified

## Environment

- [ ] All env vars set in production
- [ ] Sentry configured
- [ ] Monitoring configured

---

## GO / NO-GO Decision

**Decision:** ✅ GO / ⚠️ GO WITH RISKS / ❌ NO-GO

**Signed off by:** [name] on [date]

---

## Post-Release

- [ ] Production deployment confirmed
- [ ] Error rate normal in Sentry
- [ ] Core user flows verified on production
- [ ] Release tagged in git
- [ ] Team notified
