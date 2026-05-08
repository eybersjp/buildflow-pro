# Command: /mode
# BuildFlow Pro — System Command

## Purpose

Switch the project's development mode between **Production** and **Prototype**.

## Trigger

- `/mode production`
- `/mode prototype`
- `/mode` (shows current mode and options)

---

## Logic

1. **Check Current Mode:** Read `.antigravity/memory/project-context.md` -> `Development Mode`.
2. **If no argument provided:** Display current mode and describe differences.
3. **If "production" provided:**
   - Update `project-context.md` to `Production`.
   - Message: "🏆 Mode switched to **Production**. 9-Gate Governance and full documentation are now active."
4. **If "prototype" provided:**
   - Update `project-context.md` to `Prototype`.
   - Message: "🚀 Mode switched to **Prototype**. Documentation requirements relaxed. Speed mode active."

## Enforcement

Once a mode is set in `project-context.md`, the AI must adhere to the rules defined for that mode in `core-rules-dense.md`.
