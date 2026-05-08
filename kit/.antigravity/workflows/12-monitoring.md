# Workflow: Monitoring
# BuildFlow Pro — Workflow 12

## Purpose

Configure and verify production monitoring after deployment.

## Trigger

- "set up monitoring"
- "configure alerts"
- "monitoring"

---

## Steps

### 1. Error Monitoring (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Set up error alerts for error rate > 1%.

### 2. Analytics (PostHog)

```bash
npm install posthog-js posthog-node
```

Track page views, core feature usage, signups.

### 3. Health Endpoint

Verify `/api/health` exists and returns:
```json
{ "status": "ok", "timestamp": "...", "version": "1.0.0" }
```

### 4. Uptime Monitoring

Configure UptimeRobot or Vercel Analytics for external uptime checks.

### 5. Monitoring Checklist

- [ ] Sentry configured and receiving events
- [ ] Sentry alert for error rate > 1%
- [ ] PostHog page view tracking active
- [ ] Health endpoint accessible at /api/health
- [ ] Uptime monitoring configured
- [ ] Database monitoring via Supabase dashboard

---

## Output

- `docs/MONITORING.md` — monitoring reference
- Sentry + PostHog configured
- Health endpoint verified
