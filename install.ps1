# BuildFlow Pro — Installer for Windows (PowerShell)
# Version: 2.0.0 — Phase 1 Integration
# Installs the .antigravity production app builder kit into the current project

$Green = "`e[32m"
$Blue = "`e[34m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

Write-Host ""
Write-Host "${Blue}╔═══════════════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║          BuildFlow Pro — Production App Builder       ║${Reset}"
Write-Host "${Blue}║          Antigravity AI Development System v2.0       ║${Reset}"
Write-Host "${Blue}╚═══════════════════════════════════════════════════════╝${Reset}"
Write-Host ""
Write-Host "Installing BuildFlow Pro into: $(Get-Location)"
Write-Host ""

# ═══════════════════════════════════════════
# CREATE FOLDER STRUCTURE
# ═══════════════════════════════════════════
Write-Host "Creating folder structure..."

$folders = @(
    ".antigravity\rules",
    ".antigravity\rules\appendix",
    ".antigravity\workflows",
    ".antigravity\commands",
    ".antigravity\templates",
    ".antigravity\memory",
    ".antigravity\skills\product-manager\templates",
    ".antigravity\skills\software-architect\templates",
    ".antigravity\skills\database-engineer\templates",
    ".antigravity\skills\frontend-engineer\templates",
    ".antigravity\skills\backend-engineer\templates",
    ".antigravity\skills\qa-engineer\templates",
    ".antigravity\skills\security-engineer\templates",
    ".antigravity\skills\devops-engineer\templates",
    ".antigravity\skills\documentation-writer\templates",
    ".antigravity\skills\release-manager\templates",
    "docs\ADR",
    "database\migrations",
    "database\rollback",
    "database\seeds"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }
}

Write-Host "${Green}✓ Folders created${Reset}"

# ═══════════════════════════════════════════
# COPY KIT FILES
# ═══════════════════════════════════════════
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$kitDir = Join-Path $scriptDir "kit"

if (Test-Path $kitDir) {
    Write-Host "Copying kit files from $kitDir..."
    
    $kitAntigravity = Join-Path $kitDir ".antigravity"
    if (Test-Path $kitAntigravity) {
        Copy-Item -Path "$kitAntigravity\*" -Destination ".antigravity\" -Recurse -Force
    }
    
    Write-Host "${Green}✓ Kit files installed${Reset}"
} else {
    Write-Host "${Yellow}⚠ Kit directory not found. Creating minimal state files...${Reset}"
    
    @"
# Project State

## Current Phase
Phase 0: Discovery

## Next Recommended Workflow
Run: /start-production-app
"@ | Set-Content ".antigravity\memory\project-state.md"

    @"
# Project Context

## App Name
TBD

## Current Phase
Discovery
"@ | Set-Content ".antigravity\memory\project-context.md"
}

# ═══════════════════════════════════════════
# CREATE PROJECT DOCS STRUCTURE
# ═══════════════════════════════════════════
Write-Host "Creating project documentation structure..."

if (-not (Test-Path "docs\BUILD_ROADMAP.md")) {
    @"
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
"@ | Set-Content "docs\BUILD_ROADMAP.md"
}

Write-Host "${Green}✓ Project structure created${Reset}"

# ═══════════════════════════════════════════
# CONFIGURE CONTEXT-MODE HOOKS (Gemini CLI)
# ═══════════════════════════════════════════
Write-Host ""
Write-Host "Configuring context-mode hooks for Gemini CLI..."

$geminiDir = ".gemini"
$geminiSettings = Join-Path $geminiDir "settings.json"

