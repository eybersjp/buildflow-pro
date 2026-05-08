# Command: /review-code

When this command is run, perform a thorough code review.

## What to Review

1. **Correctness** — Does the code do what it's supposed to?
2. **Security** — Auth, authorization, tenant isolation, input validation
3. **Quality** — Follows coding-rules.md standards
4. **Tests** — Coverage adequate?
5. **Performance** — Any N+1 queries, blocking operations?
6. **Documentation** — Complex logic commented?

## Output Format

```markdown
## Code Review: [scope]

### ✅ Looks Good
- [positive findings]

### ⚠️ Suggestions
- [non-blocking improvements]

### ❌ Must Fix
- [blocking issues]

### Security Check
- Auth enforced: ✅ / ❌
- Tenant isolation: ✅ / ❌
- Input validation: ✅ / ❌

### Overall: APPROVE / REQUEST CHANGES
```
