# Command: /generate-docs

BuildFlow Pro — Documentation Generator

## Trigger

Run this command when the user says:

- `/generate-docs`
- "generate documentation"
- "create README"
- "write the API docs"
- "generate contributing guide"
- "create project docs"

---

## Purpose

Generate or refresh professional-grade project documentation using the
`documentation-writer` skill and the `beautiful-docs` templates. This command
can be run at any phase of the project, but is most useful after the first
feature is built (Phase 7+).

---

## Step 1: Audit Existing Docs

**Activate:** `documentation-writer` skill

Check which docs already exist:

- [ ] `README.md` at project root
- [ ] `CONTRIBUTING.md` at project root
- [ ] `docs/API_SPEC.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/DATABASE_SPEC.md`

Report to the user:

```text
📋 Documentation Audit

  ✅ README.md              — exists
  ❌ CONTRIBUTING.md        — missing
  ✅ docs/API_SPEC.md       — exists
  ...

I will generate the missing documents and refresh stale ones.
```

---

## Step 2: Generate README

**Template:** `.antigravity/templates/beautiful-docs/README-template.md`

Populate the template with data from:

- `.antigravity/memory/project-context.md` — app name, purpose, stack
- `docs/PRD.md` — features, target users
- `docs/ARCHITECTURE.md` — tech stack, deployment model
- `docs/API_SPEC.md` — quick API reference

Output: `README.md` (project root)

Requirements:

- Must include: badges (npm/CI/license), hero description, quick-start, features, stack, contributing link, license
- Must NOT include: internal build notes, task plans, memory file references
- Tone: professional, developer-facing

---

## Step 3: Generate CONTRIBUTING.md

**Template:** `.antigravity/templates/beautiful-docs/CONTRIBUTING-template.md`

Populate with:

- Project name from `project-context.md`
- Tech stack (for dev setup instructions)
- Branch strategy (feature branches → main)
- PR checklist (tests passing, lint clean, docs updated)

Output: `CONTRIBUTING.md` (project root)

---

## Step 4: Generate or Refresh API Docs

**Template:** `.antigravity/templates/beautiful-docs/API-docs-template.md`

If `docs/API_SPEC.md` exists, enhance it with:

- Request/response examples for each endpoint
- Error code table
- Authentication notes

Output: `docs/API_SPEC.md` (update in place)

---

## Step 5: ✋ Review Gate

Display:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              📄 Documentation Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  README.md              — ✅ Generated
  CONTRIBUTING.md        — ✅ Generated
  docs/API_SPEC.md       — ✅ Refreshed

Please review and edit these files before committing.
They are starting points — your voice and project details
should be added where marked [PLACEHOLDER].

Next step: commit these docs and run /production-release
```

---

## Completion Checklist

- [ ] `README.md` generated with all required sections
- [ ] `CONTRIBUTING.md` generated with dev setup and PR checklist
- [ ] `docs/API_SPEC.md` generated or refreshed
- [ ] No `[PLACEHOLDER]` tokens left unreviewed by user
- [ ] Files committed to git
