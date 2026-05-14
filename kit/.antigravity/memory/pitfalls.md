# Project Pitfall Log (AI Memory)

This file tracks recurring mistakes, anti-patterns, and logical errors encountered during this project. Review this before every new feature build.

| Date | Role | Pitfall | Anti-Pattern | Prevention Strategy |
|---|---|---|---|---|
| [Date] | [e.g., DB] | RLS policy was too broad | `USING(true)` | Use `auth.uid() = user_id` |

## 🧠 Learned Lessons

### 1. Architectural Pitfalls
- [e.g., Avoid prop-drilling in the Sidebar component]

### 2. Logic Pitfalls
- [e.g., Database migrations must always include a rollback script]

### 3. AI Patterns to Avoid
- [e.g., Don't try to refactor the entire `utils.ts` file in one go]
