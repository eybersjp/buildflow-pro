---
name: error-handling-patterns
description: Production-grade error handling architecture for Node.js/TypeScript backend services — typed error classes, Result<T,E> pattern, error boundary strategies, structured logging, and client-safe error messages. Prevents raw database errors from leaking to clients and ensures every error is observable. Activate when building any service function or API route.
version: 1.0.0
triggers:
  - "error handling"
  - "how should I handle errors"
  - "error pattern"
  - "Result type"
  - "typed errors"
lifecycle: build
---

# Error Handling Patterns
# BuildFlow Pro — Backend Intelligence Layer
# Source: sickn33/antigravity-awesome-skills pattern

## Overview

Inconsistent error handling is one of the most common causes of production incidents. This skill establishes a consistent, typed, observable error architecture for all backend code in BuildFlow Pro projects.

**Goals of this pattern:**
1. No raw error messages from database/infrastructure leak to clients
2. Every error is logged with enough context to debug
3. API consumers always receive a predictable error shape
4. Error causes are explicitly modelled in the type system (not just runtime behaviour)

---

## Core Error Architecture

### The Error Hierarchy

```typescript
// src/lib/errors.ts

// ── Base error ─────────────────────────────────────────────────
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean; // operational = expected, non-operational = bug
  public readonly context?: Record<string, unknown>;

  constructor({
    message,
    code,
    statusCode = 500,
    isOperational = true,
    context,
  }: {
    message: string;
    code: string;
    statusCode?: number;
    isOperational?: boolean;
    context?: Record<string, unknown>;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ── Domain errors (operational — expected business scenarios) ──
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super({ message, code: 'VALIDATION_ERROR', statusCode: 400, context: { field } });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super({
      message: `${resource} not found`,
      code: 'NOT_FOUND',
      statusCode: 404,
      context: { resource, id },
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super({ message, code: 'UNAUTHORIZED', statusCode: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(action?: string) {
    super({
      message: 'Insufficient permissions',
      code: 'FORBIDDEN',
      statusCode: 403,
      context: { action },
    });
  }
}

export class ConflictError extends AppError {
  constructor(resource: string, detail?: string) {
    super({
      message: `${resource} already exists`,
      code: 'CONFLICT',
      statusCode: 409,
      context: { resource, detail },
    });
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds?: number) {
    super({
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      context: { retryAfterSeconds },
    });
  }
}

// ── Infrastructure errors (non-operational — should not occur normally) ──
export class DatabaseError extends AppError {
  constructor(operation: string, cause?: unknown) {
    super({
      message: 'A database error occurred. Please try again.',
      code: 'DATABASE_ERROR',
      statusCode: 500,
      isOperational: false,
      context: { operation, cause: String(cause) },
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, cause?: unknown) {
    super({
      message: `An error occurred with an external service. Please try again.`,
      code: 'EXTERNAL_SERVICE_ERROR',
      statusCode: 502,
      isOperational: false,
      context: { service, cause: String(cause) },
    });
  }
}
```

---

### The Result<T, E> Pattern

All service functions return a `Result` type instead of throwing. This makes error handling explicit in the type system.

```typescript
// src/lib/result.ts

export type Result<T, E extends AppError = AppError> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data, error: null };
}

export function err<E extends AppError>(error: E): Result<never, E> {
  return { success: false, data: null, error };
}

// ── Type guard ─────────────────────────────────────────────────
export function isOk<T>(result: Result<T>): result is { success: true; data: T; error: null } {
  return result.success;
}
```

---

### Service Function with Result Pattern

```typescript
// src/services/project.service.ts
import { ok, err } from '@/lib/result';
import { ValidationError, NotFoundError, ForbiddenError, DatabaseError } from '@/lib/errors';
import { createProjectSchema } from '@/lib/validations/project';
import { logAuditEvent } from '@/services/audit.service';
import { logger } from '@/lib/logger';
import type { ServiceContext } from '@/types/service';
import type { Project, CreateProjectInput } from '@/types/project';

export async function createProject(
  input: unknown,
  ctx: ServiceContext
) {
  // ── 1. Validate input ────────────────────────────────────────
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid input'));
  }

  // ── 2. Authorize ─────────────────────────────────────────────
  const allowedRoles = ['admin', 'manager'] as const;
  if (!allowedRoles.includes(ctx.userRole as typeof allowedRoles[number])) {
    return err(new ForbiddenError('create project'));
  }

  // ── 3. Execute ───────────────────────────────────────────────
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...parsed.data,
      tenant_id: ctx.tenantId,
      created_by: ctx.userId,
    })
    .select('id, name, description, status, created_at')
    .single();

  if (error) {
    // Log the real error internally, return a safe message externally
    logger.error('createProject: DB insert failed', {
      error: error.message,
      tenantId: ctx.tenantId,
      userId: ctx.userId,
    });
    return err(new DatabaseError('insert project', error));
  }

  // ── 4. Side effects ──────────────────────────────────────────
  await logAuditEvent({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    entityType: 'project',
    entityId: data.id,
    action: 'create',
    metadata: { name: data.name },
  });

  return ok(data);
}
```

