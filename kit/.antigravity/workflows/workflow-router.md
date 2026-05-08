# Workflow Router
# BuildFlow Pro — Intelligent Workflow Dispatcher

## Purpose

Route user intent to the correct workflow without making the user memorize workflow names.

When a user says something that implies a task, check this router first and dispatch to the correct workflow.

---

## How to Use This Router

1. Read what the user said
2. Match it against the routing rules below
3. Run the matched workflow
4. If no match → use the Fallback Protocol

---

## Routing Rules

### 🚀 Start Production App

**Keywords:** "start app", "build app", "new SaaS", "I have an idea", "start from scratch", "new project", "build from zero"

**Command:** `/start-production-app`

**Run:** `00-start-production-app.md`

---

### 🔍 Product Discovery

**Keywords:** "discovery", "intake", "app questions", "what should I build"

**Run:** `01-product-discovery.md`

---

### 📄 PRD Generation

**Keywords:** "create PRD", "write requirements", "product requirements", "define product", "write the spec"

**Command:** `/create-prd`

**Run:** `02-prd-generation.md`

---

### 🏗️ Architecture Design

**Keywords:** "architecture", "tech stack", "system design", "design the system", "what stack should I use"

**Command:** `/design-architecture`

**Run:** `03-architecture-design.md`

---

### 🗄️ Database Design

**Keywords:** "database", "schema", "tables", "design the db", "RLS", "migrations", "ERD"

**Command:** `/design-database`

**Run:** `04-database-design.md`

---

### 🎨 UI/UX Design

**Keywords:** "design UI", "design the interface", "dashboard", "pages", "wireframe", "UI plan", "screens"

**Command:** `/design-ui`

**Run:** `05-ui-ux-design.md`

---

### ⚙️ Project Scaffold

**Keywords:** "scaffold project", "set up project", "initialize", "create repo", "setup"

**Command:** `/scaffold-project`

**Run:** `06-project-scaffold.md`

---

### 🔨 Build Feature

**Keywords:** "build feature", "add feature", "add module", "implement", "add [feature name]", "build [feature name]"

**Command:** `/build-feature`

**Run:** `07-feature-build.md`

---

### 🧪 Testing

**Keywords:** "test", "QA", "write tests", "run tests", "verify feature", "test coverage"

**Command:** `/test-feature`

**Run:** `08-testing.md`

---

### 🔒 Security Audit

**Keywords:** "security", "audit", "permissions", "check auth", "RLS review", "security review"

**Command:** `/security-audit`

**Run:** `09-security-audit.md`

---

### 🚀 Deployment

**Keywords:** "deploy", "release", "production", "go live", "deploy preview", "staging"

**Commands:** `/deploy-preview` or `/production-release`

**Run:** `10-deployment.md`

---

### 📋 Release Review

**Keywords:** "release review", "GO / NO-GO", "release manager", "ready to ship"

**Run:** `11-release-review.md`

---

### 📊 Monitoring

**Keywords:** "monitoring", "observability", "alerts", "Sentry", "error tracking", "set up monitoring"

**Run:** `12-monitoring.md`

---

### 🔧 Maintenance

**Keywords:** "maintenance", "update dependency", "patch", "hotfix", "bug fix"

**Command:** `/fix-bugs`

**Run:** `13-maintenance.md`

---

### 📖 Generate Docs

**Keywords:** "write docs", "update README", "document", "API docs", "user guide"

**Command:** `/generate-docs`

**Activate:** `documentation-writer` skill

---

### 📊 Status Report

**Keywords:** "status", "where are we", "current phase", "what's done", "progress report"

**Command:** `/status-report`

**Action:**
Read `.antigravity/memory/project-state.md` and `docs/BUILD_ROADMAP.md`, then produce:

```markdown
## BuildFlow Pro — Status Report

**Current Phase:** [phase from project-state.md]
**App Name:** [from project-context.md]
**Stack:** [from project-context.md]

**Phase Progress:**
- Phase 0: Discovery       — ✅ Complete
- Phase 1: PRD             — ✅ Complete
- Phase 2: Architecture    — ✅ Complete
- Phase 3: Database        — ✅ Complete
- Phase 4: UI Plan         — ✅ Complete
- Phase 5: Scaffold        — 🔄 In Progress
- Phase 6: Auth            — ⏳ Pending
- ...

**Active Feature:** [from project-state.md]
**Blockers:** [from project-state.md]

**Next Recommended Action:**
[what to do next]
```

---

## Fallback Protocol

If no keyword matches and the intent is unclear:

```
I'm not sure which workflow to run for this request.

Here's what I think you might want:
1. [most likely option] — run /[command]
2. [second option] — run /[command]
3. Something else

Which would you like, or type the command directly?
```

**Safety Rule:** If the request seems potentially destructive or production-impacting, always ask for confirmation before routing to any deployment or database workflow.
