# Monitoring & Observability Plan: [Project Name]

## 1. Objectives (SLOs)
- **Availability:** 99.9% uptime
- **Latency:** 95th percentile < 300ms
- **Error Rate:** < 0.5% of total requests

## 2. Tooling Stack
- **Error Tracking:** [e.g., Sentry, GlitchTip]
- **Logging:** [e.g., Pino + Axiom, Datadog]
- **Metrics:** [e.g., Prometheus, Grafana]
- **Analytics:** [e.g., PostHog]

## 3. Instrumentation Map
| Feature | Telemetry Point | Priority |
|---|---|---|
| Auth | Login Success/Fail | Critical |
| Payments | Checkout Completed | Critical |
| API | Endpoint Latency | High |

## 4. Alerting Rules
- Trigger alert if Error Rate > 1% over 5 minutes.
- Trigger alert if 99th percentile latency > 2s.

## 5. Incident Response
1. Identify (Alert/Report)
2. Triage (Impact assessment)
3. Fix (Mitigation/Rollback)
4. Post-Mortem (Analysis)
