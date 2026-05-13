# BuildFlow Pro — Client Onboarding Checklist

**Client:** [Client Name / Company]
**Date:** [Date]
**BuildFlow Pro Version:** `v1.3.0`
**Onboarding Contact:** [Your Name]

---

## Prerequisites

Before the first session, confirm the following:

- [ ] Node.js >= 18 installed (`node --version`)
- [ ] Google Antigravity (or compatible AI coding agent) configured
- [ ] Git installed and configured
- [ ] Project repository created (GitHub / GitLab / Bitbucket)
- [ ] Terminal / shell access confirmed

---

## Installation

### Option A — npm (Recommended)

```bash
cd your-project
npx buildflow-pro@latest init
```

### Option B — Manual (if npm is blocked)

```bash
# Clone the repo
git clone https://github.com/[buildflow-pro-repo]
# Run the installer
cd your-project
node path/to/buildflow-pro/cli/index.js init
```

### Verify Installation

- [ ] `.antigravity/` directory created in project root
- [ ] `.gemini/settings.json` created
- [ ] `docs/BUILD_ROADMAP.md` created
- [ ] Run `npx buildflow-pro --version` — prints version number

---

## First Session Setup

1. Open your project in Antigravity
2. The `SessionStart` hook fires — you'll see:
   ```
   [BuildFlow Pro] Session started.
   No task plan found. Run /plan to create one.
   ```
3. Run:
   ```
   /start-production-app
   ```
4. Choose development mode:
   - **Production** — Full governance (recommended for real apps)
   - **Prototype** — Fast track, relaxed rules (hackathons/POCs)

---

## First Production Build — Checklist

Walk the client through these in order:

- [ ] **Discovery** — Answer the 12 intake questions (`/start-production-app`)
- [ ] **Review the plan** — PRD, Architecture, Database spec, Design System, API spec
- [ ] **Approve the plan** — Type `APPROVE` to unlock build phase
- [ ] **First feature** — `/build-feature [feature name]`
- [ ] **Security audit** — `/security-audit` before any deployment
- [ ] **Preview deploy** — `/deploy-preview`
- [ ] **Production release** — `/production-release` + `I approve this release`

---

## Common First-Session Issues

| Issue | Cause | Fix |
|---|---|---|
| `.antigravity/` not loading | File not in `.gemini/settings.json` includes | Check `settings.json` hooks |
| Agent ignores rules | Rules file path wrong | Verify `core-rules-dense.md` is at `.antigravity/rules/` |
| Session hooks not firing | Gemini CLI version < minimum | Update Antigravity |
| `/start-production-app` not recognized | Workflow file missing | Re-run `npx buildflow-pro init` |

---

## Support

| Channel | Details |
|---|---|
| Documentation | `README.md`, `HELP.md`, `WALKTHROUGH.md` in the framework |
| npm page | https://www.npmjs.com/package/buildflow-pro |
| GitHub Issues | [link] |
| Direct support | [your contact] |

---

## Sign-off

- [ ] Client completed first `/start-production-app` session
- [ ] First feature ticket created in task-plan.md
- [ ] Client can independently run `/plan:status`
- [ ] Client understands the 9-Gate Governance Model
- [ ] Onboarding complete ✅
