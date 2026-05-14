#!/usr/bin/env bash
# BuildFlow Pro — Installer for Mac/Linux
# Version: 2.0.0 — Phase 1 Integration
# Installs the .antigravity production app builder kit into the current project

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          BuildFlow Pro — Production App Builder       ║${NC}"
echo -e "${BLUE}║          Antigravity AI Development System v2.0       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Installing BuildFlow Pro into: $(pwd)"
echo ""

# ═══════════════════════════════════════════
# CREATE FOLDER STRUCTURE
# ═══════════════════════════════════════════
echo "Creating folder structure..."

mkdir -p .antigravity/rules
mkdir -p .antigravity/rules/appendix
mkdir -p .antigravity/workflows
mkdir -p .antigravity/commands
mkdir -p .antigravity/templates
mkdir -p .antigravity/memory

mkdir -p .antigravity/skills/product-manager/templates
mkdir -p .antigravity/skills/software-architect/templates
mkdir -p .antigravity/skills/database-engineer/templates
mkdir -p .antigravity/skills/frontend-engineer/templates
mkdir -p .antigravity/skills/design-engineer/templates
mkdir -p .antigravity/skills/backend-engineer/templates
mkdir -p .antigravity/skills/qa-engineer/templates
mkdir -p .antigravity/skills/security-engineer/templates
mkdir -p .antigravity/skills/devops-engineer/templates
mkdir -p .antigravity/skills/documentation-writer/templates
mkdir -p .antigravity/skills/release-manager/templates

mkdir -p docs/ADR
mkdir -p database/migrations
mkdir -p database/rollback
mkdir -p database/seeds

echo -e "${GREEN}✓ Folders created${NC}"

# ═══════════════════════════════════════════
# COPY KIT FILES
# ═══════════════════════════════════════════

# Detect script directory (so we can find the kit)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
KIT_DIR="$SCRIPT_DIR/kit"

if [ -d "$KIT_DIR" ]; then
    echo "Copying kit files from $KIT_DIR..."
    cp -r "$KIT_DIR/.antigravity/." .antigravity/
    echo -e "${GREEN}✓ Kit files installed${NC}"
else
    echo -e "${YELLOW}⚠ Kit directory not found at $KIT_DIR${NC}"
    echo "Creating minimal state files instead..."
    
    # Create minimal memory files if kit not found
    cat > .antigravity/memory/project-state.md << 'STATE'
# Project State

## Current Phase
Phase 0: Discovery

## Next Recommended Workflow
Run: /start-production-app
STATE

    cat > .antigravity/memory/project-context.md << 'CONTEXT'
# Project Context

## App Name
TBD

## Current Phase
Discovery
CONTEXT

fi

# ═══════════════════════════════════════════
# CREATE PROJECT DOCS STRUCTURE
# ═══════════════════════════════════════════
echo "Creating project documentation structure..."

# Only create if they don't exist
[ ! -f "docs/BUILD_ROADMAP.md" ] && cat > docs/BUILD_ROADMAP.md << 'ROADMAP'
# Build Roadmap

This file is managed by BuildFlow Pro. Update it after each phase.

| Phase | Name | Status |
|---|---|---|
| 0 | Discovery | ⏳ Not Started |
| 1 | PRD | ⏳ Not Started |
| 2 | Architecture | ⏳ Not Started |
| 3 | Database | ⏳ Not Started |
| 4 | UI/UX Plan | ⏳ Not Started |
| 5 | Scaffold | ⏳ Not Started |
| 6 | Auth | ⏳ Not Started |
| 7 | Core Features | ⏳ Not Started |
| 8 | Testing | ⏳ Not Started |
| 9 | Security | ⏳ Not Started |
| 10 | Deploy | ⏳ Not Started |
| 11 | Monitoring | ⏳ Not Started |
ROADMAP

echo -e "${GREEN}✓ Project structure created${NC}"

# ═══════════════════════════════════════════
# CONFIGURE CONTEXT-MODE HOOKS (Gemini CLI)
# ═══════════════════════════════════════════
echo ""
echo "Configuring context-mode hooks for Gemini CLI..."

GEMINI_SETTINGS=".gemini/settings.json"

