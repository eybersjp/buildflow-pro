# API Specification

**Project:** TaskFlow
**Version:** 1.0 (MVP)
**Status:** Approved
**Date:** 2026-05-13
**Author:** Backend Engineer (BuildFlow Pro)

---

## Overview

All API routes live under `/api/`. All responses follow the unified shape:

```typescript
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  code: number;
}
```

All authenticated endpoints require a valid session cookie (`access_token`).
Unauthenticated requests return `401`.

**Base URL:** `https://taskflow.app/api`

---

## Authentication

### POST `/api/auth/login`

**Auth required:** No

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response 200:**

```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "full_name": "Jane Smith" },
    "workspace": { "id": "uuid", "name": "Acme Team", "slug": "acme-team" }
  },
  "error": null,
  "code": 200
}
```

Sets `httpOnly` cookie: `access_token`

**Response 401:**

```json
{ "data": null, "error": "Invalid email or password", "code": 401 }
```

### POST `/api/auth/logout`

**Auth required:** Yes  
Clears the `access_token` cookie. Returns `200`.

### POST `/api/auth/signup`

**Auth required:** No

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "Jane Smith",
  "workspace_name": "Acme Team"
}
```

**Response 201:** Creates user + workspace + makes user `admin`.

---

## Tasks

### GET `/api/tasks`

**Auth required:** Yes

**Query params:**

| Param | Type | Description |
|---|---|---|
| `project_id` | `uuid` | Filter by project |
| `assignee_id` | `uuid` | Filter by assignee |
| `status` | `string` | `todo` \| `in-progress` \| `done` \| `archived` |
| `priority` | `string` | `low` \| `medium` \| `high` \| `urgent` |
| `page` | `number` | Default: 1 |
| `per_page` | `number` | Default: 50, max: 100 |

**Response 200:**

```json
{
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Set up CI pipeline",
        "description": "Configure GitHub Actions for test + deploy",
        "status": "in-progress",
        "priority": "high",
        "assignee_id": "uuid",
        "project_id": "uuid",
        "due_date": "2026-05-20",
        "created_at": "2026-05-13T10:00:00Z",
        "updated_at": "2026-05-13T12:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 50,
      "total": 1,
      "total_pages": 1
    }
  },
  "error": null,
  "code": 200
}
```

### POST `/api/tasks`

**Auth required:** Yes (role: `admin`, `manager`, `member`)

**Request:**

```json
{
  "project_id": "uuid",
  "title": "Design login page",
  "description": "Figma reference: [link]",
  "priority": "medium",
  "assignee_id": "uuid",
  "due_date": "2026-05-25"
}
```

**Response 201:** Returns the created task object.  
**Response 422:** Validation error (title empty, invalid priority, etc.)

### PATCH `/api/tasks/[id]`

**Auth required:** Yes (assignee or `admin`/`manager`)

**Request (partial update):**

```json
{
  "status": "done",
  "priority": "urgent"
}
```

**Response 200:** Returns the updated task.  
**Response 403:** User is not the assignee and is not admin/manager.  
**Response 404:** Task not found in workspace.

### DELETE `/api/tasks/[id]`

**Auth required:** Yes (role: `admin`, `manager`)

**Response 200:** `{ "data": { "deleted": true }, "error": null, "code": 200 }`

---

## Comments

### GET `/api/tasks/[id]/comments`

**Auth required:** Yes

**Response 200:**

```json
{
  "data": {
    "comments": [
      {
        "id": "uuid",
        "body": "Updated the CI config. @jane can you review?",
        "author_id": "uuid",
        "created_at": "2026-05-13T14:00:00Z"
      }
    ]
  },
  "error": null,
  "code": 200
}
```

### POST `/api/tasks/[id]/comments`

**Request:**

```json
{ "body": "Looks good to me! Approved." }
```

**Response 201:** Returns the created comment.

### DELETE `/api/comments/[id]`

**Auth required:** Yes (comment author or `admin`)  
**Response 200:** Soft-deleted (body replaced with `[deleted]`).

---

## Projects

### GET `/api/projects`

Returns all non-archived projects for the workspace.

### POST `/api/projects`

**Auth required:** Yes (role: `admin`, `manager`)

```json
{ "name": "Q2 Roadmap", "color": "blue" }
```

### PATCH `/api/projects/[id]`

Supports: `name`, `color`, `archived`.

---

## Notifications

### GET `/api/notifications`

**Query:** `?unread=true` to filter unread only.

### PATCH `/api/notifications/read-all`

Marks all notifications as read for the current user. Returns `200`.

---

## Authorization Matrix

| Endpoint | viewer | member | manager | admin |
|---|---|---|---|---|
| Read tasks | ✅ | ✅ | ✅ | ✅ |
| Create task | ❌ | ✅ | ✅ | ✅ |
| Update own task | ❌ | ✅ | ✅ | ✅ |
| Update any task | ❌ | ❌ | ✅ | ✅ |
| Delete task | ❌ | ❌ | ✅ | ✅ |
| Create project | ❌ | ❌ | ✅ | ✅ |
| Manage members | ❌ | ❌ | ❌ | ✅ |

---

## Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad request — malformed JSON |
| 401 | Unauthenticated — missing or expired session |
| 403 | Forbidden — authenticated but insufficient role |
| 404 | Not found — resource doesn't exist in this workspace |
| 422 | Validation error — request passes auth but fails schema validation |
| 500 | Internal server error — DB or service error (details masked) |

---

## API Contract Rules

1. **No breaking changes** in v1 — do not remove fields or change types
2. **New optional fields** may be added without a version bump
3. **Breaking changes** require `/api/v2/` prefix
4. All 500 errors are masked — internal DB messages never reach the client

---

*Generated by BuildFlow Pro — Backend Engineer skill*
