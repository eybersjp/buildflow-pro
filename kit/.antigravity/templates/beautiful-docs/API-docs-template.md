# API Documentation — [APP_NAME]

> **Version:** [API_VERSION] | **Base URL:** `https://[your-domain]/api` | **Auth:** Bearer (Supabase JWT)

---

## Overview

This document describes all API endpoints for [APP_NAME]. All endpoints follow these conventions:

- **Authentication:** All endpoints (except `/health`) require a valid Supabase JWT token in the `Authorization` header
- **Tenant isolation:** All responses are automatically scoped to the authenticated user's tenant
- **Response shape:** All responses use a consistent `{ data, error }` envelope
- **Error codes:** All errors include a machine-readable `code` field — see [Error Reference](#error-reference)
- **Pagination:** List endpoints support `page` and `pageSize` query parameters (default: page=1, pageSize=20, max: 200)

---

## Authentication

### Headers

```http
Authorization: Bearer <supabase-jwt-token>
Content-Type: application/json
```

### Getting a Token

```typescript
// Client-side (browser)
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Usage
fetch('/api/projects', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Token Expiry

Tokens expire after 1 hour. The Supabase client refreshes them automatically. If you receive a `401 UNAUTHORIZED` response, re-authenticate.

---

## Response Envelope

### Success

```json
{
  "data": { ... }
}
```

Or for lists:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

### Error

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

---

## Endpoints

---

### Health Check

#### `GET /api/health`

Returns the API health status. Does not require authentication.

**Response `200`:**
```json
{
  "data": {
    "status": "ok",
    "version": "1.3.0",
    "timestamp": "2026-05-08T06:00:00.000Z"
  }
}
```

---

### Projects

#### `GET /api/projects`

List all projects for the authenticated tenant.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number (1-indexed) |
| `pageSize` | integer | 20 | Results per page (max: 200) |
| `status` | string | — | Filter by status: `active`, `completed`, `draft`, `archived` |
| `search` | string | — | Full-text search on name and description |

**Required Role:** Any authenticated user

**Response `200`:**
```json
{
  "data": [
    {
      "id": "proj_01j2abc...",
      "name": "Solar Installation Q1",
      "description": "Residential solar project",
      "status": "active",
      "created_at": "2026-01-15T09:30:00.000Z",
      "updated_at": "2026-04-01T14:22:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

**Error Responses:**

| Status | Code | Cause |
|---|---|---|
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 500 | `DATABASE_ERROR` | Internal database error |

---

#### `POST /api/projects`

Create a new project.

**Required Role:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "Solar Installation Q2",
  "description": "Residential solar project for Q2 2026",
  "status": "draft"
}
```

**Validation Rules:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | ✅ | 1–100 characters |
| `description` | string | ⬜ | max 500 characters |
| `status` | string | ⬜ | One of: `draft`, `active` (default: `draft`) |

**Response `201`:**
```json
{
  "data": {
    "id": "proj_01j2xyz...",
    "name": "Solar Installation Q2",
    "description": "Residential solar project for Q2 2026",
    "status": "draft",
    "created_at": "2026-05-08T06:00:00.000Z",
    "updated_at": "2026-05-08T06:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Cause |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid or missing required fields |
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 403 | `FORBIDDEN` | User role cannot create projects |
| 500 | `DATABASE_ERROR` | Internal database error |

---

#### `GET /api/projects/:id`

Get a single project by ID.

**Required Role:** Any authenticated user (tenant-scoped)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | UUID | Project ID |

**Response `200`:**
```json
{
  "data": {
    "id": "proj_01j2abc...",
    "name": "Solar Installation Q1",
    "description": "Residential solar project",
    "status": "active",
    "created_by": {
      "id": "usr_01j1abc...",
      "full_name": "Jane Smith",
      "email": "jane@example.com"
    },
    "members": [
      {
        "id": "pm_01j1...",
        "role": "manager",
        "user": {
          "id": "usr_01j2...",
          "full_name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "created_at": "2026-01-15T09:30:00.000Z",
    "updated_at": "2026-04-01T14:22:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Cause |
|---|---|---|
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 404 | `NOT_FOUND` | Project does not exist or is in a different tenant |
| 500 | `DATABASE_ERROR` | Internal database error |

---

#### `PUT /api/projects/:id`

Update a project.

**Required Role:** `admin`, `manager`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | UUID | Project ID |

**Request Body:** (all fields optional — send only what changes)
```json
{
  "name": "Updated Project Name",
  "status": "active"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "proj_01j2abc...",
    "name": "Updated Project Name",
    "status": "active",
    "updated_at": "2026-05-08T06:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Cause |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid field value |
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 403 | `FORBIDDEN` | User role cannot update projects |
| 404 | `NOT_FOUND` | Project not found |
| 500 | `DATABASE_ERROR` | Internal database error |

---

#### `DELETE /api/projects/:id`

Soft-delete a project. The project is not permanently removed — it is marked as deleted and excluded from future queries.

**Required Role:** `admin`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | UUID | Project ID |

**Response `200`:**
```json
{
  "data": { "success": true }
}
```

**Error Responses:**

| Status | Code | Cause |
|---|---|---|
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 403 | `FORBIDDEN` | User role cannot delete projects |
| 404 | `NOT_FOUND` | Project not found |
| 500 | `DATABASE_ERROR` | Internal database error |

---

## Error Reference

All error responses include `error` (human-readable) and `code` (machine-readable):

| Code | HTTP Status | Meaning | Recommended Client Action |
|---|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed validation | Display field-level errors |
| `INVALID_JSON` | 400 | Request body is not valid JSON | Fix request format |
| `UNAUTHORIZED` | 401 | No valid session token | Redirect to login |
| `FORBIDDEN` | 403 | Authenticated but lacks permission | Show permission error |
| `NOT_FOUND` | 404 | Resource doesn't exist (or not in your tenant) | Show not-found state |
| `CONFLICT` | 409 | Resource already exists | Show conflict message |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Retry after delay |
| `DATABASE_ERROR` | 500 | Internal database error | Show generic error + retry |
| `EXTERNAL_SERVICE_ERROR` | 502 | Upstream service unavailable | Show service unavailable + retry |

---

## Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/*` | 10 requests | 1 minute |
| All other endpoints | 100 requests | 1 minute |

Rate limit responses include the `Retry-After` header with seconds until the limit resets.

---

## Versioning

This API follows **Semantic Versioning** for breaking changes:

- **Non-breaking changes** (new optional fields, new endpoints) — no version bump
- **Breaking changes** (removing fields, changing field types, removing endpoints) — major version bump, minimum 30-day deprecation notice

Current version: `v1` — accessed via the default base URL.

Future breaking changes will be available at `/api/v2/...` while `/api/v1/...` remains available for 90 days after the deprecation announcement.

---

## SDK / Client Examples

### TypeScript

```typescript
// lib/api-client.ts

const API_BASE = '/api';

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? ''}`,
    },
    ...options,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new ApiError(body.error ?? 'Request failed', body.code ?? 'UNKNOWN', response.status);
  }

  return body.data as T;
}

// Usage
const projects = await apiFetch<Project[]>('/projects?status=active');
const project = await apiFetch<Project>('/projects', {
  method: 'POST',
  body: JSON.stringify({ name: 'My Project' }),
});
```

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | [DATE] | Initial API — projects CRUD |

*See [CHANGELOG.md](../CHANGELOG.md) for the full project changelog.*
