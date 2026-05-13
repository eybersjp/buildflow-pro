# Product Requirements Document

**Project:** TaskFlow
**Version:** 1.0 (MVP)
**Status:** Approved
**Date:** 2026-05-13
**Author:** Product Manager (BuildFlow Pro)

---

## 1. Product Summary

TaskFlow is a lightweight, multi-tenant task management SaaS designed for remote teams of
2–50 people. It gives teams a single place to create tasks, assign owners, track progress,
and communicate — without the overhead of enterprise tools like Jira or Asana.

The core promise: **a task gets created in under 10 seconds, completed in one view.**

---

## 2. Problem Statement

Remote teams lose hours each week to task-tracking friction:

- Tasks created in Slack get buried and forgotten
- Spreadsheets have no ownership or status tracking
- Enterprise tools (Jira, Linear) are too complex for small teams
- Context switches between communication and task tools break focus

**TaskFlow** eliminates this by combining task creation, assignment, and lightweight
discussion in a single, fast interface.

---

## 3. Target Users

| Role | Description | Pain Points |
|---|---|---|
| **Team Manager** | Creates projects, assigns tasks, reviews progress | No single view of team workload |
| **Team Member** | Executes tasks, updates status, leaves comments | Unclear what to do next |
| **Admin** | Manages workspace members and billing | No user management tool |

---

## 4. User Roles

| Role | Permissions |
|---|---|
| `admin` | Full workspace access: manage members, billing, all projects |
| `manager` | Create/edit/delete projects, assign tasks, view all team tasks |
| `member` | View assigned projects, create/edit own tasks, comment |
| `viewer` | Read-only access to assigned projects |

---

## 5. MVP Feature List (In Scope — v1.0)

### F-01: Authentication

- Email + password signup and login (Supabase Auth)
- Password reset via email
- Session persistence (7-day token)
- Workspace creation on first login

### F-02: Workspace & Team Management

- Single workspace per account (multi-workspace in v2)
- Invite members by email
- Role assignment (admin, manager, member, viewer)
- Member list view

### F-03: Projects

- Create, rename, archive a project
- Project list view
- Project color labeling (8 preset colors)

### F-04: Tasks (Core Feature)

- Create task with: title, description, assignee, due date, priority (low/medium/high/urgent)
- Task status: `todo` → `in-progress` → `done` → `archived`
- Inline status update (drag or click)
- Filter by: status, assignee, priority, due date
- Keyboard shortcut: `C` to create task

### F-05: Task Comments

- Add/edit/delete comments on tasks
- @ mention teammates (notifies via email)
- Comment timestamps

### F-06: Notifications

- Email notification on: task assigned, comment mention, task due tomorrow
- In-app notification bell with unread count
- Mark all read

### F-07: Dashboard

- "My Tasks" view — tasks assigned to the current user
- Team board — Kanban-style columns per status
- Activity feed — last 20 actions across the workspace

---

## 6. Out of Scope (v1.0)

| Feature | Reason | Target Version |
|---|---|---|
| Multiple workspaces per user | Complexity, focus on single-team MVP | v2.0 |
| Time tracking | Out of core scope | v2.0 |
| File attachments | Storage complexity | v2.0 |
| Integrations (Slack, GitHub) | Post-MVP | v2.0 |
| Mobile app | Web-first approach | v3.0 |
| Custom fields on tasks | Complexity | v2.0 |
| API access for third parties | Post-MVP | v2.0 |
| Payments / billing | Free during beta | post-beta |

---

## 7. Core User Journeys

### Journey 1: New User Onboarding

```
Land on taskflow.app
  → Click "Start for free"
  → Enter name, email, password
  → Workspace auto-created ("My Workspace")
  → Redirected to empty dashboard
  → Prompted to create first project
  → Create project "Q2 Goals"
  → Create first task
  → (Optional) Invite a teammate
```

### Journey 2: Daily Task Work

```
Login → My Tasks view
  → See assigned tasks sorted by priority + due date
  → Click task → Task detail panel opens
  → Update status to "in-progress"
  → Add a comment
  → Close panel → Task list refreshes
```

### Journey 3: Manager Reviews Team Progress

```
Login → Team Board (Kanban)
  → Filter by project "Q2 Goals"
  → See all tasks across columns (todo / in-progress / done)
  → Click overdue task
  → Re-assign or update due date
  → Post comment: "@john please update status"
```

---

## 8. Acceptance Criteria

### F-04 Tasks — Core Acceptance Criteria

| # | Criterion | Test |
|---|---|---|
| AC-1 | A task can be created in < 5 seconds (keyboard shortcut `C`) | E2E |
| AC-2 | Status transitions are instant (optimistic UI) | Unit + E2E |
| AC-3 | Tasks filtered by assignee show only that person's tasks | Unit |
| AC-4 | Overdue tasks display a red due date indicator | E2E |
| AC-5 | A task with no assignee shows an "Unassigned" avatar | E2E |

---

## 9. Risks and Assumptions

| Risk | Severity | Mitigation |
|---|---|---|
| Real-time sync complexity (multiple users on same board) | 🟠 High | Use Supabase Realtime subscriptions — test under 10 concurrent users |
| Email deliverability for notifications | 🟡 Medium | Use Resend for transactional email, verify SPF/DKIM |
| Performance with large task lists (>500 tasks) | 🟡 Medium | Paginate at 50, virtual scroll for board view |
| Users not adopting keyboard shortcuts | 🟢 Low | Keyboard shortcut tooltip on first visit |

**Assumptions:**

- Users are on desktop browsers (Chrome, Firefox, Safari, Edge)
- Team size is ≤ 50 members in MVP
- English-only UI for v1.0
- No offline support required

---

## 10. Success Metrics

| Metric | Target (30 days post-launch) |
|---|---|
| Tasks created per active user per week | ≥ 5 |
| D7 retention | ≥ 40% |
| Time to create first task (new user) | < 2 minutes |
| Support tickets per 100 users | < 5 |

---

*Generated by BuildFlow Pro — Product Manager skill*
*Template: `.antigravity/skills/product-manager/templates/prd-template.md`*
