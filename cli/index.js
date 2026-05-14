#!/usr/bin/env node
// BuildFlow Pro CLI
// Usage:
//   npx buildflow-pro init      Install into current project
//   npx buildflow-pro upgrade   Upgrade kit files (preserves memory)
//   npx buildflow-pro --version Print version
//   npx buildflow-pro --help    Print usage

const fs = require('fs');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────

const PKG = require('../package.json');
const VERSION = PKG.version;

// Files/directories that belong to the user — never overwrite on upgrade
const USER_OWNED_PATHS = [
  '.antigravity/memory',
];

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

// ─── --version ────────────────────────────────────────────────────────────────

if (command === '--version' || command === '-v') {
  console.log(`buildflow-pro v${VERSION}`);
  process.exit(0);
}

// ─── --help ───────────────────────────────────────────────────────────────────

if (command === '--help' || command === '-h' || !command) {
  console.log('');
  console.log('BuildFlow Pro — Production App Builder for Antigravity');
  console.log(`Version: ${VERSION}`);
  console.log('');
  console.log('Usage:');
  console.log('  npx buildflow-pro init        Install into current project');
  console.log('  npx buildflow-pro upgrade     Upgrade kit files (preserves memory & customizations)');
  console.log('  npx buildflow-pro --version   Print version');
  console.log('  npx buildflow-pro --help      Print this help message');
  console.log('');
  console.log('After install, open your project in Antigravity and run:');
  console.log('  /start-production-app');
  console.log('');
  process.exit(0);
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

const cwd = process.cwd();
const kitDir = path.join(__dirname, '..', 'kit');
const kitAntigravity = path.join(kitDir, '.antigravity');

/**
 * Recursively copy a directory tree.
 * @param {string} src  - Source directory
 * @param {string} dest - Destination directory
 * @param {boolean} overwrite - Whether to overwrite existing files
 */
function copyDir(src, dest, overwrite = true) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, overwrite);
    } else {
      if (overwrite || !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * Returns true if destRelPath is within any user-owned path.
 * @param {string} relPath - Path relative to cwd
 */
function isUserOwned(relPath) {
  return USER_OWNED_PATHS.some((p) => relPath.startsWith(p));
}

/**
 * Recursively copy kit files, skipping user-owned paths.
 * Used by `upgrade`.
 * @param {string} src      - Source directory (kit/.antigravity/...)
 * @param {string} dest     - Destination directory (.antigravity/...)
 * @param {string} relBase  - Relative base for ownership checks
 */
function copyDirSelective(src, dest, relBase) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relPath = path.join(relBase, entry.name).replace(/\\/g, '/');

    if (isUserOwned(relPath)) {
      // Skip — belongs to the user
      continue;
    }

    if (entry.isDirectory()) {
      copyDirSelective(srcPath, destPath, relPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── Shared folder structure ───────────────────────────────────────────────────

const folders = [
  '.antigravity/rules',
  '.antigravity/rules/appendix',
  '.antigravity/workflows',
  '.antigravity/commands',
  '.antigravity/templates',
  '.antigravity/memory',
  '.antigravity/skills/product-manager/templates',
  '.antigravity/skills/software-architect/templates',
  '.antigravity/skills/database-engineer/templates',
  '.antigravity/skills/frontend-engineer/templates',
  '.antigravity/skills/design-engineer/templates',
  '.antigravity/skills/sre-engineer/templates',
  '.antigravity/skills/growth-engineer/templates',
  '.antigravity/skills/backend-engineer/templates',
  '.antigravity/skills/qa-engineer/templates',
  '.antigravity/skills/security-engineer/templates',
  '.antigravity/skills/devops-engineer/templates',
  '.antigravity/skills/documentation-writer/templates',
  '.antigravity/skills/release-manager/templates',
  'docs/ADR',
  'database/migrations',
  'database/rollback',
  'database/seeds',
  'examples',
];

// ─── init ─────────────────────────────────────────────────────────────────────

if (command === 'init') {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║          BuildFlow Pro — Production App Builder       ║');
  console.log(`║          v${VERSION.padEnd(46)}║`);
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Installing into: ${cwd}`);
  console.log('');

  // Create folders
  folders.forEach((folder) => {
    const fullPath = path.join(cwd, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('✓ Folders created');

  // Copy kit files
  if (fs.existsSync(kitAntigravity)) {
    copyDir(kitAntigravity, path.join(cwd, '.antigravity'));
    console.log('✓ Kit files installed');
  } else {
    console.log('⚠ Kit not found at expected path — creating minimal state files');
  }

  // Create BUILD_ROADMAP.md if it doesn't exist
  const roadmapPath = path.join(cwd, 'docs', 'BUILD_ROADMAP.md');
  if (!fs.existsSync(roadmapPath)) {
    fs.writeFileSync(roadmapPath, `# Build Roadmap

This file is managed by BuildFlow Pro.

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
`);
  }

  console.log('✓ Project structure created');

  // Configure context-mode hooks (Gemini CLI / Antigravity)
  console.log('');
  console.log('Configuring Antigravity session hooks...');

  const geminiDir = path.join(cwd, '.gemini');
  const geminiSettings = path.join(geminiDir, 'settings.json');

  if (!fs.existsSync(geminiSettings)) {
    if (!fs.existsSync(geminiDir)) {
      fs.mkdirSync(geminiDir, { recursive: true });
    }

    const hooksConfig = {
      "mcpServers": {},
      "hooks": {
        "SessionStart": [
          {
            "matcher": ".*",
            "hooks": [
              {
                "type": "command",
                "command": "cmd /c echo [BuildFlow Pro] Session started. && if exist .antigravity\\\\memory\\\\task-plan.md (echo Task plan found. Run /plan:status to orient.) else (echo No task plan found. Run /plan to create one.) && if exist .antigravity\\\\memory\\\\learned-patterns.md (echo Learned patterns available - scan before starting.) else (echo)"
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
    };

    fs.writeFileSync(geminiSettings, JSON.stringify(hooksConfig, null, 2), 'utf8');
    console.log('✓ Antigravity hooks configured at .gemini/settings.json');
  } else {
    console.log('✓ Antigravity hooks already configured');
  }

  // Done
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         BuildFlow Pro Installed Successfully!         ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Next step:');
  console.log('  Open this project in Antigravity and run:');
  console.log('');
  console.log('  /start-production-app');
  console.log('');
  console.log('  The system will guide you from idea to production.');
  console.log('');
  process.exit(0);
}

// ─── upgrade ──────────────────────────────────────────────────────────────────

if (command === 'upgrade') {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║          BuildFlow Pro — Upgrade Kit Files            ║');
  console.log(`║          v${VERSION.padEnd(46)}║`);
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Upgrading in: ${cwd}`);
  console.log('');

  // Verify this is an initialized project
  const antigravityDir = path.join(cwd, '.antigravity');
  if (!fs.existsSync(antigravityDir)) {
    console.log('✗ No .antigravity directory found.');
    console.log('  Run `npx buildflow-pro init` first to initialize this project.');
    console.log('');
    process.exit(1);
  }

  // Ensure any new folders introduced in this version exist
  folders.forEach((folder) => {
    const fullPath = path.join(cwd, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('✓ Folder structure verified');

  // Copy kit files, skipping user-owned paths (memory/)
  if (fs.existsSync(kitAntigravity)) {
    copyDirSelective(kitAntigravity, antigravityDir, '.antigravity');
    console.log('✓ Kit files upgraded (rules, workflows, commands, skills)');
    console.log('✓ Memory files preserved (not overwritten)');
  } else {
    console.log('⚠ Kit not found — nothing to upgrade.');
    process.exit(1);
  }

  // Done
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         BuildFlow Pro Upgraded Successfully!          ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Upgraded to: v${VERSION}`);
  console.log('Your memory, decisions, and project context were preserved.');
  console.log('');
  process.exit(0);
}

// ─── Unknown command ──────────────────────────────────────────────────────────

console.log('');
console.log(`buildflow-pro: unknown command '${command}'`);
console.log("Run 'npx buildflow-pro --help' for usage.");
console.log('');
process.exit(1);