# Only create if not already present
if [ ! -f "$GEMINI_SETTINGS" ]; then
    mkdir -p .gemini
    cat > "$GEMINI_SETTINGS" << 'GEMINI_HOOKS'
{
  "mcpServers": {},
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[BuildFlow Pro] Session started.' && [ -f .antigravity/memory/task-plan.md ] && echo 'Task plan found. Run /plan:status to orient.' || echo 'No task plan found. Run /plan to create one.' && [ -f .antigravity/memory/learned-patterns.md ] && echo 'Learned patterns available — scan for relevant patterns before starting.' || true"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "write_file|replace_file_content|multi_replace_file_content",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[BuildFlow Pro] File write detected. Confirming scope alignment with task-plan.md...'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "write_file|replace_file_content|multi_replace_file_content",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[BuildFlow Pro] File written. Remember to update .antigravity/memory/changelog.md. If a new pattern was learned during this session, add it to .antigravity/memory/learned-patterns.md.'"
          }
        ]
      }
    ]
  }
}
GEMINI_HOOKS
    echo -e "${GREEN}✓ Gemini CLI hooks configured at $GEMINI_SETTINGS${NC}"
else
    echo -e "${YELLOW}⚠ .gemini/settings.json already exists — skipping hook configuration${NC}"
    echo "  To add BuildFlow Pro hooks manually, see the context-mode section in the README."
fi

# ═══════════════════════════════════════════
# ADD TO .gitignore
# ═══════════════════════════════════════════
if [ -f ".gitignore" ]; then
    if ! grep -q ".env.local" .gitignore; then
        echo "" >> .gitignore
        echo "# Environment variables" >> .gitignore
        echo ".env.local" >> .gitignore
        echo ".env.production" >> .gitignore
        echo ".env*.local" >> .gitignore
        echo -e "${GREEN}✓ Updated .gitignore (env files)${NC}"
    fi
    if ! grep -q ".gemini" .gitignore; then
        echo "" >> .gitignore
        echo "# Gemini AI settings (project-specific)" >> .gitignore
        echo "# Remove this line if you want to commit .gemini/settings.json to the repo" >> .gitignore
        echo "# .gemini/" >> .gitignore
        echo -e "${GREEN}✓ Updated .gitignore (gemini note added)${NC}"
    fi
fi

# ═══════════════════════════════════════════
# DONE
# ═══════════════════════════════════════════
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         BuildFlow Pro v2.0 Installed Successfully!   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "What's installed:"
echo "  .antigravity/rules/         — 6 always-on rule files"
echo "  .antigravity/workflows/     — 15 workflows (3 enhanced in v2.1)"
echo "  .antigravity/skills/        — 11 core roles + 10 intelligence sub-skills"
echo "  .antigravity/commands/      — 11 user-facing commands"
echo "  .antigravity/templates/     — PRD, architecture, beautiful-docs (README/CONTRIBUTING/API)"
echo "  .antigravity/memory/        — task-plan, architecture-graph, learned-patterns, debug-log"
echo "  docs/                       — Documentation folder"
echo "  database/                   — Migration and seed files"
echo "  .gemini/settings.json       — Session continuity + learned-patterns hooks"
echo ""
echo "Sub-skills (Phase 2 + Phase 3):"
echo "  frontend-engineer/ui-design-system.md        — 8-industry design system generator"
echo "  frontend-engineer/component-patterns.md      — 6 React component patterns"
echo "  qa-engineer/test-driven-development.md       — Red/Green/Refactor TDD loop"
echo "  qa-engineer/webapp-testing.md                — Playwright E2E + accessibility"
echo "  database-engineer/postgres-safe-queries.md   — 8 safe query patterns"
echo "  software-architect/software-architecture.md  — Architecture pattern decision tree"
echo "  software-architect/subagent-driven-dev.md    — Multi-agent coordination (great_cto)"
echo "  release-manager/changelog-generator.md       — Keep a Changelog + SemVer"
echo "  devops-engineer/dev-tooling-setup.md         — ESLint + Prettier + TypeScript + Husky"
echo "  backend-engineer/error-handling-patterns.md  — Result<T> + typed errors"
echo ""
echo -e "${BLUE}Next step:${NC}"
echo "  Open this project in Antigravity and run:"
echo ""
echo -e "  ${YELLOW}/plan${NC}                 — Create or load your project task plan"
echo -e "  ${YELLOW}/plan:status${NC}          — Check current progress at any time"
echo -e "  ${YELLOW}/start-production-app${NC} — Begin a new project from scratch"
echo ""
echo "  The system will guide you from idea to production."
echo ""