if (-not (Test-Path $geminiSettings)) {
    if (-not (Test-Path $geminiDir)) {
        New-Item -ItemType Directory -Path $geminiDir -Force | Out-Null
    }
    
    $hooksConfig = @"
{
  "mcpServers": {},
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "cmd /c echo [BuildFlow Pro] Session started. && if exist .antigravity\\memory\\task-plan.md (echo Task plan found. Run /plan:status to orient.) else (echo No task plan found. Run /plan to create one.) && if exist .antigravity\\memory\\learned-patterns.md (echo Learned patterns available - scan before starting.) else (echo)"
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
            "command": "cmd /c echo [BuildFlow Pro] File write detected. Confirming scope alignment with task-plan.md..."
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
            "command": "cmd /c echo [BuildFlow Pro] File written. Update changelog.md. If a new pattern was learned, add it to learned-patterns.md."
          }
        ]
      }
    ]
  }
}
"@
    $hooksConfig | Set-Content $geminiSettings -Encoding UTF8
    Write-Host "${Green}✓ Gemini CLI hooks configured at $geminiSettings${Reset}"
} else {
    Write-Host "${Yellow}⚠ .gemini\settings.json already exists — skipping hook configuration${Reset}"
    Write-Host "  To add BuildFlow Pro hooks manually, see the context-mode section in the README."
}

# ═══════════════════════════════════════════
# UPDATE .gitignore
# ═══════════════════════════════════════════
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue

    if ($gitignoreContent -notmatch "\.env\.local") {
        Add-Content ".gitignore" "`n# Environment variables`n.env.local`n.env.production`n.env*.local"
        Write-Host "${Green}✓ Updated .gitignore (env files)${Reset}"
    }
    
    if ($gitignoreContent -notmatch "\.gemini") {
        Add-Content ".gitignore" "`n# Gemini AI settings (project-specific)`n# Remove this line if you want to commit .gemini/settings.json to the repo`n# .gemini/"
        Write-Host "${Green}✓ Updated .gitignore (gemini note added)${Reset}"
    }
}

# ═══════════════════════════════════════════
# DONE
# ═══════════════════════════════════════════
Write-Host ""
Write-Host "${Green}╔═══════════════════════════════════════════════════════╗${Reset}"
Write-Host "${Green}║       BuildFlow Pro v2.0 Installed Successfully!     ║${Reset}"
Write-Host "${Green}╚═══════════════════════════════════════════════════════╝${Reset}"
Write-Host ""
Write-Host "What's installed:"
Write-Host "  .antigravity\rules\         — 6 always-on rule files"
Write-Host "  .antigravity\workflows\     — 15 workflows (3 enhanced in v2.1)"
Write-Host "  .antigravity\skills\        — 10 core roles + 10 intelligence sub-skills"
Write-Host "  .antigravity\commands\      — 11 user-facing commands"
Write-Host "  .antigravity\templates\     — PRD, architecture, beautiful-docs (README/CONTRIBUTING/API)"
Write-Host "  .antigravity\memory\        — task-plan, architecture-graph, learned-patterns, debug-log"
Write-Host "  docs\                       — Documentation folder"
Write-Host "  database\                   — Migration and seed files"
Write-Host "  .gemini\settings.json       — Session continuity + learned-patterns hooks"
Write-Host ""
Write-Host "Sub-skills (Phase 2 + Phase 3):"
Write-Host "  frontend-engineer/ui-design-system.md        — 8-industry design system generator"
Write-Host "  frontend-engineer/component-patterns.md      — 6 React component patterns"
Write-Host "  qa-engineer/test-driven-development.md       — Red/Green/Refactor TDD loop"
Write-Host "  qa-engineer/webapp-testing.md                — Playwright E2E + accessibility"
Write-Host "  database-engineer/postgres-safe-queries.md   — 8 safe query patterns"
Write-Host "  software-architect/software-architecture.md  — Architecture pattern decision tree"
Write-Host "  software-architect/subagent-driven-dev.md    — Multi-agent coordination (great_cto)"
Write-Host "  release-manager/changelog-generator.md       — Keep a Changelog + SemVer"
Write-Host "  devops-engineer/dev-tooling-setup.md         — ESLint + Prettier + TypeScript + Husky"
Write-Host "  backend-engineer/error-handling-patterns.md  — Result<T> + typed errors"
Write-Host ""
Write-Host "${Blue}Next step:${Reset}"
Write-Host "  Open this project in Antigravity and run:"
Write-Host ""
Write-Host "  ${Yellow}/plan${Reset}                 — Create or load your project task plan"
Write-Host "  ${Yellow}/plan:status${Reset}          — Check current progress at any time"
Write-Host "  ${Yellow}/start-production-app${Reset} — Begin a new project from scratch"
Write-Host ""
Write-Host "  The system will guide you from idea to production."
Write-Host ""