---

### API Route Error Handling

```typescript
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/services/project.service';
import { getAuthContext } from '@/lib/auth/server';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  // ── 1. Parse body ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'INVALID_JSON' },
      { status: 400 }
    );
  }

  // ── 2. Get auth context ───────────────────────────────────────
  const authResult = await getAuthContext(request);
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error.message, code: authResult.error.code },
      { status: authResult.error.statusCode }
    );
  }

  // ── 3. Call service ───────────────────────────────────────────
  const result = await createProject(body, authResult.data);

  // ── 4. Handle result ──────────────────────────────────────────
  if (!result.success) {
    const { error } = result;

    // Log non-operational errors (bugs) at error level
    if (!error.isOperational) {
      logger.error('Unhandled error in POST /api/projects', {
        code: error.code,
        context: error.context,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: error.message,      // safe for client
        code: error.code,          // machine-readable code for client
        // NEVER include error.context in the response — it may contain sensitive data
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json({ data: result.data }, { status: 201 });
}
```

---

### Structured Logger

```typescript
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

interface Logger {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    environment: process.env.NODE_ENV,
    ...context,
  });
}

export const logger: Logger = {
  debug: (message, context) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(createLogEntry('debug', message, context));
    }
  },
  info: (message, context) => {
    console.info(createLogEntry('info', message, context));
  },
  warn: (message, context) => {
    console.warn(createLogEntry('warn', message, context));
  },
  error: (message, context) => {
    console.error(createLogEntry('error', message, context));
    // In production, also send to Sentry:
    // Sentry.captureException(new Error(message), { extra: context });
  },
};
```

---

### Error Response Shape (API Contract)

All API errors follow this shape — never deviate:

```typescript
// ── Error response type ────────────────────────────────────────
interface ApiErrorResponse {
  error: string;    // human-readable message (safe for display)
  code: string;     // machine-readable code (for client error handling)
  // NO: stack, context, internal details — NEVER expose these
}

// ── Client-side error handling ─────────────────────────────────
const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested item was not found.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to do this.',
  CONFLICT: 'This item already exists.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment.',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
  EXTERNAL_SERVICE_ERROR: 'A service is temporarily unavailable. Please try again.',
};

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ code: 'UNKNOWN', error: 'Request failed' }));
    const userMessage = ERROR_MESSAGES[errorBody.code] ?? errorBody.error ?? 'An error occurred.';
    throw new Error(userMessage);
  }

  const body = await response.json();
  return body.data as T;
}
```

---

## Error Handling Rules

1. **Never `throw` in service functions** — return `err()` instead
2. **Never expose internal error details to clients** — use `error.message` (which is client-safe), never `error.context`
3. **Log every error internally** — even if the client sees only "Something went wrong"
4. **Non-operational errors trigger alerts** — log at `error` level and send to Sentry
5. **Validation errors are 400** — never 500
6. **Unauthorised is 401** — "I don't know who you are"
7. **Forbidden is 403** — "I know who you are, but you can't do this"
8. **Not Found is 404** — but only if the resource would be visible to the user if they had permission (otherwise 403)

---

## Verification

Before shipping any service function or API route:

- [ ] Service function uses `Result<T>` return type — never throws
- [ ] All database errors are caught and wrapped in `DatabaseError`
- [ ] The client receives only `error.message` and `error.code` — no internal details
- [ ] All errors are logged with `logger.error()` including context
- [ ] Validation errors return 400
- [ ] Auth errors return 401 or 403 (not 404 or 500)
- [ ] A unit test exists that asserts safe error messages are returned

---

## Anti-Rationalisations

- ❌ "Just throw and let the global handler catch it" — Global handlers lose the error context. Be explicit.
- ❌ "The error message from the database is fine to return" — Database errors contain table names, column names, and query details. Never send to client.
- ❌ "We'll add proper error handling later" — Production incidents are caused by errors with no context. Set this up from the start.
- ❌ "Operational vs. non-operational is overkill" — The distinction drives alerting. Non-operational errors wake people up. Operational errors are expected.
