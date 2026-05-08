# API Contract Rules
# BuildFlow Pro — API Stability and Versioning Standards
# Version: 1.0.0 — Phase 1 Integration (Code-Kit-Ultra APIContractGate)

Any change to a public-facing API must pass the **APIContractGate** before deployment.

---

## What Is an API Contract?

An API contract is an implicit or explicit agreement between a server and its consumers about:
- The structure of request inputs
- The structure of response outputs
- The HTTP status codes returned for each scenario
- The authentication requirements for each route

Once an API is used by any consumer (frontend, mobile app, third-party integration, or another service), its contract is binding.

---

## Breaking vs. Non-Breaking Changes

### Breaking Changes (require APIContractGate review + versioning plan)

| Change | Why It Breaks Consumers |
|---|---|
| Removing a response field | Consumer code references the field |
| Renaming a response field | Consumer code references the old name |
| Changing a field's data type | Consumer type safety is violated |
| Changing an HTTP status code for success responses | Consumer checks for specific status codes |
| Removing an endpoint | Consumer cannot call the removed endpoint |
| Making an optional field required | Consumers not sending the field will fail |
| Changing the authentication requirement | Consumers without the new auth will be rejected |

### Non-Breaking Changes (safe to ship)

| Change | Why It Is Safe |
|---|---|
| Adding a new optional response field | Consumers ignore fields they don't use |
| Adding a new endpoint | Existing consumers are not affected |
| Adding a new optional query parameter | Consumers not using it are unaffected |
| Improving an error message text | Consumers should not parse error messages |
| Adding more specific error codes (subcodes) | Consumers handle the top-level status code |

---

## APIContractGate Evaluation

Before deploying any API change, evaluate:

**Gate: PASS conditions**
- [ ] No existing response fields were removed
- [ ] No existing response fields were renamed without a migration strategy
- [ ] No field data types were changed for existing consumers
- [ ] No HTTP status codes were changed for success responses
- [ ] No endpoints were removed without deprecation notice
- [ ] No required fields were added to existing endpoints without a default

**Gate: FAIL conditions (block deployment)**
- Existing consumer code would receive a different response shape
- A previously optional field is now required without a migration plan
- An endpoint used by the frontend was removed without updating the frontend simultaneously

---

## Versioning Strategy

When a breaking change is unavoidable:

### Option 1: Simultaneous Update (preferred for internal APIs)
Update both the API and all consumers in the same deployment. No versioning required.

### Option 2: API Versioning
Introduce a new version of the endpoint:
```
GET /api/v1/projects  ← legacy, deprecated
GET /api/v2/projects  ← new shape
```
- Maintain v1 for a minimum of one sprint after v2 ships
- Remove v1 only after all consumers have migrated
- Document the migration guide in `docs/API.md`

### Option 3: Deprecation Headers
For APIs consumed by third parties:
```typescript
// Add deprecation header to v1 route
response.headers.set('Deprecation', 'true');
response.headers.set('Sunset', 'Sat, 01 Jun 2026 00:00:00 GMT');
response.headers.set('Link', '</api/v2/projects>; rel="successor-version"');
```

---

## API Documentation Requirements

Every API endpoint must be documented in `docs/API.md` with:

```markdown
### [METHOD] /api/[resource]

[One line description]

**Authentication:** Required / Optional / None
**Authorization:** [roles that can call this endpoint]
**Since version:** [when this endpoint was introduced]
**Deprecated:** [yes/no, and when it will be removed if deprecated]

**Request Body:**
```json
{
  "field": "value"
}
```

**Response (200 / 201):**
```json
{
  "data": {},
  "error": null
}
```

**Error Responses:**
- `400 Bad Request` — [when]
- `401 Unauthorized` — [when]
- `403 Forbidden` — [when]
- `422 Unprocessable Entity` — [when]
- `500 Internal Server Error` — [when]
```

---

## Contract Drift Prevention

These practices prevent unintentional contract drift:

1. **Type-first development** — Define response types in TypeScript before implementing the route. The type IS the contract.
2. **Schema validation on responses** — Use Zod to validate outgoing responses in tests, not just incoming requests.
3. **Contract tests** — Write integration tests that assert the exact shape of API responses, not just their status codes.
4. **Changelog entries** — Every API change (breaking or non-breaking) must be recorded in `.antigravity/memory/changelog.md`.

---

## Response Schema Pinning

For any endpoint consumed by more than one team or service, pin the expected response schema in a contract test:

```typescript
// tests/contracts/projects-api.contract.test.ts

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const projectResponseSchema = z.object({
  data: z.object({
    id: z.string().uuid(),
    name: z.string(),
    status: z.enum(['draft', 'active', 'completed', 'archived']),
    created_at: z.string().datetime(),
  }).nullable(),
  error: z.string().nullable(),
});

describe('POST /api/projects contract', () => {
  it('should return the expected response shape', async () => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Contract Test Project' }),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testToken}` },
    });
    const body = await response.json();
    expect(() => projectResponseSchema.parse(body)).not.toThrow();
  });
});
```

---

*API contracts are promises to your consumers. Breaking them without a migration plan breaks trust and breaks production systems.*
